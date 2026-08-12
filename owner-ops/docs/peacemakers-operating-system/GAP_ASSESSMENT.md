# Gap Assessment — Owner Ops vs Peacemakers OS

**Date:** 2026-08-10  
**Method:** Repository inspection only (no deploy, no production mutation in this pass beyond prior authorized ops).

Legend: **IMPLEMENTED** · **PARTIAL** · **MISSING** · **NOT_APPLICABLE** · **UNKNOWN**

| # | Area | Status | Evidence | Risk | Disposition | Priority | Code needed? |
|---|------|--------|----------|------|-------------|----------|--------------|
| 1 | Consulting methodology Stages A–D | PARTIAL | Packet=A; meetings/evidence=B partial; Blueprint HTML=C manual; Stage D thin | Inconsistent delivery quality | Codify in docs (done); optional Stage B/C/D checklists in ops UI later | P0 docs / P2 UI | Docs first |
| 2 | Evidence model | IMPLEMENTED | `EvidenceSource`/`EvidenceFinding`/`EvidenceConflict` | Misclassification | Align UI labels to EVIDENCE_STANDARD classes | P1 | Small |
| 3 | Source of truth discipline | PARTIAL | Philosophy + tool fit in deliverables; no enforced SoT field | Wrong automation | Add SoT fields to decision record / packet | P1 | Medium |
| 4 | Recommendation provenance | MISSING | Manual templates only | Untraceable advice | DecisionRecord design → later schema | P1 | Later |
| 5 | Process mapping | IMPLEMENTED | Process graphs + client builder | Happy-path maps | Training/SOP to capture exceptions | P2 | Docs/SOP |
| 6 | Technology inventory | PARTIAL | CompanyTool + questionnaire; research deferred | Stale capability claims | Keep research contract; Stage B checklist | P1 | Docs |
| 7 | AI appropriateness | MISSING (runtime) / PARTIAL (policy) | No LLM; philosophy exists | Premature AI | Gate docs + contract; no engine yet | P0 docs / P1 before AI | Docs |
| 8 | Security (app) | PARTIAL | Sessions, hashed tokens, isolation, sanitization | Gaps: no middleware ACL, Sentry unwired | Hardening backlog | P1 | Medium |
| 9 | Authorization | PARTIAL | Binary owner vs invitee | Fine for pilot; not multi-tenant RBAC | Keep; document limits | P3 | Later |
| 10 | Human approvals | PARTIAL | Owner gates; pilot written auth | Soft process drift | HUMAN_APPROVAL_STANDARD + checklists | P0 | Docs |
| 11 | Observability | PARTIAL | AuditEvent, Activity, captureEvent | Weak reconstructability for future agents | Event model + OTel later | P1–P2 | Later |
| 12 | Audit records | IMPLEMENTED | AuditEvent + Activity | Detail gaps for AI runs | Extend when agents appear | P2 | Later |
| 13 | Versioning | PARTIAL | Privacy version; no prompt/policy versions | Irreproducible AI | VERSIONING.md + future entities | P1 | Later |
| 14 | Evaluations | PARTIAL | Unit/DB tests; no consulting rubrics | Quality drift | EVALUATION_STANDARD + manual rubrics | P1 | Docs |
| 15 | Baseline/outcome measurement | PARTIAL | ProcessMetric; Blueprint KPIs manual | No Stage D loop | Control plans | P2 | Medium |
| 16 | Control plans | MISSING | — | Unmonitored implementations | CONTROL_PLAN_STANDARD | P2 | Later |
| 17 | Retention/privacy | PARTIAL | retention-deletion.md; notice version drift risk | Compliance/trust | Align notice versions | P0 | Docs/ops |
| 18 | Incident handling | IMPLEMENTED | incident-response.md | — | Keep current | — | No |
| 19 | Testing | PARTIAL | Vitest unit + DB suites; ad-hoc Playwright | Gaps for E2E | Keep; expand carefully | P2 | Medium |
| 20 | Client-facing transparency | PARTIAL | Privacy gate; packet honesty | Over-frameworking clients | Keep client UX separate | P0 | Docs |
| 21 | Cursor governance | MISSING → addressed this pass | No `.cursor/rules` before | Agent inconsistency | Rules added | P0 | Done |
| 22 | peacemakers-blueprint-advisor skill | IMPLEMENTED (docs/skill) | `owner-ops/skills/peacemakers-blueprint-advisor/` · `blueprint-advisor-0.1.0` · compatible `pm-os-0.1.0` | Drift if skill diverges from OS | Keep skill as Stage A–D playbook; OS remains methodology authority | P1 maintain | No runtime |
| 23 | LLM/agent runtime | NOT_APPLICABLE (now) | Intentionally absent | — | Do not add until gates pass | P1 gate | No yet |
| 24 | Observability vendor | NOT_APPLICABLE | None installed | Premature vendor lock-in | Vendor-neutral first | P4 | No |

## Open questions / missing evidence

- Exact production `EMAIL_FROM` string (send-only Resend key; not required for this docs pass).
- ChatGPT-only packaging / portability for `peacemakers-blueprint-advisor` when OS paths are unavailable outside the repo (deferred; skill now lives at `owner-ops/skills/peacemakers-blueprint-advisor/`).
- C7 re-review status vs GO-NO-GO doc lag (ops process; not code).
