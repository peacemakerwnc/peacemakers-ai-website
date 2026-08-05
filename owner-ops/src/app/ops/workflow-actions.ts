"use server";

import { revalidatePath } from "next/cache";
import { MeetingStatus } from "@prisma/client";
import { requireOwnerSession } from "@/lib/session";
import {
  transitionOpportunityStage,
  createNextAction,
  completeNextAction,
  addNote,
  markResponseReviewed,
} from "@/lib/workflow";
import {
  createMeeting,
  updateMeeting,
  updateEstimatedValue,
  addProposedService,
  updateProposedService,
  deleteProposedService,
  WorkflowValidationError,
} from "@/lib/opportunity-ops";

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

export async function createMeetingAction(formData: FormData): Promise<void> {
  const session = await requireOwnerSession();
  const opportunityId = String(formData.get("opportunityId") ?? "");
  try {
    await createMeeting({
      opportunityId,
      actorUserId: session.userId,
      title: String(formData.get("title") ?? ""),
      meetingType: String(formData.get("meetingType") ?? "general"),
      scheduledAt: formData.get("scheduledAt")
        ? new Date(String(formData.get("scheduledAt")))
        : null,
      status: String(formData.get("status") ?? "SCHEDULED") as MeetingStatus,
      notes: String(formData.get("notes") ?? "") || null,
      locationOrUrl: String(formData.get("locationOrUrl") ?? "") || null,
    });
  } catch (e) {
    if (e instanceof WorkflowValidationError) return;
    throw e;
  }
  revalidatePath(`/ops/opportunities/${opportunityId}`);
  revalidatePath("/ops");
}

export async function updateMeetingAction(formData: FormData): Promise<void> {
  const session = await requireOwnerSession();
  const meetingId = String(formData.get("meetingId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  try {
    await updateMeeting({
      meetingId,
      actorUserId: session.userId,
      title: String(formData.get("title") ?? undefined),
      meetingType: String(formData.get("meetingType") ?? undefined),
      scheduledAt: formData.has("scheduledAt")
        ? formData.get("scheduledAt")
          ? new Date(String(formData.get("scheduledAt")))
          : null
        : undefined,
      status: formData.get("status")
        ? (String(formData.get("status")) as MeetingStatus)
        : undefined,
      notes: formData.has("notes")
        ? String(formData.get("notes") ?? "") || null
        : undefined,
      locationOrUrl: formData.has("locationOrUrl")
        ? String(formData.get("locationOrUrl") ?? "") || null
        : undefined,
    });
  } catch (e) {
    if (e instanceof WorkflowValidationError) return;
    throw e;
  }
  if (opportunityId) revalidatePath(`/ops/opportunities/${opportunityId}`);
  revalidatePath("/ops");
}

export async function updateEstimatedValueAction(
  formData: FormData,
): Promise<void> {
  const session = await requireOwnerSession();
  const opportunityId = String(formData.get("opportunityId") ?? "");
  try {
    await updateEstimatedValue({
      opportunityId,
      actorUserId: session.userId,
      rawValue: String(formData.get("estimatedValue") ?? ""),
    });
  } catch (e) {
    if (e instanceof WorkflowValidationError) return;
    throw e;
  }
  revalidatePath(`/ops/opportunities/${opportunityId}`);
  revalidatePath("/ops");
}

export async function addProposedServiceAction(
  formData: FormData,
): Promise<void> {
  const session = await requireOwnerSession();
  const opportunityId = String(formData.get("opportunityId") ?? "");
  try {
    await addProposedService({
      opportunityId,
      actorUserId: session.userId,
      name: String(formData.get("name") ?? ""),
      status: String(formData.get("status") ?? "proposed"),
      notes: String(formData.get("notes") ?? "") || null,
    });
  } catch (e) {
    if (e instanceof WorkflowValidationError) return;
    throw e;
  }
  revalidatePath(`/ops/opportunities/${opportunityId}`);
}

export async function updateProposedServiceAction(
  formData: FormData,
): Promise<void> {
  const session = await requireOwnerSession();
  const serviceId = String(formData.get("serviceId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  try {
    await updateProposedService({
      serviceId,
      actorUserId: session.userId,
      name: String(formData.get("name") ?? undefined),
      status: String(formData.get("status") ?? undefined),
      notes: formData.has("notes")
        ? String(formData.get("notes") ?? "") || null
        : undefined,
    });
  } catch (e) {
    if (e instanceof WorkflowValidationError) return;
    throw e;
  }
  if (opportunityId) revalidatePath(`/ops/opportunities/${opportunityId}`);
}

export async function deleteProposedServiceAction(
  formData: FormData,
): Promise<void> {
  const session = await requireOwnerSession();
  const serviceId = String(formData.get("serviceId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  try {
    await deleteProposedService({
      serviceId,
      actorUserId: session.userId,
    });
  } catch (e) {
    if (e instanceof WorkflowValidationError) return;
    throw e;
  }
  if (opportunityId) revalidatePath(`/ops/opportunities/${opportunityId}`);
}
