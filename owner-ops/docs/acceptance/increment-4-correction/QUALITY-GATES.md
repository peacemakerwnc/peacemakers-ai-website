# Quality gates (correction run)

All gates re-executed for this correction (not copied from Increment 4 acceptance).

| Gate | Command | Exit | Result |
|------|---------|------|--------|
| Prisma validate | `npx prisma validate` | 0 | Schema valid |
| Migration status | `npx prisma migrate status` | 0 | 6 migrations; up to date |
| Vitest | `npm test` | 0 | **12 files, 77 passed** (was 75; +2 A4 regression tests) |
| ESLint | `npm run lint` | 0 | 0 errors; 8 warnings in prior acceptance scripts only |
| Typecheck | `npm run typecheck` | 0 | Pass (after removing accidental `.next/types/* 2.ts` Finder duplicates) |
| Production build | `npm run build` | 0 | Compiled; routes include evidence + packet/print |
| Production server | `npm start` | 0 | Ready on :3001 |

### Vitest totals

```
Test Files  12 passed (12)
     Tests  77 passed (77)
```

### ESLint

Exit 0. Warnings only in `docs/acceptance/increment-4/run-browser-acceptance.mjs` (pre-existing unused vars). No errors in application source.

### Environmental notes

- macOS Finder created duplicate `.next/types/cache-life.d 2.ts` style files that broke `tsc`; deleted before clean typecheck/build.
- Do not use hung `next dev` on :3001 for acceptance; use `next start` after `npm run build`.
