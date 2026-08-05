import {
  FormInvitationStatus,
  FormResponseStatus,
  type Prisma,
} from "@prisma/client";
import { prisma } from "./db";
import {
  InvitationError,
  getActiveDraft,
  resolveInvitationByRawToken,
} from "./invitations";
import {
  draftPayloadSchema,
  submitPayloadSchema,
  type BlueprintPayload,
} from "./form-schema";
import { calculateCompletionPct } from "./completion";
import { recordAudit } from "./audit";
import { getEnv } from "./env";
import { getEmailAdapter } from "./mail";

export class ResponseLockedError extends Error {
  constructor(message = "Submitted responses cannot be edited") {
    super(message);
    this.name = "ResponseLockedError";
  }
}

async function moveOpportunityStage(
  opportunityId: string,
  stageSlug: string,
  tx: Prisma.TransactionClient,
) {
  const opportunity = await tx.opportunity.findUnique({
    where: { id: opportunityId },
    include: { pipeline: { include: { stages: true } } },
  });
  if (!opportunity) return;
  const stage = opportunity.pipeline.stages.find((s) => s.slug === stageSlug);
  if (!stage) return;
  await tx.opportunity.update({
    where: { id: opportunityId },
    data: {
      stageId: stage.id,
      lastActivityAt: new Date(),
    },
  });
}

async function syncRelationalFromPayload(
  tx: Prisma.TransactionClient,
  formResponseId: string,
  companyId: string,
  payload: BlueprintPayload,
) {
  await tx.processStep.deleteMany({
    where: { process: { formResponseId } },
  });
  await tx.process.deleteMany({ where: { formResponseId } });
  await tx.companyTool.deleteMany({ where: { formResponseId } });

  for (let i = 0; i < payload.section3.tools.length; i++) {
    const tool = payload.section3.tools[i];
    await tx.companyTool.create({
      data: {
        formResponseId,
        companyId,
        name: tool.name,
        category: tool.category || null,
        usedFor: tool.usedFor || null,
        whoUses: tool.whoUses || null,
        informationHeld: tool.informationHeld || null,
        connectsTo: tool.connectsTo || null,
        worksWell: tool.worksWell || null,
        doesNotWorkWell: tool.doesNotWorkWell || null,
        costOptional: tool.costOptional || null,
        retainDecision: tool.retainDecision || null,
        notes: tool.notes || null,
        sortOrder: i,
      },
    });
  }

  for (let i = 0; i < payload.section4.processes.length; i++) {
    const p = payload.section4.processes[i];
    await tx.process.create({
      data: {
        formResponseId,
        name: p.name,
        category: p.category || null,
        department: p.department || null,
        processOwner: p.processOwner || null,
        peopleInvolved: p.peopleInvolved || null,
        frequency: p.frequency || null,
        estimatedTime: p.estimatedTime || null,
        businessImportance: p.businessImportance || null,
        frustrationLevel: p.frustrationLevel || null,
        errorReworkFrequency: p.errorReworkFrequency || null,
        affectsRevenue: Boolean(p.affectsRevenue),
        affectsCustomerExp: Boolean(p.affectsCustomerExp),
        affectsCost: Boolean(p.affectsCost),
        affectsRisk: Boolean(p.affectsRisk),
        affectsWorkload: Boolean(p.affectsWorkload),
        wantDetailedMap: Boolean(p.wantDetailedMap),
        isDetailedMap: false,
        sortOrder: i,
      },
    });
  }

  for (let i = 0; i < payload.section5.detailedProcesses.length; i++) {
    const p = payload.section5.detailedProcesses[i];
    const process = await tx.process.create({
      data: {
        formResponseId,
        name: p.name,
        processOwner: p.processOwner || null,
        peopleInvolved: p.peopleInvolved || null,
        frequency: p.frequency || null,
        businessObjective: p.businessObjective || null,
        averageVolume: p.averageVolume || null,
        averageCompletionTime: p.averageCompletionTime || null,
        isDetailedMap: true,
        wantDetailedMap: true,
        detailJson: JSON.stringify(p),
        sortOrder: 1000 + i,
      },
    });

    for (let s = 0; s < p.steps.length; s++) {
      const step = p.steps[s];
      await tx.processStep.create({
        data: {
          processId: process.id,
          stepNumber: step.stepNumber || s + 1,
          sortOrder: s,
          responsibleRole: step.responsibleRole || null,
          exactAction: step.exactAction || null,
          toolUsed: step.toolUsed || null,
          informationReceived: step.informationReceived || null,
          informationChanged: step.informationChanged || null,
          outputRecipient: step.outputRecipient || null,
          decisionInvolved: step.decisionInvolved || null,
          expectedTime: step.expectedTime || null,
          waitingTime: step.waitingTime || null,
          notificationSent: step.notificationSent || null,
          completionEvidence: step.completionEvidence || null,
          problems: step.problems || null,
          exceptions: step.exceptions || null,
          workaround: step.workaround || null,
        },
      });
    }
  }
}

