# Decision Record Standard

**ID:** `pm-os-decision` · **Version:** `0.1.0`

## Recommendation provenance (required for material recommendations)

Recommendation → business problem → process → evidence → root cause → alternatives → current-tool analysis → deterministic automation analysis → AI appropriateness → security implications → controls → dependencies → assumptions → risks → expected measurable outcome → acceptance criteria → owner approval.

## Consulting decision record fields

recommendation ID · client/process · problem · root cause · evidence IDs · confidence · alternatives · simplest viable · current-tool option · deterministic option · AI option · selected approach reason · assumptions · unknowns · risks · dependencies · controls · owner · approval status · implementation readiness · measurement plan.

Align structured shape with [RECOMMENDATION_ENGINE_CONTRACT.md](./RECOMMENDATION_ENGINE_CONTRACT.md).

## Owner Ops today

No `DecisionRecord` table. Provenance is manual in Blueprint HTML / internal plan templates.
