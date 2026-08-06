# Infrastructure inventory

**Provisioning status (fictional Phase 1.2C Approval A):** Vercel project, Neon Free project, Resend sending-only API key, and Upstash Free Redis are **created**. Sentry is **deferred**. Git connection, Resend domain/DNS, Vercel env values, deploy, migrate, and email remain **not authorized**.

For Approval A evidence and later gates, see:

[`../acceptance/phase-1-2-production-readiness/PHASE-1-2C-INVENTORY.md`](../acceptance/phase-1-2-production-readiness/PHASE-1-2C-INVENTORY.md)

## Target stack (summary)

| Service | Role | Fictional rehearsal | Provisioned? |
|---------|------|---------------------|--------------|
| **Vercel** | Host Next.js 16 app | Region **`iad1`**, plan **Pro**, project `owner-ops-fictional-pilot`; $30 spend + pause; undeployed; Git disconnected | **Yes** (Approval A) |
| **Neon Postgres** | Managed pilot DB (SSL) | Free project `plain-fire-35687465` (aws-us-east-1); main + restore branch + baseline snapshot; fictional only | **Yes** (Approval A) |
| **Resend** | Transactional invitation email | Free; Sending-access key `owner-ops-fictional-pilot` off-repo; **no** domain/DNS yet | **Key only** (Approval A); domain = Approval B |
| **Upstash Redis** | Distributed rate limits (REST) | Free Redis `owner-ops-fictional-pilot-ratelimit` (`437c7d0e-0513-4cb8-96a5-90f4d0a3c2fe`) in **us-east-1**; no commands/data | **Yes** (Approval A) |
| **Sentry** | Optional APM | **Deferred** — structured `[monitor:*]` + Vercel logs | **No** |

Local development and tests use **PostgreSQL** (same provider as Production). Do not use Production Neon credentials for local or `test:db`.

## Estimated monthly cost (fictional stack band)

| Service | Typical fictional-month cost |
|---------|------------------------------|
| Vercel **Pro** | **$20 / month** base + possible metered usage after included allocations / $20 credit ($30 on-demand pause) |
| Neon Free | $0 (fictional only; not auto-approved for real pilot) |
| Resend Free | $0 (fictional only) |
| Upstash Free | $0 (fictional only) |
| Sentry | Deferred — $0 |
| **Baseline estimate** | **$20 / month** (not ~$0) |

Passing fictional rehearsal on Free tiers **does not** authorize those Free tiers for the paying-client pilot — see mandatory pre-real-pilot review in the Phase 1.2C inventory.

## Approval gate

Approval A is **COMPLETE**. Do **not** proceed to Git connect, DNS, env injection, deploy, migrate, or email until the owner explicitly grants the matching later approval (B / C / D).

## What is already in-repo (no vendor create)

- Application code, Prisma PostgreSQL baseline migrations (SQLite history archived inactive), health checks, production guards.
- Email / rate-limit / storage **adapters**.
- `vercel.json` region + header hints.

## What is out of inventory for pilot

- Object storage (S3/R2) — uploads disabled (`DISABLE_CLIENT_UPLOADS=true`).
- Separate Redis protocol client — REST only via Upstash.
- Self-hosted Postgres / Docker DB in production.
- Sentry project (deferred for fictional acceptance).
