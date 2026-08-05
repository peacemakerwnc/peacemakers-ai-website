"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { authenticateOwner } from "@/lib/auth";
import {
  SESSION_COOKIE,
  createSessionValue,
  sessionCookieOptions,
  safeOpsReturnPath,
  getSession,
} from "@/lib/session";
import { recordAudit } from "@/lib/audit";

export async function loginAction(
  _prevState: { error: "invalid" } | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const safeNext =
    safeOpsReturnPath(String(formData.get("next") ?? "")) ?? "/ops";

  try {
    const user = await authenticateOwner(email, password);
    if (!user) {
      return { error: "invalid" as const };
    }

    const jar = await cookies();
    const sessionValue = createSessionValue(user.id, user.email);
    jar.set(SESSION_COOKIE, sessionValue, sessionCookieOptions());

    redirect(safeNext);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    return { error: "invalid" as const };
  }
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
