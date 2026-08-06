/**
 * Increment 4 — Blueprint meeting + evidence foundation.
 * Proposed findings are never accepted facts until owner review.
 */
import {
  BlueprintMeetingStatus,
  EvidenceConflictMateriality,
  EvidenceConflictStatus,
  EvidenceExtractionMethod,
  EvidenceFindingCategory,
  EvidenceFindingReviewStatus,
  EvidenceSourceStatus,
  EvidenceSourceType,
} from "@prisma/client";
import { prisma } from "./db";
import { recordAudit } from "./audit";

export class EvidenceError extends Error {
  constructor(
    message: string,
    public code:
      | "not_found"
      | "isolation"
      | "immutable"
      | "validation"
      | "conflict"
      | "forbidden" = "validation",
  ) {
    super(message);
    this.name = "EvidenceError";
  }
}

async function assertOpportunityCompany(
  opportunityId: string,
  companyId: string,
) {
  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });
  if (!opp) throw new EvidenceError("Opportunity not found", "not_found");
  if (opp.companyId !== companyId) {
    throw new EvidenceError("Opportunity does not belong to company", "isolation");
  }
  return opp;
}

export async function createBlueprintMeeting(input: {
  companyId: string;
  opportunityId: string;
  formResponseId?: string | null;
  title: string;
  meetingDate?: Date | null;
  facilitatorLabel?: string | null;
  processIds?: string[];
  attendees?: Array<{
    name: string;
    role?: string;
    email?: string;
    isClient?: boolean;
  }>;
  actorUserId?: string;
  actorLabel?: string;
}) {
  await assertOpportunityCompany(input.opportunityId, input.companyId);
  if (input.formResponseId) {
    const fr = await prisma.formResponse.findUnique({
      where: { id: input.formResponseId },
      include: { invitation: { include: { opportunity: true } } },
    });
    if (!fr) throw new EvidenceError("Form response not found", "not_found");
    if (fr.invitation.opportunity.companyId !== input.companyId) {
      throw new EvidenceError("Form response company mismatch", "isolation");
    }
  }
  for (const pid of input.processIds ?? []) {
    const p = await prisma.process.findUnique({ where: { id: pid } });
    if (!p || p.companyId !== input.companyId) {
      throw new EvidenceError("Process not in company", "isolation");
    }
  }

  const meeting = await prisma.$transaction(async (tx) => {
    const created = await tx.blueprintMeeting.create({
      data: {
        companyId: input.companyId,
        opportunityId: input.opportunityId,
        formResponseId: input.formResponseId ?? null,
        title: input.title.trim(),
        meetingDate: input.meetingDate ?? null,
        facilitatorLabel: input.facilitatorLabel ?? null,
        status: BlueprintMeetingStatus.PLANNED,
        createdByUserId: input.actorUserId ?? null,
      },
    });
    for (const a of input.attendees ?? []) {
      await tx.blueprintMeetingAttendee.create({
        data: {
          meetingId: created.id,
          name: a.name.trim(),
          role: a.role ?? null,
          email: a.email ?? null,
          isClient: a.isClient ?? true,
        },
      });
    }
    for (const processId of input.processIds ?? []) {
      await tx.blueprintMeetingProcess.create({
        data: { meetingId: created.id, processId },
      });
    }
    return created;
  });

  await recordAudit({
    action: "blueprint_meeting.created",
    actorUserId: input.actorUserId,
    actorLabel: input.actorLabel ?? "owner",
    entityType: "BlueprintMeeting",
    entityId: meeting.id,
    details: { companyId: input.companyId, opportunityId: input.opportunityId },
  });
  return meeting;
}

export async function getBlueprintMeeting(meetingId: string, companyId?: string) {
  const meeting = await prisma.blueprintMeeting.findUnique({
    where: { id: meetingId },
    include: {
      attendees: true,
      processes: true,
      sources: { orderBy: { createdAt: "asc" } },
      findings: { orderBy: { createdAt: "asc" } },
      conflicts: { orderBy: { createdAt: "asc" } },
      company: { select: { id: true, name: true } },
      opportunity: { select: { id: true, title: true } },
      formResponse: { select: { id: true, status: true, version: true } },
    },
  });
  if (!meeting) throw new EvidenceError("Meeting not found", "not_found");
  if (companyId && meeting.companyId !== companyId) {
    throw new EvidenceError("Cross-company meeting access denied", "isolation");
  }
  return meeting;
}

