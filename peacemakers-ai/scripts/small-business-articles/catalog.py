"""Catalog of all AI for Small Business cluster articles."""
import json
import os

CLUSTER_BASE = "/blog/ai-for-small-business"
_SCHEDULE_PATH = os.path.join(os.path.dirname(__file__), "batch-schedule.json")


def _load_published_slugs():
    if not os.path.exists(_SCHEDULE_PATH):
        return {
            "how-much-does-ai-cost-for-small-business",
            "how-do-i-know-if-ai-is-right-for-my-business",
            "which-ai-tool-should-i-choose-for-my-small-business",
            "roi-of-ai-tools-for-small-businesses",
            "implement-ai-without-disrupting-business",
        }
    import importlib.util

    briefs_path = os.path.join(os.path.dirname(__file__), "briefs.py")
    spec = importlib.util.spec_from_file_location("sb_briefs", briefs_path)
    briefs = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(briefs)

    with open(_SCHEDULE_PATH, encoding="utf-8") as f:
        schedule = json.load(f)

    slugs = set()
    for batch in schedule.get("batches", []):
        if batch.get("status") == "published":
            slugs.update(briefs.slugs_for_briefs(batch["briefs"]))
    for art in schedule.get("articles") or []:
        if art.get("status") == "published":
            slugs.add(art["slug"])
    return slugs


PUBLISHED_SLUGS = _load_published_slugs()

