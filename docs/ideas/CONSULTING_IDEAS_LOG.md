# Consulting ideas log

Notes from public sources James drops for Peacemakers AI. An entry records the source, what it actually shows, and whether the claims hold up. It is not a recommendation, a client deliverable, a build, a scheduled post, or an approval to spend money.

`docs/ai-practice/` is not on `main`. It lives on the open branch `cursor/ai-practice-compliance-demo-028f`. Effort, risk, and compliance notes below follow that playbook and the standards that are on `main`: `owner-ops/docs/peacemakers-operating-system/AI_GOVERNANCE_STANDARD.md`, `HUMAN_APPROVAL_STANDARD.md`, `CONSULTING_STANDARD.md`, and `owner-ops/docs/future-recommendation-philosophy.md`.

Evidence labels: VERIFIED, OBSERVED, INFERRED, HYPOTHESIS, ASSUMPTION, CONTRADICTED, UNKNOWN.

This file is not on `main`. Other open idea-log branches add their own copy. This entry stands alone so it can be reviewed on its own.

---

## 2026-10-29 — Code-rendered animation Reel, network of faceless pages

**Status:** Logged only. Nothing generated, scheduled, posted, installed, or purchased. James's approval is required before any of that.

**Classification:** (B) Peacemakers AI consulting — his own marketing. Homeschool is out of scope for this note. A separate agent covers that repo.

**One line:** The caliber worth borrowing is a short, code-drawn explainer (type, a diagram, a caption). The method on screen — feed Claude someone else's Reel and have it match the character, the motion, and the captions, then run that across five accounts — stays off the table.

### Source

| Field | Record |
| --- | --- |
| Slack | James, `#peacemaker-ideas`. Note: "Find reels of this same animation caliber and apply to peacemakers Ai and homeschool." |
| URL | https://www.instagram.com/reel/DfDQUMZyqsR/ |
| Creator | `@sina.growthtech` (OBSERVED on the embed). Profile line at fetch: 1,093 posts, 180K followers. |
| Posted | The embed said "4 hours ago" at about 00:48 UTC on 29 Oct 2026, so the evening of 28 Oct UTC. His laptop clock in the screen recording read Wed Oct 28, 12:54 PM. |
| Length | 81.6 seconds (ffprobe on the downloaded file). 720×1280. |
| Counts at fetch | 169 likes, then 172 a few minutes later. 20 comments. View count was not on the embed. |
| Caption | "how to use your AI agent to build a NETWORK OF VIRAL FACELESS SOCIAL MEDIA PAGES that bring in customers" and "use Claude to gorilla post and scale multiple accounts with high quality animated videos rendered in code." Hashtags: `#ai #aiagents #vibecoding #claude`. |
| Fetch | yt-dlp returned an empty media response. Firecrawl refuses Instagram ("we do not support this site"). The public embed page in a browser exposed the mp4, and that file downloaded. Speech is a local Whisper small pass. On-screen lines below were read from frames (Tesseract plus a look at the frame), not from the caption. |

### What is on the Reel

**0:00–0:17 — someone else's clip.** A shirtless man flexes. On-screen text, read from the frame: "THE FBI HAS DEEMED MY MUSCLE CONTROL A NATIONAL SECURITY THREAT. HERE'S WHY THEY ACCUSED ME OF RUNNING AN ILLEGAL, UNLICENSED WEAPONS PROGRAM. BUT IT'S JUST MY PECS." The speech is about the chest draping over the shoulder. Sina then insults him and pivots. This open is not animation, and it is not his footage.

**0:18–0:29 — the promise, on camera.** Sina, backwards cap, talking to the lens. Card: "How to build a network of accounts with your agent ORGANICALLY," with "network of accounts" in red. Spoken: a network of viral faceless pages and side accounts that "drive in attention and customers." The caption's word for the same plan is "gorilla post."

**0:30–0:46 — the reference and the prompt.** He films a laptop. One tile is a Reel with "1,293 likes" and "3 days ago" over a prompt that reads "make a reel about early TikTok." The next is `@adilet.fndr`, "6,013 likes," "1 day ago," with the line "IKEA makes you walk through the whole store," beside a chat that says "make a reel about why IKEA makes you walk through the whole store." He says to look at the motion graphics, then make "this bum ass page" and its "lame ass animations" look like those, by giving Claude the example video, telling it to spot the differences, and upgrading the skill folder.

**0:46–1:08 — his render.** A preview card in the same editor. Readable type: "ANTHROPIC JUST FILED FOR ITS IPO," then "One step closer to you being useless." A ticker row reads NASDAQ / IPO / ANT. A later frame shows "OCT 26 2026" and "Anthropic filed to go." An anime-style character stands on the card: undercut, cravat, grey hoodie. The sidebar of the same screen lists Motion design, Landing page, Posterract, and "for Savages." He says this is the example versus his version, "exact same anime, exact same animations, exact same captions," with "cooler characters."

