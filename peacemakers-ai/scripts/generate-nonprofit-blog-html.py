#!/usr/bin/env python3
"""Generate static HTML for AI for Nonprofits blog cluster."""
import json
import os

BASE = os.path.join(os.path.dirname(__file__), "..", "resources", "ai-for-nonprofits")
os.makedirs(BASE, exist_ok=True)


def article_head(meta):
    ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": meta["title"],
        "description": meta["meta_description"],
        "datePublished": "2026-07-07",
        "author": {"@type": "Organization", "name": "Peacemakers"},
        "publisher": {
            "@type": "Organization",
            "name": "Peacemakers AI",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.peacemakersai.com/assets/peacemakers-ai-logo.png",
            },
        },
        "image": "https://www.peacemakersai.com/assets/peacemakers-ai-logo.png",
        "mainEntityOfPage": f"https://www.peacemakersai.com/blog/ai-for-nonprofits/{meta['slug']}",
        "articleSection": "AI for Nonprofits",
        "keywords": meta.get("keywords", "AI for nonprofits"),
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
    <meta property="og:url" content="https://www.peacemakersai.com/blog/ai-for-nonprofits/{meta['slug']}" />
    <meta property="og:image" content="https://www.peacemakersai.com/assets/peacemakers-ai-logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{meta['title']} | Peacemakers AI" />
    <meta name="twitter:description" content="{meta['meta_description']}" />
    <meta name="twitter:image" content="https://www.peacemakersai.com/assets/peacemakers-ai-logo.png" />
    <link rel="canonical" href="https://www.peacemakersai.com/blog/ai-for-nonprofits/{meta['slug']}" />
    <link rel="stylesheet" href="/styles.css" />
    <script type="application/ld+json">{json.dumps(ld, separators=(',', ':'))}</script>
  </head>"""


HEADER = """  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header"><div class="container header-inner">
      <a class="site-logo" href="/index.html"><span class="site-brand"><img class="site-brand-mark" src="/assets/peacemakers-ai-logo.png" alt="Peacemakers AI logo" /><span class="site-brand-text">Peacemakers AI</span></span></a>
      <button id="nav-toggle" class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Toggle navigation</span><span class="nav-toggle-line" aria-hidden="true"></span></button>
      <nav id="site-nav" class="site-nav" aria-label="Primary"><ul class="nav-list">
        <li><a href="/index.html">Home</a></li>
        <li><a href="/resources.html">Resources</a></li>
        <li><a href="/blog/ai-for-nonprofits">AI for Nonprofits</a></li>
        <li><a href="/services/ai-strategy-nonprofits">Nonprofit Consulting</a></li>
      </ul><a class="btn btn-primary btn-small" href="#" data-calendly-link data-track="calendly_cta">Book a Call</a></nav>
      <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme"><span aria-hidden="true">Theme</span></button>
    </div></header>
    <main id="main">"""

FOOTER = """    </main>
    <footer class="site-footer"><div class="container footer-grid">
      <div><a class="site-logo footer-logo" href="/index.html"><span class="site-brand"><img class="site-brand-mark" src="/assets/peacemakers-ai-logo.png" alt="" /><span class="site-brand-text">Peacemakers AI</span></span></a></div>
      <div><h3>Series</h3><p><a class="footer-domain" href="/blog/ai-for-nonprofits">AI for Nonprofits</a></p><p><a class="footer-domain" href="/services/ai-strategy-nonprofits">Nonprofit AI Consulting</a></p></div>
      <div><h3>More</h3><p><a class="footer-domain" href="/ai-for-nonprofits.html">Industry Page</a></p><p><a class="footer-domain" href="/resources.html">All Resources</a></p></div>
    </div></footer>
    <script src="/script.js" defer></script>
  </body>
