# Consulting ideas log

Notes for Peacemakers AI consulting. An entry records a source and a judgment. It is not approval to build, buy, schedule, publish, migrate, or change a client or production system.

`docs/ai-practice/` is not in this repository. Effort, risk, and compliance notes below follow the operating-system standards that are: evidence classification, agent security, human approval, and the consulting stages.

## 2026-10-24 — VPS, Cloudflare Tunnel, Tailscale, and PHP2Shell

**Status:** logged only. No build, no post, no client language, no hosting change.

**Classification:** (B) Peacemakers AI consulting. The Reel is about where vibe-coded and AI-agent code should run, and about a security posture for that host. It is not homeschool content and not a book idea.

**Source**

- Dropped in #peacemaker-ideas on 2026-10-24 by James Fullen, with no note.
- Public Reel: https://www.instagram.com/reel/De48TDpyxvy/
- Creator: Sina, Instagram `sina.growthtech` (about 78 seconds, posted 2026-10-24).
- Caption: "The PHP attacks could not penetrate my VPS / wasn’t I the guy telling you all to put your code on a VPS??" Hashtags: `#ai #aiagents #vibecoding`.
- On-screen text, read from the frames: "Did I not tell all of you to put your code on a VPS?" The monitor behind him was not legible. No terminal log was recovered from the video.

**What he actually says**

Put the code on a VPS. Install Cloudflare Tunnel. Close inbound ports. Install Tailscale so SSH stays on a private network between his devices. He says the public path to the server is the tunnel, so nobody else can reach the VPS.

He then walks it back. He says this is not 100 percent safe. He says Tailscale "got compromised" and he does not know how that affects him. He says people who refused a VPS and deployed on Railway (and a name that sounds like Vercel) got hurt, and that Railway told users to shut products down for 72 hours. He says nothing has happened to his own box, which he says has 400 to 500 users. He ends on the accurate point: if the code itself is compromised, people can still reach the server through that code, and the setup is only better than nothing.

**Claim check**

| Claim | Class | What the sources support |
| --- | --- | --- |
| PHP attacks were underway this week | VERIFIED | On 21 Oct 2026 PHP shipped fixes for two critical bugs in PHP itself, CVE-2026-109618 and CVE-2026-109619, called PHP2Shell. Wiz describes unauthenticated remote code execution and memory disclosure in the PHP runtime, including on a plain app, WordPress, Drupal, and Joomla. Fixed releases named by Hostinger and AWS: PHP 8.5.12, 8.4.27, 8.3.36, and 8.2.35. Patching is the complete fix. |
| Those attacks could not penetrate his VPS because it is a VPS | CONTRADICTED as a general claim. His own outcome is creator-reported | Hostinger's advisory splits it the other way: managed hosting was patched by the host; a VPS where you run PHP yourself is the case you must patch, because the host's protections do not apply. PHP2Shell reaches PHP that handles the request. A VPS running vulnerable PHP is in scope. His "nothing happened to me" line is his report. The Reel shows no PHP version, no access log, and no evidence the box runs PHP at all. His other public posts are about an AI-agent host (OpenClaw). A box with no PHP has nothing for this bug to hit. |
| Cloudflare Tunnel plus closed inbound ports means nobody can access the server | CONTRADICTED for a published app | Cloudflare's docs: `cloudflared` makes outbound-only connections, and the firewall can block all inbound traffic so the origin is reached through Cloudflare rather than a public IP. That blocks direct scans of the origin. A hostname published through the tunnel is still how the public reaches the app. He does not say he put an access login in front of it. A PHP2Shell request sent to that hostname still arrives at PHP. His own ending ("compromised code" still lets people in) matches this. |
| Tailscale got compromised | CONTRADICTED for this week | Tailscale bulletin TS-2026-013 (21 Oct 2026) is a certificate-trust update. Clients from v1.104.2 distrust compromised eMudhra TLS intermediates. Tailscale says ordinary node-to-node WireGuard traffic does not use that web PKI and is unaffected. That is a client update, not a Tailscale breach. Separately, in July 2026 a stolen reusable Tailscale auth key was used in the Hugging Face agent intrusion. Tailscale's write-up says no Tailscale vulnerability was exploited. The relevant lesson is key handling, not "Tailscale was owned this week." |
| Railway told all users to shut products down for 72 hours | CONTRADICTED as stated. The incident itself is VERIFIED | Railway's 21 Oct 2026 disclosure: an unauthorized party accessed encrypted environment variables and decrypted some of them. Railway told every customer to rotate environment variables, API keys, and registry credentials, and paused deployments during the investigation. Status history shows a platform outage from about 21 Oct 2026 07:24 UTC to 23 Oct 2026 22:06 UTC. The posts read for this note contain no instruction to shut customer products down for 72 hours. |
| 400–500 users, unaffected | Creator-reported | No independent evidence in the Reel. |

