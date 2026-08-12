# Peacemakers Master Implementation Roadmap

**Status:** `OWNER APPROVED — EXECUTION AUTHORIZED`  
**Approval date:** `2026-08-12`  
**Note:** Approval authorizes sequenced execution of roadmap items. It does **not** mean roadmap items are already implemented.

**Canonical methodology:** Peacemakers OS `pm-os-0.1.0`  
**Canonical advisory playbook:** Blueprint Advisor `blueprint-advisor-0.1.2` (operationally validated for controlled first-client use)  
**Authority rule:** Prefer REUSE → CONSOLIDATE → EXTEND over new frameworks, entities, vendors, or documents.

---

## 1. Purpose

Stop fragmented Peacemakers workstreams and establish **one** prioritized implementation sequence for:

- client acquisition through paid Blueprint delivery;
- paid implementation scoping and delivery;
- optional advisory (downstream, not first-client-required);
- Owner-Ops as engagement system of record;
- commercial tooling (PandaDoc + Stripe);
- website/marketing alignment;
- deferred technical work (RAG, MCP, agents, observability) with explicit triggers.

This roadmap reconciles existing assets. It does **not** redesign the OS or Blueprint Advisor methodology.

**Related docs (do not duplicate):**

| Doc | Role after this roadmap |
|-----|-------------------------|
| `docs/peacemakers-operating-system/*` | Canonical methodology |
| `skills/peacemakers-blueprint-advisor/` | Stage A–D execution playbook |
| `docs/peacemakers-operating-system/IMPLEMENTATION_BACKLOG.md` | Deferred AI/runtime/governance tech backlog — **subordinate** to this master sequence |
| `docs/deliverables/*` | Client Blueprint templates |
| `docs/future-*.md` | Preserved contracts/philosophy — not competing roadmaps |
| `docs/production-readiness/*`, acceptance audits | Ops readiness evidence — inputs, not alternate strategies |

---

## 2. Canonical Architecture

```text
Peacemakers OS (pm-os-0.1.0)
  → methodology, evidence, ladder, AI gate, approvals, control standards
  → developed / versioned / governed in Cursor / Git

Blueprint Advisor (blueprint-advisor-0.1.2)
  → Stage A–D advisory execution playbook
  → developed / versioned / packaged / governed in Cursor / Git
  → executed for client analysis in ChatGPT (normal operating surface)

Owner-Ops
  → engagement workflow / system of record
    (CRM, questionnaire, evidence, process graphs, review packet, pipeline, statuses)

PandaDoc
  → agreements / signatures

Stripe (+ billing/ scripts & invoice skills)
  → invoices / payment (draft → dual-approved send)

Website (peacemakers-ai)
  → marketing / acquisition (Formspree, Calendly, scorecard, offer pages)

Future retrieval / AI infrastructure
  → only when a justified, gated use case exists (RAG, MCP, LLM runtime, OTel vendors)
```

**Operating surfaces (OD-MR-04 — APPROVED):**

| Surface | Responsibility |
|---------|----------------|
| **ChatGPT** | Execute the installed/versioned Blueprint Advisor for Stage A–D analysis |
| **Cursor / Git** | Develop, version, validate, package, and govern the Blueprint Advisor and Peacemakers OS |
| **Owner-Ops** | System of record for client/engagement/workflow/evidence/findings/processes/statuses and related artifacts |

Do **not** treat Cursor as the normal client-analysis execution surface.

**BookDirect** remains a **KEEP SEPARATE** product line (shared brand/billing catalog only).

---

## 3. Owner Decisions (APPROVED 2026-08-12)

### OD-MR-01 — Blueprint payment gate — APPROVED

Standard Blueprint commercial sequence:

1. Blueprint qualified  
2. Blueprint agreement prepared  
3. James reviews  
4. PandaDoc sent  
5. Agreement signed  
6. Stripe invoice / payment  
7. Payment confirmed  
8. Questionnaire invitation released  

