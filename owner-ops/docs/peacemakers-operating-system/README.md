# Peacemakers Consulting Operating System

**Version:** `pm-os-0.1.0`  
**Status:** Foundation documentation (Phase 0–12 design pass)  
**Scope:** Owner Ops assessments, Blueprint engagements, future AI/agent work, and Peacemakers internal operations  
**Branch baseline:** recorded in [FOUNDATION_VERDICT.md](./FOUNDATION_VERDICT.md)

## Governing principle

> Understand before recommending.  
> Simplify before automating.  
> Configure before replacing.  
> Use existing capabilities before purchasing new ones.  
> Prefer deterministic automation when deterministic logic can reliably solve the problem.  
> Introduce AI only when its capabilities are genuinely justified.  
> Give AI and agents the minimum authority required.  
> Keep consequential actions observable, attributable, reversible where feasible, and human-governed.  
> Measure whether the resulting change actually improves the business.

This is **not** an “AI observability” project. It is a business improvement, technology decision, governance, security, measurement, and continuous-improvement methodology.

## Canonical standards (this folder)

| Document | Purpose |
|----------|---------|
| [CONSULTING_STANDARD.md](./CONSULTING_STANDARD.md) | Stages A–D, assessment lenses, client vs internal analysis |
| [EVIDENCE_STANDARD.md](./EVIDENCE_STANDARD.md) | Evidence classes, register, conflicts |
| [PROCESS_IMPROVEMENT_STANDARD.md](./PROCESS_IMPROVEMENT_STANDARD.md) | Lean / Six Sigma / root cause usage |
| [TECHNOLOGY_DECISION_STANDARD.md](./TECHNOLOGY_DECISION_STANDARD.md) | Solution escalation ladder, current-tools-first |
| [AI_GOVERNANCE_STANDARD.md](./AI_GOVERNANCE_STANDARD.md) | AI appropriateness gate, autonomy classes |
| [AGENT_SECURITY_STANDARD.md](./AGENT_SECURITY_STANDARD.md) | Tool contracts, least privilege, threat controls |
| [OBSERVABILITY_STANDARD.md](./OBSERVABILITY_STANDARD.md) | O0–O5 layers; what must / must not be logged |
| [HUMAN_APPROVAL_STANDARD.md](./HUMAN_APPROVAL_STANDARD.md) | Approval gates; preserve James owner boundaries |
| [EVALUATION_STANDARD.md](./EVALUATION_STANDARD.md) | Quality evaluations for consulting and agents |
| [CONTROL_PLAN_STANDARD.md](./CONTROL_PLAN_STANDARD.md) | Post-implementation measurement |
| [DECISION_RECORD_STANDARD.md](./DECISION_RECORD_STANDARD.md) | Recommendation provenance / decision records |
| [GLOSSARY.md](./GLOSSARY.md) | Shared terms |
| [VERSIONING.md](./VERSIONING.md) | What must be versioned |

## Design artifacts (this pass)

| Document | Purpose |
|----------|---------|
| [GAP_ASSESSMENT.md](./GAP_ASSESSMENT.md) | Current system vs standard |
| [DOMAIN_MODEL.md](./DOMAIN_MODEL.md) | Proposed entities (design only) |
| [RECOMMENDATION_ENGINE_CONTRACT.md](./RECOMMENDATION_ENGINE_CONTRACT.md) | Structured recommendation contract |
| [OBSERVABILITY_EVENT_MODEL.md](./OBSERVABILITY_EVENT_MODEL.md) | Vendor-neutral traces/events |
| [TARGET_ARCHITECTURE.md](./TARGET_ARCHITECTURE.md) | End-to-end flow |
| [IMPLEMENTATION_BACKLOG.md](./IMPLEMENTATION_BACKLOG.md) | P0–P4 backlog |
| [FOUNDATION_VERDICT.md](./FOUNDATION_VERDICT.md) | Baseline + final verdict |

## Authoritative existing sources (do not duplicate)

| Source | Role |
|--------|------|
| [../future-recommendation-philosophy.md](../future-recommendation-philosophy.md) | Preference order + James approval invariants |
| [../future-blueprint-generator-contract.md](../future-blueprint-generator-contract.md) | Allowed/forbidden generator inputs (deferred) |
| [../future-current-software-research-contract.md](../future-current-software-research-contract.md) | Time-sensitive tool research rules |
| [../deliverables/README.md](../deliverables/README.md) | Sold Blueprint deliverable outline |
| [../production-readiness/](../production-readiness/) | Pilot ops, retention, incident, deploy |
| Prisma `Evidence*` / `Process*` models | Runtime evidence & process graphs |

## Note on `peacemakers-blueprint-advisor`

No Cursor skill or package named `peacemakers-blueprint-advisor` was found in this workspace at foundation time. Consulting stages in [CONSULTING_STANDARD.md](./CONSULTING_STANDARD.md) encode the evidence-first Blueprint methodology described for that advisor and align it with existing Owner Ops artifacts (questionnaire → evidence → packet → manual Blueprint).

## Cursor governance

Project rules live at repo root: [../../../.cursor/rules/](../../../.cursor/rules/). Rules point here; they do not replace these standards.
