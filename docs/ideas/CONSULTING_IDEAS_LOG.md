# Consulting ideas log

Peacemakers AI is the consulting practice: a **$3,500 Blueprint** assessment, then a monthly AI department at **$10,000, $15,000, or $20,000**. The work is interviews plus a live draft built from the client's redacted documents, with a person approving anything a customer or a lender would rely on.

This file is for that practice. It is not a note for the homeschool accounts, the children's books, or the printables.

James posted the Reel below in `#peacemaker-ideas` on 19 October 2026, with no other text: [19 Oct 2026, 23:06 EDT](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1792465577610949).

How it was read, on 20 October 2026:

- Video and metadata: `yt-dlp` 2026.08.19. Firecrawl refused the Instagram URL ("we do not support this site"). Instagram served no subtitle track.
- Caption: yt-dlp `description`. Instagram oEmbed returned an empty body.
- Voice: faster-whisper 1.2.1, `small` model, int8, on a 16 kHz mono WAV. That is a transcript, not an official caption.
- On-screen text: frames read by eye. Tesseract on the full frame mostly recovered the burned-in caption and missed the phone UI. The lines below are the ones that were readable.
- The live Forged Fitness landing page, Nielsen Norman Group's link-label article, CXL's call-to-action article, Michael Aagaard's Unbounce CTA write-up, and the FTC's 1984 advertising-substantiation policy statement were fetched the same day.

Counts from the download change. Views were not in the metadata file.

The safety notes below follow `docs/ai-practice/compliance-playbook.md`. That playbook is on the open branch `cursor/ai-practice-compliance-demo-028f`, not on `main` as of this writing. Nothing below is a revenue forecast.

## Classification

**(B) Peacemakers AI consulting.** The Reel is a landing-page test from Lynsey Johnson, co-founder of Forged Fitness Equipment in Novi, Michigan. They design, deliver, and install home gyms. Cold ads hit a page, the button that scrolls to the form used to name a call, and she says swapping that label for "I'd like to explore my options" doubled ad-click to form-submit overnight. That is a sales-page tactic for a design-and-install company. Builders, contractors, and home-service firms run the same shape of page.

## The action

When a Blueprint client's ads are being clicked and the form is not being submitted, read the button that reveals the form. If that button names a quote, an estimate, or a discovery call, write a second label that says what the visitor actually gets on the next screen, leave the ads alone, and measure two rates: ad click to form submit, and form submit to a kept appointment.

Leave the offer where it is. Do not put "2x" in a proposal, an ad, or a case study. Her page still uses the softer button on 20 October 2026. That shows she kept the line. It does not show the lift.

**Effort.** A copy test inside a Blueprint whose subject is a paid landing page that already has traffic. No new system, no agent, no outreach sequence. Peacemakers' own site already puts a free scorecard next to "Book a 15-Minute Intro." This Reel does not require a rewrite of that pair.

**Cost.** $0 in software. The cost is the week of ad spend used as the sample, which the client is already spending if the page is live.

**Risk of doing what the Reel says.** Telling an owner that one button doubled conversion. Using "explore my options" when the next screen is a price or a contract. Filling the form more often and booking fewer real jobs, then calling the extra submits a win.

## The Reel

https://www.instagram.com/reel/Dd5BL80RJZU/

### What was retrieved

| Item | Observed |
| --- | --- |
| Account | `lynseyjanejohnson`, display name "LYNSEY \| Home Gyms \| Michigan" |
| Posted | 30 September 2026 (yt-dlp `upload_date`) |
| Length | 116.8 seconds (ffprobe on the downloaded file) |
| Picture | 1080×1920 |
| Likes / comments at download | 3,649 likes, 143 comments. Views were not in the file |
| Caption | "One small change = 2x in conversion" |

Spoken transcript (Whisper small). A few words are cleaned where the picture agrees (`CTA` where the model heard `CTN`; the winning line matches the button on screen and on the live site):