**Standard Blueprint price (current):** `$3,500`

**Rule:** Stage A does **not** begin before both agreement and payment are complete.

Any exception requires **explicit James approval** and must be **recorded as an exception**. Do not invent deposit terms.

### OD-MR-02 — Stage C commercial boundary — APPROVED

Stage C begins only after the client selects one or more **Proposed** Stage B recommendations for possible implementation.

Stage C is a **bounded** internal/commercial scoping activity used to create a credible implementation offer.

Stage C **may** determine:

- implementation objective;
- included recommendation(s);
- assumptions;
- exclusions;
- dependencies;
- major work packages;
- effort/range where supportable;
- commercial inputs;
- proposed implementation price;
- acceptance concept.

Stage C must **NOT** silently expand into unpaid:

- detailed technical design;
- system configuration design;
- full integration architecture;
- exhaustive WBS;
- migration design;
- security architecture;
- extensive vendor research;
- implementation execution.

Detailed design belongs **after** implementation agreement/payment unless James explicitly approves a **separate paid discovery/scoping engagement**.

### OD-MR-03 — Website claim alignment — APPROVED

**Required before the next public Blueprint sale:** narrow messaging correction pass only.

Must address claims implying:

- guaranteed ROI;
- unsupported savings;
- fixed 30/60/90 implementation outcomes;
- implementation estimates as an automatic Blueprint inclusion;
- AI-first positioning inconsistent with the Peacemakers OS.

Desired positioning:

- understand first;
- improve the process first;
- use current tools first;
- automate only when justified;
- use AI only where it adds value safely;
- provide evidence-backed recommendations;
- implementation is a separate approved engagement.

Website redesign is **out of scope** for roadmap finalization; the claim-correction pass is a separate P0 workstream when executed.

### OD-MR-04 — Stage A/B execution environment — APPROVED

See §2 operating surfaces. ChatGPT executes analysis; Cursor/Git governs methodology and skill; Owner-Ops is SoR.

### OD-MR-05 — Advisory — APPROVED

Advisory remains an available downstream service but is **not required** in the initial first-client operating lifecycle.

Primary lifecycle to validate first:

**Blueprint → Implementation → Outcome Review**

Advisory may be offered afterward when recurring governance, optimization, measurement, or improvement work is justified.

Do **not** build new advisory infrastructure now.

### OD-MR-06 — Pipeline semantics — APPROVED

The pipeline must distinguish:

- Blueprint sale;
- Blueprint active;
- Blueprint delivered;
- implementation interest;
- implementation proposal/scoping;
- implementation agreement/payment;
- implementation active;
- outcome review.

Do **not** perform a CRM rebuild now.

Use the smallest existing-status extension or terminology correction when implementation of this item begins.

**Priority:** P1 unless the current pipeline creates a real first-client operational blocker (then elevate only that blocker).

---

## 4. Current-State Inventory

### A. Client acquisition / sales

| Capability | State |
|------------|-------|
| Website lead forms (Formspree) | Existing |
| Calendly intro scheduling | Partial (external; CRM Meeting model exists) |
| Owner-Ops CRM (Company/Contact/Opportunity) | Existing |
| Pipeline stages + checklists | Existing (semantics need Blueprint vs Implementation distinction — OD-MR-06) |
| Marketing lead → Owner-Ops sync | Missing (manual handoff; OK for first clients) |
| Opportunity / proposed services | Existing |

### B. Questionnaire / intake

| Capability | State |
|------------|-------|
| Secure invite links + privacy gate | Existing |
| Business Blueprint preparation form | Existing |
| Save-and-resume drafts | Existing |
| Client process builder | Existing |
| Evidence / file upload | Partial (durable storage deferred; redacted email OK first) |
| Post-submit client portal | Missing / not needed first |

### C. Blueprint workflow

