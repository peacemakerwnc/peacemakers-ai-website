# Implementation plan — Phase 1.2

Classify every item as **Required** (before pilot), **Recommended** (shortly after pilot), or **Deferred** (general launch). Do not implement Recommended/Deferred unless necessary for the authorized pilot.

## Status legend

- **Code-ready:** Implementation present in repo; still needs infra/credentials to operate in prod.
- **Blocked:** Waiting on owner approval, credentials, or undeployed infrastructure.
- **Open:** Not yet complete in code or ops.

---

## Required before pilot

| # | Item | Notes | Status |
|---|------|-------|--------|
| R1 | Neon Postgres project (prod, SSL) | Fictional pilot Neon provisioned under Approval A | **Provisioned** (migrate still gated) |
| R2 | Prisma PostgreSQL datasource | Active provider `postgresql` + `DATABASE_URL` + `DIRECT_URL`; SQLite history archived | **C1A candidate** (uncommitted); Neon apply = C2 |
| R3 | `prisma migrate deploy` on Neon | Postgres baseline only; no `migrate reset` / `db push` in prod | **Blocked** (C2) |
| R4 | Vercel project, region `iad1` | Linked; no-deploy safeguard; Production env names set (B3) | **Configured**; deploy = C3 |
| R5 | Production env contract | See [env-contract.md](./env-contract.md); `DIRECT_URL` still a migrate prerequisite | Contract ready; `DIRECT_URL` on migrate host **pending separate auth** |
| R6 | Resend account + verified sender | `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `EMAIL_FROM` | **Configured**; send = C5 |
| R7 | Upstash Redis REST | `RATE_LIMIT_BACKEND=upstash` + URL/token | **Configured**; prove = C5 |
| R8 | `DISABLE_CLIENT_UPLOADS=true` | Paste-first pilot; reject uploads in production | **Code-ready** |
| R9 | Production fails closed on SQLite | `assertProductionConfig` rejects `file:` / non-postgres | **Code-ready** |
| R10 | Privacy notice + acknowledgement | Version `pilot-2026-08-05`; required on submit | **Code-ready** |
| R11 | Retention / company deletion | `previewCompanyDeletion` / `executeCompanyDeletion` | **Code-ready** (ops UI may be script/owner-driven) |
| R12 | Health checks | `/api/health` live + ready | **Code-ready** |
| R13 | Security headers | `next.config.ts` + `vercel.json` | **Code-ready** |
| R14 | Distributed rate limits on sensitive paths | Login, invite, autosave, submit, etc. via `checkRateLimit` | **Code-ready** (needs Upstash in prod) |
| R15 | Invitation email via adapter | Real send only with Resend; no log-email for real client | **Code-ready** / send **Blocked** |
| R16 | Strong prod secrets | Unique `SESSION_SECRET`, strong `OWNER_PASSWORD`, HTTPS `APP_BASE_URL` | **Blocked** (owner sets) |
| R17 | Backup expectations documented | Neon PITR/backup; see [backup-restoration.md](./backup-restoration.md) | Doc ready; test **Blocked** |
| R18 | Restoration test into non-prod | Fictional data only | **Blocked** until Neon |
| R19 | Deploy + rollback runbook | [deployment-runbook.md](./deployment-runbook.md); no destructive reset | Doc ready; execute **Blocked** |
| R20 | Incident response pack | [incident-response.md](./incident-response.md) | Doc ready |
| R21 | Pilot operating checklist | [pilot-operating-checklist.md](./pilot-operating-checklist.md) | Doc ready |
| R22 | Local quality gates | validate / migrate status / test / lint / typecheck / build | Fill [QUALITY-GATES.md](../acceptance/phase-1-2-production-readiness/QUALITY-GATES.md) |
| R23 | Deployed fictional rehearsal | Controlled test recipient; not real client | **Blocked** |
| R24 | GO / NO-GO record | [GO-NO-GO.md](../acceptance/phase-1-2-production-readiness/GO-NO-GO.md) | Template; decision **pending** |

### Files expected to change (C1A repository candidate)

- `prisma/schema.prisma` (postgresql + `directUrl`)
- `prisma/migrations/` (PostgreSQL baseline) + `prisma/migrations-sqlite-archive/` (inactive history)
- `src/lib/invitations.ts` (Prisma Client instead of SQLite-oriented raw SQL)
- Test harness: `test-db.ts`, `vitest.config.ts`, `vitest.db.config.ts`, `*.db.test.ts`
- `.env.example`, `package.json` scripts (no Production reset; no migrate/seed in `build`)
- Docs under `docs/production-readiness/`

### Database migration strategy

1. Active Prisma provider is **PostgreSQL only** (no dual SQLite/Postgres schemas).
2. SQLite migration SQL is archived and must never be applied to Neon.
3. C1A creates the PostgreSQL baseline artifact only — **no database execution**.
4. C2 (separately authorized): `prisma migrate deploy` against Neon using **`DIRECT_URL`**, then minimal `db:seed` (owner + pipeline/template only).
5. Never run `prisma migrate reset`, `db push`, or `prisma/seed-demo-uat.ts` against Production.
6. If a migration is unsafe to reverse, **forward-fix** with a new migration rather than destructive rollback.

### Approval sequence (do not collapse)

C1A local candidate → independent verification → (optional authorized Postgres test DB) → **C2** migrate + minimal init → **C3** one controlled deploy → **C4** smoke → **C5** email/rate-limit.

### Auth for pilot

Keep single-owner password + httpOnly signed cookie. No IdP migration in Required scope.

### Estimated recurring cost

See [infrastructure-inventory.md](./infrastructure-inventory.md): roughly **$0–40/month** on free tiers for a quiet pilot; owner approval required before any paid upgrade.

---

## Recommended shortly after pilot

| # | Item | Notes |
|---|------|-------|
| C1 | Wire `@sentry/nextjs` (or equivalent) when DSN set | Today DSN is accepted; error boundary is lightweight |
| C2 | Owner UI for deletion preview/confirm | Logic exists in `retention.ts`; surface in `/ops` if helpful |
| C3 | Automated invite-expiry sweeper | Cron or scheduled job for EXPIRED status |
| C4 | Email delivery dashboard review habit | Resend logs after each real send |
| C5 | Tighten CSP (`unsafe-eval` removal) if Next build allows |
| C6 | Shorter session TTL for production | Currently 14 days; consider reducing for pilot ops |
| C7 | Documented restore drill cadence | e.g. quarterly after first successful test |

---

## Deferred until general launch

| # | Item | Notes |
|---|------|-------|
| D1 | Multi-user / SSO / MFA auth | Replace single shared password model |
| D2 | Durable private object storage (S3/R2) | Re-enable attachments with private URLs |
| D3 | Self-service privacy portal | Owner-operated deletion is enough for pilot |
| D4 | Full compliance certification claims | No unverified regulatory claims |
| D5 | Phase 2 Blueprint Generator / recommendations / ROI | Explicitly out of scope |
| D6 | Multi-region / HA beyond provider defaults | Single-region `iad1` sufficient |
| D7 | Custom domain / branded DNS (unless owner already approved) | Use Vercel URL until approved |

---

## Commit structure (when implementing)

Prefer small, reviewable commits: docs → env/guards → db adapter → email/rate-limit wiring → acceptance evidence. Do not commit secrets, `.env`, or provider tokens.

## User actions still required

See [owner-actions-required.md](./owner-actions-required.md).
