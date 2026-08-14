#!/usr/bin/env python3
"""Send a PandaDoc document — dual approval required.

Usage:
  python3 billing/scripts/send_pandadoc.py <document_id> \\
    --i-approve-send --confirm-phrase APPROVE_SEND_PANDADOC
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request

from pathlib import Path

CONFIRM_PHRASE = "APPROVE_SEND_PANDADOC"
PANDADOC_API = "https://api.pandadoc.com/public/v1"


def load_dotenv() -> None:
    env_path = Path(__file__).resolve().parents[1] / ".env"
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
    parser = argparse.ArgumentParser(description="Send a PandaDoc document after dual approval.")
    parser.add_argument("document_id")
    parser.add_argument("--i-approve-send", action="store_true")
    parser.add_argument("--confirm-phrase", type=str, default="")
    args = parser.parse_args()

    if not args.i_approve_send:
        die("Refusing: pass --i-approve-send as the first approval.")
    if args.confirm_phrase != CONFIRM_PHRASE:
        die(f'Refusing: --confirm-phrase must be exactly "{CONFIRM_PHRASE}".')

    api_key = os.environ.get("PANDADOC_API_KEY")
    if not api_key:
        die("Set PANDADOC_API_KEY in the environment")

    # Ensure document is in a sendable state (draft. → sent)
    result = api_request(
        "POST",
        f"/documents/{args.document_id}/send",
        api_key,
        {
            "message": (
                "Please review and sign this agreement. "
                "You’ll get the invoice in a separate Stripe email from Peacemakers AI Solutions."
            ),
            "silent": False,
        },
    )
    print(f"PandaDoc send requested for {args.document_id}")
    print(json.dumps(result, indent=2) if result else "(empty response)")


if __name__ == "__main__":
    main()
