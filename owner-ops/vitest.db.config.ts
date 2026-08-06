import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Database-backed suite. Requires OWNER_OPS_TEST_DATABASE_URL pointing at a
 * separately authorized non-Production PostgreSQL database.
 * Does not run under the default `npm test` command.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.db.test.ts"],
    setupFiles: ["./vitest.db.setup.ts"],
    fileParallelism: false,
    env: {
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
