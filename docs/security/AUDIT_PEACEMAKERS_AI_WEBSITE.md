# Audit — peacemakers-ai-website against the 23 October 2026 Reel

**Date:** 25 October 2026.
**Scope:** This repository only, read-only, plus a public glance at the other repo the token could see. No file outside `docs/ideas/` and `docs/security/` is part of the change. No dependency was installed into the app. No secret was printed.
**Method:** The Reel was fetched and transcribed (see the [ideas log](../ideas/CONSULTING_IDEAS_LOG.md)). This tree was then checked against the measures that survived that claim check. `npm audit --package-lock-only` was run in `owner-ops/` against the committed lockfile. A pattern search covered common live-key prefixes and private-key blocks.
**Standards:** `owner-ops/docs/peacemakers-operating-system/HUMAN_APPROVAL_STANDARD.md`, `AGENT_SECURITY_STANDARD.md`. The practice playbook on `cursor/ai-practice-compliance-demo-028f` (not on `main`) for secrets and least privilege.
**Checklist this audit is scored against:** [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md).

## Exposed secrets

**None found.** The pattern search did not hit a live Stripe key, a GitHub token, a cloud key, an OpenAI-style key, or a private-key block. `.env` and `.env.*` are gitignored. `owner-ops/.env.example` and `billing/.env.example` use placeholders (`change-me-before-use`, `rk_live_or_sk_test_...`). Billing docs say `rk_live_...` as an example, not a key.

That is a search, not a proof. It does not see Git history that was later rewritten, and it does not see GitHub or Vercel secret stores. If a later pass finds a real value, treat it as Critical, stop, and rotate it under a separate approval. Do not paste the value into a doc or a chat.

## Most important finding

**F1. Owner Ops is on Next.js 16.2.11, which `npm audit` places inside several published GitHub advisory ranges, and the repo has no Dependabot config and no audit step in CI.**

This is the Reel’s “update your packages and audit the repos” point, done the way GitHub and npm describe it, not the way the Reel describes it. Reachability was **not** proven. No exploit was attempted. James approves any bump separately.

## What is already in good shape

These are here so a later pass does not “fix” them.

| Control | Where | Note |
| --- | --- | --- |
| Password hashing | `owner-ops/src/lib/crypto.ts` | scrypt with a random salt. Invitation tokens are random and stored as a SHA-256 hash. |
| Secrets contract | `owner-ops/.env.example`, `owner-ops/src/lib/env.ts` | Placeholders. Zod requires `OWNER_PASSWORD` of at least 12 characters and `SESSION_SECRET` of at least 32. Production notes say real values stay in the host UI. |
| Rate limit | `owner-ops/src/lib/rate-limit.ts`, `owner-ops/src/lib/production-guards.ts` | Production is supposed to refuse the in-memory limiter and require Upstash. The pilot record says that env control is confirmed offline before a real send. |
| App headers | `owner-ops/next.config.ts`, `owner-ops/vercel.json` | nosniff, frame deny, referrer, permissions policy, CSP, HSTS. CSP still allows `'unsafe-inline'` and `'unsafe-eval'` for scripts. That is a known looseness, not a Reel item. |
| Pilot MFA exception, already written down | `owner-ops/docs/acceptance/phase-1-2-production-readiness/GO-NO-GO.md` | Single-owner password, no MFA/SSO, “for this pilot only.” Recovery is rotating `OWNER_PASSWORD` in Vercel. Do not treat the absence of MFA as a surprise, and do not add MFA in a drive-by. |
| Marketing and BookDirect have no npm app | `peacemakers-ai/`, `bookdirect/` | Nothing to `npm update`. |
| Client packets stay local | `.gitignore` | `billing/clients/**` and `bookdirect/docs/clients/*` are ignored, with the READMEs kept. |

## Findings

Severity is the miss against the checklist. “High” here means “a direct dependency is inside a published high or critical range, and nothing is tracking it.” It does not mean “this deploy was observed to be exploited.”

### F1 — High — Next.js 16.2.11 is behind published advisories

