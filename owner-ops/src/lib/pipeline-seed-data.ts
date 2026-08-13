/**
 * Default Owner-Ops pipeline stages — Blueprint vs Implementation lifecycle.
 *
 * Seeded into PipelineStage (DB-configurable; not a Prisma enum).
 * Authority: OD-MR-06 · Owner Operating Runbook · Commercial Gate Checklist.
 *
 * Lifecycle (board):
 *   Lead/Intro → Blueprint Qualified → Blueprint Commercial (sign+pay)
 *   → Blueprint Active (form / Stage A / call / Stage B via NextAction)
 *   → Blueprint Review → Blueprint Complete
 *   → (optional) Implementation Interest → Scoping → Commercial → Active
 *
 * Hard rules encoded in stage order + exit criteria:
 *   - Questionnaire release only after Blueprint agreement signed + $3,500 paid
 *   - Blueprint Complete ≠ Implementation Active
 *   - Implementation Interest ≠ Stage C / sold implementation
 *   - PandaDoc / Stripe remain commercial sources of truth (manual verify)
 *
 * Operational detail (send invoice, run Stage A, etc.) → NextAction, not extra columns.
 */

export type StageSeed = {
  name: string;
  slug: string;
  objective: string;
  requiredInformation: string;
  requiredOwnerAction: string;
  clientFacingArtifact: string | null;
  suggestedMessage: string;
  relevantSopSlug: string | null;
  exitCriteria: string;
  nextStageSlug: string | null;
  isTerminal: boolean;
  checklist: string[];
};

export const DEFAULT_PIPELINE_SLUG = "owner-ops-default";

