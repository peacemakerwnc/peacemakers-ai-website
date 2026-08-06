/**
 * Runs before each `*.db.test.ts` file.
 * Fails hard when OWNER_OPS_TEST_DATABASE_URL is missing or unsafe.
 * Does not migrate, seed, or open application servers.
 */
import {
  applyOwnerOpsTestDatabaseEnv,
  OWNER_OPS_TEST_DATABASE_URL_ENV,
} from "./src/lib/test-db";

try {
  applyOwnerOpsTestDatabaseEnv();
} catch (err) {
  const message =
    err instanceof Error
      ? err.message
      : `${OWNER_OPS_TEST_DATABASE_URL_ENV} configuration failed`;
  console.error(`[test:db] ${message}`);
  throw err;
}
