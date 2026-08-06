# Incident response (pilot)

Phase 1.2 §27. Support: **james@peacemakersai.com**. Owner: James Fullen.

## Automatic pilot stop

**Stop all real-client sends and treat as critical** if any of the following is suspected:

- Cross-company data exposure
- Authorization / session failure that may expose owner or client data
- Submitted-data mutation (submitted answers changed)
- Raw invitation token leak

Contain → preserve evidence → revoke as needed → do not resume until verified.

For each incident below: (1) Immediate containment (2) Revoke invitations? (3) Pause pilot? (4) Evidence to preserve (5) Who to contact (6) Restoration/recovery (7) Client communication (8) Post-incident verification.

---

### Invitation sent to the wrong person

| # | Action |
|---|--------|
| 1 | Stop further sends. Open invitation in ops; note recipient. |
| 2 | **Yes — revoke immediately.** Regenerate only for the correct recipient after verification. |
| 3 | Pause new sends until correct recipient confirmed. |
| 4 | Audit/invite timestamps, wrong address (not token), Resend message id. |
| 5 | Owner; Resend support only if provider fault. |
| 6 | N/A DB restore; revoke is primary. |
| 7 | If wrong person may have opened: notify correct client of delay; do not forward old link. Ask wrong recipient to delete email if appropriate. |
| 8 | Confirm status REVOKED; send new invite only to verified address; health OK. |

### Invitation forwarded

| # | Action |
|---|--------|
| 1 | Treat link as shared. Assume extra viewers possible. |
| 2 | **Yes — revoke and reissue** to the intended recipient. |
| 3 | Pause if forwarding was broad or unknown parties involved. |
| 4 | Who forwarded, when, invitation id (not raw token). |
| 5 | Owner; client contact for intended path. |
| 6 | Revoke/reissue; no DB restore. |
| 7 | Tell client the old link is dead; use only the new private link; do not forward. |
| 8 | Old token fails; new token works; submitted data (if any) unchanged. |

### Token exposed

| # | Action |
|---|--------|
| 1 | **Automatic stop.** Revoke invitation. Do not paste token into logs/chat. |
| 2 | **Yes.** |
| 3 | **Yes** until exposure scope understood. |
| 4 | Where exposed (email CC, ticket, screenshot), time window, invitation id. |
| 5 | Owner; hosting/email provider if their UI leaked it. |
| 6 | Revoke/reissue; rotate nothing else unless SESSION_SECRET also exposed. |
| 7 | Inform client that link was replaced; ask not to reuse old URL. |
| 8 | Old token rejected; new send deliberate; no token in logs. |

### Unauthorized access suspected

| # | Action |
|---|--------|
| 1 | **Automatic stop.** Force owner logout; change `OWNER_PASSWORD`; consider rotating `SESSION_SECRET` (invalidates sessions). |
| 2 | Revoke open client invitations if client data may have been reached. |
| 3 | **Yes.** |
| 4 | Vercel/Neon access logs, audit table, login rate-limit events (no passwords). |
| 5 | Owner; Vercel/Neon support if account compromise. |
| 6 | Credential rotation; restore only if data tampering confirmed. |
| 7 | Notify client if their questionnaire data may have been accessed. |
| 8 | New login works; old sessions dead; health/config OK; review audit for anomalies. |

### Client enters a password or secret

| # | Action |
|---|--------|
| 1 | Do not copy the secret into chat/email. Note field location. |
| 2 | Optional revoke if link sharing risk; usually not required solely for secret-in-form. |
| 3 | Pause review of that field until scrubbed. |
| 4 | Invitation/company id, approximate field, time — **not the secret value in tickets**. |
| 5 | Owner; client (to rotate the exposed credential in **their** system). |
| 6 | Owner edits/redacts if product allows pre-submit; if submitted, document retention of secret-bearing payload and minimize further copies; company deletion only if client requests full wipe. |
| 7 | Ask client to rotate the exposed credential immediately; remind no secrets in forms. |
| 8 | Confirm client rotated; confirm ops notes do not re-store the secret. |

### Autosave repeatedly fails

| # | Action |
|---|--------|
| 1 | Ask client to pause large edits; note error UI; check `/api/health`. |
| 2 | No, unless token/auth errors indicate revoke need. |
| 3 | Pause only if data loss risk is systemic. |
| 4 | Correlation times, HTTP status, rate-limit monitor events, health body (no answers). |
| 5 | Owner; Vercel/Neon/Upstash as indicated. |
| 6 | Fix infra/rate-limit; client retries; refresh should show last good save. |
| 7 | Explain temporary save issue; do not ask for passwords. |
| 8 | Successful save confirmed; no false “saved” state. |

### Submission fails

