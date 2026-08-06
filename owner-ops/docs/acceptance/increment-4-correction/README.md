# Increment 4 correction — acceptance evidence

**Correction verdict: PASS**

Narrow correction for Phase 1.1 Increment 4 defects A4-1 (required), A4-2, and A4-3.

| Item | Value |
|------|--------|
| Branch | `main` |
| Implementation baseline | `7f457d359d006343c8f1e659841bc4d7f84c982e` |
| Prior acceptance docs | `8f638b66ac0e3538bd41085228f512d894afc599` |
| Server under test | `next start` on `http://127.0.0.1:3001` (not `next dev`) |
| Fictional company | Optimum Demo Contractors |

## Documents in this folder

| File | Purpose |
|------|---------|
| [README.md](./README.md) | This index |
| [ROOT-CAUSE.md](./ROOT-CAUSE.md) | A4-1 root cause |
| [REPRODUCTION.md](./REPRODUCTION.md) | Pre-fix reproduction |
| [BEFORE-AFTER.md](./BEFORE-AFTER.md) | Behavior comparison |
| [QUALITY-GATES.md](./QUALITY-GATES.md) | Exact gate outputs |
| [BROWSER-ACCEPTANCE.md](./BROWSER-ACCEPTANCE.md) | Browser reacceptance table |
| [DATABASE.md](./DATABASE.md) | DB verification |
| [SCREENSHOT-INVENTORY.md](./SCREENSHOT-INVENTORY.md) | Screenshot list + visual inspection |
| [KNOWN-LIMITATIONS.md](./KNOWN-LIMITATIONS.md) | Remaining limitations |
| `run-browser-correction.mjs` | Playwright reacceptance runner |
| `prepare-invite.mts` | Fictional invitation helper |
| `browser-correction-results.json` | Machine-readable browser results |
| `browser-run.log` | Console log |

## Defect resolutions

| ID | Severity | Determination |
|----|----------|---------------|
| **A4-1** | Medium | **Fixed.** Owner UI hung on “Creating…” under `next start` because async work inside `useTransition` + soft `router.push`/`router.refresh` never settled the pending state even after the meeting was created. Replaced with explicit `creating` state, `finally` reset, and hard `window.location.assign` navigation. |
| **A4-2** | Low | **Not a product defect.** Prior acceptance omitted a complete Process Builder entry. With a valid Field photo process (100% completeness), browser submission succeeds. No application change. |
| **A4-3** | Low | **Accepted intentional behavior.** Ordinary `/packet` preview keeps owner controls (Evidence / mode switch / Print). Dedicated `/packet/print` is the print-safe surface (no owner nav chrome). |

## Recommended next action

Accept Phase 1.1 and authorize a separate first-client pilot production-readiness increment.
