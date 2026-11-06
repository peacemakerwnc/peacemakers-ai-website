# Consulting ideas log

Analysis only. An entry here is not approval to build, buy, schedule, post, advertise, or put anything in front of a client.

`docs/ai-practice/` is not in this repo. Compliance notes below follow the standards that are: `owner-ops/docs/peacemakers-operating-system/` (AI governance, human approval, consulting, evidence) and `owner-ops/docs/future-recommendation-philosophy.md`.

Evidence labels: VERIFIED, OBSERVED, INFLUENCER-REPORTED, CONTRADICTED, UNKNOWN.

---

## 2026-10-20 — Claude + Higgsfield social-volume machine (@coltonhavens6)

**Status:** Logged for James. Not approved. Nothing built.
**Classification:** (B) Peacemakers AI consulting.
**Why:** The Reel is an AI content stack and a lead tactic (Claude project instructions, Higgsfield image/video, Claude Code posting, Meta video-view retargeting, comment keyword “Content”). It is not homeschool content and not a book idea.

**Source**

- Slack drop had no note. Public URL: https://www.instagram.com/reel/DesWfaAPAFo/ (the `?psln=` parameter is only a share tracker).
- Creator: Colton Havens, Instagram @coltonhavens6. Posted 2026-10-19. About 3:00. Caption: “automate your social media”.
- Fetch: Firecrawl refuses Instagram (`We do not support this site`). yt-dlp downloaded the public video, caption, and 15 comments. Audio transcribed locally with faster-whisper (small). On-screen text checked with frame OCR.
- OBSERVED engagement bait: all 15 comments returned with the file are the single word “Content”. Public counts on the file were 375 likes and 593 comments.

**What he actually shows**

Spoken method, in order:

1. Volume claim: 430 pieces of creative on a Friday for “Gary Vee, my personal brand,” then 55 posts a day across social accounts, “leads every few minutes,” and “millions” reached. On-screen line matches the 55/day claim. OCR on the opening frame is too messy to confirm a separate “400x” title.
2. Paid Claude. He says the $20 plan or the $100 plan, and that the free plan has no Projects. A Project holds who he is, what he sells, who he sells to, price, and what customers say before, during, and after they buy. Instructions cast the bot as a direct-response marketer.
3. Higgsfield account, connected in Claude’s connectors, to make a face image or video, add text, and write captions.
4. Paste that into Claude Code and schedule it “across all your social media.” The screen is a private Claude Code session (project files, a testimonial-transcribe script, and a “GHL social post” step), plus a connector list that includes Higgsfield, GoHighLevel, HeyGen, ElevenLabs, Descript, Google Drive, and others.
5. Watch which posts draw comments from people who want to buy. His line: the system is for conversions, and virality is a side effect.
6. Comment the word “Content” to get Mac/Windows guides and a live workshop invite.
7. After a post works, run a video-view campaign “as a dollar,” build audiences of people who watched 3 seconds or about 95% of the video (he cites 500,000 and then 40,000 people), and retarget them with a purchase ad.

**Claim check (2026-10-20)**

