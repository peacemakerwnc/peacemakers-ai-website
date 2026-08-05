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

export function getEnv(): AppEnv {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
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
