<!--
INTERNAL — STRIP THIS COMMENT BLOCK BEFORE CLIENT / PANDA DOC COPY

Status: IMPLEMENTATION SOW TEMPLATE — REQUIRES STAGE C + JAMES APPROVAL

Do NOT populate from Stage B alone.
Do NOT invent new legal terms. Reuse/adapt only approved Peacemakers boilerplate
(see billing/clients/charter-building-group/agreement-filled.md — Blueprint Services Agreement).
Do NOT invent ROI, savings, or unsupported fixed calendars.
Do NOT request passwords or credentials in this document.
If responsible pricing needs substantial further discovery: STOP — offer Paid Implementation
Discovery / Scoping (or equivalent). Do not fake precision.

Source chain (required):
  Approved Stage B Proposed recommendation(s)
  → client selection + James Stage C approval
  → James-approved Stage C
  → this SOW (project fields only)
  → PandaDoc draft (DOCX upload) → dual-approve send
  → Stripe invoice (custom_implementation / amount_cents) → dual-approve send
  → signed + required payment + access → Implementation Active

PandaDoc path (proven): Markdown → DOCX → billing/scripts/upload_pandadoc_draft.py → draft only.
Canonical workflow: owner-ops/docs/STAGE_C_IMPLEMENTATION_COMMERCIAL_WORKFLOW.md
Artifact store: Google Drive …/Implementation/08 Implementation Commercial (not Git for real clients).

James pre-send checklist (internal):
  Scope — selected items match Stage C; exclusions explicit; no extra Blueprint items
  Commercial — price, payment schedule, third-party costs, support, margin reviewed internally
  Technical — material vendor capability verified; dependencies listed; access reasonable; no credentials
  Legal — only approved boilerplate; NC governing law / notices / signatures correct
  Send — correct client & version; James approved; PandaDoc draft reviewed; DO NOT SEND until explicit approval

Placeholder convention: {{Field.Name}} — replace all before client copy. Yellow-highlight unfilled fields in DOCX if helpful.
-->

# Implementation Statement of Work

**Document type:** Implementation Services Agreement / Statement of Work  
**Provider:** Peacemakers AI Solutions, LLC · Asheville, North Carolina · James P. Fullen · james@peacemakersai.com · 508-572-0133  
**Client:** {{Client.LegalName}} · Attn: {{Client.PrimaryContactName}} · {{Client.PrimaryContactEmail}}  
**Engagement title:** {{Engagement.Title}}  
**Fee:** {{Commercial.FeeDisplay}} — paid via separate Stripe invoice(s) per Section 11  
**Effective Date:** Date of last signature  
**Governing law:** North Carolina  

This Agreement covers **implementation services only**. It is separate from any Business Blueprint engagement. The Business Blueprint fee (if any) does not include the work described here.

---

## IMPLEMENTATION STATEMENT OF WORK

**Peacemakers AI Solutions, LLC** and **{{Client.LegalName}}**

**Effective Date:** Date of last signature  
**Provider:** Peacemakers AI Solutions, LLC, Asheville, North Carolina ("Peacemakers")  
**Client:** {{Client.LegalName}} ("Client"), Attn: {{Client.PrimaryContactName}}, {{Client.PrimaryContactEmail}}  
**Authorized Client contact(s):** {{Client.AuthorizedContacts}}  

### 1. Client and engagement

Client engages Peacemakers to perform the bounded implementation services described in this Statement of Work (the "Implementation"). The purpose is to execute the selected, James-approved scope derived from Client's completed Business Blueprint and an approved Stage C commercial scoping analysis. This Agreement does not authorize open-ended consulting, unpaid detailed design, or work outside Sections 5–7 unless added through written change control (Section 14).

### 2. Background / Blueprint connection

Client previously completed a Peacemakers Business Blueprint. Client selected the specific Proposed recommendation(s) listed in Section 4. **This SOW covers only the implementation scope listed here.** Other Blueprint recommendations, later ideas, and unrelated workflows are out of scope unless added through a signed change order or separate agreement.

### 3. Implementation objective

{{Implementation.Objective}}

