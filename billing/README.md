# Peacemakers billing — sealed packet → draft invoice

Automates **draft** Stripe invoices (and optional PandaDoc drafts) for **Peacemakers AI Solutions**, starting with the **AI Opportunity Blueprint ($3,500)**. Implementation work uses **custom quotes** only (`amount_cents` required). ChatGPT never reads your Cursor repo; it only posts a sealed JSON packet to a write-only inbox.

```
ChatGPT Custom GPT  --POST-->  inbox server  -->  billing/inbox/*.json
                                                      |
                                              Cursor draft skill
                                                      |
                                    Stripe draft (+ optional PandaDoc draft)
                                                      |
                                              You review + dual-approve send
```

## Hard rules

- Drafts only until you dual-approve send.
- No auto-send from ChatGPT or Cursor draft skill.
- Branding logo/colors: Stripe Dashboard (see [docs/stripe-branding-checklist.md](./docs/stripe-branding-checklist.md)).

## Quick start (paste path)

```bash
# 1) Drop a packet into the inbox
python3 billing/scripts/ingest_packet.py billing/docs/examples/blueprint-packet.example.json

# 2) Dry-run then create Stripe draft
export STRIPE_API_KEY=rk_live_...   # or sk_test_...
pip install -r billing/scripts/requirements.txt
python3 billing/scripts/create_draft_invoice_from_packet.py --latest --dry-run
python3 billing/scripts/create_draft_invoice_from_packet.py --latest

# 3) Optional PandaDoc (only if agreement_template set)
# cp billing/pandadoc-templates.example.json billing/pandadoc-templates.json
# export PANDADOC_API_KEY=...
# python3 billing/scripts/create_pandadoc_draft.py --latest
```

## ChatGPT push (write-only)

1. Create a Custom GPT with instructions from [docs/chatgpt-custom-gpt-prompt.md](./docs/chatgpt-custom-gpt-prompt.md).
2. Add an Action using [docs/chatgpt-action-openapi.yaml](./docs/chatgpt-action-openapi.yaml).
3. Run the local inbox (and a tunnel if ChatGPT must reach it):

```bash
export INBOX_SECRET="$(openssl rand -hex 24)"
python3 billing/scripts/inbox_server.py --port 8787
# tunnel https://… → http://127.0.0.1:8787
# Set Action auth header X-Inbox-Secret to the same value
```

The Action only `POST /invoice-packet`. No list/read of files.

## Send (dual approval)

```bash
python3 billing/scripts/send_draft_invoice.py in_xxx \
  --i-approve-send --confirm-phrase APPROVE_SEND_INVOICE

python3 billing/scripts/send_pandadoc.py doc_xxx \
  --i-approve-send --confirm-phrase APPROVE_SEND_PANDADOC
```

## Cursor skills

- `peacemakers-invoice-draft` — process inbox → drafts
- `peacemakers-invoice-send` — send only after dual approval

These helpers currently live under `.cursor/skills/` (gitignored by `.cursor/*` except rules). They are local Cursor prompts, not a second billing system. Recreate from this README and script `--help` on a new workstation until a gitignore exception is approved.

## Layout

| Path | Purpose |
|------|---------|
| `schema/invoice-packet.schema.json` | Packet contract |
| `stripe-catalog.json` | SKUs + Stripe product/price ids |
| `inbox/` | Sealed packets (gitignored `*.json`) |
| `clients/<slug>/` | Status + last packet audit |
| `scripts/` | Ingest, inbox server, Stripe/PandaDoc draft + send |
| `pandadoc-templates.example.json` | Copy → `pandadoc-templates.json` |
