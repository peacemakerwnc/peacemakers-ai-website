# Consulting ideas log

Ideas noticed for Peacemakers AI (NC builders, contractors, home services, and similar firms). Nothing here is approved work. No system is built, scheduled, or posted from an entry unless James approves that step separately.

Evidence labels follow `owner-ops/docs/peacemakers-operating-system/EVIDENCE_STANDARD.md`: VERIFIED, OBSERVED, INFERRED, HYPOTHESIS, UNKNOWN.

`docs/ai-practice/` is not in this repo. Entries use the Oct 2026 operating constraints: no client contracts, no E&O or cyber insurance, and no clients who handle health records, card payments, title wires, or hiring. Autonomy and publishing rules are in `owner-ops/docs/peacemakers-operating-system/AI_GOVERNANCE_STANDARD.md` and `HUMAN_APPROVAL_STANDARD.md`.

---

## 2026-10-20 — YouTube transcript to draft blog (Claude Cowork). Do not auto-publish.

**Source:** Instagram Reel `https://www.instagram.com/reel/DesNLHvlQNm/` by `@eric.finch18`. Slack `#peacemaker-ideas`, no note. Instagram metadata timestamp 2026-10-19 21:19 UTC (5:19 PM ET). Slack drop noted as 2026-10-20 ~1:54 PM ET. About 2 minutes 19 seconds.

**Classification:** Peacemakers AI consulting. The Reel is a content-automation pitch (TikTok → newsletter → YouTube → transcript → blog → site), not homeschool, publishing, or empty chatter.

**What the Reel actually shows (OBSERVED from the file, Whisper transcript, and on-screen OCR):**

One persistent title card: "You have 12 months to dominate legacy companies online (I'm already getting sued)." The spoken method is:

1. Post short videos and point people to a free newsletter, then to YouTube.
2. Rely on YouTube's automatic transcript of a 15–30 minute video of the creator's own talk.
3. Use a Claude skill plus a scheduled job in Claude Cowork to turn that transcript into a blog the creator calls original and "not AI slop."
4. Use a Cowork connector to his website host so that, when a new video is live, the job pulls the transcript, writes the post, and publishes it.
5. He says the same path took 8–10 hours before AI, that he is dominating SEO in a small niche, that viewers have about 12 months, and that a paid private community is coming. He plugs a free newsletter with two or three Claude Cowork articles a week.

The caption says he is being sued and that "they can't do anything about it." The audio never says who is suing him, for what, or why they would lose. A public search on 2026-10-20 did not find a lawsuit tied to `@eric.finch18`. **Lawsuit, "they can't do anything," "dominating SEO," "8–10 hours," and "12 months" are UNKNOWN influencer claims, not a method.**

**Checked against primary sources (2026-10-20):**

| Claim | Result |
| --- | --- |
| YouTube auto-transcribes the video | **VERIFIED, with limits.** YouTube Help says speech recognition can publish automatic captions, they may not be ready at upload, and they can mishear accents, noise, and overlapping speech. Creators are told to review them. [Use automatic captioning](https://support.google.com/youtube/answer/6373554) |
| Claude Cowork has skills and scheduled tasks | **VERIFIED as product features.** Scheduled tasks run on hourly, daily, weekly, weekday, or manual cadence, including connectors and skills, and each run is its own session you can review. Anthropic does not document a "new YouTube video just went live" trigger. A schedule would poll. [Schedule recurring tasks](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) · [Cowork overview](https://claude.com/docs/cowork/overview) |
| A connector can publish to "my website provider" | **Partial.** WordPress.com documents an official Claude connector. Full access includes write tools; example prompts include saving a draft and changing a draft to published. That is WordPress.com (and Jetpack-connected sites on qualifying plans), not an arbitrary host. [Edit your WordPress.com site with Claude](https://wordpress.com/support/mcp/connect-claude/) |
| Auto-publishing those posts is good SEO | **CONTRADICTED as a general claim.** Google allows generative AI when it adds value, and says it is critical to fact-check AI output, including titles and meta descriptions, before publishing. Generating many pages mainly to manipulate rankings is scaled content abuse, including with generative AI. [Using gen AI content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content) · [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies) |

**How it applies to Peacemakers AI:**

This is a **drafting assist for James's own marketing**, and only later a **client demo**, not a thing to sell as "SEO domination" and not a replacement for the site that already exists.

The marketing site already queues reviewed articles and publishes at most one due post per day through GitHub Actions (`peacemakers-ai/docs/weekly-blog-batch-automation.md`). It is not WordPress, so the WordPress.com connector does not attach. The piece worth keeping is narrower than the Reel: if James records an explainer in his own words, a job may turn **that** transcript into a **draft** markdown article in the existing queue. A person still edits facts, voice, and claims. The existing Action remains the only publisher.

For a builder or home-services client, the same shape is a Blueprint demonstration only when they already record useful video (how-to, project walkthrough, FAQ) and want draft service pages. It is not the $3,500 assessment, and it is not a reason to quote the $10k / $15k / $20k tiers. Unattended publishing to a client site is out.

**Do not use** the lawsuit hook, the 12-month urgency, or the "running laps on SEO" line in Peacemakers outreach or content.

**Effort:** Small if it stays a draft dropped into the current article queue after a video James already plans to record. Large, and the wrong tool, if it means standing up Cowork plus a CMS write connector and an unattended publish loop. Prefer the queue he already runs.

**Risk:**

- Automatic captions and the rewrite can invent scope, prices, licenses, or warranties. Google's own guidance is to fact-check before publish.
- A cadence whose purpose is ranking volume can trip scaled-content abuse even when each post started from a real video.
- A website connector with permission to publish is a production credential. Least privilege means draft-only. This firm has no cyber insurance yet.
- Cowork scheduled tasks can keep running when the laptop is closed. A task that publishes is an external publication, which the human-approval standard reserves for James.

**Compliance and autonomy:**

- No client work and no client CMS connection until there is a contract. No E&O or cyber policy is in place.
- Current clients are outside health records, card payments, title wires, and hiring. A blog can still state false trade claims, so the exclusion does not make unattended publish safe.
- Fit is autonomy **A3**: the model proposes a draft, a person approves. Unattended publish is **A5** and is not permitted under the AI governance standard without a separate architecture review and owner approval. Do not schedule this.
- External publishing stays behind the existing reviewed queue. Nothing in this entry is approved to build or post.