| Capability | State |
|------------|-------|
| Stage A/B playbook (Advisor `0.1.2`) | Existing (ChatGPT execution; smoke validated) |
| Review packet (evidence-only) | Existing |
| BlueprintMeeting + findings/conflicts | Existing |
| Sold Blueprint HTML/PDF templates | Existing (manual fill) |
| Auto Blueprint generator | Deferred |

### D. Implementation lifecycle

| Capability | State |
|------------|-------|
| ImprovementOpportunity model | Existing |
| Stage C playbook + OD-MR-02 boundary | Existing (method); commercial policy approved |
| WBS / Project UI | Partial / defer deep productization |
| Stage D / ControlPlan productization | Deferred |
| Outcome review loop | Missing as product; procedure is P1 |

### E. Commercial lifecycle

| Capability | State |
|------------|-------|
| Stripe catalog (Blueprint $3,500; impl custom-quote) | Existing (`billing/`) |
| Draft Stripe / PandaDoc skills | Existing (outside Owner-Ops app) |
| Owner-Ops Proposal/Agreement/Payment UI | Partial schema; defer UI |
| Payment-before-questionnaire gate | APPROVED as process rule (OD-MR-01); must be verified operationally |

### F–J. Other

| Area | State |
|------|-------|
| Invite/reminder email | Existing |
| ProcessMetric | Existing |
| RAG / MCP / agents / OTel / DecisionRecord / ControlPlan / generator | Deferred |
| Advisory packaging | Available later (OD-MR-05); no infra now |

---

## 5. Anti-Duplication Decisions

| Item | Decision |
|------|----------|
| Peacemakers OS | REUSE |
| Blueprint Advisor skill | REUSE (ChatGPT execute; Cursor govern) |
| This master roadmap | Canonical client-lifecycle sequence |
| `IMPLEMENTATION_BACKLOG.md` | KEEP SEPARATE (subordinate AI/runtime backlog) |
| Review Packet vs sold Blueprint | KEEP SEPARATE |
| BookDirect | KEEP SEPARATE |
| billing/ Stripe+PandaDoc | REUSE / EXTEND as commercial ops (no rebuild in Owner-Ops for first clients) |
| Owner-Ops commercial UI | DEFER |
| DecisionRecord / ControlPlan / generator / RAG / MCP / agents | DEFER |
| Marketing CRM + Owner-Ops | Manual consolidate into Owner-Ops SoR first |
| Website claim language | CONSOLIDATE / ALIGN (narrow pass — OD-MR-03) |

---

## 6. Canonical Client Lifecycle (APPROVED)

```text
Lead
→ Intro / qualification
→ Blueprint agreement                          [APPROVAL GATE: James reviews agreement]
→ Blueprint payment ($3,500)                   [PAYMENT GATE: Stripe paid]
→ Questionnaire invitation released            [GATE: agreement + payment complete]
→ Questionnaire completion
→ Stage A                                      [PAID Blueprint; not before payment gate]
→ Evidence preparation
→ 90-minute Blueprint call
→ Stage B                                      [PAID Blueprint; recommendations = Proposed]
→ James review                                 [APPROVAL GATE: client deliverable]
→ Client Blueprint delivery / review
→ Client implementation interest               [optional]
→ Candidate selection (from Proposed Stage B)
→ Bounded Stage C                              [NOT automatic Blueprint scope]
→ Implementation agreement                     [APPROVAL GATE: James reviews]
→ Implementation payment                       [PAYMENT GATE]
→ Stage D / implementation
→ Acceptance / outcome review
→ Optional advisory                            [separate; not first-client-required]
```

### Stage detail (gates labeled)

#### Lead → Intro / qualification
- **Payment:** Free / pre-sale  
- **Exit:** Blueprint opportunity identified or nurture/lost  

#### Blueprint agreement
- **Trigger:** Blueprint qualified  
- **System:** PandaDoc  
- **Approval gate:** James reviews before send  
- **Exit:** Agreement signed  

#### Blueprint payment
- **Trigger:** Signed agreement  
- **System:** Stripe invoice @ **$3,500**  
- **Payment gate:** Payment confirmed  
- **Exit:** Paid  

