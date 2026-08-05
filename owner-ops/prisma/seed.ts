import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/crypto";
import {
  BLUEPRINT_FORM_TEMPLATE_SLUG,
  DEFAULT_PIPELINE_SLUG,
  DEFAULT_STAGES,
} from "../src/lib/pipeline-seed-data";

const prisma = new PrismaClient();

async function seedOwner() {
  const email = (
    process.env.OWNER_EMAIL || "owner@peacemakersai.com"
  ).trim().toLowerCase();
  const name = process.env.OWNER_NAME || "Owner";
  const password = process.env.OWNER_PASSWORD || "change-me-before-use";

  const passwordHash = hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, isOwner: true },
    create: { email, name, passwordHash, isOwner: true },
  });
  return user;
}

async function seedPipeline() {
  const pipeline = await prisma.pipeline.upsert({
    where: { slug: DEFAULT_PIPELINE_SLUG },
    update: {
      name: "Peacemakers Client Journey",
      description: "Default lead-to-client pipeline for Owner Ops Phase 1",
      isDefault: true,
    },
    create: {
      name: "Peacemakers Client Journey",
      slug: DEFAULT_PIPELINE_SLUG,
      description: "Default lead-to-client pipeline for Owner Ops Phase 1",
      isDefault: true,
    },
  });

  for (let i = 0; i < DEFAULT_STAGES.length; i++) {
    const stage = DEFAULT_STAGES[i];
    const row = await prisma.pipelineStage.upsert({
      where: {
        pipelineId_slug: { pipelineId: pipeline.id, slug: stage.slug },
      },
      update: {
        name: stage.name,
        sortOrder: i,
        objective: stage.objective,
        requiredInformation: stage.requiredInformation,
        requiredOwnerAction: stage.requiredOwnerAction,
        clientFacingArtifact: stage.clientFacingArtifact,
        suggestedMessage: stage.suggestedMessage,
        relevantSopSlug: stage.relevantSopSlug,
        exitCriteria: stage.exitCriteria,
        nextStageSlug: stage.nextStageSlug,
        isTerminal: stage.isTerminal,
      },
      create: {
        pipelineId: pipeline.id,
        name: stage.name,
        slug: stage.slug,
        sortOrder: i,
        objective: stage.objective,
        requiredInformation: stage.requiredInformation,
        requiredOwnerAction: stage.requiredOwnerAction,
        clientFacingArtifact: stage.clientFacingArtifact,
        suggestedMessage: stage.suggestedMessage,
        relevantSopSlug: stage.relevantSopSlug,
        exitCriteria: stage.exitCriteria,
        nextStageSlug: stage.nextStageSlug,
        isTerminal: stage.isTerminal,
      },
    });

    await prisma.stageChecklist.deleteMany({ where: { stageId: row.id } });
    await prisma.stageChecklist.createMany({
      data: stage.checklist.map((label, sortOrder) => ({
        stageId: row.id,
        label,
        sortOrder,
        isRequired: true,
      })),
    });
  }

  return pipeline;
}

async function seedFormTemplate() {
  await prisma.formTemplate.upsert({
    where: { slug: BLUEPRINT_FORM_TEMPLATE_SLUG },
    update: {
      name: "Business Blueprint Preparation",
      version: 1,
      description:
        "Pre-call intake capturing contact, tools, process inventory, detailed maps, and priorities.",
      isActive: true,
      schemaJson: JSON.stringify({
        title: "Business Blueprint Preparation",
        sections: 8,
      }),
    },
    create: {
      slug: BLUEPRINT_FORM_TEMPLATE_SLUG,
      name: "Business Blueprint Preparation",
      version: 1,
      description:
        "Pre-call intake capturing contact, tools, process inventory, detailed maps, and priorities.",
      isActive: true,
      schemaJson: JSON.stringify({
        title: "Business Blueprint Preparation",
        sections: 8,
      }),
    },
  });
}

async function seedSopsAndTemplates() {
  const sops = DEFAULT_STAGES.filter((s) => s.relevantSopSlug).map((s) => ({
    slug: s.relevantSopSlug!,
    title: `SOP: ${s.name}`,
    body: `${s.objective}\n\nOwner action: ${s.requiredOwnerAction}\n\nExit: ${s.exitCriteria}`,
    stageSlug: s.slug,
  }));

  for (const sop of sops) {
    await prisma.sop.upsert({
      where: { slug: sop.slug },
      update: {
        title: sop.title,
        body: sop.body,
        stageSlug: sop.stageSlug,
        isActive: true,
      },
      create: { ...sop, isActive: true },
    });
  }

  await prisma.template.upsert({
    where: { slug: "email-blueprint-invite" },
    update: {
      title: "Blueprint form invitation",
      kind: "email",
      stageSlug: "blueprint-form-not-sent",
      body: "Please complete the Business Blueprint Preparation form using your secure link. You can save and continue later.",
      isActive: true,
    },
    create: {
      slug: "email-blueprint-invite",
      title: "Blueprint form invitation",
      kind: "email",
      stageSlug: "blueprint-form-not-sent",
      body: "Please complete the Business Blueprint Preparation form using your secure link. You can save and continue later.",
      isActive: true,
    },
  });
}

async function main() {
  const owner = await seedOwner();
  const pipeline = await seedPipeline();
  await seedFormTemplate();
  await seedSopsAndTemplates();

  await prisma.auditEvent.create({
    data: {
      action: "seed.completed",
      actorUserId: owner.id,
      actorLabel: owner.email,
      entityType: "Pipeline",
      entityId: pipeline.id,
      detailsJson: JSON.stringify({ stages: DEFAULT_STAGES.length }),
    },
  });

  console.info(
    `[seed] Owner ${owner.email}; pipeline ${pipeline.slug} with ${DEFAULT_STAGES.length} stages.`,
  );
}

main()
  .catch((err) => {
    console.error("[seed] failed", err instanceof Error ? err.message : "unknown");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
