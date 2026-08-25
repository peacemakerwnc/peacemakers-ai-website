# Weekly blog batch automation

This repo publishes the **AI for Small Business** cluster in 7 weekly batches. Batches **1–3 are live**. Batches **4–7 are pre-written** and scheduled for the next four Mondays.

## Schedule

| Batch | Publish Monday | Briefs | Status |
|-------|----------------|--------|--------|
| 1 | Jul 7, 2026 | 1, 8, 4, 25, 21 | Published |
| 2 | July 14 | 5, 12, 17, 18, 22, 36 | Published (2026-07-20) |
| 3 | July 21 | 2, 7, 10, 14, 23, 28 | Published (2026-08-08) |
| 4 | **Aug 10, 2026** | 6, 15, 39, 32, 35 | Pending (queued) |
| 5 | **Aug 17, 2026** | 9, 11, 24, 26, 33, 34, 38 | Pending (queued) |
| 6 | **Aug 24, 2026** | 3, 13, 20, 37, 30, 16, 27, 19, 29, 31 | Pending (queued) |
| 7 | **Aug 31, 2026** | Bonus 101–110 | Pending (queued) |

Source of truth: `peacemakers-ai/scripts/small-business-articles/batch-schedule.json`

HTML is generated **only for published batches**, so queued modules stay offline until their Monday.

## Automatic Monday publish (GitHub Actions)

Workflow: `.github/workflows/weekly-small-business-blog.yml`

Every Monday at 9:00 AM Eastern the workflow:

1. Finds the next unpublished batch with `scheduled_date <= today`
2. Confirms `batchN.py` exists
3. Marks it published, regenerates HTML, updates `sitemap.xml` + resources count
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

**Manual trigger:** Actions → Weekly Small Business Blog Batch → Run workflow.

## Local publish commands

```bash
# See which batch is due
python3 peacemakers-ai/scripts/run-weekly-batch.py

# Dry-run the publisher
python3 peacemakers-ai/scripts/publish-due-batch.py --dry-run

# Publish due batch locally (no deploy)
python3 peacemakers-ai/scripts/publish-due-batch.py

# Publish + deploy
python3 peacemakers-ai/scripts/publish-due-batch.py --deploy

# Force a specific batch
python3 peacemakers-ai/scripts/publish-due-batch.py --force-batch 4 --deploy
```

## Files

- `batch-schedule.json` — dates, status, brief IDs per batch
- `briefs.py` — slug/title/keyword lookup
- `batch1.py` … `batch7.py` — article content modules
- `publish-due-batch.py` — Monday publish pipeline
- `generate-small-business-blog-html.py` — builds HTML for published batches only
