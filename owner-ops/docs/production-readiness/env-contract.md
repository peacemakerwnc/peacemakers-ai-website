# Environment variable contract

Source of truth for names: `src/lib/env.ts`, Prisma schema (`DATABASE_URL` / `DIRECT_URL`), and `.env.example`.  
**Never commit real secrets.** Set production values in the host env UI (Vercel) and provider dashboards only.

| Variable | Purpose | Local | Pilot production (Vercel) | Required in prod? |
|----------|---------|-------|---------------------------|-------------------|
| `NODE_ENV` | Runtime mode; enables production guards | Usually unset / `development` | `production` (set by host) | Yes (host) |
| `DATABASE_URL` | Prisma **runtime** connection | Local Postgres URL | Neon **pooled** `postgresql://…` | Yes — **must not** be `file:` / sqlite |
| `DIRECT_URL` | Prisma **migrate** direct connection | Same host direct URL (or non-pooled) | Neon **direct / non-pooled** | Yes for migrate tooling; add under a separate authorization before C2 if not yet present on the migrate host |
| `OWNER_OPS_TEST_DATABASE_URL` | Dedicated non-Production URL for `npm run test:db` and `npm run test:db:isolated` | Local Docker / authorized test Postgres only | **Never** Production Neon | No (tests only) |
| `OWNER_OPS_ISOLATED_POSTGRES_TEST` | Explicit mode for isolated smoke (`=1`); disables filesystem `.env` fallback in `getEnv()` | Set by `test:db:isolated` runner / launcher child | **Never** in Production | No (tests only) |
| `OWNER_EMAIL` | Owner login identity; seed upsert | `.env` | Vercel env | Yes |
| `OWNER_NAME` | Display / email From fallback | `.env` | Vercel env | Yes |
| `OWNER_PASSWORD` | Owner password (≥12); hashed at rest | `.env` (dev) | Vercel env (strong unique) | Yes — never `change-me-before-use` |
| `SESSION_SECRET` | HMAC for session cookie (≥32 chars) | `.env` | Vercel env (unique prod secret) | Yes — never `dev-only…` |
| `STORAGE_ROOT` | Local disk root for attachments | `./storage` | May remain set; **uploads disabled** | Soft — warn if local path in prod |
| `APP_BASE_URL` | Absolute base for invitation links | `http://localhost:3001` | `https://…` production URL | Yes — HTTPS required |
| `FORM_INVITATION_EXPIRY_DAYS` | Invite TTL days | Optional (default 30) | Optional | No |
| `REVIEW_ACTION_DUE_DAYS` | Review next-action due days | Optional (default 3) | Optional | No |
| `EMAIL_PROVIDER` | `log` \| `resend` | `log` (default) | `resend` | Yes — `resend` for real send |
| `RESEND_API_KEY` | Resend API key | Unset | Vercel env | Yes when provider=`resend` |
| `EMAIL_FROM` | Verified From header | Unset / optional | Verified domain sender | Strongly recommended |
| `ALLOW_LOG_EMAIL_IN_PRODUCTION` | Staging escape hatch | Unset / false | **false** for real client | Must be false for pilot send |
| `RATE_LIMIT_BACKEND` | `memory` \| `upstash` | `memory` | `upstash` | Yes — `upstash` for serverless |
| `UPSTASH_REDIS_REST_URL` | Upstash REST URL | Unset | Vercel env | Yes when backend=`upstash` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST token | Unset | Vercel env | Yes when backend=`upstash` |
| `SENTRY_DSN` | Optional error monitoring | Unset | Optional Vercel env | No |
| `DISABLE_CLIENT_UPLOADS` | Reject client file uploads | Optional false locally | **`true`** for pilot | Yes (`true`) |

## Pooled vs direct (Neon)

- **Runtime (Vercel app):** `DATABASE_URL` = pooled connection string.
- **Migrations (`prisma migrate deploy`):** `DIRECT_URL` = direct/non-pooled connection string.
- C1A does **not** add `DIRECT_URL` to Vercel and does **not** open Production credentials.

## Where set

| Environment | Where |
|-------------|--------|
| Local development | `owner-ops/.env` (gitignored); template `.env.example` |
| Unit / scripts | Placeholder process env for static validation; never Production secrets |
| DB-backed tests | `OWNER_OPS_TEST_DATABASE_URL` only (never Production Neon) |
| Isolated DB smoke | Launcher process env + `OWNER_OPS_ISOLATED_POSTGRES_TEST=1`; loopback + DB name `owner_ops_test`; no filesystem `.env` |
| Pilot production | **Vercel Project → Settings → Environment Variables** (Production) |
| Neon | Connection strings in Vercel / authorized migrate shell only; not in git |

## Validation

- Runtime: Zod schema in `getEnv()` (`src/lib/env.ts`) for application vars.
- Production fail-closed: `assertProductionConfig()` (`src/lib/production-guards.ts`).
- CLI: `NODE_ENV=production npm run pilot:assert-env` (uses current env; expect FAIL until prod values are present).
- Ready probe: `GET /api/health?mode=ready` reports config ok/fail without leaking secrets.

## Explicit non-goals

- Do not put secrets in `vercel.json`, README, or acceptance JSON.
- Do not use Production Neon URLs for local development, `test:db`, or `test:db:isolated`.
- Do not run `test:db:isolated` without the external local launcher and an empty `owner_ops_test` database.
- Do not use `ALLOW_LOG_EMAIL_IN_PRODUCTION=true` for a real client send.
- Do not point production `DATABASE_URL` at a shared sandbox used for experiments.
