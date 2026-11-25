# Consulting ideas log

Ideas dropped for **Peacemakers AI** (classification B): the consulting practice for North Carolina builders, contractors, home services, and similar businesses in the $5–50 million range. Offers in view are the **$3,500 Blueprint**, then a monthly AI department at **$10,000, $15,000, or $20,000**.

This file is a log only. Nothing here is approved to build, schedule, send, or post.

`docs/ai-practice/` is not on `main`. The safety notes below follow `owner-ops/docs/peacemakers-operating-system/` (consulting, AI governance, human approval, agent security, evidence) and the practice playbook on branch `cursor/ai-practice-compliance-demo-028f`. That playbook says Peacemakers will not claim a time saving, an error rate, or a dollar return unless that client's own test is attached.

Evidence labels: VERIFIED, OBSERVED, INFERRED, HYPOTHESIS, ASSUMPTION, CONTRADICTED, UNKNOWN.

Related open notes, different drops: PR #40 (a production-engineering carousel; keep a short pre-ship check, and do not paste a client file into a consumer Claude chat), PR #54 (a weekend account-hardening list), and PR #58 (a legal checklist for a vibe-coded site). This entry is the security list only.

---

## 2026-10-28 — Twenty exposures on a vibe-coded app

**Status:** Logged. No guide requested. No prompt pasted into Claude. No scan, no setting change, no post.

**Classification:** (B) Peacemakers AI consulting. A pre-ship check for an app Peacemakers would generate, and a question set inside a Blueprint when the client already has a site, a checkout, or an agent. The homeschool accounts and the books are not the subject.

**Why this was saved.** James ships client work and this site with AI coding tools. The Reel is a timed list of ordinary web failures that show up when generated code is deployed as-is: a login check that lives in the wrong layer, a public `.git` directory, a public file bucket, a price the browser is allowed to set, an open database, a third-party script, an SMS bill, a chatbot that will follow instructions it was handed, a guessable session secret, and a handful of hosting mistakes. The caption's 45% line is the hook. The useful part is the list of classes, read against the vendor docs, before anything a customer would rely on.

**Source**

- Slack drop: James Fullen, `#peacemaker-ideas`, 28 October 2026, 8:25 AM ET. No note. [Permalink](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1793190324726309).
- Reel: https://www.instagram.com/reel/DfAnKQgB8U1/ — `murphmaxxing` (Aidan Murphy). Posted 27 October 2026. About 41 seconds, 1440×2560. At fetch: 2,440 likes, 1,300 comments. Those counts are a snapshot, not a reason to adopt the method.

**Caption (OBSERVED):** "AI-written code had security flaws in 45% of Veracode’s tests. Here’s what someone does with them. Comment “PATCH” and I’ll send you the guide. Paste it into Claude Code and it checks your app for all 20." Hashtags `#vibecoding #claudecode #cybersecurity #claude #appsecurity`.

**Fetch:** `yt-dlp` video, description, and metadata. On-screen text read from frames about twice a second. Whisper `tiny` on the voice track. The model misheard the close ("Claude" came out as "clocks"). The caption and the on-screen line both say Claude Code, and the list below is the on-screen list, not the transcript. The guide was not in the Reel. Comment bodies were not retrieved. This note does not record exploit steps.

**What is on screen**

Title card: "20 (niche) ways vibe coders are getting hacked." A countdown runs from 0:40. Each item highlights in turn, with a citation card. The bottom line the whole way through: Comment "PATCH" to get the whole guide. He is holding a spatula. That is a prop.

