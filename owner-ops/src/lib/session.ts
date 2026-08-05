import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  parseSessionValue,
  type SessionPayload,
} from "./session-token";

export {
  AuthError,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionValue,
  parseSessionValue,
  sessionCookieOptions,
  emailsMatch,
  type SessionPayload,
} from "./session-token";

/** Only allow same-app /ops paths — blocks open redirects. */
export function safeOpsReturnPath(
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (trimmed !== "/ops" && !trimmed.startsWith("/ops/")) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed.includes("://")) return null;
  if (trimmed.startsWith("/ops/login")) return null;
  if (/[\r\n\\]/.test(trimmed)) return null;
  return trimmed;
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const value = jar.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  return parseSessionValue(value);
}

/**
 * Owner HTML pages: redirect to login (never 500).
 */
export async function requireOwnerSession(options?: {
  returnTo?: string;
}): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    const next = safeOpsReturnPath(options?.returnTo);
    redirect(
      next ? `/ops/login?next=${encodeURIComponent(next)}` : "/ops/login",
    );
  }
  return session;
}

/**
 * Owner API / file routes: return null so caller can send 401.
 */
export async function requireOwnerApiSession(): Promise<SessionPayload | null> {
  return getSession();
}
