# GO / NO-GO — Phase 1.2 pilot

## Decision (operating record)

**GO WITH CONDITIONS — pending C7 re-review**  
*(Not authorization to send a real-client invitation.)*

| Option | Meaning |
|--------|---------|
| GO — ONE CONTROLLED PAYING-CLIENT PILOT | Every pilot-critical requirement passed and C7 re-review accepts |
| GO WITH CONDITIONS | Narrow ops conditions only; no compromise of security, isolation, integrity, recovery, or privacy |
| NO-GO | Material requirement failed or unverifiable |

**Recorded decision:** `GO WITH CONDITIONS — C6 remediations complete; C7 still required`  
**Date:** 2026-08-07  
**Production commit reflected:** `99b1f89b7640a3337d4a0bc10b033897cd45fee4`  
**Operator:** Agent documentation remediation under C6-R (owner must still sign C7 / first-client auth)

### Historical note (superseded operating status)

On **2026-08-06** this file recorded **NO-GO** because infra, restore drill, and deployed rehearsal were not yet complete. That status is **historical** and must not be used as the current launch source of truth.

## Current evidence (C2–C6-R)

| Gate | Status |
|------|--------|
| C2-C fictional-pilot seed | **Complete** (accepted) |
| C3-R Production deploy | **Complete** (accepted; later privacy copy deploy at `99b1f89`) |
| C4 production smoke test | **Complete** (accepted) |
| C5 first attempt | **Blocked** (no password-reset email path) |
| C5-R invitation email + login rate limit | **Complete** (accepted) |
| C5-R record model | Ordinary invite creates `Company + Contact + Opportunity + FormInvitation` (Contact required) |
| C6 readiness review | **Not ready** — two blockers identified |
| C6-R Neon non-prod restore drill | **Complete** — see [C6-R-RESTORE-DRILL.md](./C6-R-RESTORE-DRILL.md) |
| C6-R documentation refresh | **This update** |
| C7 read-only re-review | **Required before any first-real-client authorization** |
| Real-client invitation | **Not authorized** |

## Conditions still explicit (not false passes)

1. Single-owner password authentication; **no MFA/SSO** for this pilot only.
2. **No in-app password reset** (recovery = Vercel `OWNER_PASSWORD` rotation).
3. Privacy notice `pilot-2026-08-07` is **operational copy pending legal review**.
4. **No Sentry** unless separately authorized (console / Vercel logs only).
5. Initial invitation `sendNow` has **no 60-second duplicate-send debounce** — single careful click only.
6. Critical env controls must be confirmed **offline** before launch (`EMAIL_PROVIDER=resend`, log-email hatch off, `DISABLE_CLIENT_UPLOADS=true`, Upstash rate-limit backend).
7. James must manually approve exact company, contact, and recipient before any real send.
8. **Separate written authorization** required for the first real-client invitation (not this file alone).

## What the owner may do next

- Run **C7 — read-only production-readiness re-review**
- If C7 accepts: prepare a separately scoped first-real-client invitation authorization
- Keep restore target `owner-ops-restore-drill-2026-08-07` as evidence unless separately authorized for deletion

## What the owner must not do

- Send a real client invitation under this document alone
- Point Vercel Production at the restore-drill branch
- Finalize the restore onto Production `main`
- Claim C7 complete before it runs
- Begin Phase 2
- Use SQLite / local disk as Vercel production data stores
- Enable log-email for real client delivery

## Checklist before any future GO for a real send

| Gate | Cleared? |
|------|----------|
| Infra provisioned + fictional pilot live | **Yes** (C2–C5-R) |
| Non-prod restore drill recorded | **Yes** (C6-R) |
| Launch docs current | **Yes** (C6-R) |
| C7 re-review accepts | **No** — required next |
| Specific recipient approved + separate written auth | **No** |
| Offline env controls confirmed | Owner action before send |

- Real invitation may be sent today: **No**
- Manual owner approval of recipient still required even after C7/GO: **Yes**
- Rollback checkpoint: prior Vercel deployment + Neon snapshot/branch restore path (proven non-prod)
- Phase 2: **prohibited**
