"use server";

import { headers } from "next/headers";
import { InvitationError } from "@/lib/invitations";
import { ProcessGraphError } from "@/lib/process-graph";
import { rateLimit } from "@/lib/rate-limit";
import type {
  ProcessConnectionType,
  ProcessStepType,
} from "@prisma/client";
import {
  addClientParticipant,
  addClientPath,
  addClientStep,
  connectNextStep,
  createClientProcess,
  deleteClientStep,
  duplicateClientStep,
  evaluateClientProcessCompleteness,
  listClientProcesses,
  removeClientPath,
  reorderClientSteps,
  updateClientProcessOverview,
  updateClientStep,
} from "@/lib/client-process-builder";
import { resolveInvitationByRawToken } from "@/lib/invitations";

async function clientKey(tokenPrefix: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `proc:${ip}:${tokenPrefix}`;
}

function errMsg(err: unknown) {
  if (err instanceof ProcessGraphError || err instanceof InvitationError) {
    return err.message;
  }
  return "Something went wrong. Please try again.";
}

export async function listProcessesAction(token: string) {
  try {
    const invitation = await resolveInvitationByRawToken(token);
    const limited = rateLimit(await clientKey(invitation.tokenPrefix), 60, 60_000);
    if (!limited.ok) return { ok: false as const, error: "Too many requests." };
    const { versions } = await listClientProcesses(token);
    return {
      ok: true as const,
      processes: versions.map((v) => ({
        versionId: v.id,
        processId: v.processId,
        name: v.process.name,
        purpose: v.purpose ?? v.process.purpose,
        outcome: v.outcome ?? v.process.customerOutcome,
        startTrigger: v.startTrigger,
        endEvent: v.endEvent,
        status: v.status,
        stepCount: v.steps.length,
        connectionCount: v.connections.length,
        participantCount: v.participants.length,
        steps: v.steps,
        connections: v.connections,
        participants: v.participants,
      })),
    };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function createProcessAction(
  token: string,
  input: {
    name: string;
    purpose?: string;
    customerOutcome?: string;
    startTrigger?: string;
    endEvent?: string;
    processOwner?: string;
  },
) {
  try {
    const created = await createClientProcess(token, input);
    return {
      ok: true as const,
      versionId: created.version.id,
      processId: created.process.id,
    };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function updateProcessOverviewAction(
  token: string,
  versionId: string,
  patch: {
    name?: string;
    purpose?: string;
    customerOutcome?: string;
    startTrigger?: string;
    endEvent?: string;
    processOwner?: string;
  },
) {
  try {
    await updateClientProcessOverview(token, versionId, patch);
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function addParticipantAction(
  token: string,
  versionId: string,
  input: { role?: string; personLabel?: string; department?: string },
) {
  try {
    const p = await addClientParticipant(token, versionId, input);
    return { ok: true as const, id: p.id };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function addStepAction(
  token: string,
  versionId: string,
  input: {
    shortName: string;
    stepType: ProcessStepType;
    detailedDescription?: string;
    responsibleRole?: string;
    department?: string;
    toolOrSystem?: string;
    afterStepId?: string;
    connectFromPrevious?: boolean;
    discussDuringBlueprint?: boolean;
    expectedWorkTime?: string;
    typicalWaitingTime?: string;
  },
) {
  try {
    const step = await addClientStep(token, versionId, {
      ...input,
      stepType: input.stepType,
    });
    return { ok: true as const, step };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function updateStepAction(
  token: string,
  stepId: string,
  patch: Record<string, unknown>,
) {
  try {
    const step = await updateClientStep(token, stepId, patch as never);
    return { ok: true as const, step };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function duplicateStepAction(token: string, stepId: string) {
  try {
    const step = await duplicateClientStep(token, stepId);
    return { ok: true as const, step };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function reorderStepsAction(
  token: string,
  versionId: string,
  orderedStepIds: string[],
) {
  try {
    const steps = await reorderClientSteps(token, versionId, orderedStepIds);
    return { ok: true as const, steps };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function deleteStepAction(
  token: string,
  stepId: string,
  cleanupConnections?: boolean,
) {
  try {
    await deleteClientStep(token, stepId, { cleanupConnections });
    return { ok: true as const };
  } catch (err) {
    if (err instanceof ProcessGraphError && err.code === "conflict") {
      return {
        ok: false as const,
        error: err.message,
        needsCleanup: true as const,
      };
    }
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function connectNextAction(
  token: string,
  versionId: string,
  sourceStepId: string,
  targetStepId: string,
) {
  try {
    const c = await connectNextStep(token, versionId, sourceStepId, targetStepId);
    return { ok: true as const, connection: c };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function addPathAction(
  token: string,
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
  try {
    const c = await addClientPath(token, versionId, input);
    return { ok: true as const, connection: c };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function removePathAction(token: string, connectionId: string) {
  try {
    await removeClientPath(token, connectionId);
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}

export async function completenessAction(token: string, versionId: string) {
  try {
    await listClientProcesses(token); // auth
    const result = await evaluateClientProcessCompleteness(versionId);
    return { ok: true as const, ...result };
  } catch (err) {
    return { ok: false as const, error: errMsg(err) };
  }
}