#### Questionnaire
- **Trigger:** Agreement **and** payment complete (OD-MR-01)  
- **System:** Owner-Ops FormInvitation  
- **Exception:** Only with explicit James approval, recorded  

#### Stage A → Evidence prep → Blueprint call → Stage B
- **Payment:** Included in paid Blueprint  
- **Execution:** ChatGPT + Blueprint Advisor `0.1.2`  
- **SoR:** Owner-Ops for artifacts/statuses  
- **Forbidden before pay gate:** Stage A start  
- **Forbidden in Blueprint:** unpaid Stage C expansion, fabricated ROI, implementation execution  

#### James review → Client Blueprint delivery
- **Approval gate:** James approves client-facing deliverable  
- **Artifact:** Manual HTML/PDF Blueprint template  
- **Rule:** Proposed ≠ Approved  

#### Implementation interest → Candidate selection → Bounded Stage C
- **Trigger:** Client selects Proposed recommendation(s)  
- **Commercial:** Bounded scoping per OD-MR-02  
- **Not** automatic Blueprint inclusion  

#### Implementation agreement → payment → Stage D → outcome review
- **Approval + payment gates** before implementation work  
- **Stage D:** implementation / post-implementation control work  

#### Optional advisory
- Downstream only (OD-MR-05)  

---

## 7. Free / Paid Boundaries (APPROVED)

### Free / pre-sale
Website education, scorecard (if retained), intro call, high-level qualification.

### Paid Blueprint — $3,500
Questionnaire (after pay gate), Stage A, evidence coordination, 90-minute call, Stage B, James-approved client Blueprint deliverable, optional deliverable review walkthrough.

**Not included:** Stage C by default; detailed technical design; implementation build; Stage D; fabricated ROI/savings; fixed implementation outcomes.

### Bounded Stage C
After candidate selection; creates credible implementation offer only; no silent unpaid deep design (OD-MR-02).

### Paid Implementation
Agreement + payment → Stage D kickoff → delivery → acceptance → outcome review.

### Advisory
Optional separate paid engagement after primary lifecycle validation.

---

## 8. First-Client Scope Protection Rules (APPROVED)

1. **No Stage A before paid Blueprint gate** (agreement + payment complete).  
2. **Stage B is part of paid Blueprint.**  
3. **Stage C is not automatically part of Blueprint.**  
4. **Detailed technical design is not free proposal work.**  
5. **Proposed ≠ Approved.**  
6. **No implementation work before agreement/payment.**  
7. **Stage D is implementation / post-implementation work.**  
8. **Any scope exception requires James approval.**  
9. **Record exceptions** instead of silently absorbing them.  

---

## 9. Anti-Overengineering Rule (APPROVED)

For the first **1–3 paying clients**, manual / operator-assisted execution is preferred when it is secure, reliable, and low burden.

Do **not** automate a workflow merely because it can be automated.

Automation should follow demonstrated:

- repetition;
- stable inputs;
- stable decisions;
- clear owner;
- measurable burden;
- acceptable exception handling.

---

## 10. First-Client Readiness

### P0 — before next paying Blueprint

Keep this list small. Only true blockers:

1. Verify Blueprint **PandaDoc** agreement path.  
2. Verify **Stripe** Blueprint invoice/payment path ($3,500).  
3. Verify **agreement + payment gate before questionnaire** (OD-MR-01).  
4. Verify questionnaire invitation / save-resume / submission.  
5. Verify `blueprint-advisor-0.1.2` operational path in **ChatGPT**.  
6. Verify manual client-ready Blueprint deliverable + James approval.  
7. Correct materially misleading **website claims** if currently public (OD-MR-03 narrow pass only).  

### CAN BE MANUAL FOR FIRST 1–3 CLIENTS

Lead→CRM entry, Calendly, agreement/invoice send (with dual approval), Stage A/B in ChatGPT, evidence chase, transcript paste, HTML Blueprint fill, implementation interest notes, bounded Stage C when needed, implementation tracking via NextAction/Activity.

