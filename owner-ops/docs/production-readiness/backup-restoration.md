# Backup and restoration (Neon)

## Status

| Item | Status |
|------|--------|
| Provider chosen | Neon Postgres (planned) |
| Production project provisioned | **No** |
| Backup/PITR expectations documented | This file |
| Restoration test (fictional → non-prod) | **BLOCKED** until Neon provisioned |
| Claim of recovery readiness | **Not made** — do not mark PASS |

Owner approval required before creating Neon projects ([infrastructure-inventory.md](./infrastructure-inventory.md)).

## Expectations (to confirm in Neon console after provision)

Record actual values here once the prod project exists (leave blank until then):

| Property | Expected / to confirm |
|----------|------------------------|
| Backup capability | Neon automatic backups for the plan tier |
| Frequency | Per Neon plan (typically continuous WAL + snapshots) |
| Retention | Per Neon plan (record days after provision) |
| Point-in-time recovery (PITR) | Available on supported Neon plans — confirm for chosen tier |
| Encryption | Managed by Neon at rest; SSL in transit (`sslmode=require`) |
| Who can restore | Owner (James) + any explicitly authorized Neon org members |
| Restore targets | **Non-production** branch/DB for drills; prod only for true incidents |
| RPO (objective) | Minutes-level if PITR enabled — confirm after provision |
| RTO (objective) | < 4 hours for pilot-scale DB — confirm after first drill |

## Application deletion vs backups

`executeCompanyDeletion` removes live application rows only. **Backups and PITR windows may still contain deleted company data** until they age out. Treat backup retention as a separate control; do not claim instant erasure from all media.

## Restoration test procedure (non-prod)

**Prerequisite:** Neon prod (or staging) project exists with fictional pilot data or a copy.

1. **Do not** restore over the live production database used by the client pilot.
2. Create or select a **non-production** Neon branch/database as the restore target.
3. Initiate restore/PITR from Neon console to that target (or create branch from a PITR timestamp).
4. Point a **local or staging** `DATABASE_URL` at the restore target (never commit the URL).
5. Run `npx prisma migrate status` (expect up to date or apply deploy only if appropriate).
6. Verify with fictional data:
   - Questionnaire / invitation relationships intact
   - Submitted versions still submitted and read-only
   - Company isolation intact (no cross-company bleed)
7. Record: date, Neon project id (non-secret), operator, pass/fail, anomalies.
8. Tear down or isolate the restore target when finished.

### Test record

| Field | Value |
|-------|-------|
| Test date | _pending_ |
| Operator | _pending_ |
| Neon target | _pending_ |
| Result | **BLOCKED** — Neon not provisioned |
| Notes | Do not claim PASS |

## Production incident restore

1. Pause pilot send/revoke as needed ([incident-response.md](./incident-response.md)).
2. Prefer restore to a side branch, validate, then cut over deliberately.
3. Never run `prisma migrate reset` / `db:reset` against production.
4. After restore, re-check `/api/health?mode=ready`, owner login, and one fictional invite path before any real client activity.