*(Plain-language outcome only. No ROI, savings, revenue, or compliance guarantees.)*

### 4. Selected recommendation(s)

Only the following approved candidates are in scope:

| # | Recommendation | Purpose (high level) | Approved boundary |
|---|----------------|----------------------|-------------------|
| 1 | {{Rec.1.Title}} | {{Rec.1.Purpose}} | {{Rec.1.Boundary}} |
| 2 | {{Rec.2.Title}} | {{Rec.2.Purpose}} | {{Rec.2.Boundary}} |

*(Delete unused rows. Do not list Blueprint items that were not selected and Stage-C-approved.)*

### 5. Scope of work

Peacemakers will perform the following major work packages (from approved Stage C only):

1. {{Scope.WP1}}  
2. {{Scope.WP2}}  
3. {{Scope.WP3}}  
4. {{Scope.WP4}}  

*(Add/remove packages as needed. Prefer a small set of major packages — not an exhaustive WBS.)*

### 6. Deliverables

Tangible outputs under this Agreement:

- {{Deliverable.1}}  
- {{Deliverable.2}}  
- {{Deliverable.3}}  

*(List only artifacts supported by approved Stage C. Examples: documented workflow, agreed configuration, tested automation, training session, handoff notes, acceptance summary.)*

### 7. Out of scope / exclusions

Unless added through a signed change order or separate agreement, the fee does not include:

- {{Exclusion.1}}  
- {{Exclusion.2}}  
- {{Exclusion.3}}  
- Unrelated workflows or Blueprint recommendations not listed in Section 4  
- Software license, subscription, or third-party vendor fees (unless explicitly included in Section 11 or 15)  
- Unsupported custom software development outside Section 5  
- Data cleanup or migration outside Section 5  
- Additional integrations, vendor selection, or extensive custom reporting not listed in Section 5  
- Post-launch support beyond Section 17  
- Additional discovery or detailed design beyond what is required to complete Section 5  
- Legal, accounting, tax, HR, or compliance advice  
- Guarantees of savings, revenue, compliance, uptime, or other business results  

### 8. Client responsibilities

Client will:

- Provide timely access to systems, environments, and stakeholders reasonably required for Section 5, using secure methods (no passwords in email or this Agreement)  
- Designate required admin/contacts and one decision-maker authorized to approve scope and acceptance decisions  
- Provide accurate information and participate in agreed testing and reviews  
- Coordinate with Client's vendors when vendor action is required  
- Maintain required licenses/subscriptions for Client systems  
- Complete user acceptance for the deliverables in Section 6  
- Make all business, legal, security, employment, vendor, and go-live decisions  

### 9. Peacemakers responsibilities

Peacemakers will:

- Execute the approved scope in Sections 5–6  
- Preserve agreed controls and communicate material risks discovered during the engagement  
- Document material changes and obtain written approval before out-of-scope work  
- Test consequential changes as defined in the acceptance concept (Section 13)  
- Provide the agreed training/handoff listed in Sections 6 and 17  

### 10. Assumptions and dependencies

Material assumptions and dependencies that affect scope, price, or completion:

| Type | Item | Status |
|------|------|--------|
| Assumption | {{Assumption.1}} | {{Assumption.1.Status}} |
| Assumption | {{Assumption.2}} | {{Assumption.2.Status}} |
| Dependency | {{Dependency.1}} | {{Dependency.1.Status}} |
| Dependency | {{Dependency.2}} | {{Dependency.2.Status}} |

*(Examples: current-system capability, vendor/API availability, client access, data availability, stakeholder availability, timely approvals, third-party response times. If unverified, state "Verification required" — do not hide uncertainty.)*

If a listed dependency fails or an assumption proves false, Peacemakers may pause affected work and apply Section 14 (change control).

### 11. Commercial terms

| Item | Value |
|------|--------|
| Implementation fee | {{Commercial.FeeAmount}} |
| Pricing model | {{Commercial.Model}} *(e.g., fixed fee / phased / milestone — James-approved)* |
| Payment schedule | {{Commercial.PaymentSchedule}} |
| Required initial payment before Implementation Active | {{Commercial.InitialPaymentCondition}} |
| Taxes / disclosed processing charges | Applicable taxes, if any, and approved third-party costs are additional unless stated otherwise. Client is responsible for payment-processing charges only if specifically disclosed on the final invoice before payment. |
| Invoice method | Separate Stripe invoice(s) or approved payment link |

