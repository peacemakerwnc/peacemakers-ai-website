import {
  ProcessApprovalStatus,
  ProcessApprovalType,
  ProcessAuthorType,
  ProcessConnectionType,
  ProcessExecutionType,
  ProcessParticipantType,
  ProcessResponsibilityType,
  ProcessStepType,
  ProcessVersionClassification,
  ProcessVersionStatus,
  type Prisma,
  type ProcessConnection,
  type ProcessStep,
  type ProcessVersion,
} from "@prisma/client";
import { prisma } from "./db";
import { recordAudit } from "./audit";

export class ProcessGraphError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "not_found"
      | "immutable"
      | "validation"
      | "isolation"
      | "conflict" = "validation",
  ) {
    super(message);
    this.name = "ProcessGraphError";
  }
}

const IMMUTABLE: ProcessVersionStatus[] = [
  ProcessVersionStatus.SUBMITTED,
  ProcessVersionStatus.APPROVED,
  ProcessVersionStatus.SUPERSEDED,
];

const DECISION_LIKE: ProcessStepType[] = [
  ProcessStepType.DECISION,
  ProcessStepType.APPROVAL,
];

const BRANCH_TYPES: ProcessConnectionType[] = [
  ProcessConnectionType.APPROVED,
  ProcessConnectionType.REJECTED,
  ProcessConnectionType.RETURNED_FOR_CORRECTION,
];

type Tx = Prisma.TransactionClient;

export type GraphValidationIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export type GraphValidationResult = {
  ok: boolean;
  issues: GraphValidationIssue[];
};

function assertEditable(version: { status: ProcessVersionStatus }) {
  if (IMMUTABLE.includes(version.status)) {
    throw new ProcessGraphError(
      `Version status ${version.status} is immutable`,
      "immutable",
    );
  }
}

async function loadVersion(tx: Tx, versionId: string) {
  const version = await tx.processVersion.findUnique({
    where: { id: versionId },
    include: { process: true },
  });
  if (!version) throw new ProcessGraphError("Version not found", "not_found");
  return version;
}

async function assertCompanyAccess(
  companyId: string,
  expectedCompanyId: string,
) {
  if (companyId !== expectedCompanyId) {
    throw new ProcessGraphError(
      "Cross-company process access denied",
      "isolation",
    );
  }
}

export async function createProcess(input: {
  companyId: string;
  opportunityId?: string | null;
  name: string;
  purpose?: string | null;
  customerOutcome?: string | null;
  processOwner?: string | null;
  actorUserId?: string | null;
  actorLabel?: string | null;
}) {
  const company = await prisma.company.findUnique({
    where: { id: input.companyId },
  });
  if (!company) throw new ProcessGraphError("Company not found", "not_found");

  if (input.opportunityId) {
    const opp = await prisma.opportunity.findUnique({
      where: { id: input.opportunityId },
    });
    if (!opp) throw new ProcessGraphError("Opportunity not found", "not_found");
    if (opp.companyId !== input.companyId) {
      throw new ProcessGraphError(
        "Opportunity does not belong to company",
        "isolation",
      );
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const process = await tx.process.create({
      data: {
        companyId: input.companyId,
        opportunityId: input.opportunityId ?? null,
        name: input.name.trim(),
        purpose: input.purpose ?? null,
        customerOutcome: input.customerOutcome ?? null,
        processOwner: input.processOwner ?? null,
      },
    });
    const version = await tx.processVersion.create({
      data: {
        processId: process.id,
        versionNumber: 1,
        versionLabel: "v1 draft",
        classification: ProcessVersionClassification.AS_IS,
        status: ProcessVersionStatus.DRAFT,
        authorType: ProcessAuthorType.OWNER,
        authorUserId: input.actorUserId ?? null,
        authorLabel: input.actorLabel ?? null,
        purpose: input.purpose ?? null,
        outcome: input.customerOutcome ?? null,
      },
    });
    const updated = await tx.process.update({
      where: { id: process.id },
      data: { currentDraftVersionId: version.id },
    });
    return { process: updated, version };
  });
  await recordAudit({
    action: "process.created",
    actorUserId: input.actorUserId ?? undefined,
    actorLabel: input.actorLabel ?? undefined,
    entityType: "Process",
    entityId: result.process.id,
    details: { versionId: result.version.id, companyId: input.companyId },
  });
  return result;
}

export async function createInitialDraftVersion(
  processId: string,
  opts?: {
    classification?: ProcessVersionClassification;
    actorUserId?: string | null;
    actorLabel?: string | null;
  },
) {
  const process = await prisma.process.findUnique({ where: { id: processId } });
  if (!process) throw new ProcessGraphError("Process not found", "not_found");

  const max = await prisma.processVersion.aggregate({
    where: { processId },
    _max: { versionNumber: true },
  });
  const nextNum = (max._max.versionNumber ?? 0) + 1;

  const version = await prisma.processVersion.create({
    data: {
      processId,
      versionNumber: nextNum,
      versionLabel: `v${nextNum} draft`,
      classification:
        opts?.classification ?? ProcessVersionClassification.AS_IS,
      status: ProcessVersionStatus.DRAFT,
      authorType: ProcessAuthorType.OWNER,
      authorUserId: opts?.actorUserId ?? null,
      authorLabel: opts?.actorLabel ?? null,
    },
  });
  await prisma.process.update({
    where: { id: processId },
    data: { currentDraftVersionId: version.id },
  });
  return version;
}

