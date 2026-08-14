# Stripe branding checklist — Peacemakers AI Solutions

Account-level branding (logo, colors, business name) is **not** set by draft scripts. Scripts fill customer, line items, description, footer/memo, custom fields, and metadata. Confirm this once in the Stripe Dashboard, then spot-check on every first draft for a new engagement.

## Dashboard checklist

1. Open [Stripe Branding settings](https://dashboard.stripe.com/account/branding) (live mode for live invoices).  
   Related: [Invoice settings](https://dashboard.stripe.com/settings/billing/invoice) for defaults / payment terms.
2. **Business name / statement descriptor** reflects **Peacemakers AI Solutions** (or your legal entity name clients should see).
3. **Icon + Logo** uploaded (icon on hosted invoice/emails; logo on PDFs where Stripe uses it).
4. **Brand / accent colors** match peacemakersai.com (avoid generic purple defaults).
5. **Public business information** / support email: prefer `james@peacemakersai.com` (or ops inbox you monitor).
6. **Customer emails** — invoice emails enabled; reply-to correct.
7. Create one **test or low-stakes draft** via:
   ```bash
   python3 billing/scripts/ingest_packet.py billing/docs/examples/blueprint-packet.example.json
   python3 billing/scripts/create_draft_invoice_from_packet.py --latest --dry-run
   # then without --dry-run when ready
   ```
8. Open the draft in Dashboard → preview hosted invoice → confirm logo, brand name, memo, and line copy.
9. **Do not send** the test to a real client unless intentional; delete or void test drafts as needed.

## What packets control vs account branding

| Controlled by packet / script | Controlled by Stripe account branding |
|-------------------------------|----------------------------------------|
| Customer name / email | Logo |
| Invoice title (`description`) | Brand colors |
| Line item description | Business name on receipt/email chrome |
| Footer / memo | Email template shell |
| Custom fields (incl. Brand) | Support/contact defaults |
| Due days, amount, product | |

## Related

- Catalog: [stripe-catalog.json](../stripe-catalog.json)
- Draft / send workflow: [README.md](../README.md) (Cursor skills are local; dual-approve send via `send_draft_invoice.py`)
