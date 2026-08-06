import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    fileParallelism: false,
    env: {
      // Relative to prisma/schema.prisma (not package root). Nested
      // file:./prisma/vitest.db resolves to prisma/prisma/vitest.db and breaks tests.
      DATABASE_URL: "file:./vitest.db",
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