export type StepInput = {
  shortName: string;
  stepType: ProcessStepType;
  displayOrder?: number;
  detailedDescription?: string | null;
  responsibleRole?: string | null;
  responsiblePerson?: string | null;
  department?: string | null;
  executionType?: ProcessExecutionType;
  toolOrSystem?: string | null;
  requiredInputs?: string | null;
  dataReceived?: string | null;
  informationHandled?: string | null;
  outputProduced?: string | null;
  outputRecipient?: string | null;
  expectedWorkTime?: string | null;
  typicalWaitingTime?: string | null;
  deadline?: string | null;
  serviceExpectation?: string | null;
  notification?: string | null;
  evidenceOfCompletion?: string | null;
  problems?: string | null;
  workarounds?: string | null;
  valueClassification?: string | null;
  automationSuitability?: string | null;
  internalNotes?: string | null;
  clientNotes?: string | null;
  unresolvedQuestions?: string | null;
  completenessStatus?: string | null;
  confidenceStatus?: string | null;
  canvasX?: number | null;
  canvasY?: number | null;
  swimlaneId?: string | null;
  sourceStepId?: string | null;
  discussDuringBlueprint?: boolean;
};

export async function addStep(versionId: string, input: StepInput) {
  const version = await loadVersion(prisma, versionId);
  assertEditable(version);
  if (!Object.values(ProcessStepType).includes(input.stepType)) {
    throw new ProcessGraphError("Unsupported step type", "validation");
  }
  const count = await prisma.processStep.count({
    where: { processVersionId: versionId },
  });
  return prisma.processStep.create({
    data: {
      processVersionId: versionId,
      shortName: input.shortName.trim(),
      stepType: input.stepType,
      displayOrder: input.displayOrder ?? count,
      detailedDescription: input.detailedDescription ?? null,
      responsibleRole: input.responsibleRole ?? null,
      responsiblePerson: input.responsiblePerson ?? null,
      department: input.department ?? null,
      executionType: input.executionType ?? ProcessExecutionType.HUMAN,
      toolOrSystem: input.toolOrSystem ?? null,
      requiredInputs: input.requiredInputs ?? null,
      dataReceived: input.dataReceived ?? null,
      informationHandled: input.informationHandled ?? null,
      outputProduced: input.outputProduced ?? null,
      outputRecipient: input.outputRecipient ?? null,
      expectedWorkTime: input.expectedWorkTime ?? null,
      typicalWaitingTime: input.typicalWaitingTime ?? null,
      deadline: input.deadline ?? null,
      serviceExpectation: input.serviceExpectation ?? null,
      notification: input.notification ?? null,
      evidenceOfCompletion: input.evidenceOfCompletion ?? null,
      problems: input.problems ?? null,
      workarounds: input.workarounds ?? null,
      valueClassification: input.valueClassification ?? null,
      automationSuitability: input.automationSuitability ?? null,
      internalNotes: input.internalNotes ?? null,
      clientNotes: input.clientNotes ?? null,
      unresolvedQuestions: input.unresolvedQuestions ?? null,
      completenessStatus: input.completenessStatus ?? null,
      confidenceStatus: input.confidenceStatus ?? null,
      canvasX: input.canvasX ?? null,
      canvasY: input.canvasY ?? null,
      swimlaneId: input.swimlaneId ?? null,
      sourceStepId: input.sourceStepId ?? null,
      discussDuringBlueprint: input.discussDuringBlueprint ?? false,
    },
  });
}

