# Pilot operating checklist

First real-client pilot. Complete in order. Privacy notice: **`pilot-2026-08-05`**. Support: **james@peacemakersai.com**.

If isolation, token, save, or submission integrity is in doubt → **pause** and use [incident-response.md](./incident-response.md).

---

## Before sending

- [ ] Production `/api/health?mode=ready` is OK (`database: up`, `config: ok`)
- [ ] Current Vercel deployment version / URL recorded
- [ ] Neon backup/PITR confirmed available (or empty baseline noted)
- [ ] Monitoring active (Vercel logs; Sentry if configured)
- [ ] Resend sender verified; `EMAIL_PROVIDER=resend`; log-email escape hatch **off**
- [ ] Correct **client/company** record selected (no fictional Optimum demo mix-up)
- [ ] Correct **recipient email** double-checked
- [ ] Privacy notice version is `pilot-2026-08-05`
- [ ] Invitation expiration acceptable (`FORM_INVITATION_EXPIRY_DAYS`)
- [ ] Questionnaire template/contents correct for this engagement
- [ ] Support contact is `james@peacemakersai.com`
- [ ] No fictional/test records linked to this opportunity
- [ ] Invitation preview reviewed in ops (recipient, company, link host = `APP_BASE_URL`)
- [ ] Final deliberate **send approval** obtained from owner (James)
- [ ] GO / GO WITH CONDITIONS recorded — not a silent send

**Do not send** while infra rehearsal is still **BLOCKED** or GO-NO-GO is NO-GO.

---

## During client completion

- [ ] Watch for email delivery failures (Resend + monitor `email.send_failed`)
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
