#!/usr/bin/env python3
"""Append the AI Implementation Tool Stack series (briefs 301–324).

Starts Dec 24, 2026 (day after current queue ends) every other day through Feb 8, 2027.
"""
from __future__ import annotations

import json
from datetime import date, timedelta
from pathlib import Path

SB = Path(__file__).resolve().parent / "small-business-articles"
SCHEDULE = SB / "batch-schedule.json"
BRIEFS = SB / "briefs.py"
CATALOG = SB / "catalog.py"
SCRIPT_DIR = Path(__file__).resolve().parent

# Load shared templates from build-eod-article-queue.py
import importlib.util

_spec = importlib.util.spec_from_file_location(
    "build_eod", SCRIPT_DIR / "build-eod-article-queue.py"
)
_eod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_eod)
MODULE_HEADER = _eod.MODULE_HEADER
ARTICLE_TEMPLATE = _eod.ARTICLE_TEMPLATE

TOOLS = {
    301: {
        "slug": "ai-implementation-tool-stack-for-small-business",
        "title": "The AI Implementation Tool Stack We Use with Small Businesses",
        "primary_keyword": "AI implementation tool stack small business",
        "focus": "a practical AI implementation tool stack",
        "answer": "A practical AI implementation stack for small businesses usually combines a knowledge hub (Notion), voice capture (Wispr Flow), research (Perplexity), a reasoning assistant (Claude or ChatGPT), sales intelligence when needed (Apollo), and an automation layer (Zapier, Make, or n8n)—chosen for the workflow, not for collecting logos.",
        "context": "Peacemakers AI implementations start with the operating problem, then introduce only the tools that support discovery, documentation, draft work, and reliable handoffs. Directories like Futurepedia are useful for scanning options; the stack below is what we actually apply during client work.",
        "workflow": "Map the business bottleneck first. Use Notion as the shared source of truth, Wispr Flow to capture discovery notes quickly, Perplexity for sourced research, Claude/ChatGPT for structured drafts, Apollo when outbound or lead enrichment is in scope, and Zapier/Make/n8n to connect systems after the process is clear.",
        "guardrails": "Do not buy every trending tool. Limit sensitive data in consumer AI chats, keep pricing and customer commitments human-approved, and document which system owns each record.",
        "measure": "Track hours saved in discovery and documentation, time-to-first working automation, and whether staff can explain the stack without a consultant present.",
        "links": 'Start with <a href="/blog/ai-for-small-business/which-ai-tool-should-i-choose-for-my-small-business">how to choose an AI tool</a>, then dig into <a href="/blog/ai-for-small-business/notion-ai-for-small-business-operations">Notion</a> and <a href="/blog/ai-for-small-business/zapier-make-n8n-for-small-business-automation">automation platforms</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["implementation", "tool stack", "Notion", "Wispr Flow", "Apollo", "Perplexity"],
        "secondary_keywords": ["AI tools for implementation", "small business AI stack 2026", "Peacemakers AI tools"],
        "mid_cta": "Want a tool stack mapped to your workflow?",
        "end_cta_topic": "building an AI implementation tool stack",
    },
    302: {
        "slug": "notion-ai-for-small-business-operations",
        "title": "Notion AI for Small Business Operations: SOPs, Projects, and a Living Wiki",
        "primary_keyword": "Notion AI for small business operations",
        "focus": "Notion AI as an operations hub",
        "answer": "Notion AI works best for small businesses as the living wiki for SOPs, project trackers, and meeting decisions—so AI answers are grounded in your actual pages instead of generic advice.",
        "context": "During implementations we use Notion to hold discovery notes, process maps, pilot checklists, and approved templates. That keeps the client and consultant looking at the same source of truth.",
        "workflow": "Create a simple workspace: Company Wiki, Processes, Projects, and Meeting Notes. Use Notion AI to summarize pages, extract action items, and draft SOP sections from voice notes—then have the process owner verify accuracy before anything becomes policy.",
        "guardrails": "Do not store payroll files, bank credentials, or unrestricted customer PII in a loosely permissioned workspace. Review AI answers against the linked source page.",
        "measure": "Track time to find an SOP, onboarding questions that still require a manager, and how often outdated pages are corrected.",
        "links": 'Pair Notion with <a href="/blog/ai-for-small-business/wispr-flow-for-business-dictation-and-discovery">Wispr Flow capture</a> and <a href="/blog/ai-for-small-business/ai-for-writing-sops-and-training-guides">SOP writing guidance</a>. For stack context, see the <a href="/blog/ai-for-small-business/ai-implementation-tool-stack-for-small-business">implementation tool stack overview</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Notion", "Notion AI", "SOPs", "knowledge base"],
        "secondary_keywords": ["Notion for small business", "Notion AI wiki", "Notion SOP"],
        "mid_cta": "Need a Notion ops hub that sticks?",
        "end_cta_topic": "using Notion AI in your operations",
    },
    303: {
        "slug": "wispr-flow-for-business-dictation-and-discovery",
        "title": "Wispr Flow for Business: Faster Discovery Notes and Cleaner Drafts",
        "primary_keyword": "Wispr Flow for business dictation",
        "focus": "Wispr Flow for discovery and drafting",
        "answer": "Wispr Flow turns natural speech into cleaned, formatted text across apps, which makes discovery interviews, field notes, and first drafts dramatically faster for owners and consultants who think aloud faster than they type.",
        "context": "In implementations, the bottleneck is often capturing accurate process detail. Wispr Flow (with optional Notetaker on desktop) helps move spoken context into Notion, email, Claude, or ChatGPT without a messy transcript cleanup step.",
        "workflow": "During a walkthrough, dictate the trigger, systems, exceptions, and desired outcome into Notion or a prompt box. Add custom dictionary terms for product names. Review the cleaned text, then ask Claude/ChatGPT to structure it into a process map for human confirmation.",
        "guardrails": "Use privacy settings appropriate to the conversation. Do not dictate payment card numbers, passwords, or highly sensitive HR details into an unapproved session.",
        "measure": "Compare time to produce usable discovery notes before and after Wispr Flow, and count how many follow-up clarification emails decrease.",
        "links": 'Feed dictation into <a href="/blog/ai-for-small-business/notion-ai-for-small-business-operations">Notion</a> and <a href="/blog/ai-for-small-business/claude-vs-chatgpt-for-small-business-work">Claude or ChatGPT</a>. See also <a href="/blog/ai-for-small-business/ai-meeting-notes-for-small-business">AI meeting notes</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Wispr Flow", "dictation", "discovery", "voice AI"],
        "secondary_keywords": ["Wispr Flow AI", "voice to text business", "AI dictation small business"],
        "mid_cta": "Want faster discovery without more typing?",
        "end_cta_topic": "using Wispr Flow in business workflows",
    },
    304: {
        "slug": "apollo-io-for-small-business-lead-research",
        "title": "Apollo.io for Small Business Lead Research and Outreach Prep",
        "primary_keyword": "Apollo.io for small business lead research",
        "focus": "Apollo.io for lead research and outreach prep",
        "answer": "Apollo.io helps small B2B teams find and enrich contacts, prioritize accounts, and prepare outreach—useful in implementations when sales follow-up is part of the AI workflow, not when you only need internal ops automation.",
        "context": "We bring Apollo into an engagement when the client needs better prospect data, ICP targeting, or sequenced follow-up connected to CRM habits. It is a go-to-market tool, not a substitute for fixing fulfillment operations.",
        "workflow": "Define ICP filters, build a short verified list, enrich missing fields, draft personalized first touches with human review, and sync outcomes to the CRM. Use AI features for research summaries—not for unsupervised mass spam.",
        "guardrails": "Respect consent, CAN-SPAM/GDPR expectations, and bounce/deliverability limits. Do not treat every enriched email as permission to pitch aggressively.",
        "measure": "Track meetings booked, bounce rate, reply quality, and time spent building lists manually before Apollo.",
        "links": 'Connect outreach to <a href="/blog/ai-for-small-business/ai-for-b2b-sales-follow-up">B2B follow-up</a> and <a href="/blog/ai-for-small-business/ai-for-lead-qualification">lead qualification</a>. Stack overview: <a href="/blog/ai-for-small-business/ai-implementation-tool-stack-for-small-business">implementation tools</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Apollo", "Apollo.io", "lead research", "B2B sales"],
        "secondary_keywords": ["Apollo sales intelligence", "Apollo enrichment", "B2B prospecting AI"],
        "mid_cta": "Need cleaner lead research for your ICP?",
        "end_cta_topic": "using Apollo.io for lead research",
    },
    305: {
        "slug": "perplexity-ai-for-business-research",
        "title": "Perplexity AI for Business Research: Faster Answers with Sources",
        "primary_keyword": "Perplexity AI for business research",
        "focus": "Perplexity for sourced business research",
        "answer": "Perplexity is strongest when a small business needs quick, sourced answers—competitor pages, vendor comparisons, regulation primers, or market questions—before decisions move into Claude, Notion, or a live customer conversation.",
        "context": "In implementations we use Perplexity to gather candidates and citations, then verify anything material. It complements ChatGPT/Claude rather than replacing your internal data.",
        "workflow": "Ask a decision-shaped question, review cited links, save the useful excerpts into Notion with source URLs and dates, and only then draft recommendations for the client.",
        "guardrails": "Treat summaries as leads to verify. Do not paste confidential customer data into research prompts. Confirm pricing and legal claims on primary sources.",
        "measure": "Track research hours saved and how often recommendations needed correction after source checks.",
        "links": 'Use findings inside <a href="/blog/ai-for-small-business/ai-tools-for-market-research-and-competitor-analysis">market research workflows</a> and <a href="/blog/ai-for-small-business/how-to-prompt-ai-for-business-tasks">better prompts</a>. Discover options via <a href="/blog/ai-for-small-business/using-futurepedia-to-discover-ai-tools">Futurepedia discovery</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Perplexity", "research", "citations", "competitive intel"],
        "secondary_keywords": ["Perplexity for business", "AI research with sources", "Perplexity Pro small business"],
        "mid_cta": "Want research that cites its sources?",
        "end_cta_topic": "using Perplexity for business research",
    },
    306: {
        "slug": "claude-vs-chatgpt-for-small-business-work",
        "title": "Claude vs ChatGPT for Small Business Work: What We Use When",
        "primary_keyword": "Claude vs ChatGPT for small business",
        "focus": "Choosing Claude vs ChatGPT in real work",
        "answer": "Use Claude when long documents, careful writing, and multi-file reasoning matter; use ChatGPT when you want broad tooling, multimodal help, and a large ecosystem of GPTs and integrations. Many implementations keep both for different jobs.",
        "context": "Model choice is a workflow decision. During client work we match the assistant to the artifact: contracts and process docs often favor Claude; quick mixed-media tasks and familiar custom GPTs often favor ChatGPT.",
        "workflow": "Put approved context into a project/space, give a structured brief, generate a draft, then have a human verify facts, numbers, and tone before anything customer-facing leaves the building.",
        "guardrails": "Turn off training on business data where available. Do not put secrets into consumer chats. Keep a human accountable for advice that affects money, people, or compliance.",
        "measure": "Track edit burden by task type and which model staff prefer for recurring jobs after two weeks.",
        "links": 'See <a href="/blog/ai-for-small-business/chatgpt-for-small-business-owners">ChatGPT for owners</a> and <a href="/blog/ai-for-small-business/should-i-use-chatgpt-or-specialized-ai-tools">general vs specialized tools</a>. Capture context faster with <a href="/blog/ai-for-small-business/wispr-flow-for-business-dictation-and-discovery">Wispr Flow</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Claude", "ChatGPT", "LLM", "tool choice"],
        "secondary_keywords": ["Claude for business", "ChatGPT Business", "which AI assistant"],
        "mid_cta": "Not sure which assistant fits your work?",
        "end_cta_topic": "choosing between Claude and ChatGPT",
    },
    307: {
        "slug": "zapier-make-n8n-for-small-business-automation",
        "title": "Zapier vs Make vs n8n: Choosing Automation for Small Business AI",
        "primary_keyword": "Zapier vs Make vs n8n small business",
        "focus": "Choosing Zapier, Make, or n8n",
        "answer": "Choose Zapier for the fastest no-code connections across many apps, Make for visual multi-step scenarios with stronger data shaping, and n8n when you want more flexibility or self-hosting control—after the process is documented, not before.",
        "context": "Automation platforms are the glue in most Peacemakers implementations. The wrong move is automating a messy process; the right move is encoding a clarified workflow.",
        "workflow": "Document the trigger, fields, approvals, and failure path in Notion. Build a thin first automation. Log errors. Expand only when the first path is stable for two weeks.",
        "guardrails": "Limit API scopes, avoid writing financial or customer-critical changes without human approval steps, and keep a manual fallback.",
        "measure": "Track failed runs, hours of copy-paste removed, and time to restore service when an integration breaks.",
        "links": 'Prioritize tasks with <a href="/blog/ai-for-small-business/which-repetitive-tasks-to-automate-first">what to automate first</a> and <a href="/blog/ai-for-small-business/integration-of-ai-with-existing-business-software">integration guidance</a>. Stack hub: <a href="/blog/ai-for-small-business/ai-implementation-tool-stack-for-small-business">implementation tool stack</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Zapier", "Make", "n8n", "automation"],
        "secondary_keywords": ["Zapier for small business", "Make.com automation", "n8n workflow"],
        "mid_cta": "Need the right automation platform?",
        "end_cta_topic": "choosing Zapier, Make, or n8n",
    },
    308: {
        "slug": "using-futurepedia-to-discover-ai-tools",
        "title": "Using Futurepedia to Discover AI Tools Without Tool Chaos",
        "primary_keyword": "using Futurepedia to discover AI tools",
        "focus": "Futurepedia as a discovery method",
        "answer": "Futurepedia is useful as a directory to discover category options quickly—but a small business should still filter by workflow, data risk, integration fit, and a two-week pilot before buying.",
        "context": "Tool directories create optionality. Implementations fail when directories become shopping lists. We use Futurepedia-style discovery to shortlist, then apply a Peacemakers fit check.",
        "workflow": "Search by job-to-be-done, shortlist three tools, score them on integrations, security, learning curve, and cost, then pilot one with a written success metric.",
        "guardrails": "Ignore hype rankings that ignore your systems. Do not install browser extensions or OAuth apps without reviewing permissions.",
        "measure": "Success is a shortlist and a pilot decision—not a longer bookmark folder.",
        "links": 'Apply the filter in <a href="/blog/ai-for-small-business/which-ai-tool-should-i-choose-for-my-small-business">tool selection</a> and <a href="/blog/ai-for-small-business/questions-to-ask-when-choosing-ai-tool">vetting questions</a>. Then compare against our <a href="/blog/ai-for-small-business/ai-implementation-tool-stack-for-small-business">core stack</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Futurepedia", "tool discovery", "evaluation"],
        "secondary_keywords": ["Futurepedia AI directory", "find AI tools", "AI tool directory"],
        "mid_cta": "Want help shortlisting tools that fit?",
        "end_cta_topic": "using Futurepedia without tool sprawl",
    },
    309: {
        "slug": "calendly-and-scheduling-in-ai-implementations",
        "title": "Calendly and Smart Scheduling in AI Implementations",
        "primary_keyword": "Calendly AI scheduling small business",
        "focus": "Scheduling tools in AI implementations",
        "answer": "Scheduling tools like Calendly reduce back-and-forth and pair well with AI lead triage—when availability rules, buffers, and handoffs to humans are set deliberately.",
        "context": "Many service businesses lose deals in scheduling friction. Implementations often connect form → qualification → booking → CRM note.",
        "workflow": "Define meeting types, buffers, and prep questions. Connect booking events into Notion or CRM via Zapier/Make. Use AI only to draft confirmations and prep briefs.",
        "guardrails": "Do not overbook staff or hide cancellation policies. Keep emergency or high-stakes appointments on a human-reviewed calendar.",
        "measure": "Track time-to-book, no-show rate, and admin minutes spent coordinating times.",
        "links": 'Relate to <a href="/blog/ai-for-small-business/best-ai-tools-for-scheduling-and-calendar-management">AI scheduling tools</a> and <a href="/blog/ai-for-small-business/ai-for-appointment-reminders-and-no-shows">appointment reminders</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Calendly", "scheduling", "bookings"],
        "secondary_keywords": ["Calendly for small business", "AI appointment booking", "scheduling automation"],
        "mid_cta": "Want booking that feeds your CRM cleanly?",
        "end_cta_topic": "using Calendly in an AI implementation",
    },
    310: {
        "slug": "crm-ai-hubspot-and-lightweight-pipelines",
        "title": "CRM AI for Small Business: HubSpot and Lightweight Pipelines",
        "primary_keyword": "CRM AI HubSpot small business",
        "focus": "CRM AI and lightweight pipelines",
        "answer": "CRM AI helps when your pipeline stages are clear and data entry is consistent. HubSpot and similar CRMs can draft follow-ups and summarize records—but they cannot fix a pipeline nobody updates.",
        "context": "Implementations often stabilize CRM hygiene before turning on AI features. Clean stages beat clever predictions.",
        "workflow": "Simplify stages, required fields, and next-step ownership. Then enable AI assist for email drafts and meeting summaries with human send approval.",
        "guardrails": "Do not auto-advance deals or auto-send sequences without review. Audit enrichment sources for accuracy.",
        "measure": "Track stage hygiene, response time, and conversion between stages—not vanity AI feature usage.",
        "links": 'Combine with <a href="/blog/ai-for-small-business/apollo-io-for-small-business-lead-research">Apollo research</a> and <a href="/blog/ai-for-small-business/automate-customer-follow-ups-with-ai">follow-up automation</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["CRM", "HubSpot", "pipeline", "sales ops"],
        "secondary_keywords": ["HubSpot AI small business", "CRM automation", "pipeline AI"],
        "mid_cta": "Need a CRM workflow AI can actually help?",
        "end_cta_topic": "using CRM AI in a small business",
    },
    311: {
        "slug": "loom-and-async-video-for-ai-training",
        "title": "Loom and Async Video for AI Training Inside Small Businesses",
        "primary_keyword": "Loom async video AI training small business",
        "focus": "Async video for AI training",
        "answer": "Short Loom-style videos accelerate AI adoption by showing exact clicks and prompts, which beats long written manuals for busy staff—especially when clips are indexed in Notion beside the SOP.",
        "context": "Training fails when it is only a slide deck. Implementations stick when people can rewatch the workflow in under three minutes.",
        "workflow": "Record the happy path, the exception path, and the review checklist. Store links in Notion. Update the video when the process changes.",
        "guardrails": "Avoid recording customer PII or passwords on screen. Keep videos short and versioned.",
        "measure": "Track training completion, repeat how-to questions, and error rates after the video is published.",
        "links": 'Support with <a href="/blog/ai-for-small-business/train-my-team-to-use-ai-tools">team AI training</a> and <a href="/blog/ai-for-small-business/notion-ai-for-small-business-operations">Notion as the hub</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Loom", "training", "async video"],
        "secondary_keywords": ["Loom for SOPs", "async training video", "AI onboarding video"],
        "mid_cta": "Want training videos staff will actually watch?",
        "end_cta_topic": "using async video for AI training",
    },
    312: {
        "slug": "google-workspace-and-microsoft-365-ai-copilots",
        "title": "Google Workspace and Microsoft 365 Copilots in Small Business AI Rollouts",
        "primary_keyword": "Google Workspace Microsoft 365 Copilot small business",
        "focus": "Workspace copilots in email and docs",
        "answer": "If your business already lives in Google Workspace or Microsoft 365, enabling the native Copilot/Duets-style assistants is often the lowest-friction AI win—because the files and mail are already there.",
        "context": "We evaluate whether a separate AI chat is needed or whether workspace AI covers 70% of drafting and summarization with less tool sprawl.",
        "workflow": "Pilot on one team: email drafting, meeting recap, and doc summarization with a clear review rule. Expand after two weeks of clean results.",
        "guardrails": "Confirm admin settings, data residency expectations, and what is excluded from model improvement. Keep external sharing controlled.",
        "measure": "Track time on routine email/docs and incidents of incorrect customer-facing drafts.",
        "links": 'Compare with <a href="/blog/ai-for-small-business/claude-vs-chatgpt-for-small-business-work">Claude vs ChatGPT</a> and <a href="/blog/ai-for-small-business/ai-for-email-management-and-organization">email management AI</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Google Workspace", "Microsoft 365", "Copilot"],
        "secondary_keywords": ["Microsoft Copilot small business", "Gemini for Workspace", "office AI assistant"],
        "mid_cta": "Want AI inside the tools you already pay for?",
        "end_cta_topic": "rolling out workspace copilots",
    },
    313: {
        "slug": "stripe-and-payments-in-ai-assisted-workflows",
        "title": "Stripe and Payments in AI-Assisted Business Workflows",
        "primary_keyword": "Stripe AI assisted payment workflows",
        "focus": "Stripe in AI-assisted ops",
        "answer": "Stripe belongs in AI-assisted workflows as the system of record for charges, invoices, and payment links—while AI drafts descriptions and reminders, and humans remain in control of refunds, disputes, and pricing changes.",
        "context": "Peacemakers engagements that touch billing keep payment authority separate from generative tools. AI can prepare; Stripe executes under existing controls.",
        "workflow": "Connect booking or proposal acceptance to invoice creation carefully, use AI to draft line-item descriptions from approved packages, and require review before sending customer-facing payment requests.",
        "guardrails": "Never put card data into chat tools. Preserve dual control on refunds and bank detail changes.",
        "measure": "Track invoice cycle time, failed payments recovered, and billing disputes caused by unclear descriptions.",
        "links": 'See <a href="/blog/ai-for-small-business/ai-for-invoice-and-payment-processing">invoice AI guidance</a> and <a href="/blog/ai-for-small-business/integration-of-ai-with-existing-business-software">integration practices</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Stripe", "payments", "billing"],
        "secondary_keywords": ["Stripe automation", "AI invoicing Stripe", "payment workflow"],
        "mid_cta": "Need safer billing automation?",
        "end_cta_topic": "using Stripe alongside AI workflows",
    },
    314: {
        "slug": "fireflies-and-meeting-intelligence-tools",
        "title": "Fireflies and Meeting Intelligence Tools for Small Business Teams",
        "primary_keyword": "Fireflies meeting intelligence small business",
        "focus": "Meeting intelligence tools",
        "answer": "Meeting intelligence tools (Fireflies and similar, including Wispr Notetaker) capture discussions and extract action items so teams leave with owners and deadlines—provided someone confirms what was actually decided.",
        "context": "Implementations generate many working sessions. Capturing them prevents knowledge from vanishing into chat scrollback.",
        "workflow": "Record with consent, push summaries into Notion, assign tasks, and delete or restrict recordings per policy.",
        "guardrails": "Disclose recording. Exclude sensitive HR or legal strategy sessions from default tools when appropriate.",
        "measure": "Track unfinished action items and time spent rewriting notes from memory.",
        "links": 'Compare with <a href="/blog/ai-for-small-business/wispr-flow-for-business-dictation-and-discovery">Wispr Flow</a> and <a href="/blog/ai-for-small-business/ai-meeting-notes-for-small-business">meeting notes guidance</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Fireflies", "meeting intelligence", "transcription"],
        "secondary_keywords": ["AI meeting recorder", "Fireflies.ai", "meeting action items AI"],
        "mid_cta": "Want meetings that produce clear next steps?",
        "end_cta_topic": "using meeting intelligence tools",
    },
    315: {
        "slug": "cursor-and-custom-ai-builds-when-no-code-is-not-enough",
        "title": "Cursor and Custom AI Builds: When No-Code Is Not Enough",
        "primary_keyword": "Cursor AI custom builds small business",
        "focus": "Custom builds with Cursor when no-code stalls",
        "answer": "When no-code tools cannot express the workflow safely or economically, a focused custom build (often with AI-assisted development in Cursor) can be the right move—after proving the process and exhausting simpler options.",
        "context": "Most small businesses should not start with custom software. Implementations escalate to custom work only for durable, high-value workflows with clear ownership.",
        "workflow": "Write the acceptance criteria in Notion, prototype with Zapier/Make if possible, then scope a thin custom slice with observability and a rollback plan.",
        "guardrails": "Avoid rewriting your whole business in code. Prefer maintainable integrations over clever one-offs nobody can support.",
        "measure": "Track build cost vs hours saved and whether a non-original developer can maintain it.",
        "links": 'See <a href="/blog/ai-for-small-business/ai-developers-vs-no-code-platforms">developers vs no-code</a> and <a href="/blog/ai-for-small-business/zapier-make-n8n-for-small-business-automation">automation platform choice</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Cursor", "custom software", "no-code limits"],
        "secondary_keywords": ["Cursor AI IDE", "custom AI automation", "when to build custom"],
        "mid_cta": "Hit the limits of no-code?",
        "end_cta_topic": "deciding when to use custom AI builds",
    },
    316: {
        "slug": "slack-and-team-ai-assistants",
        "title": "Slack and Team AI Assistants Without Notification Chaos",
        "primary_keyword": "Slack AI assistants small business",
        "focus": "Slack and team AI assistants",
        "answer": "Slack AI features and connected assistants help teams summarize threads and find decisions—when channel purpose is clear and bots are not allowed to spam every message.",
        "context": "Implementations sometimes wire status updates into Slack. Noise kills adoption, so channel design comes first.",
        "workflow": "Create dedicated channels for pilots, post structured updates, and use AI summaries for long threads. Keep customer-sensitive topics in restricted spaces.",
        "guardrails": "Do not auto-post confidential customer content into broad channels. Review bot permissions.",
        "measure": "Track time to find a decision and reduction in “what did we decide?” messages.",
        "links": 'Tie to <a href="/blog/ai-for-small-business/notion-ai-for-small-business-operations">Notion as source of truth</a> and <a href="/blog/ai-for-small-business/building-an-ai-policy-for-employees">employee AI policy</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Slack", "team chat", "AI assistants"],
        "secondary_keywords": ["Slack AI", "team AI chatbot", "Slack automation"],
        "mid_cta": "Want Slack that helps instead of distracts?",
        "end_cta_topic": "using Slack AI assistants carefully",
    },
    317: {
        "slug": "airtable-and-structured-ops-data",
        "title": "Airtable for Structured Ops Data in AI Implementations",
        "primary_keyword": "Airtable AI operations small business",
        "focus": "Airtable as structured ops data",
        "answer": "Airtable is useful when a small business needs a lightweight database for inventory of workflows, vendors, content calendars, or implementation trackers that spreadsheets outgrow—but a CRM or accounting system should still own core customer and financial records.",
        "context": "We sometimes use Airtable as an implementation tracker or content ops base that AI can summarize and Zapier can update.",
        "workflow": "Model tables carefully, set owners and statuses, connect automations for notifications, and export or sync to systems of record on a schedule.",
        "guardrails": "Avoid duplicating CRM contacts as the long-term source of truth. Control who can edit schema.",
        "measure": "Track data cleanup time and whether the base remains accurate after 30 days.",
        "links": 'Compare with <a href="/blog/ai-for-small-business/notion-ai-for-small-business-operations">Notion</a> and <a href="/blog/ai-for-small-business/integration-of-ai-with-existing-business-software">integrations</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Airtable", "operations data", "databases"],
        "secondary_keywords": ["Airtable for small business", "Airtable automation", "ops database"],
        "mid_cta": "Need a lightweight ops database?",
        "end_cta_topic": "using Airtable in AI implementations",
    },
    318: {
        "slug": "figma-and-canva-ai-for-client-facing-assets",
        "title": "Figma and Canva AI for Client-Facing Assets in Small Businesses",
        "primary_keyword": "Canva AI Figma small business assets",
        "focus": "Design AI for client-facing assets",
        "answer": "Canva AI (and Figma for more design-heavy teams) can speed social graphics, one-pagers, and simple decks—when brand kits, claim rules, and human review prevent off-brand or inaccurate creatives.",
        "context": "Marketing assets often block launch of otherwise ready AI workflows. Templates plus AI drafting close that gap.",
        "workflow": "Lock brand kit, generate variants from approved copy, review claims, and store finals in Notion with version notes.",
        "guardrails": "Do not invent testimonials or results in generated graphics. Keep licensed fonts/images compliant.",
        "measure": "Track asset turnaround time and revision cycles vs starting from blank canvases.",
        "links": 'Pair with <a href="/blog/ai-for-small-business/ai-content-that-still-sounds-like-your-brand">on-brand content</a> and <a href="/blog/ai-for-small-business/automate-social-media-posts-with-ai">social automation</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["Canva", "Figma", "design AI", "brand"],
        "secondary_keywords": ["Canva Magic Studio", "AI graphics small business", "Figma AI"],
        "mid_cta": "Need faster on-brand creatives?",
        "end_cta_topic": "using Canva or Figma AI for assets",
    },
    319: {
        "slug": "security-checklist-for-your-ai-tool-stack",
        "title": "A Security Checklist for Your Small Business AI Tool Stack",
        "primary_keyword": "AI tool stack security checklist small business",
        "focus": "Security checklist across the AI stack",
        "answer": "Secure an AI stack by inventorying tools, minimizing data shared, enforcing SSO/2FA where possible, reviewing OAuth scopes, and defining what never enters a model—then revisiting the list quarterly.",
        "context": "Every implementation should leave the client with a one-page security checklist, not just new logins.",
        "workflow": "List tools and owners, classify data each tool can see, revoke unused integrations, and train staff on banned data categories.",
        "guardrails": "Prefer vendors with clear security pages (SOC 2/ISO where relevant). Separate personal and business AI accounts.",
        "measure": "Track open risky integrations, phishing/report incidents, and completion of policy acknowledgment.",
        "links": 'See <a href="/blog/ai-for-small-business/how-secure-is-ai-for-small-business-data">AI data security</a> and <a href="/blog/ai-for-small-business/building-an-ai-policy-for-employees">employee AI policy</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["security", "compliance", "tool stack"],
        "secondary_keywords": ["AI security checklist", "SaaS security small business", "OAuth review"],
        "mid_cta": "Want a stack security pass?",
        "end_cta_topic": "securing your AI tool stack",
    },
    320: {
        "slug": "measuring-roi-of-your-ai-tool-stack",
        "title": "How to Measure ROI of Your AI Tool Stack",
        "primary_keyword": "measure ROI AI tool stack small business",
        "focus": "Measuring ROI across the tool stack",
        "answer": "Measure AI stack ROI by combining subscription cost, setup time, hours saved on target workflows, quality/error rates, and revenue effects—reviewed monthly, not only at purchase time.",
        "context": "Stacks grow quietly. Implementations should leave a simple scorecard so owners can cut tools that do not earn their keep.",
        "workflow": "For each tool, define the job, baseline metric, monthly cost, and a keep/cut threshold. Revisit after 30 and 90 days.",
        "guardrails": "Do not count vanity usage metrics as ROI. Include training and cleanup time as real costs.",
        "measure": "Produce a monthly keep/cut list with owners and dollar or hour impact.",
        "links": 'Use <a href="/blog/ai-for-small-business/roi-of-ai-tools-for-small-businesses">AI ROI basics</a> and <a href="/blog/ai-for-small-business/how-much-does-ai-cost-for-small-business">cost ranges</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["ROI", "tooling cost", "scorecard"],
        "secondary_keywords": ["AI stack ROI", "software ROI small business", "cut unused AI tools"],
        "mid_cta": "Need a keep/cut scorecard for your tools?",
        "end_cta_topic": "measuring AI tool stack ROI",
    },
    321: {
        "slug": "starter-ai-stack-for-service-businesses",
        "title": "A Starter AI Stack for Service Businesses (Home, Pro, and Local Services)",
        "primary_keyword": "starter AI stack service businesses",
        "focus": "A starter stack for service businesses",
        "answer": "A strong starter stack for service businesses is usually: Notion for SOPs, Wispr Flow for notes, Claude/ChatGPT for drafts, Calendly for booking, a CRM or inbox rules for follow-up, and Zapier/Make for one or two high-value automations.",
        "context": "Service businesses win on response speed and clean handoffs. The starter stack targets those constraints before exotic tools.",
        "workflow": "Week 1: Notion + assistant. Week 2: booking + follow-up. Week 3: one automation. Week 4: measure and simplify.",
        "guardrails": "Skip Apollo-level prospecting tools until outbound is a real growth motion. Keep field pricing human-approved.",
        "measure": "Track lead response time, estimate turnaround, and admin hours recovered.",
        "links": 'See <a href="/blog/ai-for-small-business/ai-for-home-service-businesses">home service AI</a>, <a href="/blog/ai-for-small-business/ai-solutions-for-service-based-businesses">service-business AI</a>, and the <a href="/blog/ai-for-small-business/ai-implementation-tool-stack-for-small-business">full stack overview</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["service business", "starter stack", "operations"],
        "secondary_keywords": ["AI tools for service business", "home service AI stack", "local business AI tools"],
        "mid_cta": "Want a starter stack for your service business?",
        "end_cta_topic": "launching a service-business AI stack",
    },
    322: {
        "slug": "starter-ai-stack-for-b2b-and-professional-firms",
        "title": "A Starter AI Stack for B2B and Professional Services Firms",
        "primary_keyword": "starter AI stack B2B professional services",
        "focus": "A starter stack for B2B and professional firms",
        "answer": "B2B and professional firms usually start with Claude/ChatGPT for analysis, Perplexity for sourced research, Notion for knowledge, Apollo when pipeline development matters, and meeting intelligence for delivery notes—with stricter confidentiality rules than a typical local service shop.",
        "context": "These firms sell expertise and trust. The stack must protect client confidentiality while speeding research and delivery prep.",
        "workflow": "Create approved tool list, client-data rules, proposal templates, and a research → draft → partner review path before enabling outreach automation.",
        "guardrails": "Default to higher privacy tiers. Do not put privileged materials into consumer tools.",
        "measure": "Track proposal cycle time, research hours, and any confidentiality near-misses.",
        "links": 'See <a href="/blog/ai-for-small-business/ai-for-professional-services-firms">professional services AI</a>, <a href="/blog/ai-for-small-business/apollo-io-for-small-business-lead-research">Apollo</a>, and <a href="/blog/ai-for-small-business/perplexity-ai-for-business-research">Perplexity</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["B2B", "professional services", "starter stack"],
        "secondary_keywords": ["AI for consulting firms", "B2B AI stack", "professional firm AI tools"],
        "mid_cta": "Need a confidentiality-aware AI stack?",
        "end_cta_topic": "building a B2B professional AI stack",
    },
    323: {
        "slug": "how-peacemakers-runs-an-ai-implementation-week-by-week",
        "title": "How Peacemakers Runs an AI Implementation Week by Week (and Which Tools Show Up)",
        "primary_keyword": "Peacemakers AI implementation week by week",
        "focus": "Week-by-week implementation with named tools",
        "answer": "A typical Peacemakers AI implementation moves from discovery (Wispr Flow + Notion) to research and design (Perplexity + Claude/ChatGPT) to automation (Zapier/Make/n8n) to training (Loom + Notion) with measurement checkpoints each week.",
        "context": "Owners ask what actually happens after the kickoff call. This is the working pattern, adapted to each business.",
        "workflow": "Week 1 capture and baseline; Week 2 design and pilot; Week 3 automate and harden; Week 4 train, measure, and decide expand/pause. Tools appear only when that week’s job requires them.",
        "guardrails": "Do not skip baselines. Do not expand scope mid-pilot without resetting success metrics.",
        "measure": "End each week with written evidence: what changed, what broke, what the owner decided.",
        "links": 'Align with the <a href="/blog/ai-for-small-business/ai-implementation-roadmap-90-days">90-day roadmap</a> and <a href="/blog/ai-for-small-business/ai-implementation-tool-stack-for-small-business">tool stack overview</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["implementation", "Peacemakers", "playbook"],
        "secondary_keywords": ["AI implementation timeline", "AI consulting process", "weekly AI pilot"],
        "mid_cta": "Want this playbook applied to your business?",
        "end_cta_topic": "running a week-by-week AI implementation",
    },
    324: {
        "slug": "avoiding-ai-tool-sprawl-after-implementation",
        "title": "Avoiding AI Tool Sprawl After Implementation",
        "primary_keyword": "avoid AI tool sprawl small business",
        "focus": "Preventing AI tool sprawl after go-live",
        "answer": "Prevent tool sprawl by assigning every tool a job and an owner, setting a quarterly keep/cut review, and requiring a retired tool’s workflows to move cleanly into Notion documentation before something new is added.",
        "context": "The silent failure mode after a successful pilot is five overlapping subscriptions. Governance is part of implementation, not an afterthought.",
        "workflow": "Maintain a living stack inventory in Notion. Any new tool needs a replaced job, a pilot metric, and a sunset date if it fails.",
        "guardrails": "Block shadow IT AI installs on company data. Prefer extending an existing platform over adding a near-duplicate.",
        "measure": "Count active AI-related subscriptions monthly and dollars spent on unused seats.",
        "links": 'Use <a href="/blog/ai-for-small-business/measuring-roi-of-your-ai-tool-stack">stack ROI measurement</a> and <a href="/blog/ai-for-small-business/common-mistakes-small-businesses-make-with-ai">common AI mistakes</a>.',
        "category": "Implementation Tool Stack",
        "tags": ["tool sprawl", "governance", "subscriptions"],
        "secondary_keywords": ["too many AI tools", "SaaS sprawl AI", "consolidate AI stack"],
        "mid_cta": "Want a cleaner post-implementation stack?",
        "end_cta_topic": "avoiding AI tool sprawl",
    },
}


