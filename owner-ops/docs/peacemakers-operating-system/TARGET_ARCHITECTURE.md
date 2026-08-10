# Target Architecture

```text
Client Intake
    ↓
Questionnaire (invite token)     ← human / client
    ↓
Evidence Register                ← deterministic persistence
    ↓
Stage A Diagnostic + Packet      ← human (+ future assisted analysis A1–A2 only)
    ↓
Blueprint Call                   ← human
    ↓
Evidence Reconciliation          ← human
    ↓
Current-State Process Map        ← human (+ tools)
    ↓
Root-Cause Analysis              ← human
    ↓
Current-Tool Assessment          ← human + vendor docs
    ↓
Solution Escalation Ladder       ← human / rules
    ↓
AI Appropriateness Gate          ← checklist (deterministic gate)
    ↓
Options / Recommendation         ← human; future structured contract
    ↓
Risk + Controls                  ← human
    ↓
Owner Review (James)             ← HUMAN APPROVAL
    ↓
Implementation Decision          ← HUMAN APPROVAL
    ↓
Implementation                   ← human / deterministic automation / bounded AI
    ↓
Observable Runtime               ← O0–O4
    ↓
Evaluation                       ← deterministic + human
    ↓
Business Outcome Measurement     ← O5
    ↓
Control Plan                     ← human-owned
    ↓
Continuous Improvement
```

## Where AI may appear later

- A1/A2: draft summaries, classify evidence, draft call questions, draft recommendation text — always human-approved before client delivery.
- A3: prepare tool actions (e.g., draft email) with explicit approve.
- A4/A5: not in near-term architecture without separate approval.

## Deterministic forever

Auth · isolation · token hashing · rate limits · submission immutability · policy allow/deny for destructive ops · audit write paths · ladder ordering rules · AI gate checklist structure.
