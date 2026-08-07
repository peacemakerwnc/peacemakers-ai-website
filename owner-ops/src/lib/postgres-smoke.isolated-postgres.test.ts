/**
 * Isolated PostgreSQL connectivity smoke test.
 *
 * - Selected only by `npm run test:db:isolated` (not `npm test` or `test:db`).
 * - Creates one `Tool` row inside an interactive transaction, reads it, then
 *   throws a sentinel so PostgreSQL rolls back — no commit, no deleteMany.
 * - Imports Prisma Client only (no Next.js, mail, rate-limit, or env file load).
 */
import { PrismaClient } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  applyIsolatedOwnerOpsTestDatabaseEnv,
  IsolatedPostgresTestRollbackError,
} from "./test-db";

describe("isolated PostgreSQL smoke", () => {
  it("creates and reads one Tool inside a transaction then rolls back", async () => {
    applyIsolatedOwnerOpsTestDatabaseEnv();
    const prisma = new PrismaClient();
    const gateName = `isolated-smoke-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    let intentionalRollback = false;

    try {
      try {
        await prisma.$transaction(async (tx) => {
          const created = await tx.tool.create({
            data: {
              name: gateName,
              category: "isolated-postgres-smoke",
            },
          });
          const read = await tx.tool.findUnique({ where: { id: created.id } });
          expect(read).not.toBeNull();
          expect(read!.name).toBe(gateName);
          expect(read!.category).toBe("isolated-postgres-smoke");
          throw new IsolatedPostgresTestRollbackError();
        });
      } catch (err) {
        if (err instanceof IsolatedPostgresTestRollbackError) {
          intentionalRollback = true;
        } else {
          throw err;
        }
      }
      expect(intentionalRollback).toBe(true);
    } finally {
      await prisma.$disconnect();
    }
  });
});
