/**
 * Rate limiting for pilot.
 * - memory: local/dev and single-instance only (not claimed as distributed)
 * - upstash: REST Redis for serverless multi-instance
 */

import { getEnv } from "./env";
import { captureEvent } from "./monitoring";

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
  backend: "memory" | "upstash";
};

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function memoryLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: 0, backend: "memory" };
  }
  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterMs: Math.max(0, existing.resetAt - now),
      backend: "memory",
    };
  }
  existing.count += 1;
  return {
    ok: true,
    remaining: limit - existing.count,
    retryAfterMs: 0,
    backend: "memory",
  };
}

async function upstashLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const env = getEnv();
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    // Fail closed in production-oriented upstash mode if misconfigured.
    return {
      ok: false,
      remaining: 0,
      retryAfterMs: windowMs,
      backend: "upstash",
    };
  }

  const redisKey = `rl:${key}`;
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));

  try {
    const incr = await fetch(`${url}/incr/${encodeURIComponent(redisKey)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!incr.ok) {
      captureEvent({
        type: "rate_limit.backend_error",
        level: "warn",
        context: { status: incr.status },
      });
      // Fail open to memory for availability during provider blips on pilot.
      return memoryLimit(key, limit, windowMs);
    }
    const incrJson = (await incr.json()) as { result?: number };
    const count = Number(incrJson.result ?? 0);
    if (count === 1) {
      await fetch(
        `${url}/expire/${encodeURIComponent(redisKey)}/${windowSec}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    }
    if (count > limit) {
      return {
        ok: false,
        remaining: 0,
        retryAfterMs: windowMs,
        backend: "upstash",
      };
    }
    return {
      ok: true,
      remaining: Math.max(0, limit - count),
      retryAfterMs: 0,
      backend: "upstash",
    };
  } catch {
    captureEvent({
      type: "rate_limit.backend_exception",
      level: "warn",
    });
    return memoryLimit(key, limit, windowMs);
  }
}

/**
 * Synchronous memory limiter — used by existing call sites and tests.
 * Prefer checkRateLimit for new production paths.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  return memoryLimit(key, limit, windowMs);
}

/** Async limiter that uses configured backend. */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const backend = getEnv().RATE_LIMIT_BACKEND;
  const result =
    backend === "upstash"
      ? await upstashLimit(key, limit, windowMs)
      : memoryLimit(key, limit, windowMs);
  if (!result.ok) {
    captureEvent({
      type: "rate_limit.blocked",
      level: "warn",
      context: {
        backend: result.backend,
        // Hash-like truncation of key without exposing tokens
        keyKind: key.split(":")[0] ?? "unknown",
      },
    });
  }
  return result;
}

/** Test helper */
export function resetRateLimits(): void {
  buckets.clear();
}
