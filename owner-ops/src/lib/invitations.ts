import {
  FormInvitationStatus,
  FormResponseStatus,
  type FormInvitation,
  type FormResponse,
} from "@prisma/client";
import { prisma } from "./db";
import {
  generateInvitationToken,
  hashToken,
  tokenPrefix,
} from "./crypto";
import { getEnv } from "./env";
import { recordAudit } from "./audit";
import { BLUEPRINT_FORM_TEMPLATE_SLUG } from "./pipeline-seed-data";
import { emptyBlueprintPayload } from "./form-schema";

export class InvitationError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "not_found"
      | "revoked"
      | "expired"
      | "submitted"
      | "invalid",
  ) {
    super(message);
    this.name = "InvitationError";
  }
}

export type CreatedInvitation = {
  invitation: FormInvitation;
  /** Raw token — show once; never store or log. */
  rawToken: string;
  formUrl: string;
};

function formUrlForToken(rawToken: string): string {
  return `${getEnv().APP_BASE_URL.replace(/\/$/, "")}/f/${rawToken}`;
}

export async function createInvitation(input: {
  contactId: string;
  opportunityId: string;
  actorUserId?: string;
  expiresInDays?: number;
}): Promise<CreatedInvitation> {
  const template = await prisma.formTemplate.findUnique({
    where: { slug: BLUEPRINT_FORM_TEMPLATE_SLUG },
  });
  if (!template) throw new Error("Blueprint form template not seeded");

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: input.opportunityId },
  });
  if (!opportunity) throw new InvitationError("Opportunity not found", "invalid");
  if (opportunity.contactId !== input.contactId) {
    throw new InvitationError("Contact does not match opportunity", "invalid");
  }

  const rawToken = generateInvitationToken();
  const days = input.expiresInDays ?? getEnv().FORM_INVITATION_EXPIRY_DAYS;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const invitation = await prisma.$transaction(async (tx) => {
    const inv = await tx.formInvitation.create({
      data: {
        tokenHash: hashToken(rawToken),
        tokenPrefix: tokenPrefix(rawToken),
        formTemplateId: template.id,
        contactId: input.contactId,
        opportunityId: input.opportunityId,
        status: FormInvitationStatus.PENDING,
        expiresAt,
      },
    });

    await tx.formResponse.create({
      data: {
        invitationId: inv.id,
        version: 1,
        status: FormResponseStatus.DRAFT,
        payloadJson: JSON.stringify(emptyBlueprintPayload()),
        completionPct: 0,
      },
    });

    await tx.opportunity.update({
      where: { id: input.opportunityId },
      data: {
        formStatus: FormInvitationStatus.PENDING,
        lastActivityAt: new Date(),
      },
    });

    await tx.activity.create({
      data: {
        type: "form.invitation_created",
        summary: "Blueprint form invitation created",
        actorType: "owner",
        opportunityId: input.opportunityId,
        contactId: input.contactId,
        invitationId: inv.id,
        detailsJson: JSON.stringify({
          tokenPrefix: inv.tokenPrefix,
          expiresAt: expiresAt.toISOString(),
        }),
      },
    });

    const dueAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await tx.nextAction.create({
      data: {
        title: "Follow up if Blueprint form incomplete",
        description: `Check invitation ${inv.tokenPrefix}… if still incomplete.`,
        dueAt,
        opportunityId: input.opportunityId,
        assigneeId: input.actorUserId ?? null,
        source: "form.invitation_created",
      },
    });

    return inv;
  });

  await recordAudit({
    action: "form.invitation_created",
    actorUserId: input.actorUserId,
    entityType: "FormInvitation",
    entityId: invitation.id,
    details: {
      opportunityId: input.opportunityId,
      tokenPrefix: invitation.tokenPrefix,
    },
  });

  return {
    invitation,
    rawToken,
    formUrl: formUrlForToken(rawToken),
  };
}

export async function markInvitationSent(
  invitationId: string,
  actorUserId?: string,
) {
  const invitation = await prisma.formInvitation.update({
    where: { id: invitationId },
    data: { status: FormInvitationStatus.SENT },
  });
  await prisma.opportunity.update({
    where: { id: invitation.opportunityId },
    data: {
      formStatus: FormInvitationStatus.SENT,
      lastActivityAt: new Date(),
    },
  });
  await prisma.activity.create({
    data: {
      type: "form.invitation_sent",
      summary: "Blueprint form invitation marked sent",
      actorType: "owner",
      opportunityId: invitation.opportunityId,
      contactId: invitation.contactId,
      invitationId: invitation.id,
    },
  });
  await recordAudit({
    action: "form.invitation_sent",
    actorUserId,
    entityType: "FormInvitation",
    entityId: invitation.id,
  });
  return invitation;
}