</html>"""


def cta(title, desc, btn, href="/services/ai-strategy-nonprofits"):
    return f"""<aside class="cta-block" aria-label="Call to action">
      <h3 class="cta-block-title">{title}</h3>
      <p class="cta-block-description">{desc}</p>
      <a class="btn btn-primary" href="{href}">{btn}</a>
    </aside>"""


def magnet(title, desc, btn, source):
    return f"""<aside class="lead-magnet-form" aria-label="Free resource download">
      <h3 class="lead-magnet-title">{title}</h3>
      <p class="lead-magnet-description">{desc}</p>
      <form class="lead-magnet-form-inner" data-lead-magnet-form data-success-redirect="/resources/ai-starter-kit" action="https://formspree.io/f/maqaaddz" method="POST" novalidate>
        <input type="hidden" name="page_source" value="{source}" />
        <input type="hidden" name="submitted_at" value="" />
        <input type="hidden" name="_subject" value="Nonprofit AI Lead Magnet Request" />
        <input type="hidden" name="industry" value="Nonprofit" />
        <input type="hidden" name="needs" value="Lead magnet download request" />
        <input type="hidden" name="full_name" value="Lead magnet subscriber" />
        <label class="sr-only" for="lm-{source}">Email</label>
        <input id="lm-{source}" name="email" type="email" autocomplete="email" placeholder="Your work email" required />
        <button class="btn btn-secondary" type="submit" data-submit-label="{btn}">{btn}</button>
        <p class="form-status" data-form-status aria-live="polite"></p>
      </form>
    </aside>"""


def hero(h1, crumb):
    return f"""<section class="hero section"><div class="container hero-content narrow">
        <p class="eyebrow">AI for Nonprofits</p>
        <h1>{h1}</h1>
        <p class="article-meta">Published July 7, 2026 · AI for Nonprofits</p>
      </div></section>
      <section class="section"><div class="container narrow article-body">
        <nav class="breadcrumb" aria-label="Breadcrumb">{crumb}</nav>"""


def write_article(meta, body_inner):
    html = article_head(meta) + HEADER + body_inner + FOOTER
    path = os.path.join(BASE, f"{meta['slug']}.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Wrote", path)


# Post 1
write_article(
    {
        "slug": "can-ai-help-small-nonprofit-do-more-with-less",
        "title": "Can AI Really Help My Small Nonprofit Do More With Less?",
        "meta_description": "Learn whether AI is worth it for small nonprofits, where it saves time, what risks to watch for, and how to use it without losing your mission or voice.",
        "keywords": "AI for small nonprofits, nonprofit AI, nonprofit SEO",
    },
    hero(
        "Can AI Really Help My Small Nonprofit Do More With Less?",
        '<a href="/index.html">Home</a> · <a href="/resources.html">Resources</a> · <a href="/blog/ai-for-nonprofits">AI for Nonprofits</a> · <span>Can AI Help?</span>',
    )
    + """
        <p>Small nonprofits are often expected to do everything at once: raise money, serve clients, recruit volunteers, and keep the website updated. AI can help with that pressure by reducing the time spent on routine marketing and content tasks, especially when your team has limited staff and budget.</p>
        <p>The key question is not whether AI is impressive. It is whether AI can produce real value for a small nonprofit without creating extra work or risking your credibility. In most cases, the answer is yes—if you use it carefully and for the right tasks.</p>
        <h2>Why small nonprofits are considering AI</h2>
        <p>Many nonprofits are turning to AI because they need faster content production, better search visibility, and more efficient use of staff time. AI tools can help identify search terms, draft blog outlines, repurpose content, and answer common supporter questions in formats that search tools understand.</p>
        <p>For a small team, that matters. Instead of spending hours staring at a blank page, staff can use AI to create a first draft and then refine it with real program knowledge, local context, and the nonprofit's voice. That makes it easier to publish consistently, which is important for SEO and for staying visible online.</p>
        <h2>Where AI saves the most time</h2>
        <p>AI is most helpful when it handles repeatable work rather than sensitive decision-making. Examples include:</p>
        <ul><li>Brainstorming blog ideas based on common donor or volunteer questions.</li><li>Drafting article outlines and FAQs.</li><li>Suggesting long-tail keywords that match supporter intent.</li><li>Rewriting older content so it stays current.</li><li>Turning one blog post into social media captions or newsletter copy.</li></ul>
        <p>This is especially valuable for nonprofit SEO. AI can speed up the workflow of planning content around real search intent, structuring posts with clear headings, and updating older pages to keep them fresh. But it should not be the final editor.</p>
        """
    + cta(
        "Want help mapping AI to your workloads?",
        "If you run a small nonprofit and you're not sure where AI actually saves time for your team, Peacemakers offers a 30-minute AI Efficiency Mini-Audit to identify 2-3 high-impact use cases tailored to your organization.",
        "Book your AI Efficiency Mini-Audit",
    )
    + magnet(
        "Free Download: Nonprofit AI Efficiency Checklist",
        "Get a one-page checklist that helps your small nonprofit pinpoint where AI can save time on writing, admin, and reporting—without adding stress or complexity. Enter your email to receive the checklist and our monthly Nonprofit AI Briefing.",
        "Send me the checklist",
        "post1-checklist",
    )
    + """
        <h2>Where AI falls short</h2>
        <p>AI is useful, but it is not a substitute for nonprofit expertise. It can miss nuance, invent details, flatten your voice, or produce content that sounds polished but does not reflect your mission accurately. For nonprofits, trust is part of your brand.</p>
        <p>It is also easy to overuse AI in ways that make content feel generic. If your blog posts do not include your local community, real outcomes, or specific examples from your work, they will probably not stand out in search or persuade readers to act. AI can help with the draft, but your team still needs to provide the insight and proof.</p>
        <h2>A simple test for ROI</h2>
        <ul><li>Publish content more consistently.</li><li>Save several hours a week on writing or editing.</li><li>Improve rankings for the questions your audience actually searches.</li><li>Refresh older pages instead of letting them go stale.</li><li>Turn one piece of content into multiple formats.</li></ul>
        <p>If AI does not clearly reduce work or improve results, it may just become another tool to manage. Small nonprofits do best when they start with one practical use case, measure the time saved, and expand only if it produces real benefit.</p>
        <p>When you are ready for a <a href="/blog/ai-for-nonprofits/where-should-a-nonprofit-start-with-ai">clear entry point</a> for your <a href="/blog/ai-for-nonprofits/where-should-a-nonprofit-start-with-ai">first AI pilot</a>, our implementation guide walks through <a href="/blog/ai-for-nonprofits/where-should-a-nonprofit-start-with-ai">starting small</a> without overwhelming your team. Pair that with realistic <a href="/blog/ai-for-nonprofits/how-much-will-ai-tools-cost-my-nonprofit">AI budgets</a>, <a href="/blog/ai-for-nonprofits/how-much-will-ai-tools-cost-my-nonprofit">pricing</a>, and <a href="/blog/ai-for-nonprofits/how-much-will-ai-tools-cost-my-nonprofit">cost</a> planning so adoption stays sustainable.</p>
        <h2>Best use cases for nonprofits</h2>
        <ul><li>SEO blog outlines and first drafts.</li><li>FAQ content for service and donation pages.</li><li>Internal link suggestions between blogs and program pages.</li><li>Content updates for outdated statistics or announcements.</li><li>Social media and newsletter repurposing from one core article.</li></ul>
        <h2>Practical guardrails</h2>
        <ul><li>Human review before publishing.</li><li>Fact-checking for every statistic and program claim.</li><li>Brand-voice editing so content still sounds like your organization.</li><li>A simple process for updating old posts regularly.</li><li>Clear rules about sensitive topics, client stories, and donor information.</li></ul>
        <p>Need hands-on <a href="/services/ai-strategy-nonprofits">help</a> or implementation <a href="/services/ai-strategy-nonprofits">guidance</a>? Peacemakers works with small nonprofits on practical pilots, tool selection, and staff training.</p>
        """
    + cta(
        "Ready to explore AI for your small nonprofit?",
        "Peacemakers helps resource-constrained nonprofits design practical AI pilots, choose affordable tools, and train staff—without the hype. We offer a 30-minute AI Efficiency Mini-Audit, a custom AI roadmap for small teams, and board and staff training on responsible AI.",
        "Schedule a Free Discovery Call",
    )
    + "</div></section>",
)

# Post 2
write_article(
    {
        "slug": "where-should-a-nonprofit-start-with-ai",
        "title": "Where Should a Nonprofit Start With AI Implementation?",
        "meta_description": "Learn how small nonprofits can choose a safe, practical starting point with AI, avoid overwhelm, and set up pilots that actually save time.",
        "keywords": "AI implementation for nonprofits, nonprofit AI pilots",
    },
    hero(
        "Where Should a Nonprofit Start With AI Implementation?",
        '<a href="/index.html">Home</a> · <a href="/resources.html">Resources</a> · <a href="/blog/ai-for-nonprofits">AI for Nonprofits</a> · <span>Where to Start</span>',
    )
    + """
        <p>For a small nonprofit, the question is not "Which AI tool is the most impressive?" but "Where can AI immediately save us time without risking our mission or overwhelming our team?" The best place to start is with one or two everyday workflows that frustrate staff and do not require deep technical changes—then use AI as a helper, not a replacement.</p>
        <p>If you are still deciding whether AI is worth the effort, read <a href="/blog/ai-for-nonprofits/can-ai-help-small-nonprofit-do-more-with-less">how AI can help your small nonprofit do more with less</a> first.</p>
        <h2>Step 1: Clarify what "doing more with less" means for you</h2>
        <p>Before choosing a tool, define what success would look like for your organization. Some nonprofits want to free up staff time; others want better donor communication; some need help keeping their website content up to date.</p>
        <p>Ask a few simple questions:</p>
        <ul><li>Which recurring tasks eat hours every week?</li><li>Where does our team feel a bottleneck—writing, data entry, reporting?</li><li>If AI could remove one type of work, what would make the biggest difference?</li></ul>
        <h2>Step 2: Start with "mini-pilots" inside existing workflows</h2>
        <ul><li>Meeting summaries: Paste notes into an AI tool and generate a one-page recap with action items.</li><li>Donor or client thank-you drafts: Use AI to create a first draft, then personalize it before sending.</li><li>Newsletter or blog outlines: Turn rough bullet points into a structured article outline with headings.</li></ul>
        <h2>Step 3: Choose tools that fit a small nonprofit</h2>
        <ul><li>Ease of use: Can non-technical staff use it after a short demo?</li><li>Cost: Does it fit the budget, and can you start with a free or low-cost tier?</li><li>Integration: Does it work with your current email, CRM, or document tools?</li><li>Data security: Does the provider explain how they protect your donor and client information?</li></ul>
        """
    + cta(
        "Not sure how to choose your first AI pilot?",
        "Peacemakers offers a Nonprofit AI Starter Roadmap session where we walk through your current workflows and identify one safe, high-impact pilot tailored to your mission and capacity. You'll leave with a clearly defined first AI use case, success metrics and guardrails, and next-step recommendations for tools and training.",
        "Get your AI Starter Roadmap",
    )
    + magnet(
        "Free Tool: Nonprofit AI Pilot Planner",
        "Download our simple 1-page template to define your first AI use case, success metrics, and safeguards—perfect for small teams and boards.",
        "Download the AI Pilot Planner",
        "post2-planner",
    )
    + """
        <h2>Step 4: Set basic guardrails so AI stays aligned with your mission</h2>
        <ul><li>Human review: AI drafts must be checked for accuracy, tone, and fit with your values.</li><li>Brand voice: Staff should edit outputs so they sound like your organization, not a generic template.</li><li>Privacy: Sensitive donor, client, or staff data should not be uploaded to public tools without safeguards.</li><li>Transparency: Be honest with stakeholders about how you use AI and why it helps your work.</li></ul>
        <h2>Step 5: Pick success metrics and learn as you go</h2>
        <ul><li>Hours saved per month on writing or summarizing.</li><li>Number of donor emails or updates that go out on time.</li><li>Frequency of new blog posts or newsletters.</li><li>Staff satisfaction with the new process.</li></ul>
        <h2>Step 6: Identify internal champions and build comfort</h2>
        <ul><li>Host short "AI lunch-and-learns" where staff test a tool together on real tasks.</li><li>Create a shared "prompt library" with examples that fit your organization's voice.</li><li>Invite feedback about what works and what feels risky or misaligned.</li></ul>
        <h2>A simple starting roadmap for a small nonprofit</h2>
        <ul><li>Month 1: Choose two high-frustration tasks and test one AI tool on them.</li><li>Month 2: Write a short internal AI guideline, refine prompts, and measure time saved.</li><li>Month 3: Decide whether to add one more use case based on results.</li></ul>
        <p>Before you scale, review <a href="/blog/ai-for-nonprofits/how-much-will-ai-tools-cost-my-nonprofit">how much AI tools will cost</a> and build <a href="/blog/ai-for-nonprofits/how-much-will-ai-tools-cost-my-nonprofit">budget planning for AI adoption</a> into your board conversations.</p>
        <p>Explore our <a href="/services/ai-strategy-nonprofits">AI strategy</a>, <a href="/services/ai-strategy-nonprofits">AI consulting</a>, and staff <a href="/services/ai-strategy-nonprofits">training</a> options when you want a partner.</p>
        """
    + cta(
        "Need a partner to guide your first AI steps?",
        "Peacemakers works with small nonprofits to identify low-risk AI pilots, build simple governance and AI policies, and train staff and boards on responsible AI use.",
        "Talk to Peacemakers about your first AI pilot",
    )
    + "</div></section>",
)

# Post 3
write_article(
    {
        "slug": "how-much-will-ai-tools-cost-my-nonprofit",
        "title": "How Much Will AI Tools Cost My Nonprofit? A Practical Budget Guide",
        "meta_description": "Understand typical AI costs for small nonprofits—from free tiers to discounted team plans—and learn how to build a realistic AI budget that supports your mission.",
        "keywords": "AI tools cost for nonprofits, nonprofit AI budget planning",
    },
    hero(
        "How Much Will AI Tools Cost My Nonprofit? A Practical Budget Guide",
        '<a href="/index.html">Home</a> · <a href="/resources.html">Resources</a> · <a href="/blog/ai-for-nonprofits">AI for Nonprofits</a> · <span>AI Budget</span>',
    )
    + """
        <p>Nonprofits often assume AI is either completely free or painfully expensive. In reality, most small organizations will fall somewhere in the middle: a blend of free tiers, nonprofit discounts, and a few carefully chosen paid licenses that together cost hundreds to a few thousand dollars per year.</p>
        <h2>The three main cost layers of nonprofit AI</h2>
        <ul><li>Core AI assistant tools: Generative AI for writing, summarizing, and research.</li><li>Specialized nonprofit tools: Platforms built for fundraising, grants, finance, or program management that include AI features.</li><li>Implementation and training costs: Staff time for learning, prompt design, policy development, and governance.</li></ul>
        <h2>What does the software itself cost?</h2>
        <h3>1. General-purpose AI assistants</h3>
        <p>At small scale, giving 3-5 core staff access to a paid AI assistant often costs a few hundred to a few thousand dollars per year.</p>
        <h3>2. Nonprofit-specific AI platforms</h3>
        <p>Some AI workspaces charge per organization—often in the range of $100–$200 per month for the whole team instead of per user.</p>
        <h3>3. Low-cost and free supporting tools</h3>
        <p>Design suites, automation tools, and transcription apps often have free plans adequate for small teams.</p>
        <h2>Why "seat-based" pricing can surprise small nonprofits</h2>
        <ul><li>Identify who truly needs direct access versus who can work through shared accounts or outputs.</li><li>Consider organization-level licenses or nonprofit-specific platforms that cap costs per organization.</li><li>Regularly audit unused seats so you are not paying for logins that see little activity.</li></ul>
        """
    + cta(
        "Want help right-sizing your AI budget?",
        "Peacemakers offers a Nonprofit AI Budget Review to help you decide what to pay for, what to keep free, and how to avoid overspending on per-user licenses.",
        "Request an AI Budget Review",
    )
    + """
        <h2>Hidden costs: time, training, and governance</h2>
        <ul><li>Staff training sessions and "AI onboarding" workshops.</li><li>Time spent developing and maintaining an internal AI policy.</li><li>Governance activities such as oversight committees or designated AI leads.</li></ul>
        <h2>A realistic budget range for small nonprofits</h2>
        <ul><li>Minimal-cost starter stack: $0–$500 per year.</li><li>Focused small-team stack: $1,500–$5,000 per year.</li><li>Larger or multi-department stack: $5,000+ per year.</li></ul>
        """
    + magnet(
        "Free Worksheet: Nonprofit AI Budget Planner",
        "Map your core AI tools, seats, discounts, and training time into one simple budget worksheet so you know exactly what AI will cost—and why.",
        "Get the AI Budget Planner",
        "post3-budget",
    )
    + """
        <h2>How to build an AI budget that fits your mission</h2>
        <ul><li>Start with one core assistant tool and one or two specialized platforms.</li><li>Use free and discounted tools for supporting tasks.</li><li>Set an annual AI budget ceiling.</li><li>Review your AI stack every 6-12 months.</li></ul>
        <p>Not sure <a href="/blog/ai-for-nonprofits/can-ai-help-small-nonprofit-do-more-with-less">if AI is worth implementing</a>? Start with our overview of <a href="/blog/ai-for-nonprofits/can-ai-help-small-nonprofit-do-more-with-less">how much AI helps you do more with less</a>, then use our guide on <a href="/blog/ai-for-nonprofits/where-should-a-nonprofit-start-with-ai">starting small</a> <a href="/blog/ai-for-nonprofits/where-should-a-nonprofit-start-with-ai">before layering on AI</a> across the organization.</p>
        <p>Peacemakers also offers nonprofit <a href="/services/ai-strategy-nonprofits">AI strategy</a> and hands-on <a href="/services/ai-strategy-nonprofits">AI budget planning</a> support.</p>
        """
    + cta(
        "Need a clear AI cost and benefit picture?",
        "Peacemakers helps nonprofit leaders evaluate AI tools and nonprofit discounts, build realistic AI budgets tied to strategy, and present AI plans and costs to boards and funders.",
        "Schedule an AI Budget & Strategy Session",
    )
    + "</div></section>",
)

# Cluster index
index_html = """<!DOCTYPE html>
<html lang="en" class="no-js" data-calendly-url="https://calendly.com/james-peacemakersai/30min" data-intro-calendly-url="https://calendly.com/james-peacemakersai">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI for Nonprofits | Peacemakers AI</title>
    <meta name="description" content="Practical AI guides for small nonprofits—where to start, what it costs, and how to do more with less without losing your mission or voice." />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="AI for Nonprofits | Peacemakers AI" />
    <meta property="og:description" content="A three-part article series on practical nonprofit AI adoption." />
    <meta property="og:url" content="https://www.peacemakersai.com/blog/ai-for-nonprofits" />
    <meta property="og:image" content="https://www.peacemakersai.com/assets/peacemakers-ai-logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://www.peacemakersai.com/assets/peacemakers-ai-logo.png" />
    <link rel="canonical" href="https://www.peacemakersai.com/blog/ai-for-nonprofits" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header"><div class="container header-inner">
      <a class="site-logo" href="/index.html"><span class="site-brand"><img class="site-brand-mark" src="/assets/peacemakers-ai-logo.png" alt="Peacemakers AI logo" /><span class="site-brand-text">Peacemakers AI</span></span></a>
      <nav id="site-nav" class="site-nav" aria-label="Primary"><ul class="nav-list">
        <li><a href="/index.html">Home</a></li>
        <li><a href="/resources.html">Resources</a></li>
        <li><a href="/ai-for-nonprofits.html">Nonprofit Services</a></li>
      </ul></nav>
    </div></header>
    <main id="main">
      <section class="hero section"><div class="container hero-content narrow">
        <p class="eyebrow">Article Series</p>
        <h1>AI for Nonprofits</h1>
        <p class="hero-sub">Small nonprofits face growing pressure to raise funds, serve clients, and stay visible online—often with a tiny team and a tight budget. This series offers practical, mission-aligned guidance on where AI helps, where to start, and what it realistically costs.</p>
      </div></section>
      <section class="section"><div class="container narrow">
        <div class="cluster-card-list">
          <a class="cluster-card" href="/blog/ai-for-nonprofits/can-ai-help-small-nonprofit-do-more-with-less">
            <h3>Can AI Really Help My Small Nonprofit Do More With Less?</h3>
            <p>Learn whether AI is worth it, where it saves time, what risks to watch for, and how to use it without losing your mission or voice.</p>
          </a>
          <a class="cluster-card" href="/blog/ai-for-nonprofits/where-should-a-nonprofit-start-with-ai">
            <h3>Where Should a Nonprofit Start With AI Implementation?</h3>
            <p>A step-by-step path to choosing safe, high-impact AI pilots that fit your capacity and build staff confidence.</p>
          </a>
          <a class="cluster-card" href="/blog/ai-for-nonprofits/how-much-will-ai-tools-cost-my-nonprofit">
            <h3>How Much Will AI Tools Cost My Nonprofit?</h3>
            <p>A practical budget guide covering free tiers, nonprofit discounts, per-seat pricing traps, and realistic annual spend ranges.</p>
          </a>
        </div>
        <aside class="cta-block" style="margin-top: 2rem">
          <h3 class="cta-block-title">Ready for nonprofit AI strategy support?</h3>
          <p class="cta-block-description">Peacemakers helps small nonprofits map practical AI pilots, right-size tool spending, and train staff and boards on responsible AI use.</p>
          <a class="btn btn-primary" href="/services/ai-strategy-nonprofits">Explore nonprofit AI consulting</a>
        </aside>
      </div></section>
    </main>
    <footer class="site-footer"><div class="container"><p><a href="/resources.html">← All Resources</a></p></div></footer>
    <script src="/script.js" defer></script>
  </body>
</html>"""

with open(os.path.join(BASE, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)
print("Wrote index.html")
