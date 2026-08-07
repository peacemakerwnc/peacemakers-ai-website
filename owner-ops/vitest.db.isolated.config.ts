import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Isolated PostgreSQL smoke suite.
 * Selects only `*.isolated-postgres.test.ts` — never the seed-oriented
 * `*.db.test.ts` suites. Requires launcher-provided
 * OWNER_OPS_TEST_DATABASE_URL plus OWNER_OPS_ISOLATED_POSTGRES_TEST=1.
 * Does not load filesystem .env, migrate, seed, or start the application.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.isolated-postgres.test.ts"],
    exclude: ["src/**/*.db.test.ts", "node_modules/**"],
    setupFiles: ["./vitest.db.isolated.setup.ts"],
    fileParallelism: false,
    maxWorkers: 1,
    retry: 0,
    watch: false,
    update: false,
    testTimeout: 20_000,
    hookTimeout: 20_000,
    env: {
      OWNER_OPS_ISOLATED_POSTGRES_TEST: "1",
      NODE_ENV: "test",
      // Intentionally omit DATABASE_URL / DIRECT_URL / OWNER_OPS_TEST_DATABASE_URL
      // so missing launcher config fails closed (no filesystem .env fallback).
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