export async function updateDraftStep(
  stepId: string,
  patch: Partial<StepInput>,
  opts?: { expectedCompanyId?: string },
) {
  const step = await prisma.processStep.findUnique({
    where: { id: stepId },
    include: { processVersion: { include: { process: true } } },
  });
  if (!step) throw new ProcessGraphError("Step not found", "not_found");
  if (opts?.expectedCompanyId) {
    await assertCompanyAccess(
      step.processVersion.process.companyId,
      opts.expectedCompanyId,
    );
  }
  assertEditable(step.processVersion);
  return prisma.processStep.update({
    where: { id: stepId },
    data: {
      ...(patch.shortName !== undefined
        ? { shortName: patch.shortName.trim() }
        : {}),
      ...(patch.stepType !== undefined ? { stepType: patch.stepType } : {}),
      ...(patch.displayOrder !== undefined
        ? { displayOrder: patch.displayOrder }
        : {}),
      ...(patch.detailedDescription !== undefined
        ? { detailedDescription: patch.detailedDescription }
        : {}),
      ...(patch.responsibleRole !== undefined
        ? { responsibleRole: patch.responsibleRole }
        : {}),
      ...(patch.responsiblePerson !== undefined
        ? { responsiblePerson: patch.responsiblePerson }
        : {}),
      ...(patch.department !== undefined
        ? { department: patch.department }
        : {}),
      ...(patch.executionType !== undefined
        ? { executionType: patch.executionType }
        : {}),
      ...(patch.toolOrSystem !== undefined
        ? { toolOrSystem: patch.toolOrSystem }
        : {}),
      ...(patch.canvasX !== undefined ? { canvasX: patch.canvasX } : {}),
      ...(patch.canvasY !== undefined ? { canvasY: patch.canvasY } : {}),
      ...(patch.swimlaneId !== undefined
        ? { swimlaneId: patch.swimlaneId }
        : {}),
      ...(patch.discussDuringBlueprint !== undefined
        ? { discussDuringBlueprint: patch.discussDuringBlueprint }
        : {}),
      ...(patch.expectedWorkTime !== undefined
        ? { expectedWorkTime: patch.expectedWorkTime }
        : {}),
      ...(patch.typicalWaitingTime !== undefined
        ? { typicalWaitingTime: patch.typicalWaitingTime }
        : {}),
      ...(patch.problems !== undefined ? { problems: patch.problems } : {}),
      ...(patch.workarounds !== undefined
        ? { workarounds: patch.workarounds }
        : {}),
      ...(patch.internalNotes !== undefined
        ? { internalNotes: patch.internalNotes }
        : {}),
      ...(patch.clientNotes !== undefined
        ? { clientNotes: patch.clientNotes }
        : {}),
      ...(patch.unresolvedQuestions !== undefined
        ? { unresolvedQuestions: patch.unresolvedQuestions }
        : {}),
      ...(patch.automationSuitability !== undefined
        ? { automationSuitability: patch.automationSuitability }
        : {}),
    },
  });
}

/**
 * Safe delete: blocks when connections exist unless `cleanupConnections` is true
 * (then deletes connections transactionally first).
 */
export async function deleteDraftStep(
  stepId: string,
  opts?: { cleanupConnections?: boolean; expectedCompanyId?: string },
) {
  const step = await prisma.processStep.findUnique({
    where: { id: stepId },
    include: { processVersion: { include: { process: true } } },
  });
  if (!step) throw new ProcessGraphError("Step not found", "not_found");
  if (opts?.expectedCompanyId) {
    await assertCompanyAccess(
      step.processVersion.process.companyId,
      opts.expectedCompanyId,
    );
  }
  assertEditable(step.processVersion);

  const linked = await prisma.processConnection.count({
    where: {
      OR: [{ sourceStepId: stepId }, { targetStepId: stepId }],
    },
  });
  if (linked > 0 && !opts?.cleanupConnections) {
    throw new ProcessGraphError(
      "Cannot delete step with connections; pass cleanupConnections or delete connections first",
      "conflict",
    );
  }

  return prisma.$transaction(async (tx) => {
    if (linked > 0) {
      await tx.processConnection.deleteMany({
        where: {
          OR: [{ sourceStepId: stepId }, { targetStepId: stepId }],
        },
      });
    }
    await tx.processParticipant.deleteMany({ where: { processStepId: stepId } });
    await tx.processStep.delete({ where: { id: stepId } });
  });
}

export type ConnectionInput = {
  sourceStepId: string;
  targetStepId: string;
  connectionType: ProcessConnectionType;
  displayLabel?: string | null;
  condition?: string | null;
  businessRule?: string | null;
  priority?: number;
  isDefaultPath?: boolean;
  exceptionMetadata?: string | null;
  escalationMetadata?: string | null;
  presentationRouteJson?: string | null;
};

async function assertStepsInVersion(
  tx: Tx,
  versionId: string,
  sourceStepId: string,
  targetStepId: string,
) {
  const ids =
    sourceStepId === targetStepId
      ? [sourceStepId]
      : [sourceStepId, targetStepId];
  const steps = await tx.processStep.findMany({
    where: { id: { in: ids } },
  });
  if (steps.length !== ids.length) {
    throw new ProcessGraphError("Source or target step not found", "not_found");
  }
  for (const s of steps) {
    if (s.processVersionId !== versionId) {
      throw new ProcessGraphError(
        "Connection steps must belong to the same ProcessVersion",
        "validation",
      );
    }
  }
  return steps;
}

