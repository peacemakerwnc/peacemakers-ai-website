/**
 * Increment 2 — client guided process builder.
 *
 * Architecture (questionnaire ↔ process versions):
 * - FormResponse is the questionnaire draft/submit unit (versioned per invitation).
 * - Process is the durable business-process identity (company/opportunity scoped).
 * - ProcessVersion.formResponseId ties a graph version to the active FormResponse.
 * - Draft save edits ProcessVersion DRAFT rows for that formResponseId.
 * - Form submit freezes FormResponse and submits linked ProcessVersions.
 * - Form reopen supersedes FormResponse, creates a new draft FormResponse, and
 *   reopenAsNewDraft() for each linked submitted ProcessVersion (new draft gets
 *   the new formResponseId). Original ProcessVersions stay immutable.
 * - FormProcess/FormProcessStep remain legacy projections; graph is SoT for paths.
 */
import {
  ProcessAuthorType,
  ProcessConnectionType,
  ProcessExecutionType,
  ProcessParticipantType,
  ProcessResponsibilityType,
  ProcessStepType,
  ProcessVersionClassification,
  ProcessVersionStatus,
  FormInvitationStatus,
  FormResponseStatus,
} from "@prisma/client";
import { prisma } from "./db";
import {
  InvitationError,
  getActiveDraft,
  resolveInvitationByRawToken,
} from "./invitations";
import {
  ProcessGraphError,
  addConnection,
  addParticipant,
  addStep,
  createProcess,
  deleteConnection,
  deleteDraftStep,
  reopenAsNewDraft,
  submitVersion,
  validateGraphIntegrity,
  type StepInput,
} from "./process-graph";

export type ClientSession = {
  token: string;
  invitationId: string;
  formResponseId: string;
  companyId: string;
  opportunityId: string;
  contactId: string;
};

async function requireClientDraft(rawToken: string): Promise<ClientSession> {
  const invitation = await resolveInvitationByRawToken(rawToken);
  if (invitation.status === FormInvitationStatus.SUBMITTED) {
    throw new InvitationError(
      "Submitted responses cannot be edited",
      "invalid",
    );
  }
  const draft = getActiveDraft(invitation.responses);
  if (!draft || draft.status !== FormResponseStatus.DRAFT) {
    throw new InvitationError("No editable draft", "invalid");
  }
  return {
    token: rawToken,
    invitationId: invitation.id,
    formResponseId: draft.id,
    companyId: invitation.opportunity.companyId,
    opportunityId: invitation.opportunityId,
    contactId: invitation.contactId,
  };
}

async function assertVersionOwned(
  session: ClientSession,
  versionId: string,
) {
  const version = await prisma.processVersion.findUnique({
    where: { id: versionId },
    include: { process: true },
  });
  if (!version) throw new ProcessGraphError("Version not found", "not_found");
  if (version.formResponseId !== session.formResponseId) {
    throw new ProcessGraphError(
      "Process does not belong to this questionnaire draft",
      "isolation",
    );
  }
  if (version.process.companyId !== session.companyId) {
    throw new ProcessGraphError("Cross-company access denied", "isolation");
  }
  if (
    version.process.opportunityId &&
    version.process.opportunityId !== session.opportunityId
  ) {
    throw new ProcessGraphError("Cross-opportunity access denied", "isolation");
  }
  if (version.status !== ProcessVersionStatus.DRAFT) {
    throw new ProcessGraphError("Only draft processes can be edited", "immutable");
  }
  return version;
}

export async function listClientProcesses(rawToken: string) {
  const session = await requireClientDraft(rawToken);
  const versions = await prisma.processVersion.findMany({
    where: { formResponseId: session.formResponseId },
    include: {
      process: true,
      steps: { orderBy: { displayOrder: "asc" } },
      connections: true,
      participants: true,
    },
    orderBy: { createdAt: "asc" },
  });
  return { session, versions };
}

