import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Default suite: database-independent unit tests only.
 * Database-backed suites:
 * - `*.db.test.ts` → `npm run test:db` (seed-oriented; separate authorization)
 * - `*.isolated-postgres.test.ts` → `npm run test:db:isolated` (rollback smoke)
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: [
      "src/**/*.db.test.ts",
      "src/**/*.isolated-postgres.test.ts",
      "node_modules/**",
    ],
    fileParallelism: false,
    env: {
      // Placeholder only — default suite must not connect to a database.
      DATABASE_URL:
        "postgresql://c1a_placeholder:c1a_placeholder@127.0.0.1:5432/c1a_placeholder?schema=public",
      DIRECT_URL:
        "postgresql://c1a_placeholder:c1a_placeholder@127.0.0.1:5432/c1a_placeholder?schema=public",
      OWNER_EMAIL: "owner@example.com",
      OWNER_NAME: "Owner",
      OWNER_PASSWORD: "change-me-before-use",
      SESSION_SECRET: "test-session-secret-at-least-32-characters-long",
      STORAGE_ROOT: "./storage-test",
      APP_BASE_URL: "http://localhost:3001",
      FORM_INVITATION_EXPIRY_DAYS: "30",
      REVIEW_ACTION_DUE_DAYS: "3",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
