# Blueprint Artifact Handling & Client Data Governance

**Audience:** James (owner operator)  
**Use:** First 1–3 paying Business Blueprint clients  
**Type:** Operating standard — security, privacy, file handling  
**Not:** A DMS, schema, RAG, MCP, storage platform, or new security doctrine  

**Failure mode this prevents:** Validated Stage A/B exists only in ChatGPT and is lost or unfindable when the client Blueprint is due (Harbor Ridge acceptance block).

**Compatible:** OS `pm-os-0.1.0` · Advisor `blueprint-advisor-0.1.2` · [Owner Operating Runbook](./PEACEMAKERS_OWNER_OPERATING_RUNBOOK.md)

Deeper OS / pilot detail stays in:

- [peacemakers-operating-system/](./peacemakers-operating-system/) — evidence, AI governance, agent security, human approval  
- [production-readiness/retention-deletion.md](./production-readiness/retention-deletion.md) — Owner-Ops retention/deletion  
- [OBSERVABILITY_EVENT_MODEL.md](./peacemakers-operating-system/OBSERVABILITY_EVENT_MODEL.md) — what must not enter logs  

---

## Practical classification (map to OS; do not invent a competing model)

| Class | Examples | Default handling |
|-------|----------|------------------|
| **PUBLIC / SANITIZED** | Templates, methodology, fictional acceptance fixtures, marketing | Git-eligible when appropriate |
| **INTERNAL PEACEMAKERS** | Runbooks, checklists, non-client planning | Git-eligible when appropriate |
| **CLIENT CONFIDENTIAL** | Questionnaire, transcript/notes, Stage A/B, client Blueprint HTML/PDF, evidence, screenshots, workflow detail, contacts | **Do not commit to Git** · store in approved private engagement location · minimize before AI |
| **HIGHLY SENSITIVE / RESTRICTED** | Credentials, secrets, tokens, bank/payment details, card data, unnecessary PII, regulated data, private keys, `.env` | **Never in Git** · **never in ChatGPT** · do not duplicate · do not retain in engagement folders |

If an OS rule is stricter, follow the OS.

---

## Core rules (always)

### 1 — Git is not the client document repository

**Git stores:** methodology, code, skills, templates, sanitized/fictional acceptance fixtures.

**Git does not store by default:** real questionnaires, transcripts, Stage A/B, evidence, screenshots, financial exports, signed agreements, real client Blueprint PDFs.

Private repo ≠ safe client DMS.

### 2 — Never store credentials in engagement artifacts

No passwords, API keys, OAuth/session tokens, DB passwords, invitation tokens, Stripe/PandaDoc/Resend secrets, private keys, or `.env` contents in filenames, reports, screenshots, or folders.

### 3 — Minimize data

Prefer redacted samples, summaries, screen-share, ID references, or field-limited exports over full populations.

### 4 — Least exposure for AI

Before ChatGPT (or any generative AI):

- [ ] Client / Peacemakers policy permits it  
- [ ] Unnecessary PII / financial data removed  
- [ ] Secrets absent  
- [ ] Only relevant evidence supplied  
- [ ] Human review remains required  

If the client forbids generative AI on client/financial data → do **not** upload it. Use redacted excerpts, approved summaries, screen-share, or local/manual analysis.

### 5 — Preserve source integrity

Do not alter source evidence to fit the analysis. Redacted copies must be labeled **REDACTED** — never presented as the original.

### 6 — Human approval before external send

James reviews before PandaDoc send, Stripe send, questionnaire invite, evidence request, Blueprint PDF send, or implementation proposal send.

---

## Minimum durable artifact set (every completed paid Blueprint)

| # | Logical artifact | Authoritative home |
|---|------------------|--------------------|
| 1 | Questionnaire source / export / Owner-Ops reference | Owner-Ops (submitted) + optional private export |
| 2 | Stage A — approved Markdown | **Private engagement folder** (required durable copy) |
| 3 | Evidence request / evidence index | Private folder + Owner-Ops note/activity |
| 4 | Call transcript or approved notes | Private folder (minimize secrets) |
| 5 | Stage B — approved Markdown | **Private engagement folder** (required durable copy) |
| 6 | Client Blueprint source (HTML/MD) | Private folder |
| 7 | Final client Blueprint PDF | Private folder |
| 8 | Delivery / review record | Owner-Ops activity |
| 9 | Client decision (A/B/C) | Owner-Ops activity |
| 10 | Implementation interest (if any) | Owner-Ops activity |

