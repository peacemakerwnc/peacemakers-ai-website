/**
 * Unit coverage for isolated-mode filesystem `.env` bypass in getEnv().
 * Does not connect to a database and does not open owner-ops/.env.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  getEnv,
  resetEnvCache,
  usesFilesystemEnvFallback,
  OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV,
} from "./env";

const REQUIRED_PROCESS_ENV = {
  DATABASE_URL:
    "postgresql://owner_ops_test:x@127.0.0.1:55432/owner_ops_test?schema=public",
  OWNER_EMAIL: "owner@example.com",
  OWNER_NAME: "Owner",
  OWNER_PASSWORD: "change-me-before-use",
  SESSION_SECRET: "test-session-secret-at-least-32-characters-long",
  APP_BASE_URL: "http://localhost:3001",
} as const;

function withIsolatedMode(enabled: boolean, fn: () => void): void {
  const prevMode = process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV];
  const prevKeys = Object.keys(REQUIRED_PROCESS_ENV) as Array<
    keyof typeof REQUIRED_PROCESS_ENV
  >;
  const prevValues = new Map(prevKeys.map((k) => [k, process.env[k]]));
  try {
    if (enabled) process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV] = "1";
    else delete process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV];
    for (const k of prevKeys) {
      process.env[k] = REQUIRED_PROCESS_ENV[k];
    }
    resetEnvCache();
    fn();
  } finally {
    if (prevMode === undefined) {
      delete process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV];
    } else {
      process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV] = prevMode;
    }
    for (const k of prevKeys) {
      const old = prevValues.get(k);
      if (old === undefined) delete process.env[k];
      else process.env[k] = old;
    }
    resetEnvCache();
  }
}

describe("isolated PostgreSQL env filesystem bypass", () => {
  afterEach(() => {
    delete process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV];
    resetEnvCache();
  });

  it("disables filesystem .env fallback only when isolated mode is enabled", () => {
    withIsolatedMode(false, () => {
      expect(usesFilesystemEnvFallback()).toBe(true);
    });
    withIsolatedMode(true, () => {
      expect(usesFilesystemEnvFallback()).toBe(false);
    });
  });

  it("resolves env from process variables in isolated mode", () => {
    withIsolatedMode(true, () => {
      const env = getEnv();
      expect(env.DATABASE_URL).toBe(REQUIRED_PROCESS_ENV.DATABASE_URL);
      expect(env.OWNER_EMAIL).toBe(REQUIRED_PROCESS_ENV.OWNER_EMAIL);
    });
  });

  it("fails closed in isolated mode when DATABASE_URL is missing from process env", () => {
    const prevMode = process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV];
    const prevDb = process.env.DATABASE_URL;
    try {
      process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV] = "1";
      process.env.OWNER_EMAIL = REQUIRED_PROCESS_ENV.OWNER_EMAIL;
      process.env.OWNER_NAME = REQUIRED_PROCESS_ENV.OWNER_NAME;
      process.env.OWNER_PASSWORD = REQUIRED_PROCESS_ENV.OWNER_PASSWORD;
      process.env.SESSION_SECRET = REQUIRED_PROCESS_ENV.SESSION_SECRET;
      process.env.APP_BASE_URL = REQUIRED_PROCESS_ENV.APP_BASE_URL;
      delete process.env.DATABASE_URL;
      resetEnvCache();
      expect(() => getEnv()).toThrow(/Invalid environment configuration/);
      try {
        getEnv();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        expect(message).not.toMatch(/postgresql:\/\//i);
        expect(message).not.toContain("secret");
        expect(message).not.toContain("password");
      }
    } finally {
      if (prevMode === undefined) {
        delete process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV];
      } else {
        process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV] = prevMode;
      }
      if (prevDb === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = prevDb;
      resetEnvCache();
    }
  });

  it("does not change non-isolated fallback enablement when mode is unset", () => {
    delete process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV];
    resetEnvCache();
    expect(usesFilesystemEnvFallback()).toBe(true);
  });
});