export async function addConnection(versionId: string, input: ConnectionInput) {
  const version = await loadVersion(prisma, versionId);
  assertEditable(version);
  if (!Object.values(ProcessConnectionType).includes(input.connectionType)) {
    throw new ProcessGraphError("Unsupported connection type", "validation");
  }

  return prisma.$transaction(async (tx) => {
    const steps = await assertStepsInVersion(
      tx,
      versionId,
      input.sourceStepId,
      input.targetStepId,
    );
    const source = steps.find((s) => s.id === input.sourceStepId);
    if (
      BRANCH_TYPES.includes(input.connectionType) &&
      source &&
      !DECISION_LIKE.includes(source.stepType)
    ) {
      throw new ProcessGraphError(
        "Approval/rejection/return connections must originate from DECISION or APPROVAL steps",
        "validation",
      );
    }

    if (input.isDefaultPath) {
      const existingDefault = await tx.processConnection.count({
        where: {
          processVersionId: versionId,
          sourceStepId: input.sourceStepId,
          isDefaultPath: true,
        },
      });
      if (existingDefault > 0) {
        throw new ProcessGraphError(
          "Duplicate default path from the same source is not allowed",
          "validation",
        );
      }
    }

    return tx.processConnection.create({
      data: {
        processVersionId: versionId,
        sourceStepId: input.sourceStepId,
        targetStepId: input.targetStepId,
        connectionType: input.connectionType,
        displayLabel: input.displayLabel ?? null,
        condition: input.condition ?? null,
        businessRule: input.businessRule ?? null,
        priority: input.priority ?? 0,
        isDefaultPath: input.isDefaultPath ?? false,
        exceptionMetadata: input.exceptionMetadata ?? null,
        escalationMetadata: input.escalationMetadata ?? null,
        presentationRouteJson: input.presentationRouteJson ?? null,
      },
    });
  });
}

export async function updateConnection(
  connectionId: string,
  patch: Partial<ConnectionInput>,
  opts?: { expectedCompanyId?: string },
) {
  const conn = await prisma.processConnection.findUnique({
    where: { id: connectionId },
    include: {
      processVersion: { include: { process: true } },
      sourceStep: true,
    },
  });
  if (!conn) throw new ProcessGraphError("Connection not found", "not_found");
  if (opts?.expectedCompanyId) {
    await assertCompanyAccess(
      conn.processVersion.process.companyId,
      opts.expectedCompanyId,
    );
  }
  assertEditable(conn.processVersion);

  const sourceStepId = patch.sourceStepId ?? conn.sourceStepId;
  const targetStepId = patch.targetStepId ?? conn.targetStepId;
  const connectionType = patch.connectionType ?? conn.connectionType;

  await assertStepsInVersion(
    prisma,
    conn.processVersionId,
    sourceStepId,
    targetStepId,
  );

  if (BRANCH_TYPES.includes(connectionType)) {
    const source = await prisma.processStep.findUnique({
      where: { id: sourceStepId },
    });
    if (source && !DECISION_LIKE.includes(source.stepType)) {
      throw new ProcessGraphError(
        "Approval/rejection/return connections must originate from DECISION or APPROVAL steps",
        "validation",
      );
    }
  }

  if (patch.isDefaultPath === true) {
    const existingDefault = await prisma.processConnection.count({
      where: {
        processVersionId: conn.processVersionId,
        sourceStepId,
        isDefaultPath: true,
        NOT: { id: connectionId },
      },
    });
    if (existingDefault > 0) {
      throw new ProcessGraphError(
        "Duplicate default path from the same source is not allowed",
        "validation",
      );
    }
  }

  return prisma.processConnection.update({
    where: { id: connectionId },
    data: {
      ...(patch.sourceStepId !== undefined
        ? { sourceStepId: patch.sourceStepId }
        : {}),
      ...(patch.targetStepId !== undefined
        ? { targetStepId: patch.targetStepId }
        : {}),
      ...(patch.connectionType !== undefined
        ? { connectionType: patch.connectionType }
        : {}),
      ...(patch.displayLabel !== undefined
        ? { displayLabel: patch.displayLabel }
        : {}),
      ...(patch.condition !== undefined ? { condition: patch.condition } : {}),
      ...(patch.businessRule !== undefined
        ? { businessRule: patch.businessRule }
        : {}),
      ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
      ...(patch.isDefaultPath !== undefined
        ? { isDefaultPath: patch.isDefaultPath }
        : {}),
    },
  });
}

export async function deleteConnection(
  connectionId: string,
  opts?: { expectedCompanyId?: string },
) {
  const conn = await prisma.processConnection.findUnique({
    where: { id: connectionId },
    include: { processVersion: { include: { process: true } } },
  });
  if (!conn) throw new ProcessGraphError("Connection not found", "not_found");
  if (opts?.expectedCompanyId) {
    await assertCompanyAccess(
      conn.processVersion.process.companyId,
      opts.expectedCompanyId,
    );
  }
  assertEditable(conn.processVersion);
  await prisma.processConnection.delete({ where: { id: connectionId } });
}

