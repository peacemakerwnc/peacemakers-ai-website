# Blueprint Commercial Gate Checklist

**Audience:** James (owner operator)  
**Use:** First 1–3 paying Business Blueprint clients  
**Type:** Operating checklist only — not methodology, not client-facing, not a billing framework  

**Related authority:**

- Master roadmap: `owner-ops/docs/PEACEMAKERS_MASTER_IMPLEMENTATION_ROADMAP.md` (`OWNER APPROVED — EXECUTION AUTHORIZED`)
- Pipeline stages: `owner-ops/src/lib/pipeline-seed-data.ts` (OD-MR-06 — Blueprint Commercial before questionnaire; Implementation separate)
- Advisor: `blueprint-advisor-0.1.2` (execute in ChatGPT)
- Catalog SKU: `ai_opportunity_blueprint` · **$3,500** (`350000` cents)

---

## Hard gate

**Stage A does not begin until BOTH are true:**

1. PandaDoc Blueprint agreement = **SIGNED**
2. Stripe Blueprint invoice = **PAID IN FULL ($3,500)**

**No questionnaire release before both conditions.**

**Exception:** Only James may approve an exception. Any exception must be recorded in Owner-Ops. Do not invent deposit terms or default bypass authority.

---

## Source of truth

| System | Authoritative for |
|--------|-------------------|
| **PandaDoc** | Agreement document, recipients, signature status, signed copy |
| **Stripe** | Invoice, amount due, payment status, receipt |
| **Owner-Ops** | Engagement workflow, questionnaire status, James’s recorded commercial checkpoint, activity/audit |

Owner-Ops does **not** replace PandaDoc/Stripe verification. Record references after you verify the source systems.

---

## Manual-first

For the first 1–3 Blueprint clients, manual verification is preferred over webhooks/integrations when it is reliable and takes only a few minutes.

Automate later only if repetition creates meaningful burden or error risk.

---

## Explicit non-actions

- Do not start Stage A early.
- Do not send agreement or invoice without James review.
- Do not create or send PandaDoc “invoice” documents — **Stripe owns payment**.
- Do not promise implementation inside the Blueprint.
- Do not perform free Stage C / detailed technical design as Blueprint work.
- Do not rely on Owner-Ops alone for payment or signature status.
- Do not follow the seeded pipeline order that invites the form before payment — follow **this** checklist.

---

## Operating checklist

### A. Qualification

1. Confirm the client is qualified for the Business Blueprint.
2. Confirm:
   - client legal/business name;
   - signer name;
   - signer email;
   - billing email if different;
   - primary contact.

**Stop** if identity or signing authority is unclear.

---

### B. PandaDoc agreement

3. Prepare the Business Blueprint agreement using the proven Blueprint agreement pattern (Charter-style services agreement — not an invoice).
4. Confirm:
   - Peacemakers AI Solutions, LLC provider details;
   - client details;
   - service = Business Blueprint;
   - price = **$3,500**;
   - in scope: questionnaire + Stage A + 90-minute call + Stage B + client deliverable/review;
   - implementation excluded;
   - Stage C is **not** automatic Blueprint scope;
   - advisory is separate;
   - work starts only after signature + payment;
   - governing law / signature / contact details are correct.
5. James reviews the complete agreement.
6. Create/upload PandaDoc draft (upload DOCX path is the proven method).
7. Verify recipient and signature fields.
8. James approves send (dual approval if using send scripts).
9. Send PandaDoc.
10. Confirm PandaDoc status = signed/completed.
11. Record PandaDoc document ID/reference.

**Stop if:** recipient wrong; agreement revised mid-flight; signature incomplete; terms differ from approved Blueprint scope; or a PandaDoc invoice-looking doc is about to be sent.

---

### C. Stripe payment

12. Create/select the correct Stripe customer.
13. Create the Blueprint invoice using:
    - SKU: `ai_opportunity_blueprint`
    - Amount: **$3,500** / `350000` cents
    - One-time, **not** recurring
14. Confirm implementation/advisory is not bundled.
15. James reviews: customer, email, line item, amount, description, due/payment terms.
16. James approves send (dual approval if using send scripts).
17. Send Stripe invoice.
18. Confirm Stripe payment status = **PAID**.
19. Confirm amount paid = **$3,500**.
20. Record Stripe invoice ID/reference.

**Stop if:** amount differs; duplicate invoice exists; wrong customer; invoice pending/open; payment failed; or payment is partial.

---

### D. Commercial gate confirmation

21. Verify both:

- PandaDoc = **SIGNED**
- Stripe = **PAID $3,500**

22. Record in Owner-Ops Activity/Note:

`Blueprint commercial gate complete`

Include:

- PandaDoc document ID;
- signed confirmation/date;
- Stripe invoice ID;
- paid confirmation/date;
- James as verifier.

23. If either condition is missing: **STOP.** Do not release the questionnaire.

---

### E. Questionnaire release

24. Create questionnaire invitation in Owner-Ops.
25. Confirm: correct client, recipient, email, secure link; no duplicate live invite unless intentionally reissued.
26. James reviews invitation.
27. Send questionnaire.
28. Verify invitation status = SENT.
29. Client may save/resume.
30. Confirm submission status = SUBMITTED.

---

### F. Stage A gate

31. Confirm again:

- agreement signed;
- payment paid;
- questionnaire submitted.

32. Begin Stage A in **ChatGPT** using `@peacemakers-blueprint-advisor` at validated version **`blueprint-advisor-0.1.2`**.
33. James reviews Stage A before any client-facing use.

---

## Exception handling

| Situation | Action |
|-----------|--------|
| Agreement unsigned | No questionnaire. No Stage A. |
| Signed but unpaid | No questionnaire. No Stage A. |
| Paid but unsigned | Hold. No questionnaire. |
| Invoice pending | Hold. |
| Wrong amount | Stop and reconcile Stripe before release. |
| Duplicate invoice | Stop and reconcile Stripe before client action. |
| Agreement revision needed | Revise/reissue; prior draft is not signed authority. |
| Questionnaire sent too early | Record operational exception in Owner-Ops. Do **not** begin Stage A until commercial gate is complete. |
| Client asks to start early | Only James may approve. Record explicit exception + reason in Owner-Ops. |

---

## Quick reference — send controls

- Stripe send skill/script requires dual approval (`--i-approve-send` + `APPROVE_SEND_INVOICE`).
- PandaDoc send skill/script requires dual approval (`--i-approve-send` + `APPROVE_SEND_PANDADOC`).
- Draft ≠ send. Review before every send.

---

## Document control

- Created for first-paying-client commercial gate (manual).
- Does not modify OS, Advisor methodology, billing code, or Owner-Ops runtime.
- Pipeline stage rename/order remains a later P1 item; until then, **this checklist overrides** form-before-pay stage habit.