| # | Action |
|---|--------|
| 1 | Preserve draft; do not tell client it submitted. Check health + logs. |
| 2 | No by default. |
| 3 | Pause new invites if submit path broken. |
| 4 | Error type, time, invitation id; Resend N/A. |
| 5 | Owner; Vercel/Neon. |
| 6 | Fix cause; client resubmit once; ensure idempotent single submitted version. |
| 7 | Apologize for delay; confirm draft retained. |
| 8 | Exactly one submitted version; read-only; owner review matches. |

### Duplicate submission suspected

| # | Action |
|---|--------|
| 1 | Freeze owner edits; inventory response rows for invitation. |
| 2 | Revoke only if extra access path exists. |
| 3 | Pause if integrity unclear. |
| 4 | Response ids, timestamps, statuses. |
| 5 | Owner. |
| 6 | Keep authoritative submitted version; do not “merge” casually; DB restore only if corruption. |
| 7 | Confirm which version is official with client if needed. |
| 8 | Single authoritative submitted record; immutability holds. |

### Cross-company data exposure suspected

| # | Action |
|---|--------|
| 1 | **Automatic stop.** Take screenshots of UI evidence; disconnect further browsing of foreign data. |
| 2 | **Yes — revoke all open invites** for affected companies. |
| 3 | **Yes — full pause.** |
| 4 | URLs, company ids, user session id, time, audit events (no payloads). |
| 5 | Owner; consider professional incident help if confirmed breach. |
| 6 | Patch isolation bug before any resume; restore only with care. |
| 7 | Notify affected clients promptly and factually. |
| 8 | Isolation retested with fictional companies; no GO until verified. |

### Email provider outage

| # | Action |
|---|--------|
| 1 | Stop send retries that could queue duplicates. |
| 2 | No mass revoke. |
| 3 | Pause sends; questionnaire links already issued still work unless revoked. |
| 4 | Resend status, error codes from monitor `email.send_failed`. |
| 5 | Owner; Resend status/support. |
| 6 | Wait for provider; resend invite once when healthy. |
| 7 | Tell client invite delayed if awaiting first send. |
| 8 | Controlled test email OK; then one client send. |

### Database outage

| # | Action |
|---|--------|
| 1 | Stop sends and avoid destructive ops. |
| 2 | Not until access returns and risk assessed. |
| 3 | **Yes.** |
| 4 | Neon status, health `database: down`, times. |
| 5 | Owner; Neon support. |
| 6 | Provider recovery; restore only if data loss ([backup-restoration.md](./backup-restoration.md)). |
| 7 | Delay notice; no request for re-entry of secrets. |
| 8 | Health ready; sample read of fictional/known row. |

### Hosting outage

| # | Action |
|---|--------|
| 1 | Confirm Vercel status; avoid config thrash. |
| 2 | No. |
| 3 | Pause client deadlines as needed. |
| 4 | Deployment id, region `iad1`, status page. |
| 5 | Owner; Vercel support. |
| 6 | Wait/redeploy last known good. |
| 7 | Availability delay notice. |
| 8 | Health + login + one `/f/` load. |

### Monitoring outage

| # | Action |
|---|--------|
| 1 | Fall back to Vercel/Neon logs; continue cautious ops. |
| 2 | No. |
| 3 | Optional brief pause for high-risk changes only. |
| 4 | Sentry/host logging gaps. |
| 5 | Owner; Sentry if used. |
| 6 | Restore DSN/integration; not a DB restore. |
| 7 | Usually none. |
| 8 | Test `captureEvent` / error path without form bodies. |

### Data corruption

| # | Action |
|---|--------|
| 1 | **Pause.** Stop writes to affected entities. |
| 2 | Revoke invites if tokens/answers untrusted. |
| 3 | **Yes.** |
| 4 | Examples of bad rows, times, migration history. |
| 5 | Owner; Neon. |
| 6 | Non-prod restore drill path first when possible; prod restore only with explicit owner decision. |
| 7 | Honest status; do not ask to “just resubmit” until integrity known. |
| 8 | Relationships, submit immutability, isolation rechecked. |

### Accidental deletion

| # | Action |
|---|--------|
| 1 | Stop further deletes. Note `privacy.company_deleted` audit if app deletion. |
| 2 | N/A if company gone; revoke any lingering related sends elsewhere. |
| 3 | **Yes** until recovery decision. |
| 4 | Audit details (counts, reason), operator, time — backups still hold data. |
| 5 | Owner; Neon for PITR. |
| 6 | Restore from Neon to validated target; never `migrate reset` as “undo.” |
| 7 | Inform client if their data was affected. |
| 8 | Restored company isolation + submission state verified. |

---

## Evidence hygiene

Never store raw tokens, passwords, session cookies, or full questionnaire bodies in incident tickets. Prefer ids, timestamps, and monitor event types.