export async function addParticipant(input: {
  processVersionId: string;
  processStepId?: string | null;
  participantType: ProcessParticipantType;
  role?: string | null;
  personLabel?: string | null;
  contactId?: string | null;
  department?: string | null;
  externalDesignation?: string | null;
  responsibilityType?: ProcessResponsibilityType;
  expectedCompanyId?: string;
}) {
  const version = await loadVersion(prisma, input.processVersionId);
  assertEditable(version);
  if (input.expectedCompanyId) {
    await assertCompanyAccess(version.process.companyId, input.expectedCompanyId);
  }
  if (input.processStepId) {
    const step = await prisma.processStep.findUnique({
      where: { id: input.processStepId },
    });
    if (!step || step.processVersionId !== input.processVersionId) {
      throw new ProcessGraphError(
        "Participant step must belong to the version",
        "validation",
      );
    }
  }
  return prisma.processParticipant.create({
    data: {
      processVersionId: input.processVersionId,
      processStepId: input.processStepId ?? null,
      participantType: input.participantType,
      role: input.role ?? null,
      personLabel: input.personLabel ?? null,
      contactId: input.contactId ?? null,
      department: input.department ?? null,
      externalDesignation: input.externalDesignation ?? null,
      responsibilityType:
        input.responsibilityType ?? ProcessResponsibilityType.RESPONSIBLE,
    },
  });
}

export async function validateGraphIntegrity(
  versionId: string,
): Promise<GraphValidationResult> {
  const version = await prisma.processVersion.findUnique({
    where: { id: versionId },
    include: {
      steps: true,
      connections: true,
    },
  });
  if (!version) throw new ProcessGraphError("Version not found", "not_found");

  const issues: GraphValidationIssue[] = [];
  const stepIds = new Set(version.steps.map((s) => s.id));

  for (const c of version.connections) {
    if (!stepIds.has(c.sourceStepId) || !stepIds.has(c.targetStepId)) {
      issues.push({
        code: "orphan_connection",
        message: `Connection ${c.id} references missing step(s)`,
        severity: "error",
      });
    }
    if (c.processVersionId !== versionId) {
      issues.push({
        code: "cross_version_connection",
        message: `Connection ${c.id} is not scoped to this version`,
        severity: "error",
      });
    }
  }

  const defaults = new Map<string, number>();
  for (const c of version.connections.filter((x) => x.isDefaultPath)) {
    defaults.set(c.sourceStepId, (defaults.get(c.sourceStepId) ?? 0) + 1);
  }
  for (const [sourceId, count] of defaults) {
    if (count > 1) {
      issues.push({
        code: "duplicate_default",
        message: `Source ${sourceId} has ${count} default paths`,
        severity: "error",
      });
    }
  }

  for (const c of version.connections) {
    if (!BRANCH_TYPES.includes(c.connectionType)) continue;
    const source = version.steps.find((s) => s.id === c.sourceStepId);
    if (source && !DECISION_LIKE.includes(source.stepType)) {
      issues.push({
        code: "invalid_branch_origin",
        message: `Branch connection ${c.id} does not originate from DECISION/APPROVAL`,
        severity: "error",
      });
    }
  }

  if (version.steps.length === 0) {
    issues.push({
      code: "empty_graph",
      message: "Version has no steps",
      severity: "warning",
    });
  }

  const ok = !issues.some((i) => i.severity === "error");
  return { ok, issues };
}

async function copyVersionContents(
  tx: Tx,
  source: ProcessVersion & {
    steps: ProcessStep[];
    connections: ProcessConnection[];
    participants: Awaited<
      ReturnType<typeof prisma.processParticipant.findMany>
    >;
    swimlanes?: Awaited<ReturnType<typeof prisma.processSwimlane.findMany>>;
  },
  targetVersionId: string,
) {
  const laneMap = new Map<string, string>();
  const sourceLanes =
    source.swimlanes ??
    (await tx.processSwimlane.findMany({
      where: { processVersionId: source.id },
      orderBy: { displayOrder: "asc" },
    }));
  for (const lane of sourceLanes) {
    const created = await tx.processSwimlane.create({
      data: {
        processVersionId: targetVersionId,
        name: lane.name,
        kind: lane.kind,
        displayOrder: lane.displayOrder,
        colorHint: lane.colorHint,
      },
    });
    laneMap.set(lane.id, created.id);
  }

  const stepMap = new Map<string, string>();
  for (const step of source.steps) {
    const created = await tx.processStep.create({
      data: {
        processVersionId: targetVersionId,
        displayOrder: step.displayOrder,
        shortName: step.shortName,
        detailedDescription: step.detailedDescription,
        stepType: step.stepType,
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
        deadline: step.deadline,
        serviceExpectation: step.serviceExpectation,
        notification: step.notification,
        evidenceOfCompletion: step.evidenceOfCompletion,
        problems: step.problems,
        workarounds: step.workarounds,
        valueClassification: step.valueClassification,
        automationSuitability: step.automationSuitability,
        internalNotes: step.internalNotes,
        clientNotes: step.clientNotes,
        unresolvedQuestions: step.unresolvedQuestions,
        discussDuringBlueprint: step.discussDuringBlueprint,
        completenessStatus: step.completenessStatus,
        confidenceStatus: step.confidenceStatus,
        canvasX: step.canvasX,
        canvasY: step.canvasY,
        swimlaneId: step.swimlaneId
          ? (laneMap.get(step.swimlaneId) ?? null)
          : null,
        sourceStepId: step.id,
      },
    });
    stepMap.set(step.id, created.id);
  }

  for (const c of source.connections) {
    const sourceStepId = stepMap.get(c.sourceStepId);
    const targetStepId = stepMap.get(c.targetStepId);
    if (!sourceStepId || !targetStepId) continue;
    await tx.processConnection.create({
      data: {
        processVersionId: targetVersionId,
        sourceStepId,
        targetStepId,
        connectionType: c.connectionType,
        displayLabel: c.displayLabel,
        condition: c.condition,
        businessRule: c.businessRule,
        priority: c.priority,
        isDefaultPath: c.isDefaultPath,
        exceptionMetadata: c.exceptionMetadata,
        escalationMetadata: c.escalationMetadata,
        presentationRouteJson: c.presentationRouteJson,
      },
    });
  }

  for (const p of source.participants) {
    await tx.processParticipant.create({
      data: {
        processVersionId: targetVersionId,
        processStepId: p.processStepId
          ? (stepMap.get(p.processStepId) ?? null)
          : null,
        participantType: p.participantType,
        role: p.role,
        personLabel: p.personLabel,
        contactId: p.contactId,
        department: p.department,
        externalDesignation: p.externalDesignation,
        responsibilityType: p.responsibilityType,
      },
    });
  }

  if (source.viewportJson) {
    await tx.processVersion.update({
      where: { id: targetVersionId },
      data: { viewportJson: source.viewportJson },
    });
  }

  return stepMap;
}

