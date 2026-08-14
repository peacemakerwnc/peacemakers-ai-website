"""Shared helpers for Peacemakers billing packet → draft invoice scripts."""

from __future__ import annotations

import json
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


BRAND = "Peacemakers AI Solutions"


def billing_root() -> Path:
    return Path(__file__).resolve().parents[1]


def catalog_path() -> Path:
    return billing_root() / "stripe-catalog.json"


def schema_path() -> Path:
    return billing_root() / "schema" / "invoice-packet.schema.json"


def inbox_dir() -> Path:
    return billing_root() / "inbox"


def clients_dir() -> Path:
    return billing_root() / "clients"


def processed_index_path() -> Path:
    return billing_root() / "clients" / "_processed_idempotency.json"


def load_catalog() -> dict[str, Any]:
    return json.loads(catalog_path().read_text(encoding="utf-8"))


def cents_to_dollars_str(cents: int) -> str:
    dollars = cents / 100
    if dollars == int(dollars):
        return f"{int(dollars):,}"
    return f"{dollars:,.2f}"


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:80] or "client"


def client_slug_for(packet: dict[str, Any]) -> str:
    if packet.get("client_slug"):
        return slugify(str(packet["client_slug"]))
    company = packet.get("company") or ""
    base = company.strip() or str(packet.get("client_name") or "client")
    return slugify(base)


def load_processed_index() -> dict[str, Any]:
    path = processed_index_path()
    if not path.exists():
        return {"keys": {}}
    return json.loads(path.read_text(encoding="utf-8"))


def record_processed(idempotency_key: str, record: dict[str, Any]) -> None:
    path = processed_index_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    data = load_processed_index()
    data.setdefault("keys", {})[idempotency_key] = record
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def find_processed(idempotency_key: str) -> dict[str, Any] | None:
    return load_processed_index().get("keys", {}).get(idempotency_key)


def _catalog_walk(catalog: dict[str, Any], path: list[str]) -> dict[str, Any]:
    node: Any = catalog
    for key in path:
        if not isinstance(node, dict) or key not in node:
            raise KeyError(f"Catalog path not found: {'.'.join(path)}")
        node = node[key]
    if not isinstance(node, dict):
        raise KeyError(f"Catalog path not an object: {'.'.join(path)}")
    return node


def resolve_bookdirect_sku(catalog: dict[str, Any], sku_meta: dict[str, Any]) -> dict[str, Any]:
    bd = sku_meta["bookdirect"]
    plan = int(bd["plan"])
    milestone = bd["milestone"]
    homes = int(bd.get("homes") or 1)
    entry = catalog["bookdirect"]["plans"][str(plan)]
    if plan == 1:
        key = "1" if homes <= 1 else "2-3"
        bundle = entry["setup_by_homes"][key]
        product = bundle[milestone]
        return {
            "sku_name": sku_meta["name"],
            "product_id": product["product_id"],
            "price_id": product["price_id"],
            "default_cents": product["default_cents"],
            "recurring": None,
            "plan": plan,
            "milestone": milestone,
        }
    product = entry[milestone]
    return {
        "sku_name": sku_meta["name"],
        "product_id": product["product_id"],
        "price_id": product["price_id"],
        "default_cents": product["default_cents"],
        "recurring": None,
        "plan": plan,
        "milestone": milestone,
    }


def resolve_sku(catalog: dict[str, Any], sku: str) -> dict[str, Any]:
    skus = catalog.get("skus") or {}
    if sku not in skus:
        raise KeyError(f"Unknown sku '{sku}'. Known: {', '.join(sorted(skus))}")
    meta = skus[sku]
    pricing_mode = meta.get("pricing_mode") or "fixed"
    if "bookdirect" in meta:
        resolved = resolve_bookdirect_sku(catalog, meta)
        resolved["pricing_mode"] = pricing_mode
        return resolved
    path = meta["catalog_path"]
    product = _catalog_walk(catalog, path)
    pricing_mode = product.get("pricing_mode") or pricing_mode
    default_cents = product.get("unit_amount_cents")
    return {
        "sku_name": meta["name"],
        "product_id": product["product_id"],
        "price_id": product.get("price_id"),
        "default_cents": int(default_cents) if default_cents is not None else None,
        "recurring": product.get("recurring"),
        "pricing_mode": pricing_mode,
        "plan": None,
        "milestone": None,
    }


def validate_packet(packet: dict[str, Any], *, require_sku_in_catalog: bool = True) -> list[str]:
    """Lightweight validation (no jsonschema dependency). Returns error strings."""
    errors: list[str] = []
    required = [
        "client_name",
        "email",
        "sku",
        "invoice_title",
        "line_description",
        "idempotency_key",
        "source",
        "created_at",
    ]
    for key in required:
        if not packet.get(key):
            errors.append(f"Missing required field: {key}")

    if packet.get("email") and "@" not in str(packet["email"]):
        errors.append("email looks invalid")

    if packet.get("source") and packet["source"] not in {"chatgpt", "cursor", "manual"}:
        errors.append("source must be chatgpt|cursor|manual")

    key = packet.get("idempotency_key")
    if key and not (8 <= len(str(key)) <= 128):
        errors.append("idempotency_key must be 8–128 characters")

    if packet.get("currency") not in (None, "usd"):
        errors.append("currency must be usd")

    days = packet.get("days_until_due")
    if days is not None:
        try:
            days_i = int(days)
            if not 1 <= days_i <= 90:
                errors.append("days_until_due must be 1–90")
        except (TypeError, ValueError):
            errors.append("days_until_due must be an integer")

    resolved = None
    if require_sku_in_catalog and packet.get("sku"):
        try:
            resolved = resolve_sku(load_catalog(), str(packet["sku"]))
        except KeyError as exc:
            errors.append(str(exc))

    override = packet.get("amount_override_cents")
    amount = packet.get("amount_cents")
    if override is not None and amount is not None and int(override) != int(amount):
        errors.append("amount_cents must equal amount_override_cents when both set")

    if resolved and resolved.get("pricing_mode") == "custom_quote":
        quoted = override if override is not None else amount
        if quoted is None:
            errors.append(
                f"sku '{packet.get('sku')}' is custom_quote — set amount_cents "
                "(or amount_override_cents) to the agreed quote"
            )

    return errors


