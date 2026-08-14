# Client deliverable templates

Reusable templates for paid **Business Blueprint** engagements and post-Blueprint **Implementation** SOWs.

Blueprint filenames retain `ai-opportunity-blueprint-*` for continuity with the public offer path. Cover title and engagement language use **Business Blueprint**. A broader product rename is a separate decision — do not rename website/offer pages in this template pass.

## What this is

The **client-facing Blueprint** is the sold diagnostic deliverable. Fill one copy per engagement after questionnaire evidence and Blueprint discovery work are ready for recommendation drafting (Stage B → James review → client HTML/PDF).

The **Implementation Statement of Work** is a separate commercial document used only after Stage C + James approval. See [implementation-sow-template.md](./implementation-sow-template.md) and [../STAGE_C_IMPLEMENTATION_COMMERCIAL_WORKFLOW.md](../STAGE_C_IMPLEMENTATION_COMMERCIAL_WORKFLOW.md).

These files are **templates only**. Automated Blueprint generation remains deferred ([../future-blueprint-generator-contract.md](../future-blueprint-generator-contract.md)).

Acceptance reference for client-facing Blueprint structure and commercial boundaries:

`owner-ops/docs/acceptance/harbor-ridge-blueprint-rehearsal/`  
(`FICTIONAL HARBOR RIDGE BLUEPRINT — CLIENT DELIVERABLE ACCEPTANCE PASSED`)

## Files

| File | Audience | Classification | Use |
|------|----------|----------------|-----|
| [ai-opportunity-blueprint-template.html](./ai-opportunity-blueprint-template.html) | Client (after James approval) | **REUSE + ALIGN** | **Preferred Blueprint delivery format** — visual, print/PDF-ready |
| [ai-opportunity-blueprint-template.md](./ai-opportunity-blueprint-template.md) | Drafting / Git | **REUSE + ALIGN** | Same Blueprint outline for drafting |
| [ai-opportunity-blueprint-internal-plan-template.md](./ai-opportunity-blueprint-internal-plan-template.md) | Owner only | **KEEP SEPARATE** | Implementation companion; do not send by default |
| [implementation-sow-template.md](./implementation-sow-template.md) | Client (after Stage C + James approval) | **REUSE + ALIGN** | Implementation Statement of Work → DOCX → PandaDoc draft |
| [ai-opportunity-blueprint-example-cedar-ridge.html](./ai-opportunity-blueprint-example-cedar-ridge.html) | Internal | **KEEP SEPARATE / DEFER** | Historical sample; not the claim-safe structure |

## When to use

1. Agreement signed + Blueprint paid (commercial gate).
2. Questionnaire submitted (or sufficient accepted evidence).
3. Blueprint discovery call / findings reviewed; Stage B approved.
4. Duplicate the **HTML** template → fill placeholders from Stage B (client language) → open in browser → Print → Save as PDF → James approves → deliver.

## Naming

```text
AI-Opportunity-Blueprint — {Company Name} — {YYYY-MM-DD}.html
AI-Opportunity-Blueprint — {Company Name} — {YYYY-MM-DD}.pdf
```

Optional markdown working copy / internal companion:

```text
AI-Opportunity-Blueprint — {Company Name} — {YYYY-MM-DD}.md
AI-Opportunity-Blueprint-Internal — {Company Name} — {YYYY-MM-DD}.md
```

## Canonical client outline (locked)

1. Cover
2. Blueprint at a Glance
3. Executive summary *(including what needs attention now vs not yet)*
4. Engagement scope
5. Priority workflow findings *(What we confirmed / Where it breaks / Why it matters / Unresolved)*
6. Root-cause themes *(3–5 themes actually present; provisional causes separate)*
7. Controls to preserve
8. Recommended action plan *(Now / Next / Later·conditional / Not currently justified)*
9. What we are not recommending — yet
10. Priority / readiness map
11. Current technology position
12. Future AI & automation opportunities *(watchlist — Potential Future Fit only; omit if none are credible)*
13. Measurement
14. Leadership decisions required
15. Recommended next step

