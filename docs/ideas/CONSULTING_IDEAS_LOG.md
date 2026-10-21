# Consulting ideas log

Peacemakers AI is the consulting practice: a **$3,500 Blueprint** assessment, then a monthly AI department at **$10,000, $15,000, or $20,000**. The work is interviews plus a live draft built from the client's redacted documents, with a person approving anything a customer or a lender would rely on.

This file is for that practice. It is not a note for the homeschool accounts, the children's books, or the printables.

James posted the carousel below in `#peacemaker-ideas` on 20 October 2026, with the note "Read and apply across all projects, read every and all contents of each slide of the carousel": [20 Oct 2026, 00:06 EDT](https://peacemakersai.slack.com/archives/C0C7H0N1MU7/p1792469213955119).

How it was read, on 20 October 2026:

- Post: Instagram's public embed page for `DehMUh_jdbK` (`/embed/captioned/`). The page embeds `contextJSON` with the sidecar, the caption, and a CDN URL for each slide. `gallery-dl` was redirected to the Instagram login page. `yt-dlp` 2026.08.19 saw the same seven children and reported no video formats.
- Slides: seven JPEGs, each 1781×2237, saved from the embed's largest `display_resources` URL. No slide is a video. There is no voice track to transcribe.
- On-screen text: Tesseract 5.3.4, line by line, after isolating navy pixels from the cream background. A handful of script-face glyphs were one letter off. Those are listed under "Glyphs reconciled" and the reading used in the numbered list is the reconciled one.
- Caption: the `edge_media_to_caption` text in that same embed JSON.
- Comments: the embed records `edge_media_to_comment.count` as 1167 and does not include comment bodies. The caption says the list is also in the comments. Those bodies were not retrieved. The numbered list below is the slides, not the comments.
- Safety notes follow `docs/ai-practice/compliance-playbook.md`. That playbook is on the open branch `cursor/ai-practice-compliance-demo-028f`, not on `main` as of this writing. Owner Ops standards still govern Owner Ops software. Nothing below is a revenue forecast.

## Classification

**(B) Peacemakers AI consulting.** The carousel is a production-engineering checklist aimed at people who ship software with an AI coding tool. The account is `@nataindata` (Natalie, data engineer). The method on the last slide is "feed it to your Claude."

The clients are builders, contractors, and home-services firms. They do not run Kubernetes, and a Blueprint does not become a platform review. The part that belongs in the practice is smaller: when an automation writes a lead, an estimate, or an invoice, a retry must not create a second record, a failure must be visible, and a person still approves anything a customer would rely on.

## The action

Keep a short pre-ship check for work Peacemakers actually builds. Use it on the internal stack and inside a Blueprint when the subject is an automation that writes to a system of record. The check is the items already named in the operating standards and the practice playbook: secrets stay out of the repo and out of a chat, retries carry an idempotency key, failures land where a person can see them, logs record the event and not the document, and a named person approves the customer-facing or financial step.

Leave the other hundred items on the slide. Do not add a "production readiness" product, and do not paste a client's job files into a consumer Claude chat because the caption says to.

**Effort.** A one-page internal check, written from standards that already exist. No new system.

**Cost.** $0. The carousel names no vendor and no price.

**Risk of doing what the caption says.** Feeding a live system, a secret, or a homeowner file into a personal Claude login, then treating the model's "checked" as a control. Copying the 111 lines into a proposal for a contractor who needs follow-up and estimating, not sharding.

## The carousel

https://www.instagram.com/p/DehMUh_jdbK/

### What was retrieved

| Item | Observed |
| --- | --- |
| Account | `nataindata`. Display name was not in the embed. Her site describes her as Natalie, a data engineer. |
| Shortcode | `DehMUh_jdbK`. Media id in the embed: `4008539330783860426` |
| Type | GraphSidecar. Seven images. `is_video` is false on the parent and on every child. |
| Picture | 1781×2237 on each slide |
| Likes | `edge_liked_by` was present. The count was not copied into this note. |
| Comments | Count 1167 in the embed. Bodies not in the embed. |
| Caption | "ok my reel was viral and i know you all want to paste this whole list into claude 😊 so i put all 111 in here (and text in the comments). go save it" |

Child shortcodes, in order: `DehMEdNtZIZ`, `DehMEe2NVMd`, `DehMEeftZaD`, `DehMEgTtGLd`, `DehMEgJtRH1`, `DehMEgttKYb`, `DehMEhcN1kP`.

### Slide by slide

**Slide 1.** Headline: "WHO'S GONNA TELL VIBE CODERS ABOUT..." Then items 1–19. Handle `@nataindata`.

1. Rate Limiting
2. Caching
3. Load Balancing
4. Reverse Proxies
5. API Gateways
6. CI/CD
7. Docker
8. Kubernetes
9. Service Discovery
10. Circuit Breakers
11. Timeouts
12. Retries
13. Exponential Backoff
14. Idempotency
15. Message Queues
16. Pub/Sub
17. Event-Driven Architecture
18. Distributed Transactions
19. Saga Pattern

**Slide 2.** Items 20–41. Handle `@nataindata`.

20. Dead Letter Queues
21. Cron Jobs
22. WebSockets
23. Long Polling
24. Server-Sent Events
25. Database Indexing
26. Query Optimization
27. N+1 Queries
28. Connection Pooling
29. Read Replicas
30. Sharding
31. Partitioning
32. Replication
33. Leader Election
34. CAP Theorem
35. Eventual Consistency
36. Optimistic Locking
37. Pessimistic Locking
38. Distributed Locks
39. Race Conditions
40. Deadlocks
41. Memory Leaks

**Slide 3.** Items 42–59. Handle `@nataindata`.

42. Garbage Collection
43. Thread Safety
44. Backpressure
45. Autoscaling
46. Horizontal Scaling
47. Vertical Scaling
48. CDN
49. Edge Caching
50. Cache Invalidation
51. Feature Flags
52. Blue-Green Deployment
53. Canary Releases
54. Rolling Deployments
55. Rollbacks
56. Health Checks
57. Liveness & Readiness Probes
58. Monitoring
59. Logging

**Slide 4.** Items 60–82. Handle `@nataindata`.

60. Distributed Tracing
61. Metrics
62. Alerts
63. SLOs
64. SLIs
65. Error Budgets
66. Observability
67. Secrets Management
68. IAM
69. OAuth
70. JWT Rotation
71. TLS
72. Encryption at Rest
73. Encryption in Transit
74. WAF
75. DDoS Protection
76. CORS
77. CSRF
78. SQL Injection
79. XSS
80. SSRF
81. Database Migrations
82. Schema Versioning

**Slide 5.** Items 83–101. Handle `@nataindata`.

83. Disaster Recovery
84. Backups
85. Failover
86. Multi-Region Deployment
87. Chaos Engineering
88. Cost Optimization
89. Cold Starts
90. Serverless Limits
91. Latency
92. Throughput
93. P99 Latency
94. Tail Latency
95. Network Partitions
96. Clock Skew
97. DNS
98. TCP vs UDP
99. HTTP/2 & HTTP/3
100. gRPC
101. Webhooks

**Slide 6.** Items 102–111. Handle `@nataindata`.

102. API Versioning
103. Semantic Versioning
104. Infrastructure as Code
105. Terraform
106. Helm Charts
107. Build Caching
108. Dependency Hell
109. Production Incidents
110. On-Call
111. Postmortems

**Slide 7.** Sign-off, no further items.

- "yours, Natalie :*"
- "the list is also in the comments"
- "feed it to your Claude"
- Handle `@nataindata`

That is 111 numbered items. Slide 7 adds the instruction and the signature.

### Glyphs reconciled

Tesseract's raw token is on the left. The reading in the list above is on the right. Each one is a single letter in a script face, sitting in a run of terms that name the same idea.

| Slide line | Raw OCR | Reading |
| --- | --- | --- |
| 27 | Ntl Queries | N+1 Queries |
| 30 | Sharaing | Sharding |
| 40 | fhendlocks | Deadlocks |
| 48 | CON | CDN |
| 68 | TAM | IAM |
| 71 | Ti. TLS | 71. TLS |
| 77 | CSRE | CSRF |
| 93 | P44 Latency | P99 Latency |
| 98 | TcP vs VDP | TCP vs UDP |
| 100 | aRPC | gRPC |

Item 48 is the softest of these. The three letters are C, a round letter, and N, and items 49 and 50 are edge caching and cache invalidation. CDN is the reading. A second look at the JPEG can overturn it.

### The method, as she tells it

1. A short video of hers went viral. This carousel is the same list, written out, 111 lines.
2. Save the post.
3. Paste the whole list into Claude.
4. The same text is, she says, in the comments. Those comments were not retrieved.

She does not say what Claude should do with the list, what "done" looks like, or what happens if the model skips a line. There is no number in the caption: no hours saved, no error rate, no price.

### What holds, and what does not

**The words name real engineering concerns.** Timeouts, retries, and exponential backoff are how Amazon describes handling a call that fails without stampeding the thing that is already in trouble. The [AWS Builders' Library article](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) (byline "Marc," published 5 December 2019, page retrieved 20 October 2026) is titled "Timeouts, retries, and backoff with jitter" and describes using timeouts, retries, and exponential backoff with jitter so a transient failure does not overwhelm a service that is already struggling. Idempotency is a defined API behavior, not a vibe. [Stripe's idempotent-requests page](https://docs.stripe.com/api/idempotent_requests), retrieved the same day, says the API supports idempotency "for safely retrying requests without accidentally performing the same operation twice," and that a repeated request with the key should not create a second object. Rate limiting sits in [OWASP API4:2023 Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/). SLOs are a Google SRE concept, written up in [Chapter 4 of the SRE book](https://sre.google/sre-book/service-level-objectives/). Postmortems are Chapter 15 of that same book. The carousel is a syllabus. It is not a design.

**"Feed it to your Claude" does not install any of those controls.** A model can recite a checklist. The control is the code, the key, the queue, and the person. NIST's Generative AI Profile, [NIST AI 600-1](https://doi.org/10.6028/NIST.AI.600-1) (26 July 2024), is voluntary, and the practice playbook already uses it for confabulation, data leakage, prompt injection, and over-reliance. Over-reliance is the failure mode of this caption. [OWASP's 2025 LLM Top 10](https://genai.owasp.org/llm-top-10/), retrieved 20 October 2026, names LLM02 Sensitive Information Disclosure and LLM06 Excessive Agency on the same list. Pasting a client's system into a consumer chat is the disclosure case. Letting the model's answer stand in for a deploy is the agency case.

**Most of the 111 describes a platform a home-services firm does not have.** Kubernetes, sharding, leader election, the CAP theorem, multi-region deployment, Helm, and Terraform are real, and they are the wrong next step for a builder whose system of record is the CRM, the inbox, and QuickBooks. The consulting standard says to simplify and use the current tool before adding software. A checklist pasted from Instagram does not get to skip that.

**The items that match work already in front of the practice are few, and they are already written down.** Secrets out of the repository and out of the chat. Least privilege. Logs that store who, which version, and whether a person approved, and that do not store the document. A named person approves anything customer-facing or financial. Idempotency on a write that can be retried, so a second run does not create a second estimate. A visible failure when the run does not finish. Backups of the system of record the client already owns. Those lines are in `owner-ops/docs/peacemakers-operating-system/` and in the practice playbook's build checklist. The carousel did not add them.

**SLOs, error budgets, and on-call are for a service with traffic and a pager.** Quoting them in a Blueprint for a 40-person contractor would dress up a follow-up workflow as a site-reliability program. Use plain words: how often it fails, who notices, and what the person does on Monday.

### Where it meets Peacemakers

| Use | Fit |
| --- | --- |
| Client system | A pre-ship check on automations that write: idempotency key on the write, retry with backoff, a failure a person can see, the current process as the fallback when the tool is down. Stripe's idempotency page and the AWS backoff article are the references. Kubernetes, sharding, saga, and multi-region stay off the design. |
| Assessment demo | One question in the Blueprint, asked in the client's words: what happens if the automation runs twice, and what happens if it is down. The answer is demonstrated on redacted documents, with a person approving the draft. The 111-line list is not the demo. |
| Offer and pricing | No change. $3,500 and the three monthly tiers are untouched. The carousel is not a new assessment and not a new tier. |
| Outreach | No. There is no list, script, or follow-up in the post. |
| His own marketing | The hook shape can be reused in original words: the unglamorous failure on a contractor's automation, such as a duplicate estimate or a draft that went out with no owner. Her slides, her 111 lines, her sign-off, and her audio stay hers. Nothing posts without James's approval. |
| Internal stack | Owner Ops already requires human approval, secret handling, and logs without payloads. Use this carousel as a reminder to keep those on anything an agent generates. Do not adopt Terraform, Helm, or an on-call rotation because they appear at items 105, 106, and 110. |

### Effort, cost, risk, compliance

**Effort.** None as a build. The one-page check is a writing task against standards that already exist. Standing up the platform items on the slides would be a different practice.

**Cost.** $0. No tool to buy. A consumer Claude subscription is not a client-data account. The playbook's vendor section says a personal chatbot login is not the account for client work.

**Risk and compliance.** The playbook's line is the right one: show the thing on their documents, with a person checking the output, and keep the sensitive parts out of the model. The FTC material it cites, [15 U.S.C. § 45](https://www.law.cornell.edu/uscode/text/15/45) and ["Keep your AI claims in check"](https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check) (27 February 2023), is why "we ran it through Claude, so it is production-ready" does not go in a proposal. Fees stay fees. They are not a savings claim.

Pasting a secret, a homeowner record, or a job file into the chat the caption names is the disclosure the OWASP LLM list calls out. North Carolina breach notice, if personal information actually gets out, is the playbook's section on the Identity Theft Protection Act, not a line on this carousel.

Autonomy stays at information or a draft. A1 or A2 in the Owner Ops scale. The model does not send, bill, or write the system of record. Item 14 on the slide, idempotency, is implemented in the request, the way Stripe documents it. It is not a sentence in a prompt.

Her images and her wording are hers. A Peacemakers post uses original sentences. Saving the carousel for this log is the use James asked for. Reposting the slides is not.

## What was not done

- No system was built, changed, or scheduled. No post was drafted for a public account. No client was contacted.
- The comment thread was not opened. The caption's claim that the list is in the comments is recorded and unchecked.
- The list was not pasted into Claude, and no client document was put in a model.
- Her slides were not copied into the repo. The transcription above is the record.
- Higgsfield was not used. No credits were spent.