export async function listClientProcessesForResponse(formResponseId: string) {
  return prisma.processVersion.findMany({
    where: { formResponseId },
    include: {
      process: true,
      steps: { orderBy: { displayOrder: "asc" } },
      connections: true,
      participants: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function createClientProcess(
  rawToken: string,
  input: {
    name: string;
    purpose?: string;
    customerOutcome?: string;
    startTrigger?: string;
    endEvent?: string;
    processOwner?: string;
  },
) {
  const session = await requireClientDraft(rawToken);
  const name = input.name.trim();
  if (!name) throw new ProcessGraphError("Process name is required", "validation");

  const { process, version } = await createProcess({
    companyId: session.companyId,
    opportunityId: session.opportunityId,
    name,
    purpose: input.purpose ?? null,
    customerOutcome: input.customerOutcome ?? null,
    processOwner: input.processOwner ?? null,
    actorLabel: "client",
  });

  const updated = await prisma.processVersion.update({
    where: { id: version.id },
    data: {
      formResponseId: session.formResponseId,
      authorType: ProcessAuthorType.CLIENT,
      authorLabel: "client",
      startTrigger: input.startTrigger ?? null,
      endEvent: input.endEvent ?? null,
      purpose: input.purpose ?? null,
      outcome: input.customerOutcome ?? null,
      classification: ProcessVersionClassification.AS_IS,
    },
  });

  return { process, version: updated, session };
}

export async function updateClientProcessOverview(
  rawToken: string,
  versionId: string,
  patch: {
    name?: string;
    purpose?: string | null;
    customerOutcome?: string | null;
    startTrigger?: string | null;
    endEvent?: string | null;
    processOwner?: string | null;
  },
) {
  const session = await requireClientDraft(rawToken);
  const version = await assertVersionOwned(session, versionId);

  if (patch.name !== undefined) {
    await prisma.process.update({
      where: { id: version.processId },
      data: {
        name: patch.name.trim(),
        purpose: patch.purpose !== undefined ? patch.purpose : undefined,
        customerOutcome:
          patch.customerOutcome !== undefined
            ? patch.customerOutcome
            : undefined,
        processOwner:
          patch.processOwner !== undefined ? patch.processOwner : undefined,
      },
    });
  } else {
    await prisma.process.update({
      where: { id: version.processId },
      data: {
        ...(patch.purpose !== undefined ? { purpose: patch.purpose } : {}),
        ...(patch.customerOutcome !== undefined
          ? { customerOutcome: patch.customerOutcome }
          : {}),
        ...(patch.processOwner !== undefined
          ? { processOwner: patch.processOwner }
          : {}),
      },
    });
  }

  return prisma.processVersion.update({
    where: { id: versionId },
    data: {
      ...(patch.purpose !== undefined ? { purpose: patch.purpose } : {}),
      ...(patch.customerOutcome !== undefined
        ? { outcome: patch.customerOutcome }
        : {}),
      ...(patch.startTrigger !== undefined
        ? { startTrigger: patch.startTrigger }
        : {}),
      ...(patch.endEvent !== undefined ? { endEvent: patch.endEvent } : {}),
    },
  });
}

export async function addClientParticipant(
  rawToken: string,
  versionId: string,
  input: {
    role?: string;
    personLabel?: string;
    department?: string;
    participantType?: ProcessParticipantType;
    processStepId?: string | null;
  },
) {
  const session = await requireClientDraft(rawToken);
  await assertVersionOwned(session, versionId);
  return addParticipant({
    processVersionId: versionId,
    processStepId: input.processStepId ?? null,
    participantType: input.participantType ?? ProcessParticipantType.ROLE,
    role: input.role ?? null,
    personLabel: input.personLabel ?? null,
    department: input.department ?? null,
    responsibilityType: ProcessResponsibilityType.RESPONSIBLE,
    expectedCompanyId: session.companyId,
  });
}

export async function addClientStep(
  rawToken: string,
  versionId: string,
  input: StepInput & {
    afterStepId?: string | null;
    connectFromPrevious?: boolean;
    discussDuringBlueprint?: boolean;
  },
) {
  const session = await requireClientDraft(rawToken);
  await assertVersionOwned(session, versionId);

  let displayOrder = input.displayOrder;
  if (input.afterStepId) {
    const after = await prisma.processStep.findUnique({
      where: { id: input.afterStepId },
    });
    if (!after || after.processVersionId !== versionId) {
      throw new ProcessGraphError("Anchor step not found", "not_found");
    }
    displayOrder = after.displayOrder + 1;
    await prisma.processStep.updateMany({
      where: {
        processVersionId: versionId,
        displayOrder: { gte: displayOrder },
      },
      data: { displayOrder: { increment: 1 } },
    });
  }

  const step = await addStep(versionId, {
    ...input,
    displayOrder,
  });

  if (input.discussDuringBlueprint) {
    await prisma.processStep.update({
      where: { id: step.id },
      data: { discussDuringBlueprint: true },
    });
  }

  if (input.connectFromPrevious && input.afterStepId) {
    await addConnection(versionId, {
      sourceStepId: input.afterStepId,
      targetStepId: step.id,
      connectionType: ProcessConnectionType.NORMAL,
      displayLabel: "What happens next",
      isDefaultPath: true,
    });
  }

  return prisma.processStep.findUniqueOrThrow({ where: { id: step.id } });
}

export async function updateClientStep(
  rawToken: string,
  stepId: string,
  patch: Partial<StepInput> & { discussDuringBlueprint?: boolean },
) {
  const session = await requireClientDraft(rawToken);
  const step = await prisma.processStep.findUnique({
    where: { id: stepId },
  });
  if (!step) throw new ProcessGraphError("Step not found", "not_found");
  await assertVersionOwned(session, step.processVersionId);

  const data: Record<string, unknown> = {};
  const map: Array<[keyof typeof patch, string]> = [
    ["shortName", "shortName"],
    ["stepType", "stepType"],
    ["displayOrder", "displayOrder"],
    ["detailedDescription", "detailedDescription"],
    ["responsibleRole", "responsibleRole"],
    ["responsiblePerson", "responsiblePerson"],
    ["department", "department"],
    ["executionType", "executionType"],
    ["toolOrSystem", "toolOrSystem"],
    ["requiredInputs", "requiredInputs"],
    ["dataReceived", "dataReceived"],
    ["informationHandled", "informationHandled"],
    ["outputProduced", "outputProduced"],
    ["outputRecipient", "outputRecipient"],
    ["expectedWorkTime", "expectedWorkTime"],
    ["typicalWaitingTime", "typicalWaitingTime"],
    ["deadline", "deadline"],
    ["serviceExpectation", "serviceExpectation"],
    ["notification", "notification"],
    ["evidenceOfCompletion", "evidenceOfCompletion"],
    ["problems", "problems"],
    ["workarounds", "workarounds"],
    ["internalNotes", "internalNotes"],
    ["clientNotes", "clientNotes"],
    ["unresolvedQuestions", "unresolvedQuestions"],
    ["discussDuringBlueprint", "discussDuringBlueprint"],
  ];
  for (const [from, to] of map) {
    if (patch[from] !== undefined) {
      data[to] =
        from === "shortName" && typeof patch[from] === "string"
          ? String(patch[from]).trim()
          : patch[from];
    }
  }
  return prisma.processStep.update({ where: { id: stepId }, data });
}

export async function duplicateClientStep(rawToken: string, stepId: string) {
  const session = await requireClientDraft(rawToken);
  const step = await prisma.processStep.findUnique({ where: { id: stepId } });
  if (!step) throw new ProcessGraphError("Step not found", "not_found");
  await assertVersionOwned(session, step.processVersionId);

  await prisma.processStep.updateMany({
    where: {
      processVersionId: step.processVersionId,
      displayOrder: { gt: step.displayOrder },
    },
    data: { displayOrder: { increment: 1 } },
  });

  return addStep(step.processVersionId, {
    shortName: `${step.shortName} (copy)`,
    stepType: step.stepType,
    displayOrder: step.displayOrder + 1,
    detailedDescription: step.detailedDescription,
    responsibleRole: step.responsibleRole,
    responsiblePerson: step.responsiblePerson,
    department: step.department,
    executionType: step.executionType,
    toolOrSystem: step.toolOrSystem,
    requiredInputs: step.requiredInputs,
    dataReceived: step.dataReceived,
    informationHandled: step.informationHandled,
    outputProduced: step.outputProduced,
    outputRecipient: step.outputRecipient,
    expectedWorkTime: step.expectedWorkTime,
    typicalWaitingTime: step.typicalWaitingTime,
    discussDuringBlueprint: step.discussDuringBlueprint,
  } as StepInput & { discussDuringBlueprint?: boolean }).then(async (created) => {
    if (step.discussDuringBlueprint) {
      await prisma.processStep.update({
        where: { id: created.id },
        data: { discussDuringBlueprint: true },
      });
    }
    return created;
  });
}

export async function reorderClientSteps(
  rawToken: string,
  versionId: string,
  orderedStepIds: string[],
) {
  const session = await requireClientDraft(rawToken);
  await assertVersionOwned(session, versionId);
  const steps = await prisma.processStep.findMany({
    where: { processVersionId: versionId },
  });
  if (steps.length !== orderedStepIds.length) {
    throw new ProcessGraphError("Reorder list incomplete", "validation");
  }
  const idSet = new Set(steps.map((s) => s.id));
  for (const id of orderedStepIds) {
    if (!idSet.has(id)) {
      throw new ProcessGraphError("Unknown step in reorder", "validation");
    }
  }
  await prisma.$transaction(
    orderedStepIds.map((id, index) =>
      prisma.processStep.update({
        where: { id },
        data: { displayOrder: index },
      }),
    ),
  );
  return prisma.processStep.findMany({
    where: { processVersionId: versionId },
    orderBy: { displayOrder: "asc" },
  });
}

export async function deleteClientStep(
  rawToken: string,
  stepId: string,
  opts?: { cleanupConnections?: boolean },
) {
  const session = await requireClientDraft(rawToken);
  const step = await prisma.processStep.findUnique({ where: { id: stepId } });
  if (!step) throw new ProcessGraphError("Step not found", "not_found");
  await assertVersionOwned(session, step.processVersionId);
  return deleteDraftStep(stepId, {
    cleanupConnections: opts?.cleanupConnections,
    expectedCompanyId: session.companyId,
  });
}

export async function connectNextStep(
  rawToken: string,
  versionId: string,
  sourceStepId: string,
  targetStepId: string,
  label?: string,
) {
  const session = await requireClientDraft(rawToken);
  await assertVersionOwned(session, versionId);
  return addConnection(versionId, {
    sourceStepId,
    targetStepId,
    connectionType: ProcessConnectionType.NORMAL,
    displayLabel: label ?? "What happens next",
    isDefaultPath: true,
  });
}

export async function addClientPath(
  rawToken: string,
  versionId: string,
  input: {
    sourceStepId: string;
    targetStepId: string;
    connectionType: ProcessConnectionType;
    displayLabel?: string;
    condition?: string;
    isDefaultPath?: boolean;
  },
) {
  const session = await requireClientDraft(rawToken);
  await assertVersionOwned(session, versionId);
  return addConnection(versionId, input);
}

export async function removeClientPath(rawToken: string, connectionId: string) {
  const session = await requireClientDraft(rawToken);
  const conn = await prisma.processConnection.findUnique({
    where: { id: connectionId },
  });
  if (!conn) throw new ProcessGraphError("Path not found", "not_found");
  await assertVersionOwned(session, conn.processVersionId);
  await deleteConnection(connectionId, { expectedCompanyId: session.companyId });
}

export type CompletenessItem = {
  code: string;
  label: string;
  level: "required" | "recommended" | "optional" | "discuss";
  ok: boolean;
};

export async function evaluateClientProcessCompleteness(versionId: string) {
  const version = await prisma.processVersion.findUnique({
    where: { id: versionId },
    include: {
      process: true,
      steps: true,
      connections: true,
      participants: true,
    },
  });
  if (!version) throw new ProcessGraphError("Version not found", "not_found");

  const validation = await validateGraphIntegrity(versionId);
  const items: CompletenessItem[] = [];

  const hasName = Boolean(version.process.name?.trim());
  const hasPurpose = Boolean(version.purpose?.trim() || version.process.purpose?.trim());
  const hasTrigger = Boolean(version.startTrigger?.trim());
  const hasEnd = Boolean(version.endEvent?.trim() || version.outcome?.trim());
  const hasParticipant =
    version.participants.length > 0 ||
    version.steps.some((s) => Boolean(s.responsibleRole?.trim()));
  const hasStep = version.steps.length > 0;
  const hasNormalPath = version.connections.some(
    (c) => c.connectionType === ProcessConnectionType.NORMAL,
  );

  items.push(
    { code: "name", label: "Process name", level: "required", ok: hasName },
    { code: "purpose", label: "Why this process exists", level: "required", ok: hasPurpose },
    { code: "trigger", label: "What starts it", level: "required", ok: hasTrigger },
    { code: "end", label: "What successful completion looks like", level: "required", ok: hasEnd },
    { code: "participant", label: "At least one person or role", level: "required", ok: hasParticipant },
    { code: "step", label: "At least one step", level: "required", ok: hasStep },
    {
      code: "main_path",
      label: "Main path connected (what happens next)",
      level: "required",
      ok: version.steps.length <= 1 || hasNormalPath,
    },
    {
      code: "graph_valid",
      label: "Process structure is valid",
      level: "required",
      ok: validation.ok,
    },
  );

  const decisions = version.steps.filter((s) => s.stepType === ProcessStepType.DECISION);
  for (const d of decisions) {
    const outs = version.connections.filter((c) => c.sourceStepId === d.id);
    items.push({
      code: `decision_${d.id}`,
      label: `Decision “${d.shortName}” has outcomes`,
      level: "required",
      ok: outs.length >= 2,
    });
  }

  const approvals = version.steps.filter((s) => s.stepType === ProcessStepType.APPROVAL);
  for (const a of approvals) {
    const outs = version.connections.filter((c) => c.sourceStepId === a.id);
    const hasApproved = outs.some((c) => c.connectionType === ProcessConnectionType.APPROVED);
    const hasRejected = outs.some(
      (c) =>
        c.connectionType === ProcessConnectionType.REJECTED ||
        c.connectionType === ProcessConnectionType.RETURNED_FOR_CORRECTION,
    );
    items.push({
      code: `approval_${a.id}`,
      label: `Approval “${a.shortName}” has approved and rejected paths`,
      level: "required",
      ok: hasApproved && hasRejected,
    });
  }

  const discuss = version.steps.filter((s) => s.discussDuringBlueprint);
  items.push({
    code: "discuss",
    label: "Items marked to discuss during Blueprint call",
    level: "discuss",
    ok: discuss.length > 0,
  });

  items.push({
    code: "tools",
    label: "Tools noted on steps",
    level: "recommended",
    ok: version.steps.some((s) => Boolean(s.toolOrSystem?.trim())),
  });

  const required = items.filter((i) => i.level === "required");
  const requiredOk = required.every((i) => i.ok);
  const pct = required.length
    ? Math.round((required.filter((i) => i.ok).length / required.length) * 100)
    : 0;

  return {
    items,
    validation,
    requiredOk: requiredOk && validation.ok,
    /** Never report 100 if graph invalid */
    scorePct: validation.ok ? pct : Math.min(pct, 99),
    discussCount: discuss.length,
  };
}

/**
 * Freeze all DRAFT process versions linked to a form response (called on form submit).
 */
export async function freezeProcessVersionsForResponse(formResponseId: string) {
  const drafts = await prisma.processVersion.findMany({
    where: { formResponseId, status: ProcessVersionStatus.DRAFT },
  });
  if (!drafts.length) {
    throw new ProcessGraphError(
      "Add at least one process under Your Processes before submitting",
      "validation",
    );
  }
  for (const d of drafts) {
    const completeness = await evaluateClientProcessCompleteness(d.id);
    if (!completeness.requiredOk) {
      const missing = completeness.items
        .filter((i) => i.level === "required" && !i.ok)
        .map((i) => i.label)
        .join("; ");
      throw new ProcessGraphError(
        `Process “${d.versionLabel ?? d.id}” is incomplete: ${missing}`,
        "validation",
      );
    }
    await submitVersion(d.id, { actorLabel: "client" });
  }
  return drafts.length;
}

/**
 * After form reopen: fork submitted process versions into new drafts for the new FormResponse.
 */
export async function forkProcessVersionsForReopen(
  oldFormResponseId: string,
  newFormResponseId: string,
) {
  const sources = await prisma.processVersion.findMany({
    where: {
      formResponseId: oldFormResponseId,
      status: {
        in: [ProcessVersionStatus.SUBMITTED, ProcessVersionStatus.APPROVED],
      },
    },
  });
  const created = [];
  for (const src of sources) {
    const draft = await reopenAsNewDraft(src.id, { actorLabel: "client" });
    const updated = await prisma.processVersion.update({
      where: { id: draft.id },
      data: {
        formResponseId: newFormResponseId,
        authorType: ProcessAuthorType.CLIENT,
        authorLabel: "client",
      },
    });
    created.push(updated);
  }
  return created;
}

export async function countProcessesForResponse(formResponseId: string) {
  return prisma.processVersion.count({ where: { formResponseId } });
}

export {
  ProcessStepType,
  ProcessConnectionType,
  ProcessExecutionType,
  ProcessParticipantType,
};