**1:08–1:22 — the posting desk.** A dark board titled "every business, every account," with the word Posterract and rows of pages (one readable name is "The Alchemist") and green posting cells. Then his face. Spoken close: he connected his accounts to Posterract, and he is "running five accounts simultaneously every single day." One clause in the middle ("Claude mass three accounts… I posted two") did not come through cleanly. The picture supports the Posterract board and the five-accounts close. It does not support a customer count.

### Animation, in plain terms

The caliber he is pointing at is not a filmed talking head and not a video-model clip. It is a vertical motion-graphics card:

- A paper or flat-color ground, halftone on some of the reference Reels.
- One big line of type, often a serif, with a small kicker above it.
- A simple moving diagram (a ticker, a stack of cards, a dotted arc, a power strip).
- Sometimes a cartoon person who stays in the corner and reacts. On Adilet's public Reels that person is his own mascot (beard, glasses, beanie). On Sina's Anthropic card the person is an anime-style character with a well-known protagonist's haircut and cravat.
- Cuts about every one to two seconds. The whole reference piece is under a minute. Captions are burned in. There is a voice, and on Adilet's system that voice is generated.

Pacing of Sina's own Reel is a talking-head sales cut, not the animation. The animation is the thing on the laptop, shown for about half the minute and twenty seconds.

### How that picture is actually made

Two layers, checked separately.

**What he says and shows.** Give Claude an example Reel. Tell it to spot the differences against "our" videos. Upgrade a skill folder. Render. Schedule the result in Posterract across several accounts. The caption calls the picture "animated videos rendered in code."

