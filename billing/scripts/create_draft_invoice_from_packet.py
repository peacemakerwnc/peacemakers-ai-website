#!/usr/bin/env python3
"""Create a DRAFT Stripe invoice from a sealed billing inbox packet.

Hard rule: never finalize or send. Refuses --send / --finalize flags.

Usage:
  export STRIPE_API_KEY=rk_live_...   # or sk_test_... for test
  python3 billing/scripts/create_draft_invoice_from_packet.py --latest --dry-run
  python3 billing/scripts/create_draft_invoice_from_packet.py --latest
  python3 billing/scripts/create_draft_invoice_from_packet.py billing/inbox/<file>.json
"""

from __future__ import annotations

import argparse
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from packet_lib import (  # noqa: E402
    BRAND,
    append_status,
    cents_to_dollars_str,
    client_slug_for,
    clients_dir,
    find_processed,
    latest_inbox_packet,
    load_catalog,
    load_packet,
    record_processed,
    resolve_amount_and_product,
    validate_packet,
)


def die(msg: str, code: int = 1) -> None:
    print(f"error: {msg}", file=sys.stderr)
    raise SystemExit(code)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create a draft Stripe invoice from a sealed invoice packet."
    )
    parser.add_argument(
        "packet",
        nargs="?",
        type=Path,
        help="Path to packet JSON (or use --latest)",
    )
    parser.add_argument(
        "--latest",
        action="store_true",
        help="Use the most recent billing/inbox/*.json packet",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned invoice without calling Stripe",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Create even if idempotency_key was already processed",
    )
    parser.add_argument("--send", action="store_true", help="Forbidden — always rejected")
    parser.add_argument("--finalize", action="store_true", help="Forbidden — always rejected")
    args = parser.parse_args()

    if args.send or args.finalize:
        die(
            "Refusing to finalize or send. Create drafts only. "
            "Use peacemakers-invoice-send after explicit dual approval."
        )

    packet_path: Path | None = args.packet
    if args.latest:
        packet_path = latest_inbox_packet()
        if not packet_path:
            die("No packets in billing/inbox/")
    if not packet_path:
        die("Provide a packet path or --latest")
    if not packet_path.is_file():
        die(f"Not a file: {packet_path}")

    packet = load_packet(packet_path)
    errors = validate_packet(packet)
    if errors:
        die("; ".join(errors))

    prior = find_processed(str(packet["idempotency_key"]))
    if prior and not args.force:
        print("Idempotency hit — draft already created for this key:")
        print(json_dumps(prior))
        print("Use --force to create another draft.")
        return

    catalog = load_catalog()
    resolved = resolve_amount_and_product(packet, catalog)
    slug = client_slug_for(packet)
    days = int(packet.get("days_until_due") or 7)
    currency = str(packet.get("currency") or "usd")

    description = str(packet["invoice_title"]).strip()
    line_description = str(packet["line_description"]).strip()
    memo = packet.get("memo") or f"Thank you for working with {BRAND}."

    custom_fields = packet.get("custom_fields") or []
    # Always ensure brand is visible on the invoice custom fields if room
    field_names = {str(f.get("name", "")).lower() for f in custom_fields if isinstance(f, dict)}
    if "brand" not in field_names and len(custom_fields) < 4:
        custom_fields = list(custom_fields) + [{"name": "Brand", "value": BRAND}]

    print("Planned draft invoice")
    print(f"  brand:         {BRAND}")
    print(f"  packet:        {packet_path}")
    print(f"  client:        {packet['client_name']} <{packet['email']}>")
    if packet.get("company"):
        print(f"  company:       {packet['company']}")
    print(f"  slug:          {slug}")
    print(f"  sku:           {packet['sku']} — {resolved['sku_name']}")
    print(f"  pricing_mode:  {resolved.get('pricing_mode') or 'fixed'}")
    print(f"  amount:        ${cents_to_dollars_str(resolved['amount_cents'])} ({resolved['amount_cents']} cents)")
    if resolved.get("default_cents") is not None:
        print(f"  catalog:       ${cents_to_dollars_str(resolved['default_cents'])}")
    else:
        print("  catalog:       (custom quote — no fixed price)")
    print(f"  override:      {resolved['override']}")
    print(f"  product:       {resolved['product_id']}")
    print(f"  price:         {resolved.get('price_id') or '(amount-based line)'}")
    print(f"  due days:      {days}")
    print(f"  description:   {description}")
    print(f"  line:          {line_description}")
    print(f"  memo:          {memo}")
    print(f"  idempotency:   {packet['idempotency_key']}")
    print("  status:        draft only (will not finalize/send)")

    if args.dry_run:
        print("\nDry run — no Stripe API calls.")
        return

    api_key = os.environ.get("STRIPE_API_KEY") or os.environ.get("STRIPE_SECRET_KEY")
    if not api_key:
        die("Set STRIPE_API_KEY (or STRIPE_SECRET_KEY) in the environment")

    try:
        import stripe
    except ImportError:
        die("Install deps: pip install -r billing/scripts/requirements.txt")

    stripe.api_key = api_key

    customers = stripe.Customer.list(email=packet["email"], limit=1)
    if customers.data:
        customer = customers.data[0]
        print(f"\nUsing existing customer {customer.id}")
        # Keep name/company metadata current without wiping other fields
        stripe.Customer.modify(
            customer.id,
            name=packet["client_name"],
            metadata={
                **(customer.metadata or {}),
                "company": str(packet.get("company") or ""),
                "source": "peacemakers-billing",
                "brand": BRAND,
            },
        )
    else:
        customer = stripe.Customer.create(
            name=packet["client_name"],
            email=packet["email"],
            metadata={
                "company": str(packet.get("company") or ""),
                "source": "peacemakers-billing",
                "brand": BRAND,
                "sku": str(packet["sku"]),
            },
        )
        print(f"\nCreated customer {customer.id}")

    invoice_kwargs: dict = {
        "customer": customer.id,
        "collection_method": "send_invoice",
        "days_until_due": days,
        "auto_advance": False,
        "description": description,
        "footer": memo,
        "metadata": {
            "brand": BRAND,
            "sku": str(packet["sku"]),
            "source": str(packet.get("source") or "manual"),
            "idempotency_key": str(packet["idempotency_key"]),
            "packet_file": packet_path.name,
            "company": str(packet.get("company") or ""),
        },
    }
    if custom_fields:
        invoice_kwargs["custom_fields"] = [
            {"name": str(f["name"])[:40], "value": str(f["value"])[:140]}
            for f in custom_fields
            if isinstance(f, dict) and f.get("name") and f.get("value") is not None
        ][:4]

    invoice = stripe.Invoice.create(**invoice_kwargs)

    if not resolved["override"]:
        stripe.InvoiceItem.create(
            customer=customer.id,
            invoice=invoice.id,
            price=resolved["price_id"],
            description=line_description,
        )
    else:
        stripe.InvoiceItem.create(
            customer=customer.id,
            invoice=invoice.id,
            amount=resolved["amount_cents"],
            currency=currency,
            description=line_description,
            metadata={
                "product_id": resolved["product_id"],
                "sku": str(packet["sku"]),
                "override": "true",
            },
        )

    invoice = stripe.Invoice.retrieve(invoice.id)
    dashboard = f"https://dashboard.stripe.com/invoices/{invoice.id}"
    print(f"\nCreated DRAFT invoice {invoice.id}")
    print(f"Dashboard: {dashboard}")
    print("Stop here — do not finalize or email until explicit dual approval.")

    client_dir = clients_dir() / slug
    append_status(
        client_dir,
        [
            f"- Brand: {BRAND}",
            f"- Stripe customer ID: {customer.id}",
            f"- Draft invoice ID: {invoice.id}",
            f"- Draft invoice: {dashboard}",
            f"- SKU: {packet['sku']}",
            f"- Idempotency key: {packet['idempotency_key']}",
            f"- Packet: {packet_path.name}",
            f"- Amount: ${cents_to_dollars_str(resolved['amount_cents'])}",
            f"- Status: draft (not sent)",
        ],
    )

    # Save packet copy under client folder for audit
    client_dir.mkdir(parents=True, exist_ok=True)
    (client_dir / "last-packet.json").write_text(
        packet_path.read_text(encoding="utf-8"),
        encoding="utf-8",
    )

    record_processed(
        str(packet["idempotency_key"]),
        {
            "invoice_id": invoice.id,
            "customer_id": customer.id,
            "dashboard": dashboard,
            "slug": slug,
            "sku": packet["sku"],
            "amount_cents": resolved["amount_cents"],
            "packet": packet_path.name,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "draft",
        },
    )


def json_dumps(obj: dict) -> str:
    import json

    return json.dumps(obj, indent=2)


if __name__ == "__main__":
    main()