Do not invent alternate top-level sections for ordinary engagements. Add subsections inside these headings if needed. Do not default to dumping the full Stage B evidence register, taxonomy teaching, or internal decision numbering into the client PDF.

**Future AI/automation is not the recommendation portfolio.** Items are conditional watchlist candidates. They do not enter Stage C unless leadership later selects a current recommendation or readiness work and James approves.

## Visual standards

- **Brand first:** Cover leads with the **Peacemakers AI dove logo** (`assets/peacemakers-ai-logo.jpg`) as a hero brand mark, then the document title and client name. Keep the logo file next to the HTML (or under `assets/`) so Print → PDF resolves it.
- **Colors:** Navy `#1b2a41`, accent teal `#2f6f68`, quiet paper body (soft gray-green). Avoid purple gradients and generic AI-glow looks.
- **Typography:** Source Serif 4 for titles; Manrope for body.
- **Diagrams:** Optional. Prefer plain findings for first clients. If diagrams help, keep them inside a workflow or technology section — never as a fixed calendar implementation promise.
- **Print / PDF:** Browser File → Print → Save as PDF (Letter). TOC is screen-only (`no-print`). Confirm cover logo path resolves.
- **Placeholders:** Master HTML highlights unfilled `{{…}}` in soft yellow. Client samples must have **zero** instructional sentences left visible.

## Implementation SOW (post–Stage C)

1. Stage C approved; commercial inputs set by James.
2. Duplicate [implementation-sow-template.md](./implementation-sow-template.md) → fill `{{…}}` from approved Stage C only.
3. Strip the top HTML comment block and any remaining internal notes.
4. Export DOCX → upload PandaDoc draft ([../../../billing/docs/pandadoc-setup.md](../../../billing/docs/pandadoc-setup.md)).
5. James reviews → dual-approve send → Stripe custom invoice → Implementation Active only after signed + required payment + access.

Status marker on the template: `IMPLEMENTATION SOW TEMPLATE — REQUIRES STAGE C + JAMES APPROVAL`.

## Commercial boundary

The Business Blueprint includes diagnostic and recommendation work. Implementation is separately scoped and contracted after the client selects Proposed recommendations.

Do **not** include in the client Blueprint:

- Stage C / detailed WBS / architecture / configuration design
- Implementation price or fixed implementation duration
- Guaranteed savings or ROI
- Unsupported vendor capability claims
- Fixed calendar “implementation roadmap” promises

## Rules

- **James must approve** before any client delivery.
- Prefer simplest reliable solutions ([../future-recommendation-philosophy.md](../future-recommendation-philosophy.md)).
- **No fabricated ROI or savings.**
- Distinguish validated findings from unresolved items.
- Optimize existing software before recommending new tools.
- AI and new software appear under **Not currently justified** unless Stage B gates support them.
- Future AI/automation opportunities, if shown, must be labeled **Potential Future Fit** (or equivalent) and must not read as current implementation recommendations.

## Not the same as the Review Packet or internal plan

| Artifact | Purpose |
|----------|---------|
| Blueprint Review Packet (in Owner Ops) | Evidence-only call/prep packet; no recommendations |
| Business Blueprint (this template) | Sold client deliverable |
| Internal plan template | Owner-only companion after client selects implementation candidates |

## Related docs

- [../future-blueprint-generator-contract.md](../future-blueprint-generator-contract.md) — future generator I/O
- [../future-recommendation-philosophy.md](../future-recommendation-philosophy.md) — recommendation checklist
- [../future-current-software-research-contract.md](../future-current-software-research-contract.md) — time-sensitive tool research rules
- [../acceptance/harbor-ridge-blueprint-rehearsal/](../acceptance/harbor-ridge-blueprint-rehearsal/) — fictional acceptance reference
