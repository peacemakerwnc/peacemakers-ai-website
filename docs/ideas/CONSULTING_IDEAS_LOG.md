# Consulting ideas log

Ideas dropped for **Peacemakers AI** (classification B): the consulting practice for North Carolina builders, contractors, home services, and similar businesses in the $5–50 million range. Offers in view are the **$3,500 Blueprint**, then a monthly AI department at **$10,000, $15,000, or $20,000**.

This file is a log only. Nothing here is approved to build, schedule, send, or post.

Classification reminder:

- **(B) Peacemakers AI consulting** — client systems, the offer, demos, outreach, James's marketing, internal tools and stack. Logged here.
- **(A) @buildingpeacemakers homeschool** and **(C) Peacemakers Publishing** are written up in `docs/ideas/HANDOFF_FOR_PUBLISHING.md` in this same change. This repo cannot push the publishing repo.
- **(D)** is logged short, so the ID is not fetched again. It is not an idea to adopt.

`docs/ai-practice/` is not on `main`. The safety notes below follow `owner-ops/docs/peacemakers-operating-system/` (consulting, AI governance, human approval, agent security, evidence) and the practice playbook on the open branch `cursor/ai-practice-compliance-demo-028f` (PR #30). That playbook says Peacemakers will not claim a time saving, an error rate, or a dollar return unless that client's own test is attached.

Evidence labels: VERIFIED, OBSERVED, INFERRED, HYPOTHESIS, ASSUMPTION, CONTRADICTED, UNKNOWN.

Caught up 27 October 2026. Instagram text below is what was on the screen or in the caption. Whisper transcripts were checked against that text where the reel is mostly speech. Star counts and dollar figures on a creator's graphic are the creator's props unless a source is named.

Publishing-repo check: `peacemakerwnc/peacemakers-publishing` was not readable from this environment (GitHub returned not found). IDs could not be deduped against `social/buildingpeacemakers/IDEAS_LOG.md`.

---

## Index (this catch-up only)

| ID | Class | One line |
| --- | --- | --- |
| De5RtF_T7B7 | B | Seven self-hosted SEO tools. Do not stand them up. Use the categories as a question, not a stack. |
| De-HXzJtpku | B | Keep a note of what held attention. Do not build the analytics agent. |
| De6rOUJsVRU | B | Talk to one owner, not an audience. |
| DezCrecDDSm | B | Nine "free replacements." Real projects mixed with a fake terminal. Do not migrate. |
| De8AEo_v9tB | B | One real opinion, then a story and a takeaway. Do not pick fights. |
| DewwCbeP51Y | B | Content rules worth keeping, and the ones that are a paid or volume bet. |
| Dc48WoSN4gI | B | Profile name, bio, and pins should point at the offer. The percentiles are rhetoric. |
| DecLfuoMoLq | B | Name a true pattern in the category. Do not invent a villain. |
| DeiQnfOBRQb | B | Six ordinary distribution channels. The growth number is his claim. |
| DeZw-SxhfC- | B | The first screen has to say what it is and why an owner would care. |
| Deb8MyGlYgU | B | Search Console can show Google queries for an Instagram account. It is not Instagram's insights. |
| DdXGFhbM2vt | B | "Can scout do this?" Logging public rows, yes. Logging into accounts and submitting forms, no. |
| DesQiQihX1V | D | Prediction-market copy-trading pitch. Not a Peacemakers idea. Steps not recorded. |
| De-oMWlBV0a | D | Hormozi personal talk to a young father. Not a client method. |

---

## 2026-10-26 — Seven GitHub repos that "replace" SEO tools

**Status:** Logged. No install, no post, no client advice sent.

**Classification:** (B) Peacemakers AI consulting. Own marketing and the Blueprint's look at a client's site. Not homeschool, not a book.

**Source**

- Slack drop: James Fullen, `#peacemaker-ideas`, 26 October 2026, 8:01 PM ET. No note.
- Reel: https://www.instagram.com/reel/De5RtF_T7B7/ — `lawrenceaiseo` (Lawrence Hitches). About 11 seconds. Almost no speech (a music bed). Caption (OBSERVED): comment `GITZ` for all 7 and a setup guide. "Free, open source, and on GitHub. The catch: most need a small server to run on."

**Fetch:** `yt-dlp` video. On-screen cards read with Tesseract. Repo names on several cards did not resolve. Those names are left unknown rather than guessed.

**What the cards say**

The title card says seven free GitHub repos replace $2,000+ a year in SEO tools. Each card then shows a category, a star count, a license, and where it runs. The paid product named on the card is the thing it claims to replace.

| Card | Paid name on the card | Stars / license / where it runs | Repo name |
| --- | --- | --- | --- |
| Rank tracking | SE Ranking | 2.1k, MIT, Docker server | Not readable |
| Site | Screaming Frog | 0.8k, MIT, Docker server | Not readable |
| Speed | "a paid speed tool" | 4.9k, MIT, laptop | Not readable |
| Privacy analytics | Fathom | 39.6k, MIT, Docker server | Not readable |
| Simple Analytics | Simple Analytics is the paid name in the title. The logo text reads as Plausible | 29.6k, AGPL-3.0, Docker server | Not printed as a URL. Plausible is a reading of the logo, not a confirmed link |
| Broken links | a link checker (logo did not read cleanly) | 4.0k, Apache-2.0, laptop | Not readable |
| AI scraping | Firecrawl (the logo reads Firecrawl across frames) | 86k, Apache-2.0, laptop | Not printed as a URL |

**Claim check**

| Claim | Label | Note |
| --- | --- | --- |
| These seven are free and replace a $2,000 SEO stack. | CONTRADICTED as a savings claim | A self-hosted crawler, a link checker, and a privacy-analytics install do not include SE Ranking's rank index or Screaming Frog's paid dataset. Docker still needs a machine, updates, and someone to read the output. The $2,000 figure is the creator's slogan. |
| Firecrawl is the scraping card, Apache-2.0, 86k stars, runs on a laptop, and it is free. | OBSERVED that the logo reads Firecrawl. The free-and-unlimited part is CONTRADICTED | Peacemakers already uses Firecrawl for research. The hosted product is metered. An open-source core does not make unlimited crawls free, and this reel is not a reason to treat it as a rank tracker. The star count was not re-counted for this note. |
| Comment GITZ and the setup is done. | OBSERVED as his funnel | The guide was not in the reel. This log does not turn on a comment keyword. |

**Whether it applies**

Use the categories as questions in a Blueprint, not as software to install.

- Rank: where does this contractor show up for the searches an owner would actually type, and who is checking that today?
- Site: can a person fetch the public site and see broken links, a slow template, or a title that never says what the company does? That can be a one-time look. It is not a new product.
- Speed and broken links: fine as a finding if they are observed on that site. Do not quote the reel's star counts.
- Analytics: if the client has no idea which pages get calls, a simple analytics install can be discussed later. Do not add one in this pass.
- Firecrawl: already a research tool. Do not resell it as "we replaced SE Ranking."

**Effort.** A line in the current-technology questions. No new server.

**Risk.** Standing up seven unfamiliar repos on a box that can see a client's site. AGPL on the Simple Analytics card is a license to read before anyone ships it. Promising rank movement from a free crawler.

**Compliance.** No dollar return and no ranking promise without that client's own before-and-after. Human approval before anything a customer would rely on. The comment-to-DM keyword is not a Peacemakers funnel.

---

## 2026-10-26 — Predict which line makes people leave

**Status:** Logged. No workflow built.

**Classification:** (B). James's own content, later. Not a client system unless a client is paying for content, which is not the offer.

**Source**

- Slack drop: 26 October 2026, 6:33 PM ET. No note.
- Reel: https://www.instagram.com/reel/De-HXzJtpku/ — `angus.sewell` (Angus the Nontechnical). About 74 seconds. Caption: comment "test" and he will send the prompts. Hashtags `#ai #buildwithai #vibecoding`.

**Fetch:** `yt-dlp` plus a Whisper transcript checked against the speech. The prompts named on screen were not in the audio as copy-paste text.

**What he describes**

He says winning at content in 2026 is a prediction loop. Save retention from two tests. Have an AI mark which phrases line up with people leaving. Make two new versions, run them as trial reels, and put the winner on the main page. Later, fold every past note into something like NotebookLM and let it coach the next post. He says the person still makes the content and the model only does the analysis.

**Claim check**

| Claim | Label | Note |
| --- | --- | --- |
| A model can map the exact phrase that caused people to leave. | HYPOTHESIS | Retention graphs are coarse. A drop at a timestamp is not proof that one phrase caused it. Treat a match as a guess to test, not a finding. |
| Trial reels then the main page is how you win. | OBSERVED as his method | A different drop, `DdKMB-ws3FN`, is already logged on PR #50 as a do-not-adopt note about a trial-reel duplicate detector. This reel is a different claim. Trial reels stay unapproved here too. |
| The prompts set the whole system up. | UNKNOWN | They were not in the reel. Commenting "test" is his lead magnet. |

**Whether it applies**

The small version is a notebook James keeps after a post: the first line, what the post was for (a Blueprint inquiry, not a view count), and whether anything in the first two seconds should change. That is enough to learn. A NotebookLM folder of those notes is a later choice, and only over James's own posts.

Do not export follower lists, commenter identities, or a client's audience into a consumer chatbot. Do not build the "two versions, trial reels, auto-promote the winner" loop.

**Effort.** A note after each post he actually publishes. No new system.

**Risk.** Treating a model's sentence as the reason a reel died, then changing the offer to chase it. Putting audience data in a personal chat login.

**Compliance.** AI governance: a person decides what gets posted. Evidence standard: a retention guess is a hypothesis. No view-count promise to a client.

---

## 2026-10-26 — One customer, camera off

**Status:** Logged. No reel filmed.

**Classification:** (B). How James talks in his own marketing, and how a client's follow-up message should sound. The homeschool account could use the same posture (one mother, not a crowd). The paste-ready homeschool line is in the handoff file so it is not lost. The drop itself is sales content, so it stays (B).

**Source**

- Slack drop: 26 October 2026, 12:53 PM ET. No note.
- Reel: https://www.instagram.com/reel/De6rOUJsVRU/ — `jacob.kitton` (Jacob Kitton). About 18 seconds. No caption in the metadata.

**Fetch:** `yt-dlp`, Whisper, and a denser OCR pass. The on-screen line is the content.

**On-screen text (OBSERVED)**

"If you want to make a fucking load of money on social media, get this tattooed onto your forehead if you need to. You are not performing for an audience. You are involved in a one-way, infinite FaceTime call with your customer who has their camera turned off. You're going to make some money if you think about that."

**Claim check**

The money sentence is a boast. CONTRADICTED as a forecast. The useful part is the posture: write to one buyer who cannot answer, in his words, about his job.

**Whether it applies**

The next consulting reel or the first screen of the site should sound like James talking to one owner about missed calls, estimates that stall, or a crew that never sees the follow-up. It should not sound like a talk about AI.

Do not use his wording. Do not use that language on the homeschool account. The homeschool version, if James wants it later, is the same posture with plain speech: one mother, the real Tuesday, no crowd voice.

**Effort.** A rewrite of the next thing he was already going to say. No production system.

**Risk.** Performing "AI advice" to other consultants instead of to an owner. That is the failure this reel is pointing at.

**Compliance.** Claims about the practice stay true and specific. No income claim. Human approval before a post.

---

## 2026-10-26 — Nine GitHub repos that "replace" paid software

**Status:** Logged. No repo cloned, no tool swapped.

**Classification:** (B). Internal stack. Not a client deliverable.

**Source**

- Slack drop: 26 October 2026, 10:22 PM ET. No note.
- Reel: https://www.instagram.com/reel/DezCrecDDSm/ — `think_macro_` (Think Macro). About 54 seconds.
- Caption (OBSERVED) lists nine names and says comment `REPO` for the links. It also says "Reverse Engineer Anything rebuilds it with Claude Code."

**Fetch:** `yt-dlp`, Whisper, and OCR of the terminal graphic. The graphic runs `gh search repos --free --replaces=paid`. That is not a real `gh` command. The terminal is a prop.

**What the graphic names**

| On screen | Claims to replace | Path shown | Monthly price shown |
| --- | --- | --- | --- |
| Open Higgsfield | Higgsfield | `github.com/wide-trace/open-higgsfield` | $19 |
| VoiceStudio | ElevenLabs | `github.com/debpalash/VoiceStudio` | $22 |
| OpenSEO | Semrush | `github.com/every-app/open-seo` | $139 |
| WeKnora | Notion AI | `github.com/Tencent/WeKnora` | $20 |
| OpenWhispr | Wispr Flow | `github.com/OpenWhispr/openwhispr` | $15 |
| OpenProject | Asana | `github.com/opf/openproject` | $13.49 |
| Cal.com | Calendly | `github.com/calcom/cal.diy` | $12 |
| Chatwoot | Intercom | `github.com/chatwoot/chatwoot` | $39 on the later card, $22-class on the first |
| Cap | Loom | `github.com/CapSoftware/Cap` | folded into the total |
| Reverse Engineer Anything | "your favorite app" | `github.com/morluto/rea` | none |

The running total on screen ends at about $297 a month and about $3,570 a year. Those numbers are the graphic's arithmetic on the prices it invented for the seats. They are not an invoice.

**Claim check**

| Claim | Label | Note |
| --- | --- | --- |
| `wide-trace/open-higgsfield` exists and is a free Higgsfield. | VERIFIED that the repo exists. CONTRADICTED that it is free of model cost | The repo's own README (retrieved 27 October 2026) says the studio is open source and that generation uses your own platform key. About 4.8k stars, three contributors, created August 2026. A young, small-maintainer repo that takes a platform key is a supply-chain decision, not a savings. |
| OpenWhispr exists and is a Wispr Flow alternative. | VERIFIED that the project exists | `OpenWhispr/openwhispr` describes local or bring-your-own-key dictation. Local models need a machine. Cloud mode is still someone else's API. |
| OpenProject, Chatwoot, and Cap are real projects in those neighborhoods. | VERIFIED as known projects | They are products with hosting, auth, and upgrades. They do not become free because the code is public. |
| `calcom/cal.diy` is the Cal.com repo. | UNKNOWN at that path | Cal.com is the real project. This pass did not confirm a repository at the exact path on the graphic. |
| Tencent/WeKnora and the OpenSEO and VoiceStudio star counts (24.3k and 78.8k on screen). | UNKNOWN as stated | Not confirmed in this pass. Do not quote them. |
| `morluto/rea` ("Reverse Engineer Anything") can rebuild a paid app. | VERIFIED that a repo by that name exists. The "rebuild their product" use is out of bounds | The project describes agent tools for inspecting binaries and apps. Using it to clone Calendly, Intercom, Semrush, or a client's vendor is a copyright and terms problem. Peacemakers configures tools the client already has. It does not reverse engineer them. |
| Paying for four or five of these is money back every month. | CONTRADICTED as stated | Self-hosting trades a seat fee for time, a server, backups, and the model's actual bill. The playbook forbids a dollar claim without a measured test. |

**Whether it applies**

Before adding a new paid seat, ask whether a tool already in the stack does the job. That question is already the practice. This list is not the approved answer.

- Do not point OpenWhispr, or any dictation tool, at a client call until the data-handling choice is made (whose account, what is stored, who can hear it).
- Do not swap the homeschool or marketing video workflow onto Open Higgsfield. The brand rule is Higgsfield at or under 300 credits, and only after James approves a specific generation. An unofficial studio with a platform key is not that approval.
- Do not install Chatwoot or OpenProject as the client system. The offer is interviews plus a draft from the client's own documents, with a person approving anything a customer or a lender would rely on.
- Leave Reverse Engineer Anything alone.

**Effort.** None now. A later seat-by-seat review is a decision, not a weekend migration.

**Risk.** Secrets in a new admin panel. A license surprise (AGPL-class projects elsewhere in these reels). A cloned app that copies someone else's product. A "free" video tool that still bills a model key and has three committers.

**Compliance.** Agent security: secrets stay out of repos and out of chats. No savings claim. Human approval before a tool touches client audio or a customer message. Copyright: do not rebuild a vendor's product from the outside.

---

## 2026-10-26 — Anti-slop: one opinion, then a story

**Status:** Logged. No post.

**Classification:** (B). James's marketing. A homeschool version would have to stay plain and true. It is not filmed here.

**Source**

- Slack drop: 26 October 2026, 9:18 PM ET. No note.
- Reel: https://www.instagram.com/reel/De8AEo_v9tB/ — `ronnymitchell_` (Ronny Mitchell). About 36 seconds. Caption: "Gang". Speech is mostly the title. The method is on screen.

**Fetch:** `yt-dlp` and OCR. The second step's last words did not read cleanly. They are not filled in below.

**On-screen steps (OBSERVED)**

Title: "How to go mega viral (the anti-slop way)."

1. List strong opinions.
2. Condense opinions into (the rest of the line did not OCR).
3. Follow this structure: say a statement, elaborate, share a story, give a takeaway.
4. Join conversations people are already in.
5. Say something people will disagree with.
6. Stop being neutral.

**Claim check**

"Mega viral" is a boast. CONTRADICTED as a promise. The structure (statement, detail, story, takeaway) is ordinary and fine. "Stop being neutral" and "say something people will disagree with" are engagement tactics. They are not a truth test.

**Whether it applies**

James can use the structure on one consulting reel he already believes: a statement an owner recognizes ("the chatbot never knew who was supposed to call back"), a short story from the pattern of the work, and a takeaway that points at the Blueprint. Join a conversation contractors are already having. Do not invent a fight. Do not state a position he does not hold so the comments move.

On the homeschool account the same structure only works if the opinion is a real conviction in plain Christian speech. Manufacturing disagreement is off the brand.

**Effort.** One script, when he next films. No system.

**Risk.** Controversy as a growth trick. A faith claim used as bait. A consulting reel that argues with other agencies by name.

**Compliance.** What we will not claim: virality, income, or a result the practice has not measured. Human approval before posting.

---

## 2026-10-21 — Twenty-one content rules, and the cautions in them

**Status:** Logged. No calendar, no ads, no comment bot.

**Classification:** (B). James's marketing and, where it is about the offer, the front of the funnel.

**Source**

- Slack drop: 21 October 2026. James's note: "Apply these r rules and threat the creator said to paying on ig." Read as: apply the rules, and the threats the creator said to pay attention to on Instagram.
- Reel: https://www.instagram.com/reel/DewwCbeP51Y/ — `ashharrisprod` (Ash Harris). About 31 seconds. Caption: "Anything I should add?"

**Fetch:** `yt-dlp`, Whisper, and OCR at 4 frames a second so the cards could be read in order.

**What "threats" means here**

The reel does not name a separate threat list, and it does not mention Instagram Threads. The cautions are the rules that tell you what not to do. Those are the ones treated as the "threats" below. If James meant a different threat, it was not on this reel.

**On-screen lines, in order (OBSERVED)**

The title says 21 rules. Several sentences are split across two cards. Read as sentences, they are:

1. Don't script the day you film.
2. Don't film the day you upload.
3. Lead with the pain, not the solution.
4. Posting beats perfect.
5. Steal ideas. Make them your own.
6. One body, three hooks.
7. Trial reel before grid.
8. Three grid posts a week.
9. Only winners hit your feed.
10. Push them within 48 hours.
11. Post 100 times before you judge.
12. Check conversions, not views.
13. Give people a reason to comment.
14. DM a magnet, not your calendar.
15. Batch film once a week.
16. Recycle your winners.
17. Ask every prospect where they found you.
18. Keep posting until the right people find your content and your business.

That is 18 sentences. The title's "21" counts some of the split cards on their own (steal / make them your own, ask / where, keep posting / until). Nothing after the last card adds a hidden rule.

**What to apply**

- Separate the day he writes from the day he films, and batch the filming. That matches the walk-and-talk note on `De4hgvzFIAl`, which is filed under homeschool because James said so. For consulting, the same production habit is available and still unapproved to schedule.
- Lead with the owner's pain. The first line is the missed call or the estimate that sat, not the model name.
- Posting beats perfect only after a person has read it. It is not permission to skip the approval.
- One body, three hooks. Same idea as the homeschool handoff. Here the body is the consulting offer.
- Check conversions, not views. A conversion is an inquiry or a Blueprint conversation. A view is not.
- Ask every prospect where they found him. That is one question on the intake. It tells him which posts are worth repeating. It is not a tracking pixel.
- DM a useful thing rather than opening with a calendar link. The useful thing has to be real (the assessment, a straight answer). A keyword magnet that emails a PDF full of claims is not that thing. The Blueprint remains the next paid step. Do not hide it, and do not automate the DM.

**What not to adopt from this reel**

- Trial reels, and "only winners hit your feed," stay unapproved. See also PR #50.
- "Push them within 48 hours" is a paid push. No ad spend in this log.
- "Post 100 times before you judge" is a volume slogan. It does not require 100 posts, and it does not excuse a post that makes a promise.
- "Steal ideas" means the structure, not someone else's footage, script, or caption. No reposting copyrighted clips.
- Three grid posts a week is a pace he can choose later. It is not a commitment made here.

**Effort.** The intake question is one line. The filming habit is a change in how he records, not a build.

**Risk.** A comment-to-DM bot. Buying reach for a post that has not earned a conversation. Judging the practice by views, which this reel itself says not to do.

**Compliance.** No fabricated ROI. Human approval on anything public. The DM, if it ever exists, is a message a person sends, not an automation that fires because someone commented a keyword. Meta's own rules on unsolicited automation are a reason to leave that off.

---

## 2026-10-19 — Profile picture, name, bio, pins

**Status:** Logged. No profile edited.

**Classification:** (B). James's consulting profile and the same shape of advice for a client's Google or Instagram presence, when that is in scope. The percentiles are not a finding to put in a Blueprint.

**Source**

- Slack drop: 19 October 2026. No note.
- Reel: https://www.instagram.com/reel/Dc48WoSN4gI/ — `msdigitalsunshine` (Carina Miller). About 54 seconds. The upload timestamp on the media is earlier than the Slack drop (the metadata says mid-2026). James dropped it on 19 October.
- Caption: follow the guidelines, follow her.

**Fetch:** `yt-dlp` and Whisper. OCR of the profile screenshots was too noisy to quote. The speech is the method. The profile on screen for most of the reel is Alex Hormozi's, then hers.

**What she says**

She walks a profile up a made-up percentile ladder:

- A clean headshot on a clean background is only her "top 80%."
- Full name plus a keyword the dream client would search is her "top 50%."
- A bio with an "I help" line, a little social proof, and a CTA into the middle of the funnel is her "top 30%," and then she calls the same profile the "top 20%."
- Pins should be the offer, the best client stories, and the post about his own story. Pins that are only the videos with the most views are the mistake. Fixing that is her "top 10%."
- The "top 1%" is "follow me."

Hormozi's profile, as shown, puts a keyword after the name, a one-line description of the work, a results line, a free-roadmap CTA, and highlights named My Story, Client Wins, Testimonials, Apply Now.

**Claim check**

| Claim | Label | Note |
| --- | --- | --- |
| These steps put you in the top 80, 50, 30, 20, 10, or 1 percent of profiles. | CONTRADICTED as data | There is no measurement behind the ladder. It is a speech device. Do not repeat it to a client. |
| Hormozi's portfolio does $250M+ a year, as printed on his profile. | Not our claim | Do not borrow it. Do not invent a Peacemakers equivalent. |
| Her bio's "$200k generated for clients" and "50+ women." | CLIENT_REPORTED via her own bio, unverified | Not evidence for Peacemakers. |

**Whether it applies**

On James's consulting profile, if he uses one:

- The name line includes the words an owner would type. "AI for contractors" or "builders" belongs there, not a slogan.
- The bio says who it is for and what the first paid step is (the Blueprint). Social proof only if it is a real engagement he is allowed to name. No invented numbers.
- Pinned posts: the offer, one true story, and who James is. Not the reel with the most views.
- Highlights can be Story, How the Blueprint works, and Questions. "Apply now" is only honest if there is a real next step.

The same checklist is a fair observation for a client's public profile during a Blueprint: does the name and the first line say what the company does, and do the pinned posts help a homeowner call? That is a look, not a redesign project.

**Effort.** A profile edit he can do himself. No build.

**Risk.** Copying a celebrity's revenue line. Pinning a viral reel that never mentions the work.

**Compliance.** Section 11 of the practice playbook: no dollar return without that client's test. FTC: the bio has to be true. Human approval before the profile changes, because it is public.

---

## 2026-10-19 — Make the category the villain

**Status:** Logged. No ad, no page rewrite.

**Classification:** (B). The offer and James's marketing. Usable in a reel or on the first screen if the criticism is true.

**Source**

- Slack drop: 19 October 2026. No note.
- Reel: https://www.instagram.com/reel/DecLfuoMoLq/ — `marketingmeii` (Mei Man). About 127 seconds.
- Caption: make the category the villain and the thing is easier to sell. "Godly for cold traffic" is her word.

**Fetch:** `yt-dlp` and Whisper.

**What she argues**

Ads that scale, in her telling, do not explain why the product is best. They name what everyone in the category treats as normal, and that normal thing is the problem. Her examples are other people's ads (a pontoon fender, a personal-care product, a mattress price comparison). She says this only works when the viewer thinks the criticism is actually true. If it is just trashing the category to sell yours, it falls apart. There has to be a real reason the category is wrong, why that matters, and why this was built differently. Cold traffic already knows the category, so you do not spend the whole ad teaching the problem from zero.

She also says she has seen this win across beauty, health, travel, furniture, and lifestyle at six and seven figures a month. That is her claim about her accounts. It is not a Peacemakers result.

**Claim check**

| Claim | Label | Note |
| --- | --- | --- |
| This "prints money" and is "godly for cold traffic." | CONTRADICTED as a forecast | No spend, no CPA, and no Peacemakers test is attached. |
| The example ads were the cheapest or the largest in those accounts. | CLIENT_REPORTED by her, unverified | Do not repeat the product examples. They are other brands' ads. |
| The pattern works when the criticism is true, and fails when it is a pose. | OBSERVED as her own caveat | That caveat is the part worth keeping. |

**Whether it applies**

A true version for this practice, if James agrees it is true: owners buy a chatbot, a form tool, or a "CRM" and nobody owns the moment a homeowner asks for a price. The villain is that pattern, not a named agency. The different thing is a person in the loop, a Blueprint that starts from their documents, and a monthly engagement only after that.

Do not name competitors. Do not say the category is a scam. Do not use her examples or her profanity. Do not put this on the homeschool account. It is a sales argument, not a lesson.

**Effort.** One paragraph on the first screen, or one reel, when he next edits copy. No campaign.

**Risk.** An attack ad. A claim that "agencies" fail, which is too broad to be true. FTC trouble if the criticism is not one he can support.

**Compliance.** Statements about other people's work have to be true and not misleading. No income claim. Human approval on the sentence before it is public.

---

## 2026-10-19 — Six ways a follower count moved

**Status:** Logged. No ads, no collabs, no cross-posting turned on.

**Classification:** (B). Distribution for James's own marketing. Not a client system.

**Source**

- Slack drop: 19 October 2026. No note.
- Reel: https://www.instagram.com/reel/DeiQnfOBRQb/ — `overtimelj` (Luke Joyce). About 21 seconds.
- Caption: it is simple, and the hard part is doing it without burning out.

**Fetch:** `yt-dlp`, Whisper, and OCR. Whisper turned a follower graphic into a nonsense number. The OCR cards are the source for the list.

**What is on screen**

He says he helped Maria Wendt's personal brand from 700,000 followers to 1,000,000 in six months. The cards then show six methods: organic feed posts, trial reels, TikTok and YouTube shorts, follower ads, and collabs.

**Claim check**

| Claim | Label | Note |
| --- | --- | --- |
| 700k to 1M followers in six months. | CLIENT_REPORTED by him, unverified | A follower count is not a Peacemakers result and is not the conversion the other reel says to watch. |
| Those six methods caused it. | HYPOTHESIS | The reel does not show the mix, the spend, or what else changed. |
| Follower ads and collabs are required. | OBSERVED as items on his list | Both cost something (money, or another person's audience and permission). Neither is approved. |

**Whether it applies**

The ordinary part: one body can be cut for more than one place (the feed, a short, a TikTok) if James wants that later, and each cut still needs a person to approve it. Trial reels stay unapproved, consistent with PR #50 and with `DewwCbeP51Y` above. Follower ads are a paid test with a budget he has not set. Collabs need a real partner and a yes. None of that is a build.

Do not cite Maria Wendt's growth in a proposal.

**Effort.** None until he decides to post in a second place. Cross-posting is an edit, not a product.

**Risk.** Paying for followers. A collab that puts the practice next to claims he does not make. Burnout from six channels, which his own caption admits.

**Compliance.** No result claim borrowed from another brand. Ads and paid collabs need a separate approval. Human approval on every cut that goes out.

---

## 2026-10-19 — Would a tired owner understand this

**Status:** Logged. No page changed.

**Classification:** (B). The marketing site, the Blueprint one-pager, and any client-facing screen the practice writes.

**Source**

- Slack drop: 19 October 2026. No note.
- Reel: https://www.instagram.com/reel/DeZw-SxhfC-/ — `jaredroars` (Jared Rohrer). About 40 seconds. He is reacting to someone else's clip.
- Caption: "Ask yourself this question."

**Fetch:** `yt-dlp` and Whisper. OCR confirmed the repeated line and did not add a second method.

**What he repeats**

Every time you edit a website or an ad, ask whether a drunk grandma would understand it. He shows a before that fails and an after that a person can parse. His summary: people have to see what you are selling and how it helps them.

**Claim check**

The persona is a joke. The test is an old clarity test. There is no conversion number attached. Do not quote a lift.

**Whether it applies**

Read the first screen of the consulting site as a tired owner, not as a person who already knows the words Blueprint, stack, and agent. The screen has to say, in one look, that this is help for a contractor who wants AI in the business, what the first step costs ($3,500), and what he gets (a look at his operation and a plan a person stands behind). If it does not, that sentence is the edit. The same test belongs on a client page the practice writes: a homeowner has to see what to do.

Do not use his phrase in client copy or on the homeschool account.

**Effort.** One read-through of the current first screen. A rewrite only if it fails the test. No new page in this change.

**Risk.** Dumbing the offer down until the price and the human approval disappear. Clarity is not vagueness.

**Compliance.** The plain version still has to be accurate. Price, scope, and "a person approves" stay in the sentence if they are part of the offer.

---

## 2026-10-14 — Google Search Console for an Instagram account

**Status:** Logged. No Search Console property added.

**Classification:** (B). James's own marketing, and a possible question inside a Blueprint when the client publishes. Not a ranking product.

**Source**

- Slack drop: 14 October 2026. No note. The media itself is dated 13 October 2026 on the slide alt text.
- Carousel: https://www.instagram.com/p/Deb8MyGlYgU/ — `heytony.agency` (Matt Diamante). Eight images. No voice.
- Caption: "Comment RANK and I'll send it over."

**Fetch:** `yt-dlp` saw eight children and no video. The public page dump contained the slide image URLs. Each slide was downloaded and read with Tesseract. Slide 4's smaller type did not all read. The readable line is quoted. The rest of that slide is not guessed.

**Slides (OBSERVED)**

1. "GOOGLE JUST HANDED CREATORS A CHEAT CODE..."
2. "Most creators guess what people want. Now Google is telling you exactly what they're searching for..."
3. "Open Google Search Console. Click Add property."
4. "Add your social profiles." The rest of the slide did not OCR into a reliable sentence.
5. "Click into your account. You'll see the exact keywords people used to find your content."
6. "Now sort by Impressions. The keywords at the top have the biggest demand..."
7. "Start creating content around those keywords. That's what your audience is already searching for."
8. "Struggling to rank on Google? Comment RANK and I'll send you something to fix that..."

**Claim check**

| Claim | Label | Note |
| --- | --- | --- |
| Search Console can take an Instagram, TikTok, X, or YouTube account as a platform property and show Google Search queries, clicks, and impressions for that account. | VERIFIED as a Google feature, with a rollout caveat | [Google's 7 July 2026 post](https://developers.google.com/search/blog/2026/07/search-console-social-video-platforms) and [the platform-property help page](https://support.google.com/webmasters/answer/17148418?hl=en). Google says the rollout is gradual, data takes a few days, and the reports are Google Search, Discover, and News. They are not views inside Instagram, TikTok, X, or YouTube. |
| It tells you exactly what people want, and the top impressions are the biggest demand. | CONTRADICTED as stated | Impressions are queries that already showed that account. They are not the whole market, and they are not proof those words will rank a new post. Sorting by impressions is a sort of your own report. |
| "Cheat code" and the RANK comment fix ranking. | CONTRADICTED as a promise | The comment is his funnel. The slides do not contain a ranking method beyond "look at your queries and make more content on those words." |

**Whether it applies**

When the button is on James's Google account, he can add the consulting Instagram (and YouTube or TikTok, if he actually uses them) as separate platform properties. A monthly look at queries is a topic list for posts he was going to write anyway. It does not replace talking to owners.

For a client, the website property in Search Console is the one that matters, and only if they already have it or ask for the look. Adding their Instagram is optional and only with their login. Do not tell them the top impression is "what Asheville is searching." Say "these are searches that already showed your account."

Do not sell a ranking engagement off this carousel. Do not comment RANK.

**Effort.** A few minutes to add a property, then a look once a month. Zero if the rollout has not reached the account.

**Risk.** Treating a thin report as a content strategy. Connecting a client's social login to a tool without them in the room. Promising the keywords will move a map pack. They will not. This report is web search to the social URL, not Google Business Profile.

**Compliance.** No ranking promise. The client's Search Console is their data. Human approval before anyone connects an account. North Carolina contractors still need their site, their Google Business Profile, and their reviews looked at directly. This carousel does not cover those.

---

## 2026-10-17 — "Can scout do this?"

**Status:** Logged. Nothing built. No form submitted, no login used, no listing contacted.

**Classification:** (B). Internal research habits. It is not a product and not an acquisition firm.

**Source**

- Slack drop: James Fullen, `#peacemaker-ideas`, 17 October 2026, 10:10 PM ET. The only note is "Can scout do this?"
- Video: https://www.instagram.com/p/DdXGFhbM2vt/ — `jadesprake` (Jade Sprake). About 117 seconds. No caption in the metadata. The later card says comment "coffee" and that it is sponsored.

**Fetch:** `yt-dlp` video, Whisper, and OCR of frames. A lot of the screen is a Notion board and a chat. The reading below uses the lines that repeated cleanly. Her individual listings, prices, and broker notes are not copied into this log. They are her pipeline, not Peacemakers leads.

**Assumption about "scout"**

There is no Slack user named Scout, and there is no Scout in this repo or in the cloud-agent list checked for this pass. The reel itself labels an agent "Scout." James's question is read as: can a Peacemakers research agent do the workflow on that screen? If he meant a different Scout, the answer below is still about that workflow.

**What the reel shows**

Two things are on screen, and they are not the same kind of work.

1. A hunt for on-market businesses for sale, mostly British Columbia, in home services and neighboring trades. Scout logs rows to a Notion board Jade named. The rules she states, as read from the screen: Scout finds and logs. She reviews the British Columbia cards. Skip NDA, captcha, and dead listings. Do not contact owners or brokers. Rows that need an NDA or are not a simple page stay in "Needs Jade Review" for a person. The board is described as hers. Scout's notes stay in Scout's area.
2. A second sequence, which is the part the voiceover sells: agents that share one computer, log into tools she already uses, search listings, sort by city and price, add rows to Notion, and one of them logs into her Starbucks and orders a drink because it remembers the order. A chat on screen also shows an instruction to submit inquiries on listing sites that have a simple form, while another note says not to contact anyone. The reel contains both instructions.

**Answer**

The logging half, yes, in the shape Peacemakers already uses for prospect research. A person can ask an agent to read public pages and put rows in a review queue: business, city, what was public, the URL, and why it was skipped. A person decides what happens next. The North Carolina prospect list and the Asheville lead notes already sit in open pull requests. This reel is not a reason to start a second one, and it is not a reason to go buy companies.

The other half, no.

- An agent does not get James's passwords, his Google, his Starbucks, or a client's login.
- An agent does not submit a form, send a DM, or email an owner or a broker.
- An agent does not "order the usual."
- Her for-sale list is not imported. Peacemakers is not shopping for a plumbing company. The clients are operating companies in the $5–50 million range, and the first sale is a Blueprint, not an acquisition.

**Effort.** No build. If he later wants the logging habit stated in one place, it is a short rule on top of the prospect work he already has: public pages, a queue, a named person, no contact. That rule is not written here as a new system.

**Risk.** A computer-use agent with stored credentials. Form spam. A listing site's terms. Treating another person's deal board as leads. An order, a message, or a login that looks like James because the agent was on his machine.

**Compliance.** Human approval before any contact. Agent security: secrets stay with the person, not in a prompt and not in a shared desktop session. AI governance: the agent does not take the action a customer, a broker, or a vendor would feel. Evidence: this note is OBSERVED from her screen, not a claim that any price or status on that board is accurate.

---

## 2026-10-20 — Prediction-market copy trading

**Status:** Logged so the ID is skipped next time. Not an idea. Steps, site names used as a funnel, and the access code are not recorded.

**Classification:** (D). Not consulting, not homeschool, not publishing.

**Source:** https://www.instagram.com/reel/DesQiQihX1V/ — `prediction_alpha`. About 163 seconds. James dropped it 20 October 2026 with no note. Caption asks people to comment for a playbook and tags prediction and trading.

**What it is, without the method:** a pitch to copy other people's trades on prediction markets. That is not a service for a contractor, not a homeschool lesson, and not a book. Peacemakers does not adopt it and does not pass the playbook on.

---

## 2026-10-26 — Hormozi, to a young father who is broke

**Status:** Logged so the ID is skipped next time. Not an idea to adopt.

**Classification:** (D). Personal advice. The first fetch of this reel returned an empty media response. A second `yt-dlp` fetch got the file (about 15 minutes). `hormozi`. Caption: he is tired of being broke, and the reel is for long-form on Instagram.

**What it is:** He answers a young man who stopped him, working two jobs with a one-year-old. The advice is cut every cost, work more, learn to sell someone else's product, then sell his own, expect rejection, and be willing to hear no. Parts of the back half are about applying for jobs in person and messaging many people at a company.

**Why it stays (D):** It is a personal sermon, not a Blueprint, not a homeschool lesson, and not a book. The hard edges (the family will suffer, show up at a workplace after a shift, volume-message strangers, "make up for" no experience) are not tactics for Peacemakers outreach. Ordinary sales sense that is already true here (a note should be specific to that owner, a no is information, one real conversation matters) does not need this reel to justify it, and it does not justify showing up uninvited at a contractor's office.

No client email, no post, and no outreach script comes from this drop.
