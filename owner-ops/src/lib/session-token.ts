import { createHmac, timingSafeEqual } from "crypto";
import { getEnv, isProduction } from "./env";
import { safeEqualString } from "./crypto";

export const SESSION_COOKIE = "owner_ops_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

export type SessionPayload = {
  userId: string;
  email: string;
  iat: number;
  exp: number;
};

function b64urlEncode(data: string): string {
  return Buffer.from(data, "utf8").toString("base64url");
}

function b64urlDecode(data: string): string {
  return Buffer.from(data, "base64url").toString("utf8");
}

function sign(payloadB64: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

export function createSessionValue(
  userId: string,
  email: string,
  ttlSeconds = SESSION_TTL_SECONDS,
  secret = getEnv().SESSION_SECRET,
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    userId,
    email,
    iat: now,
    exp: now + ttlSeconds,
  };
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const signature = sign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

export function parseSessionValue(
  value: string,
  secret = getEnv().SESSION_SECRET,
): SessionPayload | null {
  const [payloadB64, signature] = value.split(".");
  if (!payloadB64 || !signature) return null;

  const expected = sign(payloadB64, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(b64urlDecode(payloadB64)) as SessionPayload;
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: isProduction(),
    path: "/",
    maxAge,
  };
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function emailsMatch(a: string, b: string): boolean {
  return safeEqualString(a.toLowerCase(), b.toLowerCase());
}
