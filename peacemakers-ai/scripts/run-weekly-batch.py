#!/usr/bin/env python3
"""Determine the next due blog batch and emit the agent prompt."""
from __future__ import annotations

import argparse
import json
import os
from datetime import date, datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SB_DIR = os.path.join(SCRIPT_DIR, "small-business-articles")
SCHEDULE_PATH = os.path.join(SB_DIR, "batch-schedule.json")
PROMPT_DIR = os.path.join(SB_DIR, "prompts")


def load_schedule():
    with open(SCHEDULE_PATH, encoding="utf-8") as f:
        return json.load(f)


def save_schedule(schedule):
    with open(SCHEDULE_PATH, "w", encoding="utf-8") as f:
        json.dump(schedule, f, indent=2)
        f.write("\n")


def published_slugs(schedule):
    import importlib.util

    briefs_path = os.path.join(SB_DIR, "briefs.py")
    spec = importlib.util.spec_from_file_location("briefs", briefs_path)
    briefs = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(briefs)

    slugs = set()
    for batch in schedule["batches"]:
        if batch.get("status") == "published":
            slugs.update(briefs.slugs_for_briefs(batch["briefs"]))
    return slugs


def due_batch(schedule, today=None):
    today = today or date.today()
    pending = [b for b in schedule["batches"] if b.get("status") != "published"]
    if not pending:
        return None
    for batch in pending:
        scheduled = date.fromisoformat(batch["scheduled_date"])
        if scheduled <= today:
            return batch
    return pending[0]


def build_prompt(batch, schedule):
    brief_list = ", ".join(str(b) for b in batch["briefs"])
    module = batch.get("module", f"batch{batch['id']}.py")
    return f"""Generate batch {batch['id']} for the AI for Small Business content cluster.

Batch name: {batch['name']}
Briefs: {brief_list}
Target module: peacemakers-ai/scripts/small-business-articles/{module}

Follow the writing rules in the original cluster brief:
- 1,200–1,800 words per article, direct 2-sentence answer up top
- Mid CTA → Book a Free AI Fit Assessment → /services/ai-strategy-small-business
- Lead magnet → /resources/ai-small-business-starter-kit
- 2-3 internal links to sibling posts in /blog/ai-for-small-business/
- Shared end CTA customized to each article topic
- Full frontmatter + HTML via the existing generator pattern

After generating:
1. Add article data to {module} (ARTICLES dict, same shape as batch1.py)
2. Mark batch {batch['id']} status published in batch-schedule.json with today's date
3. Run: python3 peacemakers-ai/scripts/generate-small-business-blog-html.py
4. Update sitemap.xml with new URLs
5. Update resources.html if needed
6. Deploy: cd peacemakers-ai && npx vercel deploy --prod --yes

Brief metadata lookup: peacemakers-ai/scripts/small-business-articles/briefs.py
Already published slugs: {sorted(published_slugs(schedule))}
"""


def main():
    parser = argparse.ArgumentParser(description="Weekly small business blog batch runner")
    parser.add_argument("--mark-published", type=int, metavar="BATCH_ID", help="Mark batch as published")
    parser.add_argument("--write-prompt", action="store_true", help="Write agent prompt file for due batch")
    parser.add_argument("--json", action="store_true", help="Output due batch as JSON")
    parser.add_argument("--due-only", action="store_true", help="Exit quietly if next batch is not yet scheduled")
    parser.add_argument("--date", help="Override today (YYYY-MM-DD)")
    args = parser.parse_args()

    schedule = load_schedule()
    today = date.fromisoformat(args.date) if args.date else date.today()

    if args.mark_published:
        for batch in schedule["batches"]:
            if batch["id"] == args.mark_published:
                batch["status"] = "published"
                batch["published_date"] = today.isoformat()
                save_schedule(schedule)
                print(f"Marked batch {args.mark_published} published on {today}")
                return
        raise SystemExit(f"Batch {args.mark_published} not found")

    batch = due_batch(schedule, today)
    if not batch:
        print("All batches complete.")
        return

    if args.due_only and batch.get("status") == "pending":
        if date.fromisoformat(batch["scheduled_date"]) > today:
            if not args.json:
                print(f"No batch due yet. Next: batch {batch['id']} on {batch['scheduled_date']}.")
            return

    if args.json:
        print(json.dumps(batch, indent=2))
        return

    prompt = build_prompt(batch, schedule)
    os.makedirs(PROMPT_DIR, exist_ok=True)
    prompt_path = os.path.join(PROMPT_DIR, f"batch-{batch['id']}-prompt.md")

    print(f"Due batch: {batch['id']} — {batch['name']}")
    print(f"Scheduled: {batch['scheduled_date']} (today: {today})")
    print(f"Status: {batch.get('status', 'pending')}")

    if args.write_prompt:
        with open(prompt_path, "w", encoding="utf-8") as f:
            f.write(prompt)
        print(f"Prompt written: {prompt_path}")
    else:
        print(prompt)

    if batch.get("status") == "pending" and date.fromisoformat(batch["scheduled_date"]) > today:
        print(f"Note: Next batch is scheduled for {batch['scheduled_date']} (not yet due).")


if __name__ == "__main__":
    main()
