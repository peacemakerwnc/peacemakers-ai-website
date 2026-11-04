# Per-project security checklist

**Status:** Proposed. James has not approved applying it. Do not change app code, dependencies, GitHub settings, env vars, secrets, or any other repo from this document.

**Source:** The 23 October 2026 Instagram Reel from [@intentionally_](https://www.instagram.com/intentionally_/) (https://www.instagram.com/reel/De14JcnKTYm/), checked against CISA, FTC, IRS, and GitHub’s own docs. The claim check is in [the ideas log](../ideas/CONSULTING_IDEAS_LOG.md). The pass over this repository is in [the audit](AUDIT_PEACEMAKERS_AI_WEBSITE.md).

**How to use it:** Copy the project section once per repo. Fill the evidence column with a file path, a setting name, or “not in git — James confirmed.” A blank evidence cell means the item is not done. An agent may prepare the evidence. An agent may not “fix” the row until James approves that row.

`docs/ai-practice/` is not on `main`. Where this list says “practice playbook,” it means the safety playbook on branch `cursor/ai-practice-compliance-demo-028f`: keys in a password manager or a host secret, not in git and not in a personal chatbot; least privilege; rotate a leaked key the same day. The standards on `main` still govern: `HUMAN_APPROVAL_STANDARD.md` and `AGENT_SECURITY_STANDARD.md`.

## What this list is

The Reel mixes a household weekend with one developer paragraph. Only the rows below are in scope for a software project. They are the Reel’s valid points, rewritten as the control the official guidance actually describes.

| Reel line | Do this instead |
| --- | --- |
| Password manager and strongest passwords | Unique long passwords for the repo host, the deploy host, email, the registrar, and any API vendor. Stored in a password manager. |
| Two-factor everywhere, SMS last | Phishing-resistant MFA (passkey or hardware key) on those same accounts. An authenticator app if a passkey is not offered. SMS only where the vendor allows nothing else. |
| Update Node and all packages | A lockfile. A reviewed bump when an advisory applies. Not a blind `npm update`. |
| Ask Grok, daily, because it watches Twitter | Dependabot security updates, or `npm audit` / OSV against the lockfile, on a schedule a person reads. An LLM may explain a diff. It is not the scanner and it does not get standing write access. |
| Update Claude Code if you use agents | Update the agent tool on the machine that runs it when the vendor ships a security fix. Do not give that agent every repo. |

## What this list is not

Do not apply these inside a client repo or a Peacemakers repo. They can be personally valid. They are not software work.

- SIM PIN, or a PIN on the carrier account (FTC: the account PIN is the control that matters for a remote SIM swap).
- Credit freeze at the bureaus (FTC).
- IRS Identity Protection PIN.
- Printed statements, cash, food, water, a map, a generator.
- A daily Grok, Claude, or Cursor job whose prompt is “audit all projects and action the fixes.”

## Checklist

Mark severity for a miss, not for the existence of the row. Critical means a live secret in the tree or a known exploited path you can point at. High means a direct dependency inside a published high or critical advisory range, or an admin account with no MFA. Medium means the control is missing and the asset is real. Low means defense in depth on a static site.

### 1. Accounts a person holds

These are not visible in git. The evidence is James saying he checked, or a screenshot he keeps outside the repo.

- [ ] GitHub account for the org or user that owns the repo: password manager, unique password, passkey or hardware key.
- [ ] Deploy host (Vercel, Railway, or whatever this repo uses): same.
- [ ] Email that receives password resets for those accounts: same. Email is the skeleton key.
- [ ] Registrar and DNS host: same.
- [ ] Password manager itself uses a long passphrase and phishing-resistant MFA.
- [ ] No SMS as the only second factor on GitHub, the host, or email, unless the vendor has no other option. Record the exception.
- [ ] People who do not need the account are not collaborators. A shared family vault is not a substitute for a separate deploy token.

### 2. Secrets

- [ ] `.env` and `.env.*` are gitignored, with a committed `.env.example` of placeholders only.
- [ ] Search the tree for live keys (provider prefixes, private-key blocks, connection strings with real hosts). A hit is Critical until it is rotated. Rotating is a separate approval.
- [ ] Production secrets live in the host’s secret store or a password manager. Not in a chat, not in a Reel comment, not in an agent transcript that gets committed.
- [ ] CI secrets are GitHub Actions secrets (or the host equivalent), scoped to the workflow that needs them.
- [ ] If a key has been in a commit, a log, or a prompt, treat it as exposed. Rotate it the same day. Practice-playbook rule. James approves the rotation.
- [ ] Client files and client tokens are not in this repository. Billing and BookDirect already gitignore local client packets. Keep it that way.

### 3. Dependencies and runtime

Skip this section when the repo has no package manager. Say so in the evidence cell. Do not invent a `package.json`.

- [ ] A lockfile is committed (`package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`).
- [ ] `npm audit --package-lock-only` (or the equivalent) has been run on a stated date. Direct dependencies inside a high or critical advisory are listed with the advisory URL. Transitive noise is not a pile of “fixes” unless a direct package pulls them in.
- [ ] The offered fix is read before it is applied. A major bump (this pass: npm’s Prisma suggestion was 7.x) is not an automatic yes.
- [ ] Node (or the real runtime) is pinned in CI to a current line, and production uses a supported release. Record the version. “Update all packages” does not mean floating to whatever published today.
- [ ] Dependabot security updates, or a scheduled audit a person reads, is on. Secret scanning and push protection are on for the GitHub repo. Confirm in GitHub settings. This token cannot see those toggles.
- [ ] GitHub Actions are pinned to a commit SHA when the workflow can push or deploy. A floating `@v4` tag is a supply-chain input.
- [ ] Workflow permissions are the minimum. `contents: write` plus `git push` is a privileged robot. It needs a reason written next to it.
- [ ] No scheduled agent has permission to open a pull request, push, or change production from a standing “audit the repos” prompt.

### 4. App controls, only where the repo has an app

Skip on a static site.

- [ ] Admin sign-in is not a single shared password unless a written pilot decision says so, with an expiry. MFA or SSO is the steady state. Owner Ops today is the written exception. Do not silently remove it and do not silently widen it.
- [ ] Session cookies are httpOnly and signed. Invitation or reset tokens are stored hashed.
- [ ] Rate limits on login and on public form posts exist, and production does not use an in-memory limiter that resets on every serverless instance.
- [ ] Security headers exist for the app that takes untrusted input (type options, framing, referrer, a content security policy that is as tight as the app allows). A marketing site of static HTML is a lower bar. Record what it has.
- [ ] Request bodies that hit a schema (Zod or otherwise) have a size limit. A parser advisory that is “memory exhaustion on a huge collection” matters on a public form.
- [ ] Row-level security is the database’s job only when the product is multi-tenant Postgres and the app is supposed to rely on it. This Reel does not require RLS. Owner Ops isolates by company in application code. Do not add RLS as a drive-by.

### 5. Agents and third-party scripts

- [ ] Claude Code, Cursor, or any other agent on a maintainer’s machine is on a current security release before it is pointed at a repo that holds secrets.
- [ ] The agent’s context for a client repo does not include `.env`, production connection strings, or a dump of the secret store.
- [ ] Browser scripts loaded from a third-party host (a CDN, tag manager, analytics) are listed. A version pin or a self-hosted copy is preferred for an app. A marketing tag is a conscious choice, not an accident.
- [ ] An agent is not told to “action” a finding across repos. One repo, one approved change.

## Per-repo sheet

Copy this table. One row per checklist section is enough.

| Repo | Section | Applies? | Evidence | Miss, if any | Severity | Approved to change? |
| --- | --- | --- | --- | --- | --- | --- |
| | 1 Accounts | | | | | No |
| | 2 Secrets | | | | | No |
| | 3 Dependencies | | | | | No |
| | 4 App controls | | | | | No |
| | 5 Agents and scripts | | | | | No |

## Repos visible on peacemakerwnc, 25 October 2026

The GitHub token for this run could list public repositories for the user `peacemakerwnc`. It could not list private repositories (`GET /user` returned 403) and `peacemakerwnc` is not a GitHub organization (404). Private projects, if any, were not audited. Do not assume this is the full set.

| Repo | What it is | Last push seen | Measures that apply | Needs work? |
| --- | --- | --- | --- | --- |
| [peacemakers-ai-website](https://github.com/peacemakerwnc/peacemakers-ai-website) | This repo. Static marketing site, Owner Ops (Next.js), billing scripts, BookDirect static site. | 2026-10-23 | All five sections for Owner Ops. Sections 1, 2, and 5 for the static sites. Section 3 for Owner Ops only. The blog workflow is a section 3 and 5 item even though it does not `npm install` the app. | Yes. Findings are in the audit. Highest: Owner Ops Next.js and Zod are inside published advisory ranges, and nothing in the repo is set up to surface that. No live secret was found in the tree. |
| [christ-centered-discipleship-app](https://github.com/peacemakerwnc/christ-centered-discipleship-app) | Public static PWA. Daily Catholic discipleship content. No backend. README says no `localStorage`. Deploy note points at Railway as a static host. | 2026-04-15 | Section 1 on the GitHub account and the Railway project. Section 2: confirm no secret was added after this glance (this pass read the README, the file list, and the script tags in `index.html` only). Section 3: no package manifest, so there is nothing to `npm update`. Section 4: no. Section 5: `index.html` loads `https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js` plus a local content file. | Light. Review the unpkg script (pin, mirror, or accept it). Confirm GitHub and Railway use the account MFA in section 1. Do not point a daily write-capable agent at it. Not the Next.js problem. |

## Effort, risk, compliance

**Effort.** Section 1 is James, on his accounts, about an evening the first time and a few minutes when a new service is added. Section 2 is a search plus a rotation only if a search hits. Section 3 for a repo that already has a lockfile is one audit command and, if he approves, one dependency pull request with tests. Turning on Dependabot is a small config change that creates review work afterward. Section 5’s “do not schedule an agent” is a decision, not a build.

**Risk of doing the Reel literally.** A daily agent with repo write access can “fix” a major upgrade, print a secret into a transcript, or push to `main`. A blind package update can ship a break or a bad release. Rotating `OWNER_PASSWORD`, `SESSION_SECRET`, or a Stripe key without a plan takes Owner Ops or billing offline.

**Risk of doing nothing.** Owner Ops stays on Next `16.2.11` and Zod `4.4.3`, which `npm audit` flagged on 25 October 2026. Advisories are not the same thing as a proven intrusion. They are also not nothing. Details and the “we did not prove reachability” note are in the audit.

**Compliance.** No row is approval to change production, to rotate a secret, to email a client, or to buy a tool. Security changes are in the human-approval list. Do not tell a client the weekend list makes them safe from AI agents. That claim is not supported, and the practice playbook’s FTC note is the right caution: do not exaggerate what a control does. If a later pass finds personal information actually exposed, stop and follow the incident note in Owner Ops. Do not improvise a breach letter.

## Not approved

Changing any repository, enabling Dependabot, scheduling an audit agent, rotating secrets, or sending this checklist to a client as a finished security program.
