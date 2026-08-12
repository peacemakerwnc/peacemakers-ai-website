# Decision Framework

Canonical methodology is owned by the Peacemakers Operating System (`pm-os-0.1.0`). This file keeps execution safeguards and stage routing discipline. Do not invent a second ladder, evidence taxonomy, AI gate, or consulting doctrine.

## Evidence discipline

Create an evidence register with stable IDs such as `E-01`. Classify every material input using the **canonical OS evidence classes** from [EVIDENCE_STANDARD.md](../../docs/peacemakers-operating-system/EVIDENCE_STANDARD.md):

| Class | Meaning | Permitted use |
|---|---|---|
| VERIFIED | Confirmed against an authoritative source or direct observation with high confidence | Use as a finding |
| CLIENT_REPORTED | Stated by a client or stakeholder; not independently verified | Use as a client report; seek corroboration when material |
| OBSERVED | Seen in a call, screen-share, or walkthrough | Use as observed evidence; note scope/limitation |
| INFERRED | Logical inference from other evidence | Must remain labeled; do not present as verified fact |
| HYPOTHESIS | Working theory under test | Do not treat as a finding; design discriminating questions/artifacts |
| ASSUMPTION | Taken as true for planning | Make the conclusion conditional; keep visible |
| CONTRADICTED | Conflicts with other evidence | Reconcile or leave open before relying on either source |
| UNKNOWN | Material information is absent | Request only if it can change the decision |

Record the source, date, relevant excerpt or fact, scope, class, and any limitation. Cite evidence IDs next to material findings and recommendations.

**Hard rules**

- Never promote CLIENT_REPORTED → VERIFIED without new supporting evidence.
- Do not elevate repeated claims into verified facts.
- Conflicts remain open until resolved with rationale.
- Client-facing prose may use plain language, but the register and internal reasoning must use the OS classes above.

Use confidence labels without invented percentages:

- High: current direct evidence covers the critical claim and relevant configuration.
- Medium: evidence is credible but one material dependency remains.
- Low: the conclusion relies mainly on reports, samples, assumptions, or unresolved conflicts.

## Source-of-truth hierarchy

Use the most authoritative source available for the claim:

1. Observed client workflow, system export, configuration screen, report, log, contract, license record, policy, or approved procedure.
2. Current official vendor product, plan, administrator, security, API, integration, pricing, status, or release documentation.
3. Current official documentation from both parties to a supported integration.
4. Applicable primary law, regulation, standard, or regulator guidance when relevant.
5. Reputable implementation guidance or independent technical analysis, labeled secondary.
6. Community posts, reviews, comparison sites, affiliate content, and search snippets only for discovery; never as sole support for a material capability, security, price, or scope claim.

Record the plan or edition, version, region, date accessed, and configuration assumptions when they affect capability. Verify pricing at Stage C immediately before commercial use. Treat undocumented behavior and sales claims as unverified until demonstrated or supported in writing.

Follow [future-current-software-research-contract.md](../../docs/future-current-software-research-contract.md) for time-sensitive capability claims.

## DMAIC depth by stage

Detailed Lean / Six Sigma usage: [PROCESS_IMPROVEMENT_STANDARD.md](../../docs/peacemakers-operating-system/PROCESS_IMPROVEMENT_STANDARD.md). Stage boundaries: [CONSULTING_STANDARD.md](../../docs/peacemakers-operating-system/CONSULTING_STANDARD.md).

| Stage | Apply |
|---|---|
| A | Define the outcome and stakeholders; design the minimum Measure plan; record HYPOTHESIS items without diagnosing root cause |
| B | Reconcile Define and Measure evidence; Analyze root causes; propose bounded Improve options; outline Control needs |
| C | Translate approved Improve candidates into a verified delivery scope, estimate, acceptance plan, and commercial readiness gate |
| D | Establish Measure baselines, deploy the approved Improve design, and operate Control through training, ownership, monitoring, and response rules |

Use SIPOC, process walk-throughs, value/non-value distinction, handoff analysis, failure modes, bottlenecks, rework, delay, overprocessing, motion, excess work in progress, defects, and unused capability only where evidence supports them. Do not force statistical analysis onto qualitative or insufficient data. Do not call correlation a root cause.

## Intervention ladder (canonical OS 0–9)

**Authoritative ladder:** [TECHNOLOGY_DECISION_STANDARD.md](../../docs/peacemakers-operating-system/TECHNOLOGY_DECISION_STANDARD.md) and [future-recommendation-philosophy.md](../../docs/future-recommendation-philosophy.md).

Evaluate levels **in order** and stop at the lowest sufficient intervention:

| Level | Action |
|---|---|
| 0 | Stop doing it (safe elimination), or monitor/accept the condition when appropriate |
| 1 | Simplify — including clarifying outcome, policy, owner, decision rights, service level, or definition |
| 2 | Standardize process, data, templates, naming, intake, or documentation |
| 3 | Train, coach, enforce, or improve adoption of an existing practice |
| 4 | Configure native capabilities, permissions, reports, dashboards, alerts, templates, workflows, or data cleanup already supported by a current tool and plan |
| 5 | Integrate current technology — supported native integrations between current tools |
| 6 | Deterministic automation — rules-based automation with explicit inputs, logic, exceptions, auditability, and fallback |
| 7 | AI-assisted workflow (human in the loop) — only after the AI gate passes |
| 8 | Bounded AI agent (controls required) — only after the AI gate passes; prefer A1–A3 autonomy |
| 9 | New/additional software — including point solutions or core-system replacement only when the incumbent cannot reasonably meet the verified need |

