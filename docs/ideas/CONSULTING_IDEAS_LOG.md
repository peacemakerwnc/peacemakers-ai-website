# Consulting ideas log

Ideas dropped for Peacemakers AI (consulting). Nothing here is approved to build, schedule, send, or sell. James approves before any of that.

---

## 2026-10-20 — PE rollup news as a trigger for home-service outreach

- **Source:** Instagram Reel dropped in #peacemaker-ideas with no note. https://www.instagram.com/reel/DeuY6sDtmpd/
- **Creator:** Angus Sewell, @angus.sewell (“Angus the Nontechnical”). Caption: “Per usual, if you want the prompts, comment ‘lead’ and I’ll send em your way.” Hashtags: #ai #buildwithai #vibecoding. About 61 seconds. On-screen hook: “Bootleg a PE firm for $200.”
- **Classification:** B — Peacemakers AI consulting. It is an outreach tactic for selling AI/ops help to independent home-service shops after a private-equity rollup is announced. Not homeschool content and not a book idea.
- **Fetch notes:** Firecrawl refuses Instagram. yt-dlp returned an empty media response without cookies. Public oEmbed returned the caption and author. A browser embed then exposed the video file. Voice transcribed locally with Whisper base. On-screen prompt text is from OCR of the frames, so a few words in the prompts are uncertain.

### What the reel actually shows

Spoken method, cleaned only where the audio and the frames agree:

1. He claims AI consultants are raiding private-equity buyers for their customers. Whisper first heard “rating”; the rest of the reel is about taking the owners the announcement is meant to attract.
2. He asks why PE firms name the locations they buy, and says it is to catch other owners in that area, “which means you can steal all of those leads.”
3. An AI prompt finds recent PE acquisitions for one trade near one city and saves the official source, buyer, acquired business, location, and date.
4. Apify then finds nearby shops and reads up to 20 of the newest Google reviews for each. It keeps place id, review URL, date, total review count, and sample count. Acquired brands and franchises are excluded. Unsourced ownership is marked unverified. Output is `prospects.csv` and `evidence.csv`, joined by place id. The prompt says to infer one current problem from an old review and not to contact anyone in that step.
5. He flags reviews that say the shop did not pick up the phone.
6. The outreach he acts out: you know about the PE deal; you also know they are bad at answering the phone; here is a PDF on how to fix it; maybe next time they are the ones acquired for more money.
7. The sample email uses the real Oct 2026 headline. Subject is along the lines of “A page for local HVAC owners.” Body: “Did you catch the news about Sandhills joining TruTemp?” then a short breakdown for independent owners that includes a practical fix for calls when the office is busy, and an ask before sending the file. The staged reply is “Sure, send it over,” then a second email attaches `IndependentHVAC Playbook.pdf`.
8. A second prompt reads those CSVs, picks one shop with a supported operational issue, writes a one-page plan (what changed, what the reviews say, one proposed fix, sources cited), and drafts the two-email sequence. He says to “fully Claude Code” that page. Whisper heard “clad code”; the #vibecoding caption and the Cursor-style screen make Claude Code the likely tool.
9. The sample page is a “First 100 days” sheet: days 1–30 baseline (callback time and booking rate), days 31–60 install (owner-approved review replies, maintenance reminders, assigned callbacks), days 61–100 measure three numbers and tune. A line on the page says no TruTemp 100-day stack is published. He closes by saying that is how a PE deal becomes consulting leads.

The comment-keyword (“lead”) only gates his prompt file. The method above is what is on screen. The Sarah Miller email thread is a demo with same-day replies, not a reported result.

### Claim check

