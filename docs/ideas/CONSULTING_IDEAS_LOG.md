# Peacemakers AI consulting ideas log

Dated notes from public ideas James drops for the consultancy (peacemakersai.com). Each entry records the source, what the source actually shows, which claims check out, and whether the idea fits a client system, the Blueprint, the offer, outreach, James’s own site, or the internal stack.

Nothing in this log is approved work. Do not build, publish, schedule, post, or contact anyone from an entry until James says so.

`docs/ai-practice/` is not in this repository. Effort, risk, and compliance notes follow the operating standards that are here: evidence labels in `owner-ops/docs/peacemakers-operating-system/EVIDENCE_STANDARD.md`, no fabricated ROI or outcome guarantees in `CONSULTING_STANDARD.md`, human approval before client or site delivery in `HUMAN_APPROVAL_STANDARD.md`, and current-tools-first in `owner-ops/docs/future-recommendation-philosophy.md`.

---

## 2026-10-19 — Google AI Mode personalization and a service-page critique prompt

**Classification:** (B) Peacemakers AI consulting. Stays here. The Reel is about Google Search AI Mode and how a local service page reads to a customer in a specific situation. It does not fit `@buildingpeacemakers` homeschool content or Peacemakers Publishing books.

**Status:** Logged only. Waiting for James’s approval. No page edits, no new offer, no outreach.

### Source

- Slack: dropped in `#peacemaker-ideas` with no note (as provided with this task).
- Reel: https://www.instagram.com/reel/DehlTqYRloY/
- Public metadata at fetch: posted 2026-10-15 by Matt Diamante (`heytony.agency`). Caption: “Ai mode has over a BILLION monthly users”. Duration 42.2 seconds. Likes 396, comments 21 at fetch time. View count was not in the public metadata.
- Media fetch: succeeded with yt-dlp. Voice transcribed locally (faster-whisper, `small`, English). On-screen text taken from frames plus Tesseract OCR.

### Transcript summary

Spoken track, lightly cleaned only where the on-screen prompt confirms a mis-heard word. Raw spots are marked.

> Google made a sneaky change this year, and if you want to rank in AI Mode, you need to know about it. Google isn’t just recommending the websites with the best SEO anymore. Their recommendations can be tailored to each individual person. They do this by tracking user preferences. If you want to be recommended when somebody is searching for your services, the page needs to speak to the exact situation that your customer is in. Someone searching for help with fixing flood damage would be recommended a business that not only mentions flood damage, but talks about the insane amount of rainfall that St. Catharines had recently and what steps to take first. Grab one of your service pages and then use this prompt. Read this service page as a customer in your city who needs service because of a specific situation, like last week’s flooding. Does it speak to my situation, or could it be any company’s page? List what’s missing: local details, first steps, and questions I’d still have.

Whisper heard “rank an AI mode” and “We need the service page like a customer.” The on-screen prompt uses “Read this service page as a customer,” which is the wording used above. “St. Catharines” is what the model returned for the city in the rainfall example; that proper noun is **UNVERIFIED** against a second listener.

### On-screen text

1. Burned-in title, repeated over the first half: “Google just made a MASSIVE update.”
2. A Google Search Help article titled “Manage Personalized Recommendations in Search.” The visible body matches the live help page, including the notice that Search, Maps, Shopping, Flights, Hotels, Translate, and News settings are rolling out gradually, and that history and personalized recommendations are still controlled by Web & App Activity where the new settings are not yet visible. Article: https://support.google.com/websearch/answer/17026260?hl=en
3. A chat composer titled “Back at it, Matt” with this prompt (placeholders are on screen):

   > Read this service page as a customer in [your city] who needs [service] because of [a specific situation, like last week’s flooding]. Does it speak to my situation or could it be any company’s page? List what’s missing: local details, first steps, and questions I’d still have.

   OCR on the model control reads “Opus” (one frame looks like “Opus 5.5”). Which chat product that control belongs to is **UNVERIFIED**. The prompt text itself is corroborated by the voiceover.

### Method actually shown

This is a content critique, not a tool, ranking script, or schema trick.

1. Point at Google’s personalized-recommendations setting and treat it as the reason AI Mode results differ by person.
2. Illustrate with a hyper-local service page: flood repair in St. Catharines that names the recent rainfall and the first steps, rather than a generic “we fix flood damage” page.
3. Paste one existing service page into a chat with the prompt above and have it list missing local details, first steps, and unanswered customer questions.

No software is installed. No Google product is configured. The only action is a rewrite brief for a page the viewer already has.

### Claim check

