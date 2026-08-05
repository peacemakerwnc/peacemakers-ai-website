"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import { createContactCompanyOpportunity } from "@/lib/crm";
import {
  createInvitation,
  markInvitationSent,
  revokeInvitation,
  regenerateInvitation,
} from "@/lib/invitations";
import { getEmailAdapter } from "@/lib/mail";
import { reopenSubmittedResponse } from "@/lib/responses";

export async function createLeadAndInvitationAction(formData: FormData) {
  const session = await requireOwnerSession();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const sendNow = formData.get("sendNow") === "on";

  if (!firstName || !lastName || !email || !companyName) {
    return { ok: false as const, error: "Required fields missing." };
  }

  const lead = await createContactCompanyOpportunity({
    firstName,
    lastName,
    email,
    phone: phone || undefined,
    companyName,
    ownerUserId: session.userId,
    stageSlug: "blueprint-form-not-sent",
  });

  const invitation = await createInvitation({
    contactId: lead.contact.id,
    opportunityId: lead.opportunity.id,
    actorUserId: session.userId,
  });

  if (sendNow) {
    await markInvitationSent(invitation.invitation.id, session.userId);
    await getEmailAdapter().send({
      to: email,
      subject: "Your Business Blueprint Preparation form",
      text: `Please complete your Business Blueprint Preparation form:\n\n${invitation.formUrl}\n\nYou can save and continue later.`,
      tags: ["blueprint-invite"],
    });
  }

  revalidatePath("/ops/forms");
  return {
    ok: true as const,
    invitationId: invitation.invitation.id,
    formUrl: invitation.formUrl,
    rawTokenShownOnce: invitation.rawToken,
    opportunityId: lead.opportunity.id,
    contactId: lead.contact.id,
  };
}

export async function revokeInvitationAction(invitationId: string) {
  const session = await requireOwnerSession();
  await revokeInvitation(invitationId, session.userId);
  revalidatePath("/ops/forms");
  return { ok: true as const };
}

export async function regenerateInvitationAction(invitationId: string) {
  const session = await requireOwnerSession();
  const created = await regenerateInvitation(invitationId, session.userId);
  revalidatePath("/ops/forms");
  return {
    ok: true as const,
    invitationId: created.invitation.id,
    formUrl: created.formUrl,
    rawTokenShownOnce: created.rawToken,
  };
}

export async function resendInvitationAction(
  invitationId: string,
  formUrl: string,
  email: string,
) {
  const session = await requireOwnerSession();
  await markInvitationSent(invitationId, session.userId);
  await getEmailAdapter().send({
    to: email,
    subject: "Reminder: Business Blueprint Preparation form",
    text: `Your secure form link:\n\n${formUrl}\n\nYou can save and continue later.`,
    tags: ["blueprint-invite-resend"],
  });
  revalidatePath("/ops/forms");
  return { ok: true as const };
}

export async function reopenFormAction(invitationId: string) {
  const session = await requireOwnerSession();
  await reopenSubmittedResponse(invitationId, session.userId);
  revalidatePath("/ops/forms");
  return { ok: true as const };
}
