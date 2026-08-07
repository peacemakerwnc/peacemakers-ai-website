# Backup and restoration (Neon)

## Status

| Item | Status |
|------|--------|
| Provider | Neon Postgres |
| Production project | `owner-ops-fictional-pilot` (`plain-fire-35687465`), region `aws-us-east-1` |
| Production branch | `main` (`br-nameless-grass-au0r24j1`, default) |
| Production database name | `neondb` |
| Backup/snapshot capability | Neon snapshots available; baseline snapshot `owner-ops-fictional-baseline` (`snap-wandering-resonance-aufi75xr`) |
| Restoration test (fictional → non-prod) | **PASS — C6-R 2026-08-07** (see acceptance [C6-R-RESTORE-DRILL.md](../acceptance/phase-1-2-production-readiness/C6-R-RESTORE-DRILL.md)) |
| Claim of recovery readiness | **Procedure proven to non-prod only** — does not authorize prod cutover or real-client launch |

## Expectations (confirmed / recorded)

| Property | Value |
|----------|--------|
| Backup capability | Neon manual snapshot + branch-based recovery |
| Restore targets | **Non-production** branch only for drills |
| Who can restore | Owner (James) + authorized Neon org members |
| RPO / RTO | Pilot-scale; confirm per Neon plan if objectives tighten |
| Encryption | Managed by Neon at rest; SSL in transit |

## C6-R restore drill record

| Field | Value |
|-------|--------|
| Test date (UTC) | 2026-08-07T14:22:17Z |
| Operator | Agent under C6-R authorization |
| Source type | Snapshot `owner-ops-fictional-baseline` (from Production `main`) |
| Non-production target | `owner-ops-restore-drill-2026-08-07` (`br-noisy-mode-auqi5bc7`) |
| Result | **PASS** — target `ready`, `default=false`, database `neondb` present |
| Production modified | **No** (`main` remained default + ready; restore left un-finalized) |
| Vercel Production pointed at restore target | **No** |
| Target retained | **Yes** (deletion not authorized; owner responsibility: James / Peacemakers AI Neon org) |
| Evidence file | [C6-R-RESTORE-DRILL.md](../acceptance/phase-1-2-production-readiness/C6-R-RESTORE-DRILL.md) |

## Application deletion vs backups

`executeCompanyDeletion` removes live application rows only. **Backups and snapshots may still contain deleted company data** until they age out. Treat backup retention as a separate control; do not claim instant erasure from all media.

## Restoration test procedure (non-prod)

**Prerequisite:** Neon production project exists.

1. **Do not** restore over the live production database used by the client pilot.
2. Create a **new** non-production Neon branch from a Production snapshot (or parent `main` LSN) with a clear drill label.
3. Leave the restore **un-finalized** unless an explicit prod incident cutover is separately authorized.
4. Verify provider status: target exists, non-default, `ready`, database present.
5. Confirm Production `main` still default and ready.
6. **Do not** point Vercel Production at the restore target for a drill.
7. Record: date, snapshot/source, target label/id, operator, pass/fail.
8. Retain or delete the target only with explicit owner authorization (C6-R retains the 2026-08-07 target).

## Production incident restore

1. Prefer restore to a side branch, validate, then cut over deliberately with explicit owner decision.
2. Never “finalize onto main” during a drill.
3. After any true prod cutover, re-check `/api/health?mode=ready`, owner login, and one fictional invite path before any real client activity.
