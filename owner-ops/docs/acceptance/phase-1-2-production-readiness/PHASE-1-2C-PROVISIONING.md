# Phase 1.2C — Approval A provisioning evidence

**Date verified:** 2026-08-06 (Resend + Upstash create; final re-verify)  
**HEAD:** `b217964`  
**Approval A status:** **COMPLETE**  
**Secrets:** None printed or committed. Credential files off-repo only.

No Git connect, DNS, deploy, migration, data load, email send, Vercel env injection, app-code change, Spend Management mutation, Sentry, or Approval B occurred.

---

## Baseline (this run)

| Item | Result |
|------|--------|
| Branch | `main` |
| HEAD | `b217964793c57ad6da161010232b35a41fae698c` |
| Ahead of origin | 19 |
| Owner-ops app paths | Clean (no app-code changes this run) |
| Unrelated staged/dirty work | Preserved |
| Docs | Phase 1.2C markdown updated (untracked / local only; not staged) |

---

## Sanitized final resource inventory

| Provider | Workspace / org | Resource | Nonsensitive ID | Region | Plan | Status | Verified |
|----------|-----------------|----------|-----------------|--------|------|--------|----------|
| Vercel | `peacemakers-ai` | Team | `team_dIb4nfhx01tSybQ9270iqCRN` | — | **Pro active**, 1 seat | OK | 2026-08-06 |
| Vercel | same | Project `owner-ops-fictional-pilot` | `prj_6xdn2NcCszENxu7QEn8XFxbZYUYh` | iad1 (intended) | Pro | Undeployed; **no Git**; 0 deployments | 2026-08-06 |
| Vercel | same | Spend Management on-demand budget **$30** | — | — | Pro feature | Alerts + SMS + **Pause On**; webhook blank | 2026-08-06 |
| Neon | `org-dry-glade-15547133` (James) | Project `owner-ops-fictional-pilot` | `plain-fire-35687465` | **aws-us-east-1** | Free (fictional only) | Present; untouched this run | 2026-08-06 |
| Neon | same | Branch `main` | `br-nameless-grass-au0r24j1` | same | Free | Ready; untouched | 2026-08-06 |
| Neon | same | Branch `owner-ops-fictional-restore` | `br-wild-union-au9acvon` | same | Free | Ready; isolated | 2026-08-06 |
| Neon | same | Snapshot `owner-ops-fictional-baseline` | `snap-wandering-resonance-aufi75xr` | same | Free | Present | 2026-08-06 |
| Resend | Workspace **`peacemakersai`** (`james@peacemakersai.com`) | API key `owner-ops-fictional-pilot` | — | — | **Free** ($0 / mo) | Created; Sending access | 2026-08-06 |
| Upstash | Account workspace **Personal** (business owner `james@peacemakersai.com`; no separate Peacemakers team) | Redis `owner-ops-fictional-pilot-ratelimit` | `437c7d0e-0513-4cb8-96a5-90f4d0a3c2fe` | **us-east-1** (N. Virginia) | **Free Tier** | Active; $0.00 | 2026-08-06 |
| Sentry | — | — | — | — | Deferred | Not created | 2026-08-06 |

**Authorization:** All of the above are for **fictional rehearsal only**. Free tiers must be **reevaluated before a paying-client pilot**.

**Deletion (sanitized):** Remove Vercel project; Neon project/branches/snapshot; Resend API key `owner-ops-fictional-pilot`; Upstash Redis database `owner-ops-fictional-pilot-ratelimit`; delete off-repo credential files under the secure store directory.

---

## Vercel (read-only final verification)

| Fact | Result |
|------|--------|
| Pro active, 1 paid seat | VERIFIED |
| `$30` on-demand budget | VERIFIED (`$0 / $30 (0%)`) |
| Notifications On; thresholds 50/75/100 | VERIFIED (prior My Notifications + Billing) |
| SMS enabled | VERIFIED (prior) |
| Pause Projects On; Pause Production Deployments checked | VERIFIED |
| Pause at 100% of $30 | VERIFIED (pause at spend amount) |
| Webhook blank | VERIFIED |
| Project undeployed; Git disconnected | VERIFIED (`0` deployments; `hasGitLink=false`) |
| Settings changed this run | **None** |

---

## Neon (read-only final verification)

| Check | Result |
|-------|--------|
| Free project `plain-fire-35687465` in aws-us-east-1 | Present (prior evidence; not mutated) |
| Primary `main`, restore branch, baseline snapshot | Present; untouched this run |
| Migration / restore / connection test / data load | **None** |
| App/Vercel integration | **None** |
| Off-repo store | `neon.env` present (mode `600`; not re-read) |

---

## Resend

| Field | Value |
|-------|-------|
| Provider | Resend |
| Business workspace | **`peacemakersai`** confirmed |
| Plan | **Free** — Transactional 3,000 emails/mo $0; Marketing 1,000 contacts $0; no payment method; no invoices |
| Key label | `owner-ops-fictional-pilot` |
| Permission scope | **Sending access** (not Full access) |
| Creation status | Created 2026-08-06 |
| Purpose | Fictional pilot transactional send (later Approval D only) |
| Env var (secret) | `RESEND_API_KEY` |
| Env vars (planned names only; not created) | App-aligned: `EMAIL_PROVIDER`, `EMAIL_FROM`, `ALLOW_LOG_EMAIL_IN_PRODUCTION` — do **not** plan `RESEND_FROM_EMAIL` / `RESEND_REPLY_TO_EMAIL` |
| Secure storage | Off-repo file `resend.env` under `~/Library/Application Support/PeacemakersAI/owner-ops-fictional-pilot/` (dir `700`, file `600`) |
| Domain / DNS | **None** |
| Email sent | **None** |
| Vercel / app integration | **None** |

---

## Upstash

| Field | Value |
|-------|-------|
| Provider | Upstash Redis |
| Business account | Authenticated owner account; workspace **Personal** (only workspace; no Peacemakers team to select) |
| Resource name | `owner-ops-fictional-pilot-ratelimit` |
| Nonsensitive ID | `437c7d0e-0513-4cb8-96a5-90f4d0a3c2fe` |
| Region | **us-east-1** (N. Virginia, USA) — closest Free AWS option to Vercel iad1 |
| Plan | **Free Tier** — Monthly $0; COST $0.00 |
| Status | Active |
| Free limits (UI) | **500k commands/mo**, **256 MB** storage, **50 GB** bandwidth; also listed Free row: 10k cmds/s class limits, 10 MB request, 100 MB record, 256 MB data, 50 GB bandwidth |
| PAYG / paid add-ons | **Not enabled** (Choose Plan disabled without payment method) |
| Eviction | Off at create |
| Env vars | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Secure storage | Off-repo file `upstash.env` (mode `600`) in same secure directory |
| Vercel / app integration | **None** |
| Redis commands / data load | **None** |

---

## Credential storage summary

| File | Env keys | Mode |
|------|----------|------|
| `neon.env` | (prior Neon connection vars) | `600` |
| `resend.env` | `RESEND_API_KEY` | `600` |
| `upstash.env` | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | `600` |

Directory: `~/Library/Application Support/PeacemakersAI/owner-ops-fictional-pilot/` (`700`). Not in Git.

---

## Remaining dependencies (after Approval A)

None for Approval A itself. Next gate requires **separate Authorization B** (see CONFIG-PLAN).

---

## Boundary confirmation

No Git, push, commit, DNS, deployment, public URL, migration, database test, restoration, data load, email, provider↔Vercel/app wiring, real-client data, Sentry, paid upgrades, Spend Management changes, or Phase 2 / Approval B.
