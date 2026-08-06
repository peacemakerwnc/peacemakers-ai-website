# Phase 1.2C — External configuration plan (prepared; not executed)

**Status:** Plan only — Approval A is **COMPLETE**; **Approval B NOT AUTHORIZED**.  
**Date:** 2026-08-06  
**HEAD:** `b217964`  
**Note:** Do not execute this plan until the owner **separately** grants Approval B.

No Git connection, DNS, domain verification, env value injection into Vercel, deploy, migration, or email send has been performed.

---

## Exact proposed Approval B plan (do not execute in this run)

### NOT AUTHORIZED

When the owner separately grants Approval B, execute **only**:

### B1 — Git connection (required for normal Vercel deploys from this monorepo)

| Field | Proposed value |
|-------|----------------|
| Vercel project | `owner-ops-fictional-pilot` (`prj_6xdn2NcCszENxu7QEn8XFxbZYUYh`) |
| Git remote | `https://github.com/peacemakerwnc/peacemakers-ai-website.git` (confirm) |
| Production branch | `main` |
| Root Directory | `owner-ops` |
| Framework | Next.js (already set) |
| Build | `npm run build` |
| Install | default |
| Auto-deploy on push | **Deferred until publication safety + ignored-build / auto-deploy guard verified**; prefer **manual** until Approval C |
| Precondition | Git connection remains deferred until local publication review; no deploy in Approval B |

### B2 — Resend domain verification (required for Free custom From)

| Field | Proposed value |
|-------|----------------|
| Domains | **Exactly one** sending subdomain: `send.peacemakersai.com` |
| DNS provider | **Namecheap** |
| Records | **Only** the exact Resend-provided records for that sending subdomain |
| Existing email DNS | **Preserve** Google Workspace and other existing email DNS; **do not** overwrite or create a second conflicting SPF record |
| DNS change | **YES** — subdomain records only |
| App hostname DNS | **NO** if fictional rehearsal uses default `*.vercel.app` |
| Application sender var | **`EMAIL_FROM` only** — do **not** use `RESEND_FROM_EMAIL` or `RESEND_REPLY_TO_EMAIL` unless application code is separately changed and approved |

### B3 — Vercel Production env var **names** only (values in UI; never commit)

`DATABASE_URL`, `OWNER_EMAIL`, `OWNER_NAME`, `OWNER_PASSWORD`, `SESSION_SECRET`, `APP_BASE_URL`, `EMAIL_PROVIDER`, `RESEND_API_KEY`, `EMAIL_FROM`, `ALLOW_LOG_EMAIL_IN_PRODUCTION`, `RATE_LIMIT_BACKEND`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `DISABLE_CLIENT_UPLOADS`, optional expiry/review day vars, soft `STORAGE_ROOT`

Do **not** set `RESEND_FROM_EMAIL` or `RESEND_REPLY_TO_EMAIL`.

**Preview:** Production credentials must **not** be assigned to Preview. Keep Preview isolated; do not point at fictional pilot primary without explicit approval.

### Explicitly **not** part of Approval B

- Push of commits (Approval C)  
- Production deploy / migrate / seed (Approval C)  
- Sending email (Approval D)  
- Sentry  
- PAYG Upstash  
- Real-client data  

---

## DNS summary

| Change | Required for fictional rehearsal? |
|--------|-------------------------------------|
| Resend sending-domain DNS | **Yes** (for verified From) — Approval B |
| Custom Vercel production domain DNS | **No** if using `*.vercel.app` |
| Git connection | **Yes** for repo-based deploys — Approval B |

---

## Fail-closed reminder (pre-approval C)

Production must reject SQLite `file:` URLs, weak secrets, non-HTTPS `APP_BASE_URL`, log-email without escape hatch, and Upstash mode without credentials (deny). Proven on deploy under Approval C.
