/**
 * Apply local SQLite schema for Vitest without invoking the Prisma CLI.
 * Prisma CLI currently hangs in this environment; migrations are applied via SQL.
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = path.join(__dirname, "..");
const MIGRATIONS = path.join(ROOT, "prisma/migrations");

export function resetSqliteTestDatabase(dbRelativePath: string): void {
  const dbFile = path.isAbsolute(dbRelativePath)
    ? dbRelativePath
    : path.join(ROOT, dbRelativePath);
  try {
    execSync(`rm -f "${dbFile}" "${dbFile}-journal"`, { stdio: "pipe" });
  } catch {
    /* ignore */
  }

  const dirs = fs
    .readdirSync(MIGRATIONS)
    .filter((name) => fs.statSync(path.join(MIGRATIONS, name)).isDirectory())
    .sort();

  for (const dir of dirs) {
    const sqlPath = path.join(MIGRATIONS, dir, "migration.sql");
    if (!fs.existsSync(sqlPath)) continue;
    // Apply migration SQL with sqlite3 (Prisma CLI hangs in this environment).
    execSync(`sqlite3 "${dbFile}" < "${sqlPath}"`, {
      stdio: "pipe",
      shell: "/bin/zsh",
    });
  }
}
