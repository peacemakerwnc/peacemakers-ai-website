#!/usr/bin/env python3
"""Generate static HTML for AI for Small Business blog cluster."""
import importlib.util
import json
import os
import re
import sys

SCRIPT_DIR = os.path.dirname(__file__)
SB_DIR = os.path.join(SCRIPT_DIR, "small-business-articles")
BASE = os.path.join(SCRIPT_DIR, "..", "resources", "ai-for-small-business")
CLUSTER = "ai-for-small-business"
SERVICE = "/services/ai-strategy-small-business"
STARTER_KIT = "/resources/ai-small-business-starter-kit"


def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


catalog = load_module("catalog", os.path.join(SB_DIR, "catalog.py"))


def article_head(meta):
    ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": meta["title"],
        "description": meta["meta_description"],
        "datePublished": meta.get("publish_date", "2026-07-14"),
        "author": {"@type": "Organization", "name": "Peacemakers"},
        "publisher": {
            "@type": "Organization",
            "name": "Peacemakers AI",
            "logo": {"@type": "ImageObject", "url": "https://www.peacemakersai.com/assets/peacemakers-ai-logo.png"},
        },
        "image": "https://www.peacemakersai.com/assets/peacemakers-ai-logo.png",
        "mainEntityOfPage": f"https://www.peacemakersai.com/blog/{CLUSTER}/{meta['slug']}",
        "articleSection": "AI for Small Business",
        "keywords": meta.get("keywords", "AI for small business"),
    }
    return f"""<!DOCTYPE html>
<html lang="en" class="no-js" data-calendly-url="https://calendly.com/james-peacemakersai/30min" data-intro-calendly-url="https://calendly.com/james-peacemakersai">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{meta['title']} | Peacemakers AI</title>
    <meta name="description" content="{meta['meta_description']}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="{meta['title']} | Peacemakers AI" />
    <meta property="og:description" content="{meta['meta_description']}" />
    <meta property="og:url" content="https://www.peacemakersai.com/blog/{CLUSTER}/{meta['slug']}" />
    <meta property="og:image" content="https://www.peacemakersai.com/assets/peacemakers-ai-logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{meta['title']} | Peacemakers AI" />
    <meta name="twitter:description" content="{meta['meta_description']}" />
    <meta name="twitter:image" content="https://www.peacemakersai.com/assets/peacemakers-ai-logo.png" />
    <link rel="canonical" href="https://www.peacemakersai.com/blog/{CLUSTER}/{meta['slug']}" />
    <link rel="stylesheet" href="/styles.css" />
    <script type="application/ld+json">{json.dumps(ld, separators=(',', ':'))}</script>
  </head>"""


HEADER = f"""  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header"><div class="container header-inner">
      <a class="site-logo" href="/index.html"><span class="site-brand"><img class="site-brand-mark" src="/assets/peacemakers-ai-logo.png" alt="Peacemakers AI logo" /><span class="site-brand-text">Peacemakers AI</span></span></a>
      <button id="nav-toggle" class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Toggle navigation</span><span class="nav-toggle-line" aria-hidden="true"></span></button>
      <nav id="site-nav" class="site-nav" aria-label="Primary"><ul class="nav-list">
        <li><a href="/index.html">Home</a></li>
        <li><a href="/resources.html">Resources</a></li>
        <li><a href="/blog/{CLUSTER}">AI for Small Business</a></li>
        <li><a href="/blog/ai-for-nonprofits">AI for Nonprofits</a></li>
      </ul><a class="btn btn-primary btn-small" href="#" data-calendly-link data-track="calendly_cta">Book a Call</a></nav>
      <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme"><span aria-hidden="true">Theme</span></button>
    </div></header>
    <main id="main">"""

