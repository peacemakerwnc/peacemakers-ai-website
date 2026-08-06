/**
 * Seed fictional Optimum field-photo process graph for Increment 1 diagnostic UI.
 * Run manually only: `npx tsx prisma/seed-process-graph-demo.ts`
 *
 * NEVER wire into package.json build/deploy/migrate scripts.
 * NEVER run against Production Neon or the fictional-pilot Production database.
 * Idempotent. Does not fabricate secrets.
 */
import { config } from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";

config({ path: path.join(process.cwd(), ".env") });

const defaults: Record<string, string> = {
  DATABASE_URL:
    "postgresql://owner_ops_demo:owner_ops_demo@127.0.0.1:5432/owner_ops_demo?schema=public",
  DIRECT_URL:
    "postgresql://owner_ops_demo:owner_ops_demo@127.0.0.1:5432/owner_ops_demo?schema=public",
  OWNER_EMAIL: "owner@peacemakersai.com",
  SESSION_SECRET: "dev-only-replace-with-long-random-secret-32chars-min",
  STORAGE_ROOT: "./storage",
  APP_BASE_URL: "http://localhost:3001",
};
for (const [k, v] of Object.entries(defaults)) {
  if (!process.env[k]) process.env[k] = v;
}

async function main() {
  // Dynamic import after env so process-graph uses correct DATABASE_URL via db.ts
  const { prisma } = await import("../src/lib/db");
  const { ensureOptimumFieldPhotoGraph } =
    await import("../src/lib/process-graph-demo");
  const { resetEnvCache } = await import("../src/lib/env");
  resetEnvCache();

  const company =
    (await prisma.company.findFirst({
      where: { name: { contains: "Optimum Demo" } },
    })) ??
    (await prisma.company.create({
      data: {
        name: "Optimum Demo Contractors",
        industry: "Home services",
        primaryLocation: "Asheville, NC (fictional)",
      },
    }));

  const contact =
    (await prisma.contact.findFirst({
      where: { email: "alex@example.test" },
    })) ??
    (await prisma.contact.create({
      data: {
        firstName: "Alex",
        lastName: "Demo",
        email: "alex@example.test",
        jobTitle: "Owner",
      },
    }));

  await prisma.companyContact.upsert({
    where: {
      companyId_contactId: { companyId: company.id, contactId: contact.id },
    },
    update: {},
    create: { companyId: company.id, contactId: contact.id, isPrimary: true },
  });

  const opportunity = await prisma.opportunity.findFirst({
    where: { companyId: company.id },
  });

  const owner = await prisma.user.findFirst({ where: { isOwner: true } });

  const graph = await ensureOptimumFieldPhotoGraph({
    companyId: company.id,
    opportunityId: opportunity?.id ?? null,
    contactId: contact.id,
    actorUserId: owner?.id,
    actorLabel: owner?.email ?? "owner",
    submitAndApprove: true,
  });

  // Create an editable Future-State draft derived from approved As-Is for diagnostic
  const approved = graph.versions.find((v) => v.status === "APPROVED");
  if (approved) {
    const { deriveFutureStateDraft } = await import("../src/lib/process-graph");
    const existingFuture = await prisma.processVersion.findFirst({
      where: {
        processId: graph.id,
        classification: "FUTURE_STATE",
        status: "DRAFT",
      },
    });
    if (!existingFuture) {
      await deriveFutureStateDraft(approved.id, {
        actorUserId: owner?.id,
        actorLabel: owner?.email,
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        processId: graph.id,
        company: company.name,
        versions: await prisma.processVersion.findMany({
          where: { processId: graph.id },
          select: {
            id: true,
            versionNumber: true,
            classification: true,
            status: true,
          },
          orderBy: { versionNumber: "asc" },
        }),
        diagnosticUrl: `${process.env.APP_BASE_URL}/ops/processes/${graph.id}`,
      },
      null,
      2,
    ),
  );

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  const prisma = new PrismaClient();
  await prisma.$disconnect();
  process.exit(1);
});
