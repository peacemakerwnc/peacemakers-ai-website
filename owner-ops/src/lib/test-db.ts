/**
 * PostgreSQL test-database helpers for owner-ops.
 *
 * Database-backed suites:
 * - `*.db.test.ts` via `npm run test:db` (seed-oriented; not isolated-gate eligible)
 * - `*.isolated-postgres.test.ts` via `npm run test:db:isolated`
 *   (transaction-rollback smoke; loopback + `owner_ops_test` only)
 *
 * Helpers validate configuration only. They do not migrate, seed, or connect.
 */

/** Env var name for the dedicated non-Production Postgres test URL. */
export const OWNER_OPS_TEST_DATABASE_URL_ENV = "OWNER_OPS_TEST_DATABASE_URL";

/**
 * Explicit mode for the isolated PostgreSQL smoke path.
 * Must be set to `"1"` — never inferred from `NODE_ENV=test` alone.
 */
export const OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV =
  "OWNER_OPS_ISOLATED_POSTGRES_TEST";

/** Required database name for isolated PostgreSQL smoke tests. */
export const OWNER_OPS_ISOLATED_TEST_DATABASE_NAME = "owner_ops_test";

const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

export class TestDatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TestDatabaseConfigError";
  }
}

/**
 * Sentinel thrown inside an interactive Prisma transaction so PostgreSQL
 * rolls back all temporary writes. Never commit isolated smoke data.
 */
export class IsolatedPostgresTestRollbackError extends Error {
  constructor() {
    super("ISOLATED_POSTGRES_SMOKE_INTENTIONAL_ROLLBACK");
    this.name = "IsolatedPostgresTestRollbackError";
  }
}

export function isIsolatedPostgresTestMode(
  fromEnv: NodeJS.ProcessEnv = process.env,
): boolean {
  return fromEnv[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV] === "1";
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
 * Parse hostname and database name without including credentials in errors.
 */
function parsePostgresTarget(url: string): {
  hostname: string;
  database: string;
} {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new TestDatabaseConfigError(
      `${OWNER_OPS_TEST_DATABASE_URL_ENV} is not a valid URL (credentials omitted)`,
    );
  }
  const hostname = parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  const database = decodeURIComponent(
    parsed.pathname.replace(/^\//, "").split("/")[0] ?? "",
  );
  return { hostname, database };
}

/**
 * Stricter target rules for the isolated smoke path: loopback host and
 * database name `owner_ops_test` only. Error messages never include the URL
 * or password.
 */
export function assertIsolatedOwnerOpsTestDatabaseUrl(url: string): void {
  assertSafeOwnerOpsTestDatabaseUrl(url);
  const { hostname, database } = parsePostgresTarget(url);
  if (!LOOPBACK_HOSTS.has(hostname)) {
    throw new TestDatabaseConfigError(
      `${OWNER_OPS_TEST_DATABASE_URL_ENV} must target a loopback host for isolated PostgreSQL tests`,
    );
  }
  if (database !== OWNER_OPS_ISOLATED_TEST_DATABASE_NAME) {
    throw new TestDatabaseConfigError(
      `${OWNER_OPS_TEST_DATABASE_URL_ENV} must use database name ` +
        `${OWNER_OPS_ISOLATED_TEST_DATABASE_NAME} for isolated PostgreSQL tests`,
    );
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
 * Resolve and validate the isolated smoke URL (explicit mode + loopback +
 * `owner_ops_test`). Does not open a connection or read filesystem `.env`.
 */
export function requireIsolatedOwnerOpsTestDatabaseUrl(
  fromEnv: NodeJS.ProcessEnv = process.env,
): string {
  if (!isIsolatedPostgresTestMode(fromEnv)) {
    throw new TestDatabaseConfigError(
      `${OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV}=1 is required for isolated PostgreSQL tests`,
    );
  }
  const url = fromEnv[OWNER_OPS_TEST_DATABASE_URL_ENV];
  if (!url) {
    throw new TestDatabaseConfigError(
      `${OWNER_OPS_TEST_DATABASE_URL_ENV} is required for isolated PostgreSQL tests ` +
        `(launcher-provided process env only; no filesystem .env fallback)`,
    );
  }
  assertIsolatedOwnerOpsTestDatabaseUrl(url);
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

/**
 * Apply isolated smoke URL to process.env for Prisma Client.
 * Requires explicit isolated mode. Does not connect, migrate, or seed.
 */
export function applyIsolatedOwnerOpsTestDatabaseEnv(
  fromEnv: NodeJS.ProcessEnv = process.env,
): string {
  const url = requireIsolatedOwnerOpsTestDatabaseUrl(fromEnv);
  fromEnv.DATABASE_URL = url;
  if (!fromEnv.DIRECT_URL) {
    fromEnv.DIRECT_URL = url;
  }
  return url;
}
