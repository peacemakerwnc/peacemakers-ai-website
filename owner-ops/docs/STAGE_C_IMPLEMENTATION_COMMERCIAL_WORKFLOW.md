# Stage C — Implementation Commercial Workflow

**Audience:** James (owner operator)  
**Use:** First 1–3 post-Blueprint implementation engagements  
**Type:** Commercial / scoping operating procedure — not methodology  

**Status:** `STAGE C COMMERCIAL WORKFLOW — DEFINED`  
**Authority:** OD-MR-02 · pipeline OD-MR-06 · Advisor `blueprint-advisor-0.1.2` Stage C  

**Analysis engine (do not duplicate here):**  
[stage-c.md](../skills/peacemakers-blueprint-advisor/references/stage-c.md) · OS ladder [TECHNOLOGY_DECISION_STANDARD.md](./peacemakers-operating-system/TECHNOLOGY_DECISION_STANDARD.md) · AI gate [AI_GOVERNANCE_STANDARD.md](./peacemakers-operating-system/AI_GOVERNANCE_STANDARD.md)

Related:

- [PEACEMAKERS_OWNER_OPERATING_RUNBOOK.md](./PEACEMAKERS_OWNER_OPERATING_RUNBOOK.md)
- [BLUEPRINT_COMMERCIAL_GATE_CHECKLIST.md](./BLUEPRINT_COMMERCIAL_GATE_CHECKLIST.md) (Blueprint gate — separate)
- [BLUEPRINT_ARTIFACT_HANDLING.md](./BLUEPRINT_ARTIFACT_HANDLING.md)
- Billing: `billing/stripe-catalog.json` · `billing/docs/pandadoc-setup.md` · draft≠send skills

---

## What Stage C is / is not

| Stage C **is** | Stage C **is not** |
|----------------|-------------------|
| Bounded scoping for a **credible implementation offer** | Free technical design or unpaid deep discovery |
| After Blueprint Complete + explicit interest + **selected** Proposed items | Automatic after Blueprint delivery |
| Internal Advisor Stage C + James commercial conversion | Client-facing dump of full Stage C mechanics |
| Separate from the $3,500 Blueprint SKU | Implementation execution / Stage D |

---

## Entry gate (all required)

Enter pipeline **`Implementation Scoping`** only when:

1. **Blueprint complete** — client received/reviewed the Business Blueprint.  
2. **Explicit Implementation Interest** — client asked Peacemakers to help implement (not “looks great,” “how would this work?,” “ballpark?,” or “we’ll think about it”).  
3. **Selected Proposed recommendation(s)** — named items from Stage B / client Blueprint (do not scope the whole Blueprint by default).  
4. **James approval** — candidates are appropriate to advance.

If selection is unclear → NextAction: `Clarify selected Proposed recommendations` — do **not** start Stage C.

Pipeline: `Implementation Interest` → (gate) → `Implementation Scoping`

---

## Depth boundary (three levels)

### A — Included in Stage C / commercial scoping

Enough to answer: what / why / systems / in / out / who owns what / dependencies / rough effort·range / completion concept / what to charge.

Produce (via Advisor Stage C + James commercial worksheet): objective, selected items, outcome, scope, exclusions, assumptions, dependencies, major work packages, responsibilities, systems, verification still needed, material risks, acceptance concept, effort/range, pricing inputs, proposed commercial model.

### B — Not included before implementation agreement (unless separately paid)

Exhaustive WBS · field-by-field config maps · full integration/API architecture · migration specs · detailed test scripts · exhaustive security design · deployment runbooks · full training curriculum · detailed change-management · **build execution**.

### C — Separate paid discovery if needed

If responsible pricing cannot be produced without substantial further analysis → stop unpaid work. Offer smallest existing paid discovery/scoping (or custom quote) — do not invent a new product line unless necessary.

---

## Current-tools-first & AI (pointers)

Before quoting tech work: confirm lowest sufficient intervention per **OS 0–9 ladder** ([TECHNOLOGY_DECISION_STANDARD.md](./peacemakers-operating-system/TECHNOLOGY_DECISION_STANDARD.md)). Prefer process/policy/standardize/train/configure/integrate/deterministic automation before new software or AI.