def normalize_packet(packet: dict[str, Any]) -> dict[str, Any]:
    out = dict(packet)
    out.setdefault("currency", "usd")
    out.setdefault("days_until_due", 7)
    out.setdefault("agreement_template", None)
    out.setdefault("company", None)
    out.setdefault("memo", None)
    if not out.get("created_at"):
        out["created_at"] = datetime.now(timezone.utc).isoformat()
    return out


def resolve_amount_and_product(packet: dict[str, Any], catalog: dict[str, Any]) -> dict[str, Any]:
    resolved = resolve_sku(catalog, str(packet["sku"]))
    product_id = packet.get("product_id") or resolved["product_id"]
    price_id = packet.get("price_id") or resolved.get("price_id")
    default_cents = resolved.get("default_cents")
    pricing_mode = resolved.get("pricing_mode") or "fixed"

    if packet.get("amount_override_cents") is not None:
        amount = int(packet["amount_override_cents"])
        override = True
    elif packet.get("amount_cents") is not None:
        amount = int(packet["amount_cents"])
        override = default_cents is None or amount != int(default_cents)
    elif pricing_mode == "custom_quote":
        raise ValueError(
            f"sku '{packet['sku']}' requires amount_cents (custom quote — no fixed catalog price)"
        )
    elif default_cents is None:
        raise ValueError(f"sku '{packet['sku']}' has no catalog amount; set amount_cents")
    else:
        amount = int(default_cents)
        override = False

    # Custom quotes always invoice by amount (not a fixed Stripe Price object)
    if pricing_mode == "custom_quote":
        override = True

    return {
        **resolved,
        "product_id": product_id,
        "price_id": price_id,
        "amount_cents": amount,
        "default_cents": default_cents,
        "override": override,
        "pricing_mode": pricing_mode,
    }


def append_status(client_dir: Path, lines: list[str]) -> None:
    client_dir.mkdir(parents=True, exist_ok=True)
    status = client_dir / "status.md"
    marker = "## Script updates"
    new_lines = [ln for ln in lines if ln.strip()]
    if status.exists():
        existing = status.read_text(encoding="utf-8")
        if marker in existing:
            before, _, after = existing.partition(marker)
            prior = [
                ln
                for ln in after.splitlines()
                if ln.startswith("- ") and ln not in new_lines
            ]
            new_prefixes = {ln.split(":", 1)[0] for ln in new_lines if ":" in ln}
            prior = [ln for ln in prior if ln.split(":", 1)[0] not in new_prefixes]
            merged = prior + new_lines
            status.write_text(
                before.rstrip() + f"\n\n{marker}\n\n" + "\n".join(merged) + "\n",
                encoding="utf-8",
            )
        else:
            status.write_text(
                existing.rstrip() + f"\n\n{marker}\n\n" + "\n".join(new_lines) + "\n",
                encoding="utf-8",
            )
    else:
        status.write_text(
            f"# Status — {client_dir.name}\n\nBrand: {BRAND}\n\n{marker}\n\n"
            + "\n".join(new_lines)
            + "\n",
            encoding="utf-8",
        )


def list_inbox_packets() -> list[Path]:
    inbox = inbox_dir()
    if not inbox.exists():
        return []
    return sorted(
        [p for p in inbox.glob("*.json") if p.is_file()],
        key=lambda p: p.stat().st_mtime,
    )


def latest_inbox_packet() -> Path | None:
    packets = list_inbox_packets()
    return packets[-1] if packets else None


def load_packet(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"Packet must be a JSON object: {path}")
    return normalize_packet(data)


def write_inbox_packet(packet: dict[str, Any]) -> Path:
    packet = normalize_packet(packet)
    errors = validate_packet(packet)
    if errors:
        raise ValueError("; ".join(errors))

    # Duplicate check in inbox
    for existing in list_inbox_packets():
        try:
            other = json.loads(existing.read_text(encoding="utf-8"))
            if other.get("idempotency_key") == packet["idempotency_key"]:
                raise FileExistsError(
                    f"Duplicate idempotency_key already in inbox: {existing.name}"
                )
        except (json.JSONDecodeError, OSError):
            continue

    inbox = inbox_dir()
    inbox.mkdir(parents=True, exist_ok=True)
    slug = client_slug_for(packet)
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    path = inbox / f"{ts}-{slug}.json"
    path.write_text(json.dumps(packet, indent=2) + "\n", encoding="utf-8")
    return path
