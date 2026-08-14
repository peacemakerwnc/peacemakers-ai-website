# Blueprint Evidence Follow-Up Workflow

**Audience:** James (owner operator)  
**Use:** First 1–3 paid Business Blueprint engagements  
**Type:** Operating procedure — request, track, review, close evidence gaps between Stage A and Stage B  

**Status:** `EVIDENCE FOLLOW-UP WORKFLOW — DEFINED`  
**Authority:** OS `pm-os-0.1.0` · Advisor `blueprint-advisor-0.1.2`  

**Do not duplicate:** evidence taxonomy, Stage A/B methodology, or artifact-storage SOP.

Use:

- Analysis: skill `references/stage-a.md` and `stage-b.md`
- Classes: [EVIDENCE_STANDARD.md](./peacemakers-operating-system/EVIDENCE_STANDARD.md)
- Storage / AI preflight: [BLUEPRINT_ARTIFACT_HANDLING.md](./BLUEPRINT_ARTIFACT_HANDLING.md)
- Lifecycle: [PEACEMAKERS_OWNER_OPERATING_RUNBOOK.md](./PEACEMAKERS_OWNER_OPERATING_RUNBOOK.md)

---

## Purpose

Stage A identifies the **minimum evidence** needed for a useful Blueprint call. This SOP tells James how to request, receive, track, and close those items without unpaid forensic discovery.

Goal: enough evidence to classify material findings and make the next decision without overclaiming.

Not the goal: exhaustive document collection, statistical Measure-phase datasets, or a second unpaid discovery engagement.

---

## Minimum-evidence principle

**Request the minimum evidence necessary to make the next decision.**

Prefer items that distinguish: normal vs exception, actual vs reported control, source of truth, ownership, approval, variation, current-system capability.

Preferred modes (lowest burden first):

1. Screen-share during the Blueprint call  
2. One representative normal example  
3. One exception example  
4. Redacted screenshot  
5. Bounded existing report/export  
6. Brief written confirmation  

Avoid by default: full data dumps, credentials, unused reports the client must create, data cleanup for analysis, 25-item audit lists.

Typical first-client request: **3–8 high-value items**. More is allowed only when the case is genuinely more complex. Prefer one consolidated request, not a series of drips.

---

## Stage A → evidence request

After James **approves Stage A** and persists it (same day):

1. Copy only the Advisor **Minimum evidence request** items that still matter.  
2. Drop anything that will not change the call, a finding, or a recommendation.  
3. For each remaining item, fill a request record (below).  
4. Run security preflight.  
5. Send the client-facing request (template below).  
6. Record Owner-Ops Activity: `Evidence request sent` + count of items.  
7. NextAction: `Track evidence / prepare Blueprint call`.

Do not invent a second evidence taxonomy. IDs may reuse Stage A labels (e.g. E-01).

### Request record (operational — not schema)

Use Drive `evidence-index.md` (naming already in artifact SOP) and/or one Owner-Ops Note. Fields:

- **ID**  
- **Workflow**  
- **Requested evidence**  
- **Question it resolves**  
- **Preferred method** (screen-share / sample / screenshot / bounded export / confirmation)  
- **Security note** if needed (redact, no PII, no files required)  
- **Owner/source**  
- **Status**

### Statuses (checklist only — do not add DB enums)

| Status | Meaning |
|--------|---------|
| REQUESTED | Asked of the client |
| RECEIVED | File/sample retained (Drive) |
| DEMONSTRATED | Seen on call/screen-share; copy optional |
| PARTIAL | Useful but incomplete |
| NOT AVAILABLE | Client cannot provide |
| NOT NEEDED | Dropped after review |
| DEFERRED | Not required for this Blueprint finding |

---

## Sufficiency (no confidence scores)

**Strong enough:** actual workflow demonstrated; artifact reviewed; system record inspected; control shown; representative exception shown.

**Limited but usable:** client report plus one artifact; partial system view; small sample with a stated limitation.

**Insufficient for a material finding:** assertion only where proof is required; unresolved contradiction; missing authority/source-of-truth; vendor capability assumed.

Evidence need not statistically prove the whole process. If a recommendation depends on prevalence, defect rate, cycle time, or financial impact and no baseline exists: recommend **baseline measurement** — do not invent one, and do not turn the Blueprint into unpaid DMAIC Measure.

Vendor/current-tool capability: plan names and screenshots are direction only. Material claims need account verification, official vendor docs, or configuration review. Otherwise label **CAPABILITY VERIFICATION REQUIRED**.

---

## Before-call procedure

1. Stage A approved and saved.  
2. Evidence request prepared (5–10 minutes target).  
3. Client receives request; screen-share is explicitly acceptable.  
4. James tracks RECEIVED / still missing.  
5. Missing items become **call agenda demonstrations**, not a stall by default.  
6. One reminder before the call if needed. Do not send repeated chasers.

Client should feel they are sharing a few examples — not doing Peacemakers’ analysis.

---

## Evidence received before the call

1. Store only if retention is needed (Drive `01 Intake` or `03 Blueprint Call`).  
2. Update the evidence index + Owner-Ops Activity (`Evidence received: <ID>`).  
3. Light review: what it appears to support; what still needs live demonstration.  
4. Use it to focus the call.

Do **not** complete Stage B early. Do not promote CLIENT_REPORTED to VERIFIED from a file alone without call context.

