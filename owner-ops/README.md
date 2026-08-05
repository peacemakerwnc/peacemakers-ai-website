# Owner Operations Dashboard (Phase 1)

Internal Peacemakers AI operating system for Business Blueprint forms, pipeline tracking, and next actions.

**Local development only.** Do not deploy SQLite or local filesystem storage to Vercel as production infrastructure. A separate production-readiness phase is required before real client data.

## Requirements

- Node.js 20+
- npm

## Setup

```bash
cd owner-ops
cp .env.example .env
# Edit OWNER_PASSWORD and SESSION_SECRET (32+ random characters)
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

| Surface | URL |
|---------|-----|
| Owner login | `/ops/login` |
| Pipeline | `/ops` |
| Form management | `/ops/forms` |
| Invitation detail | `/ops/forms/[id]` |
| Submission review | `/ops/forms/[id]/review` |
| Opportunity record | `/ops/opportunities/[id]` |
| Contact/company | `/ops/contacts/[id]` |
| Client form | `/f/[token]` |

Default seed owner email comes from `.env` (`OWNER_EMAIL`). Change `OWNER_PASSWORD` and `SESSION_SECRET` before use.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local server on port 3001 |
| `npm test` | Vitest unit tests |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run build` | Production build (still local/SQLite) |
| `npm run db:seed` | Seed owner, pipeline stages, form template |

## Security notes (Phase 1)

- Single-owner password auth with scrypt hash and signed httpOnly session cookie
- Invitation tokens stored as SHA-256 hashes only (Increment 2+)
- Email adapter is log-only mock — no real sends
- Uploads go under `STORAGE_ROOT` outside `public/`
- Never log passwords, session secrets, raw tokens, or form contents

## Production readiness (not this phase)

Managed Postgres, production auth, durable private storage, distributed rate limiting, email provider, backups, retention policy, and security testing must be completed before production use.
