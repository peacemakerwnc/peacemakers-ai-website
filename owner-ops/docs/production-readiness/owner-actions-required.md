# Owner actions required

Items the owner (James) must supply, confirm, or approve before a real-client pilot send.  
**No secrets belong in this file** — only checklists and placeholders.

## Approvals (explicit yes required)

| # | Approval | Status |
|---|----------|--------|
| A1 | Vercel project for fictional pilot | **Done** (`owner-ops-fictional-pilot`) |
| A2 | Neon production Postgres project | **Done** (`plain-fire-35687465`) |
| A3 | Neon non-prod restore target / drill | **Done** — C6-R branch `owner-ops-restore-drill-2026-08-07` retained |
| A4 | Resend + verified sending domain | **Done** (C5-R delivery proven) |
| A5 | Upstash Redis for rate limits | **Done** (C5-R login rate limit proven) |
| A6 | Optional Sentry | **Deferred** — accept console/Vercel logs unless separately authorized |
| A7 | Accept estimated pilot spend band | Owner confirm before real send |
| A8 | Accept single-owner password auth **for this pilot only** (no MFA/SSO) | **Explicit decision required** |
| A9 | Accept `DISABLE_CLIENT_UPLOADS=true` (paste-first) | **Offline confirm required** before real send |
| A10 | Accept privacy notice operational copy `pilot-2026-08-07` (legal review may still be needed) | **Explicit decision required** |
| A11 | Final deliberate approval to send the **first real** invitation | **Blocked** until C7 accepts + separately scoped written authorization |

## Credentials / env (Vercel Production — confirm offline; never paste here)

| Variable / control | Owner action |
|--------------------|----------------|
| `DATABASE_URL` | Confirm still Production Neon `main` (not restore-drill branch) |
| `OWNER_EMAIL` / `OWNER_NAME` / `OWNER_PASSWORD` | Confirm production identity; password ≥12; no in-app reset |
| `SESSION_SECRET` | Unique production secret |
| `APP_BASE_URL` | `https://owner-ops-fictional-pilot.vercel.app` (or final HTTPS URL) |
| `EMAIL_PROVIDER=resend` | Confirm |
| `RESEND_API_KEY` / `EMAIL_FROM` | Confirm verified sender |
| `ALLOW_LOG_EMAIL_IN_PRODUCTION` | Confirm **off / false** |
| `RATE_LIMIT_BACKEND=upstash` + Upstash REST vars | Confirm |
| `DISABLE_CLIENT_UPLOADS=true` | Confirm |
| `SENTRY_DSN` | Optional / unset unless authorized |

## Operational confirmations

| # | Action | Status |
|---|--------|--------|
| O1 | Restoration test into **non-prod** | **PASS** — C6-R 2026-08-07 |
| O2 | Deployed fictional rehearsal (smoke + invitation email + rate limit) | **PASS** — C3-R / C4 / C5-R |
| O3 | Launch docs / GO-NO-GO current | **Updated** — C6-R |
| O4 | C7 read-only readiness re-review | **Required next** |
| O5 | [pilot-operating-checklist.md](./pilot-operating-checklist.md) for the **specific real recipient** | Pending at first-client time |

## Preserved risks (do not mark as passed)

- No in-app password reset
- Initial invitation send has no 60s duplicate-send debounce
- Privacy notice not legal-reviewed
- No Sentry unless authorized
- Invitation model requires Contact + Company + Opportunity + FormInvitation

## Explicitly not requested yet

- Phase 2 features
- Multi-user SSO / MFA
- Durable file storage / re-enabling uploads
- Real-client invitation (requires C7 + separate authorization)
