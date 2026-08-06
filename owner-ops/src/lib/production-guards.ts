import { getEnv, isProduction } from "./env";

export type ProductionGuardResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Fail closed for production pilot configuration.
 * Call during health readiness and deployment checks.
 */
export function assertProductionConfig(): ProductionGuardResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const env = getEnv();

  if (!isProduction()) {
    return { ok: true, errors, warnings: ["Not production — guards skipped"] };
  }

  const db = env.DATABASE_URL;
  if (db.startsWith("file:") || db.includes("sqlite")) {
    errors.push("DATABASE_URL must be managed Postgres in production (not SQLite file:)");
  }
  if (!/^postgres(ql)?:\/\//i.test(db)) {
    errors.push("DATABASE_URL must use postgres:// or postgresql:// in production");
  }

  if (env.SESSION_SECRET.includes("dev-only") || env.SESSION_SECRET.length < 32) {
    errors.push("SESSION_SECRET must be a unique production secret (32+ chars)");
  }

  if (env.OWNER_PASSWORD === "change-me-before-use" || env.OWNER_PASSWORD.length < 12) {
    errors.push("OWNER_PASSWORD must be a strong production password");
  }

  if (env.APP_BASE_URL.startsWith("http://") && !env.APP_BASE_URL.includes("localhost")) {
    errors.push("APP_BASE_URL must use HTTPS in production");
  }

  if (env.EMAIL_PROVIDER === "log" && !env.ALLOW_LOG_EMAIL_IN_PRODUCTION) {
    errors.push(
      "EMAIL_PROVIDER=log is not allowed in production without ALLOW_LOG_EMAIL_IN_PRODUCTION=true",
    );
  }

  if (env.EMAIL_PROVIDER === "resend" && !env.RESEND_API_KEY) {
    errors.push("RESEND_API_KEY is required when EMAIL_PROVIDER=resend");
  }

  if (env.RATE_LIMIT_BACKEND === "memory") {
    warnings.push(
      "RATE_LIMIT_BACKEND=memory is not distributed across serverless instances",
    );
  }

  if (env.RATE_LIMIT_BACKEND === "upstash") {
    if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
      errors.push("Upstash Redis URL and token required for RATE_LIMIT_BACKEND=upstash");
    }
  }

  if (env.STORAGE_ROOT.startsWith("./") || env.STORAGE_ROOT.includes("storage")) {
    warnings.push(
      "Local STORAGE_ROOT is ephemeral on serverless — disable uploads or configure durable storage before relying on attachments",
    );
  }

  return { ok: errors.length === 0, errors, warnings };
}
