# Domain Model (Design Only)

**Status:** Design — **no Prisma migration in this pass.**

## Principle

Smallest model that preserves provenance, governance, measurement, and auditability. Prefer extending existing entities over inventing parallel graphs.

## Keep / extend (existing)

| Existing | Role |
|----------|------|
| Opportunity, Company, Contact | Engagement spine |
| FormInvitation, FormResponse | Questionnaire |
| EvidenceSource, EvidenceFinding, EvidenceConflict | Evidence register |
| Process*, ProcessMetric, ProcessPainPoint | Process analysis |
| CompanyTool | Tech inventory |
| BlueprintMeeting | Call evidence |
| AuditEvent, Activity | Audit / timeline |
| FileAttachment | Artifacts |
| NextAction | Follow-ups |

## Propose later (only when needed)

| Entity | Why | When |
|--------|-----|------|
| DecisionRecord | Recommendation provenance | Before automated/assisted recommendations |
| RecommendationAlternative | Structured options | With DecisionRecord |
| MethodologyVersion / PolicyVersion | Behavioral attribution | Before agent/prompt runtime |
| PromptVersion | Prompt change control | Before LLM calls |
| ControlPlan | Stage D | Before claiming outcome validation |
| Baseline / OutcomeMeasurement | Link metrics to recommendations | With ControlPlan |
| AgentDefinition / AgentRun | Agent governance | Before any agent |
| Trace/Span (or external OTel only) | Prefer OTel exporter over duplicating in DB unless query needs | Before agentic production |
| ToolDefinition / ToolInvocation | Tool contracts | Before tools for agents |
| PolicyDecision | Allow/deny audit | With policy engine |
| EvaluationResult | Quality scores | With eval harness |
| SecurityEvent | Distinct from generic audit when volume grows | If needed |

## Explicitly defer

Do not create MethodologyVersion, Trace, Span, AgentRun, etc. until a concrete runtime needs them. Avoid architecture astronautics.

## Naming note

Product “Finding” = existing `EvidenceFinding`.
