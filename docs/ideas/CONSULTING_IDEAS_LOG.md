# Consulting ideas log

Ideas dropped for **Peacemakers AI** (classification B): the consulting practice for North Carolina builders, contractors, home services, and similar businesses in the $5–50 million range. Offers in view are the **$3,500 Blueprint**, then a monthly AI department at **$10,000, $15,000, or $20,000**.

This file is a log only. Nothing here is approved to build, schedule, send, or post. Nothing here is legal advice.

`docs/ai-practice/` is not on `main`. The safety notes below follow `owner-ops/docs/peacemakers-operating-system/` (consulting, AI governance, human approval, agent security, evidence) and the practice playbook on branch `cursor/ai-practice-compliance-demo-028f`. That playbook says Peacemakers will not claim a time saving, an error rate, or a dollar return unless that client's own test is attached. The client-data page on that branch already says the client owns the records, personal details come out before a model sees the file, a person approves anything a customer would see, and a breach that involves a North Carolina resident's personal information may require notice.

Evidence labels: VERIFIED, OBSERVED, INFERRED, HYPOTHESIS, ASSUMPTION, CONTRADICTED, UNKNOWN.

---

## 2026-10-31 — Name the customer data before you automate it. Leave the jail line out.

**Status:** Logged. No post. No legal memo. No offer change. No client email.

**Classification:** (B) Peacemakers AI consulting. The Reel is a warning to AI-automation agencies about customer data, the UAE personal-data law, and the EU AI Act. The part James can use is already in his own data page: say what the job is allowed to touch, and decline the rest. The prison hook is not.

