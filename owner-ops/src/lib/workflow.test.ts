import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "child_process";
import path from "path";
import { prisma } from "./db";
import { hashPassword } from "./crypto";
import { createContactCompanyOpportunity } from "./crm";
import {
  transitionOpportunityStage,
  createNextAction,
  completeNextAction,
} from "./workflow";
import { resetEnvCache } from "./env";
import {
  DEFAULT_PIPELINE_SLUG,
  DEFAULT_STAGES,
  BLUEPRINT_FORM_TEMPLATE_SLUG,
} from "./pipeline-seed-data";
import { resetSqliteTestDatabase } from "./test-db";

async function seedMinimal() {
  const passwordHash = hashPassword("change-me-before-use");
  await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: {
      email: "owner@example.com",
      name: "Owner",
      passwordHash,
      isOwner: true,
    },
  });
  const pipeline = await prisma.pipeline.upsert({
    where: { slug: DEFAULT_PIPELINE_SLUG },
    update: {},
    create: {
      name: "Test Pipeline",
      slug: DEFAULT_PIPELINE_SLUG,
      isDefault: true,
    },
  });
  for (let i = 0; i < DEFAULT_STAGES.length; i++) {
    const s = DEFAULT_STAGES[i];
    await prisma.pipelineStage.upsert({
      where: { pipelineId_slug: { pipelineId: pipeline.id, slug: s.slug } },
      update: {},
      create: {
        pipelineId: pipeline.id,
        name: s.name,
        slug: s.slug,
        sortOrder: i,
        objective: s.objective,
        requiredInformation: s.requiredInformation,
        requiredOwnerAction: s.requiredOwnerAction,
        clientFacingArtifact: s.clientFacingArtifact,
        suggestedMessage: s.suggestedMessage,
        relevantSopSlug: s.relevantSopSlug,
        exitCriteria: s.exitCriteria,
        nextStageSlug: s.nextStageSlug,
        isTerminal: s.isTerminal,
      },
    });
  }
  await prisma.formTemplate.upsert({
    where: { slug: BLUEPRINT_FORM_TEMPLATE_SLUG },
    update: {},
    create: {
      slug: BLUEPRINT_FORM_TEMPLATE_SLUG,
      name: "Business Blueprint Preparation",
      version: 1,
      schemaJson: "{}",
    },
  });
}

describe("workflow stage transitions and next actions", () => {
  beforeAll(() => {
    resetEnvCache();
    const dbFile = path.join(__dirname, "../../prisma/vitest.db");
    execSync(`rm -f "${dbFile}" "${dbFile}-journal"`, { stdio: "pipe" });
    resetSqliteTestDatabase("prisma/vitest.db");
  });

  beforeEach(async () => {
    resetEnvCache();
    await prisma.proposedService.deleteMany();
    await prisma.meeting.deleteMany();
    await prisma.nextAction.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.note.deleteMany();
    await prisma.auditEvent.deleteMany();
    await prisma.processConnection.deleteMany();
    await prisma.processParticipant.deleteMany();
    await prisma.processApproval.deleteMany();
    await prisma.processStep.deleteMany();
    await prisma.processVersion.deleteMany();
    await prisma.formProcessStep.deleteMany();
    await prisma.formProcess.deleteMany();
    await prisma.process.deleteMany();
    await prisma.formResponse.deleteMany();
    await prisma.formInvitation.deleteMany();
    await prisma.opportunity.deleteMany();
    await prisma.companyContact.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.company.deleteMany();
    await seedMinimal();
  });

  it("moves opportunity stage and records activity", async () => {
    const owner = (await prisma.user.findFirst())!;
    const lead = await createContactCompanyOpportunity({
      firstName: "Pat",
      lastName: "Lee",
      email: `pat-${Date.now()}@example.com`,
      companyName: `Lee Co ${Date.now()}`,
      ownerUserId: owner.id,
    });

    const result = await transitionOpportunityStage({
      opportunityId: lead.opportunity.id,
      stageSlug: "blueprint-form-sent",
      actorUserId: owner.id,
      note: "Sent form link",
    });

    expect(result.stage.slug).toBe("blueprint-form-sent");
    const activity = await prisma.activity.findFirst({
      where: {
        opportunityId: lead.opportunity.id,
        type: "stage.changed",
      },
    });
    expect(activity).not.toBeNull();
    const note = await prisma.note.findFirst({
      where: { opportunityId: lead.opportunity.id },
    });
    expect(note?.body).toBe("Sent form link");
  });

  it("creates and completes next actions", async () => {
    const owner = (await prisma.user.findFirst())!;
    const lead = await createContactCompanyOpportunity({
      firstName: "Sam",
      lastName: "Kim",
      email: `sam-${Date.now()}@example.com`,
      companyName: `Kim Co ${Date.now()}`,
      ownerUserId: owner.id,
    });

    const action = await createNextAction({
      opportunityId: lead.opportunity.id,
      title: "Call prospect",
      dueAt: new Date(Date.now() + 86400000),
      actorUserId: owner.id,
    });
    expect(action.status).toBe("OPEN");

    const done = await completeNextAction(action.id, owner.id);
    expect(done.status).toBe("DONE");
    expect(done.completedAt).not.toBeNull();
  });
});
