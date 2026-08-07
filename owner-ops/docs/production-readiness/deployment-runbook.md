# Deployment and rollback runbook

**Scope:** Controlled pilot on Vercel + Neon.  
**Forbidden in Production:** `prisma migrate reset`, `prisma db push`, drop-database, destructive schema rollback presented as “safe”, and `prisma/seed-demo-uat.ts`.

**Current execution status:** Local PostgreSQL foundation = **COMPLETE — TECHNICALLY ACCEPTED** (commit `8073549…`; see [LOCAL-POSTGRESQL-FOUNDATION.md](../acceptance/phase-1-2-production-readiness/LOCAL-POSTGRESQL-FOUNDATION.md)). Neon migrate / deploy / smoke (**C2–C5**) remain **NOT AUTHORIZED**.

## Pre-deployment quality gates

From `owner-ops/` (use nonsecret placeholder URLs for Prisma CLI; never source Production `.env` for C1A):

```bash
export DATABASE_URL='postgresql://c1a_placeholder:c1a_placeholder@127.0.0.1:5432/c1a_placeholder?schema=public'
export DIRECT_URL="$DATABASE_URL"
npm run db:validate
npm run db:generate
npm test                 # database-independent unit tests
# npm run test:db           # seed-oriented suites; authorized OWNER_OPS_TEST_DATABASE_URL only
# npm run test:db:isolated  # single rollback smoke via external launcher; loopback owner_ops_test only
npm run lint
npm run typecheck
npm run build
```

Record results in [`../acceptance/phase-1-2-production-readiness/QUALITY-GATES.md`](../acceptance/phase-1-2-production-readiness/QUALITY-GATES.md).

## Environment validation

1. Confirm Vercel Production env matches [env-contract.md](./env-contract.md).
2. Confirm **`DIRECT_URL`** is available to the migrate host before C2 (separate authorization if adding to Vercel).
3. With production values loaded (CI or one-off secret shell — never commit):

   ```bash
   NODE_ENV=production npm run pilot:assert-env
   ```

4. Confirm `DISABLE_CLIENT_UPLOADS=true`, `EMAIL_PROVIDER=resend`, `RATE_LIMIT_BACKEND=upstash`, Postgres `DATABASE_URL`, HTTPS `APP_BASE_URL`.

## Migration preview / status (C2 — not C1A)

```bash
# Requires DIRECT_URL (and DATABASE_URL) against Neon — separately authorized
npx prisma migrate status
npx prisma migrate deploy
```

Active history is the PostgreSQL baseline under `prisma/migrations/`.  
Archived SQLite SQL under `prisma/migrations-sqlite-archive/` must **not** be applied.

**Never** `prisma migrate reset` / `db push` on production.

## Minimal Production initialization (C2)

After successful `migrate deploy`, run **only** `npm run db:seed` (`prisma/seed.ts`) with Production `OWNER_*` to create:

- Owner account
- Default pipeline / stages / checklists
- Blueprint form template
- Operational SOP/email templates
- One seed audit event

**Exclude:** `prisma/seed-demo-uat.ts`, Optimum Demo Contractors, invitations, submitted questionnaires, fake client files.

## Application deployment (C3)

1. Keep no-deploy safeguard until C3 authorization.
2. Deploy exactly one controlled Production deployment of `owner-ops` (region `iad1`).
3. Confirm deployment ID / URL recorded in the acceptance folder.

## Post-deploy verification

| Step | Gate | Check |
|------|------|--------|
| Health live | C4 | `GET /api/health?mode=live` → 200 |
| Health ready | C4 | `GET /api/health?mode=ready` → 200, `database: up`, `config: ok` |
| Smoke script | C4 | `APP_BASE_URL=https://… npm run pilot:health-check` |
| Owner login | C4 | `/ops/login` with prod credentials |
| Email / rate-limit | C5 | Owner-controlled test inbox only; Upstash path exercised |
| Go/no-go | later | Update [`GO-NO-GO.md`](../acceptance/phase-1-2-production-readiness/GO-NO-GO.md) |

## Rollback

Handle separately — pick the smallest safe action:

| Failure | Response |
|---------|----------|
| Bad application code | Instant rollback to previous Vercel deployment |
| Bad configuration | Revert Vercel env vars; redeploy or restart as needed; re-run health |
| Failed migration | Stop deploys; do **not** reset DB; forward-fix with corrective migration after backup confirmation |
| Data corruption | Pause pilot; restore via Neon to validated target ([backup-restoration.md](./backup-restoration.md)) |
| Email provider failure | Set sends paused; use revoke/reissue only after provider recovery; do not flip to log-email for real clients |
| Database provider failure | Pause pilot; follow Neon status; communicate delay to client |
| Monitoring outage | Continue with Vercel/Neon logs; optional Sentry may be down — not a reason to skip containment |
| Invitation suspension | Revoke outstanding invites; pause new sends until GO restored |

When unsure whether reversing a migration is safe, **forward-fix**.

## Invitation suspension (ops)

Use owner flows: `revokeInvitation` / `regenerateInvitation` (ops form actions). Do not paste raw tokens into tickets or chat.
