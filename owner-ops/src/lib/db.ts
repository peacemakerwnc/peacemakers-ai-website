import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaEpoch?: string;
};

/** Bump when Prisma schema fields used by the app change (forces client refresh in dev). */
const SCHEMA_EPOCH = "inc3-owner-workspace-v1";

function getClient() {
  if (
    process.env.NODE_ENV !== "production" &&
    globalForPrisma.prisma &&
    globalForPrisma.prismaSchemaEpoch !== SCHEMA_EPOCH
  ) {
    void globalForPrisma.prisma.$disconnect().catch(() => undefined);
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
    globalForPrisma.prismaSchemaEpoch = SCHEMA_EPOCH;
  }

  return globalForPrisma.prisma;
}

export const prisma = getClient();
