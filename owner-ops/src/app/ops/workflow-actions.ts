"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import {
  transitionOpportunityStage,
  createNextAction,
  completeNextAction,
  addNote,
  markResponseReviewed,
} from "@/lib/workflow";

export async function changeStageAction(formData: FormData): Promise<void> {
  const session = await requireOwnerSession();
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const stageSlug = String(formData.get("stageSlug") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!opportunityId || !stageSlug) return;
  await transitionOpportunityStage({
    opportunityId,
    stageSlug,
    actorUserId: session.userId,
    note: note || undefined,
  });
  revalidatePath("/ops");
  revalidatePath(`/ops/opportunities/${opportunityId}`);
}

export async function addNextActionAction(formData: FormData): Promise<void> {
  const session = await requireOwnerSession();
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dueAtRaw = String(formData.get("dueAt") ?? "");
  if (!opportunityId || !title) return;
  await createNextAction({
    opportunityId,
    title,
    description: description || undefined,
    dueAt: dueAtRaw ? new Date(dueAtRaw) : null,
    assigneeId: session.userId,
    actorUserId: session.userId,
  });
  revalidatePath("/ops");
  revalidatePath(`/ops/opportunities/${opportunityId}`);
}

export async function completeActionAction(formData: FormData): Promise<void> {
  const session = await requireOwnerSession();
  const actionId = String(formData.get("actionId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  if (!actionId) return;
  await completeNextAction(actionId, session.userId);
  revalidatePath("/ops");
  if (opportunityId) revalidatePath(`/ops/opportunities/${opportunityId}`);
}

export async function addNoteAction(formData: FormData): Promise<void> {
  const session = await requireOwnerSession();
  const body = String(formData.get("body") ?? "").trim();
  const opportunityId = String(formData.get("opportunityId") ?? "") || undefined;
  const contactId = String(formData.get("contactId") ?? "") || undefined;
  const companyId = String(formData.get("companyId") ?? "") || undefined;
  if (!body) return;
  await addNote({
    body,
    actorUserId: session.userId,
    opportunityId,
    contactId,
    companyId,
  });
  if (opportunityId) revalidatePath(`/ops/opportunities/${opportunityId}`);
  if (contactId) revalidatePath(`/ops/contacts/${contactId}`);
}

export async function markReviewedAction(formData: FormData): Promise<void> {
  const session = await requireOwnerSession();
  const responseId = String(formData.get("responseId") ?? "");
  const invitationId = String(formData.get("invitationId") ?? "");
  const internalNotes = String(formData.get("internalNotes") ?? "").trim();
  if (!responseId) return;
  await markResponseReviewed({
    responseId,
    actorUserId: session.userId,
    internalNotes: internalNotes || undefined,
  });
  if (invitationId) {
    revalidatePath(`/ops/forms/${invitationId}`);
    revalidatePath(`/ops/forms/${invitationId}/review`);
  }
}
