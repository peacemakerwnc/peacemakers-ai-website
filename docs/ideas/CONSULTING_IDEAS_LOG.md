# Consulting ideas log

Ideas dropped for **Peacemakers AI** (classification B): the consulting practice for North Carolina builders, contractors, home services, and similar businesses in the $5–50 million range. Offers in view are the **$3,500 Blueprint**, then a monthly AI department at **$10,000, $15,000, or $20,000**.

This file is a log only. Nothing here is approved to build, schedule, send, or post.

`docs/ai-practice/` is not on `main`. The safety notes below follow `owner-ops/docs/peacemakers-operating-system/` (consulting, AI governance, human approval, agent security, evidence) and the practice playbook on branch `cursor/ai-practice-compliance-demo-028f`. That playbook says Peacemakers will not claim a time saving, an error rate, or a dollar return unless that client's own test is attached.

Evidence labels: VERIFIED, OBSERVED, INFERRED, HYPOTHESIS, ASSUMPTION, CONTRADICTED, UNKNOWN.

---

## 2026-10-28 — Update desktop Chrome to the current 156 stable

**Status:** Logged. No browser was updated. No client was told to update. No post.

**Classification:** (B) Peacemakers AI consulting. A browser check on machines the practice and a client already use, and one question inside a Blueprint when the office lives in Chrome. The homeschool accounts and the books are not the subject.

**Why this was saved.** The Reel is a fifty-second instruction to open Chrome's About page and install the update, because an Anthropic research post says bugs they reported are patched in Chrome 156. The useful part is the click path and the version floor. The "62 remote code execution bugs" line is the creator's compression, and it is the line not to repeat.

**Source**

- Slack drop: James Fullen, `#peacemaker-ideas`, 28 October 2026, 6:13 PM ET. No note. [Permalink](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1793225588535799).
- Reel: https://www.instagram.com/reel/DfDUYLjFHGQ/ — `lizthedeveloper`. Posted 28 October 2026, 4:44 PM ET. About 50 seconds, 1080×1920. At fetch: 3,453 likes, 156 comments. Those counts are a snapshot, not a reason to adopt the wording.

**Caption (OBSERVED):** "10/28/26 - go now update chrome 😬 do not pass go do not collect $200 just run don’t walk to update your browser #cybersecurity #security".

**Fetch:** Firecrawl refuses Instagram. `yt-dlp` retrieved the video, the description, and the metadata. On-screen text was read from frames about twice a second. Whisper `tiny` on the voice track heard "cloud" where the captions say "Claude," and it garbled the last few words. The list below follows the on-screen captions. This note does not record the exploit chain on the page behind her.

**What she shows**

The corner of the browser is not the check. She opens the three-dot menu, then Settings, then About Chrome. The About page reads that Chrome is up to date on version **156.0.8078.74** (Official Build, arm64). She says the version has to say 156, because Claude found remote code execution bugs in Chrome, 62 of them, and a bug of that kind can let someone else run code on the computer when you visit a website. The page on the monitor is Anthropic's research post, chapter "One-click remote code execution in Chrome."

Google's own help page uses a shorter path to the same screen: three dots, Help, About Google Chrome, then Relaunch. If Relaunch is not offered, that install is on the latest version Google is serving it. [Update Google Chrome](https://support.google.com/chrome/answer/95414).

**Claim check**

