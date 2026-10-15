---
name: owner-practice-loop
version: 0.1.0
compatible_os: pm-os-0.1.0
description: Apply and improve James's twelve owner practices from the startup_rules YouTube carousel. Use when he asks to study or use sales conversations, clear speaking, systems thinking, storytelling, negotiation, productivity, study, n8n automation, Claude, personal money, focus, or the Naval life notes, or when he asks for the practice loop that scores and revises those habits. Keep every practice inside the Peacemakers Operating System.
---

# Owner practice loop

**Skill version:** `0.1.0`  
**Compatible Peacemakers OS:** `pm-os-0.1.0`

This skill turns the carousel "12 YouTube courses that are better than an MBA" into practices James can run, score, and tighten. The course he studies is:

`owner-ops/docs/learning/twelve-youtube-courses.md`

The cards the loop scores are:

`references/practices.json`

The loop itself is:

`references/loop.md`

## Operating rule

Understand the task before applying a practice. The operating system outranks the video. A practice that would contact a client, send a proposal, change production, move money, or invent a result stops at a note for James.

Canonical standards live in `owner-ops/docs/peacemakers-operating-system/`. Read the one that governs the task. In particular:

- Evidence classes before claims
- The intervention ladder before any tool or automation
- The AI gate before any model is given tools
- Human approval before client delivery or commercial terms

## Run

1. Name which practice card applies. If several apply, use the earliest module James has not yet logged as `used`.
2. Follow `references/loop.md` in order: Observe, Practice, Measure, Revise.
3. Append one log entry. Do not mark a card learned because the video was fetched.
4. When you revise a card, change the smallest sentence that failed. Leave the YouTube id and the `doNot` list intact unless the revision is a tighter prohibition.
5. End with the score label, the evidence sentence, and the next card.

Personal cards (`money`, `focus`, `life`) stay out of client documents. Commercial cards (`sales`, `negotiation`, `automation`) produce notes for James. They do not produce offers.

## What this skill refuses

- Pasting a transcript into the repo or into a client file
- Treating sponsor rates, income claims, or "better than an MBA" as measured facts
- An unattended agent with email, payments, or client credentials
- Replacing Blueprint stages with a creator's script
