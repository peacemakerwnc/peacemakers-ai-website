# Pilot operating checklist

First real-client pilot. Complete in order. Privacy notice: **`pilot-2026-08-07`**.  
**Do not send a real invitation without a separately scoped written authorization after C7.**

If isolation, token, save, or submission integrity is in doubt → **pause** and use [incident-response.md](./incident-response.md).

---

## Launch prerequisites (program level)

- [ ] C7 read-only production-readiness re-review has accepted current Production
- [ ] Separately scoped **first-real-client invitation authorization** exists in writing
- [ ] GO / GO WITH CONDITIONS in [GO-NO-GO.md](../acceptance/phase-1-2-production-readiness/GO-NO-GO.md) reviewed the same day
- [ ] Neon non-prod restore drill evidence retained ([C6-R-RESTORE-DRILL.md](../acceptance/phase-1-2-production-readiness/C6-R-RESTORE-DRILL.md))
- [ ] Vercel Production still points at Production Neon `main` (not a restore-drill branch)

---

## Before sending (specific client)

- [ ] Production `/api/health?mode=ready` is OK (`database: up`, `config: ok`)
- [ ] Current Vercel deployment commit / URL recorded
- [ ] Offline confirm: `EMAIL_PROVIDER=resend`; log-email hatch **off**; `DISABLE_CLIENT_UPLOADS=true`; Upstash rate-limit backend on
- [ ] Monitoring path accepted (Vercel logs; Sentry only if authorized)
- [ ] James manually approved the **exact** company name, contact identity, and recipient email
- [ ] Correct **client/company** record selected (no fictional C5-R / Optimum / demo mix-up)
- [ ] Correct **recipient email** verified immediately before the one send
- [ ] Privacy notice version is `pilot-2026-08-07`
- [ ] Invitation expiration acceptable (`FORM_INVITATION_EXPIRY_DAYS`)
- [ ] Questionnaire template/contents correct for this engagement
- [ ] Invitation preview reviewed in ops (recipient, company, link host = `APP_BASE_URL`)
- [ ] Ready for **one** create + **one** send only (no double-click; initial send has no 60s debounce)
- [ ] Final deliberate **send approval** obtained from James

**Do not send** without C7 acceptance and separate written authorization.

### Incorrect recipient / accidental send response

1. **Revoke first** (do not resend).
2. Assess impact; follow [incident-response.md](./incident-response.md).
3. Only create/send a corrected invitation after explicit re-approval.

### Scope control

- Do **not** add a second real client without a **new** written authorization.
- Do **not** resend/regenerate without explicit review.

---

## During client completion

- [ ] Watch for email delivery failures (Resend + monitor events)
- [ ] Watch for save failures / rate-limit blocks (support without requesting secrets)
- [ ] Avoid viewing or changing draft answers unnecessarily
- [ ] Provide support without requesting passwords, API keys, or other secrets
- [ ] Revoke/reissue only through controlled owner flows
- [ ] Record any incident per [incident-response.md](./incident-response.md)
- [ ] Pause pilot if isolation, token, save, or submission integrity is in doubt

---

## After submission

- [ ] Confirm **one** submitted version
- [ ] Confirm submitted answers are read-only / immutable
- [ ] Confirm owner notification / ops visibility of submission
- [ ] Confirm client received appropriate confirmation (if configured) or owner follows up
- [ ] Review for accidental secrets; follow incident procedure if found
- [ ] Confirm Neon backup posture still healthy
- [ ] Record pilot result (date, company, outcome — no form bodies in the record)
- [ ] **Do not begin Phase 2** automatically
