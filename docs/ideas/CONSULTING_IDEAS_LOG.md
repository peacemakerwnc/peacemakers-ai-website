# Consulting ideas log

Notes from public sources James drops for Peacemakers AI. An entry records the source, what it actually shows, and whether the claims hold up. It is not a recommendation, a client deliverable, a build, a scheduled post, or an approval to spend credits.

`docs/ai-practice/` is not on `main`. Effort, risk, and compliance notes below follow the standards that are in this repo: `owner-ops/docs/peacemakers-operating-system/AI_GOVERNANCE_STANDARD.md`, `HUMAN_APPROVAL_STANDARD.md`, `CONSULTING_STANDARD.md`, and `owner-ops/docs/future-recommendation-philosophy.md`. They also follow the unmerged practice note that Peacemakers will not attach a time savings, an error rate, or a dollar return unless that client's own test is attached and labeled as theirs (`docs/ai-practice/compliance-playbook.md` on `cursor/ai-practice-compliance-demo-028f`, section 11).

Evidence labels: VERIFIED, OBSERVED, INFERRED, CONTRADICTED, UNKNOWN.

---

## 2026-10-31 — STORIFY: customer is the character, brand shows up late

**Status:** Logged only. Nothing written for the site, generated, scheduled, or posted. James's approval required before any public copy.

**Classification:** (B) Peacemakers AI consulting — his own marketing and the offer narrative, with a possible one-page worksheet later if a Blueprint shows the client's constraint is how they explain the work. Not homeschool, not a book, and not an AI tool.

**Why this file:** The Reel is a business-storytelling and sales-copy formula (`#brandstorytelling`, `#businessstorytelling`). Business and marketing content belongs with the consultancy. If this was saved for @buildingpeacemakers instead, say so and this entry should move.

### Source

| Field | Record |
| --- | --- |
| URL | https://www.instagram.com/reel/DfG-CFgNPOK/ |
| Creator | Chris Hewitt, handle `@storytelling_in_business` (OBSERVED from the post metadata). Instagram display name on the post: "Chris Hewitt". |
| Posted | 2026-10-30, 06:48 UTC |
| Length | 1:16 |
| Public counts at fetch | 931 likes, 17 comments. View count was not in the metadata. |
| Caption | "Use this formula to create a brand story audiences will flock to #brandstorytelling #businessstorytelling" |
| Fetch | Firecrawl refuses Instagram ("we do not support this site"). yt-dlp retrieved the file, caption, comments, and metadata. On-screen lines were read from frames. Speech-to-text was a local Whisper pass (base.en for the full reel, small.en for the open, the intervention line, and the sign-off). |

### What is on the Reel

Talking head, attic office, navy shirt, lapel mic. Burned-in captions in white with one word in cyan. No demo, no screen recording, no tool.

**0:00–0:16 — hook.** Top card: "The secret code to unlock your brand story." Captions: "EVERY STORY THAT EVER MADE YOU / CRY, BUY OR CHANGE / YOUR MIND FOLLOWS THE SAME SECRET CODE." Spoken line on the small.en pass: "Every story that ever made you cry, buy, or change your mind follows the same secret code. Hollywood knows it, Pixar knows it, and you're about to know it." Then: most businesses have never heard of it; seven letters spell STORIFY.

**0:16–0:55 — the seven letters, in the order he says them.**

| Letter | On-screen title | What he adds |
| --- | --- | --- |
| S | "S IS FOR SOMEONE." | "A real person with a real name." "Never the brand itself." |
| T | "T IS FOR TENSION." | "The feeling underneath." "The knot in the stomach." "The frustration that needs taking away." |
| O | Obstacle (spoken; the card shows the example) | "The villain." "Give it a face." "Give it a name." |
| R | Risk (spoken) | "What happens if you don't solve the problem?" |
| I | "THE PROBLEM? INTERVENTION." | "This is where you step in." Card: "NOT WITH A SPEECH" / "BUT WITH ACTION." The audio pass is muddy on the words just before "speech." |
| F, Y | "FUTURE YOU." | "You on the other side of the purchase." "Who your audience actually becomes." "Bigger than anything that they've bought." |

**0:55–1:12 — the turn.** "Did you notice something? You didn't even turn up until letter five." "The brand is never the hero. It's the guide." Then: "Crack it and people stop scrolling. They start feeling. They start to remember you. And once they remember you, their actions will change."

**1:12–1:16 — sign-off.** "My name is Chris." Card: "CHIEF STORYTELLER." Next card, OCR: "HERE AT BARCLAY." small.en heard "Chief Storyteller here at Barclays Communications." "Follow me for more tips."

Useful comments, not the emoji replies: one viewer still does not know where to start; one asks how "brand is the guide" sits with brand archetypes (if the brand is always the guide, every brand would be the Sage); one asks whether the whole formula has to fit in one short video. A Facebook repost snippet of his STORIFY talk summarizes S as "Story." This Reel's own card says S is Someone.

### Method actually shown

A copy outline, said in order:

1. Name one person. Not the company, and not "businesses."
2. Name the feeling under the practical problem.
3. Name the obstacle as a villain with a face.
4. Say what happens if it stays unsolved. He does not show a number.
5. Only then does the brand act, and the act is a deed, not a speech.
6. End on who that person becomes after the purchase, which he says should be larger than the thing they bought.
7. Keep the brand in the guide seat. He says the guide arrives at letter five (I), after Someone, Tension, Obstacle, and Risk.

That is the whole method. There is no worksheet, no example brand, and no before/after in the Reel.

### Claims that do not hold

