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
]

# PUBLISHED_SLUGS is computed from batch-schedule.json at import time.


def article_url(slug):
    return f"{CLUSTER_BASE}/{slug}"