def eod_dates(start: date, count: int):
    out = []
    d = start
    while len(out) < count:
        out.append(d)
        d += timedelta(days=2)
    return out


def write_module(path: Path, num: int, items):
    parts = [MODULE_HEADER.format(num=num)]
    for brief_id, meta, publish_date in items:
        crumb = meta["title"].split(":")[0][:40]
        meta_desc = meta["answer"][:155].rsplit(" ", 1)[0] + "."
        parts.append(
            ARTICLE_TEMPLATE.format(
                slug=meta["slug"],
                title=meta["title"],
                meta=meta_desc,
                publish_date=publish_date,
                tags=meta["tags"],
                pk=meta["primary_keyword"],
                sk=meta["secondary_keywords"],
                crumb=crumb,
                mid=meta["mid_cta"],
                end=meta["end_cta_topic"],
                answer=meta["answer"],
                context=meta["context"],
                focus=meta["focus"],
                workflow=meta["workflow"],
                guardrails=meta["guardrails"],
                measure=meta["measure"],
                links=meta["links"],
            )
        )
    parts.append("}\n")
    path.write_text("".join(parts), encoding="utf-8")
    print(f"Wrote {path} ({len(items)} articles)")


def patch_briefs():
    text = BRIEFS.read_text(encoding="utf-8")
    if "301:" in text:
        print("briefs already have 301+")
        return
    insert = []
    for bid, meta in TOOLS.items():
        insert.append(
            f'    {bid}: {{"slug": "{meta["slug"]}", "title": {meta["title"]!r}, "primary_keyword": {meta["primary_keyword"]!r}}},'
        )
    block = "\n".join(insert) + "\n"
    # append before closing brace of BRIEFS
    marker = "\n}\n\n\ndef slugs_for_briefs"
    if marker not in text:
        raise SystemExit("briefs marker missing")
    text = text.replace(marker, "\n" + block + "}\n\n\ndef slugs_for_briefs", 1)
    BRIEFS.write_text(text, encoding="utf-8")
    print(f"Patched briefs with {len(TOOLS)} entries")


