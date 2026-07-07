# Google Sheets Lead Tracker Template

Use this for checklist leads captured through:
`local-service-ai-audit.html` -> Formspree -> Make -> Google Sheets

---

## 1) Column Headers (copy/paste row)

```csv
Date,Name,Email,Phone,Business Type,Lead Source,Lead Magnet,Funnel,Audience,UTM Source,UTM Medium,UTM Campaign,Audit Booked?,Status,Next Action,Notes
```

---

## 2) Field Descriptions

- **Date**: Submission timestamp (`submitted_at` or Make runtime timestamp)
- **Name**: Lead name (`full_name`)
- **Email**: Lead email
- **Phone**: Optional phone
- **Business Type**: `industry` field from form
- **Lead Source**: `lead_source` (expected: `local-service-ai-audit-page`)
- **Lead Magnet**: `lead_magnet` (expected: `7-ai-workflows-local-service`)
- **Funnel**: `funnel` (expected: `service-business-ai-audit`)
- **Audience**: `audience` (expected: `local-service-business`)
- **UTM Source / Medium / Campaign**: optional attribution fields
- **Audit Booked?**: manual yes/no status
- **Status**: pipeline stage
- **Next Action**: what to do next
- **Notes**: freeform context

---

## 3) Example Row

```csv
2026-05-08T07:10:00Z,Jordan Smith,jordan@example.com,828-555-0133,HVAC,local-service-ai-audit-page,7-ai-workflows-local-service,service-business-ai-audit,local-service-business,instagram,reel,spring-checklist,No,New,Check MailerLite sequence status,Requested checklist from local service page
```

---

## 4) Status Dropdown Values

Suggested values:

- New
- Synced to MailerLite
- Sequence Active
- Replied
- Audit Invited
- Audit Booked
- Qualified
- Not Qualified
- Closed Won
- Closed Lost

---

## 5) Next Action Dropdown Values

Suggested values:

- Confirm MailerLite sync
- Check sequence enrollment
- Send personal follow-up
- Invite to audit
- Confirm audit booking
- Mark qualified/disqualified
- No action

---

## 6) Simple Weekly Review Section (top of sheet or separate tab)

Track weekly:

- New leads this week
- Leads synced to MailerLite
- Sequence active count
- Audit bookings this week
- Conversion: New leads -> Audit booked
- Top business types this week
- Top UTM source this week

---

## 7) What to Update Manually

These fields are usually manual unless you automate all downstream events:

- **Audit Booked?**
- **Status**
- **Next Action**
- **Notes**

If you later connect Calendly event data into Make, you can auto-update `Audit Booked?`.

