#!/usr/bin/env python3
"""Research SEO blog opportunities with optional Firecrawl search data.

The marketing site is static HTML, so this script keeps research separate from
site generation. When FIRECRAWL_API_KEY is present, it queries Firecrawl search
for high-intent service-business AI topics and folds the returned titles/URLs
into a markdown recommendation report. Without a key, it still inventories the
local site and writes the strategy framework so the missing credential is clear.
"""
from __future__ import annotations

import argparse
import html.parser
import os
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
DEFAULT_OUTPUT = ROOT / "docs" / "seo-blog-opportunities-firecrawl.md"


@dataclass(frozen=True)
class Opportunity:
    priority: int
    title: str
    primary_keyword: str
    intent: str
    why: str
    cta: str
    internal_links: tuple[str, ...]


SEARCH_QUERIES = [
    "AI automation for home service business missed call follow up",
    "HVAC AI automation estimate follow up missed calls",
    "roofing company AI missed call text back estimate follow up",
    "plumbing company AI lead follow up automation",
    "AI readiness checklist small business service business",
    "AI opportunity audit small business workflows",
    "best CRM automation local service business follow up reviews",
]

OPPORTUNITIES = [
    Opportunity(
        1,
        "How AI Can Help Local Service Businesses Respond to Missed Calls Faster",
        "missed call follow up automation",
        "Problem-aware owner looking for a practical first workflow",
        "Missed-call recovery appears repeatedly in live search results and maps directly to a meeting-worthy pain: leads paid for but not answered.",
        "Get the Local Service AI Workflow Checklist, then book an AI Opportunity Audit",
        ("/local-service-ai-audit.html", "/local-service-ai-checklist.html", "/industries/home-services"),
    ),
    Opportunity(
        2,
        "AI Follow-Up Templates for Home Service Estimates",
        "estimate follow up automation",
        "Owner has quotes going cold and wants examples",
        "Estimate follow-up is specific, operational, and close to revenue without promising a fabricated ROI.",
        "Book an AI Opportunity Audit",
        ("/local-service-ai-audit.html", "/blog/ai-for-small-business/automate-customer-follow-ups-with-ai", "/blueprint.html"),
    ),
    Opportunity(
        3,
        "The Best First AI Workflow for a Home Service Business",
        "AI workflow for home service business",
        "Beginner wants one safe starting point",
        "The site already teaches AI broadly; this narrows the next action to one workflow and reduces tool-shopping confusion.",
        "Take the AI Opportunity Scorecard",
        ("/scorecard.html", "/local-service-ai-checklist.html", "/blog/ai-for-small-business/which-repetitive-tasks-to-automate-first"),
    ),
    Opportunity(
        4,
        "AI Automation Ideas for HVAC Companies",
        "AI automation for HVAC companies",
        "Industry-specific research and vendor comparison",
        "HVAC has urgent calls, seasonal surges, reminders, maintenance plans, and estimate follow-up: strong topic depth for a cluster.",
        "Book an AI Opportunity Audit",
        ("/industries/hvac", "/local-service-ai-audit.html", "/security.html"),
    ),
    Opportunity(
        5,
        "How HVAC Companies Can Use AI to Follow Up on Unsold Estimates",
        "HVAC estimate follow up automation",
        "High-intent workflow search",
        "A focused supporting article can link back to the HVAC page and audit page while avoiding broad generic AI wording.",
        "Book an AI Opportunity Audit",
        ("/industries/hvac", "/local-service-ai-audit.html", "/blog/ai-for-small-business/automate-customer-follow-ups-with-ai"),
    ),
    Opportunity(
        6,
        "AI Automation Ideas for Roofing Companies",
        "AI automation for roofing companies",
        "Industry owner exploring practical use cases",
        "Roofing-specific searches emphasize storm lead response, inspection booking, quote follow-up, and review requests.",
        "Get the checklist, then schedule an audit",
        ("/industries/roofing", "/local-service-ai-checklist.html", "/local-service-ai-audit.html"),
    ),
    Opportunity(
        7,
        "AI Missed-Call Text-Back for Roofers: What to Automate and What to Keep Human",
        "AI missed call text back for roofers",
        "Very specific urgent lead problem",
        "This is long-tail and buyer-intent rich; the human-control angle fits Peacemakers better than hype-heavy competitor pages.",
        "Book an AI Opportunity Audit",
        ("/industries/roofing", "/security.html", "/local-service-ai-audit.html"),
    ),
    Opportunity(
        8,
        "AI Automation Ideas for Plumbing Companies",
        "AI automation for plumbing companies",
        "Industry owner looking for examples",
        "Plumbing combines emergency calls, scheduling, follow-up, and reviews; the page can feed both industry SEO and audit conversions.",
        "Get the Local Service AI Workflow Checklist",
        ("/industries/plumbing", "/local-service-ai-checklist.html", "/local-service-ai-audit.html"),
    ),
    Opportunity(
        9,
        "Before You Buy Another AI Tool, Fix These 5 Business Processes",
        "before buying AI tools small business",
        "Skeptical/problem-aware owner",
        "This matches the Peacemakers operating principle: understand before recommending, simplify before automating, and current tools first.",
        "Take the AI Opportunity Scorecard",
        ("/scorecard.html", "/blueprint.html", "/blog/ai-for-small-business/which-ai-tool-should-i-choose-for-my-small-business"),
    ),
    Opportunity(
        10,
        "AI Readiness Checklist for Local Service Businesses",
        "AI readiness checklist service business",
        "Owner wants to know if they are ready",
        "Readiness content is already visible in live results, and Peacemakers can differentiate with process, source-of-truth, approval, and security checks.",
        "Start the Scorecard, then book if the result shows clear opportunity",
        ("/scorecard.html", "/security.html", "/local-service-ai-audit.html"),
    ),
    Opportunity(
        11,
        "What an AI Opportunity Audit Actually Finds in a Service Business",
        "AI opportunity audit",
        "Commercial investigation before booking",
        "This explains the offer directly and answers what a prospect gets from a meeting without overpromising outcomes.",
        "Book an AI Opportunity Audit",
        ("/local-service-ai-audit.html", "/blueprint.html", "/resources/what-is-an-ai-opportunity-blueprint.html"),
    ),
    Opportunity(
        12,
        "Jobber, Housecall Pro, ServiceTitan, or Zapier: Where Should AI Automation Live?",
        "Jobber Housecall Pro ServiceTitan automation",
        "Tool-aware owner comparing implementation paths",
        "Live results show tool/platform comparisons; this should be written with current vendor documentation before making feature claims.",
        "Book a fit assessment before changing tools",
        ("/blog/ai-for-small-business/integration-of-ai-with-existing-business-software", "/blog/ai-for-small-business/questions-to-ask-when-choosing-ai-tool", "/services/ai-strategy-small-business"),
    ),
]


