/**
 * Runs before the isolated PostgreSQL smoke suite.
 * Requires OWNER_OPS_ISOLATED_POSTGRES_TEST=1 and OWNER_OPS_TEST_DATABASE_URL
 * from the external launcher (process env only). Does not migrate, seed,
 * load filesystem .env, or start application servers.
 */
import {
  applyIsolatedOwnerOpsTestDatabaseEnv,
  OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV,
  OWNER_OPS_TEST_DATABASE_URL_ENV,
} from "./src/lib/test-db";

process.env[OWNER_OPS_ISOLATED_POSTGRES_TEST_ENV] = "1";

try {
  applyIsolatedOwnerOpsTestDatabaseEnv();
} catch (err) {
  const message =
    err instanceof Error
      ? err.message
      : `${OWNER_OPS_TEST_DATABASE_URL_ENV} isolated configuration failed`;
  console.error(`[test:db:isolated] ${message}`);
  throw err;
}
