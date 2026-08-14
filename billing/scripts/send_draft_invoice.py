#!/usr/bin/env python3
"""Send a previously drafted Stripe invoice — dual approval required.

Hard rule: requires BOTH --i-approve-send AND --confirm-phrase APPROVE_SEND_INVOICE.
Never call this from ChatGPT automation. James only.

Usage:
  python3 billing/scripts/send_draft_invoice.py in_xxx \\
    --i-approve-send --confirm-phrase APPROVE_SEND_INVOICE
"""

from __future__ import annotations

import argparse
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from packet_lib import load_processed_index, processed_index_path  # noqa: E402


CONFIRM_PHRASE = "APPROVE_SEND_INVOICE"


def die(msg: str, code: int = 1) -> None:
    print(f"error: {msg}", file=sys.stderr)
    raise SystemExit(code)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Finalize and email a draft Stripe invoice after dual approval."
    )
    parser.add_argument("invoice_id", help="Stripe invoice id (in_...)")
    parser.add_argument(
        "--i-approve-send",
        action="store_true",
        help="First approval flag (required)",
    )
    parser.add_argument(
        "--confirm-phrase",
        type=str,
        default="",
        help=f'Must be exactly "{CONFIRM_PHRASE}"',
    )
    args = parser.parse_args()

    if not args.i_approve_send:
        die("Refusing: pass --i-approve-send as the first approval.")
    if args.confirm_phrase != CONFIRM_PHRASE:
        die(
            f'Refusing: --confirm-phrase must be exactly "{CONFIRM_PHRASE}" '
            "(second approval)."
        )

    api_key = os.environ.get("STRIPE_API_KEY") or os.environ.get("STRIPE_SECRET_KEY")
    if not api_key:
        die("Set STRIPE_API_KEY (or STRIPE_SECRET_KEY) in the environment")

    try:
        import stripe
    except ImportError:
        die("Install deps: pip install -r billing/scripts/requirements.txt")

    stripe.api_key = api_key

    invoice = stripe.Invoice.retrieve(args.invoice_id)
    if invoice.status != "draft":
        die(f"Invoice {args.invoice_id} status is '{invoice.status}', expected 'draft'")

    # Finalize then send (email with hosted invoice URL)
    finalized = stripe.Invoice.finalize_invoice(args.invoice_id)
    print(f"Finalized {finalized.id} status={finalized.status}")

    sent = stripe.Invoice.send_invoice(args.invoice_id)
    print(f"Sent {sent.id} status={sent.status}")
    if getattr(sent, "hosted_invoice_url", None):
        print(f"Hosted invoice URL: {sent.hosted_invoice_url}")
    if getattr(sent, "invoice_pdf", None):
        print(f"PDF: {sent.invoice_pdf}")

    # Update processed index if this invoice is known
    data = load_processed_index()
    updated = False
    for key, rec in list(data.get("keys", {}).items()):
        if rec.get("invoice_id") == args.invoice_id:
            rec["status"] = "sent"
            rec["sent_at"] = datetime.now(timezone.utc).isoformat()
            rec["hosted_invoice_url"] = getattr(sent, "hosted_invoice_url", None)
            data["keys"][key] = rec
            updated = True
    if updated:
        processed_index_path().write_text(
            __import__("json").dumps(data, indent=2) + "\n",
            encoding="utf-8",
        )
        print("Updated billing/clients/_processed_idempotency.json")

    print("Done. Client should receive the Stripe invoice email.")


if __name__ == "__main__":
    main()