class TitleParser(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_title = False
        self.title_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data.strip())

    @property
    def title(self) -> str:
        return " ".join(part for part in self.title_parts if part)


def site_urls() -> list[str]:
    if not SITEMAP.exists():
        return []
    return re.findall(r"<loc>(.*?)</loc>", SITEMAP.read_text(encoding="utf-8"))


def html_titles() -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    for path in sorted(ROOT.rglob("*.html")):
        if ".git" in path.parts:
            continue
        parser = TitleParser()
        parser.feed(path.read_text(encoding="utf-8", errors="ignore"))
        if parser.title:
            rows.append((str(path.relative_to(ROOT)), parser.title))
    return rows


def load_firecrawl_results(limit: int) -> tuple[str, list[dict[str, Any]]]:
    api_key = os.environ.get("FIRECRAWL_API_KEY")
    if not api_key:
        return "skipped_missing_firecrawl_api_key", []

    try:
        from firecrawl import Firecrawl
    except ImportError:
        return "skipped_firecrawl_package_not_installed", []

    app = Firecrawl(api_key=api_key)
    results: list[dict[str, Any]] = []
    for query in SEARCH_QUERIES:
        try:
            data = app.search(query, limit=limit, timeout=30000)
        except Exception as exc:  # noqa: BLE001 - report research failures without hiding other results.
            results.append({"query": query, "error": str(exc)})
            continue

        payload = data.model_dump() if hasattr(data, "model_dump") else data
        items = []
        if isinstance(payload, dict):
            items = payload.get("data") or payload.get("results") or []
        results.append({"query": query, "items": items[:limit] if isinstance(items, list) else []})
    return "completed", results


def render_firecrawl_section(status: str, results: list[dict[str, Any]]) -> str:
    lines = ["## Firecrawl research status", "", f"Status: `{status}`", ""]
    if status != "completed":
        lines.extend(
            [
                "Firecrawl was added, but live Firecrawl queries did not run in this environment because the API key was unavailable or the package was not installed.",
                "Set `FIRECRAWL_API_KEY` and run:",
                "",
                "```bash",
                "python3 -m pip install -r peacemakers-ai/scripts/requirements.txt",
                "python3 peacemakers-ai/scripts/research-seo-blog-opportunities.py --firecrawl-limit 5",
                "```",
                "",
            ]
        )
        return "\n".join(lines)

    for group in results:
        lines.append(f"### {group.get('query', 'Query')}")
        if group.get("error"):
            lines.append(f"- Error: {group['error']}")
            continue
        items = group.get("items") or []
        if not items:
            lines.append("- No results returned.")
            continue
        for item in items:
            if not isinstance(item, dict):
                continue
            title = item.get("title") or item.get("name") or "Untitled result"
            url = item.get("url") or item.get("source_url") or item.get("link") or ""
            lines.append(f"- {title} ({url})")
        lines.append("")
    return "\n".join(lines)


