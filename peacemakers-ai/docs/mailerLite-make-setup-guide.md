# MailerLite + Make Setup Guide

Static-friendly implementation for:

**Formspree -> Make -> MailerLite -> Google Sheets**

Goal: checklist opt-ins from `local-service-ai-audit.html` are captured, sent to MailerLite, entered into the follow-up automation, optionally logged to Sheets, and flagged for owner follow-up.

---

## A) Required Accounts / Tools

1. **Formspree** (already in use)
2. **Make** (scenario automation)
3. **MailerLite** (email list + automation)
4. **Google Sheets** (optional lead tracker)
5. **Calendly** (optional in this flow, used for audit booking CTA)

---

## B) Data Fields to Pass

Use these fields as your canonical mapping:

- `name` (map from `full_name`)
- `email`
- `phone` (if present)
- `business_type` (map from `industry`)
- `lead_source`
- `lead_magnet`
- `funnel`
- `audience`
- `page_source`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `submitted_at`

Current form already posts:
- `full_name`
- `email`
- `phone`
- `industry` (business type)
- `lead_source`
- `lead_magnet`
- `funnel`
- `audience`
- `page_source`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `submitted_at`

---

## C) MailerLite Setup

### 1) Create Group

- **Group name:** `Local Service Checklist Leads`

### 2) Create Custom Fields (if not already present)

Recommended MailerLite custom fields:

- `phone`
- `business_type`
- `lead_source`
- `lead_magnet`
- `funnel`
- `audience`
- `page_source`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `submitted_at`

### 3) Create Automation

- **Automation name:** `Local Service Checklist Follow-Up`
- **Trigger:** *When subscriber joins group* `Local Service Checklist Leads`

### 4) Add 5-email sequence

Use `docs/mailerLite-email-build.md` for exact build-ready content.

Suggested CTA URL strategy:
- Primary CTA: `https://www.peacemakersai.com/local-service-ai-audit.html#book-audit`
- Or use your main booking URL if preferred (same destination as sitewide Calendly CTA).

---

## D) Make Scenario Setup

## Scenario outline

1. **Trigger:** Formspree submission received (webhook approach)
2. Parse / normalize payload fields
3. Upsert subscriber in MailerLite
4. Add subscriber to group `Local Service Checklist Leads`
5. Optional: append row in Google Sheets
6. Optional: send owner notification

### Step-by-step

### 1) Trigger module (Make)

Use one of these:

- **Preferred:** Custom Webhook in Make + Formspree webhook forwarding
- **Alternative:** Formspree integration trigger (if available on your Formspree plan)

In Formspree, configure a webhook endpoint pointing to your Make webhook URL.

> TODO: Use your real Make webhook URL (never commit it to repo docs with secret query params).

### 2) Parse submission fields

Map Formspree payload:

- `full_name` -> `name`
- `email` -> `email`
- `phone` -> `phone`
- `industry` -> `business_type`
- plus hidden fields and UTM fields directly

Normalize blank values:
- If `phone` missing -> set empty string
- If UTM missing -> set empty string
- If `submitted_at` missing -> set scenario timestamp

### 3) MailerLite: Add/Update subscriber

In Make:
- Module: **MailerLite - Create/Update Subscriber**
- Key: `email`
- Map all custom fields from section B

### 4) MailerLite: Add subscriber to group

In Make:
- Module: **MailerLite - Add Subscriber to Group**
- Group: `Local Service Checklist Leads`

This step is what triggers the automation if trigger = "joins group."

### 5) Google Sheets row (optional)

In Make:
- Module: **Google Sheets - Add a Row**
- Spreadsheet tab: `Local Service Checklist Leads`
- Map fields to your tracker columns (see section E)

### 6) Owner notification (optional)

Use one:
- Email by Make
- Slack message
- SMS (if desired)

Include:
- Name, email, phone, business_type
- lead_source, funnel
- UTM values
- link to checklist page and audit page

### 7) Error handling

In Make:
- Add error handler route for MailerLite/Sheets failures
- On error: send owner alert with payload + error message
- Enable retry for transient failures

---

## E) Google Sheets Lead Tracker (recommended columns)

Create tab: `Local Service Checklist Leads`

Columns:

1. Date
2. Name
3. Email
4. Phone
5. Business Type
6. Lead Source
7. Lead Magnet
8. Funnel
9. Audience
10. UTM Source
11. UTM Medium
12. UTM Campaign
13. Audit Booked?
14. Status
15. Next Action
16. Notes

---

## F) Testing Checklist

1. Submit test lead on `local-service-ai-audit.html`
2. Confirm Formspree received submission
3. Confirm Make scenario runs
4. Confirm MailerLite subscriber created/updated
5. Confirm subscriber is in group `Local Service Checklist Leads`
6. Confirm MailerLite automation starts
7. Confirm Google Sheets row created (if enabled)
8. Confirm owner notification arrives (if enabled)
9. Confirm checklist link works (`local-service-ai-checklist.html`)
10. Confirm audit CTA destination works (Calendly / audit anchor)

---

## G) Troubleshooting

### 1) Make does not trigger
- Confirm Formspree webhook is enabled and points to active Make webhook URL.
- Re-run webhook "Listen for data" mode in Make.
- Verify submission actually reaches Formspree first.

### 2) MailerLite rejects subscriber
- Check required fields and email format.
- Verify API connection in Make is active.
- Confirm subscriber not suppressed/unsubscribed in a way your workspace blocks.

### 3) Fields not mapping correctly
- Inspect raw webhook payload in Make history.
- Confirm exact source keys: `full_name`, `industry`, hidden fields.
- Re-map and test with a fresh sample submission.

### 4) Duplicate subscribers
- Always upsert by email (create/update) instead of create-only.
- Keep one source of truth for email address format.

### 5) Automation not starting
- Confirm trigger is **joins group** `Local Service Checklist Leads`.
- Confirm Make adds subscriber to that exact group.
- Check MailerLite automation status is "Active."

### 6) Google Sheets row missing
- Confirm sheet + tab name are correct.
- Check Make permission scope for Sheets connection.
- Verify no required column mapping is missing.

### 7) Emails going to spam
- Set up SPF/DKIM/DMARC on sending domain.
- Avoid spammy subject lines and over-promotional phrasing.
- Include plain-text friendly content and real sender identity.

### 8) UTM fields blank
- This is normal for direct traffic.
- UTMs only populate when links include query params.
- Keep fields optional in MailerLite and Sheets.

---

## Exact Automation Path (Documented)

`local-service-ai-audit.html form -> Formspree -> Make webhook -> MailerLite subscriber upsert -> MailerLite group add -> MailerLite automation start -> (optional) Google Sheets row + owner notification`