def patch_catalog():
    text = CATALOG.read_text(encoding="utf-8")
    if "ai-implementation-tool-stack-for-small-business" in text:
        print("catalog already has tool stack series")
        return
    articles = "\n".join(
        f'            {{"brief": {bid}, "slug": "{meta["slug"]}", "title": {meta["title"]!r}, "description": {(meta["answer"][:110] + "…")!r}}},'
        for bid, meta in TOOLS.items()
    )
    needle = "\n]\n\n# PUBLISHED_SLUGS is computed from article schedule at import time."
    if needle not in text:
        raise SystemExit("catalog end marker missing")
    # Insert new category before CATEGORIES closing bracket (avoid `},,`)
    insert = (
        "    {\n"
        '        "name": "AI Implementation Tool Stack",\n'
        "        \"briefs\": list(range(301, 325)),\n"
        "        \"articles\": [\n"
        + "\n".join(
            f'            {{"brief": {bid}, "slug": "{meta["slug"]}", "title": {meta["title"]!r}, "description": {(meta["answer"][:110] + "…")!r}}},'
            for bid, meta in TOOLS.items()
        )
        + "\n        ],\n    },\n]\n\n# PUBLISHED_SLUGS is computed from article schedule at import time."
    )
    text = text.replace(needle, ",\n" + insert, 1)
    text = text.replace("},,", "},")
    CATALOG.write_text(text, encoding="utf-8")
    compile(text, str(CATALOG), "exec")
    print("Patched catalog")