export async function listBlueprintMeetingsForOpportunity(opportunityId: string) {
  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opp) throw new EvidenceError("Opportunity not found", "not_found");
  return prisma.blueprintMeeting.findMany({
    where: { opportunityId, companyId: opp.companyId },
    orderBy: { createdAt: "desc" },
    include: {
      attendees: true,
      processes: true,
      _count: { select: { sources: true, findings: true, conflicts: true } },
    },
  });
}

export async function updateBlueprintMeetingStatus(
  meetingId: string,
  status: BlueprintMeetingStatus,
  opts?: { actorUserId?: string; expectedCompanyId?: string },
) {
  const meeting = await getBlueprintMeeting(meetingId, opts?.expectedCompanyId);
  return prisma.blueprintMeeting.update({
    where: { id: meeting.id },
    data: { status, updatedByUserId: opts?.actorUserId ?? null },
  });
}

/** Paste transcript/notes. Original body is preserved; finalize locks the source. */
export async function addEvidenceSource(input: {
  companyId: string;
  opportunityId?: string | null;
  formResponseId?: string | null;
  meetingId?: string | null;
  processId?: string | null;
  sourceType: EvidenceSourceType;
  title: string;
  bodyText: string;
  authorLabel?: string | null;
  isSensitive?: boolean;
  actorUserId?: string;
  finalize?: boolean;
}) {
  if (input.meetingId) {
    const m = await getBlueprintMeeting(input.meetingId, input.companyId);
    if (input.opportunityId && m.opportunityId !== input.opportunityId) {
      throw new EvidenceError("Meeting opportunity mismatch", "isolation");
    }
  }
  if (input.processId) {
    const p = await prisma.process.findUnique({ where: { id: input.processId } });
    if (!p || p.companyId !== input.companyId) {
      throw new EvidenceError("Process isolation failed", "isolation");
    }
  }
  const body = input.bodyText;
  const source = await prisma.evidenceSource.create({
    data: {
      companyId: input.companyId,
      opportunityId: input.opportunityId ?? null,
      formResponseId: input.formResponseId ?? null,
      meetingId: input.meetingId ?? null,
      processId: input.processId ?? null,
      sourceType: input.sourceType,
      title: input.title.trim(),
      bodyText: body,
      originalBodyText: body,
      authorLabel: input.authorLabel ?? null,
      isSensitive: Boolean(input.isSensitive),
      createdByUserId: input.actorUserId ?? null,
      status: input.finalize
        ? EvidenceSourceStatus.FINALIZED
        : EvidenceSourceStatus.DRAFT,
      finalizedAt: input.finalize ? new Date() : null,
    },
  });
  return source;
}

export async function finalizeEvidenceSource(
  sourceId: string,
  expectedCompanyId: string,
) {
  const source = await prisma.evidenceSource.findUnique({ where: { id: sourceId } });
  if (!source) throw new EvidenceError("Source not found", "not_found");
  if (source.companyId !== expectedCompanyId) {
    throw new EvidenceError("Cross-company source", "isolation");
  }
  if (source.status === EvidenceSourceStatus.FINALIZED) return source;
  if (source.status === EvidenceSourceStatus.SUPERSEDED) {
    throw new EvidenceError("Superseded source cannot be finalized", "immutable");
  }
  return prisma.evidenceSource.update({
    where: { id: sourceId },
    data: {
      status: EvidenceSourceStatus.FINALIZED,
      finalizedAt: new Date(),
      originalBodyText: source.originalBodyText || source.bodyText,
    },
  });
}