export const DEFAULT_STAGES: StageSeed[] = [
  {
    name: "Lead",
    slug: "new-lead",
    objective: "Capture a new inbound or outbound lead.",
    requiredInformation: "Name, email, company (if known), source.",
    requiredOwnerAction: "Review lead; request intro call or disqualify.",
    clientFacingArtifact: null,
    suggestedMessage:
      "Thanks for reaching out — I’d like to schedule a short introductory call.",
    relevantSopSlug: "sop-new-lead",
    exitCriteria: "Intro call requested or lead disqualified.",
    nextStageSlug: "intro-call-requested",
    isTerminal: false,
    checklist: ["Confirm contact details", "Note lead source"],
  },
  {
    name: "Intro Call Requested",
    slug: "intro-call-requested",
    objective: "Get an introductory discovery call on the calendar.",
    requiredInformation: "Preferred times or Calendly link sent.",
    requiredOwnerAction: "Send scheduling link and follow up if no response.",
    clientFacingArtifact: "Calendly intro link",
    suggestedMessage:
      "Here is my calendar link for a 30-minute introductory call.",
    relevantSopSlug: "sop-intro-scheduling",
    exitCriteria: "Call is scheduled.",
    nextStageSlug: "intro-call-scheduled",
    isTerminal: false,
    checklist: ["Send calendar link", "Set follow-up reminder"],
  },
  {
    name: "Intro Call Scheduled",
    slug: "intro-call-scheduled",
    objective: "Prepare for and hold the introductory call.",
    requiredInformation: "Meeting time, prep notes, company context.",
    requiredOwnerAction: "Prepare talking points; confirm attendance.",
    clientFacingArtifact: null,
    suggestedMessage: "Looking forward to our call — here is a short agenda.",
    relevantSopSlug: "sop-intro-call",
    exitCriteria: "Call completed or rescheduled/cancelled.",
    nextStageSlug: "intro-call-completed",
    isTerminal: false,
    checklist: ["Add meeting record", "Prepare discovery questions"],
  },
  {
    name: "Intro Call Completed",
    slug: "intro-call-completed",
    objective: "Record outcomes and decide Blueprint qualification.",
    requiredInformation: "Call notes, fit assessment, interest level.",
    requiredOwnerAction: "Mark Blueprint Qualified, nurture, or lost.",
    clientFacingArtifact: null,
    suggestedMessage: "Thank you for the conversation — next steps below.",
    relevantSopSlug: "sop-intro-follow-up",
    exitCriteria: "Qualification decision recorded.",
    nextStageSlug: "qualified",
    isTerminal: false,
    checklist: [
      "Log call notes",
      "Decide Blueprint Qualified / nurture / lost",
      "No free diagnostic consulting on the intro call",
    ],
  },
  {
    name: "Blueprint Qualified",
    slug: "qualified",
    objective:
      "Confirm paid Business Blueprint is the right next step (not implementation).",
    requiredInformation:
      "Confirmed interest, decision-maker, willingness to discuss real workflows.",
    requiredOwnerAction:
      "Enter Blueprint Commercial — prepare PandaDoc agreement + Stripe $3,500 invoice.",
    clientFacingArtifact: null,
    suggestedMessage:
      "Based on our call, the next step is the paid Business Blueprint engagement.",
    relevantSopSlug: "sop-qualify",
    exitCriteria: "Ready for Blueprint agreement and payment (commercial gate).",
    nextStageSlug: "agreement-sent",
    isTerminal: false,
    checklist: [
      "Confirm stakeholders",
      "Confirm company record",
      "Confirm client understands Blueprint is paid ($3,500)",
    ],
  },
  {
    name: "Blueprint Commercial",
    slug: "agreement-sent",
    objective:
      "Complete Blueprint commercial gate: PandaDoc signed and Stripe $3,500 paid in full.",
    requiredInformation:
      "PandaDoc agreement status; Stripe invoice status (SoR — verify externally).",
    requiredOwnerAction:
      "Send/track agreement and invoice with dual approval; record commercial checkpoint in Owner-Ops only after verifying PandaDoc + Stripe.",
    clientFacingArtifact: "Blueprint agreement + Stripe invoice",
    suggestedMessage:
      "Agreement and invoice are ready when you are — questionnaire follows after both are complete.",
    relevantSopSlug: "sop-blueprint-commercial",
    exitCriteria:
      "PandaDoc SIGNED and Stripe PAID IN FULL ($3,500), checkpoint recorded. Then release questionnaire.",
    nextStageSlug: "awaiting-payment",
    isTerminal: false,
    checklist: [
      "Verify PandaDoc signature (SoR)",
      "Verify Stripe payment $3,500 (SoR)",
      "Record commercial checkpoint in Owner-Ops",
      "Do NOT send questionnaire until both complete (James exception only + recorded)",
    ],
  },
  {
    name: "Blueprint Payment Pending",
    slug: "awaiting-payment",
    objective:
      "Finish any remaining Blueprint payment (or hold while signature already done).",
    requiredInformation: "Stripe invoice status, amount, receipt.",
    requiredOwnerAction:
      "Confirm paid in full in Stripe; then advance to questionnaire release.",
    clientFacingArtifact: "Stripe invoice / receipt",
    suggestedMessage: "Invoice is ready — thank you for getting the Blueprint started.",
    relevantSopSlug: "sop-blueprint-payment",
    exitCriteria: "Payment verified in Stripe; ready to send questionnaire.",
    nextStageSlug: "blueprint-form-not-sent",
    isTerminal: false,
    checklist: [
      "Confirm Stripe paid in full",
      "Update Owner-Ops checkpoint",
      "Next: create/send questionnaire invitation",
    ],
  },
  {
    name: "Questionnaire Ready",
    slug: "blueprint-form-not-sent",
    objective:
      "Commercial gate complete — create and send the Blueprint preparation form.",
    requiredInformation: "Contact email, company association, commercial checkpoint.",
    requiredOwnerAction: "Create invitation and send secure link (James approve send).",
    clientFacingArtifact: "Business Blueprint Preparation form",
    suggestedMessage:
      "Please complete the Business Blueprint Preparation form before our Blueprint call. You can save and return later.",
    relevantSopSlug: "sop-blueprint-invite",
    exitCriteria: "Invitation created and sent.",
    nextStageSlug: "blueprint-form-sent",
    isTerminal: false,
    checklist: [
      "Confirm commercial gate already complete",
      "Create form invitation",
      "Send or copy link",
    ],
  },
  {
    name: "Questionnaire Sent",
    slug: "blueprint-form-sent",
    objective: "Ensure the client received and can open the form.",
    requiredInformation: "Invitation status, expiry date.",
    requiredOwnerAction: "Monitor open status; resend if needed.",
    clientFacingArtifact: "Secure form link",
    suggestedMessage:
      "Friendly reminder: the Blueprint preparation form is ready when you are.",
    relevantSopSlug: "sop-blueprint-follow-up",
    exitCriteria: "Form opened or client confirmed receipt.",
    nextStageSlug: "blueprint-form-started",
    isTerminal: false,
    checklist: ["Confirm delivery", "Schedule follow-up if unopened"],
  },
  {
    name: "Questionnaire In Progress",
    slug: "blueprint-form-started",
    objective: "Support the client while they complete the form.",
    requiredInformation: "Completion percentage, last saved time.",
    requiredOwnerAction: "Offer help; track progress (NextAction).",
    clientFacingArtifact: "In-progress form",
    suggestedMessage:
      "I see you’ve started the form — happy to jump on a quick call if anything is unclear.",
    relevantSopSlug: "sop-blueprint-support",
    exitCriteria: "Submission received or waiting for more input.",
    nextStageSlug: "waiting-for-client",
    isTerminal: false,
    checklist: ["Review completion %", "Offer support if stalled"],
  },
  {
    name: "Waiting on Questionnaire",
    slug: "waiting-for-client",
    objective: "Wait for remaining form input without losing momentum.",
    requiredInformation: "Last activity, follow-up cadence.",
    requiredOwnerAction: "Follow up on incomplete form by due date.",
    clientFacingArtifact: "Form resume link",
    suggestedMessage:
      "Just checking in on the Blueprint preparation form — your progress is saved.",
    relevantSopSlug: "sop-waiting-client",
    exitCriteria: "Form submitted or opportunity re-staged.",
    nextStageSlug: "blueprint-form-submitted",
    isTerminal: false,
    checklist: ["Send reminder", "Update next-action due date"],
  },
  {
    name: "Questionnaire Submitted",
    slug: "blueprint-form-submitted",
    objective: "Acknowledge submission and queue intake review / Stage A.",
    requiredInformation: "Submitted response version, timestamp.",
    requiredOwnerAction: "Confirm receipt; create Stage A / review NextAction.",
    clientFacingArtifact: "Submission confirmation",
    suggestedMessage:
      "Thank you — we received your Business Blueprint preparation answers and will review them before our call.",
    relevantSopSlug: "sop-blueprint-submitted",
    exitCriteria: "Review / Stage A task created and client notified.",
    nextStageSlug: "blueprint-review-required",
    isTerminal: false,
    checklist: ["Send confirmation", "Create Stage A / review task"],
  },
  {
    name: "Blueprint Active",
    slug: "blueprint-review-required",
    objective:
      "Deliver the sold Blueprint: Stage A → evidence → 90-min call → Stage B → client PDF (use NextActions for the current task).",
    requiredInformation:
      "Form responses; Stage A/B artifacts in canonical private store; call notes.",
    requiredOwnerAction:
      "Drive NextActions: Stage A, evidence request, schedule call, Stage B, assemble client Blueprint.",
    clientFacingArtifact: "Evidence request / call invite as appropriate",
    suggestedMessage:
      "I’ve reviewed your submission — let’s schedule the Business Blueprint discussion.",
    relevantSopSlug: "sop-blueprint-active",
    exitCriteria:
      "Client Blueprint PDF ready for James-approved present/send → move to Blueprint Review.",
    nextStageSlug: "blueprint-call-scheduled",
    isTerminal: false,
    checklist: [
      "Persist Stage A same day (private Drive)",
      "Evidence request as needed",
      "Schedule / hold Blueprint call",
      "Persist Stage B same day (private Drive)",
      "Fill claim-safe client Blueprint template",
    ],
  },
  {
    name: "Blueprint Call Scheduled",
    slug: "blueprint-call-scheduled",
    objective: "Hold the 90-minute Business Blueprint discussion.",
    requiredInformation: "Meeting time, Stage A agenda, evidence plan.",
    requiredOwnerAction: "Facilitate call; do not design implementation on the call.",
    clientFacingArtifact: null,
    suggestedMessage: "Confirming our Blueprint call — agenda attached.",
    relevantSopSlug: "sop-blueprint-call",
    exitCriteria: "Call completed; notes/transcript retained privately.",
    nextStageSlug: "blueprint-call-completed",
    isTerminal: false,
    checklist: ["Prepare agenda", "Confirm attendance", "Transcript method ready"],
  },
  {
    name: "Blueprint Call Completed",
    slug: "blueprint-call-completed",
    objective: "Retain notes and run Stage B (Proposed recommendations only).",
    requiredInformation: "Transcript/notes, evidence references.",
    requiredOwnerAction: "Run Stage B in ChatGPT Advisor; save to private Drive.",
    clientFacingArtifact: null,
    suggestedMessage:
      "Thanks for the Blueprint discussion — written recommendations coming next.",
    relevantSopSlug: "sop-blueprint-call-follow-up",
    exitCriteria: "Stage B approved and saved; client deliverable in preparation.",
    nextStageSlug: "recommendation-in-preparation",
    isTerminal: false,
    checklist: [
      "Retain transcript/notes privately",
      "Run Stage B",
      "Save Stage B same day",
      "No Stage C / implementation quote in Stage B",
    ],
  },
  {
    name: "Blueprint Delivery Prep",
    slug: "recommendation-in-preparation",
    objective:
      "Translate approved Stage B into the claim-safe client Blueprint (HTML → PDF).",
    requiredInformation: "Approved Stage B; deliverable template.",
    requiredOwnerAction: "Populate template; James pre-send review.",
    clientFacingArtifact: null,
    suggestedMessage:
      "I’m preparing your written Business Blueprint for review.",
    relevantSopSlug: "sop-blueprint-delivery",
    exitCriteria: "James-approved PDF ready to present/send.",
    nextStageSlug: "proposal-sent",
    isTerminal: false,
    checklist: [
      "Fill HTML template from Stage B",
      "Pre-send checklist (no Stage C / ROI / 30-60-90)",
      "Generate PDF",
      "Store in private Drive / 05 Client Blueprint",
    ],
  },
  {
    name: "Blueprint Review",
    slug: "proposal-sent",
    objective: "Present/review the client Blueprint; capture decision.",
    requiredInformation: "Delivered PDF; meeting notes; client decision.",
    requiredOwnerAction:
      "Present findings; record Outcome A/B/C (complete / internal / implementation interest).",
    clientFacingArtifact: "Business Blueprint PDF",
    suggestedMessage: "Sharing your Business Blueprint for review.",
    relevantSopSlug: "sop-blueprint-review-meeting",
    exitCriteria:
      "Client decision recorded → Blueprint Complete (or Implementation Interest if Outcome C).",
    nextStageSlug: "blueprint-complete",
    isTerminal: false,
    checklist: [
      "Present / send PDF (James approved)",
      "Record decision: no further / internal / implementation interest",
      "Do not treat interest questions as sold implementation",
    ],
  },
  {
    name: "Blueprint Complete",
    slug: "blueprint-complete",
    objective:
      "Paid Blueprint scope finished successfully — implementation is optional and separate.",
    requiredInformation:
      "Commercial checkpoint; Stage A/B saved; delivered PDF; client decision.",
    requiredOwnerAction:
      "Close Blueprint scope; if Outcome C, move to Implementation Interest after selected Proposed items.",
    clientFacingArtifact: null,
    suggestedMessage:
      "Thank you — the Business Blueprint engagement is complete. Implementation help is available separately if you want it.",
    relevantSopSlug: "sop-blueprint-complete",
    exitCriteria:
      "Engagement closed for Blueprint, or moved to Implementation Interest with selected recommendations.",
    nextStageSlug: "implementation-interest",
    isTerminal: false,
    checklist: [
      "Artifact checklist complete",
      "Decision recorded (A/B/C)",
      "Lack of implementation ≠ lost Blueprint",
    ],
  },
  {
    name: "Implementation Interest",
    slug: "implementation-interest",
    objective:
      "Client explicitly asked Peacemakers to help implement selected Proposed recommendation(s).",
    requiredInformation:
      "Explicit interest; which Proposed items; James approval to advance.",
    requiredOwnerAction:
      "Clarify selection if unclear; only then start bounded Stage C (Implementation Scoping).",
    clientFacingArtifact: null,
    suggestedMessage:
      "Happy to scope implementation for the recommendations you select — separately from the Blueprint.",
    relevantSopSlug: "sop-implementation-interest",
    exitCriteria:
      "Selected Proposed item(s) + James approval → Implementation Scoping. Not yet sold.",
    nextStageSlug: "implementation-scoping",
    isTerminal: false,
    checklist: [
      "Confirm explicit implementation request (not mere curiosity)",
      "Record selected Proposed recommendation(s)",
      "James approves advancing to scoping",
      "Interest ≠ Stage C ≠ Implementation Active",
    ],
  },
  {
    name: "Implementation Scoping",
    slug: "implementation-scoping",
    objective:
      "Bounded Stage C: enough scope for a credible implementation offer (not free deep design).",
    requiredInformation:
      "Selected items; objective; boundaries; assumptions; exclusions; effort/range inputs.",
    requiredOwnerAction:
      "Run bounded Stage C; prepare implementation offer inputs; stop if scoping itself needs paid discovery.",
    clientFacingArtifact: null,
    suggestedMessage:
      "We’re preparing a bounded implementation scope and commercial offer for your selected items.",
    relevantSopSlug: "sop-implementation-scoping",
    exitCriteria: "Bounded scope ready → Implementation Commercial.",
    nextStageSlug: "implementation-commercial",
    isTerminal: false,
    checklist: [
      "Stay within OD-MR-02 Stage C boundary",
      "No exhaustive WBS / architecture by default",
      "Produce offer-ready commercial inputs",
    ],
  },
  {
    name: "Implementation Commercial",
    slug: "implementation-commercial",
    objective:
      "Implementation agreement signed and payment completed per agreement (PandaDoc + Stripe SoR).",
    requiredInformation: "Implementation agreement status; payment status.",
    requiredOwnerAction:
      "Dual-approve sends; verify signature and payment externally; record checkpoint.",
    clientFacingArtifact: "Implementation agreement + invoice",
    suggestedMessage:
      "Implementation agreement and invoice are ready for your review.",
    relevantSopSlug: "sop-implementation-commercial",
    exitCriteria: "Signed + paid per agreement → Implementation Active.",
    nextStageSlug: "won-client",
    isTerminal: false,
    checklist: [
      "Verify PandaDoc signature",
      "Verify Stripe payment per agreement",
      "Do not start build until both complete",
    ],
  },
  {
    name: "Implementation Active",
    slug: "won-client",
    objective: "Execute only approved implementation scope (Stage D).",
    requiredInformation: "Signed/paid implementation gate; approved scope.",
    requiredOwnerAction: "Implement, train, measure; preserve controls; no invented benefits.",
    clientFacingArtifact: "Kickoff / delivery materials",
    suggestedMessage: "Welcome — here is what happens next for implementation.",
    relevantSopSlug: "sop-implementation-active",
    exitCriteria: "Accepted delivery / outcome review complete.",
    nextStageSlug: null,
    isTerminal: true,
    checklist: [
      "Confirm implementation commercial gate",
      "Stay inside approved scope",
      "Outcome review when done",
    ],
  },
  {
    name: "Closed — Lost / Declined",
    slug: "lost",
    objective: "Close out respectfully with a reason (not Blueprint success).",
    requiredInformation: "Loss/decline reason, last touch date.",
    requiredOwnerAction: "Record reason; optional nurture later.",
    clientFacingArtifact: null,
    suggestedMessage: "Thank you for exploring this — door remains open.",
    relevantSopSlug: "sop-lost",
    exitCriteria: "Closed with reason.",
    nextStageSlug: null,
    isTerminal: true,
    checklist: [
      "Record reason (not qualified / declined Blueprint / declined implementation / other)",
      "Do not label successful Blueprint-without-implementation as Lost",
    ],
  },
  {
    name: "Nurture",
    slug: "nurture",
    objective: "Stay in touch until timing improves.",
    requiredInformation: "Nurture cadence, next check-in date.",
    requiredOwnerAction: "Schedule next touchpoint.",
    clientFacingArtifact: null,
    suggestedMessage: "I’ll check back at a better time — here’s a helpful resource.",
    relevantSopSlug: "sop-nurture",
    exitCriteria: "Re-engaged or moved to lost.",
    nextStageSlug: "new-lead",
    isTerminal: false,
    checklist: ["Set nurture next action"],
  },
];

export const BLUEPRINT_FORM_TEMPLATE_SLUG = "business-blueprint-preparation";

/** High-level lifecycle buckets for docs/tests (slugs may map many→one). */
export const LIFECYCLE_ORDER_SLUGS = [
  "new-lead",
  "qualified",
  "agreement-sent",
  "awaiting-payment",
  "blueprint-form-not-sent",
  "blueprint-review-required",
  "proposal-sent",
  "blueprint-complete",
  "implementation-interest",
  "implementation-scoping",
  "implementation-commercial",
  "won-client",
] as const;
