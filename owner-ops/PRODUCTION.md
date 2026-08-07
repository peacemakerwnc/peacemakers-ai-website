# Production readiness

Phase 1.2 documentation for the **controlled paying-client pilot** lives here:

**→ [`docs/production-readiness/README.md`](./docs/production-readiness/README.md)**

Acceptance evidence stubs:

**→ [`docs/acceptance/phase-1-2-production-readiness/`](./docs/acceptance/phase-1-2-production-readiness/)**

## Chosen pilot architecture

| Layer | Choice |
|-------|--------|
| Host | Vercel (Next.js 16), region `iad1` |
| DB | Neon Postgres (SSL, separate prod project) |
| Email | Resend via `EmailAdapter` |
| Rate limit | Upstash Redis REST |
| Monitoring | Structured logs + optional Sentry DSN |
| Auth | Single-owner password + httpOnly signed cookie (**pilot only**) |
| Storage | `DISABLE_CLIENT_UPLOADS=true` (paste-first); local disk not for prod |
| Local | PostgreSQL (dedicated `owner-ops-test` runtime; foundation **COMPLETE — TECHNICALLY ACCEPTED**); production **fails closed** on `file:` `DATABASE_URL` |

Privacy notice: `pilot-2026-08-05` · Support: `james@peacemakersai.com`

## Remaining gates (not cleared)

Do **not** send a real client invitation until these are done:

1. Owner approvals + credentials ([docs/production-readiness/owner-actions-required.md](./docs/production-readiness/owner-actions-required.md))
2. Provision Vercel + Neon + Resend + Upstash (optional Sentry)
3. Production env assertion + `/api/health` ready on the deployed host
4. Neon restoration test into **non-prod** (currently **BLOCKED**)
5. Deployed fictional rehearsal (currently **BLOCKED** — do not claim PASS)
6. Recorded GO / GO WITH CONDITIONS in acceptance `GO-NO-GO.md`
7. Pilot operating checklist completed for the specific recipient

Interfaces for email (`src/lib/mail.ts`) and storage (`src/lib/storage.ts`) remain the swap points for providers. Phase 2 remains out of scope.
