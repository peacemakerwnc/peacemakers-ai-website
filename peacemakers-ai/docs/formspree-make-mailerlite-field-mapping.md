# Formspree -> Make -> MailerLite -> Google Sheets Field Mapping

## 1. Purpose

This document exists to prevent mapping mistakes when connecting the local service checklist form to MailerLite and Google Sheets through Make.

Use it as the canonical reference for:
- source field names
- transformation rules
- destination mappings
- default values
- pass/fail validation

---

## 2. Funnel Path

`local-service-ai-audit.html` checklist form  
-> Formspree submission  
-> Make webhook/scenario  
-> MailerLite subscriber create/update  
-> MailerLite group: `Local Service Checklist Leads`  
-> MailerLite automation: `Local Service Checklist Follow-Up`  
-> Google Sheets lead tracker row  
-> owner notification

---

## 3. Source Fields From Form

| Source field name | Field type | Required? | Example value | Notes |
|---|---|---:|---|---|
| `name` | Text | Yes | `Test Owner` | Map from form `full_name` |
| `email` | Email/Text | Yes | `test@example.com` | Primary unique key for subscriber upsert |
| `phone` | Text | No | `555-555-5555` | Leave blank if not provided |
| `business_type` | Text | Yes | `HVAC` | Map from form `industry` |
| `lead_source` | Text | Yes | `local-service-ai-audit-page` | Hidden field in form |
| `lead_magnet` | Text | Yes | `7-ai-workflows-local-service` | Hidden field in form |
| `funnel` | Text | Yes | `service-business-ai-audit` | Hidden field in form |
| `audience` | Text | Yes | `local-service-business` | Hidden field in form |
| `page_source` | Text | Yes | `local-service-ai-audit.html` | Hidden field value may be `local-service-checklist`; normalize if needed |
| `utm_source` | Text | No | `tiktok` | Optional; often blank for direct traffic |
| `utm_medium` | Text | No | `organic` | Optional; often blank for direct traffic |
| `utm_campaign` | Text | No | `day-01-missed-calls` | Optional; often blank for direct traffic |
| `submitted_at` | Datetime | Optional | `2026-05-08T07:10:00Z` | If missing from payload, set in Make using execution timestamp |

---

## 4. Make Variable Mapping

| Formspree field | Make variable name | Transformation needed? | Example output | Notes |
|---|---|---|---|---|
| `full_name` | `lead_name` | `trim()` | `Test Owner` | Remove leading/trailing spaces |
| `email` | `lead_email` | `trim().toLowerCase()` | `test@example.com` | Normalize for reliable upsert |
| `phone` | `lead_phone` | If blank, keep empty string | `555-555-5555` | Do not inject fake values |
| `industry` | `lead_business_type` | If blank, set `Unknown` | `HVAC` | Required downstream for reporting |
| `lead_source` | `lead_source` | None | `local-service-ai-audit-page` | Hidden field |
| `lead_magnet` | `lead_magnet` | None | `7-ai-workflows-local-service` | Hidden field |
| `funnel` | `lead_funnel` | None | `service-business-ai-audit` | Hidden field |
| `audience` | `lead_audience` | None | `local-service-business` | Hidden field |
| `page_source` | `lead_page_source` | Optional normalize | `local-service-ai-audit.html` | Use canonical page string if needed |
| `utm_source` | `lead_utm_source` | If blank, set `direct/unknown` | `tiktok` | Keep consistent fallback value |
| `utm_medium` | `lead_utm_medium` | If blank, set `direct/unknown` | `organic` | Keep consistent fallback value |
| `utm_campaign` | `lead_utm_campaign` | If blank, set `direct/unknown` | `day-01-missed-calls` | Keep consistent fallback value |
| `submitted_at` | `lead_submitted_at` | If missing, set Make timestamp | `2026-05-08T07:10:00Z` | ISO-8601 preferred |

---

## 5. MailerLite Custom Field Mapping

| MailerLite field name | Field type | Source from Make | Example value | Required? | Notes |
|---|---|---|---|---:|---|
| `name` | Text | `lead_name` | `Test Owner` | Yes | Standard subscriber field |
| `email` | Email | `lead_email` | `test@example.com` | Yes | Upsert key |
| `phone` | Text | `lead_phone` | `555-555-5555` | No | Optional |
| `business_type` | Text | `lead_business_type` | `HVAC` | Yes | Custom field |
| `lead_source` | Text | `lead_source` | `local-service-ai-audit-page` | Yes | Custom field |
| `lead_magnet` | Text | `lead_magnet` | `7-ai-workflows-local-service` | Yes | Custom field |
| `funnel` | Text | `lead_funnel` | `service-business-ai-audit` | Yes | Custom field |
| `audience` | Text | `lead_audience` | `local-service-business` | Yes | Custom field |
| `page_source` | Text | `lead_page_source` | `local-service-ai-audit.html` | Yes | Custom field |
| `utm_source` | Text | `lead_utm_source` | `tiktok` | No | Custom field |
| `utm_medium` | Text | `lead_utm_medium` | `organic` | No | Custom field |
| `utm_campaign` | Text | `lead_utm_campaign` | `day-01-missed-calls` | No | Custom field |
| `submitted_at` | Date/Datetime (Text acceptable) | `lead_submitted_at` | `2026-05-08T07:10:00Z` | Yes | Custom field |

