# Consulting ideas log

Peacemakers AI is the consulting practice: a **$3,500 Blueprint** assessment, then a monthly AI department at **$10,000, $15,000, or $20,000**. The work is interviews plus a live draft built from the client's redacted documents, with a person approving anything a customer or a lender would rely on.

This file is for that practice. It is not a note for the homeschool accounts, the children's books, or the printables.

James posted the Reel below in `#peacemaker-ideas` on 19 October 2026, with no other text: [19 Oct 2026, 01:55 EDT](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1792389309968989).

How it was read, on 19 October 2026:

- Video and metadata: `yt-dlp` 2026.08.19. Firecrawl was not used. Instagram served no subtitle track.
- Caption: Instagram's public oEmbed (`/api/v1/oembed/`). The oEmbed `title` is the caption.
- Voice: faster-whisper 1.2.1, `small` model, int8, on a 16 kHz mono WAV. That is a transcript, not an official caption.
- On-screen text: frames read with Tesseract, then checked by eye. Noisy OCR is not quoted as a sentence. The lines below are the ones that were readable.
- The live MapQuest listing, the Yext plan page the "Claim your business" button opens, BrightLocal's citation-builder page, Semrush's public MapQuest overview, and Google's local-ranking help page were fetched the same day.

Counts from the download change. Views were not in the metadata file.

The safety notes below follow `docs/ai-practice/compliance-playbook.md`. That playbook is on the open branch `cursor/ai-practice-compliance-demo-028f`, not on `main` as of this writing. Nothing below is a revenue forecast.

## Classification

**(B) Peacemakers AI consulting.** The Reel is a local-listing tactic from a Hamilton marketing agency: claim a MapQuest business page so the website button is a followed link, and if the page does not appear, pay BrightLocal to submit it. The businesses that would use it are the same local operators the practice already serves (builders, contractors, home services). The lake line is a joke. The rest is a method, and the method does not survive a price check.

## The action

When a Blueprint client's problem is being found by nearby customers, check that the public name, phone, and website already agree on the Google Business Profile and on directories that already list the company. MapQuest is one of those directories when a listing is already there. Correct a wrong phone or a missing website on a listing the owner controls.

Leave the offer where it is. Do not buy the Yext plan this Reel calls free, and do not open a BrightLocal campaign because a 27-second video called MapQuest a backlink.

**Effort.** One lookup inside a Blueprint whose subject is local discovery. No new system, no recording, no outreach sequence.

**Cost.** $0 when an existing listing can be corrected by the owner. The button in the Reel opens a Yext plan whose cheapest line, retrieved 19 October 2026, is **$3 a week, billed at $150 a year**, for a MapQuest-only listing. BrightLocal's published citation price the same day is **$3.20 per site, or $2 in bulk**, plus an optional **$120 a year** if someone renews the data-aggregator bundle. Those are vendor prices. They are not a reason to reprice Peacemakers.

**Risk of doing what the Reel says.** Telling a builder that a MapQuest link will bring the calls, or that MapQuest's own traffic is their traffic. Paying $150 a year for a directory button. Putting the company at an address it does not occupy so the pin exists.

## The Reel

https://www.instagram.com/reel/DctPKngR2n8/

### What was retrieved

| Item | Observed |
| --- | --- |
| Account | `heytony.agency`, display name "Matt Diamante" |
| Posted | 31 August 2026 (yt-dlp `upload_date`) |
| Length | 27.2 seconds |
| Picture | 1440×2560 |
| Likes / comments at download | 834 likes, 20 comments. Views were not in the file |
| Caption | oEmbed: "Go do this right now 😂" |

Spoken transcript (Whisper small), which matches the picture:

> Wait, what? MapQuest still gets over 45 million visitors a month and they have a 92 authority score. Their backlinks are do follow. This means that MapQuest is a great site to get backlinks from and it's free. And they still call it Lake Ontario. Wait, is MapQuest the good guy? All right, here's how to get a link from MapQuest. Go to MapQuest.com and come down here to claim your business. Search for your business and claim your listing. Then make sure that your phone number and website are added to your profile. And if it doesn't show up, go to brightlocal.com/citation-builder and add your profile.

On-screen, in order:

- A caption over his face: **"Wait... people still use mapquest???"**
- A Semrush-style dashboard dated **Aug 31, 2026**, desktop, USD. Readable figures: **Authority Score 92**, "Very good," and **Organic Traffic 45.8M**, with a **+5.6%** change. Keyword and paid-traffic labels are on the card. Their numbers were not clean enough to quote.
- A chat transcript inspecting his own listing. The readable conclusion is that the website anchor is dofollow: the example `href` is `https://heytony.ca`, and the anchor has no `rel`. The chat says MapQuest does put `nofollow` on other links, including feedback and "do not sell," that the page is indexable, and that the heytony.ca URL is not inside the LocalBusiness data. The schema sentence does not match the live page retrieved today. See below.
- A map of southern Ontario. Place names that read clearly include Belleville, Quinte West, and Cobourg. The spoken line over it is "And they still call it Lake Ontario." That is the joke. It is not a step.
- The MapQuest footer, with **Claim your business**.
- A "What kind of business are you?" screen: one-location business, multi-location business, marketing agency, and a line about listings on 50+ online services. That is the Yext scan step the footer link opens.
- His own listing, **Heytony Advertising**, on `mapquest.com/ca/ontario/...`, with Open, Call, and Web.
- `brightlocal.com/citation-builder/`. The readable phrase on that screen is about a recurring fee. BrightLocal's own page uses that phrase to say its comparison column is "Nope, never."

### The method, as he tells it

1. MapQuest still has a large audience (he says over 45 million visitors a month) and a 92 authority score.
2. The website link on a business listing is dofollow, so the listing is a backlink, and claiming it is free.
3. Go to MapQuest, use **Claim your business**, search the company, and put the phone number and website on the profile.
4. If the listing does not appear, submit it at `brightlocal.com/citation-builder`.

### What holds, and what does not

