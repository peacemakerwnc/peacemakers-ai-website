# Every-other-day blog article automation

This repo publishes the **AI for Small Business** cluster on a mixed cadence:

- **Every other day (Sep 23, 2026 – ~Dec 2026):** continuity / bonus guides (`batch7–9`), with dates shifted off tool-stack Mondays when they collide
- **Weekly Mondays (Oct 5, 2026 – Mar 15, 2027):** **AI Implementation Tool Stack** (`batch10–11`) — Notion, Wispr Flow, Apollo, Perplexity, Zapier/Make/n8n, and related implementation tools

Batches **1–6 are live**. The GitHub Action runs **daily** and publishes at most one due article (so both cadences share the same publisher).

## Review (Sept 2026)

| Finding | Detail |
|---------|--------|
| Prior cadence | Weekly Monday batches via GitHub Actions |
| Gap | Batch 7 content existed but stayed `pending` after Aug 31; no queue beyond it |
| Catch-up risk | Batches 4–6 all published the same day (Aug 25), which spikes then stalls SEO |
| Fix | Article-level schedule + daily Action that publishes **one** due post |

## Schedule

Source of truth: `peacemakers-ai/scripts/small-business-articles/batch-schedule.json` → `articles[]`

| Window | Count | Modules | Cadence |
|--------|-------|---------|---------|
| Sep 23 – ~Dec 2026 | ~45 | `batch7–9.py` | Every other day (shifted off tool Mondays) |
| **Oct 5, 2026 – Mar 15, 2027** | **24** | `batch10.py` + `batch11.py` (**Implementation Tool Stack**) | **Weekly Mondays** |

The Action runs **daily** and no-ops when nothing is due.

### AI Implementation Tool Stack (weekly, starts October)

Starts **Monday, October 5, 2026** with `ai-implementation-tool-stack-for-small-business`, then one tool-focused post each Monday through **March 15, 2027**: Notion, Wispr Flow, Apollo, Perplexity, Claude vs ChatGPT, Zapier/Make/n8n, Futurepedia discovery, Calendly, CRM AI, Loom, Workspace copilots, Stripe, Fireflies, Cursor, Slack, Airtable, Canva/Figma, security, ROI, starter stacks, the Peacemakers weekly playbook, and anti-sprawl governance.

## Automatic publish (GitHub Actions)

Workflow: `.github/workflows/weekly-small-business-blog.yml` (every-other-day article publisher)

Every day at 9:00 AM Eastern the workflow:

1. Finds the next unpublished article with `scheduled_date <= today`
2. Confirms its `module` exists
3. Marks it published, regenerates HTML for published articles only, updates `sitemap.xml` + resources count
4. Deploys to Vercel production (when secrets are set)
5. Commits the published artifacts back to `main`

**Required GitHub secrets** (Settings → Secrets and variables → Actions):

| Secret | Value |
|--------|--------|
| `VERCEL_TOKEN` | Vercel token with deploy access |
| `VERCEL_ORG_ID` | `team_dIb4nfhx01tSybQ9270iqCRN` (from `.vercel/project.json`) |
| `VERCEL_PROJECT_ID` | `prj_8KM9svAAdgkuoTiLUEiVo1xhMwfT` |
| `VERCEL_SCOPE` | `peacemakers-ai` (optional; defaults in script) |

**One-time:** create the `blog-batch` label (fallback issues if a module is missing).

**Manual trigger:** Actions → Every-Other-Day Small Business Blog Article → Run workflow (optional slug).

## Local publish commands

```bash
# Dry-run next due article
python3 peacemakers-ai/scripts/publish-due-batch.py --dry-run

# Publish due article locally (no deploy)
python3 peacemakers-ai/scripts/publish-due-batch.py

# Publish + deploy
python3 peacemakers-ai/scripts/publish-due-batch.py --deploy

# Force a specific slug
python3 peacemakers-ai/scripts/publish-due-batch.py --force-slug ai-for-inventory-management-and-forecasting --deploy

# Simulate a future date
python3 peacemakers-ai/scripts/publish-due-batch.py --date 2026-09-23 --dry-run
```

## Files

- `batch-schedule.json` — historical batches + `articles[]` queue
- `briefs.py` — slug/title/keyword lookup (includes 201–236)
- `batch1.py` … `batch9.py` — article content modules
- `publish-due-batch.py` — article (or legacy batch) publish pipeline
- `generate-small-business-blog-html.py` — builds HTML for **published** articles only
- `build-eod-article-queue.py` — one-shot generator used to create the Fall 2026 queue
