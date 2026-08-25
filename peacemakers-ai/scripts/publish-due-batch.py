#!/usr/bin/env python3
"""Publish the next due AI for Small Business blog batch (or a forced batch id).

Assumes batchN.py content already exists. Marks the batch published, regenerates
HTML for published batches only, syncs sitemap URLs, and optionally deploys.
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
from urllib.parse import urlparse

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


def due_batch(schedule, today: date, force_id: int | None = None):
    if force_id is not None:
        for batch in schedule["batches"]:
            if batch["id"] == force_id:
                return batch
        raise SystemExit(f"Batch {force_id} not found")

    for batch in schedule["batches"]:
        if batch.get("status") == "published":
            continue
        if date.fromisoformat(batch["scheduled_date"]) <= today:
            return batch
    return None


def ensure_module(batch) -> Path:
    module = batch.get("module", f"batch{batch['id']}.py")
    path = SB_DIR / module
    if not path.exists():
        raise SystemExit(f"Missing article module: {path}")
    return path


def sync_sitemap(schedule):
    sys.path.insert(0, str(SB_DIR))
    import briefs  # type: ignore

    text = SITEMAP_PATH.read_text(encoding="utf-8")
    existing = set(re.findall(r"<loc>(https://www\.peacemakersai\.com/blog/ai-for-small-business/[^<]+)</loc>", text))
    wanted = set()
    for batch in schedule["batches"]:
        if batch.get("status") != "published":
            continue
        for slug in briefs.slugs_for_briefs(batch["briefs"]):
            wanted.add(f"https://www.peacemakersai.com/blog/ai-for-small-business/{slug}")

    missing = sorted(wanted - existing)
    if not missing:
        print("Sitemap already up to date")
        return

    anchor = "https://www.peacemakersai.com/blog/ai-for-small-business</loc>\n  </url>"
    if anchor not in text:
        # Fall back: append before closing urlset
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
    import briefs  # type: ignore

    count = 0
    for batch in schedule["batches"]:
        if batch.get("status") == "published":
            count += len(briefs.slugs_for_briefs(batch["briefs"]))

    text = RESOURCES_PATH.read_text(encoding="utf-8")
    updated, n = re.subn(
        r"\d+ live guides on [^—]+—with new posts published weekly\.",
        f"{count} live guides on cost, automation, sales, support, and implementation—with new posts published weekly.",
        text,
        count=1,
    )
    if n:
        RESOURCES_PATH.write_text(updated, encoding="utf-8")
        print(f"resources.html guide count set to {count}")
    else:
        # Simpler fallback
        updated, n = re.subn(r"\d+ live guides", f"{count} live guides", text, count=1)
        if n:
            RESOURCES_PATH.write_text(updated, encoding="utf-8")
            print(f"resources.html guide count set to {count}")


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


def main():
    parser = argparse.ArgumentParser(description="Publish due small-business blog batch")
    parser.add_argument("--date", help="Override today YYYY-MM-DD")
    parser.add_argument("--force-batch", type=int, help="Publish this batch id even if not due")
    parser.add_argument("--deploy", action="store_true", help="Deploy peacemakers-ai to Vercel production")
    parser.add_argument("--dry-run", action="store_true", help="Show what would publish without changing files")
    args = parser.parse_args()

    today = date.fromisoformat(args.date) if args.date else date.today()
    schedule = load_schedule()
    batch = due_batch(schedule, today, args.force_batch)
    if not batch:
        print(f"No unpublished batch due on or before {today}")
        return 0

    module_path = ensure_module(batch)
    print(
        f"Due batch {batch['id']} — {batch['name']} "
        f"(scheduled {batch['scheduled_date']}, module {module_path.name})"
    )

    if batch.get("status") == "published" and args.force_batch is None:
        print("Batch already published; nothing to do")
        return 0

    if args.dry_run:
        print("Dry run only — not marking published or deploying")
        return 0

    subprocess.check_call(
        [sys.executable, str(RUNNER), "--mark-published", str(batch["id"]), "--date", today.isoformat()],
        cwd=str(ROOT),
    )
    schedule = load_schedule()
    subprocess.check_call([sys.executable, str(GENERATOR)], cwd=str(ROOT))
    sync_sitemap(schedule)
    update_resources_count(schedule)

    if args.deploy:
        deploy_prod()
    else:
        print("Skipped deploy (pass --deploy to publish live)")

    print(f"Published batch {batch['id']} on {today.isoformat()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
