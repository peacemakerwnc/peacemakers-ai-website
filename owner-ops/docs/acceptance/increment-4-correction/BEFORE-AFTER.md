# Before / after behavior

## A4-1 Meeting create (owner UI, `next start`)

| Behavior | Before | After |
|----------|--------|-------|
| Server action | Succeeds | Succeeds |
| DB record | Created | Created (exactly one per successful click) |
| Pending “Creating…” | Stuck indefinitely | Clears on success and failure |
| Navigation | Soft push+refresh hung; URL stuck | Hard assign to meeting page |
| Empty/whitespace title | Could confuse pending | Button disabled; cannot submit |
| Failure message | N/A (hung) | Safe “Could not create…” (see `04-meeting-create-error-state.png`) |
| Double-click while pending | Risk of duplicate | Guarded by `creating` flag |
| Retry after failure | Blocked by hang | Works |

## A4-2 Questionnaire

| Behavior | Prior acceptance | Correction run |
|----------|------------------|----------------|
| Process entry | Incomplete / skipped | Full Field photo process via Process Builder (100% completeness) |
| Submit | Failed validation: “Add at least one process…” | PASS — Thank you confirmation |
| Immutability | Not demonstrated | Submitted response + process version `SUBMITTED`; Add process unavailable |

## A4-3 Packet

| Surface | Behavior | Determination |
|---------|----------|---------------|
| `/packet?mode=client` | Owner controls: Evidence, mode switch, Print/PDF | Intentional owner preview |
| `/packet/print?mode=client` | Print/PDF controls only; no Evidence/mode switch; Client Review content | Print-safe surface |
