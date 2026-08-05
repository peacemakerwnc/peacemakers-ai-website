import { cookies } from "next/headers";
import {
  AuthError,
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

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const value = jar.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  return parseSessionValue(value);
}

export async function requireOwnerSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new AuthError("Authentication required");
  }
  return session;
}