Material capability claims require authoritative vendor docs or direct verification — not plan names, memory, or AI feature guesses. If uncertain: `VERIFICATION REQUIRED BEFORE FINAL IMPLEMENTATION SCOPE`.

If AI is in the candidate: apply [AI_GOVERNANCE_STANDARD.md](./peacemakers-operating-system/AI_GOVERNANCE_STANDARD.md). If AI is not justified, do not include it because Peacemakers is an “AI” firm.

---

## Execution sequence (manual-first)

| Step | Action | Tool / SoR |
|------|--------|------------|
| 1 | Record `Implementation Interest` | Owner-Ops stage + Activity |
| 2 | Record selected Proposed recommendation ID(s)/titles | Owner-Ops Note/Activity |
| 3 | James approves candidates for Stage C | Owner-Ops Activity |
| 4 | Move to **`Implementation Scoping`** | Pipeline |
| 5 | Gather **minimum** extra evidence for pricing/scope only | Client / Drive |
| 6 | Run Advisor **Stage C only** (approved Stage B + selected items + evidence + vendor docs if needed) | ChatGPT `@peacemakers-blueprint-advisor` |
| 7 | Persist Stage C Markdown same day (private Drive) | [Artifact handling](./BLUEPRINT_ARTIFACT_HANDLING.md) |
| 8 | James reviews Stage C (quote-ready / conditional / not quote-ready) | Checklist below |
| 9 | Convert approved Stage C → **client-facing offer/SOW** (plain language) | DOCX / template |
| 10 | Move to **`Implementation Commercial`** | Pipeline |
| 11 | PandaDoc draft → James review → dual-approve send → **SIGNED** | PandaDoc SoR |
| 12 | Stripe invoice (custom amount) → dual-approve send → **required payment received** | Stripe SoR |
| 13 | Only then **`Implementation Active`** (Stage D) | Pipeline |

Draft ≠ send for PandaDoc and Stripe (same dual-approval pattern as Blueprint).

---

## Minimum additional discovery

Ask only what reduces material scope/price uncertainty (edition/config, user counts, integration availability, roles, access constraints, training volume, deployment limits).

Avoid: second full Blueprint, unrelated inventories, collecting every artifact.

---

## Pricing method (existing doctrine)

| SKU / path | Mode |
|------------|------|
| Blueprint `ai_opportunity_blueprint` | Fixed $3,500 — **not** used for implementation |
| `custom_implementation` / sprint / growth / workshop | **Custom quote** — `amount_cents` required ([billing/stripe-catalog.json](../../billing/stripe-catalog.json)) |

Do not invent rates, ROI, savings, or fixed delivery dates. If commercial inputs missing → Stage C says `Commercial input required` and leaves price blank until James supplies them.

Prefer:

- fixed fee when uncertainty is low;  
- bounded range or phased engagement when medium;  
- **paid discovery** when uncertainty is high — do not force false precision.

Account for labor, complexity, uncertainty, external costs, risk, testing, training, handoff, margin. Build unpaid scoping overhead into price or stop and sell discovery — do not erode margin with open-ended free Stage C.

Payment schedule: state clearly in the offer (100% upfront for small jobs, or deposit + milestone, etc.). **No universal schedule invented here** — James sets terms per engagement. Implementation Active only after the **required initial payment** condition in the agreement is met.

---

## Client-facing offer structure (minimum)

Plain language — not full Stage C dump:

1. Objective  
2. Selected Blueprint recommendation(s)  
3. Scope  
4. Deliverables  
5. Exclusions  
6. Client responsibilities  
7. Peacemakers responsibilities  
8. Dependencies  
9. Assumptions  
10. Acceptance / completion  
11. Commercial terms (price, payment, timing)  
12. Change control  
13. Signature  

Internal taxonomy, risk scores, and methodology stay out of the client packet.

**Template gap:** No dedicated reusable implementation SOW HTML/MD yet. First clients: draft DOCX from this outline → upload PandaDoc draft ([pandadoc-setup.md](../../billing/docs/pandadoc-setup.md) upload path). Classify: **READY MANUALLY**.

---

## PandaDoc / Stripe readiness

