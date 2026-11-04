# Consulting ideas log

Ideas dropped for **Peacemakers AI** (classification B): the consulting practice for North Carolina builders, contractors, home services, and similar businesses in the $5–50 million range. Offers in view are the **$3,500 Blueprint**, then a monthly AI department at **$10,000, $15,000, or $20,000**.

This file is a log only. Nothing here is approved to build, schedule, send, or post.

`docs/ai-practice/` is not on `main`. The safety notes below follow `owner-ops/docs/peacemakers-operating-system/` (consulting, AI governance, human approval, agent security, evidence) and the practice playbook on branch `cursor/ai-practice-compliance-demo-028f`. That playbook says Peacemakers will not claim a time saving, an error rate, or a dollar return unless that client's own test is attached.

Evidence labels: VERIFIED, OBSERVED, INFERRED, HYPOTHESIS, ASSUMPTION, CONTRADICTED, UNKNOWN.

---

## 2026-10-31 — Nine GitHub repos are a price list, not a $34,954 refund

**Status:** Logged. Nothing installed. No post. No comment. No outreach. No price change.

**Classification:** (B) Peacemakers AI consulting. The Reel is a tools-and-stack drop: nine named open-source repositories, each shown as a $0 replacement for a paid product, with the nine list prices added up and called money back. The audience on the caption is investors. The part that belongs in this practice is the rule already in the operating system: a free repository is not a free system, and a dollar claim needs the client's own invoice. It is not a homeschool Reel and not a book idea.

**Why this was saved.** James sells a fixed Blueprint and three monthly tiers to builders and similar firms. This Reel is the kind of stack list a prospect can forward and treat as a savings plan. The useful record is which of the nine prices check out, which "replacements" do not, and which two or three tools are even in the neighborhood of work Peacemakers already does.

**Source**

- Slack drop: James Fullen, `#peacemaker-ideas`, 30 October 2026, 8:50 PM ET. No note. [Permalink](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1793407858485339).
- Reel: https://www.instagram.com/reel/DfAYTblT-vi/ — Divya Gugnani (`@dgugnani`). Posted 27 October 2026, 1:21 PM ET. 1080×1920, 15.7 seconds. At fetch: 663 likes, 544 comments. Those counts are a snapshot, not a reason to adopt the list.

**Caption (OBSERVED):** "Every day, investors pay $95.76 for software they could get for free. That's $34,954 a year. I replaced all of it with 9 GitHub repos. Cost: $0. The 8 everyday tools add up to $2,974 a year. The 9th replaces a Bloomberg Terminal. That one alone is $31,980. 389,000 developers have starred these repos. Most investors have never heard of them. Comment TERMINAL and I'll send you all 9, with setup in 10 minutes each." Hashtags: investing, venturecapital, opensource, fintech.

**Fetch:** `yt-dlp` (2026.10.26) returned the caption, the uploader, and a progressive video plus audio. Firecrawl was not used. Whisper `tiny.en` on the 16 kHz voice track returned non-words, not a procedure. The track is loud (mean about −16 dB) and no spoken steps were recovered. The method is the caption plus the on-screen cards, checked frame by frame. Comment bodies were not retrieved; the three comments in the metadata were emoji only.

**What is on screen**

First two seconds: she stands at a laptop under a card, "9 free GitHub repos that replace $34,954 a year." The rest is nine product cards, then a "THE MATH" card. Each product card shows a star count, a name, a product it "replaces," a struck-through price, and "$0." The close says "Comment TERMINAL for all 9" and `@DGUGNANI`. No terminal, no install, no config file, and no client document.

The nine cards, in order:

| # | On the card | Stars on the card | "Replaces" | Struck price | Running total on the card |
| --- | --- | --- | --- | --- | --- |
| 1 | Grist | 11.9K | Airtable | $24/mo | $24/mo |
| 2 | Formbricks | 12.8K | Typeform | $39/mo | $63/mo |
| 3 | changedetection.io | 34.1K | Visualping | $14/mo | $77/mo |
| 4 | Vane | 37.7K | Perplexity Pro | $20/mo | $97/mo |
| 5 | AnythingLLM | 66.6K | ChatGPT Business | $25/mo | $122/mo |
| 6 | Stirling-PDF | 93.8K | Adobe Acrobat Pro | $29.99/mo | $151.99/mo |
| 7 | Metabase | 49.7K | Tableau | $75/mo | $226.99/mo |
| 8 | Ghostfolio | 9.4K | Kubera | $20.83/mo | $247.82/mo |
| 9 | OpenBB | 73.5K | Bloomberg Terminal | ~$2,665/mo est. | $2,912.82/mo |

The math card: "390K GitHub stars," "$0," and "$2,912.82/mo = $34,954/yr back in your pocket."

The addition of those nine figures is internally consistent. $247.82 × 12 is $2,973.84, which the caption rounds to $2,974. $2,665 × 12 is $31,980. The two annual figures sum to $34,953.84, which the caption rounds to $34,954. $34,954 / 365 is $95.76. That daily line is the annual sum divided by 365. It is not a count of what investors pay.

**Claim check**