> I'm gonna tell you one thing we just changed on our landing page that doubled conversion overnight. We currently run all our cold traffic to a landing page, and then the CTA on the landing page used to be like, click to schedule your home gym discovery call, home gym fit plan call, home gym design call. I've tested all different types of copy on this. And for context, we sell home gyms. So we build them, design, deliver and install. And so I would think home gym discovery call, fit plan call would be the right copy. And then today we met with a sales coach person to go over our sales motion as a whole. And he was like, what's in it for them? Why would they book this call? And we were like, well, if you really wanted to build a home gym, wouldn't you want to get on a discovery call? And he was like, for most people, that is too big of an ask. So I changed the landing page CTA. So the buttons that bring you down to the form, from "book a home gym call" or "book my home gym call" to "I'd like to explore my options." Doubled. And now I'm not talking about the click rate on the ad. Those are all sitting the same. I didn't change anything about the ads. The only thing I changed was the landing page CTA, because that was where our metrics were falling off. People were clicking the ad wanting to opt in but not actually filling out the form or clicking the CTA button to bring them to the form. And then we got a bunch of leads from this. Immediately the conversion was double, from people who clicked the ad to people who actually submitted their information, just from changing "book my…" I tried everything: book my free call, book my free home gym discovery call, free home gym discovery call, home gym discovery call with the owner. None of them converted better than the other. The current winner is "I'd like to explore my options." The sales coach was explaining a lot of the psychology behind that: people don't want to feel sold. They want to feel consulted. So instead of selling, it's like prescribing what they need.

On-screen, in order:

- Burned-in caption for the whole Reel: **"One change on our landing page doubled conversion overnight."**
- Her face, then a screen recording of a mobile landing page. The readable hero is **"Get Strong Using Your Home Gym. Not Installing It."** A dark button reads **"BOOK MY HOME GYM CALL."**
- She scrolls. A section reads **"Who This Is For."** Later a green button reads **"I'D LIKE TO EXPLORE MY OPTIONS."**
- The form under that button, on the phone in the Reel, asks for name, email, phone, zip code, and budget, with a small note that the budget answer is used to point them the right way.
- Near the end she is back on camera. No chart, no before-and-after table, and no sample size appears.

### The method, as she tells it

1. Cold traffic goes to one landing page. The ads stay as they are.
2. The old buttons named the call: discovery call, fit-plan call, design call, free call, call with the owner. She says those variants tied with each other.
3. A sales coach asked what the visitor gets, and called a discovery call too big an ask for most people.
4. The button that scrolls to the form becomes **"I'd like to explore my options."**
5. She says the rate from ad click to submitted form doubled the same day. The story she gives for it is that people want to feel consulted, and the call should prescribe rather than sell.

### What holds, and what does not

