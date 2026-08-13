# Peacemakers Owner Operating Runbook

**Audience:** James (owner operator)  
**Use:** First 1–3 paying Business Blueprint clients  
**Type:** Owner procedure / checklist only — not methodology, not client-facing  

**Status:** `CLAIM-SAFE LIFECYCLE PROCEDURE`  
**Compatible:** OS `pm-os-0.1.0` · Advisor `blueprint-advisor-0.1.2` · Templates claim-safe  

---

## How to use this document

1. Find the client’s current phase in the lifecycle map.
2. Execute only that phase’s checklist.
3. Hit every **Hard stop** before advancing.
4. For detail, open the linked canonical asset — do not reinvent it here.

Manual steps are acceptable for the first 1–3 clients (payment verify, Stage A/B transfer, HTML/PDF, send, interest recording). Automate later only if repetition proves the need.

---

## Canonical authorities (do not duplicate)

| Authority | Path / system |
|-----------|----------------|
| Methodology | [peacemakers-operating-system/](./peacemakers-operating-system/) (`pm-os-0.1.0`) |
| Stage A–D analysis | [../skills/peacemakers-blueprint-advisor/](../skills/peacemakers-blueprint-advisor/) (`blueprint-advisor-0.1.2`) — run in **ChatGPT** |
| Master roadmap | [PEACEMAKERS_MASTER_IMPLEMENTATION_ROADMAP.md](./PEACEMAKERS_MASTER_IMPLEMENTATION_ROADMAP.md) |
| Commercial gate | [BLUEPRINT_COMMERCIAL_GATE_CHECKLIST.md](./BLUEPRINT_COMMERCIAL_GATE_CHECKLIST.md) |
| Client Blueprint templates | [deliverables/](./deliverables/) |
| Engagement SoR | **Owner-Ops** (client, opportunity, questionnaire, evidence, activity, status) |
| Agreement SoR | **PandaDoc** |
| Payment SoR | **Stripe** |
| Code / docs version control | **Git / Cursor** |

Acceptance reference (fictional): [acceptance/harbor-ridge-blueprint-rehearsal/](./acceptance/harbor-ridge-blueprint-rehearsal/)

---

## Source-of-truth quick reference

| System | Authoritative for |
|--------|-------------------|
| **PandaDoc** | Agreement / signature |
| **Stripe** | Invoice / payment |
| **Owner-Ops** | Client, engagement, questionnaire, evidence, status, activity |
| **ChatGPT** | Blueprint Advisor Stage A–D execution |
| **Git / Cursor** | OS, skill, templates, software |
| **Client systems** | Operational evidence per validated source-of-truth rules |

Owner-Ops does **not** replace PandaDoc or Stripe verification.

---

## Lifecycle map

| Phase | Name | Client-facing? | Next when |
|-------|------|----------------|-----------|
| 0 | Lead / qualification | Intro only | Blueprint Qualified |
| 1 | Commercial gate | Agreement + invoice | Signed **and** paid |
| 2 | Questionnaire | Secure form | SUBMITTED + reviewed |
| 3 | Stage A | Evidence request (after review) | Stage A approved + evidence prep |
| 4 | Blueprint call | 90-min session | Transcript/notes retained |
| 5 | Stage B | No (internal analysis) | Stage B approved (Proposed set) |
| 6 | Client Blueprint | HTML/PDF + review | Delivered / presented |
| 7 | Client decision | Review meeting | A/B/C outcome recorded |
| 8 | Stage C gate | Only if selected candidates | Bounded scope for offer |
| 9 | Implementation gate | Impl agreement + pay | Signed **and** paid per agreement |
| 10 | Stage D / outcome | Delivery / review | Scope closed; outcomes recorded |

---

# STOP AND DO NOT PROCEED IF

- Blueprint agreement **unsigned**
- Blueprint payment **unpaid** ($3,500 in full, unless recorded James exception)
- Questionnaire **incomplete** (unless James records why evidence is sufficient)
- Critical stakeholder / evidence absent and analysis would overreach
- Stage A/B output contains **unsupported claims**
- Vendor capability not verified where material
- Recommendation removes a legitimate control without replacement
- AI proposed without passing the AI gate
- Client asks for **material new scope for free**
- Implementation agreement / payment incomplete
- James has **not** approved a consequential send or change

---

## Phase 0 — Lead / qualification

**Tools:** Calendar / notes · Owner-Ops (lead/opportunity)  
**Client-facing:** Intro call only — **no free diagnostic consulting**

- [ ] Target-fit service business
- [ ] Owner / decision-maker involved
- [ ] Material process problem exists
- [ ] Willing to discuss real workflows / show work
- [ ] Understands Blueprint is **paid** ($3,500)
- [ ] Blueprint is the appropriate next step

