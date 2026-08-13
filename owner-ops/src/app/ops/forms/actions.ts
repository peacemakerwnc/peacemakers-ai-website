"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireOwnerSession } from "@/lib/session";
import { createContactCompanyOpportunity } from "@/lib/crm";
import {
  createInvitation,
  markInvitationSent,
  revokeInvitation,
  regenerateInvitation,
  recordInvitationEmailResult,
  getLastEmailSentAt,
} from "@/lib/invitations";
import { getEmailAdapter } from "@/lib/mail";
import { buildInvitationEmail } from "@/lib/invite-email";
import { reopenSubmittedResponse } from "@/lib/responses";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";
import { captureError, captureEvent } from "@/lib/monitoring";

async function ownerRateKey(userId: string, action: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `owner:${action}:${userId}:${ip}`;
}

export async function createLeadAndInvitationAction(formData: FormData) {
  const session = await requireOwnerSession();
  const limited = await checkRateLimit(
    await ownerRateKey(session.userId, "invite_create"),
    20,
    60_000,
  );
  if (!limited.ok) {
    return { ok: false as const, error: "Too many invitation actions. Please wait." };
  }

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
    stageSlug: "agreement-sent",
  });

  const invitation = await createInvitation({
    contactId: lead.contact.id,
    opportunityId: lead.opportunity.id,
    actorUserId: session.userId,
  });

  if (sendNow) {
    const sendLimited = await checkRateLimit(
      await ownerRateKey(session.userId, "invite_send"),
      5,
      60_000,
    );
    if (!sendLimited.ok) {
      return {
        ok: false as const,
        error: "Invitation created but send rate-limited. Resend shortly.",
        invitationId: invitation.invitation.id,
        formUrl: invitation.formUrl,
        rawTokenShownOnce: invitation.rawToken,
        opportunityId: lead.opportunity.id,
        contactId: lead.contact.id,
      };
    }

    const content = buildInvitationEmail({
      to: email,
      recipientFirstName: firstName,
      companyName,
      formUrl: invitation.formUrl,
      expiresAt: invitation.invitation.expiresAt,
      kind: "initial",
    });
    const sent = await getEmailAdapter().send(content);
    if (!sent.ok) {
      captureError("invite.email_failed", new Error(sent.error ?? "send failed"));
      return {
        ok: false as const,
        error: "Invitation created but email failed. You can resend from Forms.",
        invitationId: invitation.invitation.id,
        formUrl: invitation.formUrl,
        rawTokenShownOnce: invitation.rawToken,
        opportunityId: lead.opportunity.id,
        contactId: lead.contact.id,
      };
    }
    await markInvitationSent(invitation.invitation.id, session.userId);
    await recordInvitationEmailResult(invitation.invitation.id, sent);
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
  const limited = await checkRateLimit(
    await ownerRateKey(session.userId, "invite_revoke"),
    30,
    60_000,
  );
  if (!limited.ok) {
    return { ok: false as const, error: "Too many requests." };
  }
  await revokeInvitation(invitationId, session.userId);
  revalidatePath("/ops/forms");
  return { ok: true as const };
}

export async function regenerateInvitationAction(invitationId: string) {
  const session = await requireOwnerSession();
  const limited = await checkRateLimit(
    await ownerRateKey(session.userId, "invite_reissue"),
    10,
    60_000,
  );
  if (!limited.ok) {
    return { ok: false as const, error: "Too many reissue attempts." };
  }
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
  const limited = await checkRateLimit(
    await ownerRateKey(session.userId, "invite_send"),
    5,
    60_000,
  );
  if (!limited.ok) {
    return { ok: false as const, error: "Email send rate-limited. Please wait." };
  }

  const invitation = await prisma.formInvitation.findUnique({
    where: { id: invitationId },
    include: { contact: true, opportunity: { include: { company: true } } },
  });
  if (!invitation) {
    return { ok: false as const, error: "Invitation not found." };
  }

  // Anti-duplicate: block resend within 60s of last successful send
  const lastSent = await getLastEmailSentAt(invitationId);
  if (lastSent && Date.now() - lastSent.getTime() < 60_000) {
    return {
      ok: false as const,
      error: "An email was just sent. Wait a minute before resending.",
    };
  }

  const content = buildInvitationEmail({
    to: email,
    recipientFirstName: invitation.contact.firstName,
    companyName: invitation.opportunity.company.name,
    formUrl,
    expiresAt: invitation.expiresAt,
    kind: "reminder",
  });
  const sent = await getEmailAdapter().send(content);
  if (!sent.ok) {
    captureEvent({
      type: "invite.email_failed",
      level: "error",
      context: { tokenPrefix: invitation.tokenPrefix },
    });
    return { ok: false as const, error: "Email provider failed. Try again later." };
  }

  await markInvitationSent(invitationId, session.userId);
  await recordInvitationEmailResult(invitationId, sent);
  revalidatePath("/ops/forms");
  return { ok: true as const, messageId: sent.messageId, provider: sent.provider };
}

export async function reopenFormAction(invitationId: string) {
  const session = await requireOwnerSession();
  await reopenSubmittedResponse(invitationId, session.userId);
  revalidatePath("/ops/forms");
  return { ok: true as const };
}
