import { prisma } from "./db";
import { verifyPassword } from "./crypto";
import { recordAudit } from "./audit";

export async function authenticateOwner(
  email: string,
  password: string,
): Promise<{ id: string; email: string; name: string } | null> {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user || !user.isOwner) {
    await recordAudit({
      action: "auth.login_failed",
      actorLabel: normalized,
      details: { reason: "unknown_user_or_not_owner" },
    });
    return null;
  }

  const ok = verifyPassword(password, user.passwordHash);
  if (!ok) {
    await recordAudit({
      action: "auth.login_failed",
      actorUserId: user.id,
      actorLabel: user.email,
      details: { reason: "bad_password" },
    });
    return null;
  }

  await recordAudit({
    action: "auth.login_success",
    actorUserId: user.id,
    actorLabel: user.email,
  });

  return { id: user.id, email: user.email, name: user.name };
}