**This Implementation fee is separate from any Business Blueprint fee.** Prior Blueprint payment does not credit toward this Agreement unless explicitly stated in writing.

Peacemakers will not begin Implementation Active work until Section 12 start conditions are met.

### 12. Schedule / timing and start conditions

**Estimated implementation window / sequencing:** {{Schedule.EstimateOrMilestones}}

*(Use an estimated window, milestone sequence, or start-condition language only. Do not invent unsupported fixed calendars or 30/60/90 roadmaps.)*

**Work begins only after all of the following:**

1. Both parties sign this Agreement;  
2. Peacemakers receives the **required initial payment** in cleared funds per Section 11; and  
3. Client supplies the required access and readiness items reasonably identified for kickoff (see Sections 8 and 10).

Meeting and delivery dates will be scheduled in writing after these conditions are met. Client-caused delays may move the schedule. Owner-Ops pipeline: Implementation Commercial → (gate) → Implementation Active. **PandaDoc** is the signature source of truth; **Stripe** is the payment source of truth.

### 13. Acceptance / completion

The Implementation is complete when the following acceptance concept is met (from approved Stage C):

{{Acceptance.Criteria}}

*(Examples where applicable: agreed workflow configured as approved; defined tests passed; agreed training delivered; handoff documentation delivered; client review/sign-off obtained; production cutover completed if in scope. Do not promise business outcomes that depend solely on Client behavior after handoff.)*

Client will review and confirm acceptance (or provide specific written deficiencies) within {{Acceptance.ReviewWindow}} business days after Peacemakers notifies Client that deliverables are ready for acceptance. Silence after that window, or production use of the deliverables without written objection, may be treated as acceptance of the notified items.

### 14. Change control

**Included clarification** — questions and refinements needed to complete the agreed work in Sections 5–6 without materially expanding systems, workflows, integrations, outputs, or dependencies.

**Change** — a materially new requirement, workflow, system, integration, output, dependency, or acceptance standard.

**New engagement** — work that is materially separate from Section 4 and should be scoped under a separate agreement.

If work materially exceeds the agreed scope:

1. Peacemakers identifies the change;  
2. Affected extra work pauses;  
3. Scope, timing, and price impact are documented in writing;  
4. Client approves in writing (including electronic signature / written amendment);  
5. Work resumes only after approval.

Amendments and waivers must be in writing and accepted by both parties.

### 15. Third-party services / software

Unless Section 11 expressly includes them, third-party license, subscription, usage, and vendor fees are Client's responsibility. Peacemakers does not control third-party uptime, features, pricing, or roadmap. Vendor capability assumptions material to this SOW must be verified as noted in Section 10. Client remains responsible for its vendor agreements unless otherwise stated in writing.

### 16. Data / security / AI *(include only if material)*

{{DataSecurityAI.SectionOrNA}}

*(If AI is not in Stage C scope, write "Not applicable — AI is not in scope under this Agreement." Do not add AI language merely because Peacemakers is an AI company. If material, state approved systems/data, human-review requirements, authority limits, and sensitive-data constraints — do not rewrite Peacemakers security doctrine here. Prefer reference to Sections 8–9 and confidentiality below.)*

### 17. Post-implementation support

{{Support.Terms}}

*(If included: duration, scope, channel. If not included: state that ongoing advisory/support is a separate engagement. Do not create indefinite free support.)*

### 18. Confidentiality and data handling

Each party will use the other party's nonpublic information only for this engagement, protect it with reasonable care, and disclose it only to personnel or service providers who need it and are bound by confidentiality duties. Confidential information excludes information that is public through no breach, already lawfully known, independently developed, or lawfully received from another source. A party may disclose information when legally required after providing notice when permitted. Client should provide the minimum data necessary and redact sensitive information where practical.

### 19. Intellectual property and permitted use

