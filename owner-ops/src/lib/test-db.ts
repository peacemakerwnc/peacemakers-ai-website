/**
 * PostgreSQL test-database helpers for owner-ops.
 *
 * Database-backed suites live in `*.db.test.ts` and run only via
 * `npm run test:db` once a separately authorized non-Production Postgres
 * test database is available.
 *
 * C1A does not create, migrate, or connect to any database.
 */

/** Env var name for the dedicated non-Production Postgres test URL. */
export const OWNER_OPS_TEST_DATABASE_URL_ENV = "OWNER_OPS_TEST_DATABASE_URL";

export class TestDatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TestDatabaseConfigError";
  }
}

/**
 * Reject URLs that look like Production / shared pilot Neon hosts or pooled
 * production naming. Placeholders and obvious local docker URLs are allowed
 * for static config checks; connection is still deferred until authorized.
 */
export function assertSafeOwnerOpsTestDatabaseUrl(url: string): void {
  const trimmed = url.trim();
  if (!trimmed) {
    throw new TestDatabaseConfigError(
      `${OWNER_OPS_TEST_DATABASE_URL_ENV} is empty`,
    );
  }
  if (trimmed.startsWith("file:") || /sqlite/i.test(trimmed)) {
    throw new TestDatabaseConfigError(
      `${OWNER_OPS_TEST_DATABASE_URL_ENV} must be PostgreSQL (not SQLite file:)`,
    );
  }
  if (!/^postgres(ql)?:\/\//i.test(trimmed)) {
    throw new TestDatabaseConfigError(
      `${OWNER_OPS_TEST_DATABASE_URL_ENV} must use postgres:// or postgresql://`,
    );
  }

  const lower = trimmed.toLowerCase();
  const forbiddenSubstrings = [
    // Obvious Production / fictional-pilot identifiers (never use for local tests)
    "owner-ops-fictional-pilot",
    "plain-fire-35687465",
    "vercel.app",
    // Hosted Neon endpoints require a separately authorized test project;
    // block by default so C1A/default suites cannot point at Production Neon.
    "neon.tech",
  ];
  for (const needle of forbiddenSubstrings) {
    if (lower.includes(needle)) {
      throw new TestDatabaseConfigError(
        `${OWNER_OPS_TEST_DATABASE_URL_ENV} looks like a Production or shared hosted URL (` +
          `${needle}). Use a separately authorized non-Production Postgres test database only.`,
      );
    }
  }
}

/**
 * Resolve and validate the dedicated test database URL.
 * Does not open a connection.
 */
export function requireOwnerOpsTestDatabaseUrl(
  fromEnv: NodeJS.ProcessEnv = process.env,
): string {
  const url = fromEnv[OWNER_OPS_TEST_DATABASE_URL_ENV];
  if (!url) {
    throw new TestDatabaseConfigError(
      `${OWNER_OPS_TEST_DATABASE_URL_ENV} is required for database-backed tests. ` +
        `Provide a separately authorized non-Production PostgreSQL URL. ` +
        `Do not use Production Neon credentials. C1A deferred DB tests until that gate.`,
    );
  }
  assertSafeOwnerOpsTestDatabaseUrl(url);
  return url;
}

/**
 * Apply the validated test URL to process.env for Prisma Client.
 * Does not connect, migrate, or seed.
 */
export function applyOwnerOpsTestDatabaseEnv(
  fromEnv: NodeJS.ProcessEnv = process.env,
): string {
  const url = requireOwnerOpsTestDatabaseUrl(fromEnv);
  fromEnv.DATABASE_URL = url;
  // Migrate tooling is out of scope for the test harness; keep DIRECT_URL
  // aligned only when already set to a non-secret test direct URL.
  if (!fromEnv.DIRECT_URL) {
    fromEnv.DIRECT_URL = url;
  }
  return url;
}
