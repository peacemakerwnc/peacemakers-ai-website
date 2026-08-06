import { prisma } from "./db";
import { recordAudit } from "./audit";
import { captureEvent } from "./monitoring";

export type DeletionPreview = {
  companyId: string;
  companyName: string;
  counts: Record<string, number>;
  dryRun: true;
};

export type DeletionResult = {
  companyId: string;
  companyName: string;
  deleted: Record<string, number>;
  dryRun: false;
};

/**
 * Preview company-scoped deletion for a client deletion request.
 * Does not delete. Owner must confirm before executeCompanyDeletion.
 */
export async function previewCompanyDeletion(
  companyId: string,
): Promise<DeletionPreview> {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new Error("Company not found");

  const [
    opportunities,
    contacts,
    invitations,
    processes,
    meetings,
    files,
    findings,
    conflicts,
  ] = await Promise.all([
    prisma.opportunity.count({ where: { companyId } }),
    prisma.companyContact.count({ where: { companyId } }),
    prisma.formInvitation.count({
      where: { opportunity: { companyId } },
    }),
    prisma.process.count({ where: { companyId } }),
    prisma.blueprintMeeting.count({ where: { companyId } }),
    prisma.fileAttachment.count({ where: { companyId } }),
    prisma.evidenceFinding.count({ where: { companyId } }),
    prisma.evidenceConflict.count({ where: { companyId } }),
  ]);

  return {
    companyId,
    companyName: company.name,
    counts: {
      opportunities,
      companyContacts: contacts,
      invitations,
      processes,
      blueprintMeetings: meetings,
      fileAttachments: files,
      evidenceFindings: findings,
      evidenceConflicts: conflicts,
    },
    dryRun: true,
  };
}

/**
 * Destructive company-scoped deletion. Requires explicit confirmName match.
 * Creates a non-sensitive audit record. Does not purge backups.
 */
export async function executeCompanyDeletion(input: {
  companyId: string;
  confirmName: string;
  actorUserId: string;
  reason: string;
}): Promise<DeletionResult> {
  const preview = await previewCompanyDeletion(input.companyId);
  if (preview.companyName.trim() !== input.confirmName.trim()) {
    throw new Error("Confirmation name does not match company name");
  }

  // Cascade via opportunity → invitation → responses where schema supports it.
  // Delete company last; Prisma relations handle many cascades.
  const opportunities = await prisma.opportunity.findMany({
    where: { companyId: input.companyId },
    select: { id: true },
  });
  const opportunityIds = opportunities.map((o) => o.id);

  await prisma.$transaction(async (tx) => {
    if (opportunityIds.length) {
      await tx.nextAction.deleteMany({
        where: { opportunityId: { in: opportunityIds } },
      });
      await tx.activity.deleteMany({
        where: { opportunityId: { in: opportunityIds } },
      });
      const invitations = await tx.formInvitation.findMany({
        where: { opportunityId: { in: opportunityIds } },
        select: { id: true },
      });
      const invitationIds = invitations.map((i) => i.id);
      if (invitationIds.length) {
        await tx.formResponse.deleteMany({
          where: { invitationId: { in: invitationIds } },
        });
        await tx.formInvitation.deleteMany({
          where: { id: { in: invitationIds } },
        });
      }
      await tx.opportunity.deleteMany({
        where: { id: { in: opportunityIds } },
      });
    }

    await tx.fileAttachment.deleteMany({ where: { companyId: input.companyId } });
    await tx.evidenceConflict.deleteMany({ where: { companyId: input.companyId } });
    await tx.evidenceFinding.deleteMany({ where: { companyId: input.companyId } });
    await tx.evidenceSource.deleteMany({ where: { companyId: input.companyId } });
    await tx.blueprintMeeting.deleteMany({ where: { companyId: input.companyId } });
    await tx.process.deleteMany({ where: { companyId: input.companyId } });
    await tx.companyTool.deleteMany({ where: { companyId: input.companyId } });
    await tx.companyContact.deleteMany({ where: { companyId: input.companyId } });
    await tx.activity.deleteMany({ where: { companyId: input.companyId } });
    await tx.company.delete({ where: { id: input.companyId } });
  });

  await recordAudit({
    action: "privacy.company_deleted",
    actorUserId: input.actorUserId,
    entityType: "Company",
    entityId: input.companyId,
    details: {
      companyName: preview.companyName,
      reason: input.reason.slice(0, 200),
      counts: preview.counts,
    },
  });

  captureEvent({
    type: "privacy.company_deleted",
    level: "warn",
    context: { companyIdPrefix: input.companyId.slice(0, 8) },
  });

  return {
    companyId: input.companyId,
    companyName: preview.companyName,
    deleted: preview.counts,
    dryRun: false,
  };
}