FOOTER = f"""    </main>
    <footer class="site-footer"><div class="container footer-grid">
      <div><a class="site-logo footer-logo" href="/index.html"><span class="site-brand"><img class="site-brand-mark" src="/assets/peacemakers-ai-logo.png" alt="" /><span class="site-brand-text">Peacemakers AI</span></span></a></div>
      <div><h3>Series</h3><p><a class="footer-domain" href="/blog/{CLUSTER}">AI for Small Business</a></p><p><a class="footer-domain" href="{SERVICE}">Small Business AI Consulting</a></p></div>
      <div><h3>More</h3><p><a class="footer-domain" href="/ai-consulting-for-service-businesses.html">Service Businesses</a></p><p><a class="footer-domain" href="/resources.html">All Resources</a></p></div>
    </div></footer>
    <script src="/script.js" defer></script>
  </body>
</html>"""


def cta_block(data, href=SERVICE):
    return f"""<aside class="cta-block" aria-label="Call to action">
      <h3 class="cta-block-title">{data['title']}</h3>
      <p class="cta-block-description">{data['description']}</p>
      <a class="btn btn-primary" href="{href}">{data['buttonText']}</a>
    </aside>"""


def lead_magnet(data):
    src = data.get("page_source", "lead-magnet")
    return f"""<aside class="lead-magnet-form" aria-label="Free resource download">
      <h3 class="lead-magnet-title">{data['title']}</h3>
      <p class="lead-magnet-description">{data['description']}</p>
      <form class="lead-magnet-form-inner" data-lead-magnet-form data-success-redirect="{data['formEndpoint']}" action="https://formspree.io/f/maqaaddz" method="POST" novalidate>
        <input type="hidden" name="page_source" value="{src}" />
        <input type="hidden" name="submitted_at" value="" />
        <input type="hidden" name="_subject" value="Small Business AI Lead Magnet Request" />
        <input type="hidden" name="industry" value="Small Business" />
        <input type="hidden" name="needs" value="Lead magnet download request" />
        <input type="hidden" name="full_name" value="Lead magnet subscriber" />
        <label class="sr-only" for="lm-{src}">Email</label>
        <input id="lm-{src}" name="email" type="email" autocomplete="email" placeholder="Your work email" required />
        <button class="btn btn-secondary" type="submit" data-submit-label="{data['buttonText']}">{data['buttonText']}</button>
        <p class="form-status" data-form-status aria-live="polite"></p>
      </form>
    </aside>"""


def end_cta(topic):
    return cta_block({
        "title": "Ready to see if AI fits your business?",
        "description": f"Peacemakers AI helps small business owners cut through the hype and find AI tools that actually save time and money—starting with {topic}.",
        "buttonText": "Book a Free AI Fit Assessment",
    })


def insert_mid_blocks(html, mid_html):
    if "<!--MID_CTA-->" in html:
        return html.replace("<!--MID_CTA-->", mid_html, 1)
    parts = re.split(r"(?=<h2>)", html)
    if len(parts) >= 4:
        return "".join(parts[:3]) + mid_html + "".join(parts[3:])
    midpoint = len(html) // 2
    return html[:midpoint] + mid_html + html[midpoint:]


def write_article(article):
    meta = article.copy()
    meta["keywords"] = ", ".join([meta.get("primary_keyword", "")] + meta.get("secondary_keywords", []))
    crumb = article.get("breadcrumb_label", article["title"][:30])
    mid_blocks = cta_block(article["mid_cta"]) + lead_magnet(article["lead_magnet"])
    body_content = insert_mid_blocks(article["body_html"], mid_blocks)
    body = f"""<section class="hero section"><div class="container hero-content narrow">
        <p class="eyebrow">AI for Small Business</p>
        <h1>{article['title']}</h1>
        <p class="article-meta">Published {article.get('publish_date', '2026-07-14')} · AI for Small Business</p>
      </div></section>
      <section class="section"><div class="container narrow article-body">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/index.html">Home</a> · <a href="/resources.html">Resources</a> · <a href="/blog/{CLUSTER}">AI for Small Business</a> · <span>{crumb}</span>
        </nav>
        {body_content}
        {end_cta(article['end_cta_topic'])}
      </div></section>"""
    html = article_head(meta) + HEADER + body + FOOTER
    path = os.path.join(BASE, f"{article['slug']}.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Wrote", path)


