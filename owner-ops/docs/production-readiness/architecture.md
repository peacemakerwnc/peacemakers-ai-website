# Architecture — current state vs pilot

## Current state (local / Phase 1.1 accepted)

| Concern | Today |
|---------|--------|
| App | Next.js **16.2.x**, React 19, Zod 4, port **3001** |
| ORM | Prisma **6.19.x**; `prisma/schema.prisma` provider = **`sqlite`** |
| Database | Local `DATABASE_URL=file:./dev.db` |
| Host | Local `next dev` / `next start` only — not a production pilot host |
| Auth | Single-owner email + scrypt password; HMAC-signed httpOnly cookie (`owner_ops_session`) |
| Email | `EmailAdapter` with default **log** provider (`src/lib/mail.ts`); Resend adapter present |
| Storage | Local disk under `STORAGE_ROOT` (`src/lib/storage.ts`) — ephemeral on serverless |
| Rate limit | Memory default; Upstash REST backend available (`src/lib/rate-limit.ts`) |
| Health | `/api/health?mode=live\|ready` with DB probe + production config guards |
| Privacy | Notice version `pilot-2026-08-05`; acknowledgement required on submit |
| Retention | Company-scoped preview/execute deletion in `src/lib/retention.ts` |
| Headers | CSP / HSTS / frame deny via `next.config.ts` + `vercel.json` region `iad1` |
| Monitoring | Structured `[monitor:*]` console events; Sentry DSN env accepted but not wired as hard dependency |

**Production gaps (blocking real client data):** managed Postgres not provisioned; Prisma provider still sqlite for local; Resend/Upstash/Vercel production project not configured; restoration test not run; deployed fictional rehearsal not run.

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
           ├─ Neon Postgres (SSL)  ← DATABASE_URL postgresql://…
           ├─ Resend               ← EMAIL_PROVIDER=resend
           ├─ Upstash Redis REST   ← RATE_LIMIT_BACKEND=upstash
           └─ Optional Sentry      ← SENTRY_DSN (errors only; no form bodies)
```

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Host | **Vercel** | Matches Next.js 16 app; `vercel.json` already sets `iad1` + basic headers |
| DB | **Neon Postgres** | Managed Postgres + SSL; PITR/backups; separate prod project from any sandbox |
| Email | **Resend** via `EmailAdapter` | Existing adapter; transactional invite send without rebuilding mail |
| Rate limit | **Upstash Redis REST** | Works across serverless instances; memory is local-only |
| Monitoring | Structured logs + **optional** Sentry | Fail-safe without mandatory paid APM |
| Auth | Keep **single-owner password + httpOnly cookie** | Controlled pilot only; not long-term multi-user model |
| Storage | **`DISABLE_CLIENT_UPLOADS=true`** | Paste-first; avoid ephemeral Vercel filesystem for attachments |
| Local | **SQLite remains for local** | Production fails closed if `DATABASE_URL` is `file:` / sqlite |

## Alternatives considered

| Option | Why not for this pilot |
|--------|------------------------|
| SQLite on Vercel | Ephemeral / wrong durability model; guards reject `file:` in production |
| Self-hosted Postgres / VPS | Higher ops burden than managed Neon for one controlled pilot |
| Prisma Postgres / other managed PG | Acceptable alternatives; Neon chosen for PITR clarity and free-tier pilot fit |
| SendGrid / SES / SMTP | Extra config surface; Resend adapter already in tree |
| Durable object storage (S3/R2) | Deferred — uploads disabled for pilot |
| OAuth / multi-user IdP | Deferred until general launch; single operator for pilot |
| In-memory rate limits alone | Not distributed across serverless instances |

## Security boundaries

- Owner routes (`/ops/*`) require signed session cookie; client routes use invitation token (hashed at rest).
- Invitation raw tokens never stored; only SHA-256 hashes.
- Logs/monitoring must not include passwords, secrets, raw tokens, or questionnaire bodies.
- Production config asserts Postgres URL, strong `SESSION_SECRET` / `OWNER_PASSWORD`, HTTPS `APP_BASE_URL`, Resend (unless explicit staging escape hatch), and Upstash when selected.
- Cross-company exposure, auth failure, submitted-data mutation, or raw-token leak → **automatic pilot stop** (see [incident-response.md](./incident-response.md)).

## Data flow (pilot)

1. Owner creates company/opportunity/invitation in `/ops`.
2. Owner sends invite via Resend; client receives link to `/f/[token]`.
3. Client acknowledges privacy notice (`pilot-2026-08-05`); drafts autosave; submit locks answers.
4. Owner reviews submission, evidence, and packet in `/ops`.
5. Deletion (if requested) uses `previewCompanyDeletion` → confirm name → `executeCompanyDeletion` (does not purge backups).

## Deployment flow (target)

Local quality gates → set Vercel/Neon/Resend/Upstash env → `prisma migrate deploy` against Neon → Vercel deploy → `/api/health` ready → fictional rehearsal → owner GO checklist.

**Current:** deployment rehearsal **BLOCKED** (infra not approved/provisioned).

## Backup and recovery approach

Neon managed backups / PITR on the **production** project. Restoration tests only into a **non-production** Neon branch/database. See [backup-restoration.md](./backup-restoration.md). Restoration test status: **BLOCKED** until Neon is provisioned.

## Known limitations (pilot)

- Single shared owner password (acceptable only for controlled pilot).
- Client file uploads disabled; paste text evidence only.
- Sentry optional and may be unset; rely on Vercel/Neon logs + structured console events.
- Company deletion does not purge provider backups (documented retention lag).
- Legal review of privacy copy may still be required before broader launch.

## Assumptions requiring owner confirmation

See [owner-actions-required.md](./owner-actions-required.md) and [infrastructure-inventory.md](./infrastructure-inventory.md). No services may be provisioned without explicit owner approval if charges or external commitments are created.
