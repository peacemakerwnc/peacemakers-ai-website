import { prisma } from "./db";

export type AuditInput = {
  action: string;
  actorUserId?: string | null;
  actorLabel?: string;
  entityType?: string;
  entityId?: string;
  /** Must never include passwords, tokens, form answers, or file contents. */
  details?: Record<string, unknown>;
};

const FORBIDDEN_DETAIL_KEYS = new Set([
  "password",
  "passwordHash",
  "token",
  "rawToken",
  "session",
  "sessionSecret",
  "payload",
  "payloadJson",
  "fileContents",
  "contents",
  "body",
]);

function sanitizeDetails(
  details: Record<string, unknown> | undefined,
): string {
  if (!details) return "{}";
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(details)) {
    if (FORBIDDEN_DETAIL_KEYS.has(key)) continue;
    if (typeof value === "string" && value.length > 500) {
      clean[key] = `${value.slice(0, 500)}…`;
      continue;
    }
    clean[key] = value;
  }
  return JSON.stringify(clean);
}

export async function recordAudit(input: AuditInput): Promise<void> {
  await prisma.auditEvent.create({
    data: {
      action: input.action,
      actorUserId: input.actorUserId ?? null,
      actorLabel: input.actorLabel ?? "system",
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      detailsJson: sanitizeDetails(input.details),
    },
  });
}