/** Supersede without deleting history — creates a new DRAFT child source. */
export async function supersedeEvidenceSource(
  sourceId: string,
  expectedCompanyId: string,
  patch: { title?: string; bodyText: string; actorUserId?: string },
) {
  const source = await prisma.evidenceSource.findUnique({ where: { id: sourceId } });
  if (!source) throw new EvidenceError("Source not found", "not_found");
  if (source.companyId !== expectedCompanyId) {
    throw new EvidenceError("Cross-company source", "isolation");
  }
  return prisma.$transaction(async (tx) => {
    await tx.evidenceSource.update({
      where: { id: sourceId },
      data: { status: EvidenceSourceStatus.SUPERSEDED },
    });
    return tx.evidenceSource.create({
      data: {
        companyId: source.companyId,
        opportunityId: source.opportunityId,
        formResponseId: source.formResponseId,
        meetingId: source.meetingId,
        processId: source.processId,
        sourceType: source.sourceType,
        title: patch.title?.trim() || source.title,
        bodyText: patch.bodyText,
        originalBodyText: patch.bodyText,
        authorLabel: source.authorLabel,
        version: source.version + 1,
        parentSourceId: source.id,
        createdByUserId: patch.actorUserId ?? null,
        status: EvidenceSourceStatus.DRAFT,
      },
    });
  });
}

export async function createProposedFinding(input: {
  sourceId: string;
  companyId: string;
  title: string;
  body?: string;
  category?: EvidenceFindingCategory;
  excerpt?: string;
  sourceLocation?: string;
  speakerOrAuthor?: string;
  confidence?: string;
  processId?: string | null;
  meetingId?: string | null;
  opportunityId?: string | null;
  extractionMethod?: EvidenceExtractionMethod;
}) {
  const source = await prisma.evidenceSource.findUnique({
    where: { id: input.sourceId },
  });
  if (!source) throw new EvidenceError("Source not found", "not_found");
  if (source.companyId !== input.companyId) {
    throw new EvidenceError("Source company mismatch", "isolation");
  }
  return prisma.evidenceFinding.create({
    data: {
      companyId: input.companyId,
      opportunityId: input.opportunityId ?? source.opportunityId,
      meetingId: input.meetingId ?? source.meetingId,
      processId: input.processId ?? source.processId,
      sourceId: source.id,
      category: input.category ?? EvidenceFindingCategory.OTHER,
      title: input.title.trim(),
      body: input.body ?? "",
      excerpt: input.excerpt ?? null,
      sourceLocation: input.sourceLocation ?? null,
      speakerOrAuthor: input.speakerOrAuthor ?? null,
      confidence: input.confidence ?? null,
      extractionMethod:
        input.extractionMethod ?? EvidenceExtractionMethod.MANUAL_OWNER,
      reviewStatus: EvidenceFindingReviewStatus.PROPOSED,
    },
  });
}

export async function reviewFinding(
  findingId: string,
  expectedCompanyId: string,
  action:
    | { type: "accept" }
    | { type: "correct_accept"; title: string; body?: string }
    | { type: "reject" }
    | { type: "duplicate"; duplicateOfId: string }
    | { type: "needs_clarification" },
  reviewerUserId?: string,
) {
  const finding = await prisma.evidenceFinding.findUnique({
    where: { id: findingId },
  });
  if (!finding) throw new EvidenceError("Finding not found", "not_found");
  if (finding.companyId !== expectedCompanyId) {
    throw new EvidenceError("Cross-company finding", "isolation");
  }
  if (
    finding.reviewStatus === EvidenceFindingReviewStatus.ACCEPTED ||
    finding.reviewStatus === EvidenceFindingReviewStatus.CORRECTED_AND_ACCEPTED
  ) {
    // Allow re-review only into superseded path if needed; keep simple
  }

  const base = {
    reviewedByUserId: reviewerUserId ?? null,
    reviewedAt: new Date(),
  };

  switch (action.type) {
    case "accept":
      return prisma.evidenceFinding.update({
        where: { id: findingId },
        data: { ...base, reviewStatus: EvidenceFindingReviewStatus.ACCEPTED },
      });
    case "correct_accept":
      return prisma.evidenceFinding.update({
        where: { id: findingId },
        data: {
          ...base,
          reviewStatus: EvidenceFindingReviewStatus.CORRECTED_AND_ACCEPTED,
          correctedTitle: action.title.trim(),
          correctedBody: action.body ?? finding.body,
        },
      });
    case "reject":
      return prisma.evidenceFinding.update({
        where: { id: findingId },
        data: { ...base, reviewStatus: EvidenceFindingReviewStatus.REJECTED },
      });
    case "duplicate":
      return prisma.evidenceFinding.update({
        where: { id: findingId },
        data: {
          ...base,
          reviewStatus: EvidenceFindingReviewStatus.DUPLICATE,
          duplicateOfId: action.duplicateOfId,
        },
      });
    case "needs_clarification":
      return prisma.evidenceFinding.update({
        where: { id: findingId },
        data: {
          ...base,
          reviewStatus: EvidenceFindingReviewStatus.NEEDS_CLARIFICATION,
        },
      });
  }
}