---

## During-call evidence

Screen-share may be sufficient. Record:

- what was shown, by whom, date/call  
- material observation  
- whether a copy was retained  
- limitation  

A retained screenshot is **not** required if OBSERVED is enough and keeping the file adds risk. Update status to DEMONSTRATED.

---

## After-call follow-up

If a material question remains after ~90 minutes, choose one:

| Outcome | Action |
|---------|--------|
| **A — Material to a Stage B recommendation** | Request the smallest missing item before finalizing **that** finding |
| **B — Useful but not necessary** | Proceed; keep the item provisional / UNKNOWN |
| **C — New scope** | STOP. Route to implementation scoping, paid discovery, or client-internal follow-up |

Do not expand the Blueprint indefinitely. One consolidated post-call follow-up is enough. Automated reminders remain deferred.

---

## Stage B evidence gate

Missing evidence does **not** automatically block Stage B. It blocks only findings/recommendations that would otherwise be unsupported.

Before running Stage B, James should know:

- which requests were satisfied / partial / missing  
- which questionnaire claims were corroborated or contradicted  
- which conflicts remain open  
- which findings can be validated vs must stay provisional  

### Hard-stop a **finding** (not the whole Blueprint) if:

- financial/control recommendation depends on unreviewed evidence  
- source-of-truth conflict materially affects the recommendation  
- authority/approval rule is disputed  
- security/privacy requirement is unclear and consequential  
- vendor capability is material but unverified  
- contradiction cannot be bounded  
- implementation advice would rely on assumed technical capability  

Unrelated portions may still proceed.

### Provisional is allowed

Client Blueprint may say: requires verification; remains unresolved; provisional based on available evidence; validate before implementation; not enough evidence to recommend change.

Do not dump the evidence register into the client deliverable.

---

## Stage B input package (ChatGPT)

Upload only what is needed after AI preflight ([BLUEPRINT_ARTIFACT_HANDLING.md](./BLUEPRINT_ARTIFACT_HANDLING.md)):

- submitted questionnaire  
- Blueprint-call transcript/notes  
- evidence index (or equivalent Owner-Ops note)  
- only **material** supplemental samples  

Do not upload the entire engagement folder.

---

## Security / privacy

Before requesting or retaining:

- Do we actually need this?  
- Smaller sample / redact / screen-share instead of store?  
- AI allowed for this material?  
- Secrets, credentials, or unnecessary PII?  
- Destination = approved Google Workspace engagement folder if retained  

**Never request credentials.** Owner-Ops production uploads stay disabled (`DISABLE_CLIENT_UPLOADS=true`); paste-first notes only.

| Keep | When |
|------|------|
| **RETAIN** | Traceability, material support, later implementation, contractual record |
| **REFERENCE ONLY** | Screen-share/observation is enough |
| **DO NOT RETAIN** | Highly sensitive, secrets, unnecessary after observation, client forbids retention |

---

## Owner-Ops / Drive

| Store | Use |
|-------|-----|
| **Google Drive** | Retained samples; `evidence-index.md`; Stage A/B; transcript |
| **Owner-Ops** | Activity, NextAction, high-level reference (ID + status + Drive path). Do not duplicate files. |
| **Evidence hub** (`EvidenceSource` / `Finding` / `Conflict`) | Optional if already in use; **not required** for first clients if it creates double entry |

Preferred first-client path: Drive index + Owner-Ops Activity/NextAction.

---

## Client request template

Subject: `A few examples to make our Blueprint call useful`

> To make our Blueprint call as useful as possible, I’d like to look at a few representative examples of how these workflows actually operate.
>
> You do **not** need to prepare a large document package. A screen-share during the call, a redacted screenshot, or one normal example and one exception is usually enough.
>
> Please do **not** send passwords, login details, or unredacted personal/financial data. If something is sensitive, we can view it live on screen and I do not need a copy.
>
> **What would help:**
>
> 1. [Item — why in one sentence — screen-share OK]  
> 2. [Item]  
> 3. [Item]
>
> If any of these are hard to send, we can cover them on the call. Reply with what you can share ahead of time; the rest can wait.

Do not mention internal evidence classes. James reviews before send.

---

## Stop rules

STOP / do not chase further unpaid evidence if:

- the client is being asked to create analysis they do not already use  
- follow-up is becoming a second discovery project  
- remaining items are not material to Stage B  
- requested material would require credentials or unnecessary PII  
- vendor research would be open-ended  

Route excess work to paid discovery / Stage C — do not give it away.

---

## Owner quick checklist

- [ ] Stage A approved and saved same day  
- [ ] 3–8 (typical) minimum requests extracted; why + lowest-burden method stated  
- [ ] Security preflight; no credentials  
- [ ] One client message sent; screen-share offered  
- [ ] Owner-Ops Activity + NextAction recorded  
- [ ] Evidence index updated (REQUESTED → RECEIVED / DEMONSTRATED / …)  
- [ ] Before-call files: light review only — no Stage B  
- [ ] Call: missing items demonstrated where possible  
- [ ] After call: A / B / C decision for leftovers  
- [ ] Stage B package = questionnaire + notes + index + material samples only  
- [ ] Unsupported material findings stopped or labeled provisional  
- [ ] Client Blueprint does not include the evidence register  
