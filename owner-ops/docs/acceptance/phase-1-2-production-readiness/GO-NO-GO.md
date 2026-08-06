# GO / NO-GO — Phase 1.2 pilot

## Decision

**NO-GO** (default until gates clear)

| Option | Meaning |
|--------|---------|
| GO — ONE CONTROLLED PAYING-CLIENT PILOT | Every pilot-critical requirement passed |
| GO WITH CONDITIONS | Narrow ops conditions only; no compromise of security, isolation, integrity, recovery, or privacy |
| NO-GO | Material requirement failed or unverifiable |

**Recorded decision:** `NO-GO`  
**Date:** 2026-08-06  
**Operator:** _pending owner sign-off_

### Why NO-GO now

- Production infrastructure (Vercel, Neon, Resend, Upstash) not approved/provisioned
- Restoration test **BLOCKED**
- Deployed fictional rehearsal **BLOCKED** — not claimed PASS
- Real invitation send not authorized
- Local implementation gates: **PASS** (Phase 1.2B post-cleanup) — not sufficient for pilot GO

## What the owner may do next

- Approve provisioning of the fictional pilot environment (Vercel iad1, Neon, Resend, Upstash)
- Run non-prod restore drill and fictional rehearsal after provision
- Revisit this file to upgrade the decision

## What the owner must not do

- Send a real client invitation
- Claim deployed rehearsal or restore test passed
- Run destructive DB reset against any production database
- Begin Phase 2
- Use SQLite or local disk as Vercel production data stores
- Enable log-email for real client delivery

## Checklist for a future GO

| Gate | Cleared? |
|------|----------|
| Infra provisioned + env asserted | No |
| `/api/health` ready on deploy | No |
| Restore test recorded | No |
| Fictional rehearsal recorded | No |
| VERDICTS pilot-critical rows PASS | No |
| Specific recipient approved on checklist | No |

- Real invitation may be sent: **No**
- Manual owner approval of recipient and link still required even after GO: **Yes**
- Monitoring window after first send: recommended 24h owner attention
- Rollback checkpoint: previous Vercel deployment + Neon PITR (once provisioned)
- Phase 2: **prohibited**