export async function createEvidenceConflict(input: {
  companyId: string;
  opportunityId?: string | null;
  meetingId?: string | null;
  processId?: string | null;
  subject: string;
  statementA: string;
  statementB: string;
  sourceAId?: string | null;
  sourceBId?: string | null;
  findingAId?: string | null;
  findingBId?: string | null;
  explanation?: string;
  materiality?: EvidenceConflictMateriality;
  requiresClientConfirm?: boolean;
}) {
  for (const sid of [input.sourceAId, input.sourceBId]) {
    if (!sid) continue;
    const s = await prisma.evidenceSource.findUnique({ where: { id: sid } });
    if (!s || s.companyId !== input.companyId) {
      throw new EvidenceError("Conflict source isolation failed", "isolation");
    }
  }
  for (const fid of [input.findingAId, input.findingBId]) {
    if (!fid) continue;
    const f = await prisma.evidenceFinding.findUnique({ where: { id: fid } });
    if (!f || f.companyId !== input.companyId) {
      throw new EvidenceError("Conflict finding isolation failed", "isolation");
    }
  }
  return prisma.evidenceConflict.create({
    data: {
      companyId: input.companyId,
      opportunityId: input.opportunityId ?? null,
      meetingId: input.meetingId ?? null,
      processId: input.processId ?? null,
      subject: input.subject.trim(),
      statementA: input.statementA,
      statementB: input.statementB,
      sourceAId: input.sourceAId ?? null,
      sourceBId: input.sourceBId ?? null,
      findingAId: input.findingAId ?? null,
      findingBId: input.findingBId ?? null,
      explanation: input.explanation ?? null,
      materiality: input.materiality ?? EvidenceConflictMateriality.MEDIUM,
      requiresClientConfirm: Boolean(input.requiresClientConfirm),
      status: EvidenceConflictStatus.UNRESOLVED,
    },
  });
}

export async function resolveEvidenceConflict(
  conflictId: string,
  expectedCompanyId: string,
  resolution: {
    status: EvidenceConflictStatus;
    rationale: string;
    correctedValue?: string;
    actorUserId?: string;
  },
) {
  const conflict = await prisma.evidenceConflict.findUnique({
    where: { id: conflictId },
  });
  if (!conflict) throw new EvidenceError("Conflict not found", "not_found");
  if (conflict.companyId !== expectedCompanyId) {
    throw new EvidenceError("Cross-company conflict", "isolation");
  }
  if (
    resolution.status === EvidenceConflictStatus.UNRESOLVED ||
    resolution.status === EvidenceConflictStatus.NEEDS_CLIENT_CONFIRMATION
  ) {
    // still allow setting needs confirmation
  }
  return prisma.evidenceConflict.update({
    where: { id: conflictId },
    data: {
      status: resolution.status,
      resolutionRationale: resolution.rationale,
      correctedValue: resolution.correctedValue ?? null,
      resolvedByUserId: resolution.actorUserId ?? null,
      resolvedAt: new Date(),
    },
  });
}

