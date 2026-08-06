# A4-1 root-cause analysis

## Symptom

Owner UI “Create Blueprint meeting” remained on **Creating…** indefinitely when exercised through the production server (`next start`) with browser automation. Domain-level `createBlueprintMeeting` and review of seeded meetings worked.

## Reproduction (pre-fix)

1. Route: `/ops/opportunities/cmsgg70vx0004itn1ybw2bg0s/evidence`
2. Browser: Chromium (Playwright), viewport 1440×900
3. Title: `Optimum Blueprint Discovery — Correction Test`
4. Action: click **Create Blueprint meeting**
5. Network: `POST …/evidence` → **200** `text/x-component` (server action succeeded)
6. Follow-up: RSC prefetch for new meeting id `cmsgxv1ab001litkxl93opi8z`
7. Database: meeting row **created**
8. UI: URL stayed on `/evidence`; control did not navigate; pending never cleared (~2 minutes observed)
9. Evidence: `repro-meeting-create.png`, terminal repro log

## Cause

Client handler in `evidence-hub-client.tsx`:

1. Wrapped the async server action in `startTransition(async () => { … })`
2. On success called `router.push(…)` **and** `router.refresh()`
3. Soft navigation began (RSC for the new meeting fired) but the document URL did not update
4. React transition `pending` remained true → button stuck on **Creating…**

The server action, authorization, isolation checks, and Prisma write were not the failure point.

## Correction (smallest legitimate fix)

In `evidence-hub-client.tsx`:

1. Replace `useTransition` with explicit `creating` boolean
2. Guard re-entry with `if (creating) return`
3. Clear pending in `finally` on both success and failure
4. Show a safe generic error on thrown failures
5. Navigate with `window.location.assign` to the created meeting (avoids soft-nav hang under `next start`)
6. Keep whitespace titles from submitting (`disabled` + trim check)

Authorization, company isolation, and relationship validation were not weakened.

## Regression coverage

`src/lib/blueprint-evidence.test.ts`:

- Create returns one meeting id
- Cross-company process id fails with **no partial meeting row**
- Forged opportunity/company pairing fails
- Client Review packet omits rejected findings
