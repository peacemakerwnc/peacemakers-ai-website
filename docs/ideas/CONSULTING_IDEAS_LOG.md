# Consulting ideas log

Analysis only. An entry here is not approval to build, buy, schedule, or post. James decides.

`docs/ai-practice/` is not in this repository. Risk and compliance notes below follow the boundaries that are: evidence before claims (`.cursor/rules/10-evidence-and-source-of-truth.mdc`), the AI appropriateness gate (`owner-ops/docs/peacemakers-operating-system/AI_GOVERNANCE_STANDARD.md`), the consulting standard’s ban on fabricated outcomes, and the implementation SOW’s exclusion of legal advice and compliance guarantees (`owner-ops/docs/deliverables/implementation-sow-template.md`, section 7).

## 2026-10-27 — Pre-launch website checklist, not a “won’t get sued” prompt

**Classification:** (B) Peacemakers AI consulting.

**Source:** [Instagram Reel Dc7PlCYMzpW](https://www.instagram.com/reel/Dc7PlCYMzpW/) by Alex Yates ([@yatesvids](https://www.instagram.com/yatesvids)). Posted September 5, 2026 (Open Graph date; yt-dlp `upload_date` 2026-09-06). About 32 seconds. At fetch: 46,429 likes, 257 comments. James Fullen dropped the bare URL in `#peacemaker-ideas` on 2026-10-27 19:22 EDT with no note ([Slack](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1793143320519109)).

**Caption:** “Hey Claude I don’t want my vibecoded website to get sued… #vibecoding #vibecode”

**Status:** Pending James. Do not run this prompt against a client site, and do not ship policy pages from it.

### What it actually shows

A talking-head plus a phone screen. The screen is a checklist with green checkmarks appearing as he speaks. It is not a visible Claude transcript, a tool demo, or a before/after of a real site.

Spoken checklist (faster-whisper `small`, word timestamps, cross-checked against frames). On-screen text says “only collect necessary data”; the first transcription pass heard “connect.”

> Hey Claude, I do not want my vibe coded website to get sued, so please add a privacy policy page, a terms and conditions page, and add a cookie policy. Check if I need cookie consent and add a refund policy and add form consent. Only collect necessary data, check analytics tracking, check third party embeds, make the site accessible, add alt text, check color contrasts, and make forms keyboard friendly. Use clear button labels, remove fake reviews, remove unsupported claims, add business details, and check copyright on images. Check applicable local laws and flag any other risks and make no mistakes.

The method is a single prompt that asks a chat model to draft legal pages and “make no mistakes.” The useful part is the checklist. The promise in the hook is not real.

### Claim check

The reel states no statute, case, or test result. Checked against primary sources:

| Reel item | What holds up | What does not |
| --- | --- | --- |
| “I don’t want to get sued” / “make no mistakes” | Naming the topics is a reasonable pre-launch review. | No page set, banner, or model instruction stops a lawsuit. “Make no mistakes” is not a control. |
| Privacy policy and “only collect necessary data” | A covered business under the CCPA must give notice at or before collection and keep collection reasonably necessary and proportionate to the disclosed purpose ([Cal. Civ. Code § 1798.100](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.100)). The CPPA says covered businesses also post a privacy policy describing categories, purposes, selling/sharing, and consumer rights ([CPPA, “What General Notices Are Required By The CCPA?”](https://www.cppa.ca.gov/pdf/general_notices.pdf)). | There is no federal rule that every US small-business site must publish a privacy policy. CCPA “business” thresholds are not met by every $5–50M firm. An AI policy that describes practices the site does not follow is its own problem. |
| Cookie policy and “check if I need cookie consent” | The hedge is the correct move. EU/UK ePrivacy requires consent before non-essential cookies or similar storage, with a narrow exception for what is strictly necessary (Directive 2002/58/EC Article 5(3), as amended by Directive 2009/136/EC). | A US-only contractor site is not automatically in that regime. A banner that loads analytics first is not consent. A commenter suggesting CookieYes is a vendor pitch, not a legal conclusion. |
| Terms, refund policy, form consent | Worth a human decision: what the business actually promises, and what a lead form will be used for. | A generic terms or refund page can create promises the contractor does not honor. A checkbox is not Telephone Consumer Protection Act prior express written consent for marketing texts or autodialed calls ([47 U.S.C. § 227](https://www.law.cornell.edu/uscode/text/47/227)). CAN-SPAM is an identification and opt-out rule for commercial email, not a “consent box fixes it” rule. |
| Accessibility, alt text, contrast, keyboard, button labels | DOJ’s March 18, 2022 guidance says the ADA applies to the goods and services of businesses open to the public, including those offered through a website ([ADA.gov web guidance](https://www.ada.gov/resources/web-guidance/)). Those four items are real WCAG-style checks. | The 2024 DOJ rule that names WCAG 2.1 Level AA applies to state and local governments (Title II), not to private businesses ([ADA.gov Title II fact sheet](https://www.ada.gov/resources/2024-03-08-web-rule/)). Asking a model to “make the site accessible” is not a test. |
| Fake reviews | The FTC’s Consumer Reviews and Testimonials Rule prohibits a business from writing, buying, or knowingly disseminating reviews or testimonials that misrepresent that the reviewer exists or had the experience, including AI-written fakes. Effective October 21, 2024 ([FTC press release](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials); [16 CFR § 465.2](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465/section-465.2)). | Deleting every unflattering line is a different rule (review suppression) and is not what “remove fake reviews” should mean. |
| Unsupported claims | Advertisers need a reasonable basis for objective claims before they are published. Lacking that basis is a Section 5 problem ([FTC Policy Statement Regarding Advertising Substantiation](https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation)). | This matches the existing ban on ROI and compliance guarantees. It is not a new offer. |
| Copyright on images | Using a photo the business does not have rights to is ordinary infringement risk. The Copyright Office’s March 16, 2023 guidance says that when a generative system, from a prompt alone, decides the expressive elements, that output is not human authorship ([Federal Register](https://www.federalregister.gov/documents/2023/03/16/2023-05321/copyright-registration-guidance-works-containing-material-generated-by-artificial-intelligence)). | “Check copyright” in a chat does not clear a license. Prompt-only images are also a weak thing to treat as owned brand assets. |
| “Check applicable local laws” | North Carolina does require notice after a security breach involving personal information, without unreasonable delay ([G.S. 75-65](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-65.html)). | Senate Bill 757, the proposed North Carolina Consumer Privacy Act, is not law. ncleg.gov still shows its last action as referral to Senate Rules on March 26, 2025 ([S757 history](https://www.ncleg.gov/BillLookUp/2025/S757)). A model told to “flag any other risks” will invent obligations. |

### Where it applies

**Own marketing site, first.** `peacemakers-ai/privacy-policy.html` already exists (last updated July 2026) and already says counsel should review it before anyone relies on it. The same template loads Google Tag Manager (`GTM-M5L8TPDF`), Google Analytics (`G-GTQ5YNER7P`), and Microsoft Clarity in the document head. The privacy page discloses analytics cookies and Tag Manager. `peacemakers-ai/script.js` leaves the Meta pixel unloaded until a consent mechanism exists. No terms page is in the site tree, and the footer links privacy and security only. That is a concrete gap list, not a reason to paste the reel prompt into Claude.

**Client sites he ships.** Home builders, contractors, and home-services sites with lead forms are where fake reviews, unlicensed job photos, “we guarantee…” lines, and inaccessible forms actually show up. Treat the list as a handoff check inside implementation, after the client has said what the business does. It is not a Blueprint product and not a reason to add a tier above the $3,500 Blueprint or the $10k / $15k / $20k months.

**Not an outreach hook.** “We keep your vibe-coded site from getting sued” would contradict the SOW, which excludes legal and compliance advice and any guarantee of compliance.

### Effort, risk, compliance

**Effort.** Reading one existing site against the checklist is a few hours with the browser, Lighthouse or axe, and the current privacy page. No new software. Drafting a terms page or rewriting the privacy page to match the tags that actually load is a writing task plus counsel, not a prompt. Full accessibility repair of a large location-page set is a separate scoped job. AI drafting of legal text fails the appropriateness gate until a person checks it against the live site: status **PROVISIONAL / NOT READY**. Prefer A0: a written checklist a human marks.

**Risk.** The failure mode is false confidence. A polished policy that does not match Tag Manager, Clarity, Formspree, or Calendly is worse than a short accurate one. Auto-adding a refund policy can bind a contractor to a promise they do not offer. Running a client’s form exports or analytics through a consumer chat to “check local laws” puts customer data in the wrong place.

**Compliance.** This entry is not legal advice. Do not tell a client the checklist makes them compliant. The SOW already leaves legal and compliance advice, and any compliance guarantee, out of scope; the client still verifies facts and owns go-live. Counsel reviews any privacy, terms, or refund page before it is published. James approves before any tag, banner, pixel, or policy change on peacemakersai.com or a client site. Do not buy a cookie-banner product from this reel.

**Decision requested.** Use the checklist as an internal pre-launch review for peacemakersai.com and for client sites, with counsel on any new legal page, or leave it as a note only?
