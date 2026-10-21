# Consulting ideas log

Research notes for James's review. An entry here is not approval to build, deploy, sell, schedule, or post.

`docs/ai-practice/` is not in this repo. Compliance notes below follow the standards that are: `owner-ops/docs/peacemakers-operating-system/` (consulting, evidence, AI governance, human approval) and `owner-ops/docs/future-recommendation-philosophy.md`.

---

## 2026-10-18 — Ken Van Vorhis Reel: keyword-mapped pages for AI search

**Source:** https://www.instagram.com/reel/Dd8jsuhtBmp/
**Posted:** 2026-10-01 by [@kenvanvorhis](https://www.instagram.com/kenvanvorhis/) (Ken Van Vorhis | Supercars & AI). About 6,200 likes and 321 comments at fetch time. Duration 62 seconds.
**Slack:** #peacemaker-ideas, no note.
**Classification:** (B) Peacemakers AI consulting. AI-search visibility (GEO/AEO) for James's own site and as a possible client offer. Homeschool and book content are out of scope.
**Status:** Waiting on James.

### What was fetched

Firecrawl refuses Instagram. The public Reel was downloaded with yt-dlp and the voice was transcribed locally (faster-whisper, `small`, English). On-screen captions match the voice. Caption text is from the post metadata.

**Caption:** "Most industries are under-optimized for AI search engines. In just 2 weeks I'm outranking established competitors in my industry for certain keywords. You can too."

**Voice transcript:**

> Here's how I use Claude to build a website that will rank number one on Google. I created a Google Ads account and gave Claude access to the keyword planner. I then had it test out 100,000 keywords to see what people are searching for when they rent exotic cars. I then had it make a keyword map of all the search terms that had real volume. I had Claude apply that map to my website and create a page structure that targets all those keywords. I used Webflow's CMS feature to create collections tied to page templates that implement that structure. I created custom fields for each page template to better structure how keywords are displayed on the page. I also added schema markup to make it really easy for AIs to read my website. And for the last hour and a half, Claude has been writing keyword-loaded copy onto every section of my website using the keyword map I mentioned earlier. Now we're not even close to done, but we're already showing up on ChatGPT for certain keywords, and Google Gemini, and Microsoft Copilot, and even Meta's new AI Muse. If you want to learn how to use AI to outcompete in any industry, drop a follow to watch how I build my exotic rental car company with it day by day.

**Method shown:** Claude + Google Ads Keyword Planner → a keyword map of terms with "real volume" → Webflow CMS collections, page templates, and custom fields aimed at those terms → schema markup → Claude writing keyword-loaded copy across the site. The business in the video is an exotic-car rental company, not a home-services firm.

### Claim check

Evidence class for the whole Reel: **HYPOTHESIS** (influencer-reported). No query list, export, screenshot, date-stamped ranking, or competitor baseline was in the video. Do not treat any of it as verified.

| Claim | What holds up |
| --- | --- |
| "Rank number one on Google" / "outranking established competitors in 2 weeks" | Unproven. The voice later says the site is "not even close to done" and only that it is "showing up" for "certain keywords." "Certain keywords" can be navigational or low-competition terms. No before/after. |
| Claude tested 100,000 Keyword Planner keywords | Unproven, and a poor control. Keyword Planner is a Google Ads tool with its own access and volume limits. Handing an ads-account login to a model creates credential and accidental-spend risk. The video shows no export. |
| Webflow CMS templates plus keyword-loaded copy will make AI engines rank the site | This is programmatic pages aimed at query variants. [Google's generative-AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says creating separate pages for query variations in order to manipulate rankings or AI responses violates the [scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies) policy. That policy explicitly includes using generative AI to generate many pages without adding value for users, and pages that contain search keywords but little sense for a reader. Doorway abuse covers many similar city or region pages that funnel people to one destination. |
| Schema markup makes it "really easy for AIs to read my website" | Overclaimed. The same Google guide says structured data is not required for generative AI search and there is no special schema.org markup for it. Schema remains useful for ordinary rich-result eligibility. |
| Already showing up in ChatGPT, Gemini, Copilot, and Meta Muse | Anecdote only. Official controls that do matter: allow [OAI-SearchBot](https://developers.openai.com/api/docs/bots) if the page should be eligible for ChatGPT search answers; allow [PerplexityBot](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) for Perplexity's index. Google says AI Overviews and AI Mode use the normal Search index (RAG plus query fan-out), so ordinary crawlable, indexed, people-first pages are the lever. Meta's Muse Spark powers Facebook AI Mode (public reporting, June 2026) and answers from public posts on Meta's apps, so a Webflow schema page is a weak explanation for a Muse citation. |
| "Most industries are under-optimized for AI search engines. You can too." | Marketing close. Google's position is that GEO/AEO is still SEO, and that non-commodity, first-hand content matters more than AI-specific hacks. Google also says `llms.txt`, content chunking, rewriting solely for AI, and inauthentic mentions can be ignored for Google Search. |

Nothing in the Reel is a fake-review or link-scheme tutorial. The risky part is scaled, keyword-loaded pages and an unmeasured ranking promise.

### How this applies to Peacemakers AI

Checked live on 2026-10-18: `https://www.peacemakersai.com/llms.txt` returns **HTTP 200** (`text/plain`, about 3.1 KB). The apex host 307-redirects to `www`. The earlier gap (file in the repo, 404 on the public site) is closed. `robots.txt` is `User-agent: *` / `Allow: /` plus the sitemap, so OAI-SearchBot, PerplexityBot, and GPTBot are all allowed. The repo copy of `llms.txt` already says it is a discoverability aid and not a substitute for indexable HTML, schema, internal links, or quality content. Google says it ignores `llms.txt` for Search. Leave the file as it is.

The site already has the safe half of ordinary SEO: canonicals, Open Graph, FAQ and breadcrumb schema, a sitemap (210 URLs), an industry set (13 pages), and a publishing loop for the AI-for-small-business articles. It also already has the risky half in miniature: **114 location pages**. A token comparison of `alabama.html` and `alaska.html` overlaps about 76 percent after the state name is removed. Expanding that pattern the way the Reel describes — a keyword map turned into CMS templates and keyword-loaded sections — is the behavior Google names under scaled content abuse and doorway abuse.

**(a) James's own marketing (peacemakersai.com).** Keep publishing fewer pages that a builder would actually use: first-hand workflow notes, real service areas (Wilmington, Western NC, Triangle, Charlotte), and clear offers (Blueprint at $3,500, then the monthly tiers). Measure with Search Console's Generative AI report and with referral traffic, including ChatGPT's `utm_source=chatgpt.com` when it is present. A keyword-page factory, a "rank in two weeks" claim, and another wave of near-duplicate location pages are a poor fit for this site.

**(b) Client system for builders and contractors.** The Reel is a weak product. A $10–50M contractor's offer stays the Blueprint and an AI department for operations. A visibility add-on is only honest when it stays inside work they already have: Google Business Profile accuracy, crawlable service pages, and proof from jobs they actually did (photos, license, the cities they serve). Selling "we will outrank your competitors in ChatGPT in two weeks" invents a result the Reel never demonstrated.

**(c) Blueprint assessment demo.** This is the one piece worth keeping. On a Blueprint call, pick five to eight questions a homeowner would actually ask ("custom home builder near Asheville," "emergency plumber in Wilmington"). Ask them in Google, ChatGPT, and Perplexity. Record who is cited and whether the client's own pages are crawlable. Label the result OBSERVED. Leave ranking promises out. That fits Stage A/B evidence, and it gives the client something concrete without new software.

**(d) Outreach.** Usable angle: homeowners are asking chatbots who to hire, and the Blueprint can show whether the company is in those answers. Unusable angle: a two-week ranking guarantee. The second one conflicts with the rule against inflated value claims.

### Effort, risk, and compliance

| Path | Effort | Risk |
| --- | --- | --- |
| Copy the Reel (Keyword Planner via Claude, Webflow-style keyword templates, mass copy) | High, and it needs ongoing quality control James would have to defend | Scaled-content and doorway exposure; credential and spend risk on a Google Ads login; a promise the video does not support |
| Blueprint "who does AI cite?" snapshot | A few hours per client, using accounts James already has | Low, if the write-up stays evidence and names what was not checked |
| Change peacemakersai.com (more location pages, new schema hack, `llms.txt` rewrite) | Unnecessary for this idea | Adds pages that look like the pattern Google warns about |

Compliance, mapped to the operating-system standards because `docs/ai-practice/` is absent:

- Evidence: the Reel stays HYPOTHESIS. Client statements about "we don't show up in ChatGPT" stay CLIENT_REPORTED until someone records the prompts.
- Consulting standard: no final recommendation and no ROI from an unverified influencer claim.
- Recommendation philosophy: simplest maintainable step James can explain. Current site, Google Business Profile, and Search Console come before a new GEO tool or a new CMS.
- AI governance: mass keyword-copy fails the gate. Keyword volume can be read in Keyword Planner by a person. The model is being used to manufacture pages. If any assistive drafting happens later, autonomy stays A1 (information) or A2 (a human publishes). A5 publishing is out.
- Human approval: site edits, client offers, outreach copy, and ad-account access wait for James. This log does none of those.

### Verdict

**Do not adopt.** The Reel is a programmatic keyword-page mill with an unmeasured "two weeks to outrank" claim. Google's own AI-search guide treats that pattern as scaled-content abuse, and schema plus `llms.txt` are not the mechanism he describes.

### Recommended next step

James reviews this entry. If he wants a follow-up, the only next artifact is a one-page Blueprint checklist: a fixed prompt list, where the answer was observed, and whether the client's current site and Google Business Profile are crawlable and accurate. No pages, no deploy, no outreach, and no Ads-account connection until he approves that checklist separately.
