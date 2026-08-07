# C6-R — Non-production Neon restore drill evidence

**Date (UTC):** 2026-08-07T14:22:17Z  
**Operator:** Agent under C6-R authorization  
**Production commit at drill:** `99b1f89b7640a3337d4a0bc10b033897cd45fee4`  
**Status:** **COMPLETE** — restore to non-production target proven; Production untouched

## Boundary

| Role | Neon resource | ID (nonsensitive) |
|------|---------------|-------------------|
| Project | `owner-ops-fictional-pilot` | `plain-fire-35687465` |
| Region | aws-us-east-1 | — |
| **Production branch** | `main` (default) | `br-nameless-grass-au0r24j1` |
| Production database name | `neondb` | — |
| Restore source (snapshot) | `owner-ops-fictional-baseline` | `snap-wandering-resonance-aufi75xr` (source branch = Production `main`) |
| **Non-production restore target** | `owner-ops-restore-drill-2026-08-07` | `br-noisy-mode-auqi5bc7` |

## Procedure used

1. Confirmed Production = default branch `main` (`ready`).
2. Restored snapshot `owner-ops-fictional-baseline` into a **new** branch named exactly `owner-ops-restore-drill-2026-08-07`.
3. Left restore **un-finalized** (did **not** run `snapshots finalize`; did **not** swap onto `main`).
4. Verified target `ready`, `default=false`, database `neondb` present.
5. Re-verified Production `main` still `default=true`, `ready`, not modified.
6. Did **not** point Vercel Production at the restore target.
7. Did **not** run migrations, seeds, SQL writes, app workflows, invitations, or email against the target.
8. Retained the restore target as auditable evidence (deletion not authorized).

## Normalized results

| Field | Value |
|-------|--------|
| Source type | Manual Neon snapshot of Production `main` |
| Target label | `owner-ops-restore-drill-2026-08-07` |
| Restore status | `restored` → branch `ready` |
| Schema/DB presence | Confirmed database name `neondb` on target |
| Production modified | **No** |
| Vercel Production modified | **No** |
| Connected to live app | **No** |
| Target retained | **Yes** — owner responsibility: James / Peacemakers AI Neon org |

## Explicit non-claims

- This drill proves **recovery feasibility** to an isolated non-prod Neon branch.
- It does **not** authorize a real-client invitation.
- It does **not** replace a C7 read-only readiness re-review.
- Snapshot content may predate later fictional-pilot seed/activity; the drill validates procedure and isolation, not bit-for-bit current Production row identity.