/**
 * Create an OWNER_REFINED draft from an immutable submitted/approved As-Is version.
 * Source version remains unchanged (does not supersede unless it was DRAFT).
 */
export async function refineAsOwnerDraft(
  versionId: string,
  opts?: { actorUserId?: string; actorLabel?: string },
) {
  const source = await prisma.processVersion.findUnique({
    where: { id: versionId },
    include: {
      process: true,
      steps: { orderBy: { displayOrder: "asc" } },
      connections: true,
      participants: true,
      swimlanes: { orderBy: { displayOrder: "asc" } },
    },
  });
  if (!source) throw new ProcessGraphError("Version not found", "not_found");
  if (
    source.status !== ProcessVersionStatus.SUBMITTED &&
    source.status !== ProcessVersionStatus.APPROVED &&
    source.status !== ProcessVersionStatus.OWNER_REFINED
  ) {
    throw new ProcessGraphError(
      "Only submitted, approved, or refined versions can be refined",
      "conflict",
    );
  }

  const draft = await prisma.$transaction(async (tx) => {
    const max = await tx.processVersion.aggregate({
      where: { processId: source.processId },
      _max: { versionNumber: true },
    });
    const nextNum = (max._max.versionNumber ?? 0) + 1;
    const created = await tx.processVersion.create({
      data: {
        processId: source.processId,
        versionNumber: nextNum,
        versionLabel: `v${nextNum} owner refined`,
        classification: source.classification,
        status: ProcessVersionStatus.OWNER_REFINED,
        parentVersionId: source.id,
        authorType: ProcessAuthorType.OWNER,
        authorUserId: opts?.actorUserId ?? null,
        authorLabel: opts?.actorLabel ?? "owner",
        purpose: source.purpose,
        outcome: source.outcome,
        startTrigger: source.startTrigger,
        endEvent: source.endEvent,
        frequency: source.frequency,
        formResponseId: null,
      },
    });
    await copyVersionContents(tx, source, created.id);
    await tx.process.update({
      where: { id: source.processId },
      data: { currentDraftVersionId: created.id },
    });
    return created;
  });

  await recordAudit({
    action: "process_version.owner_refined",
    actorUserId: opts?.actorUserId,
    actorLabel: opts?.actorLabel,
    entityType: "ProcessVersion",
    entityId: draft.id,
    details: { sourceVersionId: versionId, processId: source.processId },
  });
  return draft;
}

export async function submitVersion(
  versionId: string,
  opts?: { actorUserId?: string; actorLabel?: string },
) {
  const validation = await validateGraphIntegrity(versionId);
  if (!validation.ok) {
    throw new ProcessGraphError(
      `Graph validation failed: ${validation.issues
        .filter((i) => i.severity === "error")
        .map((i) => i.message)
        .join("; ")}`,
      "validation",
    );
  }

  const version = await loadVersion(prisma, versionId);
  if (version.status !== ProcessVersionStatus.DRAFT &&
    version.status !== ProcessVersionStatus.OWNER_REFINED) {
    throw new ProcessGraphError("Only draft/refined versions can be submitted", "conflict");
  }

  const updated = await prisma.processVersion.update({
    where: { id: versionId },
    data: {
      status: ProcessVersionStatus.SUBMITTED,
      submittedAt: new Date(),
    },
  });
  await prisma.process.update({
    where: { id: version.processId },
    data: { currentDraftVersionId: null },
  });
  await recordAudit({
    action: "process_version.submitted",
    actorUserId: opts?.actorUserId,
    actorLabel: opts?.actorLabel,
    entityType: "ProcessVersion",
    entityId: versionId,
    details: { processId: version.processId },
  });
  return updated;
}

