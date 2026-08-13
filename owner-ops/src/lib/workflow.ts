import { prisma } from "./db";
import { recordAudit } from "./audit";
import { NextActionStatus } from "@prisma/client";

export async function transitionOpportunityStage(input: {
  opportunityId: string;
  stageSlug: string;
  actorUserId: string;
  note?: string;
}) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: input.opportunityId },
    include: {
      pipeline: { include: { stages: true } },
      stage: true,
    },
  });
  if (!opportunity) throw new Error("Opportunity not found");

  const next = opportunity.pipeline.stages.find(
    (s) => s.slug === input.stageSlug,
  );
  if (!next) throw new Error("Stage not found");

  const updated = await prisma.$transaction(async (tx) => {
    const row = await tx.opportunity.update({
      where: { id: input.opportunityId },
      data: {
        stageId: next.id,
        lastActivityAt: new Date(),
        status:
          next.slug === "won-client"
            ? "WON"
            : next.slug === "lost"
              ? "LOST"
              : next.slug === "nurture"
                ? "NURTURE"
                : next.slug === "blueprint-complete"
                  ? "OPEN"
                  : opportunity.status === "WON" ||
                      opportunity.status === "LOST" ||
                      opportunity.status === "NURTURE"
                    ? "OPEN"
                    : opportunity.status,
      },
    });

    await tx.activity.create({
      data: {
        type: "stage.changed",
        summary: `Stage moved from ${opportunity.stage.name} to ${next.name}`,
        actorType: "owner",
        opportunityId: input.opportunityId,
        contactId: opportunity.contactId,
        companyId: opportunity.companyId,
        detailsJson: JSON.stringify({
          from: opportunity.stage.slug,
          to: next.slug,
          note: input.note ?? null,
        }),
      },
    });

    if (input.note) {
      await tx.note.create({
        data: {
          body: input.note,
          authorUserId: input.actorUserId,
          opportunityId: input.opportunityId,
          contactId: opportunity.contactId,
          companyId: opportunity.companyId,
        },
      });
    }

    return row;
  });

  await recordAudit({
    action: "stage.changed",
    actorUserId: input.actorUserId,
    entityType: "Opportunity",
    entityId: input.opportunityId,
    details: { to: next.slug },
  });

  return { opportunity: updated, stage: next };
}

export async function createNextAction(input: {
  opportunityId: string;
  title: string;
  description?: string;
  dueAt?: Date | null;
  assigneeId?: string | null;
  source?: string;
  actorUserId?: string;
}) {
  const action = await prisma.nextAction.create({
    data: {
      opportunityId: input.opportunityId,
      title: input.title,
      description: input.description ?? null,
      dueAt: input.dueAt ?? null,
      assigneeId: input.assigneeId ?? null,
      source: input.source ?? "manual",
    },
  });

  await prisma.opportunity.update({
    where: { id: input.opportunityId },
    data: {
      nextActionDueAt: input.dueAt ?? undefined,
      lastActivityAt: new Date(),
    },
  });

  await prisma.activity.create({
    data: {
      type: "next_action.created",
      summary: `Next action: ${input.title}`,
      actorType: "owner",
      opportunityId: input.opportunityId,
    },
  });

  if (input.actorUserId) {
    await recordAudit({
      action: "next_action.created",
      actorUserId: input.actorUserId,
      entityType: "NextAction",
      entityId: action.id,
    });
  }

  return action;
}

export async function completeNextAction(
  actionId: string,
  actorUserId: string,
) {
  const action = await prisma.nextAction.update({
    where: { id: actionId },
    data: {
      status: NextActionStatus.DONE,
      completedAt: new Date(),
    },
  });

  await prisma.activity.create({
    data: {
      type: "next_action.completed",
      summary: `Completed: ${action.title}`,
      actorType: "owner",
      opportunityId: action.opportunityId,
    },
  });

  await recordAudit({
    action: "next_action.completed",
    actorUserId,
    entityType: "NextAction",
    entityId: action.id,
  });

  return action;
}

export async function addNote(input: {
  body: string;
  actorUserId: string;
  opportunityId?: string;
  contactId?: string;
  companyId?: string;
}) {
  const note = await prisma.note.create({
    data: {
      body: input.body,
      authorUserId: input.actorUserId,
      opportunityId: input.opportunityId ?? null,
      contactId: input.contactId ?? null,
      companyId: input.companyId ?? null,
    },
  });

  await prisma.activity.create({
    data: {
      type: "note.added",
      summary: "Note added",
      actorType: "owner",
      opportunityId: input.opportunityId ?? null,
      contactId: input.contactId ?? null,
      companyId: input.companyId ?? null,
    },
  });

  return note;
}

export async function markResponseReviewed(input: {
  responseId: string;
  actorUserId: string;
  internalNotes?: string;
}) {
  const response = await prisma.formResponse.update({
    where: { id: input.responseId },
    data: {
      reviewedAt: new Date(),
      reviewedById: input.actorUserId,
      internalNotes: input.internalNotes ?? undefined,
    },
    include: { invitation: true },
  });

  await prisma.activity.create({
    data: {
      type: "form.reviewed",
      summary: "Blueprint submission marked reviewed",
      actorType: "owner",
      opportunityId: response.invitation.opportunityId,
      contactId: response.invitation.contactId,
      invitationId: response.invitationId,
    },
  });

  await recordAudit({
    action: "form.reviewed",
    actorUserId: input.actorUserId,
    entityType: "FormResponse",
    entityId: response.id,
  });

  return response;
}
