# Consulting ideas log

Ideas dropped for **Peacemakers AI** (classification B): the consulting practice for NC builders, contractors, home services, and similar businesses. Offers in view are the $3,500 Blueprint and the $10k / $15k / $20k monthly tiers.

This file is a log only. Nothing here is approved to build, schedule, send, or post.

Classification reminder:

- **(B) Peacemakers AI consulting** — client systems, the offer, demos, outreach, James's marketing, internal tools and stack. Logged here.
- **(A) @buildingpeacemakers homeschool** and **(C) Peacemakers Publishing** do not belong in this file.

`docs/ai-practice/` is not in this repo. Entries use the operating-system docs that are: `owner-ops/docs/peacemakers-operating-system/` (consulting, AI governance, human approval, agent security, evidence) and `owner-ops/docs/future-recommendation-philosophy.md`.

Evidence labels follow the evidence standard: VERIFIED, CLIENT_REPORTED, OBSERVED, INFERRED, HYPOTHESIS, ASSUMPTION, CONTRADICTED, UNKNOWN.

---

## 2026-10-25 — Instagram Reel “Are we using PHP?”

**Status:** Logged. No build, no client contact, no post.

**Classification:** (B) Peacemakers AI consulting. Unchanged after watching the Reel. It is a tech-stack / website-security take. It is not homeschool content and not a book.

**Source**

- Slack: James Fullen in `#peacemaker-ideas`, 2026-10-25 00:07 EDT — “Are we using PHp?” plus the Reel link. [Message](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1792901256882189).
- Reel: https://www.instagram.com/reel/DezwCisCVCO/ — posted 2026-10-22 by `lizthedeveloper` (display name “Future Infinitive”). About 1 minute 56 seconds. Caption (VERIFIED from the post metadata): “The surface area is surfacing #cybersecurity #php”. About 6.0k likes and 182 comments at fetch time.

**Fetch**

- Firecrawl scrape of the Instagram URL failed. Firecrawl returned: it does not support this site.
- `yt-dlp` downloaded the public video and the caption metadata.
- Working transcript below is from a review of the audio, checked against OCR of the burned-in captions. The captions track the speech. On-screen behind the speaker is an NCSC-style notice for CVE-2026-109618 and CVE-2026-109619, plus a later card about AI agents (“Swarm Traces”). OCR did not show a `php.ini` hardening tutorial. A comment under the Reel discusses a different, later issue (CVE-2026-115560, PHP advisory dated 2026-10-23). That comment is not the Reel.

**Working transcript** (speech; captions agree on the phrases in quotes)

- 0:00 “Well, half the internet is in danger.” “Basically 70% of the internet's websites are vulnerable.” Viewers who do not run websites cannot patch this themselves. The problem is servers people have forgotten about.
- 0:23 “PHP's never been the world's most secure.” “Laughably easy to hack,” and “this is a pretty bad one.” She says it is the same structural problem she talked about the day before: rogue agents. With this bug, those agents “can take control of like 70% of servers.”
- 0:52 Napkin math: if half of operators patch immediately, “35% of servers are now still affected.” If another slice patches within a month, she walks the remainder down through “those 30%,” “reduced the problem by 3.5%,” and “now we're at like 27%.” The rest is “this long tail.”
- 1:23 “The surface area” of devices that “can be botnetted or stolen by rogue AIs” is high. Similar bugs “come out every other day,” faster because AI can “read the code and try everything.”
- 1:48 “The mitigation? Don't use PHP. What were you doing using PHP? Switch to Rust.”

**What the Reel is actually about**

A reaction to the 21 October 2026 PHP security release (often called PHP2Shell), not a new tool and not a configuration recipe. The speaker’s recommended tactic is to abandon PHP for Rust. The page on screen is the “patch this runtime” notice. The voiceover treats “stop using the language” as the mitigation.

**Claim check** (do not treat the Reel as the advisory)