### P1 — first 1–3 engagements

- Owner operating runbook  
- Pipeline terminology / semantics (OD-MR-06; smallest extension)  
- Stage C commercial workflow (apply OD-MR-02)  
- Client Blueprint template refinement (claim-safe Stage B outline)  
- Evidence follow-up workflow  
- Outcome-review procedure  

### P2 — after repeatability is demonstrated

- Selective document generation  
- Commercial-status convenience UI  
- Stable repetitive workflow automation  
- Stronger metric / outcome productization  

### DEFER (until trigger)

- RAG / embeddings / pgvector  
- MCP  
- Agents / LLM runtime  
- Observability vendors  
- DecisionRecord schema  
- ControlPlan schema  
- Automated Blueprint generator  
- Large RBAC work  
- New software without demonstrated need  
- Advisory infrastructure  

---

## 11. Implementation Backlog (post-approval)

### MR-P0-01 — Verify Blueprint PandaDoc agreement path
- **Priority:** P0  
- **First-client blocker:** Yes  
- **Action:** Confirm draft → James review → send → signature path for Blueprint agreement  
- **Do not build new integration in this item** — verify existing billing/PandaDoc path  

### MR-P0-02 — Verify Stripe Blueprint invoice/payment path
- **Priority:** P0  
- **First-client blocker:** Yes  
- **Action:** Confirm $3,500 Blueprint invoice draft → dual-approved send → payment confirmation  

### MR-P0-03 — Enforce agreement + payment before questionnaire
- **Priority:** P0  
- **First-client blocker:** Yes  
- **Action:** Operating checklist + Owner-Ops note/Activity proof of signed+paid before invite; record exceptions  

### MR-P0-04 — Verify questionnaire invite / save-resume / submit
- **Priority:** P0  
- **First-client blocker:** Yes  
- **Action:** Supervised verification of existing Owner-Ops flow  

### MR-P0-05 — Verify ChatGPT Advisor `0.1.2`
- **Priority:** P0  
- **First-client blocker:** Yes  
- **Action:** Confirm installed skill matches committed `blueprint-advisor-0.1.2`  

### MR-P0-06 — Verify manual Blueprint deliverable + James approval
- **Priority:** P0  
- **First-client blocker:** Yes  
- **Action:** Confirm HTML → PDF → approve → deliver path using existing templates  

### MR-P0-07 — Narrow website claim correction
- **Priority:** P0  
- **First-client blocker:** Yes if public pages still overclaim  
- **Action:** Messaging-only pass per OD-MR-03; no redesign  

### MR-P1-01 — Owner operating runbook
- **Priority:** P1  
- **Action:** One checklist linking OS, skill, billing, templates, gates  

### MR-P1-02 — Pipeline semantics (Blueprint vs Implementation)
- **Priority:** P1 (unless operationally blocking)  
- **Action:** Smallest terminology/status extension per OD-MR-06; no CRM rebuild  

### MR-P1-03 — Stage C commercial workflow
- **Priority:** P1  
- **Action:** Apply OD-MR-02 on opportunities; no unpaid deep design  

### MR-P1-04 — Client Blueprint template refinement
- **Priority:** P1  
- **Action:** Temper ROI / fixed 30-60-90 / impl-estimate sections to Stage B-safe language  

### MR-P1-05 — Evidence follow-up workflow
- **Priority:** P1  
- **Action:** SOP for Stage A requests → client artifacts → Owner-Ops evidence  

### MR-P1-06 — Outcome-review procedure
- **Priority:** P1  
- **Action:** Manual procedure after implementation; use ProcessMetric/notes  

### MR-P2-* — Convenience after repeatability
Document generation, commercial-status UI, selective automation, stronger outcome productization.

### MR-DEFER-* — Technology deferrals
RAG, MCP, agents, LLM runtime, obs vendors, DecisionRecord, ControlPlan, generator, large RBAC — triggers unchanged from prior roadmap (§16 equivalent): only when burden/accuracy/security gates justify.