**What the reference creator says he uses.** `@adilet.fndr` sells the folder Sina is matching. His page, scraped this pass ([adiletfndr.com](https://adiletfndr.com/)): one prompt in Claude Code, Cursor, or Codex; the folder writes a script, a voiceover, and scene animation, then renders. He calls it "an animated edit," and he says it is not AI-generated footage. The file list on that page is code: `bigBoxStore.js`, `captions.js`, `reel.mjs`, `illustrate.js`, `tts.py`, plus font files. Voice is ElevenLabs (he says the free trial is enough to start). He also says plain Claude, or the free Remotion skill, will make a video and that his folder is what makes it look like his. Price on the page this pass: $57, going to $97 on 1 Nov. The 47,077 followers and 5.9M views are his screenshot claim, dated 28 Oct on the page. This pass did not see the Instagram dashboard, so those totals stay his claim.

**What that rules out.** This is not Higgsfield, Seedance, or a "recreate this clip" video model. A different creator (Marcus Mewett) teaches that path. It is the wrong tool for this Reel, and it is a worse fit for copyright, because the point of that path is to recreate someone else's clip. HyperFrames (HeyGen's code-animation plugin) is a real public way to render HTML to video with Claude. It can hit a similar type-and-diagram look. It is not what is on this laptop.

Posterract is a real product ([posterract.app](https://posterract.app/)). Its own privacy page describes it as a content-agent harness and scheduler: you bring a model key, it stores chats and connected-account tokens, and it publishes the video you select. The marketing page scores posts by views, likes, comments, and streaks. Sina's "every business, every account" board matches that product. His "five accounts every day" is his operating claim, not a result the product promises.

### Claims that do not hold

| Claim | Verdict |
| --- | --- |
| "You've never seen this before," over the pecs clip. | CONTRADICTED as a method. The first 17 seconds are another creator's Reel, used as a cold open. |
| The card says ORGANICALLY. The caption says gorilla-post a network of accounts. | Both are his words. Five accounts a day, scheduled by an agent, is a volume desk. It is not word of mouth. |
| "Exact same anime, exact same animations, exact same captions," with cooler characters. | OBSERVED as the instruction he gives Claude. That instruction is a copy. The character on his Anthropic card is close to a recognizable anime protagonist. Using it, or asking a model to match it, is the copyright problem in this Reel. |
| These pages "bring in customers." | UNKNOWN, and not shown. This Reel had about 170 likes when fetched. No buyer, no call, no dollar from a client appears. |
| Adilet: 47k followers, 5.9M views, $2.5k in brand deals, from one prompt, in six weeks. | His page says so, and he links the Reels below. The Reels exist. The dashboard totals were not re-counted here. A prompt still needs his folder, an ElevenLabs account, and a coding agent. "One prompt" leaves out that stack. |
| The Anthropic card is a news report. | The filing is real: a public wire says Anthropic filed a Form S-1 on 26 Oct 2026 for Nasdaq under ANT ([TopFive](https://topfive.ai/wire/anthropic-files-s-1-for-nasdaq-ipo-under-ticker-ant/)). "One step closer to you being useless" is a joke on the card. It is not a sentence for a Peacemakers video. |

### Same caliber, other public Reels

These five are the reference set on screen and on Adilet's page. Thumbnails and captions were checked this pass. They are founder and AI-coding explainers. None of them is a builder, a contractor, or a home-services ad. A trades Reel at this caliber was not found, so none is invented here.

| Reel | One line |
| --- | --- |
| [DdyqycEINNe](https://www.instagram.com/reel/DdyqycEINNe/) | Paper ground, his own cartoon mascot, a liability number landing on the frame. Caption is a list of vibe-coded-app lawsuit traps. |
| [DdbYNbdIP2e](https://www.instagram.com/reel/DdbYNbdIP2e/) | Dark UI: two location cards, a dotted arc, a court-quote card about remotely loaded Google Fonts. About 43 seconds. |
| [Dd4LrTSsx0i](https://www.instagram.com/reel/Dd4LrTSsx0i/) | Same mascot on a halftone ground, plugged into a GitHub card with a power-strip diagram. A plugin explainer. |
| [Ddb1UVZIakr](https://www.instagram.com/reel/Ddb1UVZIakr/) | White grid, one huge line, colored pills, a terminal window. A skills explainer. |
| [DdgPH-poGbJ](https://www.instagram.com/reel/DdgPH-poGbJ/) | Dark field, nine dotted orbs, product type. Same studio, no character. |

His dollar figures ($150,000, €100 per visitor, $53,000 per child) are his captions. They do not come into a Peacemakers script. A security Reel for vibe-coded apps is already a separate log entry. This note does not reopen it.

### Where it fits Peacemakers AI

It fits his own marketing, as a picture under a sentence he already believes, after he approves the cut.

He prefers a walk-and-talk off talking-point cards. The animation is an insert for that, or one standalone test if he wants the faceless form once. It is not a second channel, and it is not five channels.

The homepage already holds the contradiction he likes. Common belief: the AI project is a new chatbot or a new tool. The line the site already uses: understand the workflow, use current tools first, and decide where automation or AI actually helps, before buying more software. A 15-second card can draw that. The $3,500 Blueprint stays the offer. Implementation stays a later decision. No view count, no "customers from the page," no borrowed clip.

It does not fit a client system. A builder or a contractor does not have "we need a network of faceless anime pages" as the constraint. Adding Posterract, a skill folder, and five accounts because a Reel made it look easy skips the ladder: simplify, use what they already have, then automate. The monthly tiers do not become a content desk.

A client-facing animated explainer is a later, separate piece, and only when a Blueprint shows they already have one message worth drawing and a person on their side who will check every line. One account. Their facts. Their brand. Still not a network.

### Three ways to use the caliber

**1. A 12–15 second insert in the walk-and-talk. This is the one to try first.**

James films the card talk as he does now. Under one sentence, cut to a code-drawn card: a phone with no answer, then the same job inside the tool the company already pays for, then the line "current tools first." Off-white ground, one serif line, no mascot. His voice stays the voice, so there is no synthetic narrator and no disclosure problem about who is speaking. The picture is original. Nobody's Reel is the prompt.

Tool: Remotion (MIT) in a private folder, or HyperFrames if the Remotion draft looks too plain. Cursor or Claude writes the composition from a script he has locked, about 40 words. Render locally with Chrome and ffmpeg. First draft is one working session of notes, not a channel build. Software cost is nothing. Model cost is whatever that session already costs him. ElevenLabs stays unused on this version.

**2. One standalone Reel, same card, if he wants the faceless form once.**

Same script, same render, 20 seconds, posted on the existing Peacemakers account after he watches it. Still his approval, still one account. A synthetic voice is optional and, if he uses one, the caption says the voice is synthetic. The picture is a diagram, not a fake customer and not a fake employee.

**3. Leave it out of the offer.**

Do not add a faceless-page network, Posterract, or a "we'll make your Reels" line to the Blueprint or the $10k / $15k / $20k months. If a later Blueprint shows that explaining one existing offer is actually the constraint, the insert in idea 1 can be reskinned with that client's words, as a proposed piece he approves. No ROI number comes from this Reel.

### Effort, risk, compliance

**Effort.** This pass is the log. Idea 1 is a draft he can throw away. It does not need Adilet's $57 folder, Posterract, a new social account, or a video-model credit pack.

**Risk.** Telling a model to match a reference Reel, which is the whole middle of this video. The anime character on his card. Opening on a clip James does not own. Five accounts and an agent that posts, which fights the platforms' rules and looks like spam to the owner of a $5–50M firm. Copying Adilet's penalty numbers into advice. A cheap first render that gets posted before anyone art-directs the type.

**Compliance.** Publishing is James's approval (`HUMAN_APPROVAL_STANDARD.md`). The playbook on the open AI-practice branch says Peacemakers will not claim a time saving, an error rate, or a dollar return unless that client's own test is attached, and it says model output is not promised free of third-party claims. A diagram avoids the second problem only if the script, the character, the music, and the font are ones he has the right to use. Use a font he already licenses, or a font whose license allows this, and do not copy the font files out of someone else's skill folder. Music is original or licensed. The practice playbook also says a bot that talks to a customer's customers identifies itself, and that Peacemakers will not present a draft as a licensed professional's work. Idea 1 uses his voice, so that duty does not wake up. Idea 2 with a synthetic voice says so in the caption. FTC Act Section 5, as that playbook summarizes it, still forbids a deceptive picture: the character is not a customer, and the Reel does not imply a result he has not measured.

**Not approved:** commenting on the Reel, buying the skill, connecting any account to Posterract, prompting Claude with Adilet's Reel or Sina's Reel as the thing to copy, drawing the anime character, using the pecs clip, posting, and telling a client this is part of the Blueprint.
