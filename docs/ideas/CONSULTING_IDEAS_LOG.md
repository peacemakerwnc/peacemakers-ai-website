# Consulting ideas log

Notes from public sources James drops for Peacemakers AI. An entry records the source, what it actually shows, and whether the claims hold up. It is not a recommendation, a client deliverable, a build, a scheduled post, or an approval to spend credits.

`docs/ai-practice/` is not in this repository. Effort, risk, and compliance notes below follow the standards that are: `owner-ops/docs/peacemakers-operating-system/AI_GOVERNANCE_STANDARD.md`, `HUMAN_APPROVAL_STANDARD.md`, `CONSULTING_STANDARD.md`, and `owner-ops/docs/future-recommendation-philosophy.md`.

Evidence labels: VERIFIED, OBSERVED, INFERRED, CONTRADICTED, UNKNOWN.

---

## 2026-10-28 — Higgsfield Content Factory explainer Reel

**Status:** Logged only. Nothing generated, scheduled, or posted. James's approval required before any credit spend or public use.

**Classification:** (B) Peacemakers AI consulting — his own marketing / content stack. Not a client system, not the Blueprint offer, and not outreach.

**Why this file:** The Reel is an AI video-tool demo with a side-hustle and YouTube-money pitch (`#sidehustle`, `#onlinemoney`, `#internetmoney`, `#higgsfieldpartner`). That is consultancy content and tooling, not homeschool and not a book. If this was saved for @buildingpeacemakers instead, say so and this entry should move.

### Source

| Field | Record |
| --- | --- |
| URL | https://www.instagram.com/reel/De-g1u3A1aM/ |
| Creator | Cami, handle `@productivecami1` (OBSERVED from the post metadata) |
| Posted | 2026-10-26 |
| Length | 1:46 |
| Public counts at fetch | 3,434 likes, 589 comments. View count was not in the metadata. Most visible comments are the single word "Explainer". |
| Caption | "who knew about this 👀" plus `#sidehustle #houston #onlinemoney #internetmoney #higgsfieldpartner` and `@higgsfield.ai` |
| Fetch | yt-dlp for the file, metadata, and thumbnail. Speech-to-text was a local Whisper base pass. On-screen lines below were read from frames, not from the caption file. |

### What is on the Reel

**0:00–1:19 — sample.** She is on camera in a corner, drinking water, over generated map animation. Spoken hook: "This is fucking crazy. Look at Manhattan." Captions track the narration: almost every street forms a perfect grid; Broadway cuts across it; "~1000 BCE"; "the Indigenous Lenape"; the Wickquasgeck trail (name is garbled in the audio pass); New Amsterdam; "1811 / the city approves"; Broadway kept as the grid is laid over it; bowtie squares (Times Square, Herald Square — the audio pass heard "Harold" — Union Square, Madison Square).

**1:19–1:46 — pitch.** She faces the camera ("that entire video"), then screen-records:

- A grid of other map videos. One tile reads **15.7M**. Caption: "15.7 million people."
- A Google result for "youtube pay for 1 million views," with a third-party passage highlighted at **$1,000 to $5,000**. The same page shows a much smaller row consistent with Shorts (a pool / 45% share). A Mediacube mark is visible.
- An Instagram post from `@geoglobe_tales` ("New York's Oldest Street") with the caption "exactly how."
- `higgsfield.ai/content-factory`. Headline on the page: "GENERATE VIRAL FACELESS … INSIDE CLAUDE WITH HI[GGSFIELD]." Button: "Generate in Claude."
- "Pick a trending style to start from."
- The prompt card, readable on screen: `[TOPIC]. Create a fresh script with a strong opening hook, accurate facts, engaging animated visuals, voiceover, and captions.` The card is shown at 30 seconds / 1 episode, then 2 minutes / 1 episode, then **2 minutes / 3 episodes**, with a Generate button and "How is the price calculated?"
- Two faceless sample frames (a crime statistic card; "THE HUNT PART 2").
- End card: comment **"Explainer"** for the prompt link.

Spoken close, cleaned only where the picture makes the words obvious: go to higgsfield.ai/content-factory, pick a viral reference, paste that prompt, set it to two minutes and at least three episodes, click generate, post it, monetize it, "you'll start printing," comment "Explainer" for the prompt link.

### Method actually shown

1. Make a short map explainer (hers is a face-in-the-corner hybrid, not a faceless render).
2. Cut to other creators' view counts and a Google snippet about YouTube pay.
3. In Content Factory, pick a trending style, paste the one-line topic prompt above, set length and episode count, generate.
4. Comment-gate the prompt. The prompt is already on screen. The comment is the distribution trick.

Higgsfield's own write-up of this product (published 2026-10-22): [Content Factory](https://higgsfield.ai/blog/higgsfield-introduces-content-factory) turns one "what if" topic into a vertical faceless video. It writes scenes, picks characters, generates visuals and voiceover, and edits. Length 15 seconds to 5 minutes, 1 to 4 episodes, 50+ presets, optional TikTok/Instagram link for format and pacing. Access: the site, Claude via Higgsfield MCP (`/content-factory`), or Supercomputer. The product is real. "Viral" is the page headline, not a result Higgsfield promises.

### Claims that do not hold