def write_index():
    sections = []
    for cat in catalog.CATEGORIES:
        items = []
        for art in cat["articles"]:
            slug = art["slug"]
            if slug in catalog.PUBLISHED_SLUGS:
                items.append(
                    f'<a class="cluster-card" href="/blog/{CLUSTER}/{slug}"><h3>{art["title"]}</h3><p>{art["description"]}</p></a>'
                )
            else:
                items.append(
                    f'<div class="cluster-card cluster-card--upcoming"><h3>{art["title"]}</h3><p>{art["description"]}</p><p class="article-meta">Coming soon</p></div>'
                )
        sections.append(
            f'<h2>{cat["name"]}</h2><div class="cluster-card-list">{"".join(items)}</div>'
        )

    html = f"""<!DOCTYPE html>
<html lang="en" class="no-js" data-calendly-url="https://calendly.com/james-peacemakersai/30min" data-intro-calendly-url="https://calendly.com/james-peacemakersai">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI for Small Business | Peacemakers AI</title>
    <meta name="description" content="Practical AI guides for small business owners—cost, ROI, tool choice, automation, and implementation without the hype." />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="AI for Small Business | Peacemakers AI" />
    <meta property="og:description" content="Answers to the real questions small business owners ask about AI." />
    <meta property="og:url" content="https://www.peacemakersai.com/blog/{CLUSTER}" />
    <meta property="og:image" content="https://www.peacemakersai.com/assets/peacemakers-ai-logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://www.peacemakersai.com/assets/peacemakers-ai-logo.png" />
    <link rel="canonical" href="https://www.peacemakersai.com/blog/{CLUSTER}" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header"><div class="container header-inner">
      <a class="site-logo" href="/index.html"><span class="site-brand"><img class="site-brand-mark" src="/assets/peacemakers-ai-logo.png" alt="Peacemakers AI logo" /><span class="site-brand-text">Peacemakers AI</span></span></a>
      <nav id="site-nav" class="site-nav" aria-label="Primary"><ul class="nav-list">
        <li><a href="/index.html">Home</a></li>
        <li><a href="/resources.html">Resources</a></li>
        <li><a href="/blog/ai-for-nonprofits">AI for Nonprofits</a></li>
      </ul></nav>
    </div></header>
    <main id="main">
      <section class="hero section"><div class="container hero-content narrow">
        <p class="eyebrow">Article Series</p>
        <h1>AI for Small Business</h1>
        <p class="hero-sub">Small business owners have real, practical questions about AI—and most answers online are either too technical or too vague. This series answers them one at a time, with plain language and actionable next steps.</p>
      </div></section>
      <section class="section"><div class="container narrow">
        {"".join(sections)}
        <aside class="cta-block" style="margin-top: 2rem">
          <h3 class="cta-block-title">Ready to see if AI fits your business?</h3>
          <p class="cta-block-description">Peacemakers AI helps small business owners cut through the hype and find tools that actually save time and money.</p>
          <a class="btn btn-primary" href="{SERVICE}">Book a Free AI Fit Assessment</a>
        </aside>
      </div></section>
    </main>
    <footer class="site-footer"><div class="container"><p><a href="/resources.html">← All Resources</a></p></div></footer>
    <script src="/script.js" defer></script>
  </body>
</html>"""
    path = os.path.join(BASE, "index.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Wrote", path)


def main():
    os.makedirs(BASE, exist_ok=True)
    # Refresh published slugs from schedule on each run
    catalog.PUBLISHED_SLUGS = catalog._load_published_slugs()

    articles_written = 0
    for filename in sorted(os.listdir(SB_DIR)):
        if not filename.startswith("batch") or not filename.endswith(".py"):
            continue
        batch_path = os.path.join(SB_DIR, filename)
        mod_name = filename[:-3]
        batch_mod = load_module(mod_name, batch_path)
        if not hasattr(batch_mod, "ARTICLES"):
            continue
        for slug, article in batch_mod.ARTICLES.items():
            write_article(article)
            articles_written += 1

    if articles_written == 0:
        print("No batch articles found.", file=sys.stderr)
        sys.exit(1)

    write_index()
    print(f"Generated {articles_written} articles.")


if __name__ == "__main__":
    main()