Star counts were re-read from the GitHub API on 31 October 2026. Each repo exists. Counts were a little higher than the cards (Grist 12,026; Formbricks 13,195; changedetection.io 35,402; Vane 37,861; AnythingLLM 67,763; Stirling-PDF 95,425; Metabase 50,031; Ghostfolio 9,622; OpenBB 74,920). The OpenBB repository now lives at [openbq-org/OpenBB](https://github.com/openbq-org/OpenBB); `OpenBB-finance/OpenBB` redirects there. The card's "390K" and the caption's "389,000" were a snapshot of those nine counts. A star count is popularity. It is not a fit test.

| Claim | Label | Source |
| --- | --- | --- |
| Airtable Team is $24 per collaborator per month, billed monthly. | VERIFIED as that list price. It is per collaborator, and the annual price on the same page is $20. | [Airtable plans overview](https://support.airtable.com/articles/2277136852-airtable-plans-overview), retrieved 31 October 2026. |
| Grist Community (`grist-core`) is Apache-2.0 and can be self-hosted. Grist Labs sells features that are not in that repo, plus hosted plans. | VERIFIED from the project README. The card's "$0" leaves out the host and the missing paid features. | [gristlabs/grist-core](https://github.com/gristlabs/grist-core), retrieved 31 October 2026. |
| Typeform Basic is $39 per month, billed monthly. | VERIFIED as the current Basic list price. Annual is $28/mo on the same page. Basic includes 100 responses and 1 user. | [typeform.com/pricing](https://www.typeform.com/pricing), retrieved 31 October 2026. |
| Formbricks is a self-hosted survey tool under AGPLv3, with a separate enterprise license for the `ee` modules. The README describes surveys, and calls itself a Qualtrics alternative. | VERIFIED from the repo. The card's "replaces Typeform" is the Reel's label. The core can be self-hosted. AGPL duties apply if a modified copy is offered as a network service. Enterprise features need a key. | [formbricks/formbricks LICENSE](https://github.com/formbricks/formbricks/blob/main/LICENSE) and README, retrieved 31 October 2026. |
| Visualping Personal 1K is $14/mo billed monthly, or $120/year. A free plan exists (150 checks, 5 pages). | VERIFIED. The card uses the cheapest paid monthly tier and skips the free plan and the annual price. | [visualping.io/pricing](https://visualping.io/pricing), retrieved 31 October 2026. |
| changedetection.io is Apache-2.0 page monitoring. The same project sells a hosted plan at $8.99/month. | VERIFIED. Self-hosting is a server to run. The project's own hosted price is not $0. | [dgtlmoon/changedetection.io](https://github.com/dgtlmoon/changedetection.io), retrieved 31 October 2026. |
| Perplexity Pro is listed at $17/month when billed annually. | VERIFIED for the annual display on the current pricing page. A January 2026 help-center snapshot listed Pro at $20/month or $200/year. The card's $20 is that older monthly figure, or a monthly price this pass did not see on the hub page. | [perplexity.ai/hub/pricing](https://www.perplexity.ai/hub/pricing), retrieved 31 October 2026. Archived help page, 5 January 2026. |
| Vane is a self-hosted answering engine (the Perplexica successor). Its README says answers use a local model through Ollama or a cloud key (OpenAI, Claude, Groq, and others), plus SearxNG. | VERIFIED as the project's own description. A cloud key is a bill. A local model needs a machine. Perplexity Pro's hosted models and premium data sources are a different product. | [ItzCrazyKns/Vane](https://github.com/ItzCrazyKns/Vane), retrieved 31 October 2026. |
| ChatGPT Business Standard is $25 per user per month billed monthly, or $20 billed annually, with a minimum of two seats. | VERIFIED. The smallest monthly Business workspace is two seats, $50, not the $25 on the card. | [OpenAI Business pricing](https://openai.com/business/chatgpt-pricing/) and [ChatGPT Business overview](https://help.openai.com/en/articles/8792828-chatgpt-business-overview), retrieved 31 October 2026. |
| AnythingLLM runs locally and connects a local or cloud model, then chats with documents. | VERIFIED from the README. The app does not include the model, the Business admin console, SSO, or the "no training on your business data by default" term. | [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm), retrieved 31 October 2026. |
| Acrobat Pro on Adobe's individual page is US$19.99/mo on the annual plan, billed monthly. | VERIFIED for that plan. A pricing roundup dated 30 July 2026 lists month-to-month Pro at $29.99, which is the number on the card. This pass did not see $29.99 on the Adobe page that was retrieved. | [adobe.com/acrobat.html](https://www.adobe.com/acrobat.html), retrieved 31 October 2026. [Photutorial Acrobat pricing](https://photutorial.com/adobe-acrobat-pricing/), prices dated 30 July 2026. |
| Stirling-PDF's non-proprietary code is MIT. Named proprietary, SaaS, and editor directories carry their own licenses. | VERIFIED from the LICENSE file. The desktop utilities overlap everyday PDF work. Acrobat's managed e-sign, redaction, and cloud account are a different product. | [Stirling-Tools/Stirling-PDF LICENSE](https://github.com/Stirling-Tools/Stirling-PDF/blob/main/LICENSE), retrieved 31 October 2026. |
| Tableau Creator is $75 per user per month, billed annually. | VERIFIED as that published Creator price. It is per user and includes Desktop, Prep Builder, and one Creator license of Server or Cloud. | [tableau.com/pricing/individual](https://www.tableau.com/pricing/individual), retrieved 31 October 2026. |
| Metabase is an open-source BI app that sits on a database you already run. | VERIFIED as the project description. The card's "$0" leaves out the database and the host. It does not include Tableau Desktop or Prep. | [metabase/metabase](https://github.com/metabase/metabase), retrieved 31 October 2026. |
| Kubera Essentials is $250 a year. $250 / 12 is $20.83. Black is $2,500 a year. | VERIFIED. The card divides the annual Essentials price by twelve. It is not a monthly plan, and it is not the Black plan. | [kubera.com/wealth-tracker](https://www.kubera.com/wealth-tracker) and [Kubera help, updated 26 October 2026](https://help.kubera.com/article/129-what-is-kubera-black). |
| Ghostfolio is AGPL-3.0 wealth-management software you host yourself. | VERIFIED as the repo description and license. It does not include Kubera's account connections or the rest of that product. | [ghostfolio/ghostfolio](https://github.com/ghostfolio/ghostfolio), retrieved 31 October 2026. |
| A single Bloomberg Terminal is about $31,980 a year ($2,665 a month), with a lower multi-seat rate. | The figure is widely repeated and Bloomberg does not publish it. Investopedia, retrieved this pass, says "just under $32,000" for 2026 and cites a secondary guide. A pricing-tracker page states $31,980 and $2,665 and notes Bloomberg publishes no rate card. Label: the card matches that secondary figure. It is not a Bloomberg invoice in this file. | [Investopedia](https://www.investopedia.com/terms/b/bloomberg_terminal.asp); [Quantify Terminal, 31 August 2026, updated 27 September 2026](https://www.quantifyterminal.com/blog/bloomberg-terminal-cost-2026); [Bloomberg order page](https://professional.bloomberg.com/order-now/) has no price. |
| OpenBB replaces a Bloomberg Terminal for $0. | CONTRADICTED by OpenBB. The company says it is not a data distributor, that firms bring their own data vendors, and that the old Terminal was sunset. Community is free for an individual. Lite is $2,400 a year for a small team, self-hosted. Data-vendor keys and their terms stay with the user. | [OpenBB, "isn't a data distributor"](https://openbb.co/blog/openbb-isnt-a-data-distributor/); [sunsetting the Terminal](https://openbb.co/blog/sunsetting-openbb-terminal-why-how-and-what-now/); [pricing](https://openbb.co/pricing/), retrieved 31 October 2026. |
| Setup for all nine in 10 minutes each, at a cost of $0. | The caption says it. UNKNOWN as a timed result. Hosting, model keys, data licenses, and enterprise modules are costs the cards set to zero. | Caption. No install was run in this pass. |

**Whether it applies**

| Surface | Fit |
| --- | --- |
| Client system to build | None of the nine is a builder workflow. OpenBB and Ghostfolio are investor tools. AnythingLLM on a client's specs, contracts, or payroll is an AI-governance decision: name the data class, keep the sensitive parts out of a public model, and have a person approve anything a customer, a lender, or a job site would rely on. A later engagement still starts from the client's current software, not from this list. |
| Blueprint assessment | One question when a prospect arrives with a stack Reel: which of these invoices do you actually pay, for how many seats, on which plan. The answer is evidence. The $34,954 line stays out of the deck. Peacemakers already takes form submissions through Formspree. That is the current form tool until a client's own process says otherwise. |
| Offer or pricing | The $3,500 Blueprint and the $10k / $15k / $20k months stay as they are. This Reel is not a new offer and not a free audit. |
| Outreach and own marketing | The close is a comment keyword, "TERMINAL," in exchange for a setup list. That pattern is visible and unapproved. A Peacemakers caption does not use $34,954, "back in your pocket," or "replaces Bloomberg." Star counts stay off the site, the proposal, and the ads. |
| Internal stack | A later pass, only if James asks, can look at three overlaps with work this practice already touches: PDF utilities (Stirling-PDF, after reading which directories are proprietary), a page watch (changedetection.io, if a permit or supplier page is worth a small host), and a relational spreadsheet (Grist) only where a client is already paying Airtable per seat and the missing Grist features have been listed. Vane and AnythingLLM still need a model, which is a bill or a machine. Metabase waits until there is a database that is the source of truth. OpenBB and Ghostfolio stay off the internal list. |

**Effort.** This pass is the log. No repo was cloned and no account was created. A later "what we already pay" note is a short writing job after James asks for it.

**Risk.** Repeating the $34,954 line, or any of the nine struck-through prices, as a Peacemakers result. Standing up nine services and then owning the patches, the backups, and the AGPL duties. Putting client files into AnythingLLM or Vane on a personal login. Treating a comment-keyword automation as a lead system. Using OpenBB as if the market data came with the repo.

**Compliance.** A time or dollar claim needs that client's own test (`docs/ai-practice/compliance-playbook.md` on the open branch; FTC Act Section 5 as summarized there). The Reel's "$34,954 back in your pocket" is the kind of line that playbook keeps off proposals. Self-hosted apps that can see client data follow `AGENT_SECURITY_STANDARD.md`: least privilege, a named data class, and a person on the output. Client-facing delivery stays behind `HUMAN_APPROVAL_STANDARD.md`. Secrets and client files stay out of a template that could be copied into a personal chat. North Carolina breach notice is not triggered by this Reel. It is triggered if a later install stores unencrypted personal information and that store is breached.

**Not approved:** posting, commenting "TERMINAL," or DMing; copying the caption or the math card; installing any of the nine; connecting AnythingLLM, Vane, or OpenBB to a client file or a data vendor; replacing Formspree; and changing the Blueprint price or the monthly tiers.
