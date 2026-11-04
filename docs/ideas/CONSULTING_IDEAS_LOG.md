# Consulting ideas log

Ideas dropped for **Peacemakers AI** (classification B): the consulting practice for NC builders, contractors, home services, and similar businesses. Offers in view are the $3,500 Blueprint and the $10k / $15k / $20k monthly tiers.

This file is a log only. Nothing here is approved to build, schedule, send, or post.

Classification reminder:

- **(B) Peacemakers AI consulting** — client systems, the offer, demos, outreach, James's marketing, internal tools and stack. Logged here.
- **(A) @buildingpeacemakers homeschool** and **(C) Peacemakers Publishing** do not belong in this file.

`docs/ai-practice/` is not in this repo. Entries use the operating-system docs that are: `owner-ops/docs/peacemakers-operating-system/` (consulting, AI governance, human approval, agent security, evidence) and `owner-ops/docs/future-recommendation-philosophy.md`.

Evidence labels follow the evidence standard: VERIFIED, CLIENT_REPORTED, OBSERVED, INFERRED, HYPOTHESIS, ASSUMPTION, CONTRADICTED, UNKNOWN.

---

## 2026-10-27 — Instagram carousel: a $35 Raspberry Pi as a home VPN

**Status:** Logged. No purchase, no install, no router change, no client contact, no post.

**Classification:** (B) Peacemakers AI consulting. Unchanged after reading the carousel. James left no note. The post is not homeschool content and not a book. It is a consumer networking pitch. The piece that belongs in this practice is the remote-access pattern underneath it: reach files and cameras through a tunnel instead of publishing them on the router. The Raspberry Pi build itself is not a client system, an offer, or a demo.

**Source**

- Slack: James Fullen in `#peacemaker-ideas`, 2026-10-27 01:20 EDT, link only, no note. [Message](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1793078400164749).
- Post: https://www.instagram.com/p/De-P40vmS2H/ — carousel, posted 2026-10-26 17:28 EDT by `technologybrief` (display name “Technology Brief”). Ten still images. No voice. At fetch: 3 likes and 44 comments.
- Caption, same text from yt-dlp and from Instagram’s oEmbed (VERIFIED as the post’s caption): a $35 Raspberry Pi can run a private VPN at home with WireGuard, the protocol in many paid VPNs, instead of $5 to $13 a month. PiVPN installs and configures WireGuard and makes a profile per device. After the router is set, the WireGuard app tunnels hotel or café Wi-Fi back to the home connection. The caption also says the tunnel can reach files, cameras, and a network-wide ad blocker without exposing those services directly to the internet, that the owner still has to maintain the box, and that it does not provide the other server locations a commercial VPN sells.

**Fetch**

- Firecrawl scrape of the Instagram URL failed. Firecrawl returned: it does not support this site.
- `yt-dlp` read the public post metadata and, with `--ignore-no-formats-error`, downloaded the ten slide images. The slides are photos, so a normal video download reported no video formats. That warning is expected.
- On-screen text below is from those images. Tesseract caught the caption bands. A visual read settled the lines Tesseract broke up (the opening line, the installer choices, and the last slide). No comment thread was pulled.

**What the slides say**

| # | On-screen text |
| --- | --- |
| 1 | “YOU'RE PAYING $120 A YEAR FOR A VPN THAT A $35 COMPUTER RUNS FOR FREE.” |
| 2 | “VPN COMPANIES CHARGE $5 TO $13 A MONTH. THE WHOLE ‘SERVER’ IS A $35 COMPUTER RUNNING FREE SOFTWARE.” Three plan cards sit above that line (Basic, Pro, Premium). They name no company. The dollar figures on the cards did not read cleanly and are treated as decoration. The $5-to-$13 sentence is the claim. |
| 3 | “A RASPBERRY PI: SILENT, TINY, SIPS POWER. IT CAN RUN 24/7 FOR YEARS ON PENNIES OF ELECTRICITY.” |
| 4 | A setup screen titled “Choose a VPN,” with WireGuard selected and OpenVPN not. “THE INSTALLER IS PIVPN. A FREE ONE-COMMAND SETUP THAT TURNS THE PI INTO A WIREGUARD VPN SERVER WITH HARDENED DEFAULTS.” |
| 5 | “FORWARD ONE PORT (UDP 51820) ON YOUR ROUTER SO YOUR DEVICES CAN REACH THE PI FROM ANYWHERE.” |
| 6 | A terminal line `pivpn -qr` and a QR code. “GENERATE A PROFILE PER DEVICE. THE FREE WIREGUARD APP MAKES CONNECTING A ONE-TAP TUNNEL.” |
| 7 | A phone on the WireGuard app. “ON HOTEL OR CAFE WI-FI, YOUR TRAFFIC IS ENCRYPTED STRAIGHT TO YOUR HOME. THAT'S THE PROTECTION YOU WERE PAYING FOR.” |
| 8 | “THE TUNNEL ALSO DROPS YOU INSIDE YOUR OWN NETWORK: FILES, CAMERAS, AD-BLOCKER — ALL REACHABLE FROM ANYWHERE.” |
| 9 | “$35 BOARD PLUS $0 SOFTWARE. PAID VPNS COST THAT EVERY THREE TO SIX MONTHS. AFTER THAT, IT'S FREE FOREVER.” |
| 10 | “DON'T FOLLOW US NOW.” Then “YOUR DAILY TECH BRIEF. DELIVERED STRAIGHT TO YOUR FEED.” A sign-off, not a method. |

