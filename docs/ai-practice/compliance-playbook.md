# Safety and compliance playbook

**Peacemakers AI · internal**
**Research date:** 17 October 2026
**Status:** Practice guide for James. Not legal advice. Not a client representation.

A North Carolina attorney who handles privacy, consumer protection, and commercial contracts should review the contract topics in section 8 before they are turned into templates. This guide tells you what to put in front of that lawyer and what to have in place before a client file touches a model. It does not tell you that you are in compliance.

## How to read this

Claims are tagged the way the rest of the operating system tags evidence.

- **VERIFIED** means a primary page linked here said it, and that page was retrieved for this research pass on 17 October 2026.
- **UNVERIFIED** means a secondary write-up, an incomplete read, or a point that should be re-checked before you rely on it.
- Time and dollar figures from a podcast are **not** measurements of a Peacemakers client.

Owner Ops standards still govern Owner Ops software: AI governance, human approval, and agent security under `owner-ops/docs/peacemakers-operating-system/`. This playbook is the companion for client work. Prefer autonomy that shows information, recommends, or drafts for a person. Do not let a model send, bill, hire, or move money.

## 1. What "safe enough to take a client" means here

Peacemakers AI is a small consultancy. The clients in view are roughly $5–50 million in revenue: builders, contractors, home services, specialty trades, distributors, light manufacturers, property managers, engineering and architecture firms, logistics companies, insurance and title agencies, and multi-location franchises. Most of them are in North Carolina. A few of the laws below can still reach them because of a customer, an applicant, or a vendor in another state.

The practical bar, before the legal detail:

1. Do not say an AI system does something you have not shown, on their documents, with a person checking the output.
2. Know what data the workflow touches, and keep the sensitive parts out of the model.
3. Use a vendor account whose terms match that data. A personal chatbot login is not that account.
4. A person approves anything a customer, an employee, a carrier, or a lender would rely on.
5. You can say, after the fact, who approved what, without having stored the whole file in a log.
6. You know whom to call, and what North Carolina requires, if personal information gets out.

## 2. United States, federal

There is no single federal "AI license" for a consultancy serving private SMBs. The duties that matter are the ones that already govern deception, financial data, health data, employment, and consumer reports. Executive orders below bind federal agencies. They are not a private-company code of conduct. They do change what agencies publish, and they are the reason some 2023 guidance disappeared.

### FTC Act Section 5

