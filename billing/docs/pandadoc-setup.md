# PandaDoc API setup — Peacemakers billing

Draft agreements only. Never send until dual approval (`APPROVE_SEND_PANDADOC`).

## 1. Create an API key

1. Sign in to [PandaDoc](https://app.pandadoc.com).
2. Open **Settings → Integrations / Developers → API** (or [Dev Center → Configuration](https://app.pandadoc.com/a/#/settings/api-dashboard)).
3. Create an **API key** (production workspace for live client docs; use sandbox only for experiments).
4. Copy the key once. Do **not** commit it.

## 2. Store the key locally

```bash
# From the repository root:
cp billing/.env.example billing/.env   # if missing
# Edit billing/.env and set:
# PANDADOC_API_KEY=your_key_here
```

Or for this shell session only:

```bash
export PANDADOC_API_KEY='your_key_here'
```

`billing/.env` is gitignored.

## 3. Verify the connection

```bash
python3 billing/scripts/pandadoc_verify.py
```

Success prints your workspace templates (or an empty list) and `ok`.

## 4. Two ways to create drafts

### A) Upload a finished DOCX/PDF

Use when ChatGPT (or you) already wrote the agreement file. Pass the local DOCX/PDF and recipient from the approved packet — do not hard-code a live client.

```bash
python3 billing/scripts/upload_pandadoc_draft.py \
  path/to/agreement.docx \
  --name "Business Blueprint Agreement — Example Client" \
  --recipient-email alex@example.com \
  --recipient-first Alex \
  --recipient-last Rivera \
  --client-dir billing/clients/example-client
```

Then open the printed PandaDoc URL → add signature / date fields → leave as **draft**.

### B) Create from a PandaDoc template (repeatable)

1. In PandaDoc, open a template → copy **Template UUID** from the URL or template settings.
2. ```bash
   cp billing/pandadoc-templates.example.json billing/pandadoc-templates.json
   ```
3. Replace `REPLACE_ME` with real UUIDs (e.g. `consulting_sow`).
4. Set `"agreement_template": "consulting_sow"` on the invoice packet.
5. ```bash
   python3 billing/scripts/create_pandadoc_draft.py --latest --dry-run
   python3 billing/scripts/create_pandadoc_draft.py --latest
   ```

## 5. Send (only after you approve)

```bash
python3 billing/scripts/send_pandadoc.py <document_id> \
  --i-approve-send --confirm-phrase APPROVE_SEND_PANDADOC
```

## After setup

Once `PANDADOC_API_KEY` is set, upload or create a **draft only**. Do not send until dual approval (`APPROVE_SEND_PANDADOC`).
