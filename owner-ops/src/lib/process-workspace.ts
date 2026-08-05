/**
 * Increment 3 — owner visual process workspace domain.
 *
 * Relational ProcessConnection remains workflow truth.
 * canvasX/Y, viewportJson, swimlanes, and presentationRouteJson are presentation only.
 */
import {
  ImprovementCategory,
  ImprovementPriority,
  ImprovementStatus,
  MetricDataSource,
  MetricType,
  PainPointCategory,
  PainPointSeverity,
  ProcessSwimlaneKind,
  ProcessVersionStatus,
} from "@prisma/client";
import { prisma } from "./db";
import {
  ProcessGraphError,
  assertProcessCompany,
  getProcessGraph,
  refineAsOwnerDraft,
  deriveFutureStateDraft,
  validateGraphIntegrity,
  updateDraftStep,
  type GraphValidationResult,
} from "./process-graph";

export function isOwnerEditableStatus(status: ProcessVersionStatus) {
  return (
    status === ProcessVersionStatus.DRAFT ||
    status === ProcessVersionStatus.OWNER_REFINED
  );
}

async function requireEditableVersion(versionId: string) {
  const version = await prisma.processVersion.findUnique({
    where: { id: versionId },
    include: { process: true },
  });
  if (!version) throw new ProcessGraphError("Version not found", "not_found");
  if (!isOwnerEditableStatus(version.status)) {
    throw new ProcessGraphError(
      `Version status ${version.status} is read-only in the workspace`,
      "immutable",
    );
  }
  return version;
}

export async function loadWorkspace(processId: string, versionId?: string) {
  const graph = await getProcessGraph(processId, versionId);
  if (!graph.version) {
    throw new ProcessGraphError("No version available", "not_found");
  }
  const editable = isOwnerEditableStatus(graph.version.status);
  return {
    ...graph,
    editable,
    readOnlyReason: editable
      ? null
      : `Version is ${graph.version.status}. Refine or derive a draft to edit.`,
  };
}

export async function saveStepPositions(
  versionId: string,
  positions: Array<{ stepId: string; canvasX: number; canvasY: number }>,
) {
  const version = await requireEditableVersion(versionId);
  for (const p of positions) {
    const step = await prisma.processStep.findUnique({ where: { id: p.stepId } });
    if (!step || step.processVersionId !== versionId) {
      throw new ProcessGraphError("Step does not belong to this version", "isolation");
    }
    await prisma.processStep.update({
      where: { id: p.stepId },
      data: { canvasX: p.canvasX, canvasY: p.canvasY },
    });
  }
  return prisma.processVersion.update({
    where: { id: version.id },
    data: { updatedAt: new Date() },
  });
}

export async function saveViewport(versionId: string, viewportJson: string) {
  await requireEditableVersion(versionId);
  return prisma.processVersion.update({
    where: { id: versionId },
    data: { viewportJson },
  });
}

export async function createSwimlane(
  versionId: string,
  input: { name: string; kind?: ProcessSwimlaneKind; displayOrder?: number },
) {
  await requireEditableVersion(versionId);
  const name = input.name.trim();
  if (!name) throw new ProcessGraphError("Lane name is required", "validation");
  const count = await prisma.processSwimlane.count({
    where: { processVersionId: versionId },
  });
  return prisma.processSwimlane.create({
    data: {
      processVersionId: versionId,
      name,
      kind: input.kind ?? ProcessSwimlaneKind.ROLE,
      displayOrder: input.displayOrder ?? count,
    },
  });
}

