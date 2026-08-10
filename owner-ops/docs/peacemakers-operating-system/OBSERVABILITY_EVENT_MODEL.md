# Observability Event Model

**Status:** Vendor-neutral design. Prefer OpenTelemetry conceptual model for traces/spans.

## Correlation

| ID | Purpose |
|----|---------|
| `traceId` | End-to-end workflow |
| `spanId` / parent | Step within trace |
| `correlationId` | Already used in some Owner Ops client actions |
| `opportunityId` / `invitationId` | Business keys (when safe) |
| `actorType` | owner · client · system · agent |
| `actorId` | User id or service identity — never raw secrets |

## Span / event types (conceptual)

request · retrieval · orchestration · model · tool_select · tool_call · policy_eval · approval · external_api · db · retry · evaluation · security · business_outcome · response

## MUST log

Workflow/run id · actor type · action name · success/failure · duration · policy decision allow/deny for consequential actions · approval required/received · error class (not raw bodies) · provider/model id when LLM exists · tool id for tool calls

## SHOULD log

Token counts/cost estimates when reliable · retry counts · finish reason · methodology/prompt/policy versions · evaluation scores · business metric deltas when measured

## MAY log

Non-sensitive summaries · redacted excerpts under retention policy

## MUST NOT log

Secrets · passwords · API keys · tokens · session cookies · raw invitation tokens · full questionnaire payloads · unrestricted transcripts · unnecessary PII · unrestricted financial account data · prompt/output contents containing sensitive client data by default

## Owner Ops mapping today

| Need | Current |
|------|---------|
| Audit | `AuditEvent` (forbidden detail keys) |
| Timeline | `Activity` |
| Monitor | `captureEvent` / `captureError` sanitized |
| Traces | Missing |
| Model spans | N/A until LLM |

## Vendor decision

A) Existing infra covers pilot audit needs.  
B) Add OTel-style instrumentation before any agent platform.  
C) Unmet: durable trace store, model cost dashboards, eval UI.  
D) External vendor only if B cannot meet ops needs after agents exist.