**Procedural nuances retained from prior Blueprint practice (not a second ladder):**

- For every recommendation at level 4+, document why lower levels are insufficient.
- Evaluate unused subscriptions and supported features before adding spend.
- Core-system replacement is a severe form of level 9: compare migration risk, data conversion, adoption, security, integrations, lock-in, and total cost before recommending it.
- Recommend only what James can personally implement, support, maintain, and explain.

Do **not** use or cite a competing 0–10 numbered ladder.

## AI appropriateness safeguard

Before recommending AI (levels 7–8), apply the full gate and autonomy classes in [AI_GOVERNANCE_STANDARD.md](../../docs/peacemakers-operating-system/AI_GOVERNANCE_STANDARD.md).

Concise execution check — all must hold or the recommendation is PROVISIONAL / NOT READY:

- A verified business problem and measurable decision metric exist.
- Simpler process, native configuration, integration, or deterministic logic (levels 0–6) is insufficient.
- The task needs probabilistic assistance (unstructured content, ambiguity, classification, extraction, drafting, prediction, or similar).
- Representative data and permission to use it are available or can be obtained safely.
- Error tolerance, human review, exception routing, audit trail, privacy, security, retention, and fallback are defined in proportion to risk.
- A justified autonomy class is assigned (prefer A1–A3; A5 is not permitted without architecture review, risk assessment, controls, and owner approval).
- A bounded pilot can compare baseline and result using agreed success and stop criteria.
- Ongoing monitoring, model/vendor change control, unit economics, and ownership are acceptable.

If a condition is unknown, propose validation rather than claiming AI is appropriate. Never use AI as decoration for a deterministic workflow.

When a recommended AI solution would take consequential actions, flag required controls from [AGENT_SECURITY_STANDARD.md](../../docs/peacemakers-operating-system/AGENT_SECURITY_STANDARD.md) and [HUMAN_APPROVAL_STANDARD.md](../../docs/peacemakers-operating-system/HUMAN_APPROVAL_STANDARD.md). Security is enforced outside the model. Observability principles live in the OS; this skill only flags when observability/evaluation controls are needed for a recommended AI solution. Do not implement observability here.

## Recommendation contract

For each Stage B recommendation and each Stage C approved candidate, include provenance aligned with [DECISION_RECORD_STANDARD.md](../../docs/peacemakers-operating-system/DECISION_RECORD_STANDARD.md) and [RECOMMENDATION_ENGINE_CONTRACT.md](../../docs/peacemakers-operating-system/RECOMMENDATION_ENGINE_CONTRACT.md):

- What: the precise change.
- Why: the verified problem, requirement, root cause, and evidence IDs.
- Who: accountable owner, affected roles, and decision maker.
- Where: process, system, team, and data boundary.
- When: sequence, prerequisite, trigger, and target window if approved.
- How: process, configuration, integration, automation, or AI design at an appropriate level.
- Selected OS ladder level (0–9) and why lower levels are insufficient when applicable.
- Current-tool leverage: retained people, tools, licenses, configurations, reports, and training.
- Alternatives: at least the lower-level option considered and why it is or is not sufficient.
- Deterministic automation analysis and AI suitability (including autonomy class when AI is considered).
- Dependencies, risks, controls, security/privacy considerations, and reversibility. Never recommend removing a legitimate control without an equivalent or stronger replacement and explicit risk acceptance.
- Expected metric movement stated directionally unless baseline and target are verified and approved.
- Effort and elapsed time at the fidelity allowed by the stage.
- Confidence and unresolved evidence.
- Approval state: Proposed, Approved, Revised, Rejected, or Deferred.

## Estimation, value, and commercial discipline

Unified value placement (do not create a separate AI ROI methodology):

- **Stage A** — reported estimates only (CLIENT_REPORTED / UNKNOWN). No savings, ROI, price, or implementation timeline claims.
- **Stage B** — validated baseline only where evidence supports it. Rough-order ranges only when evidence supports useful bounds; label non-binding. Otherwise `Estimate pending evidence`.
- **Stage C** — implementation business case with explicit assumptions/ranges; bottom-up work breakdown; commercial pricing only from James-provided or approved rates/costs/terms. If absent: `Commercial input required` and leave price blank.
- **Stage D** — measured actual outcomes vs baseline; never invent targets or claim improvement without valid comparison.

Additional commercial rules:

- Separate labor hours by role from elapsed calendar time.
- Use low/likely/high ranges when uncertainty remains. Explain the uncertainty driver.
- Treat third-party fees, taxes, usage costs, subscriptions, travel, and change requests separately.
- Never present a Stage B range as a quote or a Stage C draft as sent/approved.
- Never invent transaction volume, time saved, defects, revenue, ROI, target KPIs, vendor capability, effort, timeline, rates, cost, or price.

## Prioritization

Prioritize with transparent qualitative criteria: business impact, customer or compliance risk, evidence strength, simplicity, current-tool leverage, implementation effort, adoption burden, reversibility, and dependency order. Use `Now`, `Pilot`, `Later`, `Monitor`, or `Do not pursue`. Do not fabricate weighted scores when inputs are qualitative.
