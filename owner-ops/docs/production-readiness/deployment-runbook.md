# Deployment and rollback runbook

**Scope:** Controlled pilot on Vercel + Neon.  
**Forbidden:** Production reset (`prisma migrate reset`, `npm run db:reset`, drop-database, destructive schema rollback presented as “safe”).

**Current execution status:** End-to-end deploy rehearsal **BLOCKED** pending owner approval and credentials ([owner-actions-required.md](./owner-actions-required.md)).

## Pre-deployment quality gates

From `owner-ops/`:

```bash
npx prisma validate
npx prisma migrate status
npm test
npm run lint
npm run typecheck
npm run build
```

Record results in [`../acceptance/phase-1-2-production-readiness/QUALITY-GATES.md`](../acceptance/phase-1-2-production-readiness/QUALITY-GATES.md).

## Environment validation

1. Confirm Vercel Production env matches [env-contract.md](./env-contract.md).
2. With production values loaded (CI or one-off secret shell — never commit):

   ```bash
   NODE_ENV=production npm run pilot:assert-env
   ```

3. Confirm `DISABLE_CLIENT_UPLOADS=true`, `EMAIL_PROVIDER=resend`, `RATE_LIMIT_BACKEND=upstash`, Postgres `DATABASE_URL`, HTTPS `APP_BASE_URL`.

## Migration preview / status

```bash
# Against Neon using DATABASE_URL in the environment only
npx prisma migrate status
```

If pending migrations exist, review SQL. Prefer forward-fix over reverse.

## Backup confirmation

Before migrate/deploy on a database that already has data: confirm Neon backup/PITR available for the project. First empty provision: note “empty baseline” and proceed.

## Controlled migration execution

```bash
npx prisma migrate deploy
```

**Never** `prisma migrate reset` / `db:reset` on production.

## Application deployment

1. Deploy `owner-ops` to Vercel (Production), region `iad1`.
2. Confirm deployment ID / URL recorded in the acceptance folder.
3. Do not seed fictional Optimum demo data into production if a real client company will share that DB — use a clean company for the client; keep fictional rehearsal isolated.

## Post-deploy verification

| Step | Check |
|------|--------|
| Health live | `GET /api/health?mode=live` → 200 |
| Health ready | `GET /api/health?mode=ready` → 200, `database: up`, `config: ok` |
| Smoke script | `APP_BASE_URL=https://… npm run pilot:health-check` |
| Owner login | `/ops/login` with prod credentials |
| Fictional client link | Create/send to **owner-controlled** test inbox only |
| Monitoring | Structured logs visible in Vercel; Sentry optional |
| Email | Resend dashboard shows test delivery |
| Go/no-go | Update [`GO-NO-GO.md`](../acceptance/phase-1-2-production-readiness/GO-NO-GO.md) |

Deployed fictional rehearsal: **BLOCKED** until infra exists. Do not mark PASS prematurely.

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
