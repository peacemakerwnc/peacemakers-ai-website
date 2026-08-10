# Observability Standard

**ID:** `pm-os-obs` · **Version:** `0.1.0`

## Questions observability must answer

What / why / information used / which system·model·tool / action / who initiated / who approved / cost / duration / success / correctness / policy violation / business outcome.

## Layers

| Layer | Focus |
|-------|--------|
| O0 | Application health |
| O1 | Model observability |
| O2 | Agent / workflow trace (OpenTelemetry-compatible concepts preferred) |
| O3 | Quality / evaluation |
| O4 | Governance / security |
| O5 | Business outcome |

## Logging classes

See [OBSERVABILITY_EVENT_MODEL.md](./OBSERVABILITY_EVENT_MODEL.md) for MUST / SHOULD / MAY / MUST NOT.

## Vendor rule

Do **not** install Datadog, LangSmith, Langfuse, Arize, etc. solely for “AI observability.” Define requirements → existing infra → vendor-neutral instrumentation → only then optional products.

## Owner Ops today

`captureEvent` / `captureError` (sanitized console; Sentry DSN stubbed unwired) · `AuditEvent` · `Activity` · correlation IDs on some client actions. No OTel traces; no model spans (no LLM).