def main():
    schedule = json.loads(SCHEDULE.read_text(encoding="utf-8"))
    existing_slugs = {a["slug"] for a in schedule.get("articles", [])}
    start = date(2026, 12, 24)
    dates = eod_dates(start, len(TOOLS))
    new_articles = []
    b10, b11 = [], []
    for i, (brief, meta) in enumerate(TOOLS.items()):
        if meta["slug"] in existing_slugs:
            continue
        module = "batch10.py" if brief <= 312 else "batch11.py"
        row = {
            "brief": brief,
            "slug": meta["slug"],
            "module": module,
            "scheduled_date": dates[i].isoformat(),
            "status": "pending",
            "series": "ai-implementation-tool-stack",
        }
        new_articles.append(row)
        item = (brief, meta, dates[i].isoformat())
        if module == "batch10.py":
            b10.append(item)
        else:
            b11.append(item)

    schedule.setdefault("articles", []).extend(new_articles)
    schedule["series"] = schedule.get("series") or []
    if not any(s.get("id") == "ai-implementation-tool-stack" for s in schedule["series"]):
        schedule["series"].append(
            {
                "id": "ai-implementation-tool-stack",
                "name": "AI Implementation Tool Stack",
                "description": "Tools Peacemakers uses during implementations—Notion, Wispr Flow, Apollo, Perplexity, Claude/ChatGPT, Zapier/Make/n8n, and related stack choices—mapped to real business workflows.",
                "start_date": start.isoformat(),
                "end_date": dates[-1].isoformat(),
                "article_count": len(TOOLS),
            }
        )
    schedule["queue_end_date"] = dates[-1].isoformat()
    SCHEDULE.write_text(json.dumps(schedule, indent=2) + "\n", encoding="utf-8")
    print(f"Appended {len(new_articles)} articles ({start} → {dates[-1]})")

    write_module(SB / "batch10.py", 10, b10)
    write_module(SB / "batch11.py", 11, b11)
    patch_briefs()
    patch_catalog()

    # Update resources copy end date if present
    resources = Path(__file__).resolve().parents[1] / "resources.html"
    if resources.exists():
        t = resources.read_text(encoding="utf-8")
        t2 = t.replace("through Dec 2026.", "through early 2027.")
        if t2 != t:
            resources.write_text(t2, encoding="utf-8")
            print("Updated resources.html end date copy")


if __name__ == "__main__":
    main()