**Group:** `Local Service Checklist Leads`  
**Automation Trigger:** Subscriber joins group `Local Service Checklist Leads`

---

## 6. Google Sheets Column Mapping

| Google Sheets column | Source field | Example value | Manual or automated? | Notes |
|---|---|---|---|---|
| Date | `lead_submitted_at` (or Make timestamp) | `2026-05-08T07:10:00Z` | Automated | Use ISO format |
| Name | `lead_name` | `Test Owner` | Automated |  |
| Email | `lead_email` | `test@example.com` | Automated |  |
| Phone | `lead_phone` | `555-555-5555` | Automated | May be blank |
| Business Type | `lead_business_type` | `HVAC` | Automated | Default `Unknown` if missing |
| Lead Source | `lead_source` | `local-service-ai-audit-page` | Automated |  |
| Lead Magnet | `lead_magnet` | `7-ai-workflows-local-service` | Automated |  |
| Funnel | `lead_funnel` | `service-business-ai-audit` | Automated |  |
| Audience | `lead_audience` | `local-service-business` | Automated |  |
| Page Source | `lead_page_source` | `local-service-ai-audit.html` | Automated |  |
| UTM Source | `lead_utm_source` | `tiktok` | Automated | Default `direct/unknown` |
| UTM Medium | `lead_utm_medium` | `organic` | Automated | Default `direct/unknown` |
| UTM Campaign | `lead_utm_campaign` | `day-01-missed-calls` | Automated | Default `direct/unknown` |
| Audit Booked? | Default value | `No` | Automated default, then manual updates | Set default on insert |
| Status | Default value | `New Lead` | Automated default, then manual updates | Set default on insert |
| Next Action | Default value | `Monitor email engagement` | Automated default, then manual updates | Set default on insert |
| Notes | Static default or blank | `Imported via Make` | Automated or Manual | Update manually after review |

Default values required:
- `Audit Booked? = No`
- `Status = New Lead`
- `Next Action = Monitor email engagement`

---

## 7. Owner Notification Mapping

**Subject:**  
`New Local Service Checklist Lead: {{business_type}} - {{name}}`

**Body template:**

New checklist lead received.

Name: {{name}}  
Email: {{email}}  
Phone: {{phone}}  
Business Type: {{business_type}}  
Lead Source: {{lead_source}}  
Lead Magnet: {{lead_magnet}}  
Funnel: {{funnel}}  
UTM Source: {{utm_source}}  
UTM Medium: {{utm_medium}}  
UTM Campaign: {{utm_campaign}}  
Recommended Next Action: Monitor email engagement and invite audit if engaged  
Tracker Row: {{google_sheet_row_link_or_row_number}}

---

## 8. Make Scenario Step-by-Step

1. Create custom webhook in Make
2. Connect Formspree webhook to Make
3. Submit test form
4. Confirm Make receives sample payload
5. Add MailerLite create/update subscriber module
6. Map fields
7. Add subscriber to `Local Service Checklist Leads` group
8. Add Google Sheets row
9. Add owner notification email
10. Add error handler
11. Run test
12. Turn scenario on

---

## 9. Error Handling Rules

- **Missing email:** stop scenario and notify owner
- **Invalid email:** stop scenario and notify owner
- **Duplicate email:** update subscriber instead of creating duplicate
- **Missing business type:** set to `Unknown`
- **Missing UTM fields:** set to `direct/unknown`
- **MailerLite failure:** retry and notify owner
- **Google Sheets failure:** continue MailerLite flow but notify owner
- **Owner notification failure:** log error but do not stop lead capture

---

## 10. Test Payload

```yaml
name: Test Owner
email: test@example.com
phone: 555-555-5555
business_type: HVAC
lead_source: local-service-ai-audit-page
lead_magnet: 7-ai-workflows-local-service
funnel: service-business-ai-audit
audience: local-service-business
page_source: local-service-ai-audit.html
utm_source: tiktok
utm_medium: organic
utm_campaign: day-01-missed-calls
```

---

## 11. Final Pass/Fail Checklist

- [ ] Formspree receives form
- [ ] Make receives payload
- [ ] Email is normalized
- [ ] MailerLite subscriber created/updated
- [ ] Subscriber added to correct group
- [ ] Automation starts
- [ ] Google Sheets row created
- [ ] Owner notification sent
- [ ] Checklist page link works
- [ ] Audit CTA works
- [ ] Test lead can be identified by source/funnel

