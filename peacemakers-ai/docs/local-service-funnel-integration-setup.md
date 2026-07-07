# Local Service Checklist Funnel — Integration Setup (Static Site Friendly)

This repo is a static site. The funnel is designed to work without a backend.

## Current static-site flow (what exists today)

For exact field-level mapping and default/transformation rules, see:
`docs/formspree-make-mailerlite-field-mapping.md`

### Pages

- `local-service-ai-audit.html`
  - Captures checklist requests via Formspree (lead capture)
  - Shows a success message (no redirect)
  - Reveals an “Open the Checklist” link/button after success
  - “Book an AI Opportunity Audit” opens Calendly via `data-calendly-link`
- `local-service-ai-checklist.html`
  - Hosted checklist content (lead magnet delivery page)
- `script.js`
  - Handles Formspree submission + success messaging
  - Supports `data-success-redirect="none"` and `data-success-reveal="#selector"`

### Form capture

Checklist request form posts to Formspree:
- Endpoint: `https://formspree.io/f/maqaaddz`
- Hidden funnel fields included:
  - `lead_source = local-service-ai-audit-page`
  - `lead_magnet = 7-ai-workflows-local-service`
  - `funnel = service-business-ai-audit`
  - `audience = local-service-business`
  - plus UTM fields (utm_source/utm_medium/utm_campaign) when present

## Recommended simple flow

1) Visitor opts in on `local-service-ai-audit.html#checklist`
2) Formspree captures lead + hidden fields
3) On-page success message appears + “Open the Checklist” button is shown
4) Email automation sends:
   - Email 1 with the checklist link
   - 4 follow-ups (see `docs/local-service-checklist-email-sequence.md`)
5) CTA throughout drives to Calendly (Audit booking)

## Lead magnet delivery options

### Option A (fastest): link delivery

Deliver the checklist as a hosted page URL:
`https://www.peacemakersai.com/local-service-ai-checklist.html`

Pros:
- No asset hosting required
- Easy to update

Cons:
- Not “gated” (anyone with link can view). For many service funnels, this is acceptable.

### Option B: PDF delivery (later)

Pros:
- Easy to attach/send

Cons:
- Requires a PDF asset and delivery automation

## Connecting Formspree to email platforms

Formspree can forward submissions via email, webhooks, or integrations depending on your plan.

### Method 1: Formspree → Zapier / Make → Email platform (recommended)

Use a no-code integration platform:

- **Trigger**: Formspree new submission
- **Filter**: `lead_magnet == 7-ai-workflows-local-service`
- **Actions**:
  1) Create/Update subscriber in your email platform
  2) Apply tags/fields:
     - tag: `service-business-ai-audit`
     - tag: `lead-magnet-7-ai-workflows`
     - custom fields: industry, phone (optional), utm_source, utm_campaign
  3) Start automation / sequence: “Local Service Checklist”

Supported email tools (choose one):
- MailerLite
- ConvertKit
- Beehiiv (newsletter-focused)
- GoHighLevel (often used by service businesses)
- ActiveCampaign (more advanced)

### Method 2: Formspree webhook → your automation tool

If you prefer fewer tools, you can use Formspree webhooks and send the payload into a service that supports it.

**Important**: do not add API keys into this repo.

## Suggested tags / fields to pass

Minimum:
- Email
- Name

Helpful:
- Business Type (industry)
- Phone
- Funnel fields:
  - `funnel`
  - `lead_source`
  - `lead_magnet`
  - `audience`
- UTM fields:
  - utm_source / utm_medium / utm_campaign

## Calendly booking path

The site uses `data-calendly-url` on the `<html>` element to set the audit booking URL.

To change the booking link globally, update the attribute in the page HTML (or standardize it across pages):
- `data-calendly-url="..."`

## Testing checklist

1) Run locally:

```bash
cd peacemakers-ai
python3 -m http.server 5173
```

2) Visit:
- `http://localhost:5173/local-service-ai-audit.html`
- Fill the checklist form and submit
- Confirm:
  - success message appears
  - “Open the Checklist” appears
  - “Book an AI Opportunity Audit” opens Calendly in a new tab/popup

3) Confirm lead capture:
- Check Formspree submissions
- Verify hidden fields exist in the payload

4) Confirm email automation:
- Submit with a test email
- Confirm Email 1 arrives and links to the checklist

## Troubleshooting

- **Form doesn’t submit**:
  - Confirm Formspree endpoint is correct in `action=""`.
  - Check browser console for network errors.
- **Success message appears but checklist link doesn’t show**:
  - Confirm form has `data-success-reveal="#checklist-open-block"`.
  - Confirm the element exists and has `id="checklist-open-block"` + class `is-hidden`.
- **No emails**:
  - If you’re relying on Formspree email notifications, confirm your Formspree settings.
  - If using Zapier/Make, confirm the trigger and filters.
- **Calendly not opening**:
  - Ensure the page includes the Calendly widget script (it does).
  - Confirm `data-calendly-url` is present on `<html>`.