---

## 12. Prioritized Roadmap Summary

### ALREADY EXISTS
OS `pm-os-0.1.0`; Advisor `0.1.2`; Owner-Ops intake/evidence/packet; billing catalog + draft skills; deliverable templates; website acquisition funnel.

### CONSOLIDATE / ALIGN
Website claims (P0); deliverable language (P1); pipeline semantics (P1); subordinate AI backlog to this document.

### IMPLEMENT NEXT (P0 verification / correction)
MR-P0-01 → MR-P0-07 in commercial-path order first (agreement → payment → questionnaire gate), then analysis/deliverable/website claim blockers.

### IMPLEMENT AFTER PILOT (P1 then P2)
Runbook, pipeline semantics, Stage C workflow, template refinement, evidence/outcome procedures; then selective automation.

### DEFERRED UNTIL TRIGGER
RAG, MCP, agents, LLM runtime, obs vendors, DecisionRecord, ControlPlan, generator, large RBAC, advisory infra.

---

## 13. Recommended Execution Sequence

1. **Prove commercial gate (smallest P0 workstream):** Blueprint agreement → signature → Stripe payment → questionnaire release.  
2. Verify questionnaire + ChatGPT Advisor `0.1.2` + manual deliverable approval path.  
3. Complete narrow website claim correction if public pages still overclaim.  
4. Sell/deliver first paid Blueprint under scope-protection rules.  
5. Only after 1–3 Bluesprints: P1 runbook/pipeline/Stage C/template/evidence/outcome polish.  
6. Automate only after demonstrated repetition (anti-overengineering rule).  
7. Keep all deferred tech deferred until triggers fire.

---

## 14. Website / Marketing Follow-Up

OD-MR-03 authorizes a **narrow claim-correction pass** before next public Blueprint sale. No redesign in roadmap finalization. Desired positioning is process/current-tools-first, evidence-backed recommendations, implementation as separate approved engagement.

---

## 15. Measurement / ROI Lifecycle

| Stage | Value measurement |
|-------|-------------------|
| A | Client-reported burden/estimates/outcomes/gaps |
| B | Evidence-backed baselines where available; no unsupported ROI |
| C | Bounded business case + James commercial inputs |
| D | Actual measured results vs expectation |

No separate AI ROI methodology.

---

## 16. Future Technology Triggers

| Tech | Trigger |
|------|---------|
| RAG / pgvector | Recurring retrieval burden or accuracy risk |
| MCP | Stable workflow + permissions + repeated copy/paste cost |
| LLM/agent runtime | Bounded use case passes AI + security + approval + observability gates |
| Observability vendor | Runtime AI/automation exceeds audit/`captureEvent` |
| DecisionRecord / ControlPlan schema | Existing models cannot record required fields |
| Blueprint generator | Manual HTML becomes proven bottleneck |

---

## 17. Explicit Non-Priorities

Do not build now: RAG/MCP/agents/OTel vendors; DecisionRecord/ControlPlan “just in case”; Blueprint generator; Owner-Ops Stripe/PandaDoc deep UI; large RBAC; client portal; ROI engine; second methodology/skill; advisory infrastructure; unpaid Stage C deep-design factory; website redesign beyond claim alignment.

---

## 18. Closed Owner Decisions

OD-MR-01 through OD-MR-06 are **APPROVED** (2026-08-12). No open commercial-order or Stage C policy questions remain for roadmap authority.

Remaining execution choices are operational verifications under P0/P1 — not new methodology decisions.

---

## Document control

- **Status:** OWNER APPROVED — EXECUTION AUTHORIZED (2026-08-12)  
- **Supersedes:** Competing “what to build next” narratives for client-lifecycle sequencing  
- **Does not supersede:** OS standards, Advisor skill contracts, `future-*.md` preserved contracts  
- **Does not claim:** P0–P2 items are implemented merely because this roadmap is approved  
