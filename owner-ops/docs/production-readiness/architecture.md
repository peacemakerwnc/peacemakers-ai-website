# Architecture — current state vs pilot

## Current state (local PostgreSQL foundation accepted)

| Concern | Today |
|---------|--------|
| App | Next.js **16.2.x**, React 19, Zod 4, port **3001** |
| ORM | Prisma **6.19.x**; active `prisma/schema.prisma` provider = **`postgresql`** |
| Database URLs | `DATABASE_URL` (runtime; Neon pooled in Production) + `DIRECT_URL` (migrate tooling; Neon direct) |
| Migration history | Active path: one PostgreSQL baseline under `prisma/migrations/`. SQLite history archived at `prisma/migrations-sqlite-archive/` (inactive) |
| Local / test DB | PostgreSQL required for application and DB-backed tests. Default `npm test` is database-independent. `npm run test:db` requires separately authorized `OWNER_OPS_TEST_DATABASE_URL`. `npm run test:db:isolated` is a single rollback smoke test (loopback + `owner_ops_test` only; no seed / no `deleteMany`) |
| Host | Local `next dev` / `next start`; Vercel project prepared with no-deploy safeguard until later approvals |
| Auth | Single-owner email + scrypt password; HMAC-signed httpOnly cookie (`owner_ops_session`) |
| Email | `EmailAdapter` with default **log** provider (`src/lib/mail.ts`); Resend adapter present |
| Storage | Local disk under `STORAGE_ROOT` (`src/lib/storage.ts`) — ephemeral on serverless |
| Rate limit | Memory default; Upstash REST backend available (`src/lib/rate-limit.ts`) |
| Health | `/api/health?mode=live\|ready` with DB probe + production config guards |
| Privacy | Notice version `pilot-2026-08-07`; acknowledgement required on submit |
| Retention | Company-scoped preview/execute deletion in `src/lib/retention.ts` |
| Headers | CSP / HSTS / frame deny via `next.config.ts` + `vercel.json` region `iad1` |
| Monitoring | Structured `[monitor:*]` console events; Sentry DSN env accepted but not wired as hard dependency |

**Local foundation:** `COMPLETE — TECHNICALLY ACCEPTED` (commit `8073549…`). Dedicated local Postgres schema + isolated rollback smoke only. No Neon migrate, no Vercel change, no Production credential use, no deploy. **C2–C5 NOT AUTHORIZED.** See [LOCAL-POSTGRESQL-FOUNDATION.md](../acceptance/phase-1-2-production-readiness/LOCAL-POSTGRESQL-FOUNDATION.md).

## Proposed pilot architecture (chosen)

```
Client browser
    │
    ├─ /f/[token]  (questionnaire; noindex; no-store)
    └─ /ops/*      (owner; session cookie)
           │
           ▼
    Vercel (Next.js Node runtime, region iad1)
           │
           ├─ Neon Postgres (SSL)  ← DATABASE_URL pooled; DIRECT_URL for migrate
           ├─ Resend               ← EMAIL_PROVIDER=resend
           ├─ Upstash Redis REST   ← RATE_LIMIT_BACKEND=upstash
           └─ Optional Sentry      ← SENTRY_DSN (errors only; no form bodies)
```

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Host | **Vercel** | Matches Next.js 16 app; `vercel.json` already sets `iad1` + basic headers |
| DB | **Neon Postgres** | Managed Postgres + SSL; PITR/backups; single active Prisma provider |
| Email | **Resend** via `EmailAdapter` | Existing adapter; transactional invite send without rebuilding mail |
| Rate limit | **Upstash Redis REST** | Works across serverless instances; memory is local-only |
| Monitoring | Structured logs + **optional** Sentry | Fail-safe without mandatory paid APM |
| Auth | Keep **single-owner password + httpOnly cookie** | Controlled pilot only; not long-term multi-user model |
| Storage | **`DISABLE_CLIENT_UPLOADS=true`** | Paste-first; avoid ephemeral Vercel filesystem for attachments |
| Local/test | **PostgreSQL** | Same provider as Production; no dual SQLite/Postgres schema |

## Alternatives considered

| Option | Why not for this pilot |
|--------|------------------------|
| SQLite on Vercel | Ephemeral / wrong durability model; guards reject `file:` in production |
| Dual active Prisma schemas (SQLite + Postgres) | Allows provider-specific drift from Production; rejected in C1A |
| Self-hosted Postgres / VPS | Higher ops burden than managed Neon for one controlled pilot |
| Durable object storage (S3/R2) | Deferred — uploads disabled for pilot |
| OAuth / multi-user IdP | Deferred until general launch; single operator for pilot |

## Security boundaries

- Owner routes (`/ops/*`) require signed session cookie; client routes use invitation token (hashed at rest).
- Invitation raw tokens never stored; only SHA-256 hashes.
- Logs/monitoring must not include passwords, secrets, raw tokens, or questionnaire bodies.
- Production config asserts Postgres URL, strong `SESSION_SECRET` / `OWNER_PASSWORD`, HTTPS `APP_BASE_URL`, Resend (unless explicit staging escape hatch), and Upstash when selected.
- Cross-company exposure, auth failure, submitted-data mutation, or raw-token leak → **automatic pilot stop** (see [incident-response.md](./incident-response.md)).

## Data flow (pilot)

1. Owner creates company/opportunity/invitation in `/ops`.
2. Owner sends invite via Resend; client receives link to `/f/[token]`.
3. Client acknowledges privacy notice (`pilot-2026-08-07`); drafts autosave; submit locks answers.
4. Owner reviews submission, evidence, and packet in `/ops`.
5. Deletion (if requested) uses `previewCompanyDeletion` → confirm name → `executeCompanyDeletion` (does not purge backups).

## Deployment flow (target gated sequence)

Local PostgreSQL foundation (**COMPLETE**) → **C2** Neon `migrate deploy` + minimal seed (**NOT AUTHORIZED**) → **C3** one controlled Vercel deploy → **C4** smoke → **C5** email/rate-limit.

**Forbidden in Production:** `prisma db push`, `prisma migrate reset`, `npm run db:reset` (removed), `prisma/seed-demo-uat.ts`.

## Backup and recovery approach

Neon managed backups / PITR on the **production** project. Restoration tests only into a **non-production** Neon branch/database. See [backup-restoration.md](./backup-restoration.md).

## Known limitations (pilot)

- Single shared owner password (acceptable only for controlled pilot).
- Client file uploads disabled; paste text evidence only.
- Sentry optional and may be unset; rely on Vercel/Neon logs + structured console events.
- Company deletion does not purge provider backups (documented retention lag).
- Database-backed Vitest suites deferred until a separately authorized non-Production Postgres test URL exists.
- Legal review of privacy copy may still be required before broader launch.

## Assumptions requiring owner confirmation

See [owner-actions-required.md](./owner-actions-required.md) and [infrastructure-inventory.md](./infrastructure-inventory.md). No services may be provisioned without explicit owner approval if charges or external commitments are created.