| Claim | Verdict | Source |
| --- | --- | --- |
| Pro is $20; Max starts at $100 | VERIFIED on price. Pro is $20/month, or $17/month billed annually ($200 up front). Max is “from $100/month,” with 5x or 20x Pro usage. | [claude.com/pricing](https://www.anthropic.com/pricing) |
| Free Claude has no Projects | CONTRADICTED. Free includes Projects, capped at 5. Pro and Max include Projects. | Same pricing page, feature table |
| The workflow needs a paid Claude plan | PARTLY VERIFIED. Claude Code is on Pro and Max only, not Free. Connectors exist on Free, but a free user is limited to one custom connector. | Pricing table; [Claude connectors help](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) |
| Higgsfield is a Claude connector that can generate images, video, and Soul characters | VERIFIED as a custom connector, not an Anthropic-verified directory app. Claude setup is Settings → Connectors → Add custom connector → `https://mcp.higgsfield.ai/mcp`. Requires an active paid Higgsfield subscription. | [Higgsfield help: connect to an AI agent](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent) |
| On-screen “free generations” means the Claude path is free | CONTRADICTED. Higgsfield’s own help says every generation through MCP or Claude Code deducts credits, and unlimited/free generations apply only on higgsfield.ai. There is no native credit cap; “ask before spending” is only a prompt. Paid plans on the pricing page start at Starter, $19/month billed annually, 270 credits/month. | Same Higgsfield help article; [higgsfield.ai/pricing](https://higgsfield.ai/pricing) |
| Claude Code schedules posts to every network | NOT A PRODUCT FEATURE. Claude Code is a coding agent included with paid plans, sharing the plan’s usage pool. The posting step on screen is his own script talking to a GoHighLevel-style social post. | Pricing page (“no fixed message count”; Code shares the same limits); OBSERVED in the Reel |
| 430 posts in a day, 55 posts a day, leads every few minutes, millions reached, 500,000 three-second viewers, 40,000 retargetable people | INFLUENCER-REPORTED. Not checked against an ad account. Ads Manager frames show estimated audience ranges and small dollar figures; they do not confirm those spoken totals. | Reel audio and frames |
| A $1 video-view campaign guarantees people will see it | CONTRADICTED as a guarantee. Meta’s published guidance: cost has no single answer; recommended starting practice is at least $5 and a run longer than six days; a daily budget can spend up to 75% over on a given day and is averaged across the week. A $1 floor shows up on third-party blogs only, not on Meta’s pricing page. 3-second plays and ThruPlay are real Meta metrics. | [Meta ads pricing](https://www.facebook.com/business/ads/pricing); [About video ad metrics](https://www.facebook.com/business/help/1792720544284355) |
| Usage limits will support 55 generated posts a day | UNKNOWN and unlikely as a plan entitlement. Paid Claude limits are a shared 5-hour pool plus weekly caps, not a post quota. Higgsfield credits are finite and each connector generation spends them. | Claude pricing FAQ; Higgsfield MCP help |

**Where it touches Peacemakers AI**

Judged against the practice in this task (NC builders and similar firms, $3,500 Blueprint, then monthly AI-department work) and against the live site. The public site publishes the $3,500 Blueprint, then Quick Win Sprint, Growth System, and Advisory Partnership with no $10k/$15k/$20k prices on the pages checked.

The piece worth keeping is the brief, used as an internal drafting aid for James’s own marketing: one offer, one price, and the customer’s words for the problem before they buy. A Claude Project (Pro already includes Projects; Free includes five) can hold that brief and draft a few posts. James edits and posts them. That is autonomy A2 in the AI governance standard: a draft, a human acts. It can also be a Blueprint talking point when a client’s follow-up copy is in the company’s voice and the customer’s language is sitting in reviews or call notes.

It is a poor client system. A $5–50M contractor does not need 55 AI posts a day, a synthetic face, a comment-keyword workshop funnel, or a $1 “guaranteed” video-view campaign. The Reel is an info-product funnel for Colton’s guides. Peacemakers already has a scorecard and a Blueprint; this does not replace either. Installing Higgsfield, GoHighLevel, HeyGen, and a custom poster because they appeared in a connector list fails the recommendation ladder (use and configure what the client already has before adding tools).

**Effort**

- Useful slice only: low. One Project or a written prompt, filled from site copy and real phrases James already has. A handful of drafts a week. No new subscription required if a paid Claude plan is already in use.
- His full stack: high, and ongoing. Paid Claude, paid Higgsfield, a social scheduler, custom Claude Code, ad spend, and someone watching comments and ads. Claude and Higgsfield both meter heavy use. This is not a set-and-forget department.

**Risk**

- Brand: AI faces and high-volume posting read as spam next to a “clarity before tools” Blueprint. Bad fit for builders who sell trust locally.
- Money: influencer ROI is unverified. A $1/day video-view objective is a weak way to buy jobs, and Meta does not promise delivery.
- Operations: custom connectors and a private posting script are a second system to maintain, with shared credentials. Higgsfield has no hard credit cap on the agent.
- Platform: comment-to-DM keyword funnels and unattended posting sit under Meta’s rules. Synthetic people in ads need the disclosure Meta and the FTC expect.

**Compliance**

- Human approval before any post, ad, connector that can write to a client system, or client-facing recommendation. This log is not that approval.
- Treat his volume, lead, and audience numbers as influencer-reported. Do not repeat them in a Blueprint, on the site, or in outreach.
- Drafting copy can stay A1–A2. Unattended posting, ad creation, or comment automation would be A4/A5 and is out of bounds without a separate architecture review and James’s approval.
- Keep client transcripts, prices, and reviews out of a personal Claude project until the data path is explicit and approved. Custom connectors use whatever the connected account can reach.
- No ROI, lead-rate, or “guarantee” language from this Reel.
- Do not buy the stack as a default. If a later client already lives in GoHighLevel or Meta ads, the question is whether a reviewed draft helps a workflow they already run.

**Recommendation**

Leave the volume machine, the AI face, the “Content” comment funnel, and the $1 video-view campaign off the offer and off James’s own posting. If anything is reused later, it is a human-reviewed brief: customer words, one offer, one price, a few drafts, James posts.
