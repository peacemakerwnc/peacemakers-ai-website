# Consulting ideas log

Ideas dropped for Peacemakers AI. An entry records the source, the method, and a claim check. It is not approval to build, buy, configure, schedule, or publish. James approves any later action separately.

Compliance notes follow `owner-ops/docs/peacemakers-operating-system/` (human approval, evidence, agent security, consulting). `docs/ai-practice/` is not on `main`. The safety playbook on branch `cursor/ai-practice-compliance-demo-028f` was read for this entry (secrets, least privilege, no keys in a personal chatbot). It is not merged here.

## 2026-10-24 — Instagram: weekend security cleanup

- **Status:** Logged only. No settings changed. No dependencies bumped. No agent scheduled. No other repo touched.
- **Classification:** B — Peacemakers AI consulting / internal stack. James’s note asks to apply security measures across his software projects. The Reel itself is mostly household cybersecurity, with one developer slice.
- **Source:** James Fullen in #peacemaker-ideas, 2026-10-24 23:56 EDT. [Slack](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1792900603214169). Note: “have cursor action the security measures for all projects.”
- **Reel:** https://www.instagram.com/reel/De14JcnKTYm/
- **Creator:** [@intentionally_](https://www.instagram.com/intentionally_/) — Sean Johnson. Instagram oEmbed `author_name`.
- **Posted:** 2026-10-23 (yt-dlp `upload_date`). About 150 seconds. At fetch: 41,541 likes, 654 comments.
- **Caption:** “PLEASE take this seriously.” That string is also the oEmbed title. No other caption text came back.
- **Docs from this pass:** [per-project checklist](../security/SECURITY_CHECKLIST.md) and [this repo’s audit](../security/AUDIT_PEACEMAKERS_AI_WEBSITE.md).

### Fetch

Firecrawl refuses Instagram (`We do not support this site`). The public oEmbed endpoint returned the title, creator, and caption. yt-dlp downloaded the video and audio. Voice was transcribed locally with faster-whisper `small.en`. A second pass with a vocabulary hint degraded the proper nouns (`Cloud Code`, `Grotrockbot`). The transcript below is the first pass. “Cloud code” in a later pass, followed by “ask Claude,” is Claude Code. A comment on the Reel says “Grokbot,” which matches the first pass.

On-screen text did not OCR cleanly. The line sits on a moving background. The only on-screen string confirmed independently of the voice is the caption.

### What the Reel actually says

Spoken opening: take the weekend to do simple security cleanup for your family. He calls this a turning point for AI and cybersecurity, says he will not “bore you with the specifics,” and says many websites were hit this week. He says open-source AI models can be used by bad actors to deploy agents for brute-force attacks, DDoS, or “hack your data.” He says it is not a reason to freak out, then gives this list.

| # | Spoken measure | What he adds |
| --- | --- | --- |
| 1 | Set up a password manager, “like one password” | Shared vault for a spouse or partner. Learn it yourself |
| 2 | Update passwords for critical accounts | Email, bank, financial. Store them in the manager. Use the strongest password |
| 3 | Two-factor authentication everywhere you can | SMS is not ideal but better than nothing. Google Authenticator or a passkey is better. A hardware key is safest and he assumes most people will skip it |
| 4 | Add a SIM PIN on the phone | Harder to SIM-jack. If they get the phone they get other accounts |
| 5 | Update the phone and the computer to the newest releases | Turn auto-update on |
| 6 | Freeze your credit | “Takes five minutes. Google it.” |
| 7 | IRS identity protection PIN | Optional. “If you want to.” |
| 8 | If you use Claude Code or AI agents that browse the web | Update Claude Code. Update Node.js. Run a package manager to update all packages. Ask Claude or “Grokbot, which is connected to Twitter and has the most current information,” to audit repos for vulnerabilities. Ask Grok to make that a daily scheduled task |
| 9 | “Light resiliency” | Printed copies of financial accounts, cash, shelf-stable food, clean water or a filter, a map, maybe a generator for the fridge. He compares doubting this to the start of COVID |

He closes by saying a secure plan now has to treat cybersecurity as a real threat, and to take a weekend and shore up.

Comments at fetch did not add a method. They did confirm the topic: 1Password, fear of a hacked password manager, and skepticism about Grokbot.

### Claim check

Influencer claims stay labeled. None of the “tipping point” or reach-of-harm claims were measured here.

The week he is pointing at is real reporting, and it is narrower than his sentence.

**VERIFIED as published reporting, not as a Peacemakers incident.** Reuters, 19 October 2026, from research by Snorre Fagerland at NorForge: operators left copies of Cairn, an open-source AI task tool, exposed on the internet. One cluster’s agents attempted more than 1,200 e-commerce sites and reached sites belonging to more than 100 companies. Reuters names Deere, SharkNinja, and Cummins from its own review. Successful attempts were described as many hours of poking at existing weaknesses, on the order of 23 hours, at a rough token cost around $50 per success. Reuters said the activity appeared to mix DeepSeek and Claude Code, and said it could not establish how much data was taken. Secondary write-ups (The Hacker News, 20 October 2026; The Verge) track that account. This pass did not read NorForge’s primary PDF.

**Partly valid — the incident.** Agents exploiting known flaws in websites matches that reporting. “Open-source AI models” is loose: Cairn is open-source orchestration; DeepSeek is an open-weight model; Claude is not open-source. “Brute force” shows up in other 2026 threat research (Unit 42 describes an AI-assisted WordPress brute-force chain). This pass did not tie that Unit 42 report to the week of 19 October, so it is not the evidence for his sentence. **“DDoS” is overstated** relative to the Reuters/NorForge account, which describes intrusion, not a denial-of-service campaign. A separate 21 October 2026 OpenAI note, “Patch the Planet,” is about critical PHP flaws found with model assistance and the need to patch. That supports “update the software you run.” It is not evidence for household generators.

1. **Password manager — valid.** [CISA, Use Strong Passwords](https://www.cisa.gov/secure-our-world/use-strong-passwords), retrieved this pass: long, random, unique passwords, stored in a password manager rather than a file, plus MFA on email and financial accounts. “Like 1Password” is one reputable product, not the only one. CISA also accepts a browser’s built-in manager. A shared vault for a partner is a real emergency-access pattern. It also widens who can read the vault. That tradeoff is his to make at home. It is not a default for a client project.

2. **Replace critical passwords now — partly valid.** Unique strong passwords for email and financial accounts match CISA. Rotating every critical password in a weekend because of this week’s website attacks is **overstated** unless those accounts were in an exposed set or the passwords were reused. For a project, rotate a secret when it may have leaked, with a plan. Do not rotate production secrets because a Reel said ASAP.

3. **Two-factor authentication, ranked — valid.** CISA’s [phishing-resistant MFA fact sheet](https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf): any MFA beats a password alone; SMS and similar factors are phishable and SIM-swapable; phishing-resistant MFA (FIDO / security key, passkeys) is the standard to move toward. His order (SMS < authenticator or passkey < hardware key) matches that. “Everywhere” is right for email, GitHub, Vercel, the registrar, the bank, and the password manager. It is not a reason to bolt MFA onto Owner Ops inside this pass. The pilot record already says password-only, on purpose, until James changes it.

4. **SIM PIN — partly valid.** A PIN on the SIM helps if someone has the physical card. It does not stop a remote SIM swap, where the carrier moves the number. The FTC’s control for that is a PIN or password on the **carrier account**, plus MFA that is not texted to the phone. [FTC, SIM swap scams](https://consumer.ftc.gov/consumer-alerts/2019/10/sim-swap-scams-how-protect-yourself). FCC rules require carriers to authenticate SIM-change and port-out requests ([Report and Order, 8 December 2023](https://www.federalregister.gov/documents/2023/12/08/2023-26338/protecting-consumers-from-sim-swap-and-port-out-fraud)). Do this on a phone plan. Do not file it as a software change.

5. **Update the phone and computer, auto-update on — valid for personal devices.** [CISA, Update Software](https://www.cisa.gov/secure-our-world/update-software), retrieved this pass: install updates, especially critical ones, and turn on automatic updates. That advice is for devices and consumer apps. Production servers and app dependencies need a reviewed update, not an unattended `npm update` on a Friday deploy.

6. **Credit freeze — valid, personal, out of scope.** The FTC’s page is [Credit freeze or fraud alert](https://consumer.ftc.gov/articles/credit-freeze-or-fraud-alert). This pass confirmed the URL and could not extract the article body (the scrape returned site chrome). The control is still the right personal step: a freeze at each bureau blocks new credit in your name. It does not protect a GitHub repo. Not a client deliverable.

7. **IRS IP PIN — valid, personal, optional.** [IRS](https://www.irs.gov/identity-theft-fraud-scams/get-an-identity-protection-pin), retrieved this pass: a six-digit PIN so someone else cannot file a return under your SSN or ITIN. Anyone who can verify identity may enroll, including when they are not required to file. It has nothing to do with Node or a website.

8. **Update Claude Code, Node, and packages, then have Grok audit every repo daily — partly valid, and the daily-agent part is the wrong control.**
   - Updating Claude Code and Node when vendors ship security fixes matches CISA’s update guidance. Do it on the machines that run them.
   - “Run a package manager to update all the packages” is the risky shorthand. A lockfile plus a reviewed bump is the control. A blind update can ship a break, or a malicious release. GitHub’s control is Dependabot security updates and the dependency graph, not a chatbot. [Dependabot security updates](https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates). `npm audit` reads the same advisory data. [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit).
   - “Grokbot, connected to Twitter, has the most current information” is **wrong as a vulnerability source.** X is not the GitHub Advisory Database and it is not OSV. An LLM audit can help read a diff. It is not the scanner.
   - A daily scheduled agent with permission to audit and change repos fails the agent-security standard: least privilege, human approval, no standing write access. The week’s reporting is about agents that were given a goal and left to work. Copying that pattern onto our own repos, unsupervised, is the failure mode.

9. **Printed financials, cash, food, water, map, generator — personal preparedness, not a project control.** None of this is wrong as a household choice. None of it follows from the Cairn reporting. The COVID comparison is rhetoric. Leave it out of client work and out of the Blueprint. Do not buy equipment from this Reel.

### Where it applies

| Surface | Fit |
| --- | --- |
| Client system to build | Only as a scoped hardening line James and the client approve: secrets, MFA on the accounts the client owns, a reviewed dependency update. Not a daily Grok task. Not a credit freeze. |
| Blueprint assessment | A short patch-and-access check when the client has a site or an agent. See the strategy note below. |
| Offer or pricing | No new product and no price from this Reel. |
| Outreach | No. Do not use the “tipping point” line in a post or a sales email. |
| Own marketing site | Account MFA for GitHub and Vercel. No npm app to update. The blog workflow should not gain an autonomous security agent. |
| Owner Ops | The one place in this repo with a Node lockfile. Audit is in the security doc. No bump in this pass. |
| Internal stack | Password manager and phishing-resistant MFA on James’s own admin accounts. Update Claude Code / Cursor on the machines that have them. Confirm GitHub secret scanning and Dependabot before any agent is allowed to “audit all projects.” |
| Household | SIM account PIN, credit freeze, IRS IP PIN, device auto-update. James does these himself if he wants them. They are not git work. |

**Worth keeping:** password manager, unique passwords, MFA with a preference for passkeys or a hardware key, device updates, and a reviewed way to hear about dependency advisories.

**Leave alone:** DDoS as the description of that week, “Grok on Twitter has the most current vulnerability data,” a daily agent with write access to every repo, blind `npm update`, and the food-and-generator list as a software recommendation.

**Effort:** This pass is documentation only. James’s own account MFA and a password-manager pass are an evening if the accounts are his. A Dependabot config is a small repo change and then a review habit. An Owner Ops Next.js and Zod bump is a separate, tested change. A daily Grok or Cursor job across every project is the expensive and risky version, and it is the one not to start.

**Risk:** An agent told to “action the security measures for all projects” can rotate a live secret, open a major upgrade (npm’s suggested Prisma fix is 7.x), or commit a scan transcript that contains a key. The Cairn story is a reminder that an agent with a goal and a browser does not need a long prompt to do harm. Unreviewed package updates can pull a bad release. Marketing the weekend list as protection from AI hackers would be an FTC-shaped claim we cannot support.

**Compliance:** Permission and security changes, production config, and secret rotation need James’s approval (`HUMAN_APPROVAL_STANDARD.md`). Security is enforced in the app and the host, not in a prompt (`AGENT_SECURITY_STANDARD.md`). The practice playbook’s rule still holds: a key lives in a password manager or a host secret, not in the repo and not in a personal chatbot; if one leaks, rotate it the same day and treat the prompts as exposed. Do not hand this script to a client as a lead system or as proof they are “secure.” No ROI claim is supported. North Carolina breach notice is a lawyer’s question if personal information is actually acquired. It is not triggered by this Reel.

**Not approved:** changing app code, dependencies, GitHub or Vercel settings, env vars, or secrets; enabling Dependabot; scheduling a Grok, Claude, or Cursor audit; editing any other repository; telling a client to freeze credit or buy a generator.

### Strategy

Peacemakers already says the client owns the accounts, access is least-privilege, and a person approves a change. The public page is `peacemakers-ai/security.html`. This Reel does not add a new offer.

What the week’s reporting supports, and the Reel blurs, is ordinary hardening: known flaws got exploited by agents that were willing to try for hours. The defender move is to patch, to keep admin accounts on phishing-resistant MFA, and to keep secrets out of git and out of agent context.

A Blueprint assessment can carry a short check when the client has a website, an automation, or an agent. Who applies dependency updates. Whether the admin accounts for the host, the repo, and the email use MFA. Whether a secret has ever lived in the repo or a chat. Whether a person has to approve before an agent changes production. That check is evidence for the assessment. It is not a fear script and it does not include the household list.

A later implementation line can be “security hardening” inside a build the client has approved: lockfile review, secret handling, MFA on the tools they own. It is scoped work with a human gate. It is not a standing daily model job, and it is not something Cursor should start across every project from a Slack link.
