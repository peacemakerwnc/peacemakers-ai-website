# Phase 1.2 — Production readiness pack

Operational documentation for the **first controlled paying-client pilot** of `owner-ops` (Business Blueprint questionnaire + owner ops).

**Status (2026-08-07):** Fictional pilot is live through C5-R. C6-R completed the non-prod Neon restore drill and refreshed launch docs. **C7 re-review is still required.** Real-client invitation is **not authorized**.

Privacy notice version (deployed): `pilot-2026-08-07`  
Operating decision: [`../acceptance/phase-1-2-production-readiness/GO-NO-GO.md`](../acceptance/phase-1-2-production-readiness/GO-NO-GO.md)  

Consulting OS (methodology, AI governance, observability foundation): [`../peacemakers-operating-system/README.md`](../peacemakers-operating-system/README.md)  
Restore drill: [`../acceptance/phase-1-2-production-readiness/C6-R-RESTORE-DRILL.md`](../acceptance/phase-1-2-production-readiness/C6-R-RESTORE-DRILL.md)

## Chosen pilot architecture (summary)

| Layer | Choice |
|-------|--------|
| Host | Vercel, region `iad1` — `owner-ops-fictional-pilot` |
| Database | Neon Postgres — Production branch `main` |
| Email | Resend via `EmailAdapter` |
| Rate limit | Upstash Redis REST |
| Monitoring | Structured logs + optional Sentry DSN (deferred) |
| Auth | Single-owner password + httpOnly signed cookie (**pilot only**) |
| Storage | `DISABLE_CLIENT_UPLOADS=true` (paste-first) |
| Local | PostgreSQL foundation accepted; production fails closed on SQLite |

## Documents

| Doc | Purpose |
|-----|---------|
| [architecture.md](./architecture.md) | Current-state vs proposed pilot architecture |
| [implementation-plan.md](./implementation-plan.md) | Required / Recommended / Deferred work |
| [env-contract.md](./env-contract.md) | Environment variables by name, purpose, where set |
| [infrastructure-inventory.md](./infrastructure-inventory.md) | Services, cost estimate, approval gate |
| [retention-deletion.md](./retention-deletion.md) | Data classes + owner deletion procedure |
| [backup-restoration.md](./backup-restoration.md) | Neon backup expectations + C6-R restore drill record |
| [deployment-runbook.md](./deployment-runbook.md) | Deploy + rollback (no destructive reset) |
| [incident-response.md](./incident-response.md) | Pilot incident playbooks |
| [pilot-operating-checklist.md](./pilot-operating-checklist.md) | Before / during / after send (first-client controls) |
| [owner-actions-required.md](./owner-actions-required.md) | Approvals and offline confirmations |

## Related

- Root pointer: [`../../PRODUCTION.md`](../../PRODUCTION.md)
- Acceptance evidence stubs: [`../acceptance/phase-1-2-production-readiness/`](../acceptance/phase-1-2-production-readiness/)
- Local app overview: [`../../README.md`](../../README.md)

## Hard rules

1. Do not send a real client invitation until GO (or GO WITH CONDITIONS) is recorded and remaining gates clear.
2. Do not provision paid infrastructure without explicit owner approval.
3. Do not claim deployed rehearsal or restoration tests passed while infrastructure is unprovisioned.
4. Phase 2 (automated Blueprint Generator / recommendations) remains out of scope.