export async function loadUnifiedEvidenceRecord(opportunityId: string) {
  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      company: true,
      formInvitations: {
        include: {
          responses: { orderBy: { version: "desc" }, take: 3 },
        },
      },
      processes: {
        include: {
          versions: {
            orderBy: { versionNumber: "desc" },
            take: 3,
            include: {
              painPoints: true,
              metrics: true,
              opportunities: true,
            },
          },
        },
      },
    },
  });
  if (!opp) throw new EvidenceError("Opportunity not found", "not_found");

  const meetings = await prisma.blueprintMeeting.findMany({
    where: { opportunityId, companyId: opp.companyId },
    include: {
      sources: true,
      findings: true,
      conflicts: true,
      attendees: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const acceptedFindings = meetings.flatMap((m) =>
    m.findings.filter(
      (f) =>
        f.reviewStatus === EvidenceFindingReviewStatus.ACCEPTED ||
        f.reviewStatus === EvidenceFindingReviewStatus.CORRECTED_AND_ACCEPTED,
    ),
  );
  const proposedFindings = meetings.flatMap((m) =>
    m.findings.filter((f) => f.reviewStatus === EvidenceFindingReviewStatus.PROPOSED),
  );
  const rejectedFindings = meetings.flatMap((m) =>
    m.findings.filter((f) => f.reviewStatus === EvidenceFindingReviewStatus.REJECTED),
  );
  const unresolvedConflicts = meetings.flatMap((m) =>
    m.conflicts.filter(
      (c) =>
        c.status === EvidenceConflictStatus.UNRESOLVED ||
        c.status === EvidenceConflictStatus.NEEDS_CLIENT_CONFIRMATION,
    ),
  );

  return {
    opportunity: opp,
    meetings,
    acceptedFindings,
    proposedFindings,
    rejectedFindings,
    unresolvedConflicts,
  };
}

/** Safe pasted-text first. File uploads only when type/size pass; storage deferred if no secure path. */
export const SUPPORTED_TRANSCRIPT_EXTENSIONS = [
  ".txt",
  ".vtt",
  ".srt",
  ".docx",
  ".pdf",
] as const;

export const BLOCKED_UPLOAD_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".ps1",
  ".js",
  ".mjs",
  ".cjs",
  ".dll",
  ".app",
  ".dmg",
  ".pkg",
  ".msi",
] as const;

export const MAX_TRANSCRIPT_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MiB

export function validateTranscriptUpload(file: {
  name: string;
  size: number;
  mimeType?: string | null;
}): { ok: true } | { ok: false; reason: string } {
  const name = file.name.trim();
  if (!name) return { ok: false, reason: "File name required" };
  const lower = name.toLowerCase();
  if (BLOCKED_UPLOAD_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
    return { ok: false, reason: "Executable or script uploads are not allowed" };
  }
  if (!SUPPORTED_TRANSCRIPT_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
    return {
      ok: false,
      reason: `Unsupported file type. Allowed: ${SUPPORTED_TRANSCRIPT_EXTENSIONS.join(", ")}`,
    };
  }
  if (file.size <= 0) return { ok: false, reason: "Empty file" };
  if (file.size > MAX_TRANSCRIPT_UPLOAD_BYTES) {
    return { ok: false, reason: "File exceeds 2 MB limit" };
  }
  const mime = (file.mimeType ?? "").toLowerCase();
  if (
    mime &&
    (mime.includes("javascript") ||
      mime.includes("executable") ||
      mime === "application/x-msdownload")
  ) {
    return { ok: false, reason: "Unsafe MIME type" };
  }
  return { ok: true };
}

/**
 * File upload storage is deferred until a secure attachment path exists.
 * Prefer pasteTranscriptOrNotes via addEvidenceSource.
 */
export function assertSecureAttachmentStorageAvailable(): never {
  throw new EvidenceError(
    "Secure transcript file storage is not configured in this increment. Paste transcript or notes text instead.",
    "forbidden",
  );
}

export {
  BlueprintMeetingStatus,
  EvidenceSourceType,
  EvidenceSourceStatus,
  EvidenceFindingCategory,
  EvidenceFindingReviewStatus,
  EvidenceConflictStatus,
  EvidenceConflictMateriality,
  EvidenceExtractionMethod,
};