| Claim | Status | Source |
| --- | --- | --- |
| AI Mode has over a billion monthly users (caption). | **VERIFIED** as Google’s own figure, with tighter wording than the caption. On 19 May 2026, Shivani Mohan (VP, Data Science and UXR) wrote that AI Mode “has surpassed a billion monthly active users globally.” The same day, Sundar Pichai’s I/O 2026 remarks said AI Mode “has already surpassed 1 billion monthly active users.” The caption says “monthly users,” which matches the direction of those statements. The metric is monthly active users, not monthly queries. These posts are about five months older than the 15 Oct 2026 Reel; this check did not find a later official revision. | [Mohan, 19 May 2026](https://blog.google/products-and-platforms/products/search/ai-mode-us-insights/); [Pichai, I/O 2026](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/) |
| AI Overviews scale (not claimed in the Reel; included so the two products stay separate). | **VERIFIED** from the same keynote: “AI Overviews now has over 2.5 billion monthly active users.” | [Pichai, I/O 2026](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/) |
| Google is updating how personalized recommendations in Search services work, and AI responses can be tailored from account activity. | **VERIFIED** that the help article exists and says this. Personalized recommendations can use profile info, saved items, and activity to show results, feeds, and AI responses “based on what you like and your activity.” Google’s own example is an explanation shaped by an interest (“physics with a tennis example”), plus general location from past searches. The article also says results differ between people for reasons other than that setting, including language and ordinary localized results. | [Search Help 17026260](https://support.google.com/websearch/answer/17026260?hl=en) |
| This settings article is a new ranking system, and mentioning a recent local event (St. Catharines rainfall) is what gets a business recommended in AI Mode. | **UNVERIFIED**, and it goes past what Google wrote. The help page describes a privacy setting migrating off Web & App Activity. It does not say publishers are ranked by naming last week’s weather. Google’s AI Mode usage note does support a weaker, separate point: people ask longer, more specific questions (planning, “where should I,” “ideas for”). That is a reason to answer a real situation on the page. It is not a placement guarantee. | Help article above; [Mohan, 19 May 2026](https://blog.google/products-and-platforms/products/search/ai-mode-us-insights/) |
| “Best SEO” no longer matters. | **UNVERIFIED.** The Reel asserts it. Google’s posts describe AI Mode as an additional way people search, with queries at an all-time high, and still “connecting you with the vastness of the web.” | [Pichai, I/O 2026](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/) |

### Applicability to Peacemakers AI

**Where it fits:** James’s own marketing and site visibility, plus a possible Blueprint demonstration. It is not a client system to build, not a change to the $3,500 / $10K / $15K / $20K offer, and not an outreach sequence.

**What is already in the repo:**

- `peacemakers-ai/llms.txt` already exists, and its first line says it is a discoverability aid, not a substitute for indexable HTML, schema, internal links, or quality content. This Reel is about that quality-content gap. Another crawler file would not answer it.
- Location pages already have canonical URLs, breadcrumbs, and FAQ schema. The Wilmington page (`peacemakers-ai/locations/north-carolina/wilmington.html`) names the city and lists builders among the audiences, then uses the same operating pains and FAQ pattern as other city pages (missed calls, follow-up, reporting, tool sprawl; “Do you work with businesses in [city]?”). A reader in a specific situation — a coastal builder after a storm, a mountain contractor in a freeze-up — could still swap the city name and keep the page.
- Industry cards such as `peacemakers-ai/ai-for-home-service-businesses.html` repeat “Practical workflow design to improve consistency and reduce manual effort” across workflows. That copy would fail the Reel’s own test: it could be any company’s page.

**Useful part to keep:** run the prompt on one page James actually wants found, with a situation he can stand behind (permit delay, hurricane make-ready, mountain winter callback), and have a person edit the result. The prompt asks for local details, first steps, and leftover customer questions. That is a writing checklist. It matches the Blueprint habit of specific, evidence-backed recommendations better than a new GEO product does.

**Leave alone unless James asks:**

- Do not add an “AI Mode visibility” tier or promise citation in AI Mode.
- Do not mass-rewrite the location templates to insert recent weather. That content goes stale and is the part of the Reel Google did not support.
- Do not buy a GEO or AI-search tool for this. The current site plus a chat James already uses is enough for a single-page test.

### Effort, risk, compliance

**Effort.** Low for a test: one public page, one prompt, one human edit. Medium if it becomes a template pass across location and industry pages. No new system, integration, or vendor.

**Risk.**

- Selling the unverified causal claim (personalization setting → mention last week’s rainfall → you get recommended) would overstate what Google documented.
- A rewritten page that invents local facts fails the evidence standard. St. Catharines rainfall in the Reel is an illustration from another market, not a Peacemakers fact.
- Putting a non-public client page, estimate, or customer detail into a consumer chat sends that material to a third party. Public pages are the safe test set. Client copy waits for the engagement’s approval rules.
- Publishing location-page changes without James’s review would ship the same generic pattern with new adjectives.

**Compliance (operating standards in this repo).**

- Label the billion-user figure as Google-stated monthly active users (verified 19 May 2026). Label the ranking mechanism as unverified. Do not turn either into a client guarantee of leads, revenue, or AI Mode placement (`CONSULTING_STANDARD.md`, `future-recommendation-philosophy.md`).
- Autonomy stays at information and recommendation. A person decides what, if anything, is published (`AI_GOVERNANCE_STANDARD.md`).
- Site edits and anything a client would see wait for James (`HUMAN_APPROVAL_STANDARD.md`).

### Recommended next step

James picks one public page — Wilmington, or the home-services page — and runs the on-screen prompt with a North Carolina situation he can verify. He keeps, cuts, or ignores the suggestions. No publish, no client email, and no offer change until he approves a specific edit.