export async function saveDraftByToken(
  rawToken: string,
  rawPayload: unknown,
) {
  const invitation = await resolveInvitationByRawToken(rawToken);
  if (invitation.status === FormInvitationStatus.SUBMITTED) {
    throw new ResponseLockedError();
  }

  const parsed = draftPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    throw new InvitationError("Invalid form data", "invalid");
  }

  const completionPct = calculateCompletionPct(parsed.data);
  const draft = getActiveDraft(invitation.responses);
  if (!draft) {
    throw new InvitationError("No editable draft", "invalid");
  }
  if (draft.status !== FormResponseStatus.DRAFT) {
    throw new ResponseLockedError();
  }

  const now = new Date();
  const updated = await prisma.$transaction(async (tx) => {
    const response = await tx.formResponse.update({
      where: { id: draft.id },
      data: {
        payloadJson: JSON.stringify(parsed.data),
        completionPct,
        updatedAt: now,
      },
    });

    await tx.formInvitation.update({
      where: { id: invitation.id },
      data: {
        lastSavedAt: now,
        completionPct,
        status: FormInvitationStatus.IN_PROGRESS,
        firstOpenedAt: invitation.firstOpenedAt ?? now,
      },
    });

    await tx.opportunity.update({
      where: { id: invitation.opportunityId },
      data: {
        formStatus: FormInvitationStatus.IN_PROGRESS,
        lastActivityAt: now,
      },
    });

    await moveOpportunityStage(
      invitation.opportunityId,
      completionPct >= 100 ? "waiting-for-client" : "blueprint-form-started",
      tx,
    );

    await syncRelationalFromPayload(
      tx,
      response.id,
      invitation.opportunity.companyId,
      parsed.data,
    );

    return response;
  });

  return { response: updated, completionPct };
}