| # | On-screen name | What to check, if Peacemakers built the app | Card |
| --- | --- | --- | --- |
| 1 | Next.js header | Authorize in the route. Middleware is not the only check. Self-hosted Next.js is on a patched release. | GitHub Advisory, Mar 2025, CVSS 9.1. "Login check skipped when it lives in Next.js middleware." |
| 2 | .git folder | The host does not serve a `.git` directory. | Intruder, Aug 2026. "28,000 exposed .git repositories. 107 live Stripe secret keys recovered." |
| 3 | Supabase storage | Customer files sit in a private bucket. A public bucket is a public URL. | Supabase docs. "Anyone who possesses the asset URL can readily access the file." |
| 4 | Price from the browser | The server computes the amount. The browser sends a selection, not a price. | Stripe docs. "Recalculate amounts on your server. Don't trust client-provided prices or totals." |
| 5 | Credential stuffing | Unique passwords and MFA on the accounts that matter. Rate-limit the login. | Verizon DBIR, 2025. "19% of all login attempts were credential stuffing. Median daily figure." |
| 6 | Open database | The database is not on the public internet without authentication. | BleepingComputer, Jul 2020. "~4,000 open databases deleted by an automated script." |
| 7 | Polyfill.io | No script tag points at a CDN domain the project does not control. | Sansec, Jun 2024. "100K+ sites embedded cdn.polyfill.io then caught injecting malware on mobile devices." |
| 8 | SMS pumping | A verification text is rate-limited, and countries the client does not serve are off. | Twilio. "Your business pays for every message sent to those numbers." |
| 9 | Prompt injection | Tools the model can call are narrow. Secrets stay out of the prompt. A person approves a consequential action. | OWASP. "LLM01. Prompt injection, OWASP Top 10 for LLM apps (2025)." |
| 10 | Weak JWT secret | The session secret is long and random, stored as a host secret. | PortSwigger. A short secret can be guessed. The card's sentence describes that. |
| 11 | Race condition | A coupon, a quantity, or a balance is enforced in one server transaction. | PortSwigger. The card describes exceeding a business-logic limit. |
| 12 | Account pre-hijacking | The email is verified before the account can be used. | USENIX Security, 2022. "26 of 75 popular services vulnerable to account pre-hijacking, at least." |
| 13 | Subdomain takeover | DNS for a retired host is removed. | Silent Push, Jul 2026. "3,254 of 16,000 dangling subdomains taken over, automatically." |
| 14 | SSRF | The app does not fetch a URL a user supplied. Cloud metadata is not on that path. | AWS Security Blog. The card says a metadata service can expose cloud credentials. |
| 15 | Path traversal | User input does not choose a file path. | PortSwigger logo, plus Apache CVE-2021-41773, labeled "critical." |
| 16 | Reset poisoning | The host on a password-reset link is chosen by the server. | PortSwigger. The card says the reset token can be delivered to the wrong server. |
| 17 | Source maps | Production does not ship a source map that contains the original source. | The Hacker News, Apr 2026. "510,507+ lines of Claude Code readable from one source map." Anthropic: "not a security breach." |
| 18 | Clickjacking | A page that changes state sends a framing header. | OWASP. The card describes an invisible frame. |
| 19 | Open redirect | A redirect stays on an allow-list. | OWASP. The card describes a link to an unvalidated site. |
| 20 | User enumeration | Login and reset responses stay generic. | OWASP Authentication Cheat Sheet. The card says different errors reveal which emails are real. |

**Claim check**

