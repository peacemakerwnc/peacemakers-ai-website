# Comment-keyword auto-reply — internal spec

**Status:** Draft for James's review. Do not build, connect an app, or send a message.
**Date:** 20 October 2026

Someone comments one keyword on the client's Instagram post. One automatic DM sends a resource or a booking link they already use. The lead lands in their CRM, and a person follows up. Count a qualified inquiry and a kept appointment. This is a client system, separate from the carousel in `docs/marketing/nc-qualified-inquiries-carousel.md` and from the `@viralish` "comment DOUBLE" close logged in [PR #37](https://github.com/peacemakerwnc/peacemakers-ai-website/pull/37).

## How it works

Meta's APIs, or a tool that logs in through Meta. Never the Instagram password.

A comment on the client's professional post, reel, story, Live, or ad post fires the `comments` webhook (`live_comments` on Live), with the account id, the commenter's Instagram-scoped id and username, the comment id, and the text. One private reply goes out with `recipient.comment_id`, within 7 days (on Live, only during the broadcast). Followers see it in Inbox; others see it in Requests. Meta also attaches a reference to the commented post, so that line is not the resource. A second message waits until the person responds, then only for 24 hours. The keyword match is exact and case-insensitive. The DM is one approved sentence plus one link. No model chooses either. Source: [Private replies](https://developers.facebook.com/documentation/instagram-platform/private-replies), updated 30 June 2026, retrieved 20 October 2026.

Instagram Login needs `instagram_business_basic` and `instagram_business_manage_comments`. Facebook Login needs `instagram_basic`, `instagram_manage_comments`, and `pages_read_engagement`. A Business Manager role on the Page can also require `ads_management` and `ads_read`. Replies after the person responds use `instagram_business_manage_messages`. An app on an account Peacemakers does not own needs Advanced Access. Messaging source: [Send Messages](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/messaging-api), updated 28 September 2026.

ManyChat is the tool path. Their guide says a comment can open a comment-to-DM flow, a qualifying action comes first, and follow-ups stay inside 24 hours. They call themselves a Meta Business Partner; confirm the directory listing before naming them to a client. "You don't need to worry about compliance" is marketing. Source: [DM automation rules](https://manychat.com/blog/instagram-dm-automation-rules/), updated 6 July 2026. Their opening-DM article, the tap that lets the person answer and thus opens the 24-hour window, returned 403 ([Auto-DM links from comments](https://help.manychat.com/hc/en-us/articles/16654065283100-Quick-Automation-Auto-DM-links-from-comments)). Re-read it before setup.

## Client, rules, measure, risk

**From the client:** a professional account and an admin granting access through Meta's login; the keyword, the sentence, and the link; the CRM they already use, a source field `instagram-comment`, and a named person on the new rows; the Blueprint's definition of a qualified inquiry (the work, the place, a person who will answer); a pause switch and a human fallback.

**Rules.** One reply per comment, inside 7 days. More messages only after they respond, inside 24 hours, which is when promotional content is allowed. The Human Agent tag is 7 days for a person answering by hand, not for another send of the offer. One-time notifications, news messaging, and sponsored messages are not on the Instagram Messaging API. The comment asks for that one DM, not a later campaign. Say the DM is automatic; Meta requires that where the law does, including California, and recommends it generally. Message only the keyword. ManyChat says Meta still flags volume, repeated public replies, and overlapping accounts ([their partner article](https://help.manychat.com/hc/en-us/articles/18624810395932-Is-Manychat-officially-approved-by-Meta); fetch was 403, re-read it). Policy source: [IG Messaging API policy](https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy), updated 28 September 2026.

**Measure.** Qualified inquiries matching the Blueprint definition, and appointments those people keep. Also count failed sends and Requests-folder DMs nobody opened. Comment counts, views, and DMs sent are activity. Promise none of them.

**Risks.** Requests-folder DMs often go unseen. A custom app waits on app review and Advanced Access; until then, ManyChat or a person. The client owns the account, the Page, the CRM, and the link. The sentence stays frozen until James and the client change it. An unattended sender is A4 in `AI_GOVERNANCE_STANDARD.md`. A3 is the default: a person approves the send. A4 waits until the keyword, sentence, link, pause switch, and CRM field have worked by hand.

## Prices, unchanged

| Place | Fee | This system |
| --- | --- | --- |
| AI Opportunity Blueprint | $3,500 (`peacemakers-ai/blueprint.html`; `billing/stripe-catalog.json`) | The question, and a **Proposed** recommendation if the evidence supports it. No app, no ManyChat, no CRM write. |
| Monthly AI department | $10,000 / $15,000 / $20,000 | The build, after a Blueprint shows comments are a real lead path. It touches the CRM and a Meta permission, so it is monthly work. |

The three monthly figures are one offer at three fees. On `cursor/ai-practice-compliance-demo-028f`, `docs/ai-practice/` names them and treats monthly work as anything touching a system of record, several roles, or a permission boundary. It does not split the work by price. This spec does not assign $10,000 versus $15,000 versus $20,000, and it adds no fee. James includes it in the fee the client already pays, or later offers one of those three. Quick Win Sprint, Growth System, and Advisory Partnership stay custom-quote. For the first clients, version one is a person sending the approved sentence and logging the lead (`PEACEMAKERS_MASTER_IMPLEMENTATION_ROADMAP.md`).
