# Implementation Backlog

Complexity: LOW / MEDIUM / HIGH only. No calendar or dollar estimates.

## P0 — Foundational / governance

| ID | Requirement | Current | Desired | Why | Risk | Approach | Deps | Acceptance | Complexity |
|----|-------------|---------|---------|-----|------|----------|------|------------|------------|
| P0-1 | Canonical OS docs | Missing | This folder | Shared methodology | Drift | Docs (done) | — | Docs linked from README | LOW |
| P0-2 | Cursor rules | Missing | `.cursor/rules/*.mdc` | Agent compliance | Unsafe changes | Rules (this pass) | P0-1 | Rules load; point to docs | LOW |
| P0-3 | Privacy notice version alignment | Drift risk | Single current version everywhere | Trust | Ops doc reconcile | retention + privacy module | Docs updated; no silent send | LOW |
| P0-4 | Prospect runbook | Missing | One-pager Stages A–D + invite | Intake readiness | Missed steps | Markdown runbook | P0-1 | James can run intake without chat | LOW |

## P1 — Required before production AI

| ID | Requirement | Current | Desired | Why | Risk | Approach | Deps | Acceptance | Complexity |
|----|-------------|---------|---------|-----|------|----------|------|------------|------------|
| P1-1 | DecisionRecord design→schema | Design only | Persist provenance | Traceability | Unauditable AI advice | Migrate when needed | Contract | CRUD + James approval field | MEDIUM |
| P1-2 | AI gate checklist in ops UI | Docs only | Blocking checklist before AI recs | Prevent premature AI | Bad recommendations | Form tied to opportunity | AI standard | Cannot mark AI justified without gate | MEDIUM |
| P1-3 | Prompt/Policy versioning | None | Version IDs on any LLM call | Reproducibility | Silent behavior change | Tables + logging | Versioning | Every model call logs versions | MEDIUM |
| P1-4 | OTel-compatible tracing for AI paths | captureEvent only | Traces for model/tool | Reconstructability | Blind ops | Vendor-neutral SDK | Event model | Trace per run in staging | HIGH |
| P1-5 | Security review for first LLM integration | N/A | Threat model + least privilege | Abuse | Injection/data leak | Design review + tests | Agent security | Written review + tests | MEDIUM |

## P2 — Required before agentic actions

| ID | Requirement | Current | Desired | Why | Risk | Approach | Deps | Acceptance | Complexity |
|----|-------------|---------|---------|-----|------|----------|------|------------|------------|
| P2-1 | ToolDefinition registry | None | Explicit contracts | Tool sprawl | Over-privilege | Registry + allowlists | P1 | No tool without contract | MEDIUM |
| P2-2 | Approval workflow for A3+ | Owner session only | Explicit approve step | Irreversible actions | Accidents | Approval records | Human approval | Write tools blocked without approval | HIGH |
| P2-3 | ControlPlan entity | Missing | Stage D measurement | Outcome lies | Control plans | Schema + UI | Metrics | Plan required before “done” | MEDIUM |
| P2-4 | Eval harness (deterministic) | Unit tests | Consulting/agent rubrics | Quality drift | Rules + fixtures | Evaluation standard | Sample scored runs | MEDIUM |

## P3 — Maturity

| ID | Requirement | Current | Desired | Why | Approach | Complexity |
|----|-------------|---------|---------|-----|----------|------------|
| P3-1 | Stage guidance enrichment | Thin SOP seeds | Full procedures | Consistency | Docs → seed SOP bodies | LOW |
| P3-2 | Evidence class enum UX | Freeform-ish | Standard classes | Clarity | Map UI to EVIDENCE_STANDARD | LOW |
| P3-3 | Multi-user RBAC | Single owner | Roles if needed | Scale | Only if hiring | HIGH |
| P3-4 | E2E Playwright suite | Ad-hoc | First-class | Regression | Careful addition | MEDIUM |

## P4 — Optional / vendor-enhanced

| ID | Requirement | Disposition |
|----|-------------|-------------|
| P4-1 | External obs platform | Only after OTel gap proven |
| P4-2 | LLM-as-judge evals | Never as sole ground truth |
| P4-3 | Auto Blueprint generator | Remains Phase 2; after P1 provenance |

## Decision gates (A–H)

| Gate | Meaning | Blocker example |
|------|---------|-----------------|
| A Evidence Ready | Enough for Stage A/call | Open material conflicts |
| B Recommendation Ready | Root cause + alternatives supported | Missing SoT |
| C AI Justified | Appropriateness gate passes | Gate unanswered |
| D Security Ready | Permissions/validation/threat controls | Tools without contracts |
| E Observability Ready | Required traces/audit exist | No correlation on agent runs |
| F Human Approval Ready | Approval mechanism exists | No James approval path |
| G Production Ready | Tests + ops controls | Failed quality gates |
| H Outcome Validated | Measurement supports claim | No baseline |

Failed gate must record: reason · blocking evidence · owner · remediation.