**Commercial SoR (do not duplicate unnecessarily):**

| System | Stores |
|--------|--------|
| **PandaDoc** | Agreement / signature |
| **Stripe** | Invoice / payment |

Owner-Ops stores **references / IDs / status confirmations**, not full confidential document copies by default.

---

## Canonical storage decision (first 1–3 clients)

| Location | Role | Status |
|----------|------|--------|
| Git `owner-ops/` | Code, OS, skills, templates, sanitized acceptance | **ACCEPTABLE NOW** |
| `owner-ops/docs/acceptance/` | Fictional/sanitized fixtures only | **ACCEPTABLE NOW** (must be marked fictional) |
| Owner-Ops DB | Questionnaire, activities, evidence notes, statuses | **ACCEPTABLE NOW** (paste-first; uploads disabled in pilot) |
| Owner-Ops `/storage/**` | Local attachments if ever enabled | **Not durable** for pilot prod — do not rely on it |
| **Private Peacemakers engagement store** (outside Git) | Real CLIENT CONFIDENTIAL Stage A/B, transcripts, client PDFs | **CANONICAL PRIVATE ENGAGEMENT STORE — OWNER APPROVED** |
| New DMS / S3 / RAG / vendor | — | **DEFER** until burden proves need |

### Approved private platform

**Platform:** Google Workspace Drive (Peacemakers-controlled business account)  
**Status:** `CANONICAL PRIVATE ENGAGEMENT STORE — OWNER APPROVED`  
**Canonical root:** [Peacemakers Clients Drive folder](https://drive.google.com/drive/u/2/folders/1B1e3Qh8LOqiaJG0SRb044p2T8Dn6eriC) (folder id `1B1e3Qh8LOqiaJG0SRb044p2T8Dn6eriC`)

Open only while signed into the Peacemakers Google Workspace business account. Do not convert engagement folders to anonymous/public link sharing. Do not paste passwords, tokens, or credentials into this SOP or Owner-Ops.

### Engagement path convention

Under the approved root:

```text
Clients / <Client Name> / Business Blueprint /
  01 Intake
  02 Stage A
  03 Blueprint Call
  04 Stage B
  05 Client Blueprint
  06 Decision
```

(Optional later: `07 Implementation` only for Outcome C.) Keep folder names free of secrets.

### Required controls (this store)

- Private by default; Peacemakers-controlled business account  
- No anonymous/public sharing of engagement folders  
- Access only by explicit business need  
- Version/recovery capability of Google Drive available  
- Stage A saved here **same day** after James approval  
- Stage B saved here **same day** after James approval  
- Transcript/evidence stored here only when appropriate (minimized/redacted)  
- Secrets/credentials prohibited in files and filenames  
- `Downloads/` / Desktop / ChatGPT history are **staging only** — not canonical  
- Owner-Ops records status/reference (Activity/Note acceptable); not uncontrolled duplicate file dumps  
- Git remains for code, methodology, templates, and sanitized fictional material only  

### Owner-Ops reference practice (manual)

No schema change. After saving Stage A or Stage B to the canonical private folder, record an Activity/Note such as:

`Stage A approved and stored in canonical private engagement folder.`  
`Stage B approved and stored in canonical private engagement folder.`

Include client/engagement identifiers and folder path labels (e.g. `Clients / Acme / Business Blueprint / 04 Stage B`). Do **not** store credentials or public sharing URLs in the note.

### Naming

```text
YYYY-MM-DD__<client-slug>__stage-a.md
YYYY-MM-DD__<client-slug>__stage-b.md
YYYY-MM-DD__<client-slug>__blueprint-call-notes.md
YYYY-MM-DD__<client-slug>__evidence-index.md
AI-Opportunity-Blueprint — <Company Name> — YYYY-MM-DD.html
AI-Opportunity-Blueprint — <Company Name> — YYYY-MM-DD.pdf
```

Redacted copies: append `__REDACTED` before the extension.

---

## Persist Stage A / Stage B immediately (mandatory)

ChatGPT is an **execution surface**, not durable storage.

After each Advisor run that James accepts:

1. Export / copy the full Markdown from ChatGPT.  
2. Save under the engagement’s Stage A or Stage B folder with the naming convention **the same day**.  
3. Add an Owner-Ops activity: `Stage A saved` or `Stage B saved` + private path (not the file body).  
4. Only then proceed to evidence request (after A) or client Blueprint fill (after B).

**Hard stop:** Do not start client Blueprint assembly if Stage B is missing from the private engagement folder.

Fictional/sanitized rehearsals may also be copied under `owner-ops/docs/acceptance/` when explicitly marked fictional — that does **not** replace private storage for real clients.

---

## Evidence handling (first clients)

- Prefer screen-share + notes over retaining full exports.  
- If retaining samples: redact, bound the sample, label REDACTED.  
- Owner-Ops: paste-first evidence notes; production uploads remain disabled (`DISABLE_CLIENT_UPLOADS=true`) unless separately authorized.  
- See OS [EVIDENCE_STANDARD.md](./peacemakers-operating-system/EVIDENCE_STANDARD.md) for classification of findings — do not restate the taxonomy here.

---

## Retention (pointer)

- Follow [retention-deletion.md](./production-readiness/retention-deletion.md) for Owner-Ops company-scoped data.  
- Private engagement folders: retain for the engagement + ordinary business record need (pilot target ~365 days after close unless James records a longer obligation).  
- Do not silently delete submitted client work.  
- When deleting: remove private folder copies and run Owner-Ops deletion procedure if the company record should be purged; remember backups may retain history.

---

## Git hygiene

| Path pattern | Intent |
|--------------|--------|
| `owner-ops/docs/acceptance/**` | Sanitized/fictional only (may be tracked when authorized) |
| `owner-ops/docs/deliverables/**` | Templates / samples |
| `billing/clients/**` | Local billing packets — ignored; `README.md` trackable |
| `bookdirect/docs/clients/*` | Local onboarding packets — ignored; `README.md` + `_template/` trackable |
| Designated private engagement root | **Google Workspace Drive** (outside repo) — canonical real-client store |

Before any commit touching docs or clients paths: confirm no CLIENT CONFIDENTIAL or HIGHLY SENSITIVE material is staged (`git status` / `git diff --cached`).

---

## Quick checklist — end of each Blueprint phase

| Phase | Durable action |
|-------|----------------|
| Commercial gate | Owner-Ops checkpoint + PandaDoc/Stripe IDs (not full docs) |
| Questionnaire SUBMITTED | Owner-Ops SoR; optional private export to `01-intake/` |
| Stage A approved | **Save MD same day** → Stage A folder + activity |
| Call complete | Notes/transcript → Blueprint Call folder |
| Stage B approved | **Save MD same day** → Stage B folder + activity |
| Client PDF approved | HTML + PDF → Client Blueprint folder |
| Decision | Owner-Ops + optional Decision folder |

---

## Related

| Doc | Classification |
|-----|----------------|
| [PEACEMAKERS_OWNER_OPERATING_RUNBOOK.md](./PEACEMAKERS_OWNER_OPERATING_RUNBOOK.md) | Procedure — links here for persist rules |
| [BLUEPRINT_COMMERCIAL_GATE_CHECKLIST.md](./BLUEPRINT_COMMERCIAL_GATE_CHECKLIST.md) | KEEP SEPARATE |
| [deliverables/README.md](./deliverables/README.md) | Templates |
| [production-readiness/retention-deletion.md](./production-readiness/retention-deletion.md) | KEEP SEPARATE — Owner-Ops deletion |
| [production-readiness/incident-response.md](./production-readiness/incident-response.md) | KEEP SEPARATE — incidents |
