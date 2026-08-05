import { MeetingStatus } from "@prisma/client";
import { prisma } from "./db";
import { recordAudit } from "./audit";

export class WorkflowValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkflowValidationError";
  }
}

const MEETING_STATUSES = new Set<string>([
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

const SERVICE_STATUSES = new Set(["proposed", "accepted", "declined", "deferred"]);

export async function assertOpportunityOwned(opportunityId: string) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });
  if (!opportunity) {
    throw new WorkflowValidationError("Opportunity not found");
  }
  return opportunity;
}

export async function createMeeting(input: {
  opportunityId: string;
  actorUserId: string;
  title: string;
  meetingType?: string;
  scheduledAt?: Date | null;
  status?: MeetingStatus;
  notes?: string | null;
  locationOrUrl?: string | null;
}) {
  const title = input.title.trim();
  if (!title || title.length > 200) {
    throw new WorkflowValidationError("Meeting title is required");
  }
  const opportunity = await assertOpportunityOwned(input.opportunityId);
  const status = input.status ?? MeetingStatus.SCHEDULED;
  if (!MEETING_STATUSES.has(status)) {
    throw new WorkflowValidationError("Invalid meeting status");
  }

  const meeting = await prisma.meeting.create({
    data: {
      title,
      meetingType: (input.meetingType?.trim() || "general").slice(0, 80),
      status,
      scheduledAt: input.scheduledAt ?? null,
      completedAt: status === MeetingStatus.COMPLETED ? new Date() : null,
      notes: input.notes?.trim() || null,
      locationOrUrl: input.locationOrUrl?.trim() || null,
      opportunityId: opportunity.id,
      contactId: opportunity.contactId,
      companyId: opportunity.companyId,
    },
  });

  await prisma.activity.create({
    data: {
      type: "meeting.created",
      summary: `Meeting created: ${meeting.title}`,
      actorType: "owner",
      opportunityId: opportunity.id,
      contactId: opportunity.contactId,
      companyId: opportunity.companyId,
      detailsJson: JSON.stringify({ meetingId: meeting.id, status: meeting.status }),
    },
  });
  await prisma.opportunity.update({
    where: { id: opportunity.id },
    data: { lastActivityAt: new Date() },
  });
  await recordAudit({
    action: "meeting.created",
    actorUserId: input.actorUserId,
    entityType: "Meeting",
    entityId: meeting.id,
    details: { opportunityId: opportunity.id },
  });
  return meeting;
}

export async function updateMeeting(input: {
  meetingId: string;
  actorUserId: string;
  title?: string;
  meetingType?: string;
  scheduledAt?: Date | null;
  status?: MeetingStatus;
  notes?: string | null;
  locationOrUrl?: string | null;
}) {
  const existing = await prisma.meeting.findUnique({
    where: { id: input.meetingId },
  });
  if (!existing?.opportunityId) {
    throw new WorkflowValidationError("Meeting not found");
  }
  await assertOpportunityOwned(existing.opportunityId);

  if (input.status && !MEETING_STATUSES.has(input.status)) {
    throw new WorkflowValidationError("Invalid meeting status");
  }
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title || title.length > 200) {
      throw new WorkflowValidationError("Meeting title is required");
    }
  }

  const status = input.status ?? existing.status;
  const meeting = await prisma.meeting.update({
    where: { id: input.meetingId },
    data: {
      title: input.title !== undefined ? input.title.trim() : undefined,
      meetingType:
        input.meetingType !== undefined
          ? (input.meetingType.trim() || "general").slice(0, 80)
          : undefined,
      scheduledAt:
        input.scheduledAt !== undefined ? input.scheduledAt : undefined,
      status: input.status,
      completedAt:
        status === MeetingStatus.COMPLETED
          ? existing.completedAt ?? new Date()
          : status === MeetingStatus.SCHEDULED
            ? null
            : existing.completedAt,
      notes: input.notes !== undefined ? input.notes?.trim() || null : undefined,
      locationOrUrl:
        input.locationOrUrl !== undefined
          ? input.locationOrUrl?.trim() || null
          : undefined,
    },
  });

  await prisma.activity.create({
    data: {
      type: "meeting.updated",
      summary: `Meeting updated: ${meeting.title} (${meeting.status})`,
      actorType: "owner",
      opportunityId: meeting.opportunityId,
      contactId: meeting.contactId,
      companyId: meeting.companyId,
      detailsJson: JSON.stringify({ meetingId: meeting.id, status: meeting.status }),
    },
  });
  if (meeting.opportunityId) {
    await prisma.opportunity.update({
      where: { id: meeting.opportunityId },
      data: { lastActivityAt: new Date() },
    });
  }
  await recordAudit({
    action: "meeting.updated",
    actorUserId: input.actorUserId,
    entityType: "Meeting",
    entityId: meeting.id,
  });
  return meeting;
}

/** Dollars as integer whole dollars; blank → null; reject negatives. */
export function parseEstimatedValueDollars(
  raw: string | null | undefined,
): number | null {
  if (raw === null || raw === undefined) return null;
  const trimmed = String(raw).trim();
  if (trimmed === "") return null;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    throw new WorkflowValidationError(
      "Estimated value must be a non-negative dollar amount",
    );
  }
  const dollars = Math.round(Number(trimmed));
  if (!Number.isFinite(dollars) || dollars < 0) {
    throw new WorkflowValidationError(
      "Estimated value must be a non-negative dollar amount",
    );
  }
  if (dollars > 100_000_000) {
    throw new WorkflowValidationError("Estimated value is too large");
  }
  return dollars;
}

