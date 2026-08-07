# Production readiness

Phase 1.2 documentation for the **controlled paying-client pilot** lives here:

**→ [`docs/production-readiness/README.md`](./docs/production-readiness/README.md)**

Acceptance evidence:

**→ [`docs/acceptance/phase-1-2-production-readiness/`](./docs/acceptance/phase-1-2-production-readiness/)**

## Chosen pilot architecture

| Layer | Choice |
|-------|--------|
| Host | Vercel (Next.js), region `iad1` — project `owner-ops-fictional-pilot` |
| DB | Neon Postgres SSL — project `plain-fire-35687465`, Production branch `main` |
| Email | Resend via `EmailAdapter` (`EMAIL_PROVIDER=resend`) |
| Rate limit | Upstash Redis REST |
| Monitoring | Structured logs + optional Sentry DSN (Sentry currently deferred) |
| Auth | Single-owner password + httpOnly signed cookie (**pilot only**; no in-app reset) |
| Storage | `DISABLE_CLIENT_UPLOADS=true` (paste-first) |
| Local | PostgreSQL foundation complete; production fails closed on SQLite `file:` URLs |

Privacy notice: **`pilot-2026-08-07`** (operational copy; legal review pending)

## Current program status (2026-08-07)

| Item | Status |
|------|--------|
| C2-C seed | Complete |
| C3-R / `99b1f89` Production | Complete |
| C4 smoke | Complete |
| C5-R invitation email + login rate limit | Complete |
| C6 blockers | Restore drill + docs — **remediated in C6-R** |
| C6-R non-prod restore drill | Complete — [C6-R-RESTORE-DRILL.md](./docs/acceptance/phase-1-2-production-readiness/C6-R-RESTORE-DRILL.md) |
| C7 re-review | **Required before any first-real-client authorization** |
| Real-client invitation | **Not authorized** |

## Remaining gates before a real send

1. **C7** read-only production-readiness re-review  
2. Offline confirm of critical Production env controls (never paste secrets into git/chat)  
3. Explicit owner decisions retained in [GO-NO-GO.md](./docs/acceptance/phase-1-2-production-readiness/GO-NO-GO.md)  
4. Separately scoped written first-real-client invitation authorization  
5. [pilot-operating-checklist.md](./docs/production-readiness/pilot-operating-checklist.md) completed for that specific recipient  

Phase 2 remains out of scope.