export async function submitByToken(rawToken: string, rawPayload: unknown) {
  const invitation = await resolveInvitationByRawToken(rawToken);
  if (invitation.status === FormInvitationStatus.SUBMITTED) {
    throw new ResponseLockedError("Form already submitted");
  }

  const parsed = submitPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Validation failed";
    throw new InvitationError(message, "invalid");
  }

  const draft = getActiveDraft(invitation.responses);
  if (!draft || draft.status !== FormResponseStatus.DRAFT) {
    throw new ResponseLockedError();
  }

  const completionPct = 100;
  const now = new Date();
  const reviewDueDays = getEnv().REVIEW_ACTION_DUE_DAYS;

  const result = await prisma.$transaction(async (tx) => {
    const response = await tx.formResponse.update({
      where: { id: draft.id },
      data: {
        payloadJson: JSON.stringify(parsed.data),
        completionPct,
        status: FormResponseStatus.SUBMITTED,
        submittedAt: now,
      },
    });

    await tx.formInvitation.update({
      where: { id: invitation.id },
      data: {
        status: FormInvitationStatus.SUBMITTED,
        submittedAt: now,
        lastSavedAt: now,
        completionPct,
      },
    });

    await tx.opportunity.update({
      where: { id: invitation.opportunityId },
      data: {
        formStatus: FormInvitationStatus.SUBMITTED,
        lastActivityAt: now,
      },
    });

    await moveOpportunityStage(
      invitation.opportunityId,
      "blueprint-form-submitted",
      tx,
    );

    await syncRelationalFromPayload(
      tx,
      response.id,
      invitation.opportunity.companyId,
      parsed.data,
    );

    // Soft-update contact/company from section 1
    const s1 = parsed.data.section1;
    await tx.contact.update({
      where: { id: invitation.contactId },
      data: {
        firstName: s1.firstName || undefined,
        lastName: s1.lastName || undefined,
        email: s1.email?.toLowerCase() || undefined,
        phone: s1.phone || undefined,
        jobTitle: s1.jobTitle || undefined,
      },
    });
    await tx.company.update({
      where: { id: invitation.opportunity.companyId },
      data: {
        name: s1.companyName || undefined,
        website: s1.companyWebsite || undefined,
        primaryLocation: s1.primaryLocation || undefined,
        serviceAreas: s1.serviceAreas || undefined,
        industry: s1.industry || undefined,
        yearsInBusiness:
          typeof s1.yearsInBusiness === "number" ? s1.yearsInBusiness : undefined,
        employeeCount:
          typeof s1.employeeCount === "number" ? s1.employeeCount : undefined,
        adminEmployeeCount:
          typeof s1.adminEmployeeCount === "number"
            ? s1.adminEmployeeCount
            : undefined,
        customersPerMonth:
          typeof s1.customersPerMonth === "number"
            ? s1.customersPerMonth
            : undefined,
        annualRevenueRange: s1.annualRevenueRange || undefined,
      },
    });

    await tx.activity.create({
      data: {
        type: "form.submitted",
        summary: "Blueprint form submitted",
        actorType: "client",
        opportunityId: invitation.opportunityId,
        contactId: invitation.contactId,
        companyId: invitation.opportunity.companyId,
        invitationId: invitation.id,
        detailsJson: JSON.stringify({ responseVersion: response.version }),
      },
    });

    await tx.nextAction.create({
      data: {
        title: "Review Blueprint submission",
        description: `Review submitted Blueprint form for opportunity ${invitation.opportunityId}`,
        dueAt: new Date(Date.now() + reviewDueDays * 24 * 60 * 60 * 1000),
        opportunityId: invitation.opportunityId,
        source: "form.submitted",
      },
    });

    await moveOpportunityStage(
      invitation.opportunityId,
      "blueprint-review-required",
      tx,
    );

    return response;
  });

  await recordAudit({
    action: "form.submitted",
    actorLabel: "client",
    entityType: "FormResponse",
    entityId: result.id,
    details: {
      invitationId: invitation.id,
      opportunityId: invitation.opportunityId,
      version: result.version,
    },
  });

  const mail = getEmailAdapter();
  await mail.send({
    to: invitation.contact.email,
    subject: "We received your Business Blueprint preparation",
    text: "Thank you. Peacemakers AI received your Business Blueprint Preparation answers. We will review them before your Blueprint discussion.",
    tags: ["blueprint-client-confirmation"],
  });
  await mail.send({
    to: getEnv().OWNER_EMAIL,
    subject: "Blueprint form submitted — review required",
    text: `A Blueprint form was submitted (invitation prefix ${invitation.tokenPrefix}). Open Owner Ops to review.`,
    tags: ["blueprint-owner-notification"],
  });

  return { response: result };
}

/**
 * Explicit reopen: supersede submitted response and create a new draft version.
 */
export async function reopenSubmittedResponse(
  invitationId: string,
  actorUserId: string,
) {
  const invitation = await prisma.formInvitation.findUnique({
    where: { id: invitationId },
    include: { responses: { orderBy: { version: "desc" } } },
  });
  if (!invitation) throw new InvitationError("Not found", "not_found");

  const submitted = invitation.responses.find(
    (r) => r.status === FormResponseStatus.SUBMITTED,
  );
  if (!submitted) {
    throw new InvitationError("No submitted response to reopen", "invalid");
  }

  const nextVersion = (invitation.responses[0]?.version ?? 0) + 1;

  const draft = await prisma.$transaction(async (tx) => {
    await tx.formResponse.update({
      where: { id: submitted.id },
      data: { status: FormResponseStatus.SUPERSEDED },
    });

    const created = await tx.formResponse.create({
      data: {
        invitationId,
        version: nextVersion,
        status: FormResponseStatus.DRAFT,
        payloadJson: submitted.payloadJson,
        completionPct: submitted.completionPct,
      },
    });

    await tx.formInvitation.update({
      where: { id: invitationId },
      data: {
        status: FormInvitationStatus.IN_PROGRESS,
        submittedAt: null,
      },
    });

    await tx.opportunity.update({
      where: { id: invitation.opportunityId },
      data: {
        formStatus: FormInvitationStatus.IN_PROGRESS,
        lastActivityAt: new Date(),
      },
    });

    await tx.activity.create({
      data: {
        type: "form.reopened",
        summary: `Submission reopened as draft v${nextVersion}`,
        actorType: "owner",
        opportunityId: invitation.opportunityId,
        contactId: invitation.contactId,
        invitationId,
        detailsJson: JSON.stringify({
          supersededVersion: submitted.version,
          newVersion: nextVersion,
        }),
      },
    });

    return created;
  });

  await recordAudit({
    action: "form.reopened",
    actorUserId,
    entityType: "FormInvitation",
    entityId: invitationId,
    details: { newVersion: nextVersion },
  });

  return draft;
}