export async function reorderSwimlanes(
  versionId: string,
  orderedIds: string[],
) {
  await requireEditableVersion(versionId);
  const lanes = await prisma.processSwimlane.findMany({
    where: { processVersionId: versionId },
  });
  if (lanes.length !== orderedIds.length) {
    throw new ProcessGraphError("Lane list mismatch", "validation");
  }
  for (const id of orderedIds) {
    if (!lanes.some((l) => l.id === id)) {
      throw new ProcessGraphError("Lane not on this version", "isolation");
    }
  }
  await prisma.$transaction(
    orderedIds.map((id, i) =>
      prisma.processSwimlane.update({
        where: { id },
        data: { displayOrder: i },
      }),
    ),
  );
  return prisma.processSwimlane.findMany({
    where: { processVersionId: versionId },
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Assigning a lane updates presentation only. Optionally syncs department/role labels
 * when the lane kind is DEPARTMENT or ROLE and the lane name is informative.
 */
export async function assignStepSwimlane(
  stepId: string,
  swimlaneId: string | null,
) {
  const step = await prisma.processStep.findUnique({
    where: { id: stepId },
    include: { processVersion: true },
  });
  if (!step) throw new ProcessGraphError("Step not found", "not_found");
  await requireEditableVersion(step.processVersionId);

  let department = step.department;
  let responsibleRole = step.responsibleRole;
  if (swimlaneId) {
    const lane = await prisma.processSwimlane.findUnique({
      where: { id: swimlaneId },
    });
    if (!lane || lane.processVersionId !== step.processVersionId) {
      throw new ProcessGraphError("Lane not on this version", "isolation");
    }
    if (lane.kind === ProcessSwimlaneKind.DEPARTMENT) department = lane.name;
    if (lane.kind === ProcessSwimlaneKind.ROLE) responsibleRole = lane.name;
  }

  return updateDraftStep(stepId, {
    swimlaneId,
    department,
    responsibleRole,
  });
}

export async function createPainPoint(
  versionId: string,
  input: {
    title: string;
    description?: string;
    category?: PainPointCategory;
    severity?: PainPointSeverity;
    processStepId?: string | null;
    processConnectionId?: string | null;
    frequency?: string;
    estimatedTimeImpact?: string;
    estimatedFinancialImpact?: string;
    financialImpactSource?: string;
    customerImpact?: string;
    complianceOrOpsRisk?: string;
    evidenceSource?: string;
    currentWorkaround?: string;
    confidence?: string;
    ownerNotes?: string;
  },
) {
  await requireEditableVersion(versionId);
  const title = input.title.trim();
  if (!title) throw new ProcessGraphError("Pain point title required", "validation");
  if (input.estimatedFinancialImpact?.trim() && !input.financialImpactSource?.trim()) {
    throw new ProcessGraphError(
      "Financial impact requires an explicit source — do not claim savings without evidence",
      "validation",
    );
  }
  if (input.processStepId) {
    const step = await prisma.processStep.findUnique({
      where: { id: input.processStepId },
    });
    if (!step || step.processVersionId !== versionId) {
      throw new ProcessGraphError("Step not on this version", "isolation");
    }
  }
  return prisma.processPainPoint.create({
    data: {
      processVersionId: versionId,
      title,
      description: input.description ?? null,
      category: input.category ?? PainPointCategory.OTHER,
      severity: input.severity ?? PainPointSeverity.MEDIUM,
      processStepId: input.processStepId ?? null,
      processConnectionId: input.processConnectionId ?? null,
      frequency: input.frequency ?? null,
      estimatedTimeImpact: input.estimatedTimeImpact ?? null,
      estimatedFinancialImpact: input.estimatedFinancialImpact ?? null,
      financialImpactSource: input.financialImpactSource ?? null,
      customerImpact: input.customerImpact ?? null,
      complianceOrOpsRisk: input.complianceOrOpsRisk ?? null,
      evidenceSource: input.evidenceSource ?? null,
      currentWorkaround: input.currentWorkaround ?? null,
      confidence: input.confidence ?? null,
      ownerNotes: input.ownerNotes ?? null,
    },
  });
}

export async function updatePainPoint(
  id: string,
  patch: Partial<Parameters<typeof createPainPoint>[1]>,
) {
  const row = await prisma.processPainPoint.findUnique({ where: { id } });
  if (!row) throw new ProcessGraphError("Pain point not found", "not_found");
  await requireEditableVersion(row.processVersionId);
  if (patch.estimatedFinancialImpact?.trim() && !patch.financialImpactSource?.trim() && !row.financialImpactSource) {
    throw new ProcessGraphError(
      "Financial impact requires an explicit source",
      "validation",
    );
  }
  return prisma.processPainPoint.update({
    where: { id },
    data: {
      ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.category !== undefined ? { category: patch.category } : {}),
      ...(patch.severity !== undefined ? { severity: patch.severity } : {}),
      ...(patch.processStepId !== undefined
        ? { processStepId: patch.processStepId }
        : {}),
      ...(patch.frequency !== undefined ? { frequency: patch.frequency } : {}),
      ...(patch.estimatedTimeImpact !== undefined
        ? { estimatedTimeImpact: patch.estimatedTimeImpact }
        : {}),
      ...(patch.estimatedFinancialImpact !== undefined
        ? { estimatedFinancialImpact: patch.estimatedFinancialImpact }
        : {}),
      ...(patch.financialImpactSource !== undefined
        ? { financialImpactSource: patch.financialImpactSource }
        : {}),
      ...(patch.customerImpact !== undefined
        ? { customerImpact: patch.customerImpact }
        : {}),
      ...(patch.ownerNotes !== undefined ? { ownerNotes: patch.ownerNotes } : {}),
    },
  });
}

export async function createMetric(
  versionId: string,
  input: {
    name: string;
    description?: string;
    metricType?: MetricType;
    currentValue?: string;
    unit?: string;
    targetValue?: string;
    measurementPeriod?: string;
    dataSource?: MetricDataSource;
    confidence?: string;
    notes?: string;
    processStepId?: string | null;
  },
) {
  await requireEditableVersion(versionId);
  const name = input.name.trim();
  if (!name) throw new ProcessGraphError("Metric name required", "validation");
  return prisma.processMetric.create({
    data: {
      processVersionId: versionId,
      name,
      description: input.description ?? null,
      metricType: input.metricType ?? MetricType.OTHER,
      currentValue: input.currentValue ?? null,
      unit: input.unit ?? null,
      targetValue: input.targetValue ?? null,
      measurementPeriod: input.measurementPeriod ?? null,
      dataSource: input.dataSource ?? MetricDataSource.OWNER_ESTIMATE,
      confidence: input.confidence ?? null,
      notes: input.notes ?? null,
      processStepId: input.processStepId ?? null,
    },
  });
}

export async function updateMetric(
  id: string,
  patch: Partial<Parameters<typeof createMetric>[1]>,
) {
  const row = await prisma.processMetric.findUnique({ where: { id } });
  if (!row) throw new ProcessGraphError("Metric not found", "not_found");
  await requireEditableVersion(row.processVersionId);
  return prisma.processMetric.update({
    where: { id },
    data: {
      ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.metricType !== undefined ? { metricType: patch.metricType } : {}),
      ...(patch.currentValue !== undefined ? { currentValue: patch.currentValue } : {}),
      ...(patch.unit !== undefined ? { unit: patch.unit } : {}),
      ...(patch.targetValue !== undefined ? { targetValue: patch.targetValue } : {}),
      ...(patch.dataSource !== undefined ? { dataSource: patch.dataSource } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      ...(patch.processStepId !== undefined
        ? { processStepId: patch.processStepId }
        : {}),
    },
  });
}

export async function createImprovementOpportunity(
  versionId: string,
  input: {
    title: string;
    problemAddressed?: string;
    proposedChange?: string;
    category?: ImprovementCategory;
    expectedBenefit?: string;
    estimatedImpact?: string;
    estimatedEffort?: string;
    priority?: ImprovementPriority;
    confidence?: string;
    dependencies?: string;
    risks?: string;
    assumptions?: string;
    validationNeeded?: string;
    status?: ImprovementStatus;
    ownerNotes?: string;
    processStepId?: string | null;
    painPointId?: string | null;
    metricId?: string | null;
    processConnectionId?: string | null;
  },
) {
  await requireEditableVersion(versionId);
  const title = input.title.trim();
  if (!title) throw new ProcessGraphError("Opportunity title required", "validation");
  return prisma.improvementOpportunity.create({
    data: {
      processVersionId: versionId,
      title,
      problemAddressed: input.problemAddressed ?? null,
      proposedChange: input.proposedChange ?? null,
      category: input.category ?? ImprovementCategory.OTHER,
      expectedBenefit: input.expectedBenefit ?? null,
      estimatedImpact: input.estimatedImpact ?? null,
      estimatedEffort: input.estimatedEffort ?? null,
      priority: input.priority ?? ImprovementPriority.MEDIUM,
      confidence: input.confidence ?? null,
      dependencies: input.dependencies ?? null,
      risks: input.risks ?? null,
      assumptions: input.assumptions ?? null,
      validationNeeded: input.validationNeeded ?? null,
      status: input.status ?? ImprovementStatus.CAPTURED,
      ownerNotes: input.ownerNotes ?? null,
      processStepId: input.processStepId ?? null,
      painPointId: input.painPointId ?? null,
      metricId: input.metricId ?? null,
      processConnectionId: input.processConnectionId ?? null,
    },
  });
}

export async function updateImprovementOpportunity(
  id: string,
  patch: Partial<Parameters<typeof createImprovementOpportunity>[1]>,
) {
  const row = await prisma.improvementOpportunity.findUnique({ where: { id } });
  if (!row) throw new ProcessGraphError("Opportunity not found", "not_found");
  await requireEditableVersion(row.processVersionId);
  return prisma.improvementOpportunity.update({
    where: { id },
    data: {
      ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
      ...(patch.problemAddressed !== undefined
        ? { problemAddressed: patch.problemAddressed }
        : {}),
      ...(patch.proposedChange !== undefined
        ? { proposedChange: patch.proposedChange }
        : {}),
      ...(patch.category !== undefined ? { category: patch.category } : {}),
      ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.ownerNotes !== undefined ? { ownerNotes: patch.ownerNotes } : {}),
      ...(patch.painPointId !== undefined ? { painPointId: patch.painPointId } : {}),
      ...(patch.metricId !== undefined ? { metricId: patch.metricId } : {}),
      ...(patch.processStepId !== undefined
        ? { processStepId: patch.processStepId }
        : {}),
    },
  });
}

export type VersionComparison = {
  asIsVersionId: string;
  futureVersionId: string;
  addedSteps: Array<{ id: string; shortName: string }>;
  removedSteps: Array<{ id: string; shortName: string }>;
  modifiedSteps: Array<{
    asIsId: string;
    futureId: string;
    shortName: string;
    changes: string[];
  }>;
  retainedSteps: Array<{ asIsId: string; futureId: string; shortName: string }>;
  connectionChanges: {
    added: number;
    removed: number;
    modified: number;
  };
  responsibilityChanges: Array<{ step: string; detail: string }>;
  toolChanges: Array<{ step: string; from: string | null; to: string | null }>;
};

export async function compareAsIsToFutureState(
  asIsVersionId: string,
  futureVersionId: string,
): Promise<VersionComparison> {
  const [asIs, future] = await Promise.all([
    prisma.processVersion.findUnique({
      where: { id: asIsVersionId },
      include: { steps: true, connections: true },
    }),
    prisma.processVersion.findUnique({
      where: { id: futureVersionId },
      include: { steps: true, connections: true },
    }),
  ]);
  if (!asIs || !future) {
    throw new ProcessGraphError("Version not found", "not_found");
  }
  if (future.derivedFromVersionId && future.derivedFromVersionId !== asIs.id) {
    // Still allow compare if same process
  }
  if (asIs.processId !== future.processId) {
    throw new ProcessGraphError("Versions belong to different processes", "isolation");
  }

  const asIsById = new Map(asIs.steps.map((s) => [s.id, s]));
  const matchedAsIs = new Set<string>();
  const addedSteps: VersionComparison["addedSteps"] = [];
  const modifiedSteps: VersionComparison["modifiedSteps"] = [];
  const retainedSteps: VersionComparison["retainedSteps"] = [];
  const responsibilityChanges: VersionComparison["responsibilityChanges"] = [];
  const toolChanges: VersionComparison["toolChanges"] = [];

  for (const fs of future.steps) {
    const source = fs.sourceStepId ? asIsById.get(fs.sourceStepId) : undefined;
    if (!source) {
      addedSteps.push({ id: fs.id, shortName: fs.shortName });
      continue;
    }
    matchedAsIs.add(source.id);
    const changes: string[] = [];
    if (source.shortName !== fs.shortName) changes.push("name");
    if (source.stepType !== fs.stepType) changes.push("type");
    if (source.detailedDescription !== fs.detailedDescription) {
      changes.push("description");
    }
    if (source.responsibleRole !== fs.responsibleRole) {
      changes.push("role");
      responsibilityChanges.push({
        step: fs.shortName,
        detail: `${source.responsibleRole ?? "—"} → ${fs.responsibleRole ?? "—"}`,
      });
    }
    if (source.department !== fs.department) changes.push("department");
    if (source.toolOrSystem !== fs.toolOrSystem) {
      changes.push("tool");
      toolChanges.push({
        step: fs.shortName,
        from: source.toolOrSystem,
        to: fs.toolOrSystem,
      });
    }
    if (changes.length) {
      modifiedSteps.push({
        asIsId: source.id,
        futureId: fs.id,
        shortName: fs.shortName,
        changes,
      });
    } else {
      retainedSteps.push({
        asIsId: source.id,
        futureId: fs.id,
        shortName: fs.shortName,
      });
    }
  }

  const removedSteps = asIs.steps
    .filter((s) => !matchedAsIs.has(s.id))
    .map((s) => ({ id: s.id, shortName: s.shortName }));

  // Connection fingerprint by type + source/target lineage names
  const fingerprint = (
    steps: typeof asIs.steps,
    conns: typeof asIs.connections,
  ) => {
    const name = new Map(steps.map((s) => [s.id, s.shortName]));
    return new Set(
      conns.map(
        (c) =>
          `${name.get(c.sourceStepId)}>${name.get(c.targetStepId)}:${c.connectionType}:${c.condition ?? ""}`,
      ),
    );
  };
  const aFp = fingerprint(asIs.steps, asIs.connections);
  const fFp = fingerprint(future.steps, future.connections);
  let added = 0;
  let removed = 0;
  for (const x of fFp) if (!aFp.has(x)) added += 1;
  for (const x of aFp) if (!fFp.has(x)) removed += 1;

  return {
    asIsVersionId,
    futureVersionId,
    addedSteps,
    removedSteps,
    modifiedSteps,
    retainedSteps,
    connectionChanges: { added, removed, modified: 0 },
    responsibilityChanges,
    toolChanges,
  };
}

export async function workspaceValidation(
  versionId: string,
): Promise<GraphValidationResult & { advisory: GraphValidationResult["issues"] }> {
  const base = await validateGraphIntegrity(versionId);
  const version = await prisma.processVersion.findUnique({
    where: { id: versionId },
    include: { steps: true, connections: true },
  });
  if (!version) throw new ProcessGraphError("Version not found", "not_found");

  const advisory: GraphValidationResult["issues"] = [];
  for (const s of version.steps) {
    if (s.discussDuringBlueprint) {
      advisory.push({
        code: "blueprint_item",
        message: `“${s.shortName}” marked for Blueprint discussion`,
        severity: "warning",
      });
    }
    if (
      !s.responsibleRole?.trim() &&
      s.stepType !== "PROCESS_END" &&
      s.stepType !== "TRIGGER"
    ) {
      advisory.push({
        code: "missing_role",
        message: `“${s.shortName}” has no responsible role`,
        severity: "warning",
      });
    }
  }

  const decisions = version.steps.filter((s) => s.stepType === "DECISION");
  for (const d of decisions) {
    const outs = version.connections.filter((c) => c.sourceStepId === d.id);
    if (outs.length < 2) {
      // already covered as error in validateGraphIntegrity? check - client builder had it; graph integrity may not
      if (!base.issues.some((i) => i.message.includes(d.shortName))) {
        base.issues.push({
          code: "decision_outcomes",
          message: `Decision “${d.shortName}” needs at least two outcomes`,
          severity: "error",
        });
      }
    }
  }

  const approvals = version.steps.filter((s) => s.stepType === "APPROVAL");
  for (const a of approvals) {
    const outs = version.connections.filter((c) => c.sourceStepId === a.id);
    const hasApproved = outs.some((c) => c.connectionType === "APPROVED");
    const hasRejected = outs.some(
      (c) =>
        c.connectionType === "REJECTED" ||
        c.connectionType === "RETURNED_FOR_CORRECTION",
    );
    if (!hasApproved || !hasRejected) {
      base.issues.push({
        code: "approval_paths",
        message: `Approval “${a.shortName}” needs approved and rejected/correction paths`,
        severity: "error",
      });
    }
  }

  const ok = !base.issues.some((i) => i.severity === "error");
  return { ok, issues: base.issues, advisory };
}

export {
  refineAsOwnerDraft,
  deriveFutureStateDraft,
  assertProcessCompany,
  PainPointCategory,
  PainPointSeverity,
  MetricType,
  MetricDataSource,
  ImprovementCategory,
  ImprovementStatus,
  ImprovementPriority,
  ProcessSwimlaneKind,
};