| Claim | Label | Source |
| --- | --- | --- |
| The update does not have to appear as a badge in the corner. Check About Chrome. | VERIFIED as the check Google documents | [Update Google Chrome](https://support.google.com/chrome/answer/95414). The About page is where Chrome looks for an update and offers Relaunch. A missing badge is not evidence the install is current. |
| Anthropic says an internal research model built a one-click Chrome chain that runs code as the user, outside the sandbox, after a page loads, and that 62 CVEs from their reports are patched as of Chrome 156, all critical or high, including 13 sandbox escapes and 21 renderer bugs. | VERIFIED that Anthropic wrote this. The counts are theirs | [Discovering and exploiting vulnerabilities with Claude](https://www.anthropic.com/research/discovering-vulnerabilities-with-claude), retrieved this pass. The post links the 20 October 2026 stable note. This log does not repeat the chain. |
| "Claude found 62 remote code execution vulnerabilities." | CONTRADICTED as a reading of that post | The voice and the captions say 62 remote code execution bugs. Anthropic describes one chain that reaches code execution, and 62 CVEs in total. Those are not the same sentence. |
| Chrome 156, released 20 October 2026, contains the fixes Anthropic points at. The builds in that note are 156.0.8078.47 on Linux and 156.0.8078.47/.48 on Windows and Mac. | VERIFIED | [Stable Channel Update for Desktop, 20 October 2026](https://chromereleases.googleblog.com/2026/10/stable-channel-update-for-desktop_02018666648.html). "This update includes 353 security fixes." Counted on that page: 6 critical, 61 high, 197 medium, 89 low. The page does not say the bugs are being used in attacks. |
| The same page credits Anthropic, or Claude, on all 62. | CONTRADICTED as a public credit count | The 20 October note names Xinyang Ge on 15 fixes. Five of those say "Xinyang Ge (Anthropic), assisted by Claude." All 15 sit in the critical or high entries. Google says bug details can stay restricted until most people have the fix, so the unpublished remainder is UNKNOWN. Fifteen named credits are what the page shows. 62 is not. |
| The FedCM line in that Chrome note is the bug Anthropic describes. | CONTRADICTED | The only FedCM entry on the 20 October page is a medium issue reported by Google on 28 April 2026. It is not credited to Anthropic. Do not pair Anthropic's sentence with that CVE. |
| The build she points at, 156.0.8078.74, is the current Windows and Mac stable as of 27 October 2026, and .73 is the other build in the same update. Linux in that note is .73. | VERIFIED for the version pair. Her screen is OBSERVED | [Stable Channel Update for Desktop, 27 October 2026](https://chromereleases.googleblog.com/2026/10/stable-channel-update-for-desktop_0562499947.html): 156.0.8078.73/.74 for Windows and Mac, 156.0.8078.73 for Linux, rolling out over the coming days and weeks, with 52 further security fixes. A comment on the Reel asks whether .73 is enough when the video shows .74. On Windows and Mac, .73 and .74 are that same update. |
| Any Chromium browser is safe once Chrome says 156. | UNKNOWN, and the Reel does not say this | Edge, Brave, and Vivaldi ship their own builds. The number 156.0.8078.74 is Google Chrome's. Phones and Chromebooks are not in the video. This pass did not read those release notes. |

**Whether it applies**

| Surface | Fit |
| --- | --- |
| Internal stack | On each computer James uses for mail, the hosting dashboards, Stripe, and client files: three dots, Help, About Google Chrome, Relaunch if it is offered. A build at or after 156.0.8078.47 has the 20 October fixes Anthropic links. Take 156.0.8078.73 or .74 when About offers it. If About already says up to date on 156.0.8078.47 or .48, the 20 October set is installed and the 27 October respin may not have reached that browser yet. |
| Client system to build | No new system. If a client's office works in Chrome, the fix is Google's update, installed by a person at that computer. |
| Blueprint assessment | One question, when the staff live in a browser: which browser, and who is allowed to install an update. Evidence is the About page on a machine they actually use. The number 62 stays out of the packet. |
| Offer or pricing | No new product and no price from this Reel. |
| Outreach and own marketing | No post, and no line that a prospect's computer can be taken over, or that Claude found 62 remote code execution bugs in their browser. |
| This marketing site | Static HTML. A browser update on a visitor's laptop does not change the site. |

**The part to leave alone.** The chain on the Anthropic page. Copying it, asking a model to reproduce it, or hunting the withheld bug details. Google is still holding details back until most installs are updated. Also leave alone: telling someone on 156.0.8078.73 that they are behind because the video shows .74, and telling someone on Edge or a phone to look for the number 156.

**Effort.** This pass is the log. Checking one computer is the About page and a relaunch. A Blueprint question is a sentence, after James asks for it. No install in this pass.

**Risk.** Quoting 62 remote code execution bugs, 13 sandbox escapes, or "your computer can be taken over" as a finding about a client. Treating .73 as unpatched. Assuming the 27 October update has reached every install on the day it was posted. It is still rolling out.

**Compliance.** A claim that a client's browser is exposed needs that machine's About page (`docs/ai-practice/compliance-playbook.md` on the open branch; FTC Act Section 5 as summarized there). Updating a browser on a client computer is a change on their machine and needs the person who owns it (`HUMAN_APPROVAL_STANDARD.md`). The control is the vendor update, not a prompt (`AGENT_SECURITY_STANDARD.md`). No ROI claim is supported. North Carolina breach notice is a lawyer's question if personal information is actually acquired. It is not triggered by this Reel.

**Not approved:** posting or emailing the caption, telling a client their machines are exposed, changing Chrome on a client computer, signing the practice up for any Anthropic security program named in that research post, and asking an agent to re-find or re-test the bugs.
