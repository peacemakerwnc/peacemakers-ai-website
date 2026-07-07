# Local Service Checklist Funnel — Manual Test Script

Use this script to validate the full static funnel:
`local-service-ai-audit.html` -> Formspree -> Make -> MailerLite -> (optional) Google Sheets -> Checklist page -> Audit CTA

---

## 1) Pre-test setup

- Confirm these pages are deployed and reachable:
  - `/local-service-ai-audit.html`
  - `/local-service-ai-checklist.html`
- Confirm Formspree endpoint is active (`https://formspree.io/f/maqaaddz`).
- In Make:
  - Scenario is **ON**
  - Webhook is active
- In MailerLite:
  - Group exists: `Local Service Checklist Leads`
  - Automation exists: `Local Service Checklist Follow-Up`
  - Trigger is “joins group”
- In Google Sheets (optional):
  - Target sheet + tab exists
  - Column order matches template

---

## 2) Test identity to use

Use a dedicated test contact:

- Name: `Test Local Service Lead`
- Email: `your+localservice-test@yourdomain.com`
- Phone: `555-0100` (or blank)
- Business type: `HVAC` (or any available option)

Use a UTM test URL when possible, for example:

`https://www.peacemakersai.com/local-service-ai-audit.html?utm_source=test&utm_medium=manual&utm_campaign=checklist-funnel-qa`

---

## 3) Step-by-step test

| Step | Action | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| 1 | Open local service audit page | Page loads with checklist form visible |  |  |
| 2 | Submit checklist form with test identity | Submission succeeds (no JS errors) |  |  |
| 3 | Observe on-page success state | Success message appears |  |  |
| 4 | Verify next-step reveal | “Open the Checklist” block appears |  |  |
| 5 | Click “Open the Checklist” | `local-service-ai-checklist.html` opens and loads |  |  |
| 6 | Click checklist page audit CTA | Calendly opens (new tab/popup) |  |  |
| 7 | Check Formspree dashboard | Submission exists with hidden/source fields |  |  |
| 8 | Check Make scenario history | Scenario triggered, no failed module |  |  |
| 9 | Check MailerLite subscriber | Subscriber created/updated |  |  |
|10| Check MailerLite group membership | Subscriber in `Local Service Checklist Leads` |  |  |
|11| Check automation enrollment | Subscriber entered 5-email sequence |  |  |
|12| Check Google Sheets (optional) | New row created with mapped fields |  |  |
|13| Check owner notification (optional) | Owner alert received |  |  |

---

## 4) If a step fails, what to fix

- **Step 2 fails (form submit):**
  - Verify Formspree endpoint in page source
  - Check browser console/network for request errors
- **Step 4 fails (reveal block missing):**
  - Confirm form has `data-success-reveal="#checklist-open-block"`
  - Confirm reveal element ID exists and uses class `is-hidden`
- **Step 8 fails (Make not triggered):**
  - Re-check Formspree webhook URL in Make
  - Re-enable scenario and webhook listener
- **Step 10/11 fails (MailerLite):**
  - Check API connection
  - Confirm group name exact match
  - Confirm automation trigger uses group join
- **Step 12 fails (Sheets):**
  - Check spreadsheet permissions and module mapping
- **Step 6 fails (Calendly):**
  - Confirm `data-calendly-url` exists and script loads

---

## 5) Post-test cleanup

- Tag or delete test lead in MailerLite
- Mark test row in Google Sheets as QA
- Keep one final passing QA row as reference

