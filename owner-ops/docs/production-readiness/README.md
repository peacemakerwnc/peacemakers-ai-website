# Phase 1.2 — Production readiness pack

Operational documentation for the **first controlled paying-client pilot** of `owner-ops` (Business Blueprint questionnaire + owner ops).

**Status:** Documentation and local application controls exist. **Production infrastructure is not provisioned.** Deployed fictional rehearsal, backup restoration test, and real-client send are **BLOCKED** pending owner approvals and credentials. Do not treat this pack as a GO decision.

Privacy notice version: `pilot-2026-08-05`  
Support: `james@peacemakersai.com`

## Chosen pilot architecture (summary)

| Layer | Choice |
|-------|--------|
| Host | Vercel (Next.js 16), region `iad1` |
| Database | Neon Postgres (managed, SSL, separate prod project) |
| Email | Resend via `EmailAdapter` |
| Rate limit | Upstash Redis REST |
| Monitoring | Structured logs + optional Sentry DSN |
| Auth | Single-owner password + httpOnly signed cookie (**pilot only**) |
| Storage | `DISABLE_CLIENT_UPLOADS=true` (paste-first); local disk not for prod |
| Local | PostgreSQL (dedicated local test runtime; foundation accepted); production **fails closed** on SQLite |

## Documents

| Doc | Purpose |
|-----|---------|
| [architecture.md](./architecture.md) | Current-state vs proposed pilot architecture |
| [implementation-plan.md](./implementation-plan.md) | Required / Recommended / Deferred work |
| [env-contract.md](./env-contract.md) | Environment variables by name, purpose, where set |
| [infrastructure-inventory.md](./infrastructure-inventory.md) | Services, cost estimate, approval gate |
| [retention-deletion.md](./retention-deletion.md) | Data classes + owner deletion procedure |
| [backup-restoration.md](./backup-restoration.md) | Neon backup/PITR expectations; restoration test |
| [deployment-runbook.md](./deployment-runbook.md) | Deploy + rollback (no destructive reset) |
| [incident-response.md](./incident-response.md) | Pilot incident playbooks (Phase 1.2 §27) |
| [pilot-operating-checklist.md](./pilot-operating-checklist.md) | Before / during / after send |
| [owner-actions-required.md](./owner-actions-required.md) | Credentials and approvals still needed |

## Related

- Root pointer: [`../../PRODUCTION.md`](../../PRODUCTION.md)
- Acceptance evidence stubs: [`../acceptance/phase-1-2-production-readiness/`](../acceptance/phase-1-2-production-readiness/)
- Local app overview: [`../../README.md`](../../README.md)

## Hard rules

1. Do not send a real client invitation until GO (or GO WITH CONDITIONS) is recorded and remaining gates clear.
2. Do not provision paid infrastructure without explicit owner approval.
3. Do not claim deployed rehearsal or restoration tests passed while infrastructure is unprovisioned.
4. Phase 2 (automated Blueprint Generator / recommendations) remains out of scope.
