"use server";

import { headers } from "next/headers";
import {
  resolveInvitationByRawToken,
  recordFormOpened,
  acknowledgePrivacyNotice,
  getPrivacyAckState,
  InvitationError,
} from "@/lib/invitations";
import {
  saveDraftByToken,
  submitByToken,
  ResponseLockedError,
} from "@/lib/responses";
import { checkRateLimit } from "@/lib/rate-limit";
import { getStorageAdapter, FileValidationError } from "@/lib/storage";
import { prisma } from "@/lib/db";
import { FormInvitationStatus } from "@prisma/client";
import { recordAudit } from "@/lib/audit";
import { getEnv, isProduction } from "@/lib/env";
import { PRIVACY_NOTICE_VERSION } from "@/lib/privacy";
import { captureError, captureEvent, newCorrelationId } from "@/lib/monitoring";

async function clientKey(tokenPrefix: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `${ip}:${tokenPrefix}`;
}

export async function openFormAction(token: string) {
  const correlationId = newCorrelationId();
  try {
    const invitation = await resolveInvitationByRawToken(token);
    const limited = await checkRateLimit(
      `open:${await clientKey(invitation.tokenPrefix)}`,
      60,
      60_000,
    );
    if (!limited.ok) {
      return { ok: false as const, error: "Too many requests. Please wait." };
    }
    await recordFormOpened(invitation.id);
    const privacy = await getPrivacyAckState(invitation.id);
    const draft = invitation.responses.find((r) => r.status === "DRAFT");
    const submitted = invitation.responses.find((r) => r.status === "SUBMITTED");
    const active = draft ?? submitted;
    return {
      ok: true as const,
      status: invitation.status,
      completionPct: invitation.completionPct,
      submitted: invitation.status === FormInvitationStatus.SUBMITTED,
      contactFirstName: invitation.contact.firstName,
      companyName: invitation.opportunity.company.name,
      payload: active ? JSON.parse(active.payloadJson) : {},
      lastSavedAt: invitation.lastSavedAt?.toISOString() ?? null,
      privacyAcknowledged: Boolean(privacy.privacyAcknowledgedAt),
      privacyNoticeVersion:
        privacy.privacyNoticeVersion ?? PRIVACY_NOTICE_VERSION,
      expectedPrivacyVersion: PRIVACY_NOTICE_VERSION,
      correlationId,
    };
  } catch (err) {
    if (err instanceof InvitationError) {
      return { ok: false as const, error: err.message, code: err.code };
    }
    captureError("form.open_failed", err, undefined, correlationId);
    return { ok: false as const, error: "Unable to open form." };
  }
}

export async function acknowledgePrivacyAction(
  token: string,
  noticeVersion: string,
) {
  try {
    const invitation = await resolveInvitationByRawToken(token);
    const limited = await checkRateLimit(
      `privacy:${await clientKey(invitation.tokenPrefix)}`,
      30,
      60_000,
    );
    if (!limited.ok) {
      return { ok: false as const, error: "Too many requests. Please wait." };
    }
    if (noticeVersion !== PRIVACY_NOTICE_VERSION) {
      return { ok: false as const, error: "Privacy notice version mismatch." };
    }
    await acknowledgePrivacyNotice(invitation.id, noticeVersion);
    return {
      ok: true as const,
      noticeVersion,
      acknowledgedAt: new Date().toISOString(),
    };
  } catch (err) {
    if (err instanceof InvitationError) {
      return { ok: false as const, error: err.message };
    }
    captureError("form.privacy_ack_failed", err);
    return { ok: false as const, error: "Could not record acknowledgement." };
  }
}

