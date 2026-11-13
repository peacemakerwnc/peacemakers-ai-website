# Consulting ideas log

Analysis only. An entry here is not approval to build, buy, schedule, or post. James decides.

This file is not on `main`. Earlier drops sit on their own open branches. The 22 October 2026 Caleb Ralston entry (the pond and the four questions) is on `cursor/ralston-personal-brand-map-a00a`. This entry continues that one.

`docs/ai-practice/` is not on `main`. Risk and compliance notes below follow the boundaries that are: evidence labels in `owner-ops/docs/peacemakers-operating-system/EVIDENCE_STANDARD.md`, the ban on fabricated ROI in `CONSULTING_STANDARD.md`, the AI appropriateness gate in `AI_GOVERNANCE_STANDARD.md`, and human approval before a public sentence in `HUMAN_APPROVAL_STANDARD.md`. Marketing-claim limits also follow the FTC section of the practice playbook on `cursor/ai-practice-compliance-demo-028f` (PR #30).

---

## 2026-10-28 — Counter-position the niche, then leave the view counts alone

**Status:** Pending James. Nothing built, scheduled, or posted.

**Classification:** (B) Peacemakers AI consulting. James's own marketing. A one-page positioning note before the next post. It is not a client system, an assessment demo, a change to the offer, an outreach script, or an internal tool.

**Why this repo:** The Reel is business and marketing advice about how a content operator aimed one client's posts. It is not @buildingpeacemakers homeschool content and not a Publishing book idea.

**Source**

- Slack: James Fullen dropped the bare URL in `#peacemaker-ideas` on 2026-10-28 at 07:31 EDT, with no note ([Slack](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1793187087989259)).
- Reel: [DfBMVSRuTFG](https://www.instagram.com/reel/DfBMVSRuTFG/) by Sean Werbowski ([@seanwerbowskii](https://www.instagram.com/seanwerbowskii)). yt-dlp `upload_date` 2026-10-28. Runtime 102.6 seconds, 1080×1920. At fetch: 163 likes, 11 comments.
- Caption, as posted: "Your content might not suck, its just not that different. This was the problem for @lukemillerbiz that we solved with counter positioning his niche. If you haven't already go watch @calebralston 6hr course. And follow @seanwerbowskii for more."
- Fetch: Firecrawl refuses Instagram (`We do not support this site`). yt-dlp downloaded the public video, caption, and comments. Audio transcribed locally with faster-whisper `small` (English, word timestamps). On-screen text checked against frames. YouTube blocked a direct metadata refresh of the course, so the course card is taken from the Reel itself.

### What it actually shows

A walk-and-talk. Karaoke captions (one or two words at a time), a fixed title card reading "Caleb Ralston was right all along," and a still of Ralston in the top third. No tool, no screen recording of an analytics dashboard, and no written format. Around the result claim he holds up a phone playing someone else's video. That insert is the only "proof" on screen.

Spoken method, in order (whisper, checked against the captions on sampled frames):

1. He credits Caleb Ralston, "the guy who built Gary Vee and Alex Hormozi's personal brands," and says growth on social is standing out by counter-positioning.
2. He watched Ralston's personal-brand course front to back. The card on screen reads "How to Build a Personal Brand (Full Course)," Caleb Ralston, 6:22:28, 974K views, "1 year ago." He says the useful part showed up in the first hour: how to stand out and how to position a niche.
3. His first client had posted for about a year, had other content mentorships, understood hooks, could talk on camera, and was a better editor than Sean. Sean says the client still could not break 200 views a video.
4. They "dissected his niche." The client was in "software automation tracking." Everyone in that niche, Sean says, talked about helping founders get their time back with automation. Nobody, he says, was helping founders exit and sell the business through tracking and automations. He told the client to own that slice.
5. The advice he calls counterintuitive: stop posting, research that topic, then use a new format. He does not show the format.
6. The result he states: four videos to 100,000 views, then one video at 10 million views and about 3,000 or 4,000 followers, in less than a month. He says the hooks and the storytelling did not get better. "All we did is counter position."

The phone insert, read off the screen, is a different person outdoors with three cards: "2000: Company worth $125B," "2008: Rejected $46B offer," "Sold for $4.48B 8 years later," and a view counter of 9.7M. The company is not named on the card. The caption names the client as @lukemillerbiz. That account commented "Sean the goat." Another comment asked "Who was the software guy?" The comments fetched with the video do not answer that.

One profanity is in the voice track. It does not belong in Peacemakers copy.

### Claim check

| Claim | Label | Basis |
| --- | --- | --- |
| Runtime is about 103 seconds, and the title card matches the hook | VERIFIED | ffprobe 102.6 seconds. Frame at the open shows the Ralston title card. |
| Ralston "built" Gary Vee's and Alex Hormozi's personal brands | PARTLY SUPPORTED, overstated as sole authorship | Ralston's own [about page](https://calebralston.com/about) says he was Gary Vaynerchuk's videographer and TikTok lead for 2.5 years, then built an 18-person media team that scaled two entrepreneurs' audiences from 1.2 million to over 11.5 million. [Acquisition.com's bio](https://www.acquisition.com/caleb) names him Director of Brand for Alex and Leila Hormozi and Acquisition.com, and says he led Gary's TikTok from 300k to 3.5M in three months. Those are staff roles he describes. The follower counts are his, and this pass did not audit them. "Built their brands" is his caller's shorthand. |
| The course on screen is a real Ralston course about standing out inside a niche | OBSERVED in the Reel. The teaching matches what Ralston has published | The YouTube card is in the Reel (title, 6:22:28, 974K). A direct YouTube fetch was blocked, so the view count and "1 year ago" were not re-checked. Ralston's own [LinkedIn post](https://www.linkedin.com/posts/calebralston_if-youre-having-trouble-figuring-out-how-activity-7495147543589318656-76gP) gives the exercise: left column, what people in the niche say or do that you disagree with; right column, your approach. A third-party transcript of the long course (video `Ch4Sl0POBhU`) asks the same two questions and uses "if everyone is chasing views, talk about trust" as his example. He does not use the phrase "counter positioning" in that passage. Sean's phrase is Sean's. |
| The client could not break 200 views, then hit 100,000 in four videos, then 10 million views and 3,000–4,000 followers, and the only change was positioning | INFLUENCER-REPORTED. The 9.7M figure is OBSERVED on a phone. The causal claim is UNVERIFIED | The phone shows an eye icon and 9.7M on one clip, which is why "10 million" is a round-up of that screen, not a second source. There is no analytics export, no date, no account name on the phone, and no before count. @lukemillerbiz's comment confirms he is cheering Sean. It does not confirm the baseline or the follower count. A widely recycled Yahoo story can collect views without proving a positioning program. |
| The phone cards are a correct company history | CLOSE, and they are not the method | The cards do not name Yahoo. The public record does. Microsoft's 1 February 2008 offer was **$44.6 billion**, $31 a share ([Reuters](https://www.reuters.com/article/world/uk/microsoft-bids-446-billion-to-buy-yahoo-idUSN01391944/); [Microsoft's 1 February 2008 filing](https://www.sec.gov/Archives/edgar/data/789019/000095012308001050/y47867ce425.htm)). Microsoft later raised the bid to about **$47.5 billion** and withdrew on 3 May 2008 after Yahoo held out for $37 a share ([New York Times](https://www.nytimes.com/2008/05/04/technology/04soft.html)). "$46B" is a rounding, not the published bid. AP reports Yahoo's 2000 peak market value at about **$130 billion** ([AP](https://apnews.com/general-news-e3e04789cc80407e936b95298160b9ca)); "$125B" is the round number in later retellings, including [Axios](https://www.axios.com/2021/05/04/verizon-aol-yahoo-valuations). Verizon's revised price for Yahoo's core business was about **$4.48 billion** ([BBC](https://www.bbc.co.uk/news/business-39037198), February 2017). From the February 2008 bid to that revised price is about nine years, so "8 years later" is a compression. |
| "Stop posting and research, then a new format" is what produced the views | UNVERIFIED, and the format is absent | The Reel states the advice and withholds the format. There is nothing to copy except the sentence about the niche. |
| Peacemakers can expect this kind of reach by changing a sentence | CONTRADICTED as a promise | One operator's story about one unnamed-on-screen client is not a baseline. The consulting standard forbids a savings or outcome claim without that client's own evidence. The FTC's [Keep your AI claims in check](https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check) (27 February 2023) puts the burden on the advertiser not to exaggerate what a method does. |

### Where it applies

**James's own marketing, as a writing check before the next post.** The 22 October log already fixed the pond: builders, contractors, home services, and similar firms around $5–50 million, work centered in North Carolina, and the repeated pairing is James looking at an owner's actual work and saying where AI is worth doing, starting with the Blueprint. This Reel does not move that pond.

What it adds is one comparison, which is the part of Ralston's published exercise that Sean acted on:

- Left column: the sentence the category already repeats. For AI consulting that sentence is some version of "we give owners their time back" or "automation runs the business."
- Right column: the job those posts skip, written only with lines that are already true on the site. The live homepage says "Clarity first. AI second." and "without the hype," and it describes process-first consulting and an AI opportunity assessment ([peacemakers-ai/index.html](peacemakers-ai/index.html)). The Blueprint page prices the entry at **$3,500** and says implementation is scoped separately ([peacemakers-ai/blueprint.html](peacemakers-ai/blueprint.html)). The monthly **$10,000 / $15,000 / $20,000** figures are the fees James has set internally. They are fees. They are not on the Blueprint page checked for this entry, and they are not a savings claim.

That right-column line is already the public offer. The useful work is to keep the next post inside it, on purpose, after writing the two columns in James's words. A model is not required. If one is used to draft the page, autonomy stays at A1 (information only) and the AI appropriateness gate stays **PROVISIONAL / NOT READY** for anything that would publish itself.

**Leave the client's niche alone.** "Help founders sell the company through tracking and automations" was Sean's read of one software client. It is not the Blueprint. Turning Peacemakers into an exit-prep firm would be a new promise. The site does not make it, and this Reel is not evidence the promise is true.

**Not a client install, not outreach, not a stack change.** A contractor in this range does not need a personal-brand program, a posting pause, or a secret format from this Reel. No software is demonstrated. Nothing here belongs on the internal stack or in a Blueprint recommendation.

### Effort, risk, compliance

**Effort.** Low. One sitting to fill the two columns against the homepage lines above, then stop. No subscription, no scheduler, no ad spend, no Higgsfield, no new page, and no pause in delivery. Prefer A0: a written note a person marks.

**Risk.**

- A sharper sentence invented to be different can become an offer the practice does not deliver. "We help you sell the company" and "we get you to 10 million views" are both that failure.
- The phone clip is someone else's video. Do not repost it, stitch it, or reuse the Yahoo cards. The underlying story is also a poor slogan: a company that turned down a bid and later sold for a fraction of it.
- The Reel's caption tone and the one profanity read against a site that says "without the hype."
- Time. "Stop posting and go research" is advice to his client. Used here, it pulls attention off Blueprint delivery.
- Copyright. The course, the headshot, and the client's video are not licensed to Peacemakers. Do not republish them.

**Compliance.**

- This entry is not approval to post, advertise, or put language in front of a client. `HUMAN_APPROVAL_STANDARD.md` requires approval before external publishing.
- Do not state his view counts, follower counts, or "four videos" story as a Peacemakers result. Do not say a positioning sentence produces leads or pays for the Blueprint.
- `CONSULTING_STANDARD.md` forbids fabricated ROI and treating an unverified statement as fact. His client story stays labeled influencer-reported.
- If a draft of the two columns is made with a model, keep client names, call notes, and unpublished prices out of the prompt. James edits the draft. Nothing here posts on its own.

**Decision requested.** Keep the next posts inside the line the site already uses, "clarity first, AI second," after he writes the two columns, or is there a sharper job already inside the Blueprint work that he wants named before anything goes out?
