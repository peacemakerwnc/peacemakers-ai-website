# Consulting Standard

**ID:** `pm-os-consulting` · **Version:** `0.1.0`

## Stages (preserve)

### Stage A — Pre-Call Diagnostic

**Inputs:** submitted questionnaire, derived process graphs, accepted evidence only.  
**Purpose:** understand reported current state; identify processes, gaps, contradictions, unknowns; formulate Blueprint-call questions; judge whether a productive call is possible.  
**Outputs:** provisional findings, call agenda, readiness signal.  
**Forbidden:** final recommendations, fabricated ROI, treating unverified statements as facts.

**Owner Ops today:** FormResponse SUBMITTED → Evidence hub → Blueprint Review Packet (evidence-only).

### Blueprint Call

Validate process reality: exceptions, controls, handoffs, rework, delays, workarounds, system-of-record decisions, contradiction resolution, measurable baselines where possible, “how do you know it’s working?”

**Owner Ops today:** BlueprintMeeting + EvidenceFinding / EvidenceConflict capture.

### Stage B — Reconciled / Validated Analysis

Reconcile questionnaire, call, documents, system evidence, observed workflows, authoritative vendor docs. Classify evidence (see EVIDENCE_STANDARD). Perform root-cause analysis and develop options using assessment lenses + escalation ladder.

**Owner Ops today:** Partial — evidence models exist; structured Stage B decision records are not yet first-class.

### Stage C — Pre-Quote Implementation Planning

Only after sufficient validation: approved future state, scope, dependencies, assumptions, risks, acceptance criteria, ownership, sequencing, environments, integrations, permissions, testing, rollout, support, control plan.  
**Forbidden:** unjustified fixed cost, timeline, savings, or ROI claims.

**Owner Ops today:** Manual Blueprint HTML deliverable + internal plan template; no automated quote engine.

### Stage D — Post-Approval Control / Measurement

Measure result, stability, controls, adoption, exceptions, regressions, baseline comparison, lessons learned, methodology updates.

**Owner Ops today:** Mostly missing as structured product capability (metrics exist on process graphs but not full control plans).

---

## Assessment lenses

Use as structured reasoning — not mechanical checkboxes:

1. Purpose & customer value  
2. Current-state process (documented vs actual)  
3. People  
4. Lean / waste  
5. Six Sigma / variation (DMAIC where appropriate; no fake precision)  
6. Root cause  
7. Data & source of truth  
8. Controls  
9. Current technology  

Details: [PROCESS_IMPROVEMENT_STANDARD.md](./PROCESS_IMPROVEMENT_STANDARD.md), [TECHNOLOGY_DECISION_STANDARD.md](./TECHNOLOGY_DECISION_STANDARD.md).

---

## Client-facing vs consultant-internal

| Client-facing discovery | Consultant-internal analysis |
|-------------------------|------------------------------|
| Outcomes, ownership, systems, volume, frequency, errors, delays, rework, handoffs, approvals, exceptions, source of truth, sensitive data, current automation, impact, how success is known | Lean waste classification, variation analysis, root cause, current-tool capability research, deterministic vs AI suitability, autonomy class, security risks, observability needs, control design, recommendation provenance |

Do **not** overwhelm clients with framework jargon. Protect questionnaire UX.

---

## Final governing test (before recommending)

Answer the 20 questions in the operating system prompt (problem, evidence, root cause, current state, SoT, controls, simplify, current tools, deterministic automation, AI necessity, failure mode, authority, misuse prevention, approvals, reconstructability, quality, business improvement, ownership, drift, success). If unanswered → not ready.