**The method, as shown**

Buy a Raspberry Pi, run PiVPN, pick WireGuard, forward UDP 51820 on the home router, and add each phone or laptop with the free WireGuard app (`pivpn -qr` draws the QR code). Traffic from a café then exits through the home internet connection, and anything already on the home LAN (files, cameras, an ad blocker) is reachable from that tunnel.

That is a remote-access VPN. It is not a privacy VPN with exit nodes in other countries. The caption says so. Slide 7 talks as if the two products were the same.

**Claim check** (the carousel is not a quote)

| Claim | Label | Check |
| --- | --- | --- |
| A Raspberry Pi board is $35. | VERIFIED for one SKU only | Eben Upton, 2 February 2026, names the 1GB Raspberry Pi 4 at $35 and the 1GB Raspberry Pi 5 at $45 ([Raspberry Pi news](https://www.raspberrypi.com/news/more-memory-driven-price-rises/)). His 1 October 2026 note raises the 2GB Pi 4 to $67.50 and the 2GB Pi 5 to $77.50, and says 1GB prices are unchanged ([1 October 2026 note](https://www.raspberrypi.com/news/price-increases-for-2gb-raspberry-pi-4-and-raspberry-pi-5/)). The Pi 5 product brief published October 2026 still lists the 1GB Pi 5 at $45. “The whole server” is the board. A power supply, a storage card, and a cable are extra and unpriced here. Whether the $35 board is in stock was not checked. |
| VPN companies charge $5 to $13 a month, and $35 comes back in three to six months. | PARTLY, as a band | [Mullvad’s pricing page](https://mullvad.net/en/pricing), retrieved this pass, is €5 a month flat including VAT, for a month, a year, or ten years, and the page shows €5 as about $5.59. That is the bottom of the band. Nord’s pricing page did not load (bot check), so $13 is not a vendor quote from this pass. The three-to-six-month line is arithmetic on their own $5-to-$13 band ($35 / 6 ≈ $5.83, $35 / 3 ≈ $11.67). A sale plan under $5 a month stretches the payback past six months. “Free forever” and “runs for free” drop the power, the parts, and the maintenance the caption itself admits. |
| It is the same WireGuard technology paid VPNs use. | VERIFIED for the protocol, not the product | [Mullvad’s Linux guide](https://mullvad.net/en/help/wireguard-and-mullvad-vpn) says the Mullvad Linux app uses WireGuard by default. A Pi in the hall is not that service. There is no other country’s exit, and the operator is the household. The caption admits the first half. Slide 7 does not. |
| PiVPN is a free one-command WireGuard setup with hardened defaults. | PARTLY, and the project has said it is winding down | [PiVPN’s docs](https://docs.pivpn.io/) say the script installs WireGuard by default (OpenVPN is the other choice) and warn that maintenance is best-effort. The README still says a one-command installer on a $35 Pi, with “hardened security settings in place by default.” That hardening sentence is theirs. This pass did not audit the script. [v4.6.0, 5 April 2024](https://github.com/pivpn/pivpn/releases/tag/v4.6.0), called itself the final official release. [v4.6.1, 13 April 2024](https://github.com/pivpn/pivpn/releases/tag/v4.6.1), says the maintainer will keep it working on a best-effort basis and that large new work is unlikely. Their documented install is a shell script piped from the internet. That is a supply-chain choice, not a recommendation. |
| Forward UDP 51820. | VERIFIED as the usual example port | [WireGuard’s quickstart](https://www.wireguard.com/quickstart/) sets `listen-port 51820`. PiVPN’s docs say the port can be changed. It is the port people forward. It is not a protocol law. |
| Café Wi-Fi is then as protected as the VPN subscription was. | CONTRADICTED as a full substitute | The tunnel encrypts the hop from the café to the house. The home ISP still sees the traffic, and the public address is the home address. People pay a VPN for other countries and for not trusting the home connection. Slide 7 calls those the same product. The caption is the accurate one. |
| Files, cameras, and an ad blocker are then reachable from anywhere, without being exposed to the internet. | PARTLY | A tunnel can reach what is already on the LAN. PiVPN does not, by itself, become an ad blocker. The v4.6.0 notes mention Pi-hole only as an option inside an unattended install. The caption’s useful half is real: those services do not have to be published on the router. The slide’s other half, “from anywhere,” assumes the forwarded port is actually reachable. |
| It sips power and runs for years on pennies. | Directionally fair. The wording is a pitch. | The [Pi 4 datasheet](https://datasheets.raspberrypi.com/rpi4/raspberry-pi-4-datasheet.pdf) requires a supply that can deliver 5V at 3A. It does not state an annual cost. Third-party idle figures for a Pi 4 are a few watts. That is a small bill next to $120 a year. It is not “free,” and it is not this house’s power bill. |

No install commands, port-forward walkthroughs, or QR steps belong in a client note. The slide text above is a record of what the post showed.

**Where it applies in the practice**

- **Client system to build:** no. A $5–50M builder does not need a hobby board in a closet, and this practice should not become their network admin. The recommendation ladder says use what they already run (the firewall, the access point, the IT vendor they already pay) before buying a new box. A Pi fails “can James support it?” the moment it sits on someone else’s router.
- **Assessment / Blueprint:** yes, as one discovery question. How do the owner and the leads reach job photos, cameras, and the office files when they are not in the building, and is any of that published on the router? Stage A records the answer as client-reported. Do not scan the router. Do not ask them to forward a port on the call.
- **Offer:** no new SKU and no line on the $3,500 Blueprint beyond that question. Monthly work does not include installing PiVPN.
- **Outreach and James’s marketing:** do not post this framing. “$120 a year, then free forever” is not a claim this practice can stand behind. A calm sentence is possible later, only with James’s approval, along the lines of: if the cameras or the file share are open on the router, close them and reach them through a tunnel the client’s own IT person already maintains. Not written here, not scheduled.
- **Internal stack:** a travel tunnel back to James’s own house is a personal choice, separate from client work. This entry does not approve the purchase or the port forward. If he ever does it, client files and client personal information stay off that path. A home device that can see client data is a new place a breach can happen.
- **Demos:** nothing in this pass should be built.

**Effort, risk, compliance**

- Effort of the useful part: one question on a Blueprint call. No code. Standing the Pi up would be a weekend plus patching after that, and it is out of scope.
- Risk of following the carousel: an installer whose own maintainer called the project done in April 2024, a port open on the router, and a forgotten box. A phone that joins this tunnel is inside the LAN, next to the cameras and the files. That is wider than a path to one share.
- Risk of ignoring the useful part: a client’s cameras or a job-file share stay published on the router because nobody asked.
- Port forwarding only works when the ISP hands the house a public address. A connection behind carrier-grade NAT never sees the forwarded port. The carousel does not mention that, or a changing home address. UNKNOWN for any specific connection, including James’s.
- Autonomy: A0. No agent watches the tunnel, opens the port, or files a ticket.
- Human approval: required before any purchase, router change, client sentence, or post. No external communication from this entry. `owner-ops/docs/future-recommendation-philosophy.md`: James has to be able to implement it, support it, and explain it, and a new tool waits until the current one cannot do the job.
- Security and client data: least privilege, no client personal information on a home gadget. North Carolina’s breach notice (G.S. 75-65, as summarized in the practice playbook) is the reason. The playbook on branch `cursor/ai-practice-compliance-demo-028f` was read for this note. It is not merged on `main`. This entry is not legal advice.
- Claims: the FTC standard in that playbook still applies if this ever leaks into a proposal. “This replaces a $120 VPN” is an earnings-style sentence if it is said as a fact. It stays an assumption, and it is not one we use.
- Evidence: the carousel is not a measurement of a client’s network, of James’s power bill, or of a vendor price except where a vendor page is linked above.

**Decision**

Log only. The question is worth asking. The Pi is not worth building. James approves anything that leaves the building.
