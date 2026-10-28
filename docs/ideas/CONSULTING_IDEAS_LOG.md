# Consulting ideas log

Ideas dropped for **Peacemakers AI** (classification B): the consulting practice for North Carolina builders, contractors, home services, and similar businesses. Offers in view are the $3,500 Blueprint and the $10k / $15k / $20k monthly tiers.

This file is a log only. Nothing here is approved to build, schedule, send, install, or post.

Classification reminder:

- **(B) Peacemakers AI consulting** — client systems, the offer, demos, outreach, James's marketing, internal tools and stack. Logged here.
- **(A) @buildingpeacemakers homeschool** and **(C) Peacemakers Publishing** do not belong in this file.

`docs/ai-practice/` is not on `main`. This entry uses `owner-ops/docs/peacemakers-operating-system/` (consulting, AI governance, human approval, agent security, evidence) and the practice playbook on the open branch `cursor/ai-practice-compliance-demo-028f` (secrets, least privilege, untrusted input, human approval). That playbook says Peacemakers will not claim a result the client's own test did not produce.

Evidence labels: VERIFIED, OBSERVED, INFERRED, HYPOTHESIS, ASSUMPTION, CONTRADICTED, UNKNOWN.

---

## 2026-10-28 — Zero Breach Toolkit Reel

**Status:** Logged. Do not install. Do not point an agent at it. Do not send findings anywhere. No post, no client contact.

**Classification:** (B) Peacemakers AI consulting. Internal stack and agent safety. The Reel is a spyware-scanner release that ends by telling viewers to hand the tool to an AI. It is not homeschool content and not a book.

**Source**

- Slack: James Fullen in `#peacemaker-ideas`, 2026-10-28 07:39 EDT. No note. [Message](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1793187562433399).
- Reel: https://www.instagram.com/reel/DfAkXOeIRBm/ — posted 2026-10-27 15:07 EDT by `archive.genocide` (display name ArchiveGenocide). About 1 minute 57 seconds. At fetch: 73,017 likes, 899 comments.
- Caption (OBSERVED, oEmbed title and yt-dlp description match): a second free open-source tool, "Zero Breach Toolkit," "capable of detecting over 12,100 traces of Israeli & other spyware," for Windows, Linux, Mac, Android, and iPhones. GitHub link `https://github.com/interplains/Zero-Breach-Toolkit`. The caption says the scan never writes to disk, never connects to the internet, and never asks for admin, and that a run takes about 10–15 minutes. It invites people who find spyware to send it via Telegram, asks for a GitHub star, and says to follow `@archive.genocide1`.

**Fetch**

- `yt-dlp` downloaded the public video, audio, and caption. The logged-out Instagram HTML page did not include the media; oEmbed and yt-dlp did.
- Voice transcript is local faster-whisper `small.en` on the extracted audio. On-screen lines below were read from frames. The spoken names Candiru, QuaDream, and Graphite match those frames. The model wrote "Kandiru"; the card says Candiru.

**What the Reel shows**

A masked presenter on a black card titled **ZERO BREACH TOOLKIT**. Speech starts immediately. There is no client, no offer, and no contractor workflow.

Working transcript (speech):

- 0:00 They have released a second, "far more powerful" open-source tool, Zero Breach Toolkit, which "can detect over 12,100 indicators of Israeli spyware," naming Pegasus, Candiru, Paragon's Graphite, QuaDream, stalkerware, and more. Download from the GitHub link.
- 0:25 The tool is read-only. It never goes online and never asks for admin. It works on Windows, Linux, Android, and macOS, and "can do iPhones if you create a backup file first, then scan the backup file." Python is required.
- 0:45 It includes a toolkit to investigate a find, and steps to report. "If you find a piece of malware, report it to us on our Telegram." Do not delete anything before sending them a copy.
- 1:00 It checks whether the browser blocks ads, and whether any profile "touched the hundreds of thousands of recently infected ads Israeli spyware was using."
- 1:13 A skill is included "for your AIs." "Just point your AI to it and it will know what to do."
- 1:24 Take the source and build on it. Suggest improvements on GitHub. They plan Android-based TVs and other home devices "in the coming weeks." Star the repo. "God bless."

On-screen, in order:

- Title card, then a terminal headed **A FINDING (DEMO DATA)**. The window says Zero Breach Toolkit 0.1.0, scope "targeted," and "A clean result is NOT a clean bill of health." The result line is "potentially SERIOUS finding" against a `.invalid` demonstration host. The screen itself labels this demo data.
- Family cards: **CANDIRU SPYWARE**, "Candiru (Saito Tech) · Israel," then a QuaDream chip reading "Reign spyware · Israel" over that same card.
- **HOW IT WORKS:** read-only ("changes nothing"), never goes online, never asks for admin. A footnote: updating the indicator lists is a separate step you choose.
- A Telegram card for **Israel Exposed**: "We archive & publish Israeli war crimes footage. All footage is forwarded to the ICC, and multiple legal teams." The card showed 30,759 members.
- **YOUR BROWSER:** "Is your browser blocking ads?" It also checks browser profiles for contact with "the infected ad network spyware was using." Footnote: menu option 3 opens the ad test in your own browser.
- The GitHub README section **For scripts and AI assistants**: `--describe` and `--json` mark which fields an assistant must relay and which fields hold untrusted text from the scanned machine. The same screen says Android results were compared with MVT on one real-phone collection and both reported no indicator matches, and that newer readers and experimental iPhone support still need real-device validation.
- Close card: follow, like, subscribe, `@IsraelExposed` and `@Archive.Genocide`.