**VERIFIED.** Section 5 of the FTC Act, [15 U.S.C. § 45](https://www.law.cornell.edu/uscode/text/15/45), prohibits unfair or deceptive acts or practices in or affecting commerce. The FTC's business blog ["Keep your AI claims in check"](https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check) (27 February 2023) puts four questions on the advertiser: are you exaggerating what the product can do, are you claiming it beats a non-AI alternative without proof, do you understand the foreseeable risks, and does the product actually use AI. The same series says a business cannot shrug off a failure by calling the model a black box or blaming the vendor. See also ["The Luring Test"](https://www.ftc.gov/business-guidance/blog/2023/05/luring-test-ai-engineering-consumer-trust) (1 May 2023): people should know when they are dealing with a machine, and paid recommendations should look like ads.

**VERIFIED.** On 25 September 2024 the FTC announced [Operation AI Comply](https://www.ftc.gov/news-events/news/press-releases/2024/09/ftc-announces-crackdown-deceptive-ai-claims-schemes), five matters about AI hype or AI tools used to deceive. The Commission's [AI topic page](https://www.ftc.gov/industry/technology/artificial-intelligence), as retrieved this pass, also lists a 25 August 2025 action against Air AI over claims about business growth, earnings, and refunds sold to small businesses. That pattern matters here. "This will save you X hours" or "this will pay for itself" is an earnings-style claim if you present it as a fact. Say it is an assumption, show the demo, and let the client measure their own week.

**VERIFIED.** The FTC [reopened and set aside](https://www.ftc.gov/news-events/news/press-releases/2025/12/ftc-reopens-sets-aside-rytr-final-order-response-trump-administrations-ai-action-plan) the Rytr consent order on 22 December 2025. The press release says the Commission found the 2024 complaint did not meet Section 5 and that the order burdened AI innovation in light of the AI Action Plan. Setting that order aside is not a license to generate fake reviews. The [Consumer Review Fairness Act, 15 U.S.C. § 45b](https://www.law.cornell.edu/uscode/text/15/45b), and Section 5 still apply to deceptive reviews. Do not build a tool whose job is to post reviews the client did not earn.

What this means on a Tuesday:

- Marketing, proposals, and assessment decks use observed examples and labeled assumptions. They do not use a podcast's "about an hour" or "about five minutes" as Peacemakers' result.
- The demo in `demo/` prints fictional totals and says the times are assumptions.
- If a workflow drafts a customer email, a person sends it, and the client decides whether their customer should be told a draft was machine-assisted. When the customer is chatting with a bot, tell them. The FTC's May 2023 post treats hidden bots as a deception problem, not a courtesy.

### FTC Safeguards Rule (GLBA)

**VERIFIED.** The Safeguards Rule is [16 CFR Part 314](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-314). It applies to financial institutions over which the FTC has jurisdiction under the Gramm-Leach-Bliley Act: the business is financial in nature, or incidental to that, and another GLBA regulator does not already enforce it. The rule's own examples include mortgage lenders, mortgage brokers, finance companies, account servicers, wire transferors, collection agencies, credit counselors, tax preparers, and finders. It is not a rule for a home builder who happens to send an invoice.

**VERIFIED.** A covered firm must keep a written information-security program, name a qualified individual, assess risk, implement safeguards, test or monitor them, train staff, oversee service providers, and keep the program current. Under 16 CFR 314.4(j), as posted in the eCFR text retrieved this pass, discovery of a notification event involving the information of at least 500 consumers requires notice to the FTC as soon as possible and no later than 30 days after discovery, through the form on ftc.gov.

**VERIFIED, with a limit.** The American Land Title Association's [31 October 2023 note](https://www.alta.org/news-and-publications/news/20231031-FTC-Amends-GLBAs-Safeguards-Rule) says title companies and agents that provide title insurance services are outside the FTC rule because state insurance commissioners enforce GLBA for the business of insurance, and that a company that only closes, and is not in the business of insurance, can be inside the FTC rule. That is an association reading of the regulation. It matches the regulation's "not otherwise subject to another regulator" line. Have counsel confirm which side a particular title or settlement company is on before you tell them "the Safeguards Rule does not apply."

Insurance companies are supervised by state insurance regulators for GLBA, not by this FTC rule. See the FTC's [GLBA Privacy Rule guide](https://www.ftc.gov/business-guidance/resources/how-comply-privacy-consumer-financial-information-rule-gramm-leach-bliley-act), which says the states enforce the privacy side for insurance providers. An independent agency is not automatically an "insurer." Classify the license, then decide.

A builder, a mechanical contractor, or a distributor is not a financial institution because they extend trade credit to other businesses in the ordinary way. **UNVERIFIED** as a blanket exemption: "significantly engaged" is a facts test in 16 CFR 314.2. If a client runs a captive finance desk, a mortgage-broker affiliate, or a premium-finance side business, stop and classify that affiliate separately.

If a client is covered, Peacemakers is a service provider. The rule expects the covered firm to require its service providers, by contract, to protect customer information. That belongs in the DPA, not in a chat setting.

### NIST AI Risk Management Framework

**VERIFIED.** NIST AI 100-1, [Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://doi.org/10.6028/NIST.AI.100-1) (January 2023), is voluntary. It is not a regulation and it does not bind a private SMB. The core is four functions: Govern, Map, Measure, Manage. NIST says it expects a formal review no later than 2028. The companion [Generative AI Profile, NIST AI 600-1](https://doi.org/10.6028/NIST.AI.600-1) (26 July 2024), is also voluntary. NIST's publication page says it was written pursuant to Executive Order 14110. That order has since been revoked (below). The profile is still on NIST's site and is still the right checklist for generative-AI risks: confabulation, data leakage, prompt injection, and over-reliance among them.

Use it as the shape of an engagement, not as a certification:

- **Govern:** who owns the workflow, what data classes exist, what the model is forbidden to do.
- **Map:** the real steps, the system of record, the harm if the draft is wrong.
- **Measure:** a fixed set of that client's redacted documents, scored by a person, before go-live.
- **Manage:** a fallback when the model is down (the rate card and the old process), and a person on the output.

Do not tell a client they are "NIST certified." NIST did not certify you.

### Executive orders, as of this research pass

**VERIFIED.** Executive Order 14110 (30 October 2023), "Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence," was revoked. [NIST's page](https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence) says it was rescinded on 20 January 2025. The revocation is in Executive Order 14148, [Initial Rescissions of Harmful Executive Orders and Actions](https://www.federalregister.gov/documents/2025/01/28/2025-01901/initial-rescissions-of-harmful-executive-orders-and-actions), which lists EO 14110. Executive Order 14179, [Removing Barriers to American Leadership in Artificial Intelligence](https://www.federalregister.gov/documents/2025/01/31/2025-02172/removing-barriers-to-american-leadership-in-artificial-intelligence) (23 January 2025), tells agencies to review actions taken under the revoked order.

**VERIFIED.** Those orders, and the memoranda below, are directions to the federal government. They do not create a private right or a filing duty for Peacemakers or for a Wilmington builder.

**VERIFIED.** The White House Office of Science and Technology Policy's [2025 highlights PDF](https://www.whitehouse.gov/wp-content/uploads/2026/01/WHOSTP-2025-Wins.pdf) says the AI Action Plan, "Winning the Race: America's AI Action Plan," was released on 23 July 2025, and that OMB issued [M-25-21](https://www.whitehouse.gov/omb/information-resources/guidance/memoranda/) and M-25-22 on 3 April 2025 for federal use and federal buying of AI. The same OMB index lists M-26-04, "Increasing Public Trust in Artificial Intelligence Through Unbiased AI Principles" (11 December 2025), which the OSTP PDF describes as federal procurement guidance. In March 2026 the White House published [legislative recommendations](https://whitehouse.gov/wp-content/uploads/2026/03/03.20.26-National-Policy-Framework-for-Artificial-Intelligence-Legislative-Recommendations.pdf) for a national AI framework, including a proposal that Congress preempt some state AI laws. A recommendation is not a statute. Colorado, California, Texas, and Utah materials cited in section 4 were still published as current law in the sources retrieved this pass. **UNVERIFIED:** whether any later 2026 statute enacted that preemption. Check Congress.gov before you tell a client a state law "no longer counts."

## 3. North Carolina

### Identity Theft Protection Act and breach notification

**VERIFIED.** Article 2A of Chapter 75 is the Identity Theft Protection Act. [G.S. 75-61](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-61.html) defines a security breach as unauthorized access to and acquisition of unencrypted and unredacted records containing personal information, where illegal use has occurred or is reasonably likely, or the incident creates a material risk of harm. Encrypted records plus the key are also a breach. A good-faith acquisition by an employee or agent for a lawful purpose is not a breach if the information is not used for something else and is not further disclosed.

"Personal information" is a person's first name or initial and last name, plus "identifying information" as defined in [G.S. 14-113.20(b)](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_14/GS_14-113.20.html). That list includes Social Security and employer taxpayer numbers, driver's license, state ID, or passport numbers, checking and savings account numbers, credit and debit card numbers, PINs, email addresses and internet identifiers, digital signatures, other numbers that can access financial resources, biometric data, fingerprints, passwords, and a parent's legal surname prior to marriage. The statute page shows a 2025 amendment (S.L. 2025-25) touching that list. Re-read the live section before an incident. A name and a phone number alone, or a job address alone, is not automatically "personal information" under this definition. It is still customer data. Treat it carefully. Do not treat the statutory definition as the only reason to be careful.

**VERIFIED.** [G.S. 75-65](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-65.html) requires a business that owns or licenses personal information of a North Carolina resident, or a business that conducts business in North Carolina and owns or licenses that information in any form, to notify the affected person after discovery or notice of a breach. The posted timing words are "without unreasonable delay," consistent with law enforcement and with the time needed to find contact information, scope the breach, and restore the system. A business that holds the data for someone else notifies the owner or licensee immediately, subject to the same law-enforcement limit. The statute text retrieved this pass does not state a fixed number of days. Do not invent one.

**VERIFIED as agency guidance.** The North Carolina Department of Justice page [Security Breach Information](https://ncdoj.gov/protecting-consumers/protecting-your-identity/protect-your-business-from-id-theft/security-breach-information/) says notice must be clear and conspicuous, describes mail, email, telephone, and substitute notice, and says businesses also report the breach to the Attorney General's Consumer Protection Division and to the consumer reporting agencies. Use that page as the operational checklist, and have counsel confirm it against the current subsections of G.S. 75-65, because this pass relied on the DOJ's summary for the Attorney General and credit-bureau notices rather than pasting every subsection.

G.S. 75-61 also defines disposal and redaction. Shred paper, wipe drives, and do not sell a laptop with client files still on it. Redaction, in that statute, means rendering data unreadable or truncating an identification number to the last four digits. The demo's `[REDACTED:…]` tokens are an engineering control. They are not a legal opinion that a file has been "redacted" for every statute that uses the word.

**UNVERIFIED as enacted law.** 2025 Senate Bill 711 would have required some third-party vendors to reimburse North Carolina governments for breach-notice costs. The bill text was still a bill in the sources reviewed. It is not treated as law here. Do not promise a public-sector client a statutory indemnity you have not seen in the General Statutes.

### North Carolina and AI, as of this pass

**VERIFIED.** There is no private-sector AI statute in force that this pass found. What is in force is aimed at state government.

- Governor Stein's [Executive Order No. 24](https://governor.nc.gov/executive-order-no-24-advancing-trustworthy-artificial-intelligence-benefits-all-north-carolinians) (2 September 2025) creates an AI Leadership Council, an AI Accelerator inside NCDIT, and agency oversight. The posted order runs until 31 December 2028 unless rescinded. It does not regulate a private builder.
- NCDIT's [Responsible Use of Artificial Intelligence framework](https://it.nc.gov/documents/nc-state-government-responsible-use-artificial-intelligence-framework/open), version 1.1 (21 August 2025), applies to state agencies and points them at the NIST AI RMF. Useful as a local example of an inventory and a risk write-up. Not a duty for a client.
- NCDIT's [Use of Publicly Available Generative Artificial Intelligence](https://it.nc.gov/documents/use-publicly-available-generative-artificial-intelligence/open), version 1.1 (14 April 2026), is a statewide policy for agencies. The pattern in it is still the right private-company habit: no confidential, personal, or proprietary data in a public tool.

**VERIFIED as bill status, not as law.** The General Assembly's [2025–2026 keyword index for "artificial intelligence"](https://www.ncleg.gov/Legislation/Bills/ByKeyword/2025/4091/) listed, among others, HB 301, HB 934, HB 1161 ("Omnibus Artificial Intelligence Protections"), HR 1177, SB 963, and SB 988. The statuses shown were referral or conference, not ratification. [HB 1161](https://lrs.sog.unc.edu/bill/omnibus-artificial-intelligence-protections) was filed 30 April 2026 and, on that summary, would touch elections, education, employment, courts, and insurance. Do not build a compliance program around a bill that is still in committee. Do check this index again before telling a client "North Carolina has no AI statute," because that sentence was true of enacted law in this pass and can stop being true.

## 4. Other state AI laws, and a $10–50 million North Carolina firm

A firm can sit in Leland and still be covered somewhere else if the statute is about the consumer, the applicant, or the decision, not about the headquarters. The reverse is also true. Do not buy a fifty-state program for a contractor whose customers, applicants, and jobs are in southeastern North Carolina.

| Law | What it actually regulates | When it can touch an NC firm | When it usually does not |
| --- | --- | --- | --- |
| Colorado SB 26-189 | Automated decision-making technology used in a consequential decision | The firm makes a covered decision (employment, housing, lending, insurance, health care, education, essential government services) about a person the statute protects | Turning an inspection note into a maintenance price. That is not one of those decisions |
| California CCPA, and the ADMT rules | Personal information of California residents, for a business that meets a threshold | The firm does business in California, collects Californians' personal information, and clears a revenue, volume, or "sale" threshold. ADMT duties, if they apply, start 1 January 2027 | No California customers and no California-directed activity. A $10–25 million firm is under the revenue figure posted for 2025, unless another threshold is met |
| Utah Code Title 13, Chapter 77 | Disclosure when generative AI interacts with someone in a consumer transaction, plus a stricter rule for regulated occupations | The firm is a supplier in a Utah consumer transaction, or a Utah licensee using a high-risk generative interaction | An NC job with no Utah consumer. A PDF a person emails is not a chat with a model |
| Texas TRAIGA (HB 149) | Prohibited uses, plus some disclosure duties, for persons tied to Texas | The firm conducts business in Texas, produces something Texas residents use, or deploys the system in Texas | No Texas business and no Texas deployment |

### Colorado

**VERIFIED.** Senate Bill 24-205 was the 2024 Colorado AI Act. [SB 26-189](https://www.leg.colorado.gov/bills/sb26-189), signed 14 May 2026, repeals and reenacts that article. The General Assembly's summary says "automated decision-making technology" processes personal data and produces an output used to make, guide, or assist a decision, and a "consequential decision" relates to education, employment, housing, financial or lending services, insurance, health-care services, or essential government services and public benefits. Developer duties for covered ADMT, and the act's application to consequential decisions, are described as starting 1 January 2027. The Colorado Attorney General's [ADMT page](https://coag.gov/ai/) says the same effective date and says draft rules were filed 11 August 2026. **UNVERIFIED:** the final rule text, and the exact territorial sentence that decides whether an NC company with no Colorado customers is a "deployer." Read the enrolled act before you rely on "we are in North Carolina." A hiring tool, a tenant-screening tool, or an insurance recommendation can be in scope even when a proposal tool is not.

### California CCPA and ADMT

**VERIFIED.** A "business" under [Civil Code § 1798.140](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.140.) is a for-profit that collects California residents' personal information, determines the purposes and means, does business in California, and meets one of three thresholds: annual gross revenue above $25 million as adjusted, buying/selling/sharing personal information of 100,000 or more consumers or households, or deriving 50 percent or more of annual revenue from selling or sharing personal information. The CPPA's [monetary-threshold page](https://privacy.ca.gov/laws-and-regulations/monetary-thresholds-in-the-ccpa/) (posted 17 December 2024, effective 1 January 2025) sets that revenue figure at $26,625,000. The statute adjusts thresholds in odd-numbered years. This pass did not find a later posted figure. Re-check that page before you advise a client near the line.

"Does business in California" is not defined as a street address. A purely local NC firm with no California customers is the easy case. A firm that sells into California, or runs a site aimed at Californians, is not. Revenue alone is not enough: the firm must also do business in the state and collect personal information.

**VERIFIED.** The CPPA announced on [23 September 2025](https://cppa.ca.gov/announcements/2025/20250923.html) that the Office of Administrative Law approved regulations on cybersecurity audits, risk assessments, automated decisionmaking technology, and insurance. The regulations go into effect 1 January 2026, and businesses that use ADMT to make significant decisions must comply with the ADMT requirements beginning 1 January 2027. The regulation text is on the [CPPA PDF](https://cppa.ca.gov/regulations/pdf/ccpa_updates_cyber_risk_admt_appr_text.pdf). A rate-card proposal that a person approves is a poor fit for "significant decision." Screening applicants, tenants, or credit is a better fit. If a property manager wants AI to accept or reject an application, stop and read section 7200 of those regulations before you build it.

### Utah

**VERIFIED.** The consumer disclosure duties are in [Utah Code Title 13, Chapter 77](https://le.utah.gov/xcode/Title13/Chapter77/C13-77_2025050820250508.pdf), amended in the 2026 general session. Section 13-77-103 requires a supplier that uses generative AI to interact with an individual in a consumer transaction to say so if the individual clearly asks whether AI is in the conversation. A person in a regulated occupation must disclose up front when a high-risk generative interaction is part of the regulated service. Section 13-77-102 says "the AI said it" is not a defense to a consumer-protection violation. The 2025 enrolled [S.B. 226](https://le.utah.gov/Session/2025/bills/enrolled/SB0226.pdf) moved the Office of Artificial Intelligence Policy's repeal date and left the disclosure duties in their own chapter. **UNVERIFIED in this pass:** the live status of every 2026 amending bill beyond the chapter text posted on le.utah.gov. Use the current code, not the 2024 headline "Utah requires disclosure of every chatbot."

### Texas TRAIGA

**VERIFIED.** House Bill 149, the Texas Responsible Artificial Intelligence Governance Act, was enrolled in the 89th Legislature and takes effect 1 January 2026. The [enrolled text](https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00149F.htm) and the [Texas Attorney General's consumer page](https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint/consumer-ai-rights) both say that. Section 551.002 applies the subtitle to a person who promotes, advertises, or conducts business in Texas, produces a product or service used by Texas residents, or develops or deploys an AI system in Texas.

The prohibitions that can reach a private company, as written in that enrolled text, include developing or deploying a system that intentionally aims to incite self-harm, harm, or crime (552.052); developing or deploying a system with the sole intent to infringe constitutional rights (552.055); and developing or deploying a system with the intent to unlawfully discriminate, with an express statement that disparate impact alone is not enough to show intent (552.056). Insurance entities are pointed back to insurance law. A governmental entity has separate bans on social scoring and on some biometric identification.

Section 552.051(b) requires a governmental agency that makes an AI system available to consumers to disclose that fact. Subsection (c) then says a person must make "the disclosure under Subsection (b)." Subsection (f) adds a disclosure duty for health-care services. **UNVERIFIED as a private-company chatbot mandate:** this pass does not treat 552.051(b) as a general duty on every private deployer, because the subsection names a governmental agency and the cross-reference is awkward. The Attorney General's page says the law governs entities deploying AI in Texas and sets requirements and prohibitions. Before a client with Texas customers launches a public bot, have counsel read the codified Business & Commerce Code, not only this paragraph.

## 5. The EU AI Act, only as far as it matters

**VERIFIED.** Regulation (EU) 2024/1689 is the EU Artificial Intelligence Act. The Commission's [policy page](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai), retrieved this pass, gives the timeline after the AI Omnibus (political agreement 7 May 2026, in force 27 July 2026, according to that page): prohibited practices and AI-literacy duties from 2 February 2025; governance and general-purpose model duties from 2 August 2025; transparency rules and the start of enforcement from 2 August 2026; Annex III high-risk rules from 2 December 2027; Annex I product high-risk rules from 2 August 2028. EUR-Lex's [summary](https://eur-lex.europa.eu/EN/legal-content/summary/rules-for-trustworthy-artificial-intelligence-in-the-eu.html), updated 7 September 2026 on that page, matches those high-risk dates and notes amending Regulation (EU) 2026/1744.

The Act can apply to a provider or deployer established outside the Union when the output of the system is used in the Union. A Peacemakers client whose people, customers, and job sites are in North Carolina is outside that sentence. It starts to matter if a franchise has EU locations, a manufacturer places a product on the EU market, or a chatbot answers EU users. General-purpose model duties fall on the model provider (OpenAI, Anthropic, Google, Microsoft), not on an SMB calling an API, unless the SMB becomes a provider by putting its own model on the market or substantially changing one. Do not advertise "EU AI Act compliant" for a Wilmington workflow.

If a real EU use appears, the extra items are a lawyer's: role (provider vs. deployer), whether the use is prohibited or high-risk, transparency if a person is talking to a bot, and the GDPR 72-hour breach notice if the client is a controller of EU personal data. None of that is the default engagement.

## 6. Industry overlays

Apply these only when the client's actual work triggers them. The use-case file marks data sensitivity so you can see which workflows even get close.

### HIPAA

**VERIFIED.** HIPAA's privacy, security, and breach rules apply to covered entities and their business associates. Covered entities are health plans, health care clearinghouses, and health care providers who transmit health information electronically in a standard transaction. See [45 CFR 160.103](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160/subpart-A/section-160.103). A builder, a mechanical contractor, a distributor, and a title company are not covered entities because they have employees. An employer's personnel file and an OSHA log are not PHI in the hands of the employer.

If a client is a medical practice, a group health plan doing more than holding an insured policy, or a vendor that receives PHI to perform a function for a covered entity, then a business associate agreement is required before PHI moves. See 45 CFR 164.502(e) and 164.504(e). OpenAI's [business data page](https://openai.com/business-data/) says a BAA is offered to eligible customers. Anthropic's [API retention page](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) describes a separate HIPAA-readiness arrangement. Microsoft covers Azure OpenAI under the [Microsoft Products and Services Data Protection Addendum](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy), with the product terms saying what is in scope. Eligibility is per product. Do not send PHI until the signed BAA lists the exact service, and do not send it to a consumer login at all.

Peacemakers' current client list does not center on covered entities. The website has a medical-practices page. Treat that as a different engagement with a BAA, a minimum-necessary review, and no PHI in the assessment demo.

### PCI

Cardholder data does not belong in a prompt. PCI DSS is a contractual standard from the card brands, enforced through the merchant's acquirer, not a North Carolina statute. The PCI Security Standards Council's [document library](https://www.pcisecuritystandards.org/document_library/) is the source of the current version. This pass did not re-download the standard to confirm there is no version newer than PCI DSS v4.0.1. **UNVERIFIED:** the version number a given client must certify against in October 2026. Before any engagement that could see a card number, confirm the version and the client's SAQ type with the person who already files it.

Practical rule regardless of version: do not type, photograph, or upload a full PAN, expiration date, or security code into a model or into this demo. Quote workflows should use an invoice total and a payment status from the accounting system, not the card.

### OSHA and safety records

This pass did not find an OSHA rule whose subject is AI tools. **UNVERIFIED** that none exists in a letter of interpretation this search missed. What does exist is the record itself. Injury and illness records under [29 CFR 1904.33](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1904/subpart-D/section-1904.33) are retained for five years. Employee exposure and medical records under [29 CFR 1910.1020](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-Z/section-1910.1020) have a much longer retention. Those logs have names and health details. They are a bad thing to paste into a chatbot even though HIPAA usually does not apply to the employer copy. If a client wants a safety summary, aggregate it first (counts, sites, categories) and leave the names out. The ADA's confidentiality rule for medical information, 42 U.S.C. § 12112(d), is the other reason employee medical notes stay out of prompts.

### Employment and hiring

**VERIFIED as statutes that did not disappear.** Title VII (42 U.S.C. § 2000e-2), the ADA (42 U.S.C. § 12112), and the ADEA (29 U.S.C. § 623) still apply to covered employers. A model that ranks résumés is a selection procedure. The employer owns the outcome. "The vendor's tool did it" is not a defense.

**UNVERIFIED as an official rescission document.** Secondary sources report that in January 2025 the EEOC removed its 2023 technical assistance on AI and adverse impact, and its earlier ADA technical assistance, from eeoc.gov. This pass did not find those documents live on the EEOC site and did not find a single EEOC order page to quote. Do not cite the withdrawn pamphlet as current guidance. Do not treat its absence as permission to ignore disparate impact or disability accommodation. If the client wants AI in hiring, the safe build is: the model does not score people, or, if they insist, counsel reviews it before it touches an applicant. That is a monthly engagement, not an assessment demo.

**VERIFIED.** New York City's Local Law 144 is in [Administrative Code § 20-871](https://codelibrary.amlegal.com/codes/newyorkcity/latest/NYCadmin/0-0-0-135598) and the rules in Subchapter 25. In the city, an employer or employment agency may not use an automated employment decision tool to screen a candidate or employee unless the tool had a bias audit within the past year and a summary is posted, and candidates or employees who live in the city get notice at least 10 business days before use. The DCWP [FAQ](https://www.nyc.gov/assets/dca/downloads/pdf/about/DCWP-AEDT-FAQ.pdf) says the same. An NC contractor hiring for jobs in North Carolina, with no NYC candidates being screened by the tool, is outside that section. The moment they use an AEDT on a New York City resident for a city job, they are inside it. Other states and cities have their own hiring-tool rules. This pass did not survey them. Ask where the jobs are before you automate screening.

### Insurance

**VERIFIED.** The NAIC adopted its [Model Bulletin on the Use of Artificial Intelligence Systems by Insurers](https://content.naic.org/sites/default/files/inline-files/2023-12-4%20Model%20Bulletin_Adopted_0.pdf) on 4 December 2023. It is a bulletin, not a model law. It tells insurers that decisions affecting consumers that are made or supported by AI still have to comply with unfair-trade-practice and unfair-discrimination laws, and it expects a written AIS program proportionate to the risk.

**VERIFIED.** North Carolina adopted that approach in [Bulletin 24-B-19](https://www.ncdoi.gov/24-b-19-use-artificial-intelligence-systems-insurance/open) (18 December 2024), from Commissioner Mike Causey, addressed to insurers licensed to do business in North Carolina. The NAIC's [adoption map](https://content.naic.org/sites/default/files/legal-adoption-map-ai-model-bulletin.pdf) lists North Carolina the same way. The bulletin binds the insurer's expectations. It is not addressed to every independent agency. If Peacemakers builds something that quotes, binds, or declines coverage, the carrier's AIS program and the agency's own licenses control. A tool that summarizes a submission for a human underwriter is a different, and lower, risk than a tool that recommends a price. Do not build the second one inside an assessment.

### Title and real estate

Title files combine identity, wiring instructions, and money. The failure mode that already hurts title companies is a changed wire instruction, not a slow commitment summary. Practical rules, beyond the GLBA question in section 2:

- Wire instructions never go into a model, and a model never drafts a change to them. A second person and the title company's existing callback procedure stay in charge.
- A commitment-exception summary can be a draft for a processor. A person compares it to the commitment before anyone relies on it.
- ALTA's Best Practices are an association standard, not a statute. ALTA's Safeguards Rule note is linked in section 2. If the client is an ALTA member, ask which pillars their auditor already tests, and do not design a workflow that fights that file.
- Closing documents are a poor place for a first demo. Use a fictional commitment, the way the assessment demo uses fictional inspections.

Property managers sit next to this. A lease abstract for a human is moderate sensitivity. Screening a tenant with a score can be a consumer report under the Fair Credit Reporting Act, 15 U.S.C. § 1681, and can be a Colorado or California consequential decision. **UNVERIFIED** for any specific screening vendor. Do not automate accept/deny in a quick win.

## 7. Vendors and data handling

### Which account

Client files go through an API or a business tenant with a contract. They do not go through a personal ChatGPT, Claude, or Gemini login. The no-training statements below are about the business and API products named on those pages. Consumer accounts have different settings. Confirm the live toggle before anyone on a client's staff pastes a file anywhere.

Prefer the client's own tenant when they will own the workflow after you leave. That matches the client-owned-license posture already on the public [security page](https://www.peacemakersai.com/security).

### What the vendors say, as of this pass

These terms change. Open the link on the day you sign, and keep a PDF of the page you relied on in the engagement file.

| Vendor | What their page said | What it does not mean |
| --- | --- | --- |
| OpenAI API | [Data controls](https://developers.openai.com/api/docs/guides/your-data): since 1 March 2023, API data is not used to train models unless the customer opts in. Abuse-monitoring logs are kept up to 30 days by default. Zero Data Retention and Modified Abuse Monitoring exist for eligible customers and require OpenAI's approval. Not every endpoint is eligible. | "No training" is not "no retention." A default API key still leaves abuse logs for about 30 days |
| OpenAI business plans | [Business data](https://openai.com/business-data/): Enterprise, Business, Edu, and the API are not used for training by default. The page lists ISO/IEC 27001, 27017, 27018, and 27701, offers a BAA to eligible customers, and describes regional storage and, for eligible customers, in-region processing | A marketing certification is not the report. Ask for the current SOC 2 Type II or ISO report under NDA. This pass did not read a SOC report |
| Anthropic API | [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention): retained data is not used for training without permission. Zero data retention is available by asking sales, per organization. Some models and safety processes are outside that arrangement. On Bedrock or Google Cloud, the cloud provider is the processor | ZDR is not the default. You have to turn it on, and you have to read the exceptions |
| Google | [Gemini Enterprise Agent Platform zero data retention](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/zero-data-retention): Google says it will not train on customer data without permission. ZDR still requires the customer to leave request logging off, set `store=false` where the default is `true`, and avoid features that cache content. Grounding with Search or Maps is called out as something you cannot simply disable | The consumer Gemini app is a different product. Do not assume this page covers it |
| Microsoft Azure OpenAI | [Data, privacy, and security](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy): prompts and generations are not used to train the base models. Abuse monitoring stores prompts and completions for up to 30 days unless the customer is approved to turn abuse monitoring off. Fine-tuning data stays in the customer's tenant and region | 30-day abuse storage is still storage. Modified abuse monitoring is an approval, not a checkbox you should assume is on |

### DPA, SOC 2, residency

Sign a data-processing addendum when the vendor processes personal information for the client. For Microsoft, the Products and Services DPA is the document their Azure OpenAI page points at. For the others, use the vendor's current customer DPA and make sure the engagement's data categories are in it.

SOC 2 Type II is an audit report over a period, not a badge. Ask for it, read the exceptions, and note the period. Do not tell a client "they are SOC 2" from a homepage.

Data residency is a setting, not a law you can satisfy by hoping. OpenAI's business page describes optional at-rest regions and, for eligible customers, U.S. or Europe processing. Azure OpenAI stores fine-tunes in the resource's region. If a client has no residency clause in their own contracts, U.S. processing on a business API is the ordinary choice. If a client has promised a customer that data stays in a named region, match the setting or don't take that workflow.

### Controls that are yours, not the vendor's

The model will not enforce these. The demo implements the first four so a prospect can see them.

1. **Classify first.** Low (internal process, no personal data), moderate (customer contact, job address, prices), high (SSN, bank, card, medical, wire instructions, loss runs, account credentials). High does not go in a prompt. Moderate goes in only after the contact block is split out, unless the task truly needs it, and then a person still approves the output.
2. **Redact before the call.** Strip the local contact block. Then mask emails, phone numbers, SSNs, and labeled account numbers. Run the mask in your code, not as a sentence in the prompt that says "please ignore the Social Security number."
3. **Least privilege.** A key that can only call the model, capped in spend, stored in a password manager or a host secret, not in the repository and not in a chat. The client's tenant when they will operate it. Your tenant only for the assessment, with sample or redacted files.
4. **No retention you do not mean.** The assessment demo keeps state in the browser and writes nothing to disk. Production jobs need an explicit retention number in the SOW (for example, delete working copies at delivery, keep the approval record for the life of the contract). Logs store the event: who, which workflow version, which model, whether a person approved, the outcome. They do not store the document body, the prompt, or the key.
5. **Encryption.** TLS to the vendor, disk encryption on any laptop that holds a file overnight, and encrypted email or the client's existing file share for transfer. Do not invent a custom crypto scheme.
6. **Secrets.** If a key leaks, rotate it the same day and treat the prompts sent with it as exposed. Do not commit `.env`.
7. **Human approval.** Anything customer-facing, financial, or hard to undo waits for a named person. The demo's PDF button stays off until that box is checked.
8. **Accuracy check before go-live.** A fixed packet of that client's own redacted documents, scored by the person who does the job today. Track disagreements. Do not launch because one demo looked close. The podcast transcript's "$3,375 versus $3,575" is a story from an unverified local transcript of someone else's client. It is not your test result.
9. **Prompt injection.** Field notes and PDFs are untrusted input. The model extracts. Your code prices. The model does not get a tool that can email, pay, or write to NetSuite.
10. **Incident response.** One page, written before the first paid file arrives: who decides, how you preserve logs without copying the data again, when counsel is called, when the client is called, and the North Carolina notice path in section 3 if personal information was acquired. Practice it once on a fictional file.

## 8. Contracts and insurance

These are topics for the North Carolina attorney to draft. They are not clauses to paste.

**MSA.** Who the client is, who Peacemakers is, that the client owns its data and its systems, that Peacemakers is an independent contractor, and that either side can end the relationship and get their materials back. A statement that the client is responsible for the truth of its records and for the decisions it makes from a draft.

**SOW.** The workflow, the data classes, the system of record, what "done" looks like, the human approval step, what Peacemakers will not do (send to customers, move money, change wire instructions, make hiring decisions), the retention and deletion date, and the acceptance test (a named packet of documents, a named reviewer). Price the assessment and the retainer as commercial terms you and the client agree, not as a claim about their savings.

**DPA.** Roles (client as controller, Peacemakers as processor, vendor as subprocessor), the categories of data, the purpose, the subprocessor list (the model vendor, by name), a ban on using the data to train a model, deletion at the end, breach notice to the client on a short clock so they can meet G.S. 75-65, and a duty to help with that notice. If HIPAA applies, the BAA is a separate document, not a sentence inside the MSA.

**IP.** The client owns its documents, its prices, and its prompts-as-business-rules. Peacemakers owns its pre-existing methods and generic code, and licenses the client what it needs to run the workflow. Do not give away the rate-card engine, and do not take ownership of a client's selections library. Model outputs are not something you should promise are free of third-party claims. Say the client may use the drafts in its business, and that you have not performed a copyright clearance on model output.

**Liability cap.** A cap tied to fees paid, with the usual carve-outs counsel will insist on (willful misconduct, and possibly confidentiality). Do not accept unlimited liability for a model's error. Do not ask the client to waive liability for your own failure to follow the SOW's security steps. The cap is a business term. The attorney writes it.

**AI disclosure.** The client decides what its customers are told. The contract should say Peacemakers will not represent the draft as a licensed professional's work (engineering stamp, legal advice, insurance bind, title opinion). If a bot talks to the client's customers, the bot identifies itself.

**Acceptable use for the client's staff.** A one-page policy the client adopts: which tool, which data classes are forbidden, no personal logins for company files, no uploading of wire instructions or card numbers, a person reviews external output, and how to report a mistake or a leak. The state government's public-GenAI policy in section 3 is a useful shape. It is not their policy.

**Insurance.** This pass did not find a North Carolina statute that requires an AI consultancy to carry errors-and-omissions or cyber insurance. Carry both anyway, because the MSA will be asked for certificates and because the work can cause a client loss or a data incident. Ask the broker whether the E&O form excludes professional services involving artificial intelligence, and whether the cyber form covers a vendor incident and regulatory notice costs. Get the answer in writing before you represent to a client that you are covered. **UNVERIFIED:** any specific carrier's form language, because none was reviewed.

**The line to put on drafts of templates:** "Draft for review by North Carolina counsel. Not legal advice. Not for signature."

## 9. Checklist before Peacemakers takes client work

Firm setup, once, then reviewed when a vendor or a law changes.

- [ ] North Carolina counsel has reviewed the MSA, SOW, and DPA topics in section 8, and the signature copies are the ones counsel returned.
- [ ] E&O and cyber policies are in force, and the broker has answered the AI-exclusion question in writing.
- [ ] A password manager is in use. No client file and no API key lives in a personal chatbot, a shared inbox, or this git repository.
- [ ] The model account you will use for assessments is a business or API account, no-training is confirmed on that account's current page, and zero-retention is either on or you have written down why the 30-day abuse log is acceptable for redacted samples only.
- [ ] You have a one-page incident note: who calls the client, who calls counsel, where the DOJ breach page is, and a reminder that G.S. 75-65 does not give you a fixed day-count.
- [ ] The public site and any deck do not state a savings number, an accuracy rate, or a "better than your employee" claim you cannot show from that client's own test.
- [ ] The assessment demo you show is the fictional one, or a new one built from documents the prospect redacted and gave you in writing.
- [ ] You can explain, in a sentence, which of NIST's four functions you are covering and which you are not. You are not claiming a certification.
- [ ] Owner Ops rules for human approval still apply to anything you send a real client.

## 10. Checklist for each engagement

### Intake

- [ ] Legal name, who can approve a draft, who can approve a payment, and where the jobs and the applicants actually are (NC only, or also CA, CO, TX, UT, NYC, EU).
- [ ] Data classes written down. If the answer includes PHI, card data, wire instructions, or consumer reports, this workflow is not a quick win.
- [ ] System of record named (spreadsheet, inbox, NetSuite, something else). The AI does not become the record.
- [ ] The client has agreed, in writing, which documents you may see and that they have removed what they do not want you to see.

### Data classification

- [ ] Each input marked low, moderate, or high.
- [ ] High fields have a handling rule: exclude, or a specific legal basis and a BAA/DPA that names them. Default is exclude.
- [ ] Retention for working copies and for the approval record is a number of days, not "as needed."

### Vendor selection

- [ ] The tenant (theirs or yours) is named in the SOW.
- [ ] No-training and retention settings are checked against the live vendor page, and a copy of that page is in the file.
- [ ] DPA or BAA signed if personal information or PHI is in scope.
- [ ] Spend cap and key owner named.

### Build

- [ ] Redaction runs in code before the API call.
- [ ] Prices, approvals, and writes to the system of record are code and people, not model tools.
- [ ] The fallback when the model is unavailable is the client's current process.
- [ ] Staff acceptable-use page is the one the client actually adopted.

### Testing

- [ ] A fixed set of redacted real documents, reviewed by the person who does the work.
- [ ] Disagreements written down. No accuracy percentage in a deck unless the test and the denominator are in the appendix.
- [ ] A person who was not the builder tries to get the tool to email, pay, or reveal a redacted field, and it does not.

### Go-live

- [ ] Named approver, and the button or the send step does not work without them.
- [ ] The client has seen the audit fields you will keep.
- [ ] Customer-facing disclosure, if any, is the client's words.

### Monitoring

- [ ] A monthly look at disagreements, not a new model for its own sake.
- [ ] Vendor terms re-read if the vendor announces a change, and at least once a year.
- [ ] Deletion actually happens on the date in the SOW. Someone checks.
- [ ] If the client's footprint changes (they start hiring in New York City, selling into California, or writing insurance), the classification is redone before the workflow is.

## 11. What we will not claim

- That this playbook is legal advice, or that following it makes a client compliant.
- A time savings, an error rate, or a dollar return, unless that client's own test is attached and labeled as theirs.
- That a model is "NIST certified," "HIPAA compliant," or "EU AI Act compliant" as a slogan.
- That North Carolina has enacted a private-sector AI code. It had not, in the sources retrieved on 17 October 2026.
- That state AI laws were preempted by the March 2026 White House recommendations. They had not been, by any statute this pass found.

## Sources retrieved 17 October 2026

Federal: [15 U.S.C. § 45](https://www.law.cornell.edu/uscode/text/15/45); [15 U.S.C. § 45b](https://www.law.cornell.edu/uscode/text/15/45b); [Keep your AI claims in check](https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check); [The Luring Test](https://www.ftc.gov/business-guidance/blog/2023/05/luring-test-ai-engineering-consumer-trust); [Operation AI Comply](https://www.ftc.gov/news-events/news/press-releases/2024/09/ftc-announces-crackdown-deceptive-ai-claims-schemes); [FTC AI topic page](https://www.ftc.gov/industry/technology/artificial-intelligence); [Rytr order set aside](https://www.ftc.gov/news-events/news/press-releases/2025/12/ftc-reopens-sets-aside-rytr-final-order-response-trump-administrations-ai-action-plan); [16 CFR Part 314](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-314); [FTC GLBA privacy guide](https://www.ftc.gov/business-guidance/resources/how-comply-privacy-consumer-financial-information-rule-gramm-leach-bliley-act); [NIST AI 100-1](https://doi.org/10.6028/NIST.AI.100-1); [NIST AI 600-1](https://doi.org/10.6028/NIST.AI.600-1); [NIST on EO 14110](https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence); [EO 14148](https://www.federalregister.gov/documents/2025/01/28/2025-01901/initial-rescissions-of-harmful-executive-orders-and-actions); [EO 14179](https://www.federalregister.gov/documents/2025/01/31/2025-02172/removing-barriers-to-american-leadership-in-artificial-intelligence); [OMB memoranda index](https://www.whitehouse.gov/omb/information-resources/guidance/memoranda/); [OSTP 2025 highlights](https://www.whitehouse.gov/wp-content/uploads/2026/01/WHOSTP-2025-Wins.pdf); [March 2026 legislative recommendations](https://whitehouse.gov/wp-content/uploads/2026/03/03.20.26-National-Policy-Framework-for-Artificial-Intelligence-Legislative-Recommendations.pdf).

North Carolina: [G.S. 75-61](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-61.html); [G.S. 75-65](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-65.html); [G.S. 14-113.20](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_14/GS_14-113.20.html); [NCDOJ breach page](https://ncdoj.gov/protecting-consumers/protecting-your-identity/protect-your-business-from-id-theft/security-breach-information/); [EO 24](https://governor.nc.gov/executive-order-no-24-advancing-trustworthy-artificial-intelligence-benefits-all-north-carolinians); [NCDIT AI framework](https://it.nc.gov/documents/nc-state-government-responsible-use-artificial-intelligence-framework/open); [NCDIT public GenAI policy](https://it.nc.gov/documents/use-publicly-available-generative-artificial-intelligence/open); [NCGA AI bill index](https://www.ncleg.gov/Legislation/Bills/ByKeyword/2025/4091/); [Bulletin 24-B-19](https://www.ncdoi.gov/24-b-19-use-artificial-intelligence-systems-insurance/open).

Other states and EU: [Colorado SB 26-189](https://www.leg.colorado.gov/bills/sb26-189); [Colorado AG](https://coag.gov/ai/); [Civil Code § 1798.140](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.140.); [CPPA thresholds](https://privacy.ca.gov/laws-and-regulations/monetary-thresholds-in-the-ccpa/); [CPPA 23 September 2025 announcement](https://cppa.ca.gov/announcements/2025/20250923.html); [Utah Chapter 77](https://le.utah.gov/xcode/Title13/Chapter77/C13-77_2025050820250508.pdf); [Texas HB 149](https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00149F.htm); [Texas AG](https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint/consumer-ai-rights); [EU Commission AI Act page](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai); [EUR-Lex summary](https://eur-lex.europa.eu/EN/legal-content/summary/rules-for-trustworthy-artificial-intelligence-in-the-eu.html).

Industry and vendors: [45 CFR 160.103](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160/subpart-A/section-160.103); [PCI document library](https://www.pcisecuritystandards.org/document_library/); [29 CFR 1904.33](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1904/subpart-D/section-1904.33); [29 CFR 1910.1020](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-Z/section-1910.1020); [NYC Admin. Code § 20-871](https://codelibrary.amlegal.com/codes/newyorkcity/latest/NYCadmin/0-0-0-135598); [DCWP AEDT FAQ](https://www.nyc.gov/assets/dca/downloads/pdf/about/DCWP-AEDT-FAQ.pdf); [NAIC model bulletin](https://content.naic.org/sites/default/files/inline-files/2023-12-4%20Model%20Bulletin_Adopted_0.pdf); [ALTA Safeguards note](https://www.alta.org/news-and-publications/news/20231031-FTC-Amends-GLBAs-Safeguards-Rule); [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data); [OpenAI business data](https://openai.com/business-data/); [Anthropic API retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention); [Google ZDR](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/zero-data-retention); [Azure OpenAI data privacy](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy).