export async function saveDraftAction(token: string, payload: unknown) {
  const correlationId = newCorrelationId();
  try {
    const invitation = await resolveInvitationByRawToken(token);
    const limited = await checkRateLimit(
      `save:${await clientKey(invitation.tokenPrefix)}`,
      120,
      60_000,
    );
    if (!limited.ok) {
      return { ok: false as const, error: "Saving too quickly. Please wait." };
    }
    const result = await saveDraftByToken(token, payload);
    return {
      ok: true as const,
      completionPct: result.completionPct,
      savedAt: new Date().toISOString(),
      correlationId,
    };
  } catch (err) {
    if (err instanceof ResponseLockedError) {
      return { ok: false as const, error: err.message, locked: true };
    }
    if (err instanceof InvitationError) {
      return { ok: false as const, error: err.message };
    }
    captureError("form.save_failed", err, undefined, correlationId);
    return {
      ok: false as const,
      error: "Could not save draft. Your latest answers are still on this page — retry shortly.",
      correlationId,
    };
  }
}

export async function submitFormAction(token: string, payload: unknown) {
  const correlationId = newCorrelationId();
  try {
    const invitation = await resolveInvitationByRawToken(token);
    const privacy = await getPrivacyAckState(invitation.id);
    if (!privacy.privacyAcknowledgedAt) {
      return {
        ok: false as const,
        error: "Please acknowledge the privacy notice before submitting.",
      };
    }
    const limited = await checkRateLimit(
      `submit:${await clientKey(invitation.tokenPrefix)}`,
      10,
      60_000,
    );
    if (!limited.ok) {
      return { ok: false as const, error: "Too many submit attempts." };
    }
    await submitByToken(token, payload);
    captureEvent({
      type: "form.submitted",
      correlationId,
      context: { tokenPrefix: invitation.tokenPrefix },
    });
    return { ok: true as const, correlationId };
  } catch (err) {
    if (err instanceof ResponseLockedError) {
      return { ok: false as const, error: err.message, locked: true };
    }
    if (err instanceof InvitationError) {
      return { ok: false as const, error: err.message };
    }
    captureError("form.submit_failed", err, undefined, correlationId);
    return {
      ok: false as const,
      error: "Could not submit form. Your draft remains available — retry shortly.",
      correlationId,
    };
  }
}

export async function uploadFormFileAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const category = String(formData.get("category") ?? "supporting");
  const file = formData.get("file");

  if (!token || !(file instanceof File)) {
    return { ok: false as const, error: "Missing file or token." };
  }

  if (isProduction() && getEnv().DISABLE_CLIENT_UPLOADS) {
    return {
      ok: false as const,
      error:
        "File uploads are disabled for this pilot. Paste descriptions in the notes field instead.",
    };
  }

  try {
    const invitation = await resolveInvitationByRawToken(token);
    if (invitation.status === FormInvitationStatus.SUBMITTED) {
      return { ok: false as const, error: "Form already submitted." };
    }

    const limited = await checkRateLimit(
      `upload:${await clientKey(invitation.tokenPrefix)}`,
      20,
      60_000,
    );
    if (!limited.ok) {
      return { ok: false as const, error: "Upload rate limit exceeded." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await getStorageAdapter().store({
      originalName: file.name,
      mimeType: file.type || "application/octet-stream",
      buffer,
    });

    const draft = invitation.responses.find((r) => r.status === "DRAFT");
    const attachment = await prisma.fileAttachment.create({
      data: {
        storageKey: stored.storageKey,
        originalName: stored.originalName,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        sha256: stored.sha256,
        accessLevel: "INVITATION_SCOPED",
        category,
        companyId: invitation.opportunity.companyId,
        contactId: invitation.contactId,
        opportunityId: invitation.opportunityId,
        invitationId: invitation.id,
        formResponseId: draft?.id,
      },
    });

    await recordAudit({
      action: "form.file_uploaded",
      entityType: "FileAttachment",
      entityId: attachment.id,
      details: {
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
        tokenPrefix: invitation.tokenPrefix,
      },
    });

    return {
      ok: true as const,
      file: {
        id: attachment.id,
        originalName: attachment.originalName,
        sizeBytes: attachment.sizeBytes,
      },
    };
  } catch (err) {
    if (err instanceof FileValidationError) {
      return { ok: false as const, error: err.message };
    }
    if (err instanceof InvitationError) {
      return { ok: false as const, error: err.message };
    }
    captureError("form.upload_failed", err);
    return { ok: false as const, error: "Upload failed." };
  }
}
