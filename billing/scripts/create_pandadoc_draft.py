#!/usr/bin/env python3
"""Create a PandaDoc DRAFT from a sealed packet (optional).

Skips when agreement_template is null/empty.
Never sends. Refuses --send.

Requires:
  export PANDADOC_API_KEY=...
  billing/pandadoc-templates.json with template uuid per key

Usage:
  python3 billing/scripts/create_pandadoc_draft.py --latest --dry-run
  python3 billing/scripts/create_pandadoc_draft.py --latest
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from packet_lib import (  # noqa: E402
    BRAND,
    append_status,
    billing_root,
    client_slug_for,
    clients_dir,
    latest_inbox_packet,
    load_packet,
    validate_packet,
)

PANDADOC_API = "https://api.pandadoc.com/public/v1"


def load_dotenv() -> None:
    env_path = billing_root() / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip("'").strip('"')
        if key and key not in os.environ:
            os.environ[key] = val


def die(msg: str, code: int = 1) -> None:
    print(f"error: {msg}", file=sys.stderr)
    raise SystemExit(code)


def load_templates() -> dict:
    path = billing_root() / "pandadoc-templates.json"
    if not path.exists():
        die(f"Missing {path} — copy from pandadoc-templates.example.json and add template IDs")
    return json.loads(path.read_text(encoding="utf-8"))


def api_request(method: str, path: str, api_key: str, body: dict | None = None) -> dict:
    url = f"{PANDADOC_API}{path}"
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"API-Key {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        die(f"PandaDoc HTTP {exc.code}: {detail}")


def main() -> None:
    load_dotenv()
    parser = argparse.ArgumentParser(description="Create a PandaDoc draft from a packet.")
    parser.add_argument("packet", nargs="?", type=Path)
    parser.add_argument("--latest", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--send", action="store_true", help="Forbidden — always rejected")
    args = parser.parse_args()

    if args.send:
        die("Refusing to send PandaDoc. Drafts only. Approve send separately.")

    packet_path: Path | None = args.packet
    if args.latest:
        packet_path = latest_inbox_packet()
        if not packet_path:
            die("No packets in billing/inbox/")
    if not packet_path:
        die("Provide a packet path or --latest")

    packet = load_packet(packet_path)
    errors = validate_packet(packet, require_sku_in_catalog=False)
    if errors:
        die("; ".join(errors))

    template_key = packet.get("agreement_template")
    if not template_key:
        print("agreement_template is null/empty — skipping PandaDoc (OK for Blueprint-only).")
        return

    templates = load_templates()
    entry = (templates.get("templates") or {}).get(str(template_key))
    if not entry or not entry.get("template_uuid"):
        die(
            f"Unknown agreement_template '{template_key}'. "
            f"Configure it in billing/pandadoc-templates.json"
        )

    template_uuid = entry["template_uuid"]
    name = (
        entry.get("name_prefix")
        or f"{BRAND} Agreement"
    ) + f" — {packet.get('company') or packet['client_name']}"

    # Merge tokens: defaults + packet agreement_fields + core identity
    tokens = dict(entry.get("default_fields") or {})
    tokens.update(packet.get("agreement_fields") or {})
    tokens.setdefault("Client.Name", packet["client_name"])
    tokens.setdefault("Client.Email", packet["email"])
    if packet.get("company"):
        tokens.setdefault("Client.Company", packet["company"])
    tokens.setdefault("Provider.Brand", BRAND)

    fields = [{"name": k, "value": v} for k, v in tokens.items() if v is not None]

    recipients = [
        {
            "email": packet["email"],
            "first_name": str(packet["client_name"]).split()[0],
            "last_name": " ".join(str(packet["client_name"]).split()[1:]) or packet["client_name"],
            "role": entry.get("signer_role") or "Client",
        }
    ]

    print("Planned PandaDoc draft")
    print(f"  brand:     {BRAND}")
    print(f"  template:  {template_key} ({template_uuid})")
    print(f"  name:      {name}")
    print(f"  recipient: {packet['email']}")
    print(f"  fields:    {len(fields)}")
    print("  status:    draft only (will not send)")

    if args.dry_run:
        print("\nDry run — no PandaDoc API calls.")
        return

    api_key = os.environ.get("PANDADOC_API_KEY")
    if not api_key:
        die("Set PANDADOC_API_KEY in the environment")

    body = {
        "name": name,
        "template_uuid": template_uuid,
        "recipients": recipients,
        "tokens": [{"name": f["name"], "value": str(f["value"])} for f in fields],
        "metadata": {
            "brand": BRAND,
            "sku": str(packet.get("sku") or ""),
            "idempotency_key": str(packet.get("idempotency_key") or ""),
            "source": "peacemakers-billing",
        },
        "tags": ["peacemakers", "draft", str(packet.get("sku") or "packet")],
    }

    created = api_request("POST", "/documents", api_key, body)
    doc_id = created.get("id") or created.get("uuid")
    if not doc_id:
        die(f"Unexpected PandaDoc response: {created}")

    # Document is created as uploaded/draft. Do NOT call send-document.
    review_url = f"https://app.pandadoc.com/a/#/documents/{doc_id}"
    print(f"\nCreated PandaDoc DRAFT {doc_id}")
    print(f"Review: {review_url}")
    print("Stop here — do not send until explicit dual approval.")

    slug = client_slug_for(packet)
    append_status(
        clients_dir() / slug,
        [
            f"- PandaDoc document ID: {doc_id}",
            f"- PandaDoc: {review_url}",
            f"- PandaDoc template: {template_key}",
            f"- PandaDoc status: draft (not sent)",
        ],
    )


if __name__ == "__main__":
    main()
