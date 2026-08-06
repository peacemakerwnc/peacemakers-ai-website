# Quality gates — Phase 1.2

Run from `owner-ops/`. Do not copy older increment results as deploy proof.

## Recorded run — 2026-08-06 (Desktop)

| Gate | Command | Exit | Result |
|------|---------|------|--------|
| Prisma validate | `npx prisma validate` | n/a | **BLOCKED** — Prisma CLI hangs with no output in this environment (validated indirectly: migration SQL applied to `prisma/dev.db` via sqlite3) |
| Prisma generate | `npx prisma generate` | n/a | **BLOCKED** — same CLI hang; privacy/email columns accessed via `$queryRaw` / `$executeRaw` until generate recovers |
| Migration apply (local SQLite) | sqlite3 apply `20260806010000_pilot_privacy_and_email_metadata` | 0 | **PASS** — columns present on `FormInvitation`; migration recorded in `_prisma_migrations` |
| Vitest | `npm test` / focused vitest | n/a | **BLOCKED** — Vitest starts then hangs before executing files (blocked on prior Prisma CLI hang in `db push`; helper `resetSqliteTestDatabase` added) |
| ESLint | `npm run lint` / scoped eslint | n/a | **BLOCKED** — toolchain hang during this session after Prisma/Vitest lockup |
| Typecheck | `npm run typecheck` | n/a | **BLOCKED** — `tsc --noEmit` hung >5 minutes with no output after Prisma CLI incidents |
| Production build | `npm run build` | n/a | **NOT RUN** — blocked by typecheck/prisma generate |
| Prod env assert | `NODE_ENV=production npm run pilot:assert-env` | n/a | **NOT RUN** (script present; expect FAIL until prod Postgres/email/upstash configured) |
| Health smoke (local) | `APP_BASE_URL=http://localhost:3001 npm run pilot:health-check` | n/a | **NOT RUN** — requires server; route implemented at `/api/health` |
| Health smoke (deployed) | deployed URL | n/a | **BLOCKED** — host not provisioned |
| Deployed fictional rehearsal | — | n/a | **BLOCKED** — awaiting owner infra approval/credentials |
| Restoration test | Neon non-prod | n/a | **BLOCKED** — Neon not provisioned |

### Baseline DB verification (pre-change)

```
FormProcess|24
FormProcessStep|8
Company|Optimum Demo Contractors
```

### Environmental limitation

Prisma CLI (`validate` / `generate` / `db push` / `migrate deploy`) produces **zero stdout/stderr** and never exits on this Desktop session (reproduced with hard 15–60s timeouts). After wedged CLI processes, Vitest and `tsc` also hung. Owner-ops Node processes were cleared once to restore `git status`. Re-run all gates after a machine reboot or after Prisma CLI recovers.

### Unblock for local gates

1. Ensure no stuck `node … prisma` / vitest / tsc processes for `owner-ops`
2. `cd owner-ops && npx prisma generate`
3. `npm test && npm run lint && npm run typecheck && npm run build`
4. Record exits in this table
