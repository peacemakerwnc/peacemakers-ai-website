import fs from "fs";
import path from "path";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  OWNER_EMAIL: z.string().email(),
  OWNER_NAME: z.string().min(1),
  OWNER_PASSWORD: z.string().min(12),
  SESSION_SECRET: z.string().min(32),
  STORAGE_ROOT: z.string().min(1).default("./storage"),
  APP_BASE_URL: z.string().url(),
  FORM_INVITATION_EXPIRY_DAYS: z.coerce.number().int().positive().default(30),
  REVIEW_ACTION_DUE_DAYS: z.coerce.number().int().positive().default(3),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | null = null;

function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function readRuntimeEnv(key: string): string | undefined {
  // Dynamic access avoids Turbopack inlining missing keys as undefined.
  const value = process.env[key];
  return value === "" || value === undefined ? undefined : value;
}

function fileEnv(): Record<string, string> {
  const candidates = [
    path.join(process.cwd(), ".env"),
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env.example"),
    path.resolve(process.cwd(), "owner-ops/.env"),
    path.resolve(process.cwd(), "owner-ops/.env.example"),
    path.resolve(__dirname, "../../.env"),
    path.resolve(__dirname, "../../.env.example"),
  ];
  const merged: Record<string, string> = {};
  // Later files win; load examples first so real `.env` overrides.
  for (const envPath of [
    ...candidates.filter((p) => p.endsWith(".example")),
    ...candidates.filter((p) => !p.endsWith(".example")),
  ]) {
    Object.assign(merged, parseEnvFile(envPath));
  }
  return merged;
}

/**
 * Resolve env for server actions/pages.
 * Prefer live process.env, then fall back to package `.env` file values.
 * Next/Turbopack can expose env keys that still resolve to undefined inside
 * server-action bundles and may ignore runtime process.env assignment.
 */
export function getEnv(): AppEnv {
  if (cached) return cached;
  const fromFile = fileEnv();
  const pick = (key: string) => readRuntimeEnv(key) ?? fromFile[key];
  const parsed = envSchema.safeParse({
    NODE_ENV: pick("NODE_ENV"),
    DATABASE_URL: pick("DATABASE_URL"),
    OWNER_EMAIL: pick("OWNER_EMAIL"),
    OWNER_NAME: pick("OWNER_NAME"),
    OWNER_PASSWORD: pick("OWNER_PASSWORD"),
    SESSION_SECRET: pick("SESSION_SECRET"),
    STORAGE_ROOT: pick("STORAGE_ROOT"),
    APP_BASE_URL: pick("APP_BASE_URL"),
    FORM_INVITATION_EXPIRY_DAYS: pick("FORM_INVITATION_EXPIRY_DAYS"),
    REVIEW_ACTION_DUE_DAYS: pick("REVIEW_ACTION_DUE_DAYS"),
  });
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${issues}`);
  }
  cached = parsed.data;
  return cached;
}

/** Reset cache between tests. */
export function resetEnvCache(): void {
  cached = null;
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === "production";
}
