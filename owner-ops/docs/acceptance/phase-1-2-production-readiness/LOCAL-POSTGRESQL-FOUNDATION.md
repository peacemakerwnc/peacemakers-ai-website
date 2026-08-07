# Local PostgreSQL foundation — phase acceptance

**Phase status:** `COMPLETE — TECHNICALLY ACCEPTED`  
**Acceptance commit:** `8073549b0c499d3fc53b518d894bd4d00c9d576c`  
(`test(owner-ops): add isolated PostgreSQL smoke test`; parent `357e77b4c79af36ea407c6fb739d19b2dbb68dfc`)  
**Recorded:** 2026-08-07  
**Secrets:** None printed or committed. Credential contents and complete connection URLs are off-repo only.

This record closes the **local PostgreSQL database foundation** phase only. It does **not** authorize C2–C5, application startup, seed-dependent database suites, deploy, or provider/Production access.

---

## What acceptance covers

| Capability | Status |
|------------|--------|
| Dedicated local PostgreSQL isolation (`owner-ops-test` Colima profile) | Accepted |
| Retained local runtime (`owner-ops-postgres-test` + named volume) | Accepted |
| Schema establishment via single baseline migration | Accepted |
| Presence of all **45** expected application tables | Accepted |
| Initial and final empty-table verification | Accepted |
| Local Prisma connectivity (identity query path) | Accepted |
| Exactly one isolated transaction-rollback smoke test | Accepted |
| Normal Prisma disconnection | Accepted |
| Normal container and dedicated-profile shutdown | Accepted |
| Retention of dedicated local database resources (stopped) | Accepted |

---

## Evidence summary (sanitized)

| Item | Value |
|------|--------|
| Applied migration | `20260806223000_postgres_baseline` |
| Migration checksum | `681a502bca09f0c255267d7f3d17f4fc3b802abfa566d3ef8aca9720b652a35b` |
| Database / user | `owner_ops_test` / `owner_ops_test` |
| Access | Loopback only — `127.0.0.1:55432` |
| Application tables | Exactly **45**; all empty before and after the smoke test |
| Structural fingerprint (pre = post) | `822e0c448296dd9bad272c7b5d214cc2f1c54ff0de1f0f307a7430ee8e4ee7cc` |
| Command | `npm run test:db:isolated` → `vitest run --config vitest.db.isolated.config.ts` |
| Selected test | `src/lib/postgres-smoke.isolated-postgres.test.ts` |
| Execution | Exactly one file, one test, exit `0`; no retry |
| Temporary write | One `Tool` row inside an interactive Prisma transaction; intentional rollback observed |
| Residual data | None — all 45 tables empty afterward |
| Unchanged during runtime | Schema, `_prisma_migrations`, generated Prisma Client, repository source, ignored `.env` (never opened) |
| Excluded suites | All seven existing `*.db.test.ts` suites **not** executed |
| Provider / Production | Not accessed |

---

## Explicitly unverified / unauthorized

Phase acceptance does **not** establish or authorize:

* Application startup against PostgreSQL
* API-route behavior against PostgreSQL
* Worker, queue, scheduler, or background-service behavior
* Execution of the seven existing seed-dependent `*.db.test.ts` suites
* Seed or fixture correctness
* Production or preview deployment
* Neon, Supabase, Vercel, Resend, Upstash, Sentry, or other provider access
* Production data migration or Production database connectivity
* Changes to the default Colima profile
* **C2, C3, C4, or C5** implementation

---

## Retained local resources (stopped)

Do **not** recreate, reset, delete, migrate, or repurpose without a separately scoped authorization:

| Resource | Name / location |
|----------|-----------------|
| Colima profile | `owner-ops-test` (stopped) |
| Container | `owner-ops-postgres-test` |
| Image | Retained pinned PostgreSQL image |
| Volume | `owner-ops-postgres-test-data` |
| Credential file | External path under `~/.config/owner-ops-test/postgres/` (mode `0600`) |
| Launcher | `~/.config/owner-ops-test/postgres/run-with-owner-ops-test-db` |

The **default** Colima profile remained stopped and untouched throughout this phase.

---

## Next phase boundary

| Gate | Status |
|------|--------|
| C2 | **`NOT AUTHORIZED`** |
| C3–C5 | **`NOT AUTHORIZED`** |

Existing documentation defines C2 as Neon `prisma migrate deploy` (via `DIRECT_URL`) plus minimal Production initialization. That work requires a **separately scoped discovery and planning gate** before any implementation. Do not invent additional C2 requirements in this closure record.