export async function revokeInvitation(
  invitationId: string,
  actorUserId?: string,
) {
  const invitation = await prisma.formInvitation.update({
    where: { id: invitationId },
    data: {
      status: FormInvitationStatus.REVOKED,
      revokedAt: new Date(),
    },
  });
  await prisma.opportunity.update({
    where: { id: invitation.opportunityId },
    data: {
      formStatus: FormInvitationStatus.REVOKED,
      lastActivityAt: new Date(),
    },
  });
  await prisma.activity.create({
    data: {
      type: "form.invitation_revoked",
      summary: "Blueprint form invitation revoked",
      actorType: "owner",
      opportunityId: invitation.opportunityId,
      contactId: invitation.contactId,
      invitationId: invitation.id,
    },
  });
  await recordAudit({
    action: "form.invitation_revoked",
    actorUserId,
    entityType: "FormInvitation",
    entityId: invitation.id,
  });
  return invitation;
}

export async function regenerateInvitation(
  invitationId: string,
  actorUserId?: string,
): Promise<CreatedInvitation> {
  const existing = await prisma.formInvitation.findUnique({
    where: { id: invitationId },
  });
  if (!existing) throw new InvitationError("Invitation not found", "not_found");

  await revokeInvitation(invitationId, actorUserId);
  return createInvitation({
    contactId: existing.contactId,
    opportunityId: existing.opportunityId,
    actorUserId,
  });
}

function assertAccessible(invitation: FormInvitation): void {
  if (invitation.status === FormInvitationStatus.REVOKED || invitation.revokedAt) {
    throw new InvitationError("This form link has been revoked", "revoked");
  }
  if (invitation.expiresAt.getTime() < Date.now()) {
    throw new InvitationError("This form link has expired", "expired");
  }
}

export async function resolveInvitationByRawToken(rawToken: string) {
  if (!rawToken || rawToken.length < 20) {
    throw new InvitationError("Invalid form link", "invalid");
  }
  const invitation = await prisma.formInvitation.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: {
      contact: true,
      opportunity: { include: { company: true, stage: true } },
      formTemplate: true,
      responses: { orderBy: { version: "desc" } },
    },
  });
  if (!invitation) {
    throw new InvitationError("Invalid form link", "not_found");
  }
  assertAccessible(invitation);
  return invitation;
}

export async function recordFormOpened(invitationId: string) {
  const invitation = await prisma.formInvitation.findUnique({
    where: { id: invitationId },
  });
  if (!invitation) return null;
  assertAccessible(invitation);

  const firstOpen = !invitation.firstOpenedAt;
  const nextStatus =
    invitation.status === FormInvitationStatus.SUBMITTED
      ? invitation.status
      : invitation.status === FormInvitationStatus.IN_PROGRESS
        ? FormInvitationStatus.IN_PROGRESS
        : FormInvitationStatus.OPENED;

  const updated = await prisma.formInvitation.update({
    where: { id: invitationId },
    data: {
      firstOpenedAt: invitation.firstOpenedAt ?? new Date(),
      status:
        invitation.status === FormInvitationStatus.SUBMITTED
          ? FormInvitationStatus.SUBMITTED
          : nextStatus,
    },
  });

  if (firstOpen) {
    await prisma.opportunity.update({
      where: { id: invitation.opportunityId },
      data: {
        formStatus: FormInvitationStatus.OPENED,
        lastActivityAt: new Date(),
      },
    });
    await prisma.activity.create({
      data: {
        type: "form.opened",
        summary: "Client opened Blueprint form",
        actorType: "client",
        opportunityId: invitation.opportunityId,
        contactId: invitation.contactId,
        invitationId: invitation.id,
      },
    });
  }

  return updated;
}

export function getActiveDraft(
  responses: FormResponse[],
): FormResponse | null {
  const draft = responses.find((r) => r.status === FormResponseStatus.DRAFT);
  return draft ?? null;
}

export function getLatestSubmitted(
  responses: FormResponse[],
): FormResponse | null {
  return (
    responses.find((r) => r.status === FormResponseStatus.SUBMITTED) ?? null
  );
}