def render_report(status: str, firecrawl_results: list[dict[str, Any]]) -> str:
    urls = site_urls()
    titles = html_titles()
    small_business_count = sum("/blog/ai-for-small-business/" in url for url in urls)
    industry_count = sum("/industries/" in url for url in urls)
    location_count = sum("/locations/" in url for url in urls)

    lines = [
        "# SEO blog opportunities for meeting-intent traffic",
        "",
        f"Generated: {date.today().isoformat()}",
        "",
        "## Existing site inventory",
        "",
        f"- Sitemap URLs: {len(urls)}",
        f"- AI for Small Business article URLs: {small_business_count}",
        f"- Industry URLs: {industry_count}",
        f"- Location URLs: {location_count}",
        "- Current conversion assets: AI Opportunity Scorecard, Local Service AI Checklist, AI Opportunity Audit, AI Opportunity Blueprint.",
        "- Firecrawl MCP: configured at `.cursor/mcp.json` using the hosted keyless endpoint for Cursor search/scrape/parse tools.",
        "",
        "## Strategy conclusion",
        "",
        "The site already has broad AI-for-small-business coverage. The next content should target narrower buyer-intent searches where a service-business owner has a painful workflow and is close to booking help: missed calls, estimate follow-up, review requests, CRM cleanup, readiness checks, and industry-specific automation examples.",
        "",
        "Avoid publishing more generic AI FAQ posts until the industry/workflow clusters below are built. Each new article should have a mid-article CTA and an end CTA pointing to the most relevant conversion asset.",
        "",
        render_firecrawl_section(status, firecrawl_results),
        "",
        "## Top recommended articles",
        "",
        "| Priority | Blog title | Primary keyword | Search intent | Conversion CTA |",
        "|---:|---|---|---|---|",
    ]

    for item in OPPORTUNITIES:
        lines.append(
            f"| {item.priority} | {item.title} | {item.primary_keyword} | {item.intent} | {item.cta} |"
        )

    lines.extend(["", "## Recommended article briefs", ""])
    for item in OPPORTUNITIES:
        links = ", ".join(item.internal_links)
        lines.extend(
            [
                f"### {item.priority}. {item.title}",
                "",
                f"- Primary keyword: `{item.primary_keyword}`",
                f"- Intent: {item.intent}",
                f"- Why this should bring qualified views: {item.why}",
                f"- CTA: {item.cta}",
                f"- Internal links: {links}",
                "- Writing angle: practical, process-first, current-tools-first; avoid fabricated ROI claims or guaranteed results.",
                "",
            ]
        )

    lines.extend(
        [
            "## Suggested publishing order",
            "",
            "1. Missed-call follow-up pillar article",
            "2. Estimate follow-up templates article",
            "3. Best first AI workflow for home service businesses",
            "4. HVAC automation ideas",
            "5. HVAC unsold estimate follow-up",
            "6. Roofing automation ideas",
            "7. Roofing missed-call text-back",
            "8. Plumbing automation ideas",
            "9. AI readiness checklist",
            "10. What an AI Opportunity Audit actually finds",
            "",
            "## On-page conversion pattern",
            "",
            "Use this structure on every article:",
            "",
            "- Direct answer in the first 2-3 sentences.",
            "- Pain-specific example before tool talk.",
            "- Mid CTA after the first implementation section.",
            "- Lead magnet CTA for checklist/readiness resources.",
            "- 2-4 internal links to industry, audit, scorecard, and related blog pages.",
            "- End CTA: book the AI Opportunity Audit or take the Scorecard, depending on buyer readiness.",
            "",
            "## Local SEO expansion after the first article set",
            "",
            "Once the workflow articles exist, add city-industry landing pages only for markets you want to sell into first, for example:",
            "",
            "- AI consulting for HVAC companies in Asheville, NC",
            "- AI consulting for roofing companies in Charlotte, NC",
            "- AI consulting for plumbing companies in Raleigh, NC",
            "- AI automation for law firms in Asheville, NC",
            "- AI consulting for accounting firms in Greenville, SC",
            "",
            "Each city-industry page should link back to the relevant industry page and one workflow article, not stand alone as thin location content.",
            "",
            "## Current title sample reviewed",
            "",
        ]
    )

    for path, title in titles[:35]:
        lines.append(f"- `{path}`: {title}")
    if len(titles) > 35:
        lines.append(f"- ...and {len(titles) - 35} more HTML pages")

    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="Research SEO blog opportunities with Firecrawl when available.")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT), help="Markdown report path")
    parser.add_argument("--firecrawl-limit", type=int, default=5, help="Firecrawl search results per query")
    args = parser.parse_args()

    status, results = load_firecrawl_results(args.firecrawl_limit)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(render_report(status, results), encoding="utf-8")
    print(f"Wrote {output}")
    print(f"Firecrawl status: {status}")


if __name__ == "__main__":
    main()
