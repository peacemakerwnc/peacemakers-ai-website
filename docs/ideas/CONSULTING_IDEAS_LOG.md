# Consulting ideas log

Logged from public links James drops, usually in Slack `#peacemaker-ideas`. Analysis only. Nothing here is built, scheduled, posted, or sold until James approves that specific next step.

`docs/ai-practice/` is not in this repo. Compliance notes use the standards that are: `owner-ops/docs/peacemakers-operating-system/` (AI governance, human approval, evidence, consulting).

Evidence labels follow the evidence standard: VERIFIED, CLIENT_REPORTED, OBSERVED, INFERRED, HYPOTHESIS, ASSUMPTION, CONTRADICTED, UNKNOWN.

## Entry format

- **Date** — day the link was reviewed
- **Source** — URL, account, caption, length
- **Classification** — B (Peacemakers AI consulting). A and C belong in peacemakers-publishing and are not committed here.
- **What it actually shows** — transcript and on-screen text, not the influencer's framing
- **Claim check** — what holds up, what does not
- **Applies to** — client system, assessment demo, offer, outreach, own marketing, or internal stack
- **Effort / risk / compliance**
- **Status** — logged, pending James

---

## 2026-10-20 — Reel safe zone for James's own short-form

- **Date:** 2026-10-20
- **Source:** https://www.instagram.com/reel/DerZ8P2j5Hz/ — @brock11johnson ("Instagram Growth Coach"). Caption is only "SAVE THIS POST!". About 15.6 seconds. Dropped in `#peacemaker-ideas` with no note. At fetch: 8,731 likes, 84 comments. OBSERVED via yt-dlp.
- **Classification:** B. This is a short-form production tactic (framing, burned-in text, where the eye goes). It is not homeschool content and not a book idea. The use for Peacemakers is his own marketing, including any Reel cut from an assessment demo. Same layout rule would also help @buildingpeacemakers; that copy is not made here.
- **What it actually shows:** Talking-head checklist. Spoken words (Whisper on the downloaded audio; on-screen captions match):

  1. 0:00 "Remember, your eyes go here, not here."
  2. 0:03 "Subtitles go here, not here."
  3. 0:06 "Your eyes look here, not here."
  4. 0:08 "Titles go here, not here."
  5. 0:11 "Ideas come from here, not here."
  6. 0:14 "Nothing goes here."

  Green band marks "here." Red band marks "not here." Eyes: upper third, not lower. Subtitles: mid-frame / chest, not the top. Gaze: into the lens, not down at the screen or notes. Titles: he puts them above the head, and says they do not belong where the subtitles sit. Ideas: he points at his head, then away from it. A top comment ("Love that you are anti AI") reads that beat as anti-AI; the letters "AI" did not OCR cleanly, so the graphic itself is INFERRED from that comment plus the gesture, not a clean read of the frame. Last beat: a red band on the bottom edge, "nothing goes here." A commenter also noted his hands stay inside that red band the whole time.

- **Claim check:**
  - **Bottom is a dead zone for text. Holds.** Instagram covers the lower part of a Reel with the username, caption, audio line, and buttons. Several October 2026 layout guides quote Meta's Reels ad spec: leave about 14% of the top, 35% of the bottom, and 6% of each side free of text, logos, and other key elements (about 269 / 672 / 65 px on 1080×1920). Those percentages were not re-opened on Meta's own page in this pass, so the numbers are INFERRED from secondary writeups. The direction is solid. Organic chrome is a bit shorter at the bottom than the ad spec. Designing to the ad spec is the conservative choice. Preview in the Instagram app before posting.
  - **Subtitles in the middle, not the bottom and not the top 14%. Holds, with a limit.** "Chest" is right only if that line stays above the bottom 35% (above about y=1248 on 1080×1920). Lower than that and the caption still covers them. Keep them off the right-hand button rail too.
  - **Titles above the head, in the top band. Do not copy.** That is the same top 14% the username and Reels chrome occupy. Put the title inside the safe zone, just under that chrome, not in it.
  - **Look at the lens, not down. Holds.** Ordinary talking-head practice. A downward glance reads as reading a script.
  - **Ideas come from your head, not from AI. Opinion, and a bad fit as stated.** Peacemakers already requires a human to own the judgment and forbids fabricated ROI. AI may still draft. Adopting "never from AI" as a public line undercuts the consulting offer.
  - **Nothing, including hands, in the red band. Overstated.** The commenter is right that his hands live in the zone he marks red. The rule is for text, logos, and anything the viewer must read. Hands and background can cross it.

- **Applies to:** Own marketing. One safe-zone card for any Peacemakers AI Reel or demo clip: eyes on the upper third, looking into the lens; burned-in lines in the middle band; no essential text in the top 14%, the bottom 35%, or the right rail; the hook line sits just under the top chrome. Not a client system, not an assessment deliverable, not an offer change, not outreach, not the internal stack.
- **Effort:** Low. An editor overlay or a note on the next cut. No software, no build.
- **Risk:** Copying his title placement hides the hook under Instagram's top chrome. The 35% bottom figure is the ad spec; organic leaves a little more room, and the UI moves. A safe-zone card that is never checked in the app will drift.
- **Compliance:** External publishing needs James's approval (`HUMAN_APPROVAL_STANDARD`). This is production craft, not an AI feature and not a client recommendation (`AI_GOVERNANCE_STANDARD`, autonomy A0). Influencer claims stay labeled and are not treated as verified (`EVIDENCE_STANDARD`). No ROI, no savings claim (`CONSULTING_STANDARD`). Do not repost the clip. Nothing is posted from this entry.
- **Status:** Logged only, pending James. Open question: did you want this as a Peacemakers AI marketing rule only, or should the same safe-zone note also go to the @buildingpeacemakers pattern log?
