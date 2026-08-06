import {
  createBlueprintMeeting,
  addEvidenceSource,
  createProposedFinding,
  reviewFinding,
  createEvidenceConflict,
  resolveEvidenceConflict,
  validateTranscriptUpload,
  assertSecureAttachmentStorageAvailable,
} from "../../../src/lib/blueprint-evidence";
import { prisma } from "../../../src/lib/db";
import {
  EvidenceConflictStatus,
  EvidenceSourceType,
} from "@prisma/client";

const COMPANY = "cmsfv2vtu0001ituvlhuorbzc";
const OPP = "cmsgg70vx0004itn1ybw2bg0s";
const PROCESS = "cmsgg70w2000aitn13l5jws9a";

const meeting = await createBlueprintMeeting({
  companyId: COMPANY,
  opportunityId: OPP,
  title: "Optimum fictional Blueprint meeting",
  facilitatorLabel: "James Fullen",
  meetingDate: new Date(),
  processIds: [PROCESS],
  attendees: [
    { name: "James Fullen", role: "Facilitator", isClient: false },
    { name: "Casey Demo", role: "Ops lead", isClient: true },
  ],
  actorLabel: "acceptance",
});

const transcript = await addEvidenceSource({
  companyId: COMPANY,
  opportunityId: OPP,
  meetingId: meeting.id,
  processId: PROCESS,
  sourceType: EvidenceSourceType.BLUEPRINT_TRANSCRIPT,
  title: "Fictional Blueprint transcript",
  bodyText: `Facilitator: Thanks for joining.
Casey: Field photo reporting usually takes about six hours on a large remodel.
Casey: Both the project manager and the owner approve photo packages.
Casey: During peak season we do photo reporting daily, not weekly.
Casey: Exception: when the tablet fails onsite, office reprints from email.`,
  authorLabel: "acceptance",
  finalize: true,
});

const notes = await addEvidenceSource({
  companyId: COMPANY,
  opportunityId: OPP,
  meetingId: meeting.id,
  processId: PROCESS,
  sourceType: EvidenceSourceType.CONSULTANT_NOTE,
  title: "Consultant notes — fictional",
  bodyText:
    "Tablet failure exception is undocumented in questionnaire. Time burden likely underestimated vs two-hour questionnaire estimate.",
  authorLabel: "James Fullen",
  finalize: true,
});

await addEvidenceSource({
  companyId: COMPANY,
  opportunityId: OPP,
  meetingId: meeting.id,
  sourceType: EvidenceSourceType.CLIENT_NOTE,
  title: "Client notes — fictional",
  bodyText: "We can discuss peak-season volume on the next call.",
  finalize: true,
});

const f1 = await createProposedFinding({
  sourceId: transcript.id,
  companyId: COMPANY,
  opportunityId: OPP,
  meetingId: meeting.id,
  processId: PROCESS,
  title: "Peak-season daily photo reporting",
  excerpt: "daily, not weekly",
  body: "Frequency differs from questionnaire weekly claim.",
  confidence: "HIGH",
});
const f2 = await createProposedFinding({
  sourceId: transcript.id,
  companyId: COMPANY,
  opportunityId: OPP,
  meetingId: meeting.id,
  processId: PROCESS,
  title: "Six-hour photo burden",
  excerpt: "six hours",
  body: "Large remodel photo reporting ~6 hours.",
  confidence: "MEDIUM",
});
const f3 = await createProposedFinding({
  sourceId: notes.id,
  companyId: COMPANY,
  opportunityId: OPP,
  meetingId: meeting.id,
  title: "Speculative tool replacement",
  body: "Should buy a new platform immediately.",
  confidence: "LOW",
});
const f4 = await createProposedFinding({
  sourceId: transcript.id,
  companyId: COMPANY,
  opportunityId: OPP,
  meetingId: meeting.id,
  title: "Duplicate of peak season",
  body: "Same as peak-season finding",
});
const f5 = await createProposedFinding({
  sourceId: notes.id,
  companyId: COMPANY,
  opportunityId: OPP,
  meetingId: meeting.id,
  title: "Unclear tablet exception volume",
  body: "How often does tablet failure happen?",
});

await reviewFinding(f1.id, COMPANY, { type: "accept" });
await reviewFinding(f2.id, COMPANY, {
  type: "correct_accept",
  title: "Six-hour burden on large remodels (corrected)",
  body: "Corrected wording; original proposal retained on record.",
});
await reviewFinding(f3.id, COMPANY, { type: "reject" });
await reviewFinding(f4.id, COMPANY, { type: "duplicate", duplicateOfId: f1.id });
await reviewFinding(f5.id, COMPANY, { type: "needs_clarification" });

const conflict = await createEvidenceConflict({
  companyId: COMPANY,
  opportunityId: OPP,
  meetingId: meeting.id,
  processId: PROCESS,
  subject: "Photo reporting time estimate",
  statementA: "Questionnaire: about two hours per occurrence",
  statementB: "Transcript: about six hours on large remodels",
  sourceAId: transcript.id,
  sourceBId: notes.id,
  materiality: "HIGH",
  requiresClientConfirm: true,
});

await resolveEvidenceConflict(conflict.id, COMPANY, {
  status: EvidenceConflictStatus.RESOLVED_CORRECTED,
  rationale: "Use 2h typical / 6h large remodel pending client confirmation",
  correctedValue: "2h typical; 6h large remodel",
});

const uploadExe = validateTranscriptUpload({ name: "x.exe", size: 10 });
const uploadOk = validateTranscriptUpload({ name: "notes.txt", size: 100 });
let storageMsg = "";
try {
  assertSecureAttachmentStorageAvailable();
} catch (e) {
  storageMsg = e instanceof Error ? e.message : String(e);
}

const original = await prisma.evidenceSource.findUnique({
  where: { id: transcript.id },
});
console.log(
  JSON.stringify(
    {
      meetingId: meeting.id,
      transcriptId: transcript.id,
      originalBody: original?.originalBodyText?.slice(0, 120),
      status: original?.status,
      uploadExeOk: uploadExe.ok,
      uploadTxtOk: uploadOk.ok,
      storageMsg,
    },
    null,
    2,
  ),
);
await prisma.$disconnect();
