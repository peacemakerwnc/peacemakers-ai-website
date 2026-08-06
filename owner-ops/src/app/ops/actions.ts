"use server";

import { cookies, headers } from "next/headers";
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
import { checkRateLimit } from "@/lib/rate-limit";
import { captureEvent } from "@/lib/monitoring";

export async function loginAction(
  _prevState: { error: "invalid" | "rate_limited" } | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const safeNext =
    safeOpsReturnPath(String(formData.get("next") ?? "")) ?? "/ops";

  try {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const limited = await checkRateLimit(`login:${ip}`, 10, 15 * 60_000);
    if (!limited.ok) {
      captureEvent({
        type: "auth.login_rate_limited",
        level: "warn",
        context: { ipPresent: ip !== "local" },
      });
      return { error: "rate_limited" as const };
    }

    const user = await authenticateOwner(email, password);
    if (!user) {
      captureEvent({
        type: "auth.login_failed",
        level: "warn",
        context: { emailDomain: email.includes("@") ? email.split("@")[1] : "none" },
      });
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