| Claim | Verdict |
| --- | --- |
| Centre Partners and Baldwin Creek formed TruTemp on Maynor Service Company (Raleigh HVAC/plumbing/electrical), and TruTemp later bought D&D HVAC (Sanford) and Sandhills Heating & Refrigeration (Aberdeen). | **Verified.** Centre Partners, 16 Sep 2025; TruTemp PR Newswire, 13 Oct 2026; Business North Carolina recap. Jeff Bartoli (Centre) and Milun Patel (Baldwin Creek) are named in the real releases. The reel’s LinkedIn screenshot matches that news. |
| The Oct 2026 release names the NC markets and says TruTemp wants more local partners. | **Verified.** The release says they will keep partnering with high-quality local businesses in the region. Naming Sanford and Aberdeen does put the news in front of nearby owners. |
| They announce locations mainly so other owners notice, and those owners are leads you can “steal.” | **Overclaimed.** Recruiting add-on sellers is one stated motive. The same release is also for employees, customers, and the brand. Those owners are not TruTemp’s lead list, and nothing in the reel shows anyone was contacted or booked. |
| “Bootleg a PE firm for $200.” | **Unverified hook.** The video never forms a firm, raises capital, or shows a $200 receipt. The stack on screen is a research prompt, Apify Google review pulls, and a Claude Code one-pager. A careful manual pass on one announcement does not cost $200. An Apify run can cost more or less depending on volume. |
| Reviews prove the shop “sucks at picking up the phone,” and a generated PDF will get them acquired for more money. | **Not established.** One old public review is a clue, not a diagnosis. The “acquired for way more money” line is a closer, not a result. The instant “Sure, send it over” is staged. |
| The 100-day page is TruTemp’s operating plan. | **False, and the reel says so.** The frame itself says no TruTemp 100-day stack is published. |

### Where it fits Peacemakers AI

**Best use: James’s own outreach, done by hand for this one NC deal. Not a system to build.**

TruTemp (Apex) announced on 13 Oct 2026 that it bought D&D HVAC in Sanford and Sandhills in Aberdeen, on top of Maynor in Raleigh. That is the exact buyer James sells to: NC HVAC and home services in the range he already targets. The useful kernel is the trigger plus one narrow, sourced observation, then a conversation. It is not the insult email and not a free PDF full of AI projects the owner cannot run.

A version that matches the practice:

- Start from the press release, not a scraper. List independent HVAC (and, if wanted, plumbing or electrical) shops in Sanford, Aberdeen, and the surrounding towns. Skip Maynor, D&D, Sandhills, and franchises.
- Read a few public Google reviews himself. If missed calls or slow booking show up more than once, that can be the observation. One angry review is not enough to tell an owner how their office works.
- The offer in the note is something he can actually do on a Blueprint: missed-call handling, booking follow-up, maintenance reminders, review replies the owner approves. The $3,500 Blueprint is the right container for a real look. The monthly tiers come after a validated scope, not from this reel.
- Do not send a generated “100-day AI stack.” Callback routing, reminders, and owner-approved review drafts are mostly ordinary workflow. AI is only a drafting aid (A2: recommendation, human acts). The AI appropriateness gate in `owner-ops/docs/peacemakers-operating-system/AI_GOVERNANCE_STANDARD.md` is not met for an autonomous prospector or for recommending a pile of AI implementations from one review.
- Secondary use, still unsent: a Blueprint-call example. “A platform just bought two shops near you. The leaks that show up in public reviews are the same ones the Blueprint checks.” That is a demo story, not a claim that Peacemakers caused any outcome.

**Do not build** the Apify-to-CSV-to-auto-email pipeline from this reel. `docs/ai-practice/` is not in this repo. The constraints below are from `owner-ops/docs/peacemakers-operating-system/` (consulting, evidence, AI governance, human approval).

### Effort, risk, compliance

- **Effort:** A manual pass on the 13 Oct TruTemp release is short: read the release, list nearby independents, read public reviews, draft one note, stop for approval. Building the Apify and Claude Code pipeline is a real product, with actor fees, breakage when Google or Apify changes, and review of every draft. Not worth it for a single announcement.
- **Evidence:** Stage A forbids final recommendations from unverified statements. A Google review is a public clue. It is not client-reported process, not a baseline, and not a source of truth. Classify it as a public signal. Do not treat it as how the shop actually runs.
- **Outreach rules:** James approves the exact note before it is sent (`HUMAN_APPROVAL_STANDARD.md`: material external communications). No implication that Peacemakers works for TruTemp, Centre, or Baldwin Creek, or has inside knowledge of the deal. No “you suck at the phones.” No “you’ll sell for more.” Honest sender identity. If it is commercial email, include a real postal address and a working opt-out (CAN-SPAM). Do not call or text a scraped number (TCPA). Do not contact the acquired companies as if they were prospects.
- **Scraping:** The reel’s Apify step pulls Google reviews at volume. Google’s terms restrict automated collection. Prefer shops and reviews James opens himself. If a licensed or official source is used later, record what was accessed and keep review text out of logs that do not need it.
- **Brand and false proof:** The staged reply is not a conversion rate. Copying the tone would spend trust with the same owners the Blueprint is meant to help.
- **Status:** Logged only. Not approved to research a list, draft outreach, build a scraper, generate a playbook, or contact anyone.
