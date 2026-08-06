"use server";

import {
  BlueprintMeetingStatus,
  EvidenceConflictMateriality,
  EvidenceConflictStatus,
  EvidenceFindingCategory,
  EvidenceSourceType,
} from "@prisma/client";
import { requireOwnerSession } from "@/lib/session";
import {
  EvidenceError,
  addEvidenceSource,
  assertSecureAttachmentStorageAvailable,
  createBlueprintMeeting,
  createEvidenceConflict,
  createProposedFinding,
  finalizeEvidenceSource,
  getBlueprintMeeting,
  listBlueprintMeetingsForOpportunity,
  loadUnifiedEvidenceRecord,
  resolveEvidenceConflict,
  reviewFinding,
  supersedeEvidenceSource,
  updateBlueprintMeetingStatus,
  validateTranscriptUpload,
} from "@/lib/blueprint-evidence";
import { calculateBlueprintReadiness } from "@/lib/blueprint-readiness";
import { buildBlueprintReviewPacket } from "@/lib/blueprint-review-packet";
import { prisma } from "@/lib/db";

function errMsg(err: unknown) {
  if (err instanceof EvidenceError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong.";
}

async function owner() {
  return requireOwnerSession({ returnTo: "/ops" });
}

export async function createBlueprintMeetingAction(input: {
  companyId: string;
  opportunityId: string;
  formResponseId?: string;
  title: string;
  meetingDate?: string;
  facilitatorLabel?: string;
  processIds?: string[];
  attendeesJson?: string;
}) {
  const session = await owner();
  try {
    let attendees:
      | Array<{ name: string; role?: string; email?: string; isClient?: boolean }>
      | undefined;
    if (input.attendeesJson?.trim()) {
      attendees = JSON.parse(input.attendeesJson) as typeof attendees;
    }
    const meeting = await createBlueprintMeeting({
      companyId: input.companyId,
      opportunityId: input.opportunityId,
      formResponseId: input.formResponseId,
      title: input.title,
      meetingDate: input.meetingDate ? new Date(input.meetingDate) : null,
      facilitatorLabel: input.facilitatorLabel,
      processIds: input.processIds,
      attendees,
      actorUserId: session.userId,
      actorLabel: session.email,
    });
    return { ok: true as const, meetingId: meeting.id };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function updateMeetingStatusAction(
  meetingId: string,
  companyId: string,
  status: BlueprintMeetingStatus,
) {
  const session = await owner();
  try {
    await updateBlueprintMeetingStatus(meetingId, status, {
      actorUserId: session.userId,
      expectedCompanyId: companyId,
    });
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function addPastedSourceAction(input: {
  companyId: string;
  opportunityId: string;
  meetingId: string;
  sourceType: "BLUEPRINT_TRANSCRIPT" | "CONSULTANT_NOTE" | "CLIENT_NOTE";
  title: string;
  bodyText: string;
  processId?: string;
  isSensitive?: boolean;
  finalize?: boolean;
}) {
  const session = await owner();
  try {
    if (!input.bodyText.trim()) {
      return { ok: false as const, error: "Source body is required" };
    }
    const source = await addEvidenceSource({
      companyId: input.companyId,
      opportunityId: input.opportunityId,
      meetingId: input.meetingId,
      processId: input.processId,
      sourceType: input.sourceType as EvidenceSourceType,
      title: input.title,
      bodyText: input.bodyText,
      authorLabel: session.email,
      isSensitive: input.isSensitive,
      actorUserId: session.userId,
      finalize: input.finalize,
    });
    return { ok: true as const, sourceId: source.id };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function rejectTranscriptUploadAction(input: {
  fileName: string;
  size: number;
  mimeType?: string;
}) {
  await owner();
  const result = validateTranscriptUpload({
    name: input.fileName,
    size: input.size,
    mimeType: input.mimeType,
  });
  if (!result.ok) return { ok: false as const, error: result.reason };
  try {
    assertSecureAttachmentStorageAvailable();
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function finalizeSourceAction(sourceId: string, companyId: string) {
  await owner();
  try {
    await finalizeEvidenceSource(sourceId, companyId);
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function supersedeSourceAction(input: {
  sourceId: string;
  companyId: string;
  bodyText: string;
  title?: string;
}) {
  const session = await owner();
  try {
    const next = await supersedeEvidenceSource(input.sourceId, input.companyId, {
      bodyText: input.bodyText,
      title: input.title,
      actorUserId: session.userId,
    });
    return { ok: true as const, sourceId: next.id };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function createProposedFindingAction(input: {
  sourceId: string;
  companyId: string;
  title: string;
  body?: string;
  category?: EvidenceFindingCategory;
  excerpt?: string;
  sourceLocation?: string;
  processId?: string;
  meetingId?: string;
  opportunityId?: string;
  confidence?: string;
}) {
  await owner();
  try {
    const finding = await createProposedFinding(input);
    return { ok: true as const, findingId: finding.id };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function reviewFindingAction(input: {
  findingId: string;
  companyId: string;
  action:
    | { type: "accept" }
    | { type: "correct_accept"; title: string; body?: string }
    | { type: "reject" }
    | { type: "duplicate"; duplicateOfId: string }
    | { type: "needs_clarification" };
}) {
  const session = await owner();
  try {
    await reviewFinding(
      input.findingId,
      input.companyId,
      input.action,
      session.userId,
    );
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function createConflictAction(input: {
  companyId: string;
  opportunityId?: string;
  meetingId?: string;
  processId?: string;
  subject: string;
  statementA: string;
  statementB: string;
  sourceAId?: string;
  sourceBId?: string;
  explanation?: string;
  materiality?: EvidenceConflictMateriality;
  requiresClientConfirm?: boolean;
}) {
  await owner();
  try {
    const conflict = await createEvidenceConflict(input);
    return { ok: true as const, conflictId: conflict.id };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function resolveConflictAction(input: {
  conflictId: string;
  companyId: string;
  status: EvidenceConflictStatus;
  rationale: string;
  correctedValue?: string;
}) {
  const session = await owner();
  try {
    await resolveEvidenceConflict(input.conflictId, input.companyId, {
      status: input.status,
      rationale: input.rationale,
      correctedValue: input.correctedValue,
      actorUserId: session.userId,
    });
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function loadEvidenceHubAction(opportunityId: string) {
  await owner();
  try {
    const opp = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      select: { id: true, companyId: true },
    });
    if (!opp) return { ok: false as const, error: "Opportunity not found" };
    const [unified, readiness, meetings] = await Promise.all([
      loadUnifiedEvidenceRecord(opportunityId),
      calculateBlueprintReadiness(opportunityId),
      listBlueprintMeetingsForOpportunity(opportunityId),
    ]);
    return {
      ok: true as const,
      companyId: opp.companyId,
      unified,
      readiness,
      meetings,
    };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function getMeetingAction(meetingId: string, companyId: string) {
  await owner();
  try {
    const meeting = await getBlueprintMeeting(meetingId, companyId);
    return { ok: true as const, meeting };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function buildPacketAction(input: {
  opportunityId: string;
  mode: "client" | "internal";
  processIds?: string[];
}) {
  const session = await owner();
  try {
    const packet = await buildBlueprintReviewPacket({
      opportunityId: input.opportunityId,
      mode: input.mode,
      preparedBy: session.email ?? "Owner",
      processIds: input.processIds,
    });
    return { ok: true as const, packet };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}