export async function reopenAsNewDraft(
  versionId: string,
  opts?: { actorUserId?: string; actorLabel?: string },
) {
  const source = await prisma.processVersion.findUnique({
    where: { id: versionId },
    include: {
      process: true,
      steps: { orderBy: { displayOrder: "asc" } },
      connections: true,
      participants: true,
      swimlanes: { orderBy: { displayOrder: "asc" } },
    },
  });
  if (!source) throw new ProcessGraphError("Version not found", "not_found");
  if (
    source.status !== ProcessVersionStatus.SUBMITTED &&
    source.status !== ProcessVersionStatus.APPROVED &&
    source.status !== ProcessVersionStatus.OWNER_REFINED
  ) {
    throw new ProcessGraphError(
      "Only submitted/approved/refined versions can be reopened",
      "conflict",
    );
  }

  return prisma.$transaction(async (tx) => {
    if (source.status === ProcessVersionStatus.SUBMITTED) {
      await tx.processVersion.update({
        where: { id: versionId },
        data: {
          status: ProcessVersionStatus.SUPERSEDED,
          supersededAt: new Date(),
        },
      });
    }

    const max = await tx.processVersion.aggregate({
      where: { processId: source.processId },
      _max: { versionNumber: true },
    });
    const nextNum = (max._max.versionNumber ?? 0) + 1;
    const draft = await tx.processVersion.create({
      data: {
        processId: source.processId,
        versionNumber: nextNum,
        versionLabel: `v${nextNum} draft (reopen)`,
        classification: source.classification,
        status: ProcessVersionStatus.DRAFT,
        parentVersionId: source.id,
        authorType: ProcessAuthorType.OWNER,
        authorUserId: opts?.actorUserId ?? null,
        authorLabel: opts?.actorLabel ?? null,
        purpose: source.purpose,
        outcome: source.outcome,
        startTrigger: source.startTrigger,
        endEvent: source.endEvent,
        frequency: source.frequency,
      },
    });
    await copyVersionContents(tx, source, draft.id);
    await tx.process.update({
      where: { id: source.processId },
      data: { currentDraftVersionId: draft.id },
    });
    return draft;
  });
}

export async function deriveFutureStateDraft(
  asIsVersionId: string,
  opts?: { actorUserId?: string; actorLabel?: string },
) {
  const source = await prisma.processVersion.findUnique({
    where: { id: asIsVersionId },
    include: {
      process: true,
      steps: { orderBy: { displayOrder: "asc" } },
      connections: true,
      participants: true,
      swimlanes: { orderBy: { displayOrder: "asc" } },
    },
  });
  if (!source) throw new ProcessGraphError("Version not found", "not_found");
  if (source.classification !== ProcessVersionClassification.AS_IS) {
    throw new ProcessGraphError(
      "Future-State may only be derived from an As-Is version",
      "validation",
    );
  }

  return prisma.$transaction(async (tx) => {
    const max = await tx.processVersion.aggregate({
      where: { processId: source.processId },
      _max: { versionNumber: true },
    });
    const nextNum = (max._max.versionNumber ?? 0) + 1;
    const draft = await tx.processVersion.create({
      data: {
        processId: source.processId,
        versionNumber: nextNum,
        versionLabel: `v${nextNum} future-state draft`,
        classification: ProcessVersionClassification.FUTURE_STATE,
        status: ProcessVersionStatus.DRAFT,
        derivedFromVersionId: source.id,
        parentVersionId: source.id,
        authorType: ProcessAuthorType.OWNER,
        authorUserId: opts?.actorUserId ?? null,
        authorLabel: opts?.actorLabel ?? null,
        purpose: source.purpose,
        outcome: source.outcome,
        startTrigger: source.startTrigger,
        endEvent: source.endEvent,
      },
    });
    await copyVersionContents(tx, source, draft.id);
    await tx.process.update({
      where: { id: source.processId },
      data: {
        currentDraftVersionId: draft.id,
        currentFutureStateVersionId: draft.id,
      },
    });
    // Source As-Is remains unchanged
    return draft;
  });
}

