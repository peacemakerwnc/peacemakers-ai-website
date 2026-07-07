# Weekly blog batch automation

This repo publishes the **AI for Small Business** cluster in 7 weekly batches. Batch 1 is live; batches 2–7 are scheduled automatically.

## Schedule

| Batch | Date | Briefs | Status |
|-------|------|--------|--------|
| 1 | Jul 7, 2026 | 1, 8, 4, 25, 21 | Published |
| 2 | Jul 14 | 5, 12, 17, 18, 22, 36 | Pending |
| 3 | Jul 21 | 2, 7, 10, 14, 23, 28 | Pending |
| 4 | Jul 28 | 6, 15, 39, 32, 35 | Pending |
| 5 | Aug 4 | 9, 11, 24, 26, 33, 34, 38 | Pending |
| 6 | Aug 11 | 3, 13, 20, 37, 30, 16, 27, 19, 29, 31 | Pending |
| 7 | Aug 18 | Bonus 101–110 | Pending |

Source of truth: `peacemakers-ai/scripts/small-business-articles/batch-schedule.json`

## Option A — Cursor Automation (fully hands-off)

**Import draft:** `peacemakers-ai/docs/cursor-automation-weekly-small-business-blog.json`  
In Cursor → **Automations** → create new → paste/import the JSON fields below (or copy the prompt section).

Create a **Cursor Automation** in the Automations editor:

| Setting | Value |
|---------|-------|
| **Name** | Weekly AI for Small Business blog batch |
| **Trigger** | Every week — Monday 9:00 AM (your local time) |
| **Repo** | This repository (`peacemakers-ai` site lives in `peacemakers-ai/`) |

**Agent instructions (paste into the automation prompt):**

```
Read peacemakers-ai/scripts/small-business-articles/batch-schedule.json and find the next batch where status is not "published" and scheduled_date <= today.

Run: python3 peacemakers-ai/scripts/run-weekly-batch.py --write-prompt

Open the generated prompt file in peacemakers-ai/scripts/small-business-articles/prompts/ and execute it fully:
- Write batchN.py with full article content (same ARTICLES dict shape as batch1.py)
- Mark the batch published in batch-schedule.json
- Run python3 peacemakers-ai/scripts/generate-small-business-blog-html.py
- Update peacemakers-ai/sitemap.xml with new /blog/ai-for-small-business/ URLs
- Update peacemakers-ai/resources.html if new posts should appear in the hub cards
- Deploy: cd peacemakers-ai && npx vercel deploy --prod --yes

Use brief metadata from peacemakers-ai/scripts/small-business-articles/briefs.py.
Follow all writing rules from the original content cluster brief (1,200–1,800 words, CTAs, lead magnets, internal links).
Stop when the batch is live and URLs return HTTP 200.
```

## Option B — GitHub Actions reminder (already configured)

Workflow: `.github/workflows/weekly-small-business-blog.yml`

Every Monday at 9:00 AM Eastern, GitHub opens an issue labeled `blog-batch` with the full agent prompt. Paste the issue body into Cursor Agent, or let a Cursor Automation read it.

**One-time setup:** Create the label `blog-batch` in GitHub (Issues → Labels).

**Manual trigger:** Actions → Weekly Small Business Blog Batch → Run workflow.

## Manual commands

```bash
# See which batch is due
python3 peacemakers-ai/scripts/run-weekly-batch.py

# Write the agent prompt file for the due batch
python3 peacemakers-ai/scripts/run-weekly-batch.py --write-prompt

# After an agent generates batch2.py (etc.)
python3 peacemakers-ai/scripts/generate-small-business-blog-html.py

# Mark a batch published (updates schedule + cluster index)
python3 peacemakers-ai/scripts/run-weekly-batch.py --mark-published 2
```

## Files

- `batch-schedule.json` — dates, status, brief IDs per batch
- `briefs.py` — slug/title/keyword lookup for all 49 articles
- `batch1.py` … `batch7.py` — article content modules (one per batch)
- `prompts/batch-N-prompt.md` — auto-generated agent instructions
- `generate-small-business-blog-html.py` — builds HTML + cluster index