| Path | Status | Notes |
|------|--------|-------|
| PandaDoc | **READY MANUALLY** | Upload finished DOCX/PDF as draft; dual-approve send; Blueprint Charter-style upload proven; no dedicated impl template required for first clients |
| Stripe | **READY MANUALLY** | Use `custom_implementation` (or sprint/growth) with James-set `amount_cents`; draft≠send; separate from Blueprint SKU |

Do not create/send live docs in workflow definition passes.

---

## Change control (simple)

If request materially exceeds approved scope:

1. Name the change  
2. Stop extra work  
3. Clarify impact  
4. Written change scope/price (PandaDoc amendment or addendum)  
5. Approval before proceeding  

No change-order product required for first clients.

---

## Acceptance concept

Stage C defines high-level completion (e.g. configured as approved, agreed tests passed, roles trained, client sign-off, handoff docs). Stage D executes and measures. Do not invent unsupported success metrics in Stage C.

---

## Source-of-truth map

| Artifact | Authority |
|----------|-----------|
| Proposed recommendations | Stage B / delivered Blueprint |
| Bounded scope analysis | Stage C (Advisor) — James-approved |
| Signed commercial scope | **PandaDoc** |
| Payment | **Stripe** |
| Lifecycle / NextAction / decisions | **Owner-Ops** |
| System capability | Client systems + authoritative vendor docs |

Owner-Ops never overrides PandaDoc/Stripe.

---

## Artifact security

Apply [BLUEPRINT_ARTIFACT_HANDLING.md](./BLUEPRINT_ARTIFACT_HANDLING.md).

Under the approved Google Workspace client root, extend as needed:

```text
Clients / <Client> / Business Blueprint /   …existing 01–06…
Clients / <Client> / Implementation /
  07 Implementation Scoping   # Stage C MD (confidential)
  08 Implementation Commercial  # offer DOCX refs; no secrets
  09 Implementation          # post-gate delivery notes
```

Same-day persist after James approves Stage C. No credentials. AI preflight before ChatGPT upload. Not Git by default.

---

## Suggested NextActions

- Confirm selected Proposed recommendations  
- Gather minimum scope evidence  
- Run Stage C  
- Review Stage C (quote-ready?)  
- Draft client offer/SOW  
- Review PandaDoc draft  
- Dual-approve send agreement  
- Create/review Stripe invoice  
- Dual-approve send invoice  
- Await signature / required payment  
- Confirm implementation gate → Implementation Active  

---

## STOP rules

Do not proceed if:

- recommendation(s) not selected or interest ambiguous  
- Stage B item still unresolved for the candidate  
- material vendor capability unverified where it drives price/scope  
- required evidence missing  
- uncertainty too high for responsible pricing (sell discovery instead)  
- client demands free detailed design  
- AI not appropriate/approved  
- commercial terms not James-approved  
- signature or required payment incomplete  

### Scope-creep responses

| Ask | Response |
|-----|----------|
| “Look at this other workflow too?” | If material → new paid scope |
| “Show exact integration design before we sign?” | High-level OK; detailed design after gate or paid scoping |
| “Configure a few things while we talk?” | No consequential impl before agreement/payment |
| “Exact price without the info you asked for?” | No false precision |

---

## James Stage C review checklist

- [ ] Entry gate complete (interest + selection + James approve)  
- [ ] Lowest sufficient OS ladder level; current-tools-first honesty  
- [ ] AI gated if relevant  
- [ ] Quote-readiness decision clear  
- [ ] Scope / exclusions / assumptions / dependencies / acceptance present  
- [ ] Effort/range supportable; no invented ROI/fixed date  
- [ ] Price/terms filled with James commercial inputs (or discovery offered)  
- [ ] Client offer is plain language; internal Stage C not over-shared  
- [ ] Stage C saved to private Drive; Owner-Ops Activity recorded  
- [ ] PandaDoc/Stripe draft≠send discipline planned  

---

## Owner burden (first clients)

Typical unpaid overhead (keep small): interest/selection clarify · light evidence chase · Stage C run/review · SOW draft · agreement/invoice admin.  

Price implementation to absorb normal scoping, or convert excess analysis to **paid discovery**. Do not run open-ended free Stage C.
