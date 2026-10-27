# Consulting ideas log

Analysis only. Entries record what was in a source, what was checked, and whether it fits Peacemakers AI. Nothing here is approved to build, schedule, send, or post.

Peacemakers AI serves North Carolina builders, contractors, home services, and similar $5–50M firms. The offer is a $3,500 AI Opportunity Blueprint, then $10k / $15k / $20k monthly AI-department work.

Evidence labels: VERIFIED, OBSERVED, CREATOR-REPORTED, INFERRED, HYPOTHESIS, UNKNOWN.

## Entry format

- **Date logged**
- **Source** (URL, creator, posted date, how it was fetched)
- **Classification** and why
- **Method** (what the source actually shows)
- **Claim check**
- **Fit** (client system, assessment demo, offer, outreach, own marketing, or internal stack)
- **Effort, risk, and approval**
- **Status** (logged / waiting on James). Do not mark approved unless James says so.

---

## 2026-10-20 — TikTok filter, then Instagram Trial Reels

**Classification:** B. Peacemakers AI consulting, own marketing. No note was attached. The Reel is a short-form audience tactic from a marketing-company owner, not homeschool content and not a book idea.

**Source**

- Dropped in #peacemaker-ideas on 2026-10-20 with no note: https://www.instagram.com/reel/Deeq6NHhIOH/
- Creator: Jared Rohrer, @jaredroars. Posted 2026-10-14. About 87 seconds, vertical talking-head.
- Caption: "How I got 6,000 followed in 30 days" plus #socialmedia #content #tiktok #instagram. ("followed" is his typo.)
- Fetch: Firecrawl refuses Instagram. yt-dlp downloaded the public video and caption. Whisper (`faster-whisper` small, English) transcribed the voice track. On-screen text is white outlined captions that follow the speech. Readable caption fragments match the audio ("10,000 views", "trial", "And it worked.", "300,000", "400,000 views", "1,000-ish"). The last frame shows the @jaredroars profile card. His follower count on that card was not clean enough to treat as a number.
- Public engagement on this Reel at fetch time: 146 likes, 35 comments. Profile page was login-walled, so his follower total was not confirmed.

**Method (OBSERVED from the voice track)**

1. Post a high volume of clips on TikTok.
2. When one passes about 10,000–15,000 TikTok views, post that same video to Instagram as a Trial Reel.
3. His theory: a strong TikTok hook means Instagram's Trial Reel will put it in front of people who do not follow him, and those viewers will follow.
4. He says the clips that did this were reaction videos and iPad story walkthroughs. Close is "follow to grow with me."

He also says he wants to "maximize on that skip rate." That is the phrase in the audio. A high skip rate is the outcome you do not want. The useful signal is whether people stay past the first seconds.

**Claim check**

| Claim | Label | What we could check |
| --- | --- | --- |
| About 6,000 followers in the last month; account around 11,000; most of that in a few weeks | CREATOR-REPORTED | Caption and voice only. This Reel's 146 likes do not prove or disprove other videos. Profile count was not readable. |
| Winning videos did 200k, 300k, 400k, and 500k views, and each brought about 1,000 followers | CREATOR-REPORTED | No analytics. Do not repeat these numbers as results. |
| TikTok is "almost purely organic," so a TikTok view count predicts an Instagram Trial Reel | HYPOTHESIS | TikTok For You is unpaid recommendation, not a lab, and it is a different audience. Nothing here shows the score transfers. |
| A Trial Reel "forcibly" pushes you to strangers | CONTRADICTED as stated | Official behavior is narrower. See below. |

Instagram's own help page (https://help.instagram.com/1013292530224018/, scraped 2026-10-20) and the 2024-12-10 creators post (https://creators.instagram.com/blog/instagram-trial-reels):

- VERIFIED: A Trial Reel is shown to non-followers first. Followers do not see it in Feed or Reels, and it stays off the profile grid until you share it to everyone. You can share it yourself, or turn on automatic share if Instagram judges it is doing well from views and engagement. Insights show up in about 24 hours. The creators post says the automatic decision uses views in the first 72 hours.
- VERIFIED: Eligibility is a public account, plus at least 200 followers on a professional account or 1,000 on a personal account. If the account is ineligible for recommendations, Trial Reels turn off too.
- VERIFIED, and it cuts against his method: "Make sure to create a new reel. Your trial reel may get limited reach if Instagram detects that you’ve previously shared the same content." He is taking a TikTok that already circulated and uploading that file. Help does not say "TikTok" by name. The safe reading is that a recycled file can be limited, so a TikTok export is not a clean Trial Reel.
- Trial Reels can take longer to get views because the audience is strangers. Ranking of a trial does not change how his normal Reels rank. There is no promised reach.

**Fit for Peacemakers AI**

- **Own marketing:** The only bucket this belongs in, and only if James later decides short-form is a channel. In this repo the public path is the site plus the LinkedIn company page (https://www.linkedin.com/company/peacemakers-ai), then the Blueprint conversation. A follower is not a buyer of a $3,500 assessment or a $10–20k monthly engagement.
- **Client system:** Not as a product. A home-services client who already films short video could test new topics with Instagram's native Trial Reel. That is a posting habit, not an AI department. Do not sell follower counts.
- **Assessment demo, offer, outreach:** No. This does not show a client workflow, a Blueprint artifact, or a way to reach NC contractors.
- **Internal stack:** No new tool and no model. Ladder step is "use the native feature." Autonomy A0. If a test ever happens, the smaller version is a few original Trial Reels filmed for the consultancy, judged on saves, profile visits, and real conversations. TikTok volume is optional and unproven as a filter.

**Effort, risk, and approval**

- Effort is high for the version he describes: film "tons" of TikToks, watch view counts, re-upload winners, then wait on Trial Reel insights. James would be the person on camera. That time competes with outreach and delivery.
- Do not treat 6,000 followers or 1,000 followers per video as a forecast. Philosophy and the implementation SOW both forbid result guarantees.
- Duplicate-content limit is the practical risk. A TikTok watermark or a file Instagram has already seen can be held back. Original footage only.
- Volume can look like spam. Losing recommendation eligibility also removes Trial Reels.
- Comments on the Reel are mostly other aesthetics and marketing accounts. That audience is not the NC builder list.
- `docs/ai-practice/` is not in this repo. These notes follow `owner-ops/docs/future-recommendation-philosophy.md`, `HUMAN_APPROVAL_STANDARD.md`, and `AI_GOVERNANCE_STANDARD.md`: simplest native feature, human approval before anything is published, no ROI claim, no agent posting.
- Status: logged for James. Not approved to film, schedule, or post. This Reel is not ours to republish.
