# Infrastructure inventory

**Provisioning status:** None of the production services below are assumed to exist.  
**Owner approval is required before creating accounts, projects, domains, or paid plans.**

## Target stack

| Service | Role | Pilot setting | Provisioned? |
|---------|------|---------------|--------------|
| **Vercel** | Host Next.js 16 app | Region **`iad1`** (`vercel.json`) | **No** (approval pending) |
| **Neon Postgres** | Managed production DB (SSL) | Separate **prod** project; not shared with toys/sandbox | **No** |
| **Resend** | Transactional invitation email | Verified sender; `EMAIL_PROVIDER=resend` | **No** |
| **Upstash Redis** | Distributed rate limits (REST) | `RATE_LIMIT_BACKEND=upstash` | **No** |
| **Sentry** (optional) | Error aggregation | Set `SENTRY_DSN` only if owner opts in | **No** / optional |

Local development continues to use **SQLite** and does not require these services.

## Estimated monthly cost (pilot)

Assuming quiet single-operator traffic and free-tier eligibility:

| Service | Typical pilot cost |
|---------|-------------------|
| Vercel Hobby / free allowance | ~$0 |
| Neon free tier | ~$0 |
| Resend free tier | ~$0 (low volume invites) |
| Upstash free tier | ~$0 |
| Sentry free tier (optional) | ~$0 |
| **Blended estimate** | **~$0–40 / month** if free tiers apply; higher if owner chooses Pro plans or custom domain billing |

Exact pricing changes; treat this as a planning band, not a quote. Confirm current vendor pricing before approving spend.

## Approval gate

Do **not** provision until the owner explicitly approves:

1. Creating a Vercel project for `owner-ops` (and any team linkage).
2. Creating a Neon **production** project (and whether a separate staging/branch DB is wanted).
3. Creating Resend + verifying a sending domain or onboarding sender.
4. Creating Upstash Redis database.
5. Optional Sentry project.
6. Any paid plan upgrade or custom domain purchase.

Record approvals in [owner-actions-required.md](./owner-actions-required.md).

## What is already in-repo (no vendor create)

- Application code, Prisma migrations (local sqlite history), health checks, production guards.
- Email / rate-limit / storage **adapters**.
- `vercel.json` region + header hints.

## What is out of inventory for pilot

- Object storage (S3/R2) — uploads disabled (`DISABLE_CLIENT_UPLOADS=true`).
- Separate Redis protocol client — REST only via Upstash.
- Self-hosted Postgres / Docker DB in production.