**Output:** `Blueprint Qualified` **or** `Not Ready / Not Fit`  
See also: commercial-gate checklist §A · roadmap lead→intro section

---

## Phase 1 — Commercial gate

**SoR:** PandaDoc (sign) · Stripe (pay) · Owner-Ops (checkpoint record)  
**Hard stop:** No questionnaire and no Stage A until **both** signature and payment are complete.

Summarized required path (full detail → [BLUEPRINT_COMMERCIAL_GATE_CHECKLIST.md](./BLUEPRINT_COMMERCIAL_GATE_CHECKLIST.md)):

1. Prepare / send Blueprint agreement (PandaDoc) — James review before send  
2. Confirm **SIGNED**  
3. Draft / send Stripe invoice **$3,500** — James dual-approval before send  
4. Confirm **PAID IN FULL**  
5. Record commercial checkpoint in Owner-Ops (refs to PandaDoc + Stripe)

**Exception:** James approval only + recorded in Owner-Ops. Do not invent deposit defaults.

---

## Phase 2 — Questionnaire

**Tool:** Owner-Ops  
**Hard stop:** Do not run Stage A from incomplete intake unless James records why evidence is sufficient.

- [ ] Client / contact / opportunity correct
- [ ] Commercial checkpoint verified (PandaDoc + Stripe, not Owner-Ops alone)
- [ ] Secure invitation created; recipient reviewed
- [ ] Send invitation (James approve send)
- [ ] Support save/resume as needed
- [ ] Confirm **SUBMITTED**
- [ ] Review completed intake
- [ ] Evidence upload: manual fallback OK for first clients

Ops pilot send controls (when live prod invite): see [production-readiness/pilot-operating-checklist.md](./production-readiness/pilot-operating-checklist.md) — **KEEP SEPARATE**; do not merge into this lifecycle doc.

---

## Phase 3 — Stage A

**Tool:** ChatGPT · `@peacemakers-blueprint-advisor` · `blueprint-advisor-0.1.2`  
**Input:** Submitted questionnaire (+ any available artifacts)  
**Output:** Stage A — Questionnaire Diagnostic  
**Client-facing after review:** Minimum evidence request / call prep only  
**See:** skill `references/stage-a.md` · OS evidence/consulting standards

### James review

- [ ] Client claims appropriately classified (not promoted to verified without support)
- [ ] No unsupported root causes
- [ ] No premature recommendations
- [ ] Evidence gaps identified
- [ ] Priority processes identified
- [ ] 90-minute agenda useful
- [ ] No vendor / AI / ROI / quote / timeline overreach

- [ ] **Persist/save Stage A** (engagement folder / Owner-Ops note + file)
- [ ] Prepare / send minimum evidence request

---

## Phase 4 — Blueprint call

**Target:** ~90 minutes · **Facilitator:** James  
**Input:** Approved Stage A agenda · evidence request  
**Output:** Transcript/notes + evidence references

### Before

- [ ] Right stakeholders attending
- [ ] Stage A reviewed
- [ ] Evidence request reviewed; screen-share artifacts ready
- [ ] Transcript / notes method ready

### During

- [ ] Validate actual workflow (normal vs exception)
- [ ] Clarify owner / authority / source of truth
- [ ] Distinguish policy vs practice; identify controls
- [ ] Capture unresolved conflicts and supporting evidence
- [ ] **Do not design implementation** in the meeting

### After

- [ ] Retain transcript/notes
- [ ] Retain evidence references
- [ ] Record unresolved questions
- [ ] Prepare Stage B input pack

---

## Phase 5 — Stage B

**Tool:** ChatGPT · same Advisor skill · **Stage B only**  
**Input:** Questionnaire + transcript/notes + supporting evidence  
**Output:** Stage B — Evidence-Reconciled analysis (Proposed recommendations)  
**Client-facing:** No — translate later into client Blueprint  
**See:** skill `references/stage-b.md`

### James review

**Evidence**

- [ ] OBSERVED vs CLIENT_REPORTED separated
- [ ] Contradictions and unknowns explicit
- [ ] Small samples not over-generalized

**Analysis**

- [ ] Root cause before solution; controls preserved
- [ ] Lean waste only where supported

**Recommendation**

- [ ] Process/policy first; current tools before new software
- [ ] Configuration before integration; deterministic automation before AI
- [ ] AI gated; new software gated

**Commercial**

- [ ] Recommendations remain **Proposed**
- [ ] No Stage C leakage, implementation quote, detailed technical design, or unsupported ROI/timeline

- [ ] **Persist/save Stage B**

---

## Phase 6 — Client Blueprint