CATEGORIES = [
    {
        "name": "Getting Started & Fit",
        "briefs": [8, 13, 21, 37, 39],
        "articles": [
            {"brief": 8, "slug": "how-do-i-know-if-ai-is-right-for-my-business", "title": "How Do I Know If AI Is Right for My Business?", "description": "A simple self-assessment to tell if your business is ready for AI—or if you should fix basics first."},
            {"brief": 13, "slug": "get-started-with-ai-if-not-tech-savvy", "title": "How to Get Started with AI If I'm Not Tech-Savvy?", "description": "A jargon-free path for non-technical owners to adopt AI one step at a time."},
            {"brief": 21, "slug": "implement-ai-without-disrupting-business", "title": "How to Implement AI Without Disrupting My Business?", "description": "Phased rollout tactics that keep daily operations running while you test AI."},
            {"brief": 37, "slug": "is-ai-implementation-complicated", "title": "Is AI Implementation Complicated for Small Businesses?", "description": "Where AI is simpler than you think—and where complexity actually shows up."},
            {"brief": 39, "slug": "get-ai-support-when-something-goes-wrong", "title": "How to Get AI Support When Something Goes Wrong?", "description": "Vendor support, backup plans, and when to call in outside help."},
        ],
    },
    {
        "name": "Cost & ROI",
        "briefs": [1, 6, 19, 25, 29, 30],
        "articles": [
            {"brief": 1, "slug": "how-much-does-ai-cost-for-small-business", "title": "How Much Does AI Cost for a Small Business?", "description": "Realistic monthly ranges, hidden costs, and how to avoid paying for seats nobody uses."},
            {"brief": 6, "slug": "ai-chatbot-cost-for-small-businesses", "title": "What Does an AI Chatbot Cost for Small Businesses?", "description": "Pricing tiers, what drives cost, and how to frame chatbot ROI."},
            {"brief": 19, "slug": "how-much-time-will-ai-save-my-small-business", "title": "How Much Time Will AI Save My Small Business?", "description": "Time-savings estimates by task type and how to measure before and after."},
            {"brief": 25, "slug": "roi-of-ai-tools-for-small-businesses", "title": "What's the ROI of AI Tools for Small Businesses?", "description": "How to calculate ROI from time saved, revenue lift, and error reduction."},
            {"brief": 29, "slug": "how-long-to-see-results-from-ai-implementation", "title": "How Long Does It Take to See Results from AI Implementation?", "description": "Quick wins vs deeper gains and what speeds or slows your timeline."},
            {"brief": 30, "slug": "are-free-ai-tools-good-enough", "title": "Are Free AI Tools Good Enough for My Small Business?", "description": "When free tiers are enough—and when upgrading pays for itself."},
        ],
    },
    {
        "name": "Choosing Tools",
        "briefs": [4, 20, 27, 32, 35],
        "articles": [
            {"brief": 4, "slug": "which-ai-tool-should-i-choose-for-my-small-business", "title": "Which AI Tool Should I Choose for My Small Business?", "description": "A use-case-first framework to pick one tool without tool-hopping."},
            {"brief": 20, "slug": "easiest-ai-tools-for-beginners", "title": "What Are the Easiest AI Tools to Use for Beginners?", "description": "Beginner-friendly categories and common first mistakes to avoid."},
            {"brief": 27, "slug": "ai-developers-vs-no-code-platforms", "title": "How to Choose Between AI Developers and No-Code Platforms?", "description": "Cost, customization, and maintenance tradeoffs for small teams."},
            {"brief": 32, "slug": "questions-to-ask-when-choosing-ai-tool", "title": "What Questions Should I Ask When Choosing an AI Tool?", "description": "A vetting checklist and red flags before you sign up."},
            {"brief": 35, "slug": "common-mistakes-small-businesses-make-with-ai", "title": "What Are the Common Mistakes Small Businesses Make with AI?", "description": "Tool overload, skipped training, and other pitfalls—and how to avoid them."},
        ],
    },
    {
        "name": "Automating Operations",
        "briefs": [5, 12, 17, 18, 22, 36],
        "articles": [
            {"brief": 5, "slug": "automate-customer-follow-ups-with-ai", "title": "How to Automate Customer Follow-ups with AI?", "description": "Trigger-based email and SMS follow-ups that still sound personal."},
            {"brief": 12, "slug": "best-ai-tools-for-scheduling-and-calendar-management", "title": "Best AI Tools for Scheduling and Calendar Management", "description": "Appointment booking, meeting scheduling, and staff calendars compared."},
            {"brief": 17, "slug": "use-ai-to-screen-job-applications", "title": "How to Use AI to Screen Job Applications?", "description": "Efficient screening with fairness guardrails and human review."},
            {"brief": 18, "slug": "ai-for-email-management-and-organization", "title": "Can AI Help with Email Management and Organization?", "description": "Inbox triage, drafting, and faster response without losing control."},
            {"brief": 22, "slug": "which-repetitive-tasks-to-automate-first", "title": "Which Repetitive Tasks Should I Automate with AI First?", "description": "A prioritization framework for your highest-value quick wins."},
            {"brief": 36, "slug": "automate-social-media-posts-with-ai", "title": "How to Automate Social Media Posts with AI?", "description": "Content generation and scheduling while keeping your brand voice."},
        ],
    },
    {
        "name": "Sales, Marketing & Customer Experience",
        "briefs": [2, 7, 10, 14, 23, 28],
        "articles": [
            {"brief": 2, "slug": "ai-tools-that-save-small-business-owners-time", "title": "What AI Tools Actually Save Small Business Owners Time?", "description": "Time-saving tools by function—not hype—plus how to measure impact."},
            {"brief": 7, "slug": "can-ai-help-with-sales-and-customer-service", "title": "Can AI Help Me with Sales and Customer Service?", "description": "Lead qualification, follow-up, 24/7 support, and when humans take over."},
            {"brief": 10, "slug": "use-ai-to-analyze-customer-buying-patterns", "title": "How to Use AI to Analyze Customer Buying Patterns?", "description": "Turn POS, CRM, and email data into practical sales actions."},
            {"brief": 14, "slug": "ai-personalized-offers-for-customers", "title": "Can AI Help Me Create Personalized Offers for Customers?", "description": "Segmentation, offer copy, timing, and retention campaigns."},
            {"brief": 23, "slug": "how-ai-improves-customer-support", "title": "How Does AI Improve Customer Support for Small Businesses?", "description": "Faster responses, ticket triage, and escalation paths that protect trust."},
            {"brief": 28, "slug": "ai-solutions-for-service-based-businesses", "title": "What AI Solutions Work for Service-Based Businesses?", "description": "Scheduling, client communication, proposals, and reputation workflows."},
        ],
    },
    {
        "name": "People & Workforce",
        "briefs": [11, 24, 26],
        "articles": [
            {"brief": 11, "slug": "will-ai-replace-my-employees", "title": "Will AI Replace My Employees?", "description": "Augmentation vs replacement—and how to communicate change to your team."},
            {"brief": 24, "slug": "should-i-hire-someone-to-set-up-ai", "title": "Should I Hire Someone to Set Up AI for My Business?", "description": "DIY vs contractor vs consultant—and when expertise pays off."},
            {"brief": 26, "slug": "train-my-team-to-use-ai-tools", "title": "Can I Train My Team to Use AI Tools?", "description": "Lunch-and-learns, prompt libraries, champions, and overcoming resistance."},
        ],
    },
    {
        "name": "Strategy & Growth",
        "briefs": [3, 9, 15, 16, 31, 33, 34, 38],
        "articles": [
            {"brief": 3, "slug": "use-ai-without-hiring-a-developer", "title": "Can I Use AI Without Hiring a Developer?", "description": "No-code AI for chatbots, automations, and content—and when you need a dev."},
            {"brief": 9, "slug": "10-20-70-rule-for-ai-implementation", "title": "What Is the 10-20-70 Rule for AI Implementation?", "description": "Why people and process matter more than the algorithm—and how to apply it."},
            {"brief": 15, "slug": "how-secure-is-ai-for-small-business-data", "title": "How Secure Is AI for My Small Business Data?", "description": "Real risks, vendor vetting, and policies for what not to upload."},
            {"brief": 16, "slug": "ai-tools-small-vs-large-business-differences", "title": "What's the Difference Between AI Tools for Small vs. Large Businesses?", "description": "What small businesses should prioritize vs enterprise complexity."},
            {"brief": 31, "slug": "use-ai-for-better-business-analytics", "title": "How to Use AI for Better Business Analytics?", "description": "Dashboards, natural-language queries, and forecasting without overwhelm."},
            {"brief": 33, "slug": "can-ai-help-small-businesses-compete-with-larger-companies", "title": "Can AI Help Small Businesses Compete with Larger Companies?", "description": "How automation and personalization level the playing field."},
            {"brief": 34, "slug": "how-to-measure-success-with-ai-implementation", "title": "How to Measure Success with AI Implementation?", "description": "KPIs, review cadence, and adjusting based on what you learn."},
            {"brief": 38, "slug": "what-ai-tools-do-successful-small-businesses-use", "title": "What AI Tools Do Successful Small Businesses Actually Use?", "description": "Patterns across support, marketing, scheduling, and analytics stacks."},
        ],
    },
    {
        "name": "Bonus Topics",
        "briefs": list(range(101, 111)),
        "articles": [
            {"brief": 101, "slug": "ai-for-inventory-management-and-forecasting", "title": "AI for Inventory Management and Forecasting", "description": "Demand forecasting and stockout prevention for retail and e-commerce."},
            {"brief": 102, "slug": "ai-for-invoice-and-payment-processing", "title": "Using AI for Invoice and Payment Processing", "description": "Automated invoicing, reminders, and error detection."},
            {"brief": 103, "slug": "ai-powered-business-proposal-generation", "title": "AI-Powered Business Proposal Generation", "description": "Faster proposals without sounding generic."},
            {"brief": 104, "slug": "how-ai-improves-employee-productivity", "title": "How AI Improves Employee Productivity", "description": "Less admin, faster drafting, and better meeting follow-through."},
            {"brief": 105, "slug": "ai-tools-for-market-research-and-competitor-analysis", "title": "AI Tools for Market Research and Competitor Analysis", "description": "Track competitors and summarize customer sentiment faster."},
            {"brief": 106, "slug": "compliance-and-legal-considerations-for-ai-in-small-business", "title": "Compliance and Legal Considerations for AI in Small Business", "description": "Privacy, disclosure, and industry-specific basics."},
            {"brief": 107, "slug": "ai-for-personalized-marketing-campaigns", "title": "AI for Personalized Marketing Campaigns", "description": "Segmentation, dynamic content, and testing at scale."},
            {"brief": 108, "slug": "scaling-ai-solutions-as-your-business-grows", "title": "Scaling AI Solutions as Your Business Grows", "description": "When to upgrade tools and how to avoid vendor lock-in."},
            {"brief": 109, "slug": "integration-of-ai-with-existing-business-software", "title": "Integration of AI with Existing Business Software", "description": "Native integrations, middleware, and compatibility checks."},
            {"brief": 110, "slug": "industry-specific-ai-solutions-retail-services-ecommerce", "title": "Industry-Specific AI Solutions (Retail, Services, E-commerce)", "description": "Tailored use cases across three common small business models."},
        ],
    },

    {
        "name": "Every-Other-Day Continuity (Fall 2026)",
        "briefs": list(range(201, 237)),
        "articles": [
            {"brief": 201, "slug": "chatgpt-for-small-business-owners", "title": 'ChatGPT for Small Business Owners: Practical Uses That Save Time', "description": 'ChatGPT can help small business owners draft messages, summarize notes, organize checklists, and prepare first…'},
            {"brief": 202, "slug": "ai-for-google-business-reviews", "title": 'How to Use AI for Google Business Reviews Without Sounding Fake', "description": 'AI can help a small business monitor Google Business reviews, draft courteous replies, and flag urgent complai…'},
            {"brief": 203, "slug": "ai-phone-answering-for-small-business", "title": 'AI Phone Answering for Small Businesses: When It Helps and When It Hurts', "description": 'AI phone answering can capture after-hours inquiries, answer common questions, and route urgent calls—but it h…'},
            {"brief": 204, "slug": "ai-for-appointment-reminders-and-no-shows", "title": 'Using AI for Appointment Reminders and Reducing No-Shows', "description": 'AI-assisted appointment reminders can cut no-shows by sending timely confirmations, reschedule options, and fo…'},
            {"brief": 205, "slug": "ai-for-local-seo-small-business", "title": 'AI for Local SEO: Practical Ways Small Businesses Can Rank Nearby', "description": 'AI can help small businesses improve local SEO by drafting location pages, organizing FAQ content, summarizing…'},
            {"brief": 206, "slug": "ai-meeting-notes-for-small-business", "title": 'AI Meeting Notes for Small Business Teams That Actually Follow Through', "description": 'AI meeting notes can turn conversations into searchable summaries and action lists, helping small teams follow…'},
            {"brief": 207, "slug": "ai-for-writing-sops-and-training-guides", "title": 'How to Use AI to Write SOPs and Training Guides Faster', "description": 'AI can turn voice notes, checklists, and observed steps into clear SOP drafts and training guides, cutting doc…'},
            {"brief": 208, "slug": "ai-vs-virtual-assistant-for-small-business", "title": 'AI vs a Virtual Assistant: What Should a Small Business Use First?', "description": 'Use AI first for repeatable drafting and triage work with clear rules; hire or keep a virtual assistant when t…'},
            {"brief": 209, "slug": "ai-for-lead-qualification", "title": 'AI for Lead Qualification: Score Inquiries Without Losing Good Customers', "description": 'AI can help qualify leads by organizing inquiry details, flagging fit criteria, and prioritizing follow-up—whi…'},
            {"brief": 210, "slug": "ai-for-quote-and-estimate-generation", "title": 'AI for Quotes and Estimates: Faster Drafts with Human Pricing Control', "description": 'AI can assemble quote and estimate drafts from approved packages and discovery notes, speeding turnaround—whil…'},
            {"brief": 211, "slug": "ai-for-home-service-businesses", "title": 'AI for Home Service Businesses: Scheduling, Follow-Up, and Field Notes', "description": 'Home service businesses get the most from AI when they use it for lead response, scheduling support, job-note …'},
            {"brief": 212, "slug": "ai-for-restaurants-and-hospitality", "title": 'AI for Restaurants and Hospitality: Reservations, Reviews, and Staff Support', "description": 'Restaurants and hospitality businesses can use AI to manage reservation questions, review replies, menu copy d…'},
            {"brief": 213, "slug": "ai-for-contractors-and-trades", "title": 'AI for Contractors and Trades: Estimates, Change Orders, and Client Updates', "description": 'Contractors and trades can use AI to draft estimates, organize change-order notes, and send clearer client upd…'},
            {"brief": 214, "slug": "ai-for-professional-services-firms", "title": 'AI for Professional Services Firms: Research, Drafting, and Client Prep', "description": 'Professional services firms can use AI to speed research summaries, first drafts, and meeting prep—while profe…'},
            {"brief": 215, "slug": "ai-for-cash-flow-forecasting", "title": 'AI for Cash Flow Forecasting in Small Businesses', "description": 'AI can help small businesses forecast cash flow by organizing invoices, bills, and seasonality into clearer sh…'},
            {"brief": 216, "slug": "ai-for-expense-categorization", "title": 'Using AI for Expense Categorization Without Losing Financial Control', "description": 'AI can speed expense categorization by suggesting categories from merchants and memos, reducing bookkeeping bu…'},
            {"brief": 217, "slug": "ai-for-vendor-and-supplier-management", "title": 'AI for Vendor and Supplier Management in Growing Small Businesses', "description": 'AI can help small businesses organize supplier information, flag late shipments, and prepare renewal questions…'},
            {"brief": 218, "slug": "should-i-use-chatgpt-or-specialized-ai-tools", "title": 'Should I Use ChatGPT or Specialized AI Tools for My Business?', "description": 'Use ChatGPT (or similar general assistants) for flexible drafting and analysis across many tasks; choose speci…'},
            {"brief": 219, "slug": "ai-for-customer-onboarding", "title": 'AI for Customer Onboarding: Clearer Kickoffs Without Extra Admin', "description": 'AI can improve customer onboarding by turning kickoff notes into checklists, welcome sequences, and missing-in…'},
            {"brief": 220, "slug": "ai-for-knowledge-base-and-faqs", "title": 'Build an AI-Ready Knowledge Base and FAQ for Your Small Business', "description": 'An AI-ready knowledge base turns your approved answers into searchable FAQs and assistant responses, reducing …'},
            {"brief": 221, "slug": "how-to-prompt-ai-for-business-tasks", "title": 'How to Prompt AI for Business Tasks (Without Getting Generic Output)', "description": 'Good business prompts specify role, audience, goal, constraints, source facts, and output format. That structu…'},
            {"brief": 222, "slug": "ai-for-reputation-management", "title": 'AI for Reputation Management: Monitor, Respond, and Improve', "description": 'AI can help small businesses monitor mentions and reviews, group complaint themes, and draft responses—while s…'},
            {"brief": 223, "slug": "ai-content-that-still-sounds-like-your-brand", "title": 'How to Create AI Content That Still Sounds Like Your Brand', "description": 'AI content sounds like your brand when you feed it a voice guide, approved examples, and hard facts—then edit …'},
            {"brief": 224, "slug": "ai-for-hiring-job-descriptions", "title": 'Using AI to Write Better Job Descriptions for Small Business Hiring', "description": 'AI can help small businesses draft clearer job descriptions from real day-to-day responsibilities, improving a…'},
            {"brief": 225, "slug": "ai-for-employee-onboarding", "title": 'AI for Employee Onboarding: Faster Ramp Without Cutting Corners', "description": 'AI can speed employee onboarding by turning SOPs into training outlines, checklists, and quiz drafts—while man…'},
            {"brief": 226, "slug": "when-not-to-use-ai-in-your-business", "title": 'When Not to Use AI in Your Business', "description": 'Skip AI when the process is unclear, stakes are high and irreversible, data is poor, or a human relationship i…'},
            {"brief": 227, "slug": "ai-for-multi-location-small-businesses", "title": 'AI for Multi-Location Small Businesses: Consistency Without Central Chaos', "description": 'Multi-location businesses can use AI to keep messaging, SOPs, and reporting consistent across sites—while loca…'},
            {"brief": 228, "slug": "ai-for-b2b-sales-follow-up", "title": 'AI for B2B Sales Follow-Up That Stays Personal', "description": 'AI can keep B2B follow-up consistent by drafting sequenced messages from CRM notes and deal stage—while salesp…'},
            {"brief": 229, "slug": "measuring-ai-adoption-across-your-team", "title": 'How to Measure AI Adoption Across Your Small Business Team', "description": 'Measure AI adoption by tracking which workflows are used, time saved, quality outcomes, and staff confidence—n…'},
            {"brief": 230, "slug": "ai-for-document-organization-and-search", "title": 'AI for Document Organization and Search in Small Businesses', "description": 'AI can help small businesses organize and search documents by summarizing files, suggesting folders/tags, and …'},
            {"brief": 231, "slug": "ai-for-seasonal-demand-planning", "title": 'AI for Seasonal Demand Planning in Small Businesses', "description": 'AI can support seasonal demand planning by highlighting patterns in sales history and helping owners prepare s…'},
            {"brief": 232, "slug": "ai-tools-for-solo-entrepreneurs", "title": 'Best-First AI Tools for Solo Entrepreneurs', "description": 'Solo entrepreneurs should start with one general assistant plus one workflow tool that removes their biggest w…'},
            {"brief": 233, "slug": "building-an-ai-policy-for-employees", "title": 'How to Build a Simple AI Policy for Employees', "description": 'A simple AI policy tells employees which tools are approved, what data is off-limits, what must be reviewed by…'},
            {"brief": 234, "slug": "ai-for-customer-winback-campaigns", "title": 'AI for Customer Win-Back Campaigns That Feel Personal', "description": 'AI can help win back lapsed customers by segmenting inactivity reasons and drafting relevant offers from appro…'},
            {"brief": 235, "slug": "ai-for-year-end-business-review", "title": 'Using AI for a Year-End Business Review That Drives Next Year’s Plan', "description": 'AI can help owners run a year-end business review by summarizing performance data, grouping themes from notes,…'},
            {"brief": 236, "slug": "ai-implementation-roadmap-90-days", "title": 'A 90-Day AI Implementation Roadmap for Small Businesses', "description": 'A 90-day AI roadmap focuses on one workflow in days 1–30, measurement and refinement in days 31–60, and a care…'},
        ],
    },
    {
        "name": "AI Implementation Tool Stack",
        "briefs": list(range(301, 325)),
        "articles": [
            {"brief": 301, "slug": "ai-implementation-tool-stack-for-small-business", "title": 'The AI Implementation Tool Stack We Use with Small Businesses', "description": 'A practical AI implementation stack for small businesses usually combines a knowledge hub (Notion), voice capt…'},
            {"brief": 302, "slug": "notion-ai-for-small-business-operations", "title": 'Notion AI for Small Business Operations: SOPs, Projects, and a Living Wiki', "description": 'Notion AI works best for small businesses as the living wiki for SOPs, project trackers, and meeting decisions…'},
            {"brief": 303, "slug": "wispr-flow-for-business-dictation-and-discovery", "title": 'Wispr Flow for Business: Faster Discovery Notes and Cleaner Drafts', "description": 'Wispr Flow turns natural speech into cleaned, formatted text across apps, which makes discovery interviews, fi…'},
            {"brief": 304, "slug": "apollo-io-for-small-business-lead-research", "title": 'Apollo.io for Small Business Lead Research and Outreach Prep', "description": 'Apollo.io helps small B2B teams find and enrich contacts, prioritize accounts, and prepare outreach—useful in …'},
            {"brief": 305, "slug": "perplexity-ai-for-business-research", "title": 'Perplexity AI for Business Research: Faster Answers with Sources', "description": 'Perplexity is strongest when a small business needs quick, sourced answers—competitor pages, vendor comparison…'},
            {"brief": 306, "slug": "claude-vs-chatgpt-for-small-business-work", "title": 'Claude vs ChatGPT for Small Business Work: What We Use When', "description": 'Use Claude when long documents, careful writing, and multi-file reasoning matter; use ChatGPT when you want br…'},
            {"brief": 307, "slug": "zapier-make-n8n-for-small-business-automation", "title": 'Zapier vs Make vs n8n: Choosing Automation for Small Business AI', "description": 'Choose Zapier for the fastest no-code connections across many apps, Make for visual multi-step scenarios with …'},
            {"brief": 308, "slug": "using-futurepedia-to-discover-ai-tools", "title": 'Using Futurepedia to Discover AI Tools Without Tool Chaos', "description": 'Futurepedia is useful as a directory to discover category options quickly—but a small business should still fi…'},
            {"brief": 309, "slug": "calendly-and-scheduling-in-ai-implementations", "title": 'Calendly and Smart Scheduling in AI Implementations', "description": 'Scheduling tools like Calendly reduce back-and-forth and pair well with AI lead triage—when availability rules…'},
            {"brief": 310, "slug": "crm-ai-hubspot-and-lightweight-pipelines", "title": 'CRM AI for Small Business: HubSpot and Lightweight Pipelines', "description": 'CRM AI helps when your pipeline stages are clear and data entry is consistent. HubSpot and similar CRMs can dr…'},
            {"brief": 311, "slug": "loom-and-async-video-for-ai-training", "title": 'Loom and Async Video for AI Training Inside Small Businesses', "description": 'Short Loom-style videos accelerate AI adoption by showing exact clicks and prompts, which beats long written m…'},
            {"brief": 312, "slug": "google-workspace-and-microsoft-365-ai-copilots", "title": 'Google Workspace and Microsoft 365 Copilots in Small Business AI Rollouts', "description": 'If your business already lives in Google Workspace or Microsoft 365, enabling the native Copilot/Duets-style a…'},
            {"brief": 313, "slug": "stripe-and-payments-in-ai-assisted-workflows", "title": 'Stripe and Payments in AI-Assisted Business Workflows', "description": 'Stripe belongs in AI-assisted workflows as the system of record for charges, invoices, and payment links—while…'},
            {"brief": 314, "slug": "fireflies-and-meeting-intelligence-tools", "title": 'Fireflies and Meeting Intelligence Tools for Small Business Teams', "description": 'Meeting intelligence tools (Fireflies and similar, including Wispr Notetaker) capture discussions and extract …'},
            {"brief": 315, "slug": "cursor-and-custom-ai-builds-when-no-code-is-not-enough", "title": 'Cursor and Custom AI Builds: When No-Code Is Not Enough', "description": 'When no-code tools cannot express the workflow safely or economically, a focused custom build (often with AI-a…'},
            {"brief": 316, "slug": "slack-and-team-ai-assistants", "title": 'Slack and Team AI Assistants Without Notification Chaos', "description": 'Slack AI features and connected assistants help teams summarize threads and find decisions—when channel purpos…'},
            {"brief": 317, "slug": "airtable-and-structured-ops-data", "title": 'Airtable for Structured Ops Data in AI Implementations', "description": 'Airtable is useful when a small business needs a lightweight database for inventory of workflows, vendors, con…'},
            {"brief": 318, "slug": "figma-and-canva-ai-for-client-facing-assets", "title": 'Figma and Canva AI for Client-Facing Assets in Small Businesses', "description": 'Canva AI (and Figma for more design-heavy teams) can speed social graphics, one-pagers, and simple decks—when …'},
            {"brief": 319, "slug": "security-checklist-for-your-ai-tool-stack", "title": 'A Security Checklist for Your Small Business AI Tool Stack', "description": 'Secure an AI stack by inventorying tools, minimizing data shared, enforcing SSO/2FA where possible, reviewing …'},
            {"brief": 320, "slug": "measuring-roi-of-your-ai-tool-stack", "title": 'How to Measure ROI of Your AI Tool Stack', "description": 'Measure AI stack ROI by combining subscription cost, setup time, hours saved on target workflows, quality/erro…'},
            {"brief": 321, "slug": "starter-ai-stack-for-service-businesses", "title": 'A Starter AI Stack for Service Businesses (Home, Pro, and Local Services)', "description": 'A strong starter stack for service businesses is usually: Notion for SOPs, Wispr Flow for notes, Claude/ChatGP…'},
            {"brief": 322, "slug": "starter-ai-stack-for-b2b-and-professional-firms", "title": 'A Starter AI Stack for B2B and Professional Services Firms', "description": 'B2B and professional firms usually start with Claude/ChatGPT for analysis, Perplexity for sourced research, No…'},
            {"brief": 323, "slug": "how-peacemakers-runs-an-ai-implementation-week-by-week", "title": 'How Peacemakers Runs an AI Implementation Week by Week (and Which Tools Show Up)', "description": 'A typical Peacemakers AI implementation moves from discovery (Wispr Flow + Notion) to research and design (Per…'},
            {"brief": 324, "slug": "avoiding-ai-tool-sprawl-after-implementation", "title": 'Avoiding AI Tool Sprawl After Implementation', "description": 'Prevent tool sprawl by assigning every tool a job and an owner, setting a quarterly keep/cut review, and requi…'},
        ],
    },
]

# PUBLISHED_SLUGS is computed from article schedule at import time.


def article_url(slug):
    return f"{CLUSTER_BASE}/{slug}"