| Claim | Label | Source |
| --- | --- | --- |
| AI-written code had security flaws in 45% of Veracode's tests. | VERIFIED for the lab, and too broad for a client | [Veracode, 2025 GenAI Code Security Report](https://www.veracode.com/blog/genai-code-security-report/) and the [PDF](https://www.veracode.com/wp-content/uploads/2025_GenAI_Code_Security_Report_Final.pdf), retrieved this pass. Across 100+ models and 80 code-completion tasks, 45% of tasks introduced a known OWASP Top 10 flaw. The tasks were single functions with no security guidance. That is not "45% of a contractor's app is unsafe," and it is not a Peacemakers result. |
| Next.js middleware login bypass, CVSS 9.1, March 2025. | VERIFIED | [GHSA-f82v-jwr5-mffw](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw), published 21 March 2025, CVSS 9.1. Patched in 12.3.5, 13.5.9, 14.2.25, and 15.2.3. Vercel-hosted deployments were not affected. Self-hosted `next start` was. The control is the patched release plus a check in the route. This note does not record the bypass. |
| 28,000 exposed `.git` repositories and 107 live Stripe secret keys, Intruder, August 2026. | PARTLY | [Intruder, 20 August 2026](https://www.intruder.io/research/api-keys-bank-details-disciplinary-files-what-28-000-exposed-git-repos-gave-up). 28,000 exposed repositories from 3.5 million hosts, and 107 Stripe API keys recovered. Intruder says a handful of those Stripe keys were still valid, not that all 107 were live. The card's "live" is the creator's compression. Blocking `.git` at the host is the control. Intruder's scanner is not a tool to adopt from this Reel. |
| Supabase: anyone with the asset URL can read a public bucket. | VERIFIED | [Supabase storage buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals). The on-screen sentence matches the docs. Customer files belong in a private bucket. |
| Stripe: recalculate amounts on the server. | VERIFIED | [Stripe, dynamically update payment amounts](https://docs.stripe.com/payments/advanced/dynamically-update-amounts). The on-screen sentence matches the security best-practice line. |
| Verizon DBIR 2025: 19% of login attempts were credential stuffing, median daily. | VERIFIED as their SSO sample, and the wrong number for a small firm | [Verizon, credential-stuffing research alongside the 2025 DBIR](https://www.verizon.com/business/resources/articles/credential-stuffing-attacks-2025-dbir-research/). Median daily share of authentication attempts in SSO logs was 19% overall, 25% at enterprise size, and 12% at small businesses. A $5–50M contractor is closer to the 12% line if a number is used at all. It is not that client's measured rate. |
| About 4,000 open databases deleted, BleepingComputer, July 2020. | VERIFIED for that week | [BleepingComputer, 25 July 2020 update](https://www.bleepingcomputer.com/news/security/new-meow-attack-has-deleted-almost-4-000-unsecured-databases/). "Almost 4,000" unsecured databases wiped in the Meow incident as of 25 July 2020. Later counts were higher. The databases had no authentication. It is a 2020 event about exposed databases, not evidence that a 2026 generated app will be wiped. |
| Sansec, June 2024: 100K+ sites on `cdn.polyfill.io` were serving malware to mobile devices. | VERIFIED | [Sansec, 25 June 2024](https://sansec.io/research/polyfill-supply-chain-attack). The domain had changed owners. The control is to remove a script tag that points at a domain the project does not control. |
| Twilio: the business pays for every pumped SMS. | VERIFIED as the class. The on-screen sentence is a paraphrase | [Twilio, What is SMS pumping fraud?](https://www.twilio.com/docs/glossary/what-is-sms-pumping-fraud) and [Twilio's SMS pumping brief](https://resources.globalfintechseries.com/whitepapers/FTS-Twilio-The-State-of-SMS-Pumping-Fraud-How-to-Combat-This-Growing-Threat-to-Businesses.pdf): the business pays for the messages. This pass did not find the card's sentence verbatim. |
| Prompt injection is LLM01 in the 2025 OWASP Top 10 for LLM apps. | VERIFIED | [OWASP LLM01:2025](https://genai.owasp.org/llmrisk/llm01-prompt-injection/). OWASP says there is no foolproof prevention. The mitigations that match this practice are a narrow tool list, secrets kept out of the prompt, and a person on the consequential step. That is already `AGENT_SECURITY_STANDARD.md`. |
| USENIX Security 2022: 26 of 75 services vulnerable to account pre-hijacking. | CONTRADICTED on the count | [Sudhodanan and Paverd, USENIX Security 2022](https://www.usenix.org/conference/usenixsecurity22/presentation/sudhodanan). The paper says at least 35 of 75 popular services, not 26. The class is real. Verify the email before the account is usable. |
| Silent Push, July 2026: 3,254 of 16,000 dangling subdomains taken over automatically. | PARTLY | [Silent Push, Danglegeddon, 30 July 2026](https://www.silentpush.com/blog/danglegeddon/). From 12,500 apex domains they isolated 16,000 dangling subdomains and automated takeover of 4,000. The card's 3,254 was not in that post. The control is to delete DNS that points at a host that no longer exists. This note does not adopt their simulation. |
| Apache CVE-2021-41773 is critical path traversal, as the card says under a PortSwigger logo. | VERIFIED that the CVE is real and NVD scores it 9.8. The logo is the card's | [NVD, CVE-2021-41773](https://nvd.nist.gov/vuln/detail/cve-2021-41773). Apache HTTP Server 2.4.49 only. The 2.4.50 fix was incomplete (CVE-2021-42013). It is not a Next.js default. This pass did not re-read a PortSwigger page for the sentence on the card. |
| 510,507+ lines of Claude Code readable from one source map, April 2026, and Anthropic said it was not a security breach. | VERIFIED as the incident. The exact line count was not confirmed | [The Hacker News, 1 April 2026](https://thehackernews.com/2026/04/claude-code-tleaked-via-npm-packaging.html) and [BleepingComputer](https://www.bleepingcomputer.com/news/artificial-intelligence/claude-code-source-code-accidentally-leaked-in-npm-package/). Claude Code 2.1.88 on npm briefly included a source map. Anthropic told reporters it was a packaging error, not a security breach, and that no customer data or credentials were exposed. Published counts are about 500,000 lines (BleepingComputer) and more than 512,000 (The Hacker News). 510,507 was not the figure in the pages retrieved. The lesson for a client app is narrower: do not publish a source map that embeds the original source. |
| PortSwigger, AWS, and OWASP sentences on items 10, 11, 14, 16, 18, 19, and 20. | OBSERVED on the card. The classes are real. The exact sentences were not re-read this pass | Session secrets, business-logic limits, server-side fetches, reset-link hosts, framing, redirects, and generic auth errors are documented by those organizations. Use their current pages when a check is written. Do not treat the card's wording as the spec. |

**Whether it applies**

| Surface | Fit |
| --- | --- |
| Client system to build | When a build includes a login, a file bucket, a payment, an SMS code, or a chatbot. A person walks the rows that match that build, from the vendor docs, before the client relies on it. An agent does not receive a stranger's prompt and a repo and get told to "check all 20." |
| Blueprint assessment | A short question set when the client has a site or an agent. Who authorizes a request. Whether `.git` is reachable. Whether a price is computed on the server. Whether customer files are in a public bucket. Whether a source map ships. Whether a person approves an agent's consequential step. Evidence for the assessment. The Veracode 45% line stays out of the deck. |
| Offer or pricing | No new product and no price from this Reel. |
| Outreach and own marketing | No post, no "comment PATCH" keyword, and no sales line that a prospect's app is 45% unsafe. `peacemakers-ai/security.html` already states the practice: client-controlled data, least access, approval before a change. |
| This marketing site | Static HTML. The Next.js middleware advisory does not apply to it. Worth a look, separately and only if James asks: the host does not serve a `.git` directory, and third-party scripts are the ones already chosen (Tag Manager, Analytics, Clarity). |
| Internal stack | If a generated app is self-hosted Next.js, confirm a patched release and a check in the route. Session secrets stay in the host, not in a chat. |

**The part to leave alone.** Commenting PATCH, and pasting an unseen guide into Claude Code against a repo. The guide was not in the Reel. A personal Claude login is not the account for a client file (practice playbook). An unseen prompt plus a repo can send the code out or turn a review into a scan. Intruder's internet-wide `.git` scanner is the same kind of leave-alone.

**Effort.** This pass is the log. A later one-page check, written from the vendor pages above and limited to the rows a given build actually has, is a short writing job after James asks for it. No install in this pass.

**Risk.** Treating the caption as a scanner. Quoting 45%, 19%, 26 of 75, 3,254, or "107 live Stripe keys" in a proposal. Running someone else's security prompt with repo access. Marketing the list as proof a client is secure.

**Compliance.** A claim about a client's exposure needs that client's own observation (`docs/ai-practice/compliance-playbook.md` on the open branch; FTC Act Section 5 as summarized there). Secrets stay in a password manager or a host secret, not in the repo and not in a personal chatbot. Permission changes, production config, and secret rotation need James (`HUMAN_APPROVAL_STANDARD.md`). Security is enforced in the app and the host, not in a prompt (`AGENT_SECURITY_STANDARD.md`). North Carolina breach notice is a lawyer's question if personal information is actually acquired. It is not triggered by this Reel. No ROI claim is supported.

**Not approved:** commenting on the Reel, DMing for the guide, pasting any prompt from this Reel into Claude or Cursor, scanning a repo or the internet, changing Next.js versions, DNS, storage rules, Stripe code, or env vars, and posting or emailing any line from the caption.
