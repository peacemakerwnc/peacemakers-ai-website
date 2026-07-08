#!/usr/bin/env python3
"""Generate SEO pages: about, contact, privacy, locations, industries, sitemap."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
SITE = "https://www.peacemakersai.com"
EMAIL = "james@peacemakersai.com"
LINKEDIN = "https://www.linkedin.com/company/peacemakers-ai"
PHONE_PLACEHOLDER = "[INSERT BUSINESS PHONE]"
GBP_PLACEHOLDER = "[INSERT GOOGLE BUSINESS PROFILE OR GOOGLE MAPS URL]"

PRIORITY_STATES = {
    "north-carolina",
    "south-carolina",
    "georgia",
    "florida",
    "tennessee",
    "texas",
    "virginia",
    "alabama",
}


def load_json(name: str) -> dict:
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def depth_prefix(depth: int) -> str:
    return "../" * depth if depth else ""


def analytics_head() -> str:
    return """  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-M5L8TPDF');</script>
  <!-- End Google Tag Manager -->
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GTQ5YNER7P"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GTQ5YNER7P');</script>
  <script>
    window.addEventListener('load',function(){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","wgrv405eqy");});
  </script>
  <!-- GSC: DNS verification active — meta tag not required unless switching methods.
       [INSERT GOOGLE SEARCH CONSOLE META VERIFICATION TOKEN IF NOT USING DNS] -->"""


def head_block(
    *,
    title: str,
    description: str,
    canonical_path: str,
    depth: int,
    extra_schema: str = "",
) -> str:
    p = depth_prefix(depth)
    canonical = f"{SITE}{canonical_path}"
    og_image = f"{SITE}/assets/peacemakers-ai-logo.webp"
    return f"""{analytics_head()}
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{esc(title)}</title>
    <meta name="description" content="{esc(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="{esc(title)}" />
    <meta property="og:description" content="{esc(description)}" />
    <meta property="og:url" content="{canonical}" />
    <meta property="og:image" content="{og_image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{esc(title)}" />
    <meta name="twitter:description" content="{esc(description)}" />
    <meta name="twitter:image" content="{og_image}" />
    <meta name="theme-color" content="#1b2a41" />
    <link rel="canonical" href="{canonical}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:wght@600;700&display=swap" rel="stylesheet" />
    <link rel="icon" href="{p}favicon.png" sizes="32x32" type="image/png" />
    <link rel="shortcut icon" href="{p}favicon.ico" />
    <link rel="apple-touch-icon" href="{p}apple-touch-icon.png" />
    <link rel="manifest" href="{p}site.webmanifest" />
    <link rel="stylesheet" href="{p}styles.css" />
    {extra_schema}"""


def nav_block(depth: int) -> str:
    p = depth_prefix(depth)
    return f"""    <header class="site-header">
      <div class="container header-inner">
        <a class="site-logo" href="{p}index.html" aria-label="Peacemakers AI home">
          <span class="site-brand">
            <img class="site-brand-mark" src="{p}assets/peacemakers-ai-logo-small.webp" alt="Peacemakers AI logo" width="128" height="128" decoding="async" />
            <span class="site-brand-text">Peacemakers AI</span>
          </span>
        </a>
        <button id="nav-toggle" class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          <span class="sr-only">Toggle navigation</span>
          <span class="nav-toggle-line" aria-hidden="true"></span>
        </button>
        <nav id="site-nav" class="site-nav" aria-label="Primary">
          <ul class="nav-list">
            <li><a href="{p}index.html">Home</a></li>
            <li><a href="{p}blueprint.html">Services</a></li>
            <li><a href="{p}industries/index.html">Industries</a></li>
            <li><a href="{p}locations/index.html">Locations</a></li>
            <li><a href="{p}about.html">About</a></li>
            <li><a href="{p}contact.html">Contact</a></li>
          </ul>
          <a class="btn btn-primary btn-small" href="{p}contact.html">Contact Peacemakers AI</a>
        </nav>
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme"><span aria-hidden="true">Theme</span></button>
      </div>
    </header>"""


def footer_block(depth: int) -> str:
    p = depth_prefix(depth)
    return f"""    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a class="site-logo footer-logo" href="{p}index.html" aria-label="Peacemakers AI home">
            <span class="site-brand">
              <img class="site-brand-mark" src="{p}assets/peacemakers-ai-logo-small.webp" alt="Peacemakers AI logo" width="128" height="128" loading="lazy" decoding="async" />
              <span class="site-brand-text">Peacemakers AI</span>
            </span>
          </a>
          <p class="footer-locale">Peacemakers AI | Asheville, North Carolina | Serving businesses nationwide</p>
          <p class="footer-nap">
            <a href="mailto:{EMAIL}">{EMAIL}</a><br />
            <!-- TODO: add tel link when phone number is provided -->
            Phone: {PHONE_PLACEHOLDER}
          </p>
          <p class="footer-social">
            <a href="{LINKEDIN}" rel="noopener noreferrer" target="_blank">LinkedIn</a>
            <!-- [INSERT FACEBOOK URL] [INSERT INSTAGRAM URL] [INSERT YOUTUBE URL] [INSERT X URL] -->
          </p>
        </div>
        <div>
          <h3>Company</h3>
          <p><a class="footer-domain" href="{p}about.html">About</a></p>
          <p><a class="footer-domain" href="{p}contact.html">Contact</a></p>
          <p><a class="footer-domain" href="{p}privacy-policy.html">Privacy Policy</a></p>
          <p><a class="footer-domain" href="{p}locations/index.html">Locations</a></p>
          <p><a class="footer-domain" href="{p}industries/index.html">Industries</a></p>
        </div>
        <div>
          <h3>Get Started</h3>
          <p><a class="footer-domain" href="{p}scorecard.html">Free AI Opportunity Scorecard</a></p>
          <p><a class="footer-domain" href="{p}blueprint.html">AI Opportunity Blueprint</a></p>
          <p><a class="footer-domain" href="{p}resources.html">Resources</a></p>
          <p><a class="footer-domain" href="{p}security.html">Security</a></p>
          <p><a class="footer-domain" href="{p}ai-consulting-asheville-nc.html">Asheville, NC</a></p>
        </div>
      </div>
    </footer>
    <script src="{p}script.js" defer></script>"""


def page_shell(
    *,
    title: str,
    description: str,
    canonical_path: str,
    depth: int,
    body: str,
    extra_schema: str = "",
) -> str:
    p = depth_prefix(depth)
    return f"""<!DOCTYPE html>
<html lang="en" class="no-js" data-calendly-url="https://calendly.com/james-peacemakersai/30min" data-intro-calendly-url="https://calendly.com/james-peacemakersai">
  <head>
{head_block(title=title, description=description, canonical_path=canonical_path, depth=depth, extra_schema=extra_schema)}
  </head>
  <body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M5L8TPDF" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <a class="skip-link" href="#main">Skip to main content</a>
{nav_block(depth)}
    <main id="main">
{body}
    </main>
{footer_block(depth)}
  </body>
</html>
"""


def org_schema(depth: int) -> str:
    return f"""    <script type="application/ld+json">
      {{
        "@context": "https://schema.org",
        "@type": ["ProfessionalService", "Organization"],
        "name": "Peacemakers AI",
        "url": "{SITE}",
        "logo": "{SITE}/assets/peacemakers-ai-logo.webp",
        "image": "{SITE}/assets/peacemakers-ai-logo.webp",
        "email": "{EMAIL}",
        "telephone": "{PHONE_PLACEHOLDER}",
        "description": "Peacemakers AI provides practical AI consulting, workflow automation, and implementation roadmaps for service-based businesses nationwide.",
        "address": {{
          "@type": "PostalAddress",
          "addressLocality": "Asheville",
          "addressRegion": "NC",
          "addressCountry": "US"
        }},
        "areaServed": [
          {{"@type": "City", "name": "Asheville"}},
          {{"@type": "State", "name": "North Carolina"}},
          {{"@type": "Country", "name": "United States"}}
        ],
        "serviceType": ["AI Consulting", "Business Process Automation", "Workflow Automation", "AI Implementation Roadmaps"],
        "sameAs": ["{LINKEDIN}"]
      }}
    </script>"""


def breadcrumb_schema(items: list[tuple[str, str]]) -> str:
    elements = []
    for i, (name, url) in enumerate(items, start=1):
        elements.append(
            f'{{"@type": "ListItem", "position": {i}, "name": "{esc(name)}", "item": "{url}"}}'
        )
    return f"""    <script type="application/ld+json">
      {{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{", ".join(elements)}]}}
    </script>"""


def faq_schema(faqs: list[tuple[str, str]]) -> str:
    entities = []
    for q, a in faqs:
        entities.append(
            f'{{"@type": "Question", "name": "{esc(q)}", "acceptedAnswer": {{"@type": "Answer", "text": "{esc(a)}"}}}}'
        )
    return f"""    <script type="application/ld+json">
      {{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{", ".join(entities)}]}}
    </script>"""


def write_page(path: Path, html: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")


def generate_core_pages() -> list[str]:
    urls: list[str] = []

    about_body = """
      <section class="hero section industry-hero">
        <div class="container hero-content">
          <p class="eyebrow">About Peacemakers AI</p>
          <h1>Practical AI Strategy &amp; Automation for Service Businesses</h1>
          <p class="hero-sub">Peacemakers AI is an AI consulting and automation partner for service-based businesses that want measurable results—not hype, tool overload, or disconnected experiments.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="contact.html">Contact Peacemakers AI</a>
            <a class="btn btn-ghost" href="blueprint.html">Explore the AI Opportunity Blueprint</a>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container narrow">
          <h2>What We Do</h2>
          <p>We help business owners identify where AI and automation can save time, improve follow-up, simplify reporting, and create real business value. Our work spans AI strategy, automation opportunity discovery, workflow improvement, business process automation, implementation roadmaps, and AI-powered follow-up systems.</p>
          <p>Peacemakers AI is based in Asheville, North Carolina and serves businesses nationwide across the United States. Whether you run a local service company, professional services firm, nonprofit, or growing operator team, we focus on practical implementation you can control.</p>
          <h2>How We Work</h2>
          <p>We start with your real workflows—not generic AI advice. Many teams begin with the <a class="hero-text-link" href="scorecard.html">Free AI Opportunity Scorecard</a> or move directly into the <a class="hero-text-link" href="blueprint.html">AI Opportunity Blueprint</a> for a full 30/60/90-day implementation roadmap.</p>
          <p>From there, we can support selected workflows through AI Quick Win Sprints, Growth Systems, or ongoing advisory—always with a client-controlled, security-aware approach.</p>
          <h2>Who We Serve</h2>
          <p>We work with HVAC companies, plumbers, law firms, real estate teams, builders, nonprofits, property managers, accounting firms, medical practices, consultants, and other service businesses with manual workflows.</p>
          <p>Explore <a class="hero-text-link" href="industries/index.html">industry-specific AI automation services</a> or <a class="hero-text-link" href="locations/index.html">locations we serve nationwide</a>.</p>
        </div>
      </section>
      <section class="section section-cta">
        <div class="container">
          <h2>Ready to Find Practical AI Opportunities?</h2>
          <p class="cta-sub">Contact Peacemakers AI to discuss workflow automation, business process automation, and a practical AI implementation roadmap for your business.</p>
          <div class="cta-stack">
            <a class="btn btn-primary" href="contact.html">Contact Peacemakers AI</a>
            <a class="btn btn-ghost" href="scorecard.html">Get the Free AI Opportunity Scorecard</a>
          </div>
        </div>
      </section>"""

    write_page(
        ROOT / "about.html",
        page_shell(
            title="About Peacemakers AI | Practical AI Strategy & Automation Consulting",
            description="Learn how Peacemakers AI helps service businesses use practical automation, workflow strategy, and AI implementation roadmaps to improve operations.",
            canonical_path="/about",
            depth=0,
            body=about_body,
            extra_schema=org_schema(0),
        ),
    )
    urls.append("/about")

    contact_body = f"""
      <section class="hero section industry-hero">
        <div class="container hero-content">
          <p class="eyebrow">Contact</p>
          <h1>Contact Peacemakers AI</h1>
          <p class="hero-sub">Discuss practical AI automation, workflow improvement, and implementation roadmap options for your business.</p>
        </div>
      </section>
      <section class="section">
        <div class="container narrow">
          <div class="card contact-card">
            <h2>Peacemakers AI</h2>
            <p class="footer-nap">
              <strong>Email:</strong> <a href="mailto:{EMAIL}">{EMAIL}</a><br />
              <strong>Phone:</strong> {PHONE_PLACEHOLDER}<br />
              <strong>Location:</strong> Based in Asheville, North Carolina / Western NC<br />
              <strong>Service area:</strong> Serving businesses nationwide across the United States
            </p>
            <p><strong>LinkedIn:</strong> <a href="{LINKEDIN}" rel="noopener noreferrer" target="_blank">{LINKEDIN}</a></p>
            <p><strong>Google Business Profile:</strong> {GBP_PLACEHOLDER}</p>
            <p class="section-intro">Peacemakers AI is a service-area business. We do not display a public storefront address. When your Google Business Profile URL is available, add it here and in schema markup.</p>
          </div>
          <div class="cta-stack cta-stack-left">
            <a class="btn btn-primary" href="mailto:{EMAIL}">Email Peacemakers AI</a>
            <a class="btn btn-ghost" href="scorecard.html">Get the Free AI Opportunity Scorecard</a>
            <a class="btn btn-secondary" href="https://calendly.com/james-peacemakersai" data-intro-calendly-link>Book a 15-minute intro call</a>
          </div>
        </div>
      </section>"""

    write_page(
        ROOT / "contact.html",
        page_shell(
            title="Contact Peacemakers AI | AI Automation Consulting",
            description="Contact Peacemakers AI to discuss practical AI automation, workflow improvement, and implementation roadmap options for your business.",
            canonical_path="/contact",
            depth=0,
            body=contact_body,
            extra_schema=org_schema(0),
        ),
    )
    urls.append("/contact")

    privacy_body = f"""
      <section class="hero section industry-hero">
        <div class="container hero-content">
          <p class="eyebrow">Privacy</p>
          <h1>Privacy Policy</h1>
          <p class="hero-sub">How Peacemakers AI collects, uses, and protects information when you visit or contact us.</p>
        </div>
      </section>
      <section class="section">
        <div class="container narrow article-body">
          <p><em>Last updated: July 2026. Business owners should have counsel review this policy before relying on it for compliance purposes.</em></p>
          <h2>Information We Collect</h2>
          <p>We may collect information you provide directly (such as name, email, phone, company, and message details), information submitted through forms, and standard technical data such as browser type, device information, and pages visited.</p>
          <h2>Contact Forms</h2>
          <p>When you submit a contact or lead form, we use your information to respond, schedule conversations, and provide requested services or resources.</p>
          <h2>Analytics</h2>
          <p>We use analytics tools (such as Google Analytics and Microsoft Clarity) to understand site usage and improve performance. These tools may use cookies or similar technologies.</p>
          <h2>Cookies and Tracking</h2>
          <p>We use cookies and similar technologies for analytics, performance measurement, and marketing tags managed through Google Tag Manager where applicable.</p>
          <h2>How Data Is Used</h2>
          <p>We use information to respond to inquiries, deliver services, improve our website, measure marketing performance, and communicate with prospective and current clients.</p>
          <h2>Third-Party Tools</h2>
          <p>We use third-party services such as form providers, scheduling tools, email platforms, analytics, and automation tools. Those providers have their own privacy policies and terms.</p>
          <h2>Data Sharing</h2>
          <p>We do not sell personal information. We may share data with service providers who help us operate our business, subject to appropriate safeguards and only as needed.</p>
          <h2>Data Security</h2>
          <p>We use reasonable administrative and technical measures to protect information. No method of transmission or storage is completely secure.</p>
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have rights to access, correct, delete, or restrict certain processing of your personal information. Contact us to make a request.</p>
          <h2>Contact Information</h2>
          <p>Peacemakers AI<br />Email: <a href="mailto:{EMAIL}">{EMAIL}</a><br />Phone: {PHONE_PLACEHOLDER}<br />Based in Asheville, North Carolina. Serving businesses nationwide.</p>
        </div>
      </section>"""

    write_page(
        ROOT / "privacy-policy.html",
        page_shell(
            title="Privacy Policy | Peacemakers AI",
            description="Read the Peacemakers AI privacy policy to learn how information is collected, used, and protected when you visit or contact us.",
            canonical_path="/privacy-policy",
            depth=0,
            body=privacy_body,
            extra_schema=org_schema(0),
        ),
    )
    urls.append("/privacy-policy")
    return urls


def state_content(state: dict, priority: bool) -> str:
    name = state["name"]
    abbrev = state["abbrev"]
    cities = state.get("cities", [])
    city_links = "\n".join(
        f'            <li><a class="hero-text-link" href="{state["slug"]}/{c["slug"]}.html">AI consulting in {c["name"]}, {abbrev}</a></li>'
        for c in cities[:12]
    )
    extra = ""
    if len(cities) > 12:
        extra = f"<li>…and {len(cities) - 12} more cities in {name}</li>"

    long_copy = f"""
          <p>Peacemakers AI helps {name} businesses reduce manual work with practical AI consulting, workflow automation, business process automation, and clear implementation roadmaps. We are based in Asheville, North Carolina and work with service businesses nationwide—including teams across {name}.</p>
          <p>Whether you need an AI readiness assessment, a prioritized automation plan, or help implementing follow-up and reporting workflows, we focus on practical outcomes: faster response times, cleaner operations, and better use of the tools you already own.</p>
          <h2>AI Consulting Services in {name}</h2>
          <ul>
            <li>AI opportunity assessment and workflow review</li>
            <li>Business process automation consulting</li>
            <li>AI implementation roadmap and 30/60/90-day planning</li>
            <li>Lead follow-up and customer communication automation</li>
            <li>Reporting, admin reduction, and operational visibility</li>
          </ul>
          <h2>Who We Help in {name}</h2>
          <p>We work with HVAC companies, plumbers, law firms, real estate teams, builders, nonprofits, property managers, accounting firms, consultants, and other service businesses with repetitive manual workflows.</p>
          <h2>Cities We Serve in {name}</h2>
          <ul class="location-city-list">
{city_links}
{extra}
          </ul>"""

    if priority:
        long_copy += f"""
          <h2>Why {name} Businesses Choose a Practical Approach</h2>
          <p>Most operators do not need another subscription. They need clarity on what to automate first, what to ignore, and how to implement without disrupting the team. That is the focus of the <a class="hero-text-link" href="../blueprint.html">AI Opportunity Blueprint</a> and follow-on implementation support.</p>
          <p>Many teams start with the <a class="hero-text-link" href="../scorecard.html">Free AI Opportunity Scorecard</a> to identify high-value workflow opportunities before committing to a full roadmap.</p>
          <h2>Implementation Without Hype</h2>
          <p>Peacemakers AI uses a client-controlled approach: you own your systems, data, approvals, and final decisions. We recommend practical workflows, document the plan, and support implementation where it makes sense.</p>"""

    faqs = [
        (
            f"Do you only serve businesses physically located in {name}?",
            f"No. Peacemakers AI is based in Asheville, NC and serves businesses nationwide, including {name}. We work remotely with service businesses across the state.",
        ),
        (
            "What is the first step?",
            "Many businesses start with the Free AI Opportunity Scorecard or book a short intro conversation to discuss fit and priorities.",
        ),
        (
            "Do you implement automation or only advise?",
            "Both. After the AI Opportunity Blueprint, we can implement selected workflows through Quick Win Sprints, Growth Systems, or ongoing advisory.",
        ),
    ]

    schema = breadcrumb_schema(
        [
            ("Home", f"{SITE}/"),
            ("Locations", f"{SITE}/locations"),
            (name, f"{SITE}/locations/{state['slug']}"),
        ]
    ) + "\n" + faq_schema(faqs)

    body = f"""
      <section class="hero section industry-hero">
        <div class="container hero-content">
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Home</a> · <a href="index.html">Locations</a> · {esc(name)}</nav>
          <p class="eyebrow">{abbrev} · Nationwide Service</p>
          <h1>AI Consulting &amp; Automation Services in {esc(name)}</h1>
          <p class="hero-sub">Practical AI consulting, workflow automation, and implementation roadmaps for service businesses in {esc(name)}.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="../contact.html">Contact Peacemakers AI</a>
            <a class="btn btn-ghost" href="../scorecard.html">Free AI Opportunity Scorecard</a>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container narrow">
{long_copy}
        </div>
      </section>
      <section class="section section-alt">
        <div class="container">
          <h2>FAQ — AI Consulting in {esc(name)}</h2>
          <div class="grid-2">
            {''.join(f'<article class="card"><h3>{esc(q)}</h3><p>{esc(a)}</p></article>' for q, a in faqs)}
          </div>
        </div>
      </section>"""

    return page_shell(
        title=f"AI Consulting & Automation Services in {name} | Peacemakers AI",
        description=f"Peacemakers AI helps {name} businesses reduce manual work with practical AI consulting, workflow automation, and implementation roadmaps.",
        canonical_path=f"/locations/{state['slug']}",
        depth=1,
        body=body,
        extra_schema=schema,
    )


def city_content(state: dict, city: dict) -> str:
    state_name = state["name"]
    state_slug = state["slug"]
    abbrev = state["abbrev"]
    city_name = city["name"]
    faqs = [
        (
            f"Do you work with businesses in {city_name}?",
            f"Yes. Peacemakers AI serves service businesses in {city_name}, {state_name}, and nationwide.",
        ),
        (
            "What industries do you support?",
            "HVAC, plumbing, law firms, real estate, builders, nonprofits, property management, accounting, medical practices, and other service businesses.",
        ),
        (
            "What is the first step?",
            "Start with the Free AI Opportunity Scorecard or contact us to discuss your workflows and goals.",
        ),
    ]
    schema = breadcrumb_schema(
        [
            ("Home", f"{SITE}/"),
            ("Locations", f"{SITE}/locations"),
            (state_name, f"{SITE}/locations/{state_slug}"),
            (city_name, f"{SITE}/locations/{state_slug}/{city['slug']}"),
        ]
    ) + "\n" + faq_schema(faqs)

    body = f"""
      <section class="hero section industry-hero">
        <div class="container hero-content">
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../../index.html">Home</a> · <a href="../index.html">Locations</a> · <a href="../{state_slug}.html">{esc(state_name)}</a> · {esc(city_name)}</nav>
          <p class="eyebrow">{esc(city_name)}, {abbrev}</p>
          <h1>AI Consulting &amp; Automation Services in {esc(city_name)}, {abbrev}</h1>
          <p class="hero-sub">Practical AI consulting and workflow automation for service businesses in {esc(city_name)}—backed by a nationwide implementation team based in Asheville, North Carolina.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="../../contact.html">Contact Peacemakers AI</a>
            <a class="btn btn-ghost" href="../../blueprint.html">AI Opportunity Blueprint</a>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container narrow">
          <p>Businesses in {esc(city_name)} often face the same operational pressure points: missed calls, inconsistent follow-up, manual reporting, and tool sprawl without a clear plan. Peacemakers AI helps operators identify practical automation opportunities and build a realistic AI implementation roadmap.</p>
          <h2>Workflow Automation for {esc(city_name)} Service Businesses</h2>
          <p>We review lead intake, customer communication, dispatch support, CRM hygiene, reporting, and admin workflows—then prioritize the highest-impact opportunities for your team.</p>
          <h2>Examples of Businesses That Benefit</h2>
          <ul>
            <li>HVAC and plumbing companies with seasonal demand spikes</li>
            <li>Law firms and professional services teams with intake bottlenecks</li>
            <li>Real estate teams needing faster inquiry response</li>
            <li>Builders, nonprofits, and property managers with document and follow-up load</li>
          </ul>
          <p>Explore <a class="hero-text-link" href="../../industries/index.html">industry-specific automation guides</a> or return to <a class="hero-text-link" href="../{state_slug}.html">AI consulting in {esc(state_name)}</a>.</p>
        </div>
      </section>
      <section class="section section-alt">
        <div class="container">
          <h2>FAQ — {esc(city_name)}</h2>
          <div class="grid-2">
            {''.join(f'<article class="card"><h3>{esc(q)}</h3><p>{esc(a)}</p></article>' for q, a in faqs)}
          </div>
        </div>
      </section>"""

    return page_shell(
        title=f"AI Consulting & Automation Services in {city_name}, {abbrev} | Peacemakers AI",
        description=f"Peacemakers AI helps {city_name}, {state_name} businesses reduce manual work with practical AI consulting, workflow automation, and implementation roadmaps.",
        canonical_path=f"/locations/{state_slug}/{city['slug']}",
        depth=2,
        body=body,
        extra_schema=schema,
    )


def generate_location_pages(loc_data: dict) -> list[str]:
    urls: list[str] = []
    states = loc_data["states"]

    state_links = "\n".join(
        f'            <a class="card industry-link-card" href="{s["slug"]}.html">{s["name"]}</a>'
        for s in states
    )

    hub_body = f"""
      <section class="hero section industry-hero">
        <div class="container hero-content">
          <p class="eyebrow">Locations</p>
          <h1>AI Consulting Locations — Nationwide Service</h1>
          <p class="hero-sub">Peacemakers AI is based in Asheville, North Carolina and helps service-based businesses across the United States reduce manual work with practical AI automation.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="../contact.html">Contact Peacemakers AI</a>
            <a class="btn btn-ghost" href="../ai-consulting-asheville-nc.html">Asheville &amp; Western NC</a>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <h2>States We Serve</h2>
          <p class="section-intro">Select a state to explore AI consulting, workflow automation, and implementation roadmap support for service businesses in your area.</p>
          <div class="grid-3">
{state_links}
          </div>
          <p class="section-intro">Priority expansion states: North Carolina, South Carolina, Georgia, Florida, Tennessee, Texas, Virginia, and Alabama. Additional city pages can be phased in over time.</p>
        </div>
      </section>"""

    write_page(
        ROOT / "locations" / "index.html",
        page_shell(
            title="AI Consulting Locations | Peacemakers AI",
            description="Peacemakers AI provides practical AI consulting and automation services for businesses nationwide, based in Asheville, North Carolina.",
            canonical_path="/locations",
            depth=1,
            body=hub_body,
            extra_schema=org_schema(1),
        ),
    )
    urls.append("/locations")

    for state in states:
        slug = state["slug"]
        write_page(ROOT / "locations" / f"{slug}.html", state_content(state, slug in PRIORITY_STATES))
        urls.append(f"/locations/{slug}")

        generate_cities = slug == "north-carolina" or slug in PRIORITY_STATES
        if not generate_cities:
            continue
        for city in state.get("cities", []):
            write_page(
                ROOT / "locations" / slug / f"{city['slug']}.html",
                city_content(state, city),
            )
            urls.append(f"/locations/{slug}/{city['slug']}")

    return urls


def industry_page(ind: dict) -> str:
    pain = "".join(f"<article class='card'><h3>{esc(p)}</h3></article>" for p in ind["pain_points"])
    opps = "".join(f"<article class='card'><h3>{esc(o)}</h3><p>Practical workflow design to improve consistency and reduce manual effort.</p></article>" for o in ind["opportunities"])
    examples = "".join(f"<article class='card'><h3>{esc(e)}</h3></article>" for e in ind["examples"])
    faqs = [
        ("Should we start with the scorecard or Blueprint?", "Start with the scorecard for a low-commitment baseline; move to the Blueprint when you are ready to prioritize implementation."),
        ("Can this work with our current tools?", "Yes. We start from your existing systems and recommend targeted improvements."),
    ]
    schema = breadcrumb_schema(
        [("Home", f"{SITE}/"), ("Industries", f"{SITE}/industries"), (ind["name"], f"{SITE}/industries/{ind['slug']}")]
    ) + "\n" + faq_schema(faqs)

    body = f"""
      <section class="hero section industry-hero">
        <div class="container hero-content">
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Home</a> · <a href="index.html">Industries</a> · {esc(ind['name'])}</nav>
          <p class="eyebrow">Industry Solutions</p>
          <h1>AI Automation for {esc(ind['name'])}</h1>
          <p class="hero-sub">{esc(ind['hero'])}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="../scorecard.html">Free AI Opportunity Scorecard</a>
            <a class="btn btn-ghost" href="../contact.html">Contact Peacemakers AI</a>
          </div>
        </div>
      </section>
      <section class="section"><div class="container"><h2>Common Pain Points</h2><div class="grid-3">{pain}</div></div></section>
      <section class="section section-alt"><div class="container"><h2>AI Opportunities</h2><div class="grid-3">{opps}</div></div></section>
      <section class="section"><div class="container"><h2>Example Workflows</h2><div class="grid-3">{examples}</div></div></section>
      <section class="section section-alt"><div class="container narrow"><h2>Security &amp; Client Control</h2><p>Recommendations are built around your systems, approvals, and data sensitivity standards.</p><a class="hero-text-link" href="../security.html">Read Our AI Security Approach</a></div></section>
      <section class="section"><div class="container"><h2>FAQ</h2><div class="grid-2">{''.join(f'<article class="card"><h3>{esc(q)}</h3><p>{esc(a)}</p></article>' for q, a in faqs)}</div>
      <p><a class="hero-text-link" href="../locations/index.html">See locations we serve</a> · <a class="hero-text-link" href="../blueprint.html">AI Opportunity Blueprint</a></p></div></section>"""

    return page_shell(
        title=ind["title"],
        description=ind["description"],
        canonical_path=f"/industries/{ind['slug']}",
        depth=1,
        body=body,
        extra_schema=schema,
    )


def generate_industry_pages(ind_data: dict) -> list[str]:
    urls: list[str] = []
    industries = ind_data["industries"]
    cards = "\n".join(
        f'            <a class="card industry-link-card" href="{i["slug"]}.html">{esc(i["name"])}</a>'
        for i in industries
    )
    hub_body = f"""
      <section class="hero section industry-hero">
        <div class="container hero-content">
          <p class="eyebrow">Industries</p>
          <h1>AI Automation for Service Businesses</h1>
          <p class="hero-sub">Explore practical AI automation services for HVAC companies, plumbers, law firms, real estate agents, builders, nonprofits, and other service businesses.</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="grid-3">
{cards}
          </div>
          <!-- TODO: Build city/industry combination pages (e.g., HVAC in Charlotte) with unique content blocks. -->
        </div>
      </section>"""

    write_page(
        ROOT / "industries" / "index.html",
        page_shell(
            title="AI Automation for Service Businesses | Peacemakers AI",
            description="Explore AI automation services for HVAC companies, plumbers, law firms, real estate agents, builders, nonprofits, and other service businesses.",
            canonical_path="/industries",
            depth=1,
            body=hub_body,
            extra_schema=org_schema(1),
        ),
    )
    urls.append("/industries")

    for ind in industries:
        write_page(ROOT / "industries" / f"{ind['slug']}.html", industry_page(ind))
        urls.append(f"/industries/{ind['slug']}")

    return urls


def generate_sitemap(extra_urls: list[str]) -> None:
    static_urls = [
        "/",
        "/about",
        "/contact",
        "/privacy-policy",
        "/scorecard.html",
        "/blueprint.html",
        "/early-access.html",
        "/security.html",
        "/resources.html",
        "/ai-consulting-asheville-nc.html",
        "/ai-consulting-for-service-businesses.html",
        "/ai-for-home-service-businesses.html",
        "/ai-for-accounting-firms.html",
        "/ai-for-law-firms.html",
        "/ai-for-nonprofits.html",
        "/ai-for-consultants.html",
        "/ai-for-real-estate.html",
        "/local-service-ai-audit.html",
        "/local-service-ai-checklist.html",
        "/explainer.html",
        "/resources/what-is-an-ai-opportunity-blueprint.html",
        "/blog/ai-for-nonprofits",
        "/blog/ai-for-nonprofits/can-ai-help-small-nonprofit-do-more-with-less",
        "/blog/ai-for-nonprofits/where-should-a-nonprofit-start-with-ai",
        "/blog/ai-for-nonprofits/how-much-will-ai-tools-cost-my-nonprofit",
        "/services/ai-strategy-nonprofits",
        "/resources/ai-starter-kit",
        "/blog/ai-for-small-business",
        "/blog/ai-for-small-business/how-much-does-ai-cost-for-small-business",
        "/blog/ai-for-small-business/how-do-i-know-if-ai-is-right-for-my-business",
        "/blog/ai-for-small-business/which-ai-tool-should-i-choose-for-my-small-business",
        "/blog/ai-for-small-business/roi-of-ai-tools-for-small-businesses",
        "/blog/ai-for-small-business/implement-ai-without-disrupting-business",
        "/services/ai-strategy-small-business",
        "/resources/ai-small-business-starter-kit",
    ]
    all_urls = sorted(set(static_urls + extra_urls))
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url in all_urls:
        loc = SITE + (url if url.startswith("/") else "/" + url)
        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        lines.append("  </url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    loc_data = load_json("locations.json")
    ind_data = load_json("industries.json")
    urls: list[str] = []
    urls.extend(generate_core_pages())
    urls.extend(generate_location_pages(loc_data))
    urls.extend(generate_industry_pages(ind_data))
    generate_sitemap(urls)
    print(f"Generated {len(urls)} SEO URLs (+ static entries in sitemap)")


if __name__ == "__main__":
    main()