export async function updateEstimatedValue(input: {
  opportunityId: string;
  actorUserId: string;
  rawValue: string;
}) {
  const opportunity = await assertOpportunityOwned(input.opportunityId);
  const estimatedValue = parseEstimatedValueDollars(input.rawValue);
  const updated = await prisma.opportunity.update({
    where: { id: opportunity.id },
    data: { estimatedValue, lastActivityAt: new Date() },
  });
  await prisma.activity.create({
    data: {
      type: "opportunity.estimated_value_updated",
      summary:
        estimatedValue === null
          ? "Estimated value cleared"
          : `Estimated value set to $${estimatedValue.toLocaleString()}`,
      actorType: "owner",
      opportunityId: opportunity.id,
      contactId: opportunity.contactId,
      companyId: opportunity.companyId,
      detailsJson: JSON.stringify({
        previous: opportunity.estimatedValue,
        next: estimatedValue,
      }),
    },
  });
  await recordAudit({
    action: "opportunity.estimated_value_updated",
    actorUserId: input.actorUserId,
    entityType: "Opportunity",
    entityId: opportunity.id,
    details: { previous: opportunity.estimatedValue, next: estimatedValue },
  });
  return updated;
}

export async function addProposedService(input: {
  opportunityId: string;
  actorUserId: string;
  name: string;
  status?: string;
  notes?: string | null;
}) {
  const name = input.name.trim();
  if (!name || name.length > 200) {
    throw new WorkflowValidationError("Service name is required");
  }
  const status = (input.status ?? "proposed").trim().toLowerCase();
  if (!SERVICE_STATUSES.has(status)) {
    throw new WorkflowValidationError("Invalid service status");
  }
  const opportunity = await assertOpportunityOwned(input.opportunityId);
  const maxSort = await prisma.proposedService.aggregate({
    where: { opportunityId: opportunity.id },
    _max: { sortOrder: true },
  });
  const service = await prisma.proposedService.create({
    data: {
      opportunityId: opportunity.id,
      name,
      status,
      notes: input.notes?.trim() || null,
      sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
    },
  });
  await prisma.activity.create({
    data: {
      type: "proposed_service.added",
      summary: `Proposed service added: ${service.name}`,
      actorType: "owner",
      opportunityId: opportunity.id,
      contactId: opportunity.contactId,
      companyId: opportunity.companyId,
      detailsJson: JSON.stringify({ serviceId: service.id }),
    },
  });
  await prisma.opportunity.update({
    where: { id: opportunity.id },
    data: { lastActivityAt: new Date() },
  });
  await recordAudit({
    action: "proposed_service.added",
    actorUserId: input.actorUserId,
    entityType: "ProposedService",
    entityId: service.id,
  });
  return service;
}

export async function updateProposedService(input: {
  serviceId: string;
  actorUserId: string;
  name?: string;
  status?: string;
  notes?: string | null;
}) {
  const existing = await prisma.proposedService.findUnique({
    where: { id: input.serviceId },
  });
  if (!existing) throw new WorkflowValidationError("Service not found");
  await assertOpportunityOwned(existing.opportunityId);

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name || name.length > 200) {
      throw new WorkflowValidationError("Service name is required");
    }
  }
  let status = input.status;
  if (status !== undefined) {
    status = status.trim().toLowerCase();
    if (!SERVICE_STATUSES.has(status)) {
      throw new WorkflowValidationError("Invalid service status");
    }
  }

  const service = await prisma.proposedService.update({
    where: { id: input.serviceId },
    data: {
      name: input.name !== undefined ? input.name.trim() : undefined,
      status,
      notes: input.notes !== undefined ? input.notes?.trim() || null : undefined,
    },
  });
  await prisma.activity.create({
    data: {
      type: "proposed_service.updated",
      summary: `Proposed service updated: ${service.name}`,
      actorType: "owner",
      opportunityId: service.opportunityId,
      detailsJson: JSON.stringify({ serviceId: service.id, status: service.status }),
    },
  });
  await recordAudit({
    action: "proposed_service.updated",
    actorUserId: input.actorUserId,
    entityType: "ProposedService",
    entityId: service.id,
  });
  return service;
}

export async function deleteProposedService(input: {
  serviceId: string;
  actorUserId: string;
}) {
  const existing = await prisma.proposedService.findUnique({
    where: { id: input.serviceId },
  });
  if (!existing) throw new WorkflowValidationError("Service not found");
  const opportunity = await assertOpportunityOwned(existing.opportunityId);
  await prisma.proposedService.delete({ where: { id: input.serviceId } });
  await prisma.activity.create({
    data: {
      type: "proposed_service.removed",
      summary: `Proposed service removed: ${existing.name}`,
      actorType: "owner",
      opportunityId: opportunity.id,
      contactId: opportunity.contactId,
      companyId: opportunity.companyId,
      detailsJson: JSON.stringify({ serviceId: existing.id }),
    },
  });
  await recordAudit({
    action: "proposed_service.removed",
    actorUserId: input.actorUserId,
    entityType: "ProposedService",
    entityId: existing.id,
  });
}
