# Quality gates — Phase 1.2 / 1.2A

Run from `owner-ops/`. Do not copy older increment results as deploy proof.  
**Phase 1.2 infrastructure NO-GO is unchanged.** This file records local toolchain recovery attempts only.

## Recorded run — Phase 1.2A (2026-08-06 Desktop)

Working directory for all commands: `/Users/jamesfullen/Desktop/Peacemakers AI/owner-ops`  
Timeouts use hard process alarms; exit **142** = SIGALRM (timed out / hung). Empty stdout after the script banner means the tool never completed.

| Gate | Exact command | Start (UTC) | End duration | Exit | Result |
|------|---------------|-------------|--------------|------|--------|
| Prisma version | `./node_modules/.bin/prisma -v` | 05:41:21 | 53s | 142 | **FAIL / hang** — zero stdout/stderr |
| Prisma validate | `./node_modules/.bin/prisma validate --schema=prisma/schema.prisma` | 05:42:14 | 60s | 142 | **FAIL / hang** |
| Prisma generate | `./node_modules/.bin/prisma generate --schema=prisma/schema.prisma` | 05:43:14 | 91s | 142 | **FAIL / hang** (client already present from earlier 00:34 generate; see note) |
| Prisma migrate status | `./node_modules/.bin/prisma migrate status --schema=prisma/schema.prisma` | 05:44:45 | 60s | 142 | **FAIL / hang** |
| npm ls | `npm ls --depth=0` | 05:47:09 | 60s | 142 | **FAIL / hang** |
| Vitest | `npm test` → `vitest run` | 05:48:09 | 300s | 142 | **FAIL / hang** — prints banner only; no test totals |
| ESLint | `npm run lint` → `eslint` | 05:53:09 | 180s | 142 | **FAIL / hang** — no lint report |
| Typecheck | `npm run typecheck` → `tsc --noEmit` | 05:56:09 | 180s | 142 | **FAIL / hang** — no diagnostics emitted |
| Production build | `npm run build` → `prisma generate && next build` | 05:59:09 | 300s | 142 | **FAIL / hang** — stuck at prisma generate step |
| Health smoke (local) | not run | — | — | — | **NOT RUN** — build/server not available |
| Health smoke (deployed) | — | — | — | — | **BLOCKED** — not in scope for 1.2A |
| Deployed rehearsal | — | — | — | — | **BLOCKED** — unchanged |
| Restoration test | — | — | — | — | **BLOCKED** — unchanged |

### DB record verification (sqlite3; exit 0)

```
FormProcess|24
FormProcessStep|8
Company|Optimum Demo Contractors
```

### Prisma client note

`node_modules/.prisma/client/` timestamps **2026-08-06 00:34** include `privacyAcknowledgedAt` / email metadata fields (61 references in `index.d.ts`). That earlier generate succeeded; **CLI commands hang again in this 1.2A session** and cannot be re-verified via `prisma generate`.

### Schema-engine binary (works)

`./node_modules/@prisma/engines/schema-engine-darwin-arm64 --version` → exit 0 (engine binary itself is healthy).

### Test totals

Not available — Vitest never executed cases (hang after startup banner).

### Warnings

- `npm warn Unknown env config "devdir"` on every npm invocation (`npm_config_devdir` present in environment).
- Data volume disk ~91–95% full during runs; free RAM pages critically low (~4k–8k pages × 16 KiB).

### Environmental limitation / root cause (evidence-backed)

1. **Prisma CLI hang:** process samples show startup stuck in `uv_fs_read` while loading the large CLI bundle; Network/CFNetwork frameworks also present. No command output is ever produced.
2. **Broader Node hang:** after clearing owner-ops orphans, `npm ls`, Vitest, ESLint, and `tsc` also timed out — consistent with **host resource pressure** (disk nearly full + low free memory), not a single Phase 1.2 code defect.
3. **Not claimed:** local implementation PASS, deploy PASS, restore PASS, or permission to send a real invitation.

### Unblock for local gates (narrowest)

1. Free substantial disk space on `/System/Volumes/Data` (aim for >20% free) and reduce memory pressure (close heavy apps or reboot).
2. Confirm no leftover owner-ops `tsc`/`eslint`/`prisma` PIDs.
3. Re-run: `cd owner-ops && npx prisma generate && npm test && npm run lint && npm run typecheck && npm run build`.
4. Optionally use Node LTS (20/22) if Node **v25.9.0** continues to interact poorly with Prisma 6.19.3 CLI startup after resources are healthy.

## Recorded run — Phase 1.2B (2026-08-06 post-reboot attempt)

**Stopped before Prisma.** Host readiness failed.

| Check | Result |
|-------|--------|
| Data volume free > 20% | **FAIL** (~10% free / ~90% used) |
| Memory / swap | **FAIL** (swap ~14.4/15.4 GiB used) |
| Lightweight Node/npm probes | PASS (`node`, `npm pkg get name`, `npm ls --depth=0`) |
| Prisma CLI / generate / migrate status | **NOT RUN** |
| `npm test` / lint / typecheck / build | **NOT RUN** |

See [PHASE-1-2B-HOST.md](./PHASE-1-2B-HOST.md).
