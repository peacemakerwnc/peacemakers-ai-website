/**
 * Unit coverage for isolated PostgreSQL test-database guards.
 * Does not connect to a database or load filesystem `.env`.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  applyIsolatedOwnerOpsTestDatabaseEnv,
  assertIsolatedOwnerOpsTestDatabaseUrl,
  isIsolatedPostgresTestMode,
  OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV,
  OWNER_OPS_TEST_DATABASE_URL_ENV,
  requireIsolatedOwnerOpsTestDatabaseUrl,
  TestDatabaseConfigError,
} from "./test-db";

const SAFE_LOCAL =
  "postgresql://owner_ops_test:secret-value@127.0.0.1:55432/owner_ops_test?schema=public";

function withEnv(
  patch: Record<string, string | undefined>,
  fn: () => void,
): void {
  const keys = Object.keys(patch);
  const prev = new Map(keys.map((k) => [k, process.env[k]]));
  try {
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    fn();
  } finally {
    for (const k of keys) {
      const old = prev.get(k);
      if (old === undefined) delete process.env[k];
      else process.env[k] = old;
    }
  }
}

describe("isolated PostgreSQL URL guards", () => {
  afterEach(() => {
    delete process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV];
  });

  it("requires explicit isolated mode (not NODE_ENV=test alone)", () => {
    withEnv(
      {
        [OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV]: undefined,
        NODE_ENV: "test",
        [OWNER_OPS_TEST_DATABASE_URL_ENV]: SAFE_LOCAL,
      },
      () => {
        expect(isIsolatedPostgresTestMode()).toBe(false);
        expect(() => requireIsolatedOwnerOpsTestDatabaseUrl()).toThrow(
          TestDatabaseConfigError,
        );
      },
    );
  });

  it("fails closed when launcher URL is missing", () => {
    withEnv(
      {
        [OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV]: "1",
        [OWNER_OPS_TEST_DATABASE_URL_ENV]: undefined,
      },
      () => {
        expect(() => requireIsolatedOwnerOpsTestDatabaseUrl()).toThrow(
          /launcher-provided process env only/i,
        );
      },
    );
  });

  it("rejects non-loopback hosts without disclosing the URL", () => {
    const remote =
      "postgresql://owner_ops_test:super-secret@db.example.com:5432/owner_ops_test";
    expect(() => assertIsolatedOwnerOpsTestDatabaseUrl(remote)).toThrow(
      TestDatabaseConfigError,
    );
    try {
      assertIsolatedOwnerOpsTestDatabaseUrl(remote);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      expect(message).not.toContain("super-secret");
      expect(message).not.toContain(remote);
      expect(message).not.toContain("db.example.com");
      expect(message).toMatch(/loopback/i);
    }
  });

  it("rejects database names other than owner_ops_test without disclosing the URL", () => {
    const wrongDb =
      "postgresql://owner_ops_test:super-secret@127.0.0.1:55432/production_db";
    expect(() => assertIsolatedOwnerOpsTestDatabaseUrl(wrongDb)).toThrow(
      TestDatabaseConfigError,
    );
    try {
      assertIsolatedOwnerOpsTestDatabaseUrl(wrongDb);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      expect(message).not.toContain("super-secret");
      expect(message).not.toContain(wrongDb);
      expect(message).not.toContain("production_db");
      expect(message).toMatch(/owner_ops_test/);
    }
  });

  it("accepts loopback owner_ops_test URLs and applies them without logging secrets", () => {
    withEnv(
      {
        [OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV]: "1",
        [OWNER_OPS_TEST_DATABASE_URL_ENV]: SAFE_LOCAL,
        DATABASE_URL: undefined,
        DIRECT_URL: undefined,
      },
      () => {
        expect(() => assertIsolatedOwnerOpsTestDatabaseUrl(SAFE_LOCAL)).not.toThrow();
        const applied = applyIsolatedOwnerOpsTestDatabaseEnv();
        expect(applied).toBe(SAFE_LOCAL);
        expect(process.env.DATABASE_URL).toBe(SAFE_LOCAL);
        expect(process.env.DIRECT_URL).toBe(SAFE_LOCAL);
      },
    );
  });

  it("still rejects neon.tech under isolated asserts", () => {
    expect(() =>
      assertIsolatedOwnerOpsTestDatabaseUrl(
        "postgresql://u:p@ep-x.us-east-1.aws.neon.tech/owner_ops_test",
      ),
    ).toThrow(TestDatabaseConfigError);
  });
});