**Why this is not the other three.** `@buildingpeacemakers` (playbook on PR #73) is a Catholic dad talking about the prayers and the teaching day, with the kids off camera. This Reel is not that. It is not a book. The personal-brand note on the same PR is the LinkedIn line about finance teams after a NetSuite go-live. This drop is about the consulting work, not that sentence.

**Source**

- James dropped `https://www.instagram.com/reel/DbVaATxtBRS/` with no note. This task did not include a Slack permalink.
- Posted by Jordan Bailey, handle `jordanharoldbailey`. Upload time in the media file: 28 July 2026, 11:15 UTC. 1080×1920, 49.2 seconds. At fetch on 31 October 2026: 1,886 likes, 84 comments. Those counts are a snapshot. Ten comment texts came back with the media. Like counts on those ten were empty, so they are not used.

**Caption (OBSERVED):** "Know the rules kids and don't send your clients to jail lol"

**On-screen hook, present the whole time (OBSERVED):** "AI automation is cute until you send your clients to prison lol"

**Fetch:** Firecrawl refuses Instagram. `yt-dlp` downloaded the public video, the caption, and the ten comments. Local Whisper `small.en` on the voice track. The first pass skipped roughly the 10–30 second span. A second pass on that slice, with the burned-in captions beside it, is what the middle quotes use. Frames were sampled about every two seconds. The bottom captions track the voice. They fall apart on the last legal names (below).

**What he actually says**

Talking-head, outdoors, white hoodie, mountains behind him. No product, no screen share, no client file, no Peacemakers page.

Paraphrase, in his order. Bracketed words are where the caption and the voice disagreed.

The cute part of an AI-automation agency ends when the work is a real build on customer data, on what he calls "ownership data," under new AI rules, and not a website or a plumber. It "gets serious real quick" (the burned-in line says "she gets"; one voice pass heard "so you get"). He asks what you know about PDPL and about the "AI EU Act," then asks if you are going to be the DPO for that client and answers that he does not think so. If the client is a Dubai accountancy firm, he ties a headcount of 250 employees to a professional duty to say: the thing you want automated, we cannot do, otherwise you are going to jail. The burned-in caption says "whether the 250 employees." The voice pass heard "who have over 250 employees" ("over" 0.96, "250" 0.98, "who" 0.29). He says this is not bedroom Facebook lead-form ads for a local solar installer or a tree surgeon. Then: look up PDPL and the EU AI Act before one of your clients is in jail and it is your fault. On that last look-up, the caption reads "PDP hours" and "the AIU act." The earlier frames and the earlier audio both say PDPL. The earlier caption says "AI EU acts." The voice pass heard "AI EU Act," with "EU" around 0.7 and "Act" under 0.2, so the last word is the weak one. "AIU act" is the same name garbled.

"Ownership data" is the phrase on the caption and in the audio. He does not define it.

**Comments that add a claim (OBSERVED, not checked against a case)**

- `@mitchelljasper.co`: the whole answer is a privacy policy and a user agreement that disclose how data is stored and used.
- `@_emtab`: AI can help you read the requirements, and you still need a person who can line the job up with them.
- `@eb.111z`: this nearly happened and they lost a client. No detail.

**Claim check**

| Claim | Label | Source |
| --- | --- | --- |
| PDPL is a real UAE personal-data law, and a DPO can be required. | VERIFIED as the statute. The 250-employee line is not in it. | Federal Decree-Law No. 45 of 2021. Article 10 requires a data protection officer for high-risk processing from new technologies or volume, for systematic assessment of sensitive personal data including profiling and automated processing, or for a large volume of sensitive personal data. The volume test was left to executive regulations. Article 10 does not use a headcount. [Official English text](https://www.uaelegislation.gov.ae/en/legislations/1972/download), read 31 October 2026. |
| A Dubai accountancy firm is under that federal PDPL, and 250 employees is the switch. | CONTRADICTED as a blanket rule. | Article 2(2)(g) excludes companies in free zones that have their own personal-data legislation. DIFC and ADGM are those zones. Article 2(2)(f) also sets aside personal banking and credit data that already have their own rules. Many Dubai accountancy firms sit in the DIFC. DIFC Law No. 5 of 2020 has its own DPO rule, tied to high-risk processing on a systematic or regular basis, not to 250 staff. [DIFC Law No. 5 of 2020](https://assets.difc.com/v1/media/edge/images/dubaiintern0078-difcexperie96c5-production-3253/media/project/difcexperiences/difc/difcwebsite/documents/laws--regulations/data-protection-law.pdf). |
| The 250 figure is the point where a duty appears. | CONTRADICTED for both PDPL and the GDPR DPO. | GDPR Article 30(5) is the 250-person figure, and it is about keeping a record of processing, with exceptions that swallow a lot of ordinary business processing. The DPO duty is Article 37: public authority, or core activities that are large-scale regular monitoring, or large-scale special-category or criminal-offence data. No employee count. [European Commission, Do the rules apply to SMEs?](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/application-regulation/do-rules-apply-smes_en) and [Article 30](https://gdpr-info.eu/art-30-gdpr/). |
| The agency becomes the client's DPO. | He says the opposite, and the opposite is the sound reading. | OBSERVED: "Are you going to be the DPO for that client? I don't think so." A DPO has to be able to do the job without a conflict. The person selling and building the automation is a poor candidate for the client's DPO. Under the GDPR that role can be a staff member or a service contract (Article 37(6)). It is not the vendor by default. |
| Do the automation and the client goes to jail, and it is the agency's fault. | CONTRADICTED as the consequence of these laws. | PDPL Article 26 is administrative penalties, to be listed later by a Cabinet decision. The Decree-Law contains no prison term. Baker McKenzie's review dated 10 December 2025 still said that Cabinet decision had not set the sanctions. A secondary tracker checked 18 October 2026 still said the executive regulations and that Cabinet decision were unissued. This pass did not find a Gazette notice either way. The Decree-Law also does not switch off other UAE criminal laws. [Article 26 in the official text](https://www.uaelegislation.gov.ae/en/legislations/1972/download). [Baker McKenzie, 10 December 2025](https://resourcehub.bakermckenzie.com/en/resources/global-data-and-cyber-handbook-lite/emea/uae/topics/regulators-enforcement-priorities-and-penalties). The EU AI Act's penalty article is administrative fines: up to €35 million or 7% of worldwide turnover for prohibited practices, €15 million or 3% for other listed breaches, €7.5 million or 1% for misleading information to authorities, with the lower figure for SMEs. Member states set the penalty rules and may add non-monetary measures. The article does not create a jail sentence. [Article 99](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-99). GDPR's own fines are administrative too. A member state can add its own criminal offense. This Reel names none. |
| The EU AI Act is something an agency should look up before a custom build. | PARTLY VERIFIED. It is in force on a staggered clock. It is not the statute for a Weaverville builder's internal helper. | Commission FAQ, retrieved 31 October 2026: the Act applies to public and private actors, inside or outside the EU, who place an AI system or a general-purpose model on the EU market, or who put a system into service or use it in the EU. Prohibitions and AI literacy from 2 February 2025. Governance and general-purpose models from 2 August 2025. The rest of the Act from 2 August 2026, with high-risk Annex III systems from 2 December 2027 and AI inside regulated products from 2 August 2028. [Navigating the AI Act](https://digital-strategy.ec.europa.eu/en/faqs/navigating-ai-act). [When does enforcement start?](https://ai-act-service-desk.ec.europa.eu/en/ai-act/faq/when-does-enforcement-start). |
| A privacy policy and a user agreement are the fix. | A comment, not his claim. Incomplete. | A notice tells people what you do. It does not make a processing lawful, and it does not make James the DPO. |
| North Carolina builders live under this Reel's laws. | CONTRADICTED for PDPL and the EU AI Act as a general matter. | His buyers are the solar-installer and tree-surgeon end of the market, which the Reel itself sets aside as lead-form work. North Carolina had not enacted a comprehensive consumer privacy statute as of the sources checked. H462's last action on the General Assembly site is a committee referral on 29 April 2025. S757 was still in Senate Rules on an 11 September 2026 re-check. Session Law 2025-79 is a nonprofit-donor privacy act, not a consumer privacy act. [H462](https://www.ncleg.gov/BillLookUp/2025/H462/True). [SL 2025-79](https://www.ncleg.gov/EnactedLegislation/SessionLaws/PDF/2025-2026/SL2025-79.pdf). The rule the practice already names is breach notice when a North Carolina resident's personal information is involved (`docs/ai-practice/client-data-safety-onepager.md` on the open branch). |

**Whether it applies**

| Surface | Fit |
| --- | --- |
| Client system to build | None. There is no workflow, prompt, or tool in the Reel. |
| Blueprint assessment | One question already fits, and the one-pager already asks it: what is sensitive before we start (customer contacts, employee records, card numbers, insurance files, closing files), which system is the real record, and who approves a draft a customer would see. Write the answer into the scope. Do not import PDPL, the EU AI Act, a 250-employee test, or a prison warning into a North Carolina builder's assessment. |
| Offer or pricing | No change. He does not become a data-protection officer for hire. He does not add a "compliance" product because of this Reel. If a job would put customer records into a model, or would let a model email a customer or move money, the existing page already says no. That is a scope limit, not a new SKU. |
| Outreach and own marketing | The prison hook, "lol," and "it's all your fault" stay off the site, the ads, and the first email. A plain sentence is enough if he ever says this in public: we say what customer data the job may touch, and we do not automate the rest. No stitch and no re-edit of this Reel. |
| Internal stack | No tool. No policy generator. The comment that reduces this to a privacy policy is not a build. |

**Effort.** This pass is the log. Putting the data sentence into a Blueprint scope is a writing step he already has a draft for. No research project on UAE or EU law unless a real client actually operates there, and then it is their lawyer, not this note.

**Risk.** Scaring a builder with jail. Calling James their DPO or their lawyer. Treating 250 employees as a switch. Quoting PDPL or the EU AI Act at a firm that does not place a system on that market. Letting a privacy-policy page stand in for a decision about what the model is allowed to see. Repeating "it's all your fault" as a promise of liability.

**Compliance.** This entry is not legal advice and not a client deliverable. Marketing and proposals stay on observed work and labeled assumptions. A person approves anything that would be posted or sent (`HUMAN_APPROVAL_STANDARD.md`). The footage is his. It is not licensed for a Peacemakers cut. No client file was in the Reel.

**Not approved:** posting, commenting, or DMing; stitching or re-uploading this Reel; using the prison line, the 250-employee line, or "it's all your fault"; offering DPO or legal services; a new compliance product; and any change to the Blueprint or the monthly prices.