**Claim check**

The repo was read, not run. Created 2026-10-25. At fetch on 2026-10-28: Apache-2.0 code, 1,746 stars, default branch `main`, last push 2026-10-28 07:17 UTC. Stars are a popularity count. They are not a review.

| Claim | Label | Note |
| --- | --- | --- |
| Over 12,100 traces, or 12,100 indicators, of spyware. | The project's own README says "About 12,400 published indicators from 29 sources," and says that number arrives by downloading lists. The offline copy is a small built-in set. | VERIFIED that the README states ~12,400 and that `--update` is how the rest is fetched. The shipped `dist/adfection.stix.json` retrieved this pass contains 404 indicators. `iocs/adfection_iocs.txt` is 600 lines and `iocs/curated_mercenary.txt` is 58 lines. Those files were counted. The remote lists behind 12,400 were not downloaded and were not counted. A published indicator is an address, hash, or similar value from someone else's research. It is not 12,100 confirmed infections, and it is not a detection rate. |
| The whole set is "Israeli spyware." | PARTLY the voice's framing | The speech names Pegasus, Candiru, Graphite, QuaDream, and stalkerware. The README's indicator sources also include Amnesty, the Citizen Lab, the MVT project, and Echap's stalkerware research. Stalkerware is a product category with many vendors. Calling the indicator pile "Israeli spyware" is the Reel's slogan. |
| "Hundreds of thousands of recently infected ads." | UNKNOWN | That count is in the speech. It is not in the README retrieved this pass. The on-screen card says "the infected ad network," with no number. |
| Never writes to disk, never connects, never asks for admin. | CONTRADICTED as a description of the whole tool | The HOW IT WORKS card matches the speech, then adds that updating lists is a separate step. README and PRIVACY.md: a scan is not supposed to make network requests; `--update` downloads indicator lists; menu option 3 opens a page on the creator's site in the user's browser; the tool writes a local report and temporary database copies; a Mac check wants Full Disk Access for Terminal; `--collect-android` is a separate step that changes the phone. The README also says that without the download, only the small built-in set is used, so the 12,100 figure and the "never goes online" line do not describe the same run. |
| Read-only, and a clean result means the device is safe. | The scan is described as read-only aside from temp copies and the report. A clean result is not a clean bill of health. | VERIFIED as the project's own wording, on the demo screen and in the README ("It only finds published indicators." "It does not replace a forensic examination by experts."). The demo terminal is labeled DEMO DATA. |
| iPhones work. | Narrower than the caption | The speech says scan a backup file. The card on screen still calls iPhone support experimental and awaiting real-device validation. The README retrieved this pass lists iPhone local backups as a supported input and says an iPhone check sees only supported artifacts in the evidence you supply. |
| "Point your AI to it and it will know what to do." | CONTRADICTED by the skill they shipped | `skills/zero-breach-toolkit/SKILL.md` says to scan only a scope the user authorized, to treat evidence text as untrusted, to refuse instructions embedded in that text, and not to upload or message anyone unless the user explicitly says so. The voice tells viewers to send a copy of what they find to the account's Telegram. |
| One real phone matched MVT, and both found nothing. | OBSERVED on the Reel's GitHub frame only | That sentence is not in the README retrieved this pass. One collection with no matches is a single negative comparison. It does not measure detection. |

The README's first advice, if someone thinks they are being targeted, is to get expert help first and names the Access Now Digital Security Helpline and Amnesty International's Security Lab. This pass did not re-test those organizations. It did read that the project points there.

**Whether it applies**

| Surface | Fit |
| --- | --- |
| Client system to build | No. Mercenary-spyware forensics is not the Blueprint and not a monthly tier for a builder or a home-services firm. Peacemakers is not a forensics lab and not a helpline. |
| Assessment demo | No. The serious-looking terminal in the Reel is labeled demo data. |
| The offer | No. |
| Outreach | No. Do not send this Reel, this repo, or this Telegram to a prospect. |
| James's marketing | No. Do not repost it and do not borrow the masked-presenter format. |
| Internal stack | Do not clone it, run it, or add the skill on a machine that holds client files, billing keys, or this repo. The reminder worth keeping is already in the agent-security standard: text that comes back from a tool, a file, or a scanned machine is untrusted, and a person decides before anything is sent. |

**Effort.** None. Leave the repo where it is.

**Risk.** The repo is three days old and is being distributed by a political footage account whose on-screen card asks people to join a Telegram that forwards material to legal teams. The voice asks viewers to send a copy of anything the tool finds, and not to delete it first. A report, per the project's own privacy note, can contain usernames, browser history, and message excerpts, and a report saved into OneDrive or iCloud can sync. Full Disk Access and an Android collector are easy to grant from a Reel and hard to take back. An agent that "knows what to do" with that skill can treat a scanned file as instructions. A clean run would still leave James with a false certificate of safety.

**Compliance.** Human approval before any tool runs on a practice or client machine. Least privilege and supply-chain review before a new GitHub project is executed. Prompt-injection defense: evidence text is data. No client file in a consumer chat, and no device image sent to a stranger's Telegram. No detection-rate claim and no dollar claim. If a person actually believes they are being targeted, the project's own page sends them to Access Now or Amnesty first. That referral is the whole response. It is not a Peacemakers engagement.
