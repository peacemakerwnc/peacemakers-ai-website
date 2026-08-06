# Owner actions required

Items the owner (James Fullen) must supply or approve before a real-client pilot send.  
**No secrets belong in this file** — only checklists and placeholders.

## Approvals (explicit yes required)

| # | Approval | Status |
|---|----------|--------|
| A1 | Create **Vercel** project for `owner-ops` (region `iad1`) | Pending |
| A2 | Create **Neon** production Postgres project (separate from any sandbox) | Pending |
| A3 | Optional Neon **non-prod** branch/DB for restore drills | Pending |
| A4 | Create **Resend** account + verify sending domain/address | Pending |
| A5 | Create **Upstash** Redis (REST) database | Pending |
| A6 | Optional **Sentry** project + DSN | Pending / optional |
| A7 | Accept estimated pilot spend band **~$0–40/mo** on free tiers (or approve paid upgrades) | Pending |
| A8 | Accept single-owner password auth **for this pilot only** | Pending |
| A9 | Accept `DISABLE_CLIENT_UPLOADS=true` (paste-first) | Pending |
| A10 | Accept privacy notice operational copy `pilot-2026-08-05` (legal review may still be needed later) | Pending |
| A11 | Final deliberate approval to send the **first real** invitation (after GO) | Pending — **blocked** until infra + rehearsal |

## Credentials to create and set (Vercel Production env)

Set in Vercel UI only — do not paste into git, chat, or this doc.

| Variable | Owner action |
|----------|----------------|
| `DATABASE_URL` | Neon connection string with SSL |
| `OWNER_EMAIL` / `OWNER_NAME` | Confirm production identity |
| `OWNER_PASSWORD` | Generate strong unique password (≥12); not the local/dev value |
| `SESSION_SECRET` | Generate ≥32-byte random secret; not `dev-only…` |
| `APP_BASE_URL` | Final `https://` deployment URL |
| `EMAIL_PROVIDER=resend` | Confirm |
| `RESEND_API_KEY` | From Resend |
| `EMAIL_FROM` | Verified sender string |
| `ALLOW_LOG_EMAIL_IN_PRODUCTION=false` | Confirm |
| `RATE_LIMIT_BACKEND=upstash` | Confirm |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | From Upstash |
| `DISABLE_CLIENT_UPLOADS=true` | Confirm |
| `SENTRY_DSN` | Optional |

## Operational confirmations after provision

| # | Action | Status |
|---|--------|--------|
| O1 | Run restoration test into **non-prod** ([backup-restoration.md](./backup-restoration.md)) | **BLOCKED** |
| O2 | Complete deployed fictional rehearsal (test inbox only) | **BLOCKED** |
| O3 | Fill quality-gate command results | Pending local run |
| O4 | Record GO / GO WITH CONDITIONS / NO-GO | Pending |
| O5 | Complete [pilot-operating-checklist.md](./pilot-operating-checklist.md) before real send | Pending |

## Explicitly not requested yet

- Phase 2 features
- Multi-user SSO
- Durable file storage / re-enabling uploads
- Finalizing/sending unrelated Stripe invoices or other products’ credentials
