# Quality gates — Phase 1.2 / 1.2A / 1.2B

Run from `owner-ops/`. Do not copy older increment results as deploy proof.  
**Phase 1.2 infrastructure / pilot go-no-go remains NO-GO** until deployed fictional rehearsal passes.

## Recorded run — Phase 1.2B post-cleanup (2026-08-06)

Working directory: `/Users/jamesfullen/Desktop/Peacemakers AI/owner-ops`  
HEAD at start: `44eb7d7` · Branch: `main`  
Host: Data volume ~45 GiB free / 228 GiB (~23% free, 77% used); swap **0**; memory pressure not severe.

| Gate | Exact command | Start (UTC) | End (UTC) | Exit | Result |
|------|---------------|-------------|-----------|------|--------|
| Prisma version | `./node_modules/.bin/prisma -v` | 12:10:40 | 12:10:41 | 0 | **PASS** — prisma 6.19.3 / client 6.19.3 |
| Prisma format | `./node_modules/.bin/prisma format --schema=prisma/schema.prisma` | 12:10:41 | 12:10:41 | 0 | **PASS** |
| Prisma validate | `./node_modules/.bin/prisma validate --schema=prisma/schema.prisma` | 12:10:41 | 12:10:42 | 0 | **PASS** |
| Prisma generate | `./node_modules/.bin/prisma generate --schema=prisma/schema.prisma` | 12:10:42 | 12:10:43 | 0 | **PASS** |
| Prisma migrate status | `./node_modules/.bin/prisma migrate status --schema=prisma/schema.prisma` | 12:10:43 | 12:10:43 | 0 | **PASS** — 7 migrations; SQLite up to date |
| npm ls | `npm ls --depth=0` | 12:10:43 | 12:10:43 | 0 | **PASS** |
| Vitest | `npm test` → `vitest run` | 12:11:58 | 12:12:04 | 0 | **PASS** — 13 files / 88 tests |
| ESLint | `npm run lint` → `eslint` | 12:12:04 | 12:12:07 | 0 | **PASS** — 0 errors, 8 warnings (legacy acceptance `.mjs`) |
| Typecheck | `npm run typecheck` → `tsc --noEmit` | 12:12:07 | 12:12:08 | 0 | **PASS** (re-confirmed after removing Finder duplicate `.next/types/* 2.ts`) |
| Production build | `npm run build` → `prisma generate && next build` | 12:12:08 | 12:12:16 | 0 | **PASS** |
| npm audit (prod) | `npm audit --omit=dev` | 12:12:16 | 12:12:17 | 1 | **REVIEWED** — 3 high (transitive `next`→`postcss`, `sharp`); `audit fix --force` would jump Next outside range — deferred |
| Secret scan | ripgrep for live key / PEM patterns under `src` `prisma` `scripts` | — | — | 0 | **PASS** — no matches |
| Health live | `curl /api/health?mode=live` against `next start :3001` | 12:13:03 | 12:13:11 | 0 | **PASS** — `{"status":"ok","check":"live"}` |
| Health ready + smoke | `APP_BASE_URL=http://127.0.0.1:3001 npm run pilot:health-check` | 12:13:11 | ~12:13:15 | 0 | **PASS** — database=up; config=fail expected on local SQLite production start |
| Deployed rehearsal | — | — | — | — | **BLOCKED** — not provisioned |
| Restoration test | — | — | — | — | **BLOCKED** — not provisioned |

### DB record verification (sqlite3 `prisma/dev.db`; exit 0)

```
FormProcess|24
FormProcessStep|8
Company|Optimum Demo Contractors
```

### Test totals (final)

- Test files: **13 passed / 13**
- Tests: **88 passed / 88**
- Failed: **0**
- Skipped: **0**
- Duration: ~5.3–5.7s

### Corrections applied this increment (local only)

1. Vitest `DATABASE_URL` corrected to schema-relative `file:./vitest.db` (was nesting `prisma/prisma/vitest.db`).
2. `resetSqliteTestDatabase` ROOT fix + SQLite FormProcessStep FK repair after Process→FormProcess rename/recreate.
3. `pilot:health-check` no longer false-fails on configErrors that *name* env vars (still rejects echoed secret values).
4. Regression coverage in `pilot-readiness.test.ts` for URL + FormProcessStep FK target.

### Warnings / environmental notes

- `npm warn Unknown env config "devdir"` on npm invocations.
- ESLint: 8 unused-var warnings in older Playwright acceptance helpers (exit 0).
- Transient typecheck FAIL if macOS creates `.next/types/* 2.ts` duplicates; delete and re-run (not an app defect).
- Local `next start` ready check correctly reports production config fail against SQLite.

### Local implementation / infra readiness (this increment only)

| Verdict | Value |
|---------|--------|
| Local implementation gates | **PASS** |
| Ready for infrastructure provisioning | **YES** |
| Phase 1.2 pilot go/no-go | remains **NO-GO** |
| Production readiness / deploy acceptance | **not established** |

---

## Prior runs (retained)

### Phase 1.2A (2026-08-06 Desktop) — FAIL / hang under disk+memory pressure

See historical table in git history / [PHASE-1-2A-TOOLCHAIN.md](./PHASE-1-2A-TOOLCHAIN.md). Prisma/`npm test`/lint/tsc/build timed out (exit 142).

### Phase 1.2B pre-cleanup — stopped before Prisma

See [PHASE-1-2B-HOST.md](./PHASE-1-2B-HOST.md) (~10% free disk, swap ~14.4 GiB).