**Templates:** [deliverables/](./deliverables/) (HTML preferred → Print PDF)  
**Source:** James-approved Stage B (plain language; not raw evidence dump)  
**Internal companion:** `ai-opportunity-blueprint-internal-plan-template.md` — **do not send by default**

### Required structure

1. Executive summary  
2. Engagement scope  
3. Priority workflow findings  
4. Root causes  
5. Controls to preserve  
6. Recommended action plan — **Now / Next / Later·conditional / Not currently justified**  
7. Current technology position  
8. Measurement  
9. Leadership decisions needed  
10. Recommended next step  

### Pre-send review

- [ ] Supported findings; unresolved stays unresolved
- [ ] No Stage C / free detailed design / fixed impl timeline / unsupported ROI / unsupported vendor claims
- [ ] Plain language; professional PDF; correct name/date; no internal notes; no leftover placeholders
- [ ] James approves send / present

---

## Phase 7 — Client decision

**Tool:** Review meeting (~45–60 min) · Owner-Ops activity/note

| Outcome | Record | Then |
|---------|--------|------|
| **A — No further action** | Blueprint complete | Close |
| **B — Client implements internally** | Blueprint complete | Clarifications OK within sold scope; **no free implementation consulting** |
| **C — Requests Peacemakers implementation** | `Implementation Interest` | Client selects ≥1 **Proposed** item → Phase 8 |

### Clarification vs new scope

| Included clarification | Likely new paid scope |
|------------------------|------------------------|
| Explain a finding already in the Blueprint | Analyze an entirely new workflow |
| Clarify why a recommendation was made | Detailed integration / architecture / WBS |
| Clarify a measurement definition | Extended vendor investigation |
| Correct a factual error | Additional deep discovery / impl design |

**Rule:** If it materially expands analysis/design beyond the sold Blueprint → stop and commercialize.

---

## Phase 8 — Stage C gate

**May begin only if:** Blueprint delivered · Implementation Interest · client selected Proposed recommendation(s) · James approves advancing candidates  

**Purpose:** Bounded scope + commercial inputs for a credible implementation offer  
**Tool:** ChatGPT Advisor Stage C (after gate) · Owner-Ops notes  
**See:** skill `references/stage-c.md` · roadmap OD-MR-02

**Allowed (bounded):** objective, selected items, boundaries, assumptions, exclusions, dependencies, major work packages, supported effort/range, commercial inputs, proposed price, acceptance concept  

**Not free:** exhaustive WBS, detailed architecture, full configuration/integration/migration design, extended vendor investigation  

If detailed scoping itself is material → sell separate paid discovery/scoping.

---

## Phase 9 — Implementation commercial gate

**Hard stop:** No implementation until:

- [ ] Implementation scope approved
- [ ] PandaDoc implementation agreement **signed**
- [ ] Stripe payment completed per agreement
- [ ] James confirms implementation gate in Owner-Ops

Then Stage D / build may begin. Dual-approval rules for send still apply.

---

## Phase 10 — Stage D / outcome review

**See:** skill `references/stage-d.md` · OS control/measurement standards

- [ ] Implement **only** approved scope
- [ ] Preserve controls; test before consequential changes
- [ ] Train users; establish measurements; record exceptions
- [ ] Compare results to baseline; document outcome; close/transition
- [ ] No invented benefits
- [ ] Optional Advisory only after justified recurring need

---

## Completed Blueprint — artifact checklist

For every finished paid Blueprint, these should exist (or a recorded exception):

- [ ] Signed Blueprint agreement (PandaDoc)
- [ ] Paid Stripe invoice ($3,500)
- [ ] Owner-Ops commercial checkpoint
- [ ] Submitted questionnaire
- [ ] Stage A (saved)
- [ ] Evidence request / references
- [ ] Call transcript / notes
- [ ] Stage B (saved)
- [ ] James-approved client Blueprint (HTML)
- [ ] Final PDF
- [ ] Delivery / review record
- [ ] Client decision (A / B / C)
- [ ] Implementation-interest record if Outcome C

---

## Related (KEEP SEPARATE)

| Doc | Role |
|-----|------|
| [BLUEPRINT_COMMERCIAL_GATE_CHECKLIST.md](./BLUEPRINT_COMMERCIAL_GATE_CHECKLIST.md) | Full Phase 1 operating detail |
| [production-readiness/pilot-operating-checklist.md](./production-readiness/pilot-operating-checklist.md) | Live questionnaire invite tech controls |
| [production-readiness/deployment-runbook.md](./production-readiness/deployment-runbook.md) | Deploy/rollback — not client lifecycle |
| [deliverables/ai-opportunity-blueprint-internal-plan-template.md](./deliverables/ai-opportunity-blueprint-internal-plan-template.md) | Owner-only post-selection companion |