| Claim | Verdict |
| --- | --- |
| Every story that made you cry, buy, or change follows these seven letters, and "Hollywood knows it. Pixar knows it." | CONTRADICTED as stated. Pixar's published story spine, the one Emma Coats listed as rule 4 and attributed away from herself, is Kenn Adams's spine: "Once upon a time there was ___. Every day, ___. One day ___. Because of that, ___. Because of that, ___. Until finally ___." (the often-dropped last beat is "And ever since that day ___"). See [Aerogramme, 2013](https://www.aerogrammestudio.com/2013/03/22/the-story-spine-pixars-4th-rule-of-storytelling/). That is character, routine, disruption, consequence, outcome. It is not this sales acronym, and it does not say the brand arrives at beat five. Hollywood uses more than one structure. |
| "Most businesses have never heard of it." | The packaging "STORIFY" may be his. The pieces are not new. Donald Miller's StoryBrand sequence is a character, a problem, a guide, a plan, a call to action, failure avoided, and success. His own firm page in 2019 already said "all stories follow the same basic architecture" and sold the feeling, without these seven letters on the page ([Berkeley, 30 Oct 2019](https://www.berkeleypr.com/brand-story-formula/)). "Never heard of it" is the hook, not a survey. |
| "The brand is never the hero. It's the guide." | A useful default for an offer page, and the same move StoryBrand teaches. It is not a rule. Founder-led proof, a category explanation, and some B2B trust pages put the operator in the frame on purpose. A commenter on this Reel already asked how that sits with archetypes. |
| "Crack it and people stop scrolling. They start feeling. They start to remember you. And once they remember you, their actions will change." And the caption: audiences "will flock to" the story. | No evidence in the Reel. No client, no count, no held-out post. The comment count on this post is 17, and several of those comments are people who still cannot apply it. Feeling and memory are not a guaranteed result of an acronym. |
| Future-you is "bigger than anything that they've bought." | A writing prompt. For a roofer or an HVAC owner, "bigger than the job" is an inflated value claim unless that owner said it and it is labeled as theirs. |
| Sign-off title. | MIXED. The card and the audio pass say Barclay / Barclays Communications. The byline on his firm site says "founder and Chief Storyteller here at Berkeley Communications." A public LinkedIn snippet for the same name reads "Chief storyteller & Group CEO at Berkeley Communications." Do not repeat "Barclays" in Peacemakers copy. Do not imply a bank role. |

### Where it fits Peacemakers AI

**Fits: his own marketing, as a rewrite of pages that already exist.** The Blueprint page already puts the owner in the first seat ("Understand the Work Before You Automate It"), names lead follow-up, admin bottlenecks, and workflow inconsistency, and already casts Peacemakers as the person who slows the tool pitch down (`peacemakers-ai/blueprint.html`, including "Why Peacemakers AI Exists"). STORIFY does not add a new offer. It is a stricter order for one paragraph or one Reel he would later approve:

- **Someone.** One owner of a named trade. A real person only with permission. A composite must be labeled as a composite. No invented "Mike in Asheville."
- **Tension.** The feeling under a bottleneck the site already names: estimates with no second call, status chasing, not knowing which leads are real.
- **Obstacle.** Name the villain the page already implies: another person pushing the latest AI tool, or a chatbot that was installed and left. Give that a face the owner would recognize. Do not invent a competitor.
- **Risk.** Only a consequence he has already published or a prospect has said. No dollar loss, no "hours saved."
- **Intervention.** The Blueprint's actual work: map the process, look at current tools first, leave with a written plan. The page already says implementation is scoped separately. That deed is the intervention. A speech about transformation is what he told people to skip.
- **Future you.** The same owner with that one process clearer. Not "bigger than anything they've bought," and not a monthly-tier promise.

The same order can shape a first outreach note or a Loom, using one observation about that company. It cannot use his hook ("secret code," "Hollywood knows it," "audiences will flock").

**Possible later fit: a client worksheet, still only proposed.** If a Blueprint shows that this client's constraint is how they explain their own offer to homeowners, the seven blanks are a one-page prompt inside the packet. The answers have to come from the owner's words. It is not a content system, not a Reel factory, and not a reason to add a tool.

**Does not fit, on this evidence:**

- A system to build. Nothing in the Reel is software. The escalation ladder stops at "rewrite the sentence we already have."
- The price. $3,500 stays a diagnostic. The $10k / $15k / $20k months are not "we storify your brand" and not a promise that customers will act.
- An assessment demo, unless the intake already captured this owner's words. Do not generate a customer.
- Outreach that copies the Reel, tags his account, or uses "stop scrolling" as a claim.

### Effort, risk, compliance

**Effort.** One writing pass on the Blueprint hero or the "Why Peacemakers AI exists" section, or a six-line internal worksheet. No shoot, no credits, no new page required to test the order. A public Reel in this format would be a separate decision.

**Risk.** Inventing a named customer. Putting a dollar figure on the Risk line. Promising that the copy will make people stop scrolling, remember Peacemakers, or change what they buy. Importing a UK PR-agency persona ("chief storyteller," Barclay/Barclays/Berkeley) into a consultancy that already sounds like a practical reviewer. Using his Reel, his caption, or his sign-off.

**Compliance.**

- No publish until James approves that specific text. External publishing needs his approval (`HUMAN_APPROVAL_STANDARD.md`).
- Copy drafted from this note is a draft a human edits. It does not post or send.
- No client name, job, or recording goes into a model to "fill in STORIFY." If a worksheet is ever used, the owner supplies the words and they stay in the packet.
- No time savings, error rate, view count, or dollar return on the page, in outreach, or on a call, unless a specific client's own test is attached and labeled as theirs.
- Do not claim Pixar, Hollywood, or "every story" uses this acronym.
- Do not quote or repost the Reel.

**Decision for James:** use the six blanks on the next pass through the Blueprint page, or leave this as a note. Reject means no site change.
