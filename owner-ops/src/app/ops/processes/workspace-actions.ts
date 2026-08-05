"use server";

import type {
  ImprovementCategory,
  ImprovementPriority,
  MetricDataSource,
  MetricType,
  PainPointCategory,
  PainPointSeverity,
  ProcessConnectionType,
  ProcessStepType,
  ProcessSwimlaneKind,
} from "@prisma/client";
import { requireOwnerSession } from "@/lib/session";
import { ProcessGraphError } from "@/lib/process-graph";
import {
  addConnection,
  addStep,
  deleteConnection,
  deleteDraftStep,
  updateConnection,
  updateDraftStep,
} from "@/lib/process-graph";
import {
  assignStepSwimlane,
  compareAsIsToFutureState,
  createImprovementOpportunity,
  createMetric,
  createPainPoint,
  createSwimlane,
  deriveFutureStateDraft,
  listRelatedProcessesForWorkspace,
  loadWorkspace,
  refineAsOwnerDraft,
  reorderSwimlanes,
  saveStepPositions,
  saveViewport,
  updateImprovementOpportunity,
  updateMetric,
  updatePainPoint,
  workspaceValidation,
} from "@/lib/process-workspace";

function errMsg(err: unknown) {
  if (err instanceof ProcessGraphError) return err.message;
  return "Something went wrong.";
}

async function owner() {
  return requireOwnerSession({ returnTo: "/ops/processes" });
}

export async function loadWorkspaceAction(processId: string, versionId?: string) {
  await owner();
  try {
    const data = await loadWorkspace(processId, versionId);
    return { ok: true as const, data };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function listRelatedProcessesAction(processId: string) {
  await owner();
  try {
    const data = await listRelatedProcessesForWorkspace(processId);
    return { ok: true as const, data };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function refineAction(versionId: string) {
  const session = await owner();
  try {
    const draft = await refineAsOwnerDraft(versionId, {
      actorUserId: session.userId,
      actorLabel: session.email,
    });
    return { ok: true as const, versionId: draft.id };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function deriveFutureAction(asIsVersionId: string) {
  const session = await owner();
  try {
    const draft = await deriveFutureStateDraft(asIsVersionId, {
      actorUserId: session.userId,
      actorLabel: session.email,
    });
    return { ok: true as const, versionId: draft.id };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function savePositionsAction(
  versionId: string,
  positions: Array<{ stepId: string; canvasX: number; canvasY: number }>,
) {
  await owner();
  try {
    await saveStepPositions(versionId, positions);
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function saveViewportAction(versionId: string, viewportJson: string) {
  await owner();
  try {
    await saveViewport(versionId, viewportJson);
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function createLaneAction(
  versionId: string,
  input: { name: string; kind?: ProcessSwimlaneKind },
) {
  await owner();
  try {
    const lane = await createSwimlane(versionId, input);
    return { ok: true as const, lane };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function reorderLanesAction(versionId: string, orderedIds: string[]) {
  await owner();
  try {
    const lanes = await reorderSwimlanes(versionId, orderedIds);
    return { ok: true as const, lanes };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function assignLaneAction(stepId: string, swimlaneId: string | null) {
  await owner();
  try {
    await assignStepSwimlane(stepId, swimlaneId);
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function addStepAction(
  versionId: string,
  input: {
    shortName: string;
    stepType: ProcessStepType;
    responsibleRole?: string;
    department?: string;
    toolOrSystem?: string;
    canvasX?: number;
    canvasY?: number;
    swimlaneId?: string;
  },
) {
  await owner();
  try {
    const step = await addStep(versionId, input);
    return { ok: true as const, step };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function updateStepAction(
  stepId: string,
  patch: Record<string, unknown>,
) {
  await owner();
  try {
    const step = await updateDraftStep(stepId, patch as never);
    return { ok: true as const, step };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function deleteStepAction(
  stepId: string,
  cleanupConnections?: boolean,
) {
  await owner();
  try {
    await deleteDraftStep(stepId, { cleanupConnections: Boolean(cleanupConnections) });
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function addConnectionAction(
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
  await owner();
  try {
    const conn = await addConnection(versionId, input);
    return { ok: true as const, connection: conn };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function updateConnectionAction(
  connectionId: string,
  patch: {
    connectionType?: ProcessConnectionType;
    displayLabel?: string | null;
    condition?: string | null;
    isDefaultPath?: boolean;
  },
) {
  await owner();
  try {
    const conn = await updateConnection(connectionId, patch);
    return { ok: true as const, connection: conn };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function deleteConnectionAction(connectionId: string) {
  await owner();
  try {
    await deleteConnection(connectionId);
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function createPainPointAction(
  versionId: string,
  input: {
    title: string;
    description?: string;
    category?: PainPointCategory;
    severity?: PainPointSeverity;
    processStepId?: string;
    estimatedFinancialImpact?: string;
    financialImpactSource?: string;
  },
) {
  await owner();
  try {
    const row = await createPainPoint(versionId, input);
    return { ok: true as const, painPoint: row };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function updatePainPointAction(
  id: string,
  patch: Parameters<typeof updatePainPoint>[1],
) {
  await owner();
  try {
    const row = await updatePainPoint(id, patch);
    return { ok: true as const, painPoint: row };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function createMetricAction(
  versionId: string,
  input: {
    name: string;
    metricType?: MetricType;
    currentValue?: string;
    unit?: string;
    targetValue?: string;
    dataSource?: MetricDataSource;
    processStepId?: string;
  },
) {
  await owner();
  try {
    const row = await createMetric(versionId, input);
    return { ok: true as const, metric: row };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function updateMetricAction(
  id: string,
  patch: Parameters<typeof updateMetric>[1],
) {
  await owner();
  try {
    const row = await updateMetric(id, patch);
    return { ok: true as const, metric: row };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function createOpportunityAction(
  versionId: string,
  input: {
    title: string;
    problemAddressed?: string;
    proposedChange?: string;
    category?: ImprovementCategory;
    priority?: ImprovementPriority;
    painPointId?: string;
    metricId?: string;
    processStepId?: string;
  },
) {
  await owner();
  try {
    const row = await createImprovementOpportunity(versionId, input);
    return { ok: true as const, opportunity: row };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function updateOpportunityAction(
  id: string,
  patch: Parameters<typeof updateImprovementOpportunity>[1],
) {
  await owner();
  try {
    const row = await updateImprovementOpportunity(id, patch);
    return { ok: true as const, opportunity: row };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function validateWorkspaceAction(versionId: string) {
  await owner();
  try {
    const result = await workspaceValidation(versionId);
    return { ok: true as const, result };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function compareVersionsAction(
  asIsVersionId: string,
  futureVersionId: string,
) {
  await owner();
  try {
    const comparison = await compareAsIsToFutureState(
      asIsVersionId,
      futureVersionId,
    );
    return { ok: true as const, comparison };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}
