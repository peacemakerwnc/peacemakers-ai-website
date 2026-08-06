# Database verification

## Legacy / seed invariants (preserved)

| Record | Expected | After correction |
|--------|----------|------------------|
| FormProcess | 24 | **24** |
| FormProcessStep | 8 | **8** |
| Optimum Demo Contractors | present | **1** |

No database reset. No destructive migration.

## Blueprint meetings

Correction browser runs created additional fictional meetings (Correction Test / Dup Guard / Retry titles). Seeded acceptance meeting `cmsgxlzhw0001itfbflxqdx30` remains. Evidence sources/findings/conflicts from Increment 4 seed remain intact (packet still shows Peak-season / Six-hour / tablet conflict findings).

## Questionnaire submission (correction)

| Entity | Observation |
|--------|-------------|
| FormResponse | New `SUBMITTED` row (~2026-08-06) |
| Process | `Field photo reporting and documentation` |
| ProcessVersion | `SUBMITTED` for the new graph |

## Duplicate-record check (A4-1)

For a single successful create with unique title stamp: **exactly one** `BlueprintMeeting` row. Double-click guard produced ≤1 “Dup Guard” row.