| Claim | Label | Check |
| --- | --- | --- |
| CVE-2026-109618 and CVE-2026-109619 are real critical PHP bugs that can allow unauthenticated remote code execution on PHP web servers (PHP-FPM, mod_php, php-cgi, FrankenPHP, LiteSpeed). PHP rates mod_php highest risk. | VERIFIED | [PHP advisory, 21 Oct 2026](https://www.php.net/archive/2026.php#2026-10-21-2). Fixed in PHP 8.5.12, 8.4.27, 8.3.36, and 8.2.35. PHP 8.1 and older are affected and out of PHP-project support; some vendors backport. PHP says updating is the only complete fix. |
| CISA told operators to patch immediately and, if they cannot, to take internet-facing PHP offline. As of the 21 Oct alert, CISA had not observed exploitation in the wild. | VERIFIED for that date | [CISA alert](https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching). “Not observed as of 21 Oct” is not a claim about today. |
| WordPress is affected only because it runs on PHP. No WordPress core update fixes it. Site Health shows the PHP version. | VERIFIED | [WordPress.org news, 21 Oct 2026](https://wordpress.org/news/2026/10/critical-php-security-release/). |
| “70% of the internet’s websites” and then “70% of servers” are still vulnerable, and rogue AI agents can take them over. | CONTRADICTED as stated | Wiz’s write-up uses “70% of all websites” for PHP’s install base. That figure is a language-share claim, not a measurement of who is still unpatched, and it is not “70% of servers.” The bugs have had a patch since 21 Oct. The rogue-agent botnet story is the creator’s hypothesis. Her 35% → 27% walk is arithmetic on that hypothesis, and it switches base from 70% to 30% mid-sentence. |
| “PHP has always been laughably easy to hack,” so the mitigation is “don’t use PHP, switch to Rust.” | CONTRADICTED as the fix | These two bugs are in the PHP runtime’s memory safety, which is why a patch matters even for a careful app. That does not make Rust the remediation. NCSC, CISA, PHP, and WordPress say: upgrade the interpreter, or take the unpatched site offline. A language rewrite does not patch a live WordPress host this week. |
| CVE-2026-115560 (mentioned in a comment, not in the Reel). | VERIFIED as a separate, narrower item | [PHP informational note, 23 Oct 2026](https://www.php.net/archive/2026.php#2026-10-23-1). PHP calls it an unlikely RCE path, not an emergency release. One mitigation they repeat from the 21 Oct notes is `session.upload_progress.enabled=0` in `php.ini` or the FPM/server config (not `ini_set()` or `.user.ini`), then restart workers. Apps that never change the session serialize handler at runtime can leave upload progress on. This does not replace the 21 Oct version upgrade. |

No exploit steps, proofs of concept, or scan instructions belong in this log or in client advice.

**Are we using PHP?**

No. A search of this repo found no `.php` files, no `composer.json`, and no WordPress tree.

What this repo actually runs:

- **Marketing site** (`peacemakers-ai/`): static HTML. Root `vercel.json` rewrites public paths onto those files. VERIFIED from the tree.
- **BookDirect** (`bookdirect/`): static HTML, its own `vercel.json`. VERIFIED from the tree.
- **Owner Ops** (`owner-ops/`): Next.js 16, React 19, TypeScript, Zod, Tailwind, Prisma 6, PostgreSQL (Neon in the pilot plan), Vitest and Playwright. Host target is Vercel, region `iad1`. VERIFIED from `owner-ops/package.json` and `owner-ops/docs/production-readiness/architecture.md`. There is no LLM runtime in Owner Ops today (AI governance standard).
- **Billing**: Python scripts that create Stripe and PandaDoc **drafts** only. VERIFIED from `billing/README.md`.
- **Blog generation**: Python under `peacemakers-ai/scripts/`. VERIFIED from the tree.

Inferred client-delivery stack, from Peacemakers’ own implementation-tool articles (INFERRED, not an inventory of a live client): Notion, Wispr Flow, Perplexity, Claude or ChatGPT, Apollo when outbound is in scope, and Zapier, Make, or n8n, plus the funnel pieces already documented (Formspree, Make, MailerLite, Google Sheets). None of that is a PHP application we operate.

**Would PHP make sense anywhere for Peacemakers AI?**

Yes, as a **client fact**, not as a runtime we adopt.

- Many $5–50M home-service and contractor sites are still WordPress or another PHP app on a host the owner does not patch. That is market knowledge (INFERRED), not a claim about a named client. The Blueprint’s current-technology lens should ask: what is the public site and any customer portal, who hosts it, which PHP version is actually running, and is that version 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 or a vendor backport of the 21 Oct fixes? If nobody can say, the site is in the “forgotten server” bucket the Reel is right to worry about.
- Integrating a client’s existing WordPress forms, bookings, or WooCommerce into Make / Zapier / n8n is normal current-tool work. Rewriting that site is not.

Pros of touching PHP in this practice:

- It is often the client’s current system. The recommendation ladder says use and configure what they already have before replacing it.
- Hosts and WordPress contractors are easy to find. A version check plus a host ticket is something a monthly client can do without a new build.
- Connecting an existing PHP app through its API or an automation tool stays inside the tiers James already sells.

Cons of adopting PHP, or of taking the Reel’s advice:

- Peacemakers does not operate a PHP interpreter. The 21 Oct bugs are in the runtime, so “we write careful PHP” would not have avoided them. Whoever runs PHP owes an emergency patch cycle. Vercel static hosting and the Next.js app do not.
- Adding PHP for our own marketing site, Owner Ops, or a new client system would be a second web stack James would have to patch himself. That fails “can James support it?”
- “Switch to Rust” fails the same test harder. A Rust rewrite is custom development, not a mitigation, and it is not something these offers can implement or maintain. Rust also does not make a WordPress business site disappear.
- Partial PHP mitigations such as `memory_limit=-1` are not a Peacemakers recommendation. PHP lists them as incomplete, and removing the memory cap trades one risk for an availability risk. The client-facing sentence is: ask the host to upgrade PHP, or take the site offline until they do.

**Where it applies in the practice**

- **Client system to build:** no.
- **Assessment / Blueprint:** yes, one discovery question on the current-technology lens. Website platform, host, PHP version, who patches it, what else on that server is internet-facing. Stage A records the answer as client-reported until a host panel or `phpinfo` the client shows us makes it observed. Do not probe or scan a client host.
- **Offer:** a line inside the $3,500 Blueprint, not a new product and not a “we migrate you off PHP” SKU. Monthly work can chase the host until the version is patched. It does not include a rewrite.
- **Outreach and James’s marketing:** do not post this Reel’s framing. “Half the internet / rogue AIs / switch to Rust” is not a claim we can stand behind. A calm note is possible later, only with James’s approval, along the lines of: if your site is WordPress, ask the host whether PHP is on the 21 October 2026 security release. Not written here, not scheduled.
- **Internal stack:** no PHP to upgrade in this repo. Worth a short human check, when James wants it, that no old demo or client preview is sitting on a PHP host we forgot. This log did not inventory Vercel, registrar, or host accounts.
- **Demos:** nothing in this pass should be built to demonstrate the bug.

**Effort, risk, compliance**

- Effort: a question on the Blueprint call agenda. No code.
- Risk of following the Reel: telling a client their language is the emergency, and selling a rewrite, while the host is still on an unpatched PHP. Risk of ignoring the underlying advisory: a client WordPress site stays in the long tail the speaker described.
- Autonomy: A0. This is an inventory and patch question. Do not add an agent that scans sites or files tickets.
- Human approval: required before any client message, post, host change, or production check. No external communication from this entry.
- Security: no exploit reproduction, no “are you vulnerable?” probes, no credentials, no scraping of client servers. Agent security standard: least privilege and no consequential action without approval.
- Evidence: keep host screenshots and version strings in the client evidence record. Do not promote the Reel, or a client’s memory of their PHP version, to VERIFIED.

**Decision**

Log only. James approves anything that leaves the building.
