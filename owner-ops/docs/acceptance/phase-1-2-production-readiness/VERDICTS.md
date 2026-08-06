# Client-launch verdicts — Phase 1.2

Legend: **PASS** · **FAIL** · **BLOCKED** (cannot verify yet) · **N/A**

Most deployed/infra items are **BLOCKED** or **FAIL** until owner provisions services. Local code readiness ≠ pilot GO.

| # | Requirement | Verdict | Notes |
|---|-------------|---------|-------|
| 1 | Managed Postgres (Neon) provisioned | **BLOCKED** | Awaiting owner approval |
| 2 | Production fails closed on SQLite `file:` URL | **PASS** (code) | `assertProductionConfig`; not proven on live host |
| 3 | Prisma migrate deploy on prod DB | **BLOCKED** | No Neon |
| 4 | Vercel host `iad1` deployed | **BLOCKED** | |
| 5 | Resend email path for invites | **BLOCKED** | Adapter code present; credentials missing |
| 6 | Upstash distributed rate limits | **BLOCKED** | Code present; Redis missing |
| 7 | `DISABLE_CLIENT_UPLOADS=true` in prod | **BLOCKED** | Env not set on host |
| 8 | HTTPS `APP_BASE_URL` | **BLOCKED** | |
| 9 | Strong unique `SESSION_SECRET` / `OWNER_PASSWORD` | **BLOCKED** | Owner must set |
| 10 | Privacy notice `pilot-2026-08-05` + acknowledgement | **PASS** (code) | Local/unit coverage; not rehearsed in prod |
| 11 | Company deletion preview/execute | **PASS** (code) | `previewCompanyDeletion` / `executeCompanyDeletion` |
| 12 | Health live/ready endpoints | **PASS** (code) | Deployed check **BLOCKED** |
| 13 | Security headers | **PASS** (code) | `next.config.ts` / `vercel.json` |
| 14 | Backup/PITR expectations documented | **PASS** (doc) | |
| 15 | Restoration test into non-prod | **BLOCKED** | Neon not provisioned |
| 16 | Deploy + rollback runbook | **PASS** (doc) | Execution **BLOCKED** |
| 17 | Incident response pack (§27) | **PASS** (doc) | |
| 18 | Pilot operating checklist | **PASS** (doc) | |
| 19 | Local quality gates green | **PASS** (local) | Phase 1.2B post-cleanup; see QUALITY-GATES.md. Deployed gates still BLOCKED |
| 20 | Deployed fictional rehearsal | **BLOCKED** | Do not claim PASS |
| 21 | Monitoring without form bodies | **PASS** (code) | Sentry optional / unwired hard SDK |
| 22 | Single-owner auth acceptable for pilot | **PASS** (policy) | Not for general launch |
| 23 | Real client invitation send authorized | **FAIL** | No GO; infra incomplete |
| 24 | Phase 2 still prohibited | **PASS** | Out of scope |

Update verdicts only with evidence. Never mark deployed items PASS without a live check.