export async function approveAsIsBaseline(
  versionId: string,
  opts: {
    approverUserId?: string;
    approverRole?: string;
    criteriaOrNotes?: string;
    actorLabel?: string;
  },
) {
  const version = await loadVersion(prisma, versionId);
  if (version.classification !== ProcessVersionClassification.AS_IS) {
    throw new ProcessGraphError("Only As-Is versions can be baselined", "validation");
  }
  if (
    version.status !== ProcessVersionStatus.SUBMITTED &&
    version.status !== ProcessVersionStatus.OWNER_REFINED &&
    version.status !== ProcessVersionStatus.APPROVED
  ) {
    throw new ProcessGraphError(
      "Version must be submitted (or refined) before As-Is approval",
      "conflict",
    );
  }

  return prisma.$transaction(async (tx) => {
    const prevApprovedId = version.process.currentApprovedAsIsVersionId;
    if (prevApprovedId && prevApprovedId !== versionId) {
      await tx.processVersion.update({
        where: { id: prevApprovedId },
        data: {
          status: ProcessVersionStatus.SUPERSEDED,
          supersededAt: new Date(),
        },
      });
    }

    const approved = await tx.processVersion.update({
      where: { id: versionId },
      data: {
        status: ProcessVersionStatus.APPROVED,
        approvedAt: new Date(),
      },
    });

    const approval = await tx.processApproval.create({
      data: {
        processVersionId: versionId,
        approvalType: ProcessApprovalType.AS_IS_BASELINE,
        status: ProcessApprovalStatus.APPROVED,
        approverUserId: opts.approverUserId ?? null,
        approverRole: opts.approverRole ?? "owner",
        criteriaOrNotes: opts.criteriaOrNotes ?? null,
        decidedAt: new Date(),
      },
    });

    await tx.process.update({
      where: { id: version.processId },
      data: { currentApprovedAsIsVersionId: versionId },
    });

    return { version: approved, approval };
  }).then(async (result) => {
    await recordAudit({
      action: "process_version.as_is_approved",
      actorUserId: opts.approverUserId,
      actorLabel: opts.actorLabel,
      entityType: "ProcessVersion",
      entityId: versionId,
      details: { approvalId: result.approval.id },
    });
    return result;
  });
}

export async function getProcessGraph(
  processId: string,
  versionId?: string,
  opts?: { expectedCompanyId?: string },
) {
  const process = await prisma.process.findUnique({
    where: { id: processId },
    include: {
      company: { select: { id: true, name: true } },
      opportunity: { select: { id: true, title: true } },
      versions: { orderBy: { versionNumber: "asc" } },
    },
  });
  if (!process) throw new ProcessGraphError("Process not found", "not_found");
  if (opts?.expectedCompanyId) {
    await assertCompanyAccess(process.companyId, opts.expectedCompanyId);
  }

  const targetVersionId =
    versionId ??
    process.currentDraftVersionId ??
    process.currentApprovedAsIsVersionId ??
    process.versions.at(-1)?.id;
  if (!targetVersionId) {
    return { process, version: null, validation: null };
  }

  const version = await prisma.processVersion.findUnique({
    where: { id: targetVersionId },
    include: {
      steps: { orderBy: { displayOrder: "asc" } },
      connections: { orderBy: [{ priority: "asc" }, { createdAt: "asc" }] },
      participants: true,
      approvals: { orderBy: { createdAt: "desc" } },
      swimlanes: { orderBy: { displayOrder: "asc" } },
      painPoints: { orderBy: { createdAt: "asc" } },
      metrics: { orderBy: { createdAt: "asc" } },
      opportunities: { orderBy: { createdAt: "asc" } },
      parent: { select: { id: true, versionNumber: true, status: true } },
      derivedFrom: {
        select: { id: true, versionNumber: true, classification: true },
      },
    },
  });
  if (!version || version.processId !== processId) {
    throw new ProcessGraphError("Version not found for process", "not_found");
  }

  const validation = await validateGraphIntegrity(version.id);
  return { process, version, validation };
}

export async function listProcessVersions(processId: string) {
  return prisma.processVersion.findMany({
    where: { processId },
    orderBy: { versionNumber: "asc" },
    select: {
      id: true,
      versionNumber: true,
      versionLabel: true,
      classification: true,
      status: true,
      parentVersionId: true,
      derivedFromVersionId: true,
      createdAt: true,
      submittedAt: true,
      approvedAt: true,
      supersededAt: true,
    },
  });
}

export async function compareVersionMetadata(aId: string, bId: string) {
  const [a, b] = await Promise.all([
    prisma.processVersion.findUnique({ where: { id: aId } }),
    prisma.processVersion.findUnique({ where: { id: bId } }),
  ]);
  if (!a || !b) throw new ProcessGraphError("Version not found", "not_found");
  if (a.processId !== b.processId) {
    throw new ProcessGraphError(
      "Cannot compare versions from different processes",
      "isolation",
    );
  }
  const [aCounts, bCounts] = await Promise.all([
    prisma.processStep.count({ where: { processVersionId: aId } }).then(
      async (steps) => ({
        steps,
        connections: await prisma.processConnection.count({
          where: { processVersionId: aId },
        }),
      }),
    ),
    prisma.processStep.count({ where: { processVersionId: bId } }).then(
      async (steps) => ({
        steps,
        connections: await prisma.processConnection.count({
          where: { processVersionId: bId },
        }),
      }),
    ),
  ]);

  return {
    processId: a.processId,
    a: {
      id: a.id,
      versionNumber: a.versionNumber,
      classification: a.classification,
      status: a.status,
      ...aCounts,
    },
    b: {
      id: b.id,
      versionNumber: b.versionNumber,
      classification: b.classification,
      status: b.status,
      ...bCounts,
    },
  };
}

export async function assertProcessCompany(
  processId: string,
  companyId: string,
) {
  const process = await prisma.process.findUnique({ where: { id: processId } });
  if (!process) throw new ProcessGraphError("Process not found", "not_found");
  await assertCompanyAccess(process.companyId, companyId);
  return process;
}

export { ProcessStepType, ProcessConnectionType };
