"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateOwner } from "@/lib/auth";
import {
  SESSION_COOKIE,
  createSessionValue,
  sessionCookieOptions,
  safeOpsReturnPath,
  getSession,
} from "@/lib/session";
import { recordAudit } from "@/lib/audit";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const safeNext = safeOpsReturnPath(String(formData.get("next") ?? "")) ?? "/ops";

  const user = await authenticateOwner(email, password);
  if (!user) {
    return { error: "invalid" as const };
  }

  const jar = await cookies();
  jar.set(
    SESSION_COOKIE,
    createSessionValue(user.id, user.email),
    sessionCookieOptions(),
  );

  redirect(safeNext);
}

export async function logoutAction() {
  const session = await getSession();
  if (session) {
    await recordAudit({
      action: "auth.logout",
      actorUserId: session.userId,
      actorLabel: session.email,
    });
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  redirect("/ops/login");
}
