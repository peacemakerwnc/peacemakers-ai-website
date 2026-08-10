# Recommendation Engine Contract (Future)

**Status:** Contract only — **do not implement** an automated recommendation engine until philosophy gates and Stage B evidence readiness pass.

Aligns with [future-blueprint-generator-contract.md](../future-blueprint-generator-contract.md) and [future-recommendation-philosophy.md](../future-recommendation-philosophy.md).

## Recommendation object (minimum)

```ts
type RecommendationContract = {
  recommendationId: string;
  opportunityId: string;
  processIds: string[];
  evidenceIds: string[];
  problemStatement: string;
  rootCause: string;
  confidence: "low" | "medium" | "high";
  evidenceClasses: string[]; // VERIFIED | CLIENT_REPORTED | ...
  currentToolAssessment: {
    canSolve: "yes" | "partial" | "no";
    notes: string;
    vendorDocRefs?: string[];
  };
  alternatives: Array<{
    id: string;
    ladderLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    summary: string;
    rejectedReason?: string;
  }>;
  selectedLadderLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  deterministicAutomation: { suitable: boolean; notes: string };
  aiSuitability: {
    status: "not_applicable" | "provisional" | "justified" | "rejected";
    gateAnswersRef?: string; // link to answered gate
    autonomyClass: "A0" | "A1" | "A2" | "A3" | "A4" | "A5";
  };
  risks: string[];
  controls: string[];
  requiredApprovals: string[];
  assumptions: string[];
  unknowns: string[];
  dependencies: string[];
  implementationReadiness: "not_ready" | "ready_with_conditions" | "ready";
  acceptanceCriteria: string[];
  measurementPlan: {
    metrics: string[];
    baselineMethod: string;
    reviewCadence: string;
  };
  ownerApprovalStatus: "draft" | "pending" | "approved" | "rejected";
  methodologyVersion: string; // e.g. pm-os-0.1.0
};
```

## Invariants

- Free-form prose alone is insufficient for material recommendations once the engine exists.
- No fabricated ROI.
- Proposed ≠ approved.
- A5 autonomy requires explicit exception record.
