#!/usr/bin/env python3
"""Publish the next due AI for Small Business article (every-other-day queue).

Falls back to legacy weekly batch mode if articles[] is absent.
Marks one article published, regenerates HTML for published content only,
syncs sitemap + resources count, and optionally deploys.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SB_DIR = Path(__file__).resolve().parent / "small-business-articles"
SCHEDULE_PATH = SB_DIR / "batch-schedule.json"
SITEMAP_PATH = ROOT / "peacemakers-ai" / "sitemap.xml"
RESOURCES_PATH = ROOT / "peacemakers-ai" / "resources.html"
GENERATOR = Path(__file__).resolve().parent / "generate-small-business-blog-html.py"
RUNNER = Path(__file__).resolve().parent / "run-weekly-batch.py"


def load_schedule():
    with open(SCHEDULE_PATH, encoding="utf-8") as f:
        return json.load(f)


def save_schedule(schedule):
    with open(SCHEDULE_PATH, "w", encoding="utf-8") as f:
        json.dump(schedule, f, indent=2)
        f.write("\n")


def due_article(schedule, today: date, force_slug: str | None = None):
    articles = schedule.get("articles") or []
    if force_slug:
        for art in articles:
            if art["slug"] == force_slug:
                return art
        raise SystemExit(f"Article slug not found: {force_slug}")

    for art in articles:
        if art.get("status") == "published":
            continue
        if date.fromisoformat(art["scheduled_date"]) <= today:
            return art
    return None


def due_batch(schedule, today: date, force_id: int | None = None):
    if force_id is not None:
        for batch in schedule["batches"]:
            if batch["id"] == force_id:
                return batch
        raise SystemExit(f"Batch {force_id} not found")

    for batch in schedule["batches"]:
        if batch.get("status") == "published":
            continue
        if batch.get("status") == "queued_as_articles":
            continue
        if date.fromisoformat(batch["scheduled_date"]) <= today:
            return batch
    return None


def published_slugs(schedule):
    sys.path.insert(0, str(SB_DIR))
    import briefs  # type: ignore

    slugs = set()
    for batch in schedule.get("batches", []):
        if batch.get("status") == "published":
            slugs.update(briefs.slugs_for_briefs(batch["briefs"]))
    for art in schedule.get("articles") or []:
        if art.get("status") == "published":
            slugs.add(art["slug"])
    return slugs


def sync_sitemap(schedule):
    text = SITEMAP_PATH.read_text(encoding="utf-8")
    existing = set(
        re.findall(
            r"<loc>(https://www\.peacemakersai\.com/blog/ai-for-small-business/[^<]+)</loc>",
            text,
        )
    )
    wanted = {
        f"https://www.peacemakersai.com/blog/ai-for-small-business/{slug}"
        for slug in published_slugs(schedule)
    }

    missing = sorted(wanted - existing)
    if not missing:
        print("Sitemap already up to date")
        return

    anchor = "https://www.peacemakersai.com/blog/ai-for-small-business</loc>\n  </url>"
    if anchor not in text:
        insert_at = text.rfind("</urlset>")
        if insert_at < 0:
            raise SystemExit("Could not find sitemap insertion point")
        block = "".join(f"  <url>\n    <loc>{url}</loc>\n  </url>\n" for url in missing)
        text = text[:insert_at] + block + text[insert_at:]
    else:
        block = [anchor]
        for url in missing:
            block.append(f"\n  <url>\n    <loc>{url}</loc>\n  </url>")
        text = text.replace(anchor, "".join(block), 1)

    SITEMAP_PATH.write_text(text, encoding="utf-8")
    print(f"Sitemap added {len(missing)} URLs")


def update_resources_count(schedule):
    if not RESOURCES_PATH.exists():
        return
    count = len(published_slugs(schedule))
    text = RESOURCES_PATH.read_text(encoding="utf-8")
    patterns = [
        (
            r"\d+ live guides on [^—]+—with new posts published [^.]+.",
            f"{count} live guides on cost, automation, sales, support, and implementation—with new posts published every other day.",
        ),
        (
            r"\d+ planned guides on [^—]+—published in weekly batches\.",
            f"{count} live guides on cost, automation, sales, support, and implementation—with new posts published every other day.",
        ),
        (
            r"\d+ live guides",
            f"{count} live guides",
        ),
    ]
    for pattern, repl in patterns:
        updated, n = re.subn(pattern, repl, text, count=1)
        if n:
            RESOURCES_PATH.write_text(updated, encoding="utf-8")
            print(f"resources.html guide count set to {count}")
            return


def deploy_prod():
    env = os.environ.copy()
    cmd = [
        "npx",
        "vercel",
        "deploy",
        "--prod",
        "--yes",
        "--scope",
        env.get("VERCEL_SCOPE", "peacemakers-ai"),
    ]
    print("Deploying:", " ".join(cmd))
    subprocess.check_call(cmd, cwd=str(ROOT / "peacemakers-ai"), env=env)


def publish_article(schedule, article, today: date, dry_run: bool):
    print(
        f"Due article — {article['slug']} "
        f"(scheduled {article['scheduled_date']}, module {article.get('module')})"
    )
    if article.get("status") == "published":
        print("Article already published; nothing to do")
        return False
    if dry_run:
        print("Dry run only — not marking published or deploying")
        return False

    for art in schedule["articles"]:
        if art["slug"] == article["slug"]:
            art["status"] = "published"
            art["published_date"] = today.isoformat()
            break
    save_schedule(schedule)
    return True


def publish_batch_legacy(batch, today: date, dry_run: bool):
    module = batch.get("module", f"batch{batch['id']}.py")
    module_path = SB_DIR / module
    if not module_path.exists():
        raise SystemExit(f"Missing article module: {module_path}")
    print(
        f"Due batch {batch['id']} — {batch['name']} "
        f"(scheduled {batch['scheduled_date']}, module {module})"
    )
    if batch.get("status") == "published":
        print("Batch already published; nothing to do")
        return False
    if dry_run:
        print("Dry run only — not marking published or deploying")
        return False
    subprocess.check_call(
        [sys.executable, str(RUNNER), "--mark-published", str(batch["id"]), "--date", today.isoformat()],
        cwd=str(ROOT),
    )
    return True


def main():
    parser = argparse.ArgumentParser(description="Publish due small-business blog article or batch")
    parser.add_argument("--date", help="Override today YYYY-MM-DD")
    parser.add_argument("--force-slug", help="Publish this article slug even if not due")
    parser.add_argument("--force-batch", type=int, help="Legacy: publish this batch id")
    parser.add_argument("--deploy", action="store_true", help="Deploy peacemakers-ai to Vercel production")
    parser.add_argument("--dry-run", action="store_true", help="Show what would publish without changing files")
    args = parser.parse_args()

    today = date.fromisoformat(args.date) if args.date else date.today()
    schedule = load_schedule()

    changed = False
    if schedule.get("articles") and args.force_batch is None:
        article = due_article(schedule, today, args.force_slug)
        if not article:
            print(f"No unpublished article due on or before {today}")
            return 0
        changed = publish_article(schedule, article, today, args.dry_run)
        label = f"article {article['slug']}"
    else:
        batch = due_batch(schedule, today, args.force_batch)
        if not batch:
            print(f"No unpublished batch due on or before {today}")
            return 0
        changed = publish_batch_legacy(batch, today, args.dry_run)
        label = f"batch {batch['id']}"

    if not changed:
        return 0

    schedule = load_schedule()
    subprocess.check_call([sys.executable, str(GENERATOR)], cwd=str(ROOT))
    sync_sitemap(schedule)
    update_resources_count(schedule)

    if args.deploy:
        deploy_prod()
    else:
        print("Skipped deploy (pass --deploy to publish live)")

    print(f"Published {label} on {today.isoformat()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