| Claim | Verdict |
| --- | --- |
| The video you just watched reached 15.7 million people. | CONTRADICTED as implied. 15.7M is a counter on a different tile in a screen recording of other videos. This Reel, two days old at fetch, had 3,434 likes. Its view count was not published in the metadata. |
| YouTube pays $1,000–$5,000 per million views, so these clips are "ready to be posted and monetized" and you will "start printing." | CONTRADICTED as a promise, and the dollar range is the wrong product. YouTube states there is no guarantee of whether or how much a partner is paid ([partner earnings](https://support.google.com/youtube/answer/72902)). Watch-page ads share 55% of net ad revenue. Shorts pay 45% of an allocated pool, separate from watch-page ads ([ads and Premium](https://www.youtube.com/creators/earn/ads-and-premium/)). Partner eligibility is 1,000 subscribers plus either 4,000 watch hours in 12 months or 10 million Shorts views in 90 days ([YPP](https://support.google.com/youtube/answer/72851)). The $1,000–$5,000 line is a third-party snippet on her screen about long-form payouts. A 2-minute vertical clip posted "across social media" is not that product. Instagram Reels are not YouTube at all. |
| Paste a prompt that demands "accurate facts," then post. | The prompt does not check facts. Higgsfield's own tip is to check every factual claim before publishing. In this sample, "the British gave the road a creative name, Broadway" does not hold as told. The Dutch already called it the Heeren Wegh / Breede Wegh ("broad way"); the English form is an anglicization ([New Netherland Institute](https://newnetherlandinstitute.org/history-and-heritage/digital-exhibitions/a-tour-of-new-netherland/manhattan/broadway/), [NYT, 2018](https://www.nytimes.com/2018/04/30/books/review/fran-leadon-broadway.html)). "Almost every street forms a perfect grid" is the hook, not the map: the 1811 Commissioners' Plan grid is real, and so is Broadway cutting it, but downtown is not that grid, and the Wickquasgeck trail is not modern Broadway for the whole island. The on-screen "~1000 BCE" date was not checked. |
| Content Factory copies "that exact type of video." | Overstated. Her sample keeps her face on screen. Higgsfield defines faceless as no on-camera presenter. A reference link is for format and pacing; the tool is designed not to copy the reference's words, story, or characters. |
| The comment word unlocks a special prompt. | The working prompt is the one-line card already on screen. Commenting "Explainer" is how she collects the audience. |

**Pricing (do not take the Reel's silence as cheap).** Published Content Factory rates, Higgsfield Plus at $49/month for 1,000 credits, about $0.05 per credit, from the same 2026-10-22 post:

| Length | 1 episode | 4 episodes |
| --- | --- | --- |
| 15 seconds | 15.75 credits ($0.79) | 63 credits ($3.15) |
| 1 minute | 63 credits ($3.15) | 252 credits ($12.60) |
| 5 minutes | 315 credits ($15.75) | 1,260 credits ($63.00) |

Her instructed settings, 2 minutes and 3 episodes, are not a row in that table. Cost of that exact click is UNKNOWN until the in-product price control is read. Three 1-minute episodes would be 189 credits at the published per-episode rate. One 5-minute episode is already 315 credits. A separate Higgsfield skill write-up ("Faceless Content Factory") shows a different worked example, about 221 credits for one fact-checked 1-minute 1080p run once reference images, rewrites, and upscale are included. Those two pages do not describe one price.

### Where it fits Peacemakers AI

**Fits: his own marketing, as a draft, after he approves the spend.** One supervised test of a short explainer on a subject the site already states in plain language, such as what a Business Blueprint covers or what happens when a home-service company misses calls. He picks the topic and the sentences that must stay true. A person checks the finished narration against those sentences before anything is posted. No view or income claim on the video, the site, or a sales call.

**Does not fit, on this evidence:**

- A system to build for a builder, contractor, or home-services client. Their constraint is not "post faceless history videos." Adding a video tool because it exists skips the escalation ladder (eliminate, simplify, use current tools, then automate).
- The offer. The Blueprint stays a paid diagnostic. Monthly tiers are not a promise of viral content or YouTube income.
- Outreach. Comment-gating a prompt is an influencer mechanic, not a way to reach owners of $5–50M firms.
- An assessment demo, unless a later Blueprint shows that this client's actual constraint is content they already own and someone on their side will check facts. Even then the recommendation stays Proposed. No ROI figure from this Reel.

**Internal stack:** optional draft aid beside the existing weekly blog batch. It does not replace that batch, the checklist, or the Blueprint templates.

### Effort, risk, compliance

**Effort.** The product exists and the first generation is short. Reviewing the script is the work. A 15-second or 1-minute, 1-episode test is the published small spend (15.75 or 63 credits). Do not start on her 2-minute, 3-episode setting until the price control is read.

**Risk.** A wrong sentence about a client's trade, published in Peacemakers' name. Side-hustle tone and the profanity in her hook are off the consultancy voice. Using her Reel, or `@geoglobe_tales`, as the reference video copies someone else's performance. Credit spend with no approval. Client names, job data, or recordings pasted into a Higgsfield prompt.

**Compliance.**

- No generation and no post until James approves that specific spend and, separately, any publish. External publishing and money commitments need his approval.
- If used, this is a draft a human edits (autonomy A1). It does not post, message, or spend on its own.
- No client data in the prompt. No income, views, or savings claim attached to the output.
- Do not upload this Reel or another creator's video as the reference.
- Do not repeat her YouTube dollar range in any Peacemakers page, email, or call.

**Decision for James:** approve or reject a single 15-second or 1-minute Content Factory test on one page the site already publishes. Reject means this entry stays a note.
