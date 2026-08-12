# Stage B — Evidence-Reconciled Blueprint Analysis

## Purpose

Reconcile the questionnaire, 90-minute Blueprint transcript, James's notes, and supporting artifacts into an owner-reviewable current-state diagnosis and practical recommendation set. Keep every recommendation **Proposed** until James decides. Aligns with Stage B in [CONSULTING_STANDARD.md](../../docs/peacemakers-operating-system/CONSULTING_STANDARD.md).

## Minimum inputs

- Stage A questionnaire or diagnostic.
- Blueprint-call transcript or sufficiently complete notes.
- James's notes, if separate.
- Available process and system evidence.

If transcript coverage is materially incomplete, identify the missing segment and continue only with conditional findings.

## Output contract

Begin with `Stage B — Evidence-Reconciled Blueprint Analysis` and produce:

1. **Decision gate** — choose `Sufficient for owner review`, `Conditional Blueprint`, or `Return to discovery`.
2. **Executive diagnostic** — state the verified business problem, why it matters, the simplest likely improvement direction, and the most important unresolved risk without overselling.
3. **Reconciled evidence register** — combine sources using OS evidence classes; identify corroboration; resolve or display CONTRADICTED items. Give precedence by authority and recency, not by repetition.
4. **Current-state process analysis** — describe the relevant SIPOC or flow, handoffs, queues, rework, controls, failure points, measures, and observed waste. Distinguish symptoms from root-cause findings. Follow [PROCESS_IMPROVEMENT_STANDARD.md](../../docs/peacemakers-operating-system/PROCESS_IMPROVEMENT_STANDARD.md).
5. **Root-cause and requirement register** — establish root cause before Improve. Link each verified or conditional cause to the business requirement, affected stakeholder, measure, evidence IDs, and confidence.
6. **Current-environment capability matrix** — evaluate people, policy, training, adoption, subscriptions, editions, configuration, reports, data, security, integrations, and support. Label undemonstrated vendor capabilities `Verification pending`. Use authoritative vendor documentation for material capability claims.
7. **Recommendation portfolio** — apply the canonical OS intervention ladder (0–9). Prefer process/training/configuration (levels 1–4) and current-tool integration (level 5) before deterministic automation (level 6), AI (levels 7–8), or new software (level 9). For each recommendation, use the full Recommendation Contract from the decision framework, explain why lower levels are insufficient when applicable, and assign `Now`, `Pilot`, `Later`, `Monitor`, or `Do not pursue`.
8. **AI and new-software gate results** — include only if considered. Show OS AI gate outcome, autonomy class (A0–A5), evidence, and required controls. A failed or incomplete gate results in validation work or no recommendation, not a forced tool selection. Flag observability/security requirements when recommending AI; do not implement them here.
9. **Measurement and control outline** — define KPI names, operational definitions, source, owner, collection method, and baseline need. Record validated baselines only where evidence supports them. Leave baseline or target blank when unverified. Align with [CONTROL_PLAN_STANDARD.md](../../docs/peacemakers-operating-system/CONTROL_PLAN_STANDARD.md).
10. **Risks and dependencies** — identify operational, adoption, data, integration, security/privacy, vendor, compliance, and change risks proportionately.
11. **Owner decision register** — present each recommendation for James to mark Approved, Revise, Reject, or Defer. Identify the evidence or decision needed before Stage C. Proposed ≠ Approved.
12. **Client-ready boundary** — distinguish what can enter an owner-ready Blueprint from internal assumptions, pricing logic, unresolved vendor research, and sensitive notes.

## Guardrails

- Do not convert the entire questionnaire into a generic software wish list.
- Do not select a product solely because the client recognizes its name or a competitor uses it.
- Do not replace a working core system for a configuration, training, data, ownership, reporting, or supported-integration problem.
- Do not expand into free Stage C scope/WBS/commercial quoting. Stage C requires James-approved candidates and quote-readiness.
- Do not state exact savings, ROI, effort, delivery date, or price unless directly calculated from verified inputs; label any permitted Stage B range non-binding.
- Do not produce an implementation proposal or send client communication.
- Assess deterministic automation before AI; assess current tools before new software.