Upon full payment of amounts due under this Agreement, Client owns the final Client-specific deliverables produced under Sections 5–6 (for example, Client-specific workflow documentation, configuration notes, and handoff materials prepared for Client) and may use them internally. Peacemakers retains ownership of its pre-existing methods, templates, frameworks, know-how, generic tools, and improvements that do not reveal Client confidential information. Peacemakers grants Client a perpetual, nonexclusive license to use any embedded Peacemakers materials solely as part of the Client-specific deliverables for Client's internal business purposes. Neither party may use the other's name, logo, or engagement details publicly without prior written permission, except as legally required.

<!-- LEGAL REVIEW / OWNER DECISION REQUIRED if a specific engagement needs different IP treatment for code, connectors, or joint work product beyond this Blueprint-derived pattern. Do not invent novel IP terms in the client copy without owner decision. -->

### 20. Professional judgment; no guaranteed results

Implementation work reflects professional judgment based on information available during the engagement and the verified assumptions in Section 10. Client remains responsible for verifying facts, approving configurations and go-live decisions, evaluating vendors, maintaining backups and controls, and deciding whether and how to operate after handoff. Peacemakers does not warrant that information supplied by Client or third parties is complete or error-free and does not guarantee financial, operational, legal, security, compliance, uptime, or other outcomes.

### 21. Limitation of liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR FOR LOST PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITY ARISING FROM THIS AGREEMENT. EXCEPT FOR CLIENT'S PAYMENT OBLIGATIONS, A PARTY'S BREACH OF CONFIDENTIALITY, INFRINGEMENT OR MISAPPROPRIATION OF THE OTHER PARTY'S INTELLECTUAL PROPERTY, FRAUD, WILLFUL MISCONDUCT, OR LIABILITY THAT CANNOT LEGALLY BE LIMITED, EACH PARTY'S TOTAL LIABILITY WILL NOT EXCEED THE FEES PAID OR PAYABLE UNDER THIS AGREEMENT.

### 22. Independent contractor; no authority

Peacemakers is an independent contractor and has no authority to bind Client, make purchases for Client, contact vendors as Client's agent, change Client systems, or accept terms on Client's behalf unless separately authorized in writing.

### 23. Termination; payment for work performed

<!-- LEGAL REVIEW / OWNER DECISION REQUIRED for engagement-specific refund/deposit forfeiture rules beyond the following reuse of Blueprint-era earned-fee principle. -->

Either party may terminate for material breach after written notice and a reasonable opportunity to cure. Upon termination, Client will pay for work performed and nonrecoverable third-party costs authorized in writing through the effective termination date, and Peacemakers will deliver completed work product for which payment has been received, subject to confidentiality and IP terms above. Fees already earned for completed work packages are nonrefundable to the extent earned; Peacemakers will provide a reasonable accounting of work completed upon written request.

### 24. General terms

This Agreement and any incorporated final scope or invoice constitute the entire agreement for this Implementation and supersede prior discussions on that subject (including Blueprint recommendations not listed in Section 4). Amendments and waivers must be in writing and accepted by both parties. Neither party may assign this Agreement without the other's written consent, except in connection with a merger, reorganization, or sale of substantially all relevant assets. If any provision is unenforceable, the remainder remains effective. Electronic signatures and counterparts are permitted. Notices must be sent to the contacts listed below. Governing law and venue: State of North Carolina.

### 25. Notices and contacts

**Peacemakers:** James P. Fullen · james@peacemakersai.com · 508-572-0133  

**Client:** {{Client.NoticeName}} · {{Client.NoticeEmail}} · {{Client.NoticeAddress}}  

### 26. Signatures

The parties intend to be bound upon signature by authorized representatives.

| | Peacemakers AI Solutions, LLC | {{Client.LegalName}} |
|--|-------------------------------|----------------------|
| Signature | _______________________________ | _______________________________ |
| Name | James P. Fullen | {{Client.SignerName}} |
| Title | {{Provider.SignerTitle}} | {{Client.SignerTitle}} |
| Date | _______________________________ | _______________________________ |

---

<!-- END CLIENT DOCUMENT. Optional owner fill notes below are NOT for PandaDoc. -->
