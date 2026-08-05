"use server";

import { headers } from "next/headers";
import {
  resolveInvitationByRawToken,
  recordFormOpened,
  InvitationError,
} from "@/lib/invitations";
import {
  saveDraftByToken,
  submitByToken,
  ResponseLockedError,
} from "@/lib/responses";
import { rateLimit } from "@/lib/rate-limit";
import { getStorageAdapter, FileValidationError } from "@/lib/storage";
import { prisma } from "@/lib/db";
import { FormInvitationStatus } from "@prisma/client";
import { recordAudit } from "@/lib/audit";

async function clientKey(tokenPrefix: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `${ip}:${tokenPrefix}`;
}

export async function openFormAction(token: string) {
  try {
    const invitation = await resolveInvitationByRawToken(token);
    const limited = rateLimit(await clientKey(invitation.tokenPrefix), 60, 60_000);
    if (!limited.ok) {
      return { ok: false as const, error: "Too many requests. Please wait." };
    }
    await recordFormOpened(invitation.id);
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
    };
  } catch (err) {
    if (err instanceof InvitationError) {
      return { ok: false as const, error: err.message, code: err.code };
    }
    return { ok: false as const, error: "Unable to open form." };
  }
}

export async function saveDraftAction(token: string, payload: unknown) {
  try {
    const invitation = await resolveInvitationByRawToken(token);
    const limited = rateLimit(
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
    };
  } catch (err) {
    if (err instanceof ResponseLockedError) {
      return { ok: false as const, error: err.message, locked: true };
    }
    if (err instanceof InvitationError) {
      return { ok: false as const, error: err.message };
    }
    return { ok: false as const, error: "Could not save draft." };
  }
}

export async function submitFormAction(token: string, payload: unknown) {
  try {
    const invitation = await resolveInvitationByRawToken(token);
    const limited = rateLimit(
      `submit:${await clientKey(invitation.tokenPrefix)}`,
      10,
      60_000,
    );
    if (!limited.ok) {
      return { ok: false as const, error: "Too many submit attempts." };
    }
    await submitByToken(token, payload);
    return { ok: true as const };
  } catch (err) {
    if (err instanceof ResponseLockedError) {
      return { ok: false as const, error: err.message, locked: true };
    }
    if (err instanceof InvitationError) {
      return { ok: false as const, error: err.message };
    }
    return { ok: false as const, error: "Could not submit form." };
  }
}

export async function uploadFormFileAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const category = String(formData.get("category") ?? "supporting");
  const file = formData.get("file");

  if (!token || !(file instanceof File)) {
    return { ok: false as const, error: "Missing file or token." };
  }

  try {
    const invitation = await resolveInvitationByRawToken(token);
    if (invitation.status === FormInvitationStatus.SUBMITTED) {
      return { ok: false as const, error: "Form already submitted." };
    }

    const limited = rateLimit(
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
        formResponseId: draft?.id ?? null,
        uploadedByOwner: false,
      },
    });

    await recordAudit({
      action: "file.uploaded",
      actorLabel: "client",
      entityType: "FileAttachment",
      entityId: attachment.id,
      details: {
        invitationId: invitation.id,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        // never log originalName if it could contain sensitive info — keep basename only
        nameLength: stored.originalName.length,
      },
    });

    return {
      ok: true as const,
      file: {
        id: attachment.id,
        originalName: attachment.originalName,
        sizeBytes: attachment.sizeBytes,
        mimeType: attachment.mimeType,
      },
    };
  } catch (err) {
    if (err instanceof FileValidationError || err instanceof InvitationError) {
      return { ok: false as const, error: err.message };
    }
    return { ok: false as const, error: "Upload failed." };
  }
}
