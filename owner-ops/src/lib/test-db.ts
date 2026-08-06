/**
 * Apply local SQLite schema for Vitest without invoking the Prisma CLI.
 * Migrations are applied via SQL for hermetic local tests.
 *
 * Prisma resolves file: URLs relative to prisma/schema.prisma. Vitest must use
 * DATABASE_URL=file:./vitest.db so the client opens owner-ops/prisma/vitest.db
 * (the same file this helper migrates). file:./prisma/vitest.db incorrectly
 * opens prisma/prisma/vitest.db.
 *
 * SQLite note: after Process→FormProcess rename + recreate of Process (graph),
 * FormProcessStep's FK can still target the new Process table. Rebuild so
 * processId references FormProcess (matches schema.prisma). Postgres migrate
 * deploy is unaffected.
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// src/lib -> owner-ops package root
const ROOT = path.join(__dirname, "../..");
const MIGRATIONS = path.join(ROOT, "prisma/migrations");
const NESTED_STALE = path.join(ROOT, "prisma/prisma/vitest.db");

/** Schema-relative SQLite URL expected by Vitest (see vitest.config.ts). */
export const VITEST_SQLITE_DATABASE_URL = "file:./vitest.db";

const FORM_PROCESS_STEP_FK_REPAIR = `
PRAGMA foreign_keys=OFF;
DROP TABLE IF EXISTS "FormProcessStep_fixed";
CREATE TABLE "FormProcessStep_fixed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "responsibleRole" TEXT,
    "exactAction" TEXT,
    "toolUsed" TEXT,
    "informationReceived" TEXT,
    "informationChanged" TEXT,
    "outputRecipient" TEXT,
    "decisionInvolved" TEXT,
    "expectedTime" TEXT,
    "waitingTime" TEXT,
    "notificationSent" TEXT,
    "completionEvidence" TEXT,
    "problems" TEXT,
    "exceptions" TEXT,
    "workaround" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FormProcessStep_processId_fkey" FOREIGN KEY ("processId") REFERENCES "FormProcess" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "FormProcessStep_fixed" SELECT * FROM "FormProcessStep";
DROP TABLE "FormProcessStep";
ALTER TABLE "FormProcessStep_fixed" RENAME TO "FormProcessStep";
CREATE INDEX IF NOT EXISTS "FormProcessStep_processId_sortOrder_idx" ON "FormProcessStep"("processId", "sortOrder");
PRAGMA foreign_keys=ON;
`;

export function resetSqliteTestDatabase(dbRelativePath: string): void {
  const dbFile = path.isAbsolute(dbRelativePath)
    ? dbRelativePath
    : path.join(ROOT, dbRelativePath);
  try {
    execSync(
      `rm -f "${dbFile}" "${dbFile}-journal" "${NESTED_STALE}" "${NESTED_STALE}-journal"`,
      { stdio: "pipe" },
    );
  } catch {
    /* ignore */
  }

  if (!fs.existsSync(MIGRATIONS)) {
    throw new Error(`Migrations directory missing: ${MIGRATIONS}`);
  }

  const dirs = fs
    .readdirSync(MIGRATIONS)
    .filter((name) => fs.statSync(path.join(MIGRATIONS, name)).isDirectory())
    .sort();

  for (const dir of dirs) {
    const sqlPath = path.join(MIGRATIONS, dir, "migration.sql");
    if (!fs.existsSync(sqlPath)) continue;
    execSync(`sqlite3 "${dbFile}" < "${sqlPath}"`, {
      stdio: "pipe",
      shell: "/bin/zsh",
    });
  }

  // Repair SQLite rename/recreate FK artifact (see file header).
  const repairPath = `${dbFile}.fk-repair.sql`;
  fs.writeFileSync(repairPath, FORM_PROCESS_STEP_FK_REPAIR, "utf8");
  try {
    execSync(`sqlite3 "${dbFile}" < "${repairPath}"`, {
      stdio: "pipe",
      shell: "/bin/zsh",
    });
  } finally {
    try {
      fs.unlinkSync(repairPath);
    } catch {
      /* ignore */
    }
  }
}