**The button she names is the button on the live page.** Retrieved 20 October 2026, [Book a home gym call](https://forgedfitnessequipment.com/pages/book-a-home-gym-call) on forgedfitnessequipment.com. The URL still says `book-a-home-gym-call`. The buttons say **"I'd Like to Explore My Options."** The hero matches the Reel: "Get Strong Using Your Home Gym. Not Installing It." The page says they design, source, deliver, and install complete home gyms within about 90 minutes of Novi. Under the form heading the page says "Explore Your Options" and "Enter your information here and we'll follow up with your next step." A section on the same page says the first call does not ask the homeowner to pick equipment, and that a paid "Home Gym Design & Fit Blueprint" is the later step, credited toward the build if they move forward within 30 days. LinkedIn's public snippet for Lynsey Jane Johnson, retrieved the same day, calls her co-founder of Forged Fitness Equipment in Novi. The company and the button are real.

**"Doubled overnight" is her sentence, and the Reel does not contain the test.** No visitor counts, no dates, no two-bar chart, no held-out ads. She says she changed the button the day she met the coach, and that the lift was immediate. One day after a meeting is a before-and-after story. It is not a controlled test. The caption's "2x" is the same story. Keeping the button on the site three weeks later (posted 30 September, page read 20 October) is a sign she preferred the line. It is not a measurement of the lift.

**The form in the Reel is still a lead form.** The phone screen asks for name, email, phone, zip, and budget. The softer words sit on the button that reveals that form. She did not remove the ask. She renamed the door. The metric she claims is ad click to form submit. She does not say those extra submits became installs.

**A specific, true label is the part other people have measured. A doubling is not.** [Nielsen Norman Group, "Better Link Labels: 4Ss for Encouraging Clicks"](https://www.nngroup.com/articles/better-link-labels/) (Hoa Loranger, 10 March 2019, page retrieved 20 October 2026) says a link's job is to say what is on the other side of the click, and that the label has to be specific, sincere, substantial, and succinct. Their travel-site example is the warning for this Reel: a button labeled "MORE INFO & BOOK" opened a contact form, and the participant had been promised information and a booking. The label has to match the next screen immediately. "I'd like to explore my options" is sincere on Forged's page only because the next heading is "Explore Your Options" and the page says the first call does not make them pick equipment. The same words on a page whose next screen is "sign the proposal" would be the Combadi problem.

[Michael Aagaard, Unbounce, "Write a Call-to-Action that Converts"](https://unbounce.com/conversion-rate-optimization/how-to-write-a-call-to-action-that-converts-with-case-sudies/), retrieved 20 October 2026, reports his own button tests: one word, "Order" to "Get," a **38.26%** lift on an office-rental site; a more relevant gym-membership label, a **68%** lift. His rule is value plus relevance, and he tells the reader to test. Those lifts are his case studies. They are not a law that a softer label doubles anything. His two questions are the same questions her coach asked: why is this person clicking, and what do they receive when they do.

[CXL, "22 Marketing Call to Action Examples"](https://cxl.com/blog/call-to-action-examples/), retrieved 20 October 2026, says clarity usually beats cleverness, and that a CTA test should start from a real point of friction. The page cites Contentsquare's 2026 benchmark for a related split: returning visitors converted at **2.9%** and new visitors at **1.7%**. Cold traffic, which is what she says she runs, is the harder of those two. Changing "Get Started" to "Start Now" does not fix a page where the offer is unclear. Her useful detail is the one CXL asks for: she had already located the fall-off (ad click, then no form), and she held the ads still.

**An objective "2x" needs a basis before it is said to a customer.** The FTC's [Policy Statement Regarding Advertising Substantiation](https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation) (23 November 1984, page retrieved 20 October 2026) says an advertiser needs a reasonable basis for objective claims before they are disseminated, and that "tests prove" means the advertiser has at least that level of proof. The practice playbook already applies that to this firm: a Reel's result is not Peacemakers' result, and "this will double your leads" is the kind of claim the playbook says to keep out of proposals. Say what was observed on the client's own page, label the assumption, and let them read the two rates.

### Where it meets Peacemakers

| Use | Fit |
| --- | --- |
| Client system | A test, and only when the client's own numbers show clicks on the ad and a dead form. Hold the ads. Change the button that reveals the form. Write the label from the next screen: a range, a checklist, a design conversation, a scorecard. Read ad-click-to-submit and submit-to-kept-appointment. It is not a product to install, and it is not an agent. |
| Assessment demo | No. The demo has to show a redacted document becoming a draft a person approves. A button label does not. The interview question is enough: where do people stop, on the ad, on the button, or on the form? |
| Offer and pricing | No change. $3,500 and the three monthly tiers are untouched. Forged's paid design step is their product. It is not a reason to rename or reprice the Blueprint. |
| Outreach | No. The Reel does not name a list, a script, or a follow-up. |
| His own marketing | The public site already runs two doors: "Book a 15-Minute Intro" and "Take the Free Scorecard," and the Blueprint page says "Get My AI Opportunity Blueprint." If a cold ad ever lands on a page whose only button is the intro call, the test from this Reel is a second label that names the scorecard or the blueprint, with the ads held still. The scorecard is already the smaller ask. There is no measurement on peacemakersai.com in this note, so there is nothing to change today. |
| Internal stack | No new tool. The habit worth keeping is the one on her phone: she had already tried several call-named buttons, they tied, and the fall-off was after the ad click. Find that fall-off in the ad account and the form tool before rewriting copy. |

### Effort, cost, risk, compliance

**Effort.** None as a build. On a client page that already has cold traffic, the work is two labels, the same form, and a read of the two rates after enough clicks to matter. That is a line in a Blueprint, or a small change during a later implementation the client has already approved. It is not an AI-department deliverable.

**Cost.** No license. The sample is the client's existing ad spend. A quiet week can imitate a doubling. Wait for a volume the client already trusts before anyone calls a winner.

**Risk.** More submits and fewer jobs. A label that hides a sales call. A proposal that repeats her "2x." Publishing the winner the same day it is typed, which is what the Reel describes, and then treating that day as proof.

**Compliance.** Follow the practice playbook.

- Marketing, proposals, and assessment decks use the client's observed counts and a labeled assumption. They do not use this Reel's "doubled overnight" as Peacemakers' result or as the client's forecast.
- The button and the next screen have to describe the same step. A label that says "explore" and a screen that asks for a signature is a deceptive door under the same Section 5 standard the playbook cites, and it fails Nielsen Norman's "sincere" test.
- The form in the Reel collects name, email, phone, zip, and budget. That is customer data. A copy test does not require pasting the export into a public chatbot. If someone later wants a model to draft button labels, draft them from the page and the fall-off counts, and have a person publish the winner.
- She left the ads alone. Leave claims in the ads alone too. Do not add "double your leads" to an ad because the button changed.
- Nothing in this note is approved to build, schedule, or post.

## Status

Analysis only. Logged 20 October 2026. Waiting on James before anyone changes a page, a test, or a deck.
