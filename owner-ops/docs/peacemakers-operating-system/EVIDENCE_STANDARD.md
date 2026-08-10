# Evidence Standard

**ID:** `pm-os-evidence` · **Version:** `0.1.0`

## Classification (required for material findings)

| Class | Meaning |
|-------|---------|
| VERIFIED | Confirmed against authoritative source or direct observation with high confidence |
| CLIENT_REPORTED | Stated by client; not independently verified |
| OBSERVED | Seen in call, screen-share, or walkthrough |
| INFERRED | Logical inference; must remain labeled |
| HYPOTHESIS | Working theory under test |
| ASSUMPTION | Taken as true for planning; must remain visible |
| CONTRADICTED | Conflicts with other evidence |
| UNKNOWN | Material gap |

Never promote CLIENT_REPORTED → VERIFIED without new supporting evidence.

## Evidence item fields (target)

evidence ID · source · source type · date · owner · reference/excerpt · reliability · process · finding supported · limitation · class

## Owner Ops mapping (existing)

| Concept | Runtime |
|---------|---------|
| Evidence register | `EvidenceSource`, `EvidenceFinding`, `EvidenceConflict` |
| Questionnaire | `FormResponse` (SUBMITTED immutable) |
| Meetings | `BlueprintMeeting` / CRM `Meeting` |
| Files | `FileAttachment` |
| Process as-is | `Process` / `ProcessVersion` graphs |

## Rules

1. Packet and Stage A may only use **accepted** evidence (align with [future-blueprint-generator-contract.md](../future-blueprint-generator-contract.md)).
2. Conflicts remain open until resolved with rationale.
3. Do not log questionnaire bodies into monitoring streams ([production-readiness/architecture.md](../production-readiness/architecture.md)).
4. Cross-company evidence is forbidden.
5. Proposed findings ≠ approved recommendations ([future-recommendation-philosophy.md](../future-recommendation-philosophy.md)).
