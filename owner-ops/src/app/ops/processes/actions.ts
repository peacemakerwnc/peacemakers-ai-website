"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import {
  deriveFutureStateDraft,
  reopenAsNewDraft,
  updateDraftStep,
  ProcessGraphError,
} from "@/lib/process-graph";

export type ProcessActionState = { error?: string; ok?: string };

export async function deriveFutureAction(
  _prev: ProcessActionState,
  formData: FormData,
): Promise<ProcessActionState> {
  const session = await requireOwnerSession({ returnTo: "/ops/processes" });
  const versionId = String(formData.get("versionId") ?? "");
  const processId = String(formData.get("processId") ?? "");
  try {
    await deriveFutureStateDraft(versionId, {
      actorUserId: session.userId,
      actorLabel: session.email,
    });
    revalidatePath(`/ops/processes/${processId}`);
    return { ok: "Future-State draft derived" };
  } catch (e) {
    return {
      error: e instanceof ProcessGraphError ? e.message : "Derive failed",
    };
  }
}

export async function reopenVersionAction(
  _prev: ProcessActionState,
  formData: FormData,
): Promise<ProcessActionState> {
  const session = await requireOwnerSession({ returnTo: "/ops/processes" });
  const versionId = String(formData.get("versionId") ?? "");
  const processId = String(formData.get("processId") ?? "");
  try {
    await reopenAsNewDraft(versionId, {
      actorUserId: session.userId,
      actorLabel: session.email,
    });
    revalidatePath(`/ops/processes/${processId}`);
    return { ok: "New draft version created" };
  } catch (e) {
    return {
      error: e instanceof ProcessGraphError ? e.message : "Reopen failed",
    };
  }
}

export async function tryEditImmutableAction(
  _prev: ProcessActionState,
  formData: FormData,
): Promise<ProcessActionState> {
  await requireOwnerSession({ returnTo: "/ops/processes" });
  const stepId = String(formData.get("stepId") ?? "");
  const processId = String(formData.get("processId") ?? "");
  try {
    await updateDraftStep(stepId, {
      shortName: "SHOULD_NOT_SAVE",
    });
    revalidatePath(`/ops/processes/${processId}`);
    return { error: "Unexpected: immutable edit succeeded" };
  } catch (e) {
    return {
      ok:
        e instanceof ProcessGraphError
          ? `Blocked as expected: ${e.message}`
          : "Blocked",
    };
  }
}

export async function editDraftStepAction(
  _prev: ProcessActionState,
  formData: FormData,
): Promise<ProcessActionState> {
  await requireOwnerSession({ returnTo: "/ops/processes" });
  const stepId = String(formData.get("stepId") ?? "");
  const processId = String(formData.get("processId") ?? "");
  const shortName = String(formData.get("shortName") ?? "").trim();
  if (!shortName) return { error: "Name required" };
  try {
    await updateDraftStep(stepId, { shortName });
    revalidatePath(`/ops/processes/${processId}`);
    return { ok: "Draft step updated" };
  } catch (e) {
    return {
      error: e instanceof ProcessGraphError ? e.message : "Update failed",
    };
  }
}
