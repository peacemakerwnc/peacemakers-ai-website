# Phase 1.2C — Proposed fictional pilot infrastructure inventory (revised)

**Status:** Approval A **COMPLETE** — see [PHASE-1-2C-PROVISIONING.md](./PHASE-1-2C-PROVISIONING.md).  
**Date:** 2026-08-06  
**HEAD:** `b217964`

## Verified created / active

| Provider | Resource | Region | Plan | Notes |
|----------|----------|--------|------|-------|
| Vercel | Team `peacemakers-ai` | — | **Pro**, 1 seat | Active |
| Vercel | Project `owner-ops-fictional-pilot` | iad1 intended | Pro | Undeployed, no Git |
| Vercel | Spend Management | — | Pro | **$30**; alerts 50/75/100; SMS; **Pause On**; webhook blank |
| Neon | `owner-ops-fictional-pilot` (`plain-fire-35687465`) | aws-us-east-1 | Free | + restore branch + baseline snapshot; fictional only |
| Resend | API key `owner-ops-fictional-pilot` | — | Free | Workspace `peacemakersai`; **Sending access**; `RESEND_API_KEY` off-repo |
| Upstash | Redis `owner-ops-fictional-pilot-ratelimit` (`437c7d0e-0513-4cb8-96a5-90f4d0a3c2fe`) | **us-east-1** | Free | Personal workspace; REST creds off-repo; no PAYG |

## Pending Approval A

None.

## Deferred / later gates

| Item | Gate |
|------|------|
| Sentry | Deferred |
| Git connect / Resend DNS / Vercel env values | **Approval B** (NOT AUTHORIZED) |
| Deploy / migrate / data | Approval C |
| Send email | Approval D |
| Free tiers for real client | Pre-real-pilot infrastructure review |

## Cost band (unchanged)

Baseline **~$20/mo** Pro; upper band **~$20–50** with $30 metered spend. Neon/Resend/Upstash Free for fictional only — reevaluate before paying-client pilot.

## Sanitized deletion

Remove Vercel project; Neon project; Resend key `owner-ops-fictional-pilot`; Upstash DB `owner-ops-fictional-pilot-ratelimit`; delete off-repo `neon.env` / `resend.env` / `upstash.env`.
