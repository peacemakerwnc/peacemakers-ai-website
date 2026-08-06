# Browser reacceptance table

Server: `next start` @ `http://127.0.0.1:3001`  
Runner: `node docs/acceptance/increment-4-correction/run-browser-correction.mjs`  
Data: fictional Optimum Demo Contractors only

## Meeting creation

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | Open owner opportunity evidence | PASS | |
| 2 | Select Create Blueprint meeting | PASS | |
| 3 | Enter fictional meeting data | PASS | Title with stamp |
| 4 | Submit | PASS | |
| 5 | Pending state appears | CONDITIONAL | Hard nav often completes before sampler sees “Creating…” |
| 6 | Pending state ends | PASS | Navigation or button idle |
| 7 | Successful creation | PASS | |
| 8 | Navigation to created meeting | PASS | `/evidence/{id}` |
| 9 | One database record | PASS | Per titled create |
| 10 | Refresh persistence | PASS | |
| 11 | Double click | PASS | ≤1 Dup Guard record |
| 12 | No duplicate | PASS | |
| 13 | Invalid / empty title | PASS | Control disabled for whitespace |
| 14 | Safe failure | PASS | Visual: `04-meeting-create-error-state.png` shows safe error; control not stuck |
| 15 | Retry after failure | PASS | Navigates to new meeting |
| 16 | Confirm success | PASS | |

## Questionnaire

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 17 | Fictional invitation | PASS | `prepare-invite.mts` |
| 18 | Open as client | PASS | Token not captured in screenshots |
| 19 | Complete Field photo process | PASS | 100% completeness checklist |
| 20 | Refresh autosave | PASS | First name Casey preserved |
| 21–22 | Save and Continue Later | PASS | |
| 23 | Review-before-submission | PASS | Section 8 + process review |
| 24 | Submit successfully | PASS | |
| 25 | Submission confirmation | PASS | Thank you |
| 26 | Answers read-only | PASS | Thank you / no Add process |
| 27 | Process immutable | PASS | `ProcessVersion.status=SUBMITTED` |
| 28 | Owner can review | PASS | |
| 29 | Client cannot access owner | PASS | Fresh context → login |

## Packet

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 30 | Client Review preview | PASS | Owner chrome present (intentional) |
| 31 | Print route | PASS | |
| 32 | Print has no owner chrome | PASS | No Evidence / mode switch |
| 33 | Internal material excluded | PASS | Client mode |
| 34 | No secrets/tokens/raw IDs | PASS | |
| 35 | Print layout readable | PASS | |

## Desktop + mobile

| Check | Result |
|-------|--------|
| Desktop questionnaire + process | PASS |
| Mobile questionnaire viewport | PASS — `11-mobile-questionnaire.png` |
| Mobile print | PASS — `11-mobile-print.png` |

Machine JSON: `browser-correction-results.json` (one automated timing false-negative on failure alert; overridden by screenshot evidence).
