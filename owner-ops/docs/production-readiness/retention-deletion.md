# Retention and deletion (pilot)

Operational policy for the controlled pilot. Not a substitute for legal advice.  
Privacy notice version: **`pilot-2026-08-05`**. Support: **`james@peacemakersai.com`**.

Ordinary pilot retention target: about **365 days** after engagement close (`PRIVACY_RETENTION_DAYS_PILOT`), unless a longer business/legal record obligation applies (owner judgment).

## Data classes

| Class | Examples | Pilot treatment |
|-------|----------|-----------------|
| Unaccepted invitations | PENDING never opened | May expire; revoke if mis-sent; delete with company scope |
| Expired invitations | Past `FORM_INVITATION_EXPIRY_DAYS` | Status EXPIRED; token unusable; company deletion removes |
| Revoked invitations | Owner revoke/regenerate | Token unusable; submitted records (if any) preserved separately |
| Draft questionnaires | Autosaved incomplete payloads | Retained until submit, expire, or company deletion |
| Submitted questionnaires | Immutable form responses | Retain for engagement; do not casually overwrite; delete only via authorized company deletion |
| Process records | Client process builder graphs | Same company scope as opportunity/company |
| Meeting transcripts / notes | Blueprint meeting intake | Company-scoped; minimize secrets in paste |
| Consultant / client notes | Evidence notes | Company-scoped |
| Findings / conflicts | Evidence foundation | Company-scoped |
| Attachments | FileAttachment rows | Pilot: uploads disabled in prod; any local files not durable on Vercel |
| Email delivery metadata | Provider message ids, to-domain in monitors | Prefer domains/ids, not bodies |
| Audit events | `recordAudit` rows | Retain; deletion creates `privacy.company_deleted` audit (non-sensitive) |
| Application / monitor logs | `[monitor:*]` console / host logs | No form bodies/tokens; host retention per Vercel/Neon |
| Backups | Neon PITR / snapshots | **Not** purged by app deletion; see [backup-restoration.md](./backup-restoration.md) |

**Do not silently delete submitted client work.** Automated cleanup for the pilot is minimal; prefer owner-operated expiry/revoke and explicit company deletion.

## Minimization rules

1. Collect only for Blueprint preparation / engagement workflow.
2. Logs and monitoring exclude questionnaire content whenever practical (`src/lib/monitoring.ts` sanitizes sensitive keys).
3. Clients must not enter passwords, API keys, PHI, or payment credentials (privacy notice).
4. Submitted evidence is not casually overwritten; submit makes answers read-only.

## Owner deletion procedure

Implementation: `src/lib/retention.ts`.

### 1. Preview (dry run)

```ts
import { previewCompanyDeletion } from "@/lib/retention";

const preview = await previewCompanyDeletion(companyId);
// preview.dryRun === true
// preview.counts: opportunities, companyContacts, invitations, processes,
//   blueprintMeetings, fileAttachments, evidenceFindings, evidenceConflicts
```

Confirm `companyName` and counts with the client request. **Does not delete.**

### 2. Execute (destructive)

Requires:

- Matching `confirmName` (exact company name trim match)
- `actorUserId` (authenticated owner)
- Short `reason` (stored truncated in audit)

```ts
import { executeCompanyDeletion } from "@/lib/retention";

const result = await executeCompanyDeletion({
  companyId,
  confirmName: "<exact company name>",
  actorUserId: session.userId,
  reason: "Client deletion request YYYY-MM-DD",
});
```

Behavior:

- Deletes company-scoped opportunities, invitations/responses, processes, meetings, evidence, contacts, tools, activities, then the company.
- Writes audit action `privacy.company_deleted` (name, reason slice, counts — not form bodies).
- Emits monitor event `privacy.company_deleted` (company id prefix only).
- **Does not purge Neon backups / PITR history.**

### 3. After deletion

1. Confirm preview counts vs result.
2. Note backup lag: deleted rows may remain recoverable from backups until backup retention expires (owner judgment for legal holds).
3. Notify client via `james@peacemakersai.com` only as appropriate; do not email secrets.
4. If deletion was accidental, follow [incident-response.md](./incident-response.md) (Accidental deletion) and [backup-restoration.md](./backup-restoration.md) — restore only into non-prod first when testing.

## Legal / business exceptions

Owner may retain records longer when required for contracts, disputes, or bookkeeping. Document the exception in the engagement notes (not in public logs). Self-service privacy portal is **deferred**.