- **Evidence:** `owner-ops/package.json` depends on `next` `16.2.11`. `owner-ops/package-lock.json` resolves `node_modules/next` to `16.2.11`. `npm audit --package-lock-only` on 25 October 2026 reported a fix at `next@16.4.3` (not a major bump).
- **Advisory titles and ranges, as npm reported them** (re-read the GHSA before patching; this pass did not re-fetch each page):
  - [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36) — unauthenticated RCE on **Windows-hosted** servers. `>=16.0.0 <16.3.3`. Owner Ops is configured for Vercel region `iad1` (`owner-ops/vercel.json`), which is Linux. This particular advisory is unlikely to apply to that host. It still shows the version is behind.
  - [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) — unauthenticated RCE in the Image Optimization API when AVIF is used. `>=16.0.0 <16.3.3`.
  - [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw) — unauthenticated RCE in image optimization when SVG is used. `>=16.0.0 <=16.4.0`.
  - [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) — RCE in `next/og` `ImageResponse`. `>=16.2.0 <16.3.6`.
  - [GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr) — unauthenticated RCE in `use cache` functions that return typed arrays. `>=16.0.0 <=16.4.0`.
  - [GHSA-cjq9-62q9-8jv4](https://github.com/advisories/GHSA-cjq9-62q9-8jv4) — SSRF in image optimization. `>=16.0.0 <16.3.8`. High.
  - [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r) — denial of service in App Router server actions. `>=16.0.0 <=16.4.0`. High.
- **Reachability, this pass:** application source has no `next/image`, `next/og`, or `use cache` usage (`owner-ops/next-env.d.ts` only references Next’s image types). That lowers confidence that the image and cache RCEs are reachable. It does not clear the version. Server-action DoS depends on those routes existing, which a Next app has. No proof either way was attempted.
- **Why it matches the Reel:** “update Node and the packages” is the valid half of his developer paragraph. The invalid half is doing it blindly, or delegating it to a daily Grok task.
- **Not done here:** no bump. A later change, if approved, is a lockfile update to the patched 16.4 line npm named, then `npm test` and a look at the Next 16.3/16.4 release notes. Not a weekend `npm update` of the whole tree.

### F2 — High — Zod 4.4.3 is inside a published high advisory, and forms use Zod

- **Evidence:** lockfile resolves `zod` to `4.4.3`. npm audit range: `<4.6.6`. [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) — memory exhaustion while validating oversized constrained collections. `fixAvailable` was true. npm did not print a target version in the summary this pass. Confirm it on the advisory.
- **Use:** `owner-ops/src/lib/env.ts` and `owner-ops/src/lib/form-schema.ts`. The form schema is the one that faces untrusted input.
- **Reachability:** not proven. It needs a large payload to get at the parser. Login and form routes call the rate limiter. That is a mitigator, not a patch.
- **Not done here:** no bump.

### F3 — Medium — nothing in the repo surfaces those advisories

- **Evidence:** no `.github/dependabot.yml`. The only workflow is `.github/workflows/weekly-small-business-blog.yml`. It does not run `npm audit`. It does not install Owner Ops.
- **Gap:** a person learns about F1 and F2 only if someone remembers to run the audit. That is the failure the Reel is gesturing at, and Dependabot is the control GitHub documents.
- **Not done here:** Dependabot was not enabled. Turning it on will open pull requests. Those still need a human. James approves the config before anyone adds it.
- **Could not check:** GitHub secret scanning, push protection, and account 2FA. The token cannot read those settings. They are checklist section 1 and section 3, for James to confirm in the GitHub UI.

### F4 — Medium — the blog workflow is a privileged, tag-pinned robot

- **Evidence:** `.github/workflows/weekly-small-business-blog.yml`.
  - `permissions: contents: write` and `issues: write`.
  - `actions/checkout@v4` and `actions/setup-node@v4` are version tags, not commit SHAs.
  - On a due article it can `git push` to the default branch and, when `VERCEL_TOKEN` is present, deploy production (`python3 peacemakers-ai/scripts/publish-due-batch.py --deploy`).
  - Node in that workflow is `"24"`, which tracks the current 24 line. That part is fine for a Python publisher that does not ship the Owner Ops runtime.
- **Why it is here:** the Reel’s “audit and schedule it daily” advice, applied carelessly, looks like this job. This job already exists for publishing, which is a separate decision James has made. It should not also become a security-fix robot. Pinning the two actions to SHAs is a small hardening change, still not approved in this pass.
- **Secrets:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_SCOPE` are referenced as Actions secrets. They were not read.

### F5 — Medium — Owner Ops admin login is a password, on purpose, for the pilot

- **Evidence:** `owner-ops/docs/acceptance/phase-1-2-production-readiness/GO-NO-GO.md` lines on single-owner password authentication, no MFA/SSO, no in-app reset. `owner-ops/src/lib/crypto.ts` for the hash.
- **Reel:** his MFA ranking is valid for the GitHub, Vercel, and email accounts around this app. In-app MFA is a product change on top of a written pilot limit. It is not a weekend toggle.
- **Not done here:** no auth change.

### F6 — Low — Playwright 1.55.0 devDependency

- **Evidence:** lockfile `playwright` `1.55.0`. [GHSA-7mvr-c777-76hp](https://github.com/advisories/GHSA-7mvr-c777-76hp) — browser download did not verify the TLS certificate. Vulnerable below `1.55.1`. Dev machines only. Not the production server.
- **Not done here:** no bump.

### F7 — Low — do not take npm’s Prisma suggestion

- **Evidence:** `prisma` and `@prisma/client` are locked at `6.19.3`. npm audit marks `prisma` high **via** `@prisma/config` **via** `deepmerge-ts`, and offers `prisma@7.10.1`, which it flags as a semver major.
- **Decision this pass:** that is not an approved upgrade path. A stack-exhaustion bug in a transitive merge helper is not a reason to jump a major ORM. Re-check the deepmerge advisory on its own if someone schedules a Prisma 6 patch. Leave 7.x for a planned upgrade.

### F8 — Info — static sites

- **Marketing** (`peacemakers-ai/`, root `vercel.json`, `peacemakers-ai/vercel.json`): no package manifest. Third-party scripts are Google Tag Manager `GTM-M5L8TPDF`, GA4 `G-GTQ5YNER7P`, and Microsoft Clarity `wgrv405eqy` (see `peacemakers-ai/security.html` and the location pages). Those IDs are public. They are not secrets. They are a section 5 choice already in production. No change.
- **Headers:** root `vercel.json` and `peacemakers-ai/vercel.json` and `bookdirect/vercel.json` do not set security headers. Owner Ops does, in the app. The Reel does not ask for headers. Recorded so it is not mistaken for F1. Low, and out of scope for this Reel.
- **BookDirect and `content/`:** static or empty of application code. No lockfile. No secret pattern hit.
- **Billing:** Python scripts, `.env.example` placeholders, client packets gitignored. No live key in the pattern search. Section 1 still applies to the Stripe account James holds. Not inspected in the Stripe dashboard.

### F9 — Info — Node is unpinned for Owner Ops itself

- **Evidence:** `owner-ops/package.json` has no `engines` field. The blog workflow’s Node 24 pin does not apply to the Next app.
- **Reel:** “update Node.js” is valid as “run a supported release and install security releases.” Pinning a major in `engines` is a small, separate change. Not done here. Production’s actual Node version on Vercel was not queried.

## npm audit totals

`npm audit --package-lock-only` in `owner-ops/` on 25 October 2026 exited 1. Metadata: 1 critical, 12 high, 2 moderate, 0 low. The critical and most of the highs roll up under `next` and its transitive packages (`sharp`, `postcss`, and others). Direct items to act on, if James approves, are F1 (Next), F2 (Zod), and F6 (Playwright, dev). F7 (Prisma) is a major bump and is not on that list.

The locked `postcss` at the top level is `8.5.25`. The PostCSS advisory npm printed was `<=8.5.22`, so the top-level copy may already be outside that range. Nested copies can still be pulled by Next. Re-run the audit after any Next bump rather than chasing each transitive by hand.

## Other repository

[christ-centered-discipleship-app](https://github.com/peacemakerwnc/christ-centered-discipleship-app) is the only other public repo on `peacemakerwnc` this token could see. It was not cloned and not modified.

- Pushed 15 April 2026. Static PWA. README: no backend, no `localStorage` in the shell, HTTPS required to install.
- `index.html` script tags: a local `daily-content-2026.js`, and `https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js`. No `apiKey`, Firebase, or Supabase string in that file.
- **Needs work:** light. The unpkg script is the only third-party runtime spotted. Account MFA on GitHub and Railway is the Reel’s valid control, and it is not visible from the repo. There is no package audit to run.
- **Does not need** a Next.js bump, a Prisma bump, or a daily agent.

Private repos were not visible. If James has more projects, this checklist is what to run there. This pass did not.

## Effort and what a later approval would cover

| Item | Effort | Risk if rushed | Approval |
| --- | --- | --- | --- |
| F1 Next 16.2.11 → 16.4.3 (or whatever the advisory names when re-read) | One lockfile change, test suite, read the release notes | A framework bump can break the build. Lower risk than a blind update of every package. | Separate, explicit |
| F2 Zod past 4.6.6 | Small if the advisory’s fix is a minor | Form schema behavior should be re-tested | Separate, explicit |
| F3 Dependabot | A config file, then ongoing PR review | Noisy PRs. Still better than an agent that merges them | Separate, explicit |
| F4 pin Actions to SHAs | Small | A pin can go stale. That is the point. Review it | Separate, explicit |
| F5 in-app MFA | A product change, not a package bump | Easy to get wrong on a pilot that has no password reset | Not this Reel’s job |
| F6 Playwright 1.55.1+ | Dev dependency | Low | Can ride along with F1 if convenient. Still ask. |
| F7 Prisma 7 | A major upgrade | High. Do not do it to clear this audit | No |
| Section 1 account MFA | James, in the password manager and the vendor UIs | Low if he does not also rotate production secrets in the same sitting | His accounts. Not a commit |
| Daily Grok or Cursor “action all projects” | Would touch every repo the agent can see | Highest risk in the Reel | Do not approve |

## Compliance

- This audit is evidence. It is not a penetration test and not a statement that production is safe or unsafe.
- No client was contacted. No secret was rotated. No production setting was read or written.
- Do not quote F1 in a sales email as “AI hackers are inside the stack.” The advisories are version ranges. Intrusion was not observed.
- If James wants a client-facing line, the honest one is already on `peacemakers-ai/security.html`: client-owned accounts, least access, a person approves a change. The Blueprint check in the ideas log is the assessment version of F1–F5. It is not a new product.