**The website button on his listing is followed.** Retrieved 19 October 2026, [HeyTony Advertising on MapQuest](https://www.mapquest.com/ca/ontario/heytony-advertising-456708946) (185 Emerald St N, Hamilton, Ontario). The website control, with the long `class` left out, is:

```html
<a data-testid="bento-website" aria-label="Visit this location's website" target="_blank" href="https://heytony.ca/">
```

There is no `rel` on that anchor. The page's robots tag is `index, follow`. The canonical URL is the MapQuest page, not heytony.ca. Other anchors on the same page do carry `nofollow`: help, feedback, and the app-store buttons. "Their backlinks are dofollow" is broader than the page. The business-website button on this listing is the part that checks out.

The LocalBusiness JSON-LD on that same page includes `"sameAs":"https://heytony.ca/"`. The chat in the Reel says the URL is not in the LocalBusiness data. Either the page changed after 31 August or the chat missed the field. The page retrieved today has the field. The chat is not the audit.

**Authority Score 92 is a Semrush number for mapquest.com, and it matches a later public Semrush page.** [Semrush's public overview](https://www.semrush.com/website/mapquest.com/overview/), fetched 19 October 2026, says last updated 11 October 2026 and gives September 2026 figures: Authority Score **92**, visits **38.22 million**, organic search traffic **57.89 million**. His 31 August card says Organic Traffic **45.8 million** and Authority Score 92. The score agrees. "Over 45 million visitors" is him reading an organic-traffic estimate as visitors. Semrush's later visits figure is 38.22 million. Both numbers are a vendor's estimate of MapQuest's own site. They are not the traffic of a business listing, and they are not a Google ranking.

**The claim path he points at is a paid Yext plan.** The footer link on the live listing, and the "claim this business" button, both go to `https://listings.mapquest.com/pl/mapquest-claims`. The [plan page](https://listings.mapquest.com/pl/mapquest-claims/plans.html) retrieved the same day lists:

| Plan | Price on that page |
| --- | --- |
| Listing on MapQuest | $3/week, billed at $150 annually |
| Plus | $9/week, billed at $449 annually |
| Complete | $10/week, billed at $499 annually |
| Analytics | $19/week, billed at $999 annually |

"It's free" is the sentence that fails. Two comments on the Reel say the same thing from the other side: one says the flow makes you sign up for Yext, and one says the state field comes up as a US state and then a payment plan. Those are comments, not a completed checkout. The plan page is the checkout.

A separate page, [claim.mapquest.com](https://claim.mapquest.com/), asks for a claim code that arrived by mail or email. That path was not used. This note does not say whether editing a listing someone already owns is free. The button in the video is the paid plan page.

**BrightLocal is the paid fallback, and its own page says the per-site fee.** [Citation Builder](https://www.brightlocal.com/citation-builder/), retrieved 19 October 2026, offers citations from **$2** each in bulk and **$3.20** without, says there is no monthly subscription for that service, and lists an optional data-aggregator renewal of **$120 a year**. A free account can start the order. The submission is the charge. "If it doesn't show up, go to BrightLocal" means pay for a citation, not finish the free step.

**A followed link is one prominence input, and Google tells the owner to do the profile first.** [Tips to improve your local ranking on Google](https://support.google.com/business/answer/7091?hl=en), retrieved 19 October 2026, says local results are mainly based on relevance, distance, and popularity, and that there is no way to request or pay for a better local ranking. The prominence section on that page says prominence is also based on how many websites link to the business and how many reviews it has. A MapQuest website button can be one link in that pile. The same page tells the owner to verify the Business Profile, keep the address, hours, and category complete, answer reviews, and add photos. That is the work. One directory link is not a map-pack result, and no ranking or lead count appears in this Reel.

**A service-area company does not get a borrowed address.** A commenter asks whether this works for a mobile home-service business with no storefront. [Google's representation guidelines](https://support.google.com/business/answer/3038177?hl=en) say the profile uses the real address or the real service area, and that a virtual office is not eligible. A MapQuest pin still wants a location. The listing to create is the one the company actually occupies.

### Where it meets Peacemakers

| Use | Fit |
| --- | --- |
| Client system | A checklist line, and only when the Blueprint subject is local discovery. Match name, phone, and website on the Google Business Profile and on directories that already list the company. MapQuest is in that set when a page is already there. It is not a product to install, and it is not an agent. |
| Assessment demo | No. The demo has to show a redacted document becoming a draft a person approves. A directory claim does not. |
| Offer and pricing | No change. $3,500 and the three monthly tiers are untouched. |
| Outreach | No. The Reel does not name a list, a script, or a follow-up. |
| His own marketing | Peacemakers sells an assessment to operators. It is not a "near me" trade. A $150-a-year MapQuest plan does not become the firm's marketing. |
| Internal stack | The habit on screen at the eight-second mark is worth keeping: have a model read the live HTML, then open the anchor and the schema yourself. The chat in this Reel got the `rel` right and the `sameAs` field wrong, or stale. The second look is the step. |

### Effort, cost, risk, compliance

**Effort.** None for the practice as a build. Inside a relevant Blueprint, the check is a few minutes of comparing the public name, phone, and website. Buying the plan, or running a citation campaign across 50 sites, is a different project, and this Reel does not scope it.

**Cost.** Stated above. Do not describe the Yext plan or the BrightLocal fee as free because the voiceover did.

**Risk and compliance.** The playbook's line is the right one: observed examples and labeled assumptions. The FTC material it cites, [15 U.S.C. § 45](https://www.law.cornell.edu/uscode/text/15/45) and the 27 February 2023 post ["Keep your AI claims in check"](https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check), is why "this link will get you the calls" does not go in a proposal. MapQuest's traffic and Semrush's 92 are MapQuest's, and they are estimates.

Name, phone, and website on a public directory are ordinary business facts. Customer lists, job files, homeowner details, and anything a lender would rely on stay out of MapQuest. A model that drafts the listing still waits for the owner to submit it.

An address the company does not occupy, used so a pin exists, is a false listing. Google's guidelines say so for the Business Profile. The same standard applies to the MapQuest page.

The lake line and the "good guy" line are the joke. They are not a claim about the product.

## What was not done

- No listing was created, claimed, or edited. The Yext checkout was not started. No BrightLocal account was opened.
- Semrush was read as the public overview page, not from a logged-in account. The 31 August dashboard in the video was not re-run.
- HeyTony was not contacted. The Reel's comments were read from the yt-dlp metadata. They were not treated as a test of the checkout.
- No client was contacted. No post was drafted. No tool was installed.

## Transcript

Whisper small, 19 October 2026. A hearing, not a caption.

```
[0:00] Wait, what?
[0:02] MapQuest still gets over 45 million visitors a month
[0:05] and they have a 92 authority score.
[0:07] Their backlinks are do follow.
[0:09] This means that MapQuest is a great site
[0:10] to get backlinks from and it's free.
[0:12] And they still call it Lake Ontario.
[0:14] Wait, is MapQuest the good guy?
[0:15] All right, here's how to get a link from MapQuest.
[0:17] Go to MapQuest.com and come down here
[0:18] to claim your business.
[0:19] Search for your business and claim your listing.
[0:21] Then make sure that your phone number
[0:22] and website are added to your profile.
[0:23] And if it doesn't show up,
[0:24] go to brightlocal.com/citation-builder
[0:26] and add your profile.
```
