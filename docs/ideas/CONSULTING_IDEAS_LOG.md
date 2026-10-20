# Consulting ideas log

Analysis only. An entry here is not approval to build, schedule, post, send, or sell anything.

`docs/ai-practice/` is not in this repo. Effort, risk, and compliance notes below follow the standards that are: `owner-ops/docs/peacemakers-operating-system/CONSULTING_STANDARD.md`, `AI_GOVERNANCE_STANDARD.md`, `HUMAN_APPROVAL_STANDARD.md`, `EVIDENCE_STANDARD.md`, and the no-results-guarantee exclusion in `owner-ops/docs/deliverables/implementation-sow-template.md`.

## 2026-10-20 — Viralish carousel: qualified views, then a views guarantee

**Classification:** (B) Peacemakers AI consulting. This is a business-marketing carousel: a platform-payout explanation that ends in an offer to business owners. It is a pattern for James's own marketing and a measurement question for Blueprint assessments. It is not a client system to build as shown.

**Source:** James dropped [https://www.instagram.com/p/DesW7HHFbs5/?img_index=11](https://www.instagram.com/p/DesW7HHFbs5/?img_index=11) in #peacemaker-ideas on Monday, October 19, 2026, about 9:15 PM ET, with no note. The link points at slide 11.

**Post:** Public Instagram carousel, 11 still images, no video and no voice. Author `@viralish` (VIRALISH). Co-author and tagged account `@adley` (Adley Kinsman, verified). Instagram `taken_at` 2026-10-19 18:43 ET (`upload_date` 20261019). At fetch: 148 likes, 61 comments. Instagram's own topic pills on the post: "qualified views facebook", "facebook algorithm update", "how to make money on facebook".

**Fetch:** Firecrawl refused the URL ("we do not support this site"). gallery-dl was redirected to the Instagram login page. yt-dlp read the public caption and confirmed an 11-image playlist, then failed each slide with "No video formats found" because the slides are images. Slide files were recovered from the public post payload and OCR'd with Tesseract (two passes, including an upscaled pass). Slide text below is that OCR. Slide 10's "question to" and "|" are OCR noise; the caption has the clean question.

**Caption:**

> Going viral is step one.
> Step two is the question most people never ask: "How do I design high-reach content that builds a brand people trust?"
> That's where the money is.
> Comment "DOUBLE" and I'll send you exactly how we do it.

**Slides (OCR):**

1. Hook, dark slide: "BREAKING. FACEBOOK QUIETLY CHANGED HOW IT PAYS CREATORS. OUR PAGE GOT 11.7 MILLION VIEWS IN 28 DAYS AND MADE $1,126. ALMOST NOBODY UNDERSTANDS WHAT THIS MEANS FOR YOU:"
2. "Facebook used to pay us over $500K a month. Same page. Same kind of videos. 2.2M followers. Last 28 days: 11.7 million views. $1,126.78. So we opened the dashboard and dug in."
3. "Most creators blame the algorithm. Shadowbanned. Reach is dead. Facebook is over. That's what we assumed too. Until we looked closer."
4. "August 31, 2025. Meta shut down three payout programs at once: In-stream ads. Ads on Reels. The Performance Bonus. The replacement pays on one thing most creators have never heard of."
5. "Qualified views. Our 11.7M views? Only 2.96M qualified. 45% didn't count at all. Meta's reason: View duration is too short. Then we sorted every video by what it earned."
6. "Watched 30-51 seconds on average: $96 to $214 per video. Watched under 20 seconds: under $5. Even at 90,000 views. Same page. Same audience. Up to 20x more per view."
7. "And it gets tighter. March 13, 2026: Meta defined original content. Reposts and minor edits get pushed down. Keep doing it and you lose monetization. Recycling old hits doesn't work anymore."
8. "Here's the uncomfortable part. Everything that made us go viral — fast cuts, instant payoff, 15-second videos — is exactly what Facebook stopped paying for. Going viral and getting paid are now two different skills."
9. "This isn't just Facebook. Every platform is moving pay off raw views and onto attention. The creators who win next won't have the most views. They'll have the videos people can't stop watching."
10. The question in the caption: how to design high-reach content that builds a brand people trust, rather than how to get money from views.
11. The linked slide: "This is exactly the problem Viralish solves for business owners. In fact, we guarantee our system DOUBLES your views in just 5 days or less. ...Or we refund every penny. Comment DOUBLE and we'll send you the details over right now."

**Method actually shown:**

1. Open on one sharp, specific result (views vs dollars), not a generic tip.
2. Walk a dated platform change in short text slides, in the account's own voice.
3. Replace a vanity number (all views) with the number the platform says it pays on (qualified views / watch time).
4. Turn that into a trust question.
5. Close with a comment keyword (`DOUBLE`) that asks for a private reply, plus a performance guarantee and a refund promise.

The close is the offer. The middle is the lesson. They are not the same thing.

**Claim check:**

| Claim | Status | Source |
| --- | --- | --- |
| In-stream ads, ads on Reels, and the Performance Bonus ended August 31, 2025, replaced by invite-only Facebook Content Monetization | Verified | [Meta Business Help: About Facebook Content Monetization](https://www.facebook.com/business/help/1049081556813520) |
| Earnings depend on factors Meta sets, including qualified views and watch time. Watch time under 5 seconds does not qualify. Reels must be at least 10 seconds to be eligible; Stories at least 5 | Verified | Same Meta article |
| Views can be non-qualified for reasons other than duration: ownership claims, unsupported languages, crossposting, boosted posts, deleted posts, ads disabled by the creator, fake engagement | Verified | [Meta Business Help: approximate earnings / qualified views](https://www.facebook.com/business/help/494798721086355) |
| March 13, 2026 (the newsroom page also shows March 12, 2026): Meta updated original-content guidelines. Duplicative posts and minor edits are unoriginal and deprioritized. Accounts that keep posting mostly unoriginal content can be made non-recommendable and demonetized | Verified | [Rewarding Original Creators on Facebook](https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/) and [Original content guidelines](https://www.facebook.com/business/help/262834734651607) |
| $500K a month, 2.2M followers, 11.7M views, $1,126.78, 2.96M qualified, $96–$214 vs under $5, "up to 20x" | Influencer-reported. No dashboard we can audit | The carousel itself |
| "45% didn't count" alongside "only 2.96M qualified" out of 11.7M | Contradicted by the slide's own numbers. 2.96 / 11.7 is about 25% qualified, so about 75% did not count | Arithmetic on slide 5 |
| Meta's reason for this page was specifically "View duration is too short" | Partly aligned, not verified for this account. Meta does disqualify sub-5-second watch time and pays on qualified views and watch time. The public help article also lists the other disqualifiers above. The dashboard label and this page's mix are Viralish's report | Meta articles above; carousel |
| "Every platform is moving pay off raw views and onto attention" | Unsupported generalization | Slide 9 only |
| "We guarantee our system doubles your views in 5 days or less, or we refund every penny" | Sales promise. No evidence in the post | Slide 11 |

**Where this applies to Peacemakers AI:**

- **James's own marketing.** The usable format is a short carousel he writes himself: one sourced change a builder or home-service owner would recognize, one number he can actually show, one operational implication, then a CTA to the existing $3,500 Blueprint intro or the free scorecard (`peacemakers-ai/blueprint.html`). Do not write a Facebook-creator-payout post. Do not reuse Viralish's slides or their dollar figures.
- **Blueprint assessment, not a new product.** For a $5–50M builder, contractor, or home-service company, Meta does not pay the business for views. The matching question is whether they measure raw reach or a qualified outcome they get paid for: a call, an estimate request, a booked job. That belongs in discovery as a measurement question. It is not a content-monetization engagement.
- **Not the comment-keyword machine, and not the guarantee.** Slide 11's `DOUBLE` reply is Instagram's private-reply feature: one message to the commenter, within 7 days of the comment, into Inbox if they follow the account and Requests if they do not ([Meta private replies](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/private-replies), updated July 2, 2026). That is a possible later lead path only after James approves an offer, the exact message, and who may send it. The 5-day views guarantee is a money promise. It conflicts with the consulting standard's ban on fabricated or unjustified results claims and with the SOW exclusion of guarantees of revenue or other business results.

**Effort:** Turning the structure into one original post is writing only, and it still needs James's approval before it is posted. A private-reply automation (webhook, `instagram_manage_comments` and `pages_messaging` permissions, message copy, refund terms) is a real build with a contractual promise attached. Do not start it from this log.

**Risk and compliance:**

- Human approval: publishing and any money or refund commitment require James's explicit approval (`HUMAN_APPROVAL_STANDARD.md`). This entry does not grant it.
- No results guarantee: do not repeat "double in 5 days or refund," and do not quote Viralish's earnings as if they were Peacemakers' or a client's (`CONSULTING_STANDARD.md`; SOW Section 7 exclusion).
- Evidence: keep the view and dollar figures labeled influencer-reported. The 45% line fails against the slide's own 2.96M / 11.7M (`EVIDENCE_STANDARD.md`).
- Autonomy: an unattended comment-to-DM sender is an A3 or A4 action. Default is a human sending an approved message, not an agent messaging commenters (`AI_GOVERNANCE_STANDARD.md`).
- Copyright: do not repost the slides. Original-content rules are also the point of slide 7.
- Substantiation: performance and earnings claims need proof Peacemakers does not have from this post.

**Decision:** Log only. Nothing built, posted, scheduled, or sent.

**Question for James:** Do you want one original Peacemakers carousel for NC builders about qualified inquiries versus raw reach, or were you flagging the comment-keyword reply as a possible client system?