Sources used: [Wiz, PHP2Shell](https://www.wiz.io/blog/php2shell-php-rce), [Hostinger, who must patch](https://www.hostinger.com/blog/protecting-php2shell/), [AWS WAF note, patch first](https://aws.amazon.com/blogs/security/using-aws-waf-to-apply-mitigations-for-php2shell-rce-vulnerabilities-cve-2026-109618-and-cve-2026-109619/), [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/), [Railway disclosure](https://blog.railway.com/p/security-disclosure-wednesday-october-21st), [Railway preliminary report](https://blog.railway.com/p/preliminary-report-october-security-incident), [Tailscale TS-2026-013](https://tailscale.com/security-bulletins), [Tailscale on the Hugging Face intrusion](https://tailscale.com/blog/hugging-face-intrusion).

**Where this applies**

The usable method is a hosting checklist for anything Peacemakers leaves running, especially a long-running agent or automation. It is a Blueprint question, not a new offer and not a marketing line.

1. **Client PHP and WordPress sites (home-services sites often are).** The question to ask is who patches PHP, and whether the live version is one of the fixed releases. Managed hosting may already be patched. A self-managed VPS is the case the customer has to patch. "Move it to a VPS" is the wrong sentence for this bug.
2. **A future client agent or automation host, only if a later engagement actually needs one.** Admin access (SSH, database, admin panels) stays off the public internet. A private overlay such as Tailscale is a fit for that admin path, with current clients (1.104.2 or later for the certificate bulletin) and short-lived enrollment instead of a reusable auth key sitting in an agent environment. Publish only the service that should be public, through a proxy that hides the origin. Put a login in front of anything that is not a public site. Keep a written way to rotate secrets. Railway's incident is the reason: the failure mode was stolen environment variables, which a VPS does not remove if the app or the agent can read them.
3. **Peacemakers' own stack.** The marketing site in this repo is static HTML deployed on Vercel. Owner Ops is Next.js, with the production plan aimed at Vercel, Neon, Resend, and Upstash. PHP2Shell does not describe those runtimes. This Reel is not a reason to move either one onto a VPS.
4. **Assessment demo and outreach.** A plain question belongs in discovery: where the public site is hosted, who patches it, which ports face the internet, and where API keys live. That can sit in a Blueprint call. It is not a claim Peacemakers should repeat from this Reel, and it is not a guarantee of safety. The implementation SOW already refuses security and uptime guarantees.

**Effort**

This pass is the log entry only. A later checklist, if James asks for it, is a short addition to the internal Blueprint plan: host, what is public, who patches, how secrets rotate, how admin access works. Standing up a VPS, Tailscale, and Cloudflare per client is ongoing patching, backups, account admin, and support. The technology standard says to recommend only what James can implement and support. That operating load is not justified as a default.

**Risk**

Repeating the caption would tell a client the attacks cannot get in. A published app on an unpatched PHP VPS is still a PHP2Shell target, and the tunnel is the path the request takes. An agent host with a reusable Tailscale key is a known way for a stolen credential to join the private network (the July 2026 Hugging Face case). Closed ports do not cover a bad dependency, a published vulnerability, or a secret the process can read.

**Compliance**

- Evidence stays labeled. Creator lines stay creator-reported. Nothing here is a Stage B recommendation or a client deliverable.
- Agent security standard: network restriction, least privilege, scoped credentials, and secrets live in the system, not in a prompt that says "do not do dangerous things." Human approval stays outside the model. No new agent runtime comes from this Reel.
- Human approval standard: no client delivery, no production config change, no public claim.
- Autonomy stays out of scope. This note does not propose an agent that administers servers.

**Question for James**

Keep this as a log note only, or add a one-page hosting checklist to the internal Blueprint plan in a later pass?
