import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "child_process";
import path from "path";
import { MeetingStatus } from "@prisma/client";
import { prisma } from "./db";
import { hashPassword } from "./crypto";
import { createContactCompanyOpportunity } from "./crm";
import { resetEnvCache } from "./env";
import {
  DEFAULT_PIPELINE_SLUG,
  DEFAULT_STAGES,
  BLUEPRINT_FORM_TEMPLATE_SLUG,
} from "./pipeline-seed-data";
import {
  createMeeting,
  updateMeeting,
  updateEstimatedValue,
  addProposedService,
  updateProposedService,
  deleteProposedService,
  parseEstimatedValueDollars,
  WorkflowValidationError,
} from "./opportunity-ops";

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

describe("parseEstimatedValueDollars", () => {
  it("distinguishes blank from zero and rejects negatives", () => {
    expect(parseEstimatedValueDollars("")).toBeNull();
    expect(parseEstimatedValueDollars("  ")).toBeNull();
    expect(parseEstimatedValueDollars("0")).toBe(0);
    expect(parseEstimatedValueDollars("5000")).toBe(5000);
    expect(parseEstimatedValueDollars("12.49")).toBe(12);
    expect(() => parseEstimatedValueDollars("-1")).toThrow(WorkflowValidationError);
    expect(() => parseEstimatedValueDollars("abc")).toThrow(WorkflowValidationError);
  });
});

describe("opportunity meetings, value, and proposed services", () => {
  beforeAll(() => {
    resetEnvCache();
    const dbFile = path.join(__dirname, "../../prisma/vitest.db");
    execSync(`rm -f "${dbFile}" "${dbFile}-journal"`, { stdio: "pipe" });
    execSync("npx prisma db push --skip-generate", {
      cwd: path.join(__dirname, "../.."),
      env: { ...process.env, DATABASE_URL: "file:./prisma/vitest.db" },
      stdio: "pipe",
    });
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

  it("creates and updates meetings with activity and company association", async () => {
    const owner = (await prisma.user.findFirst())!;
    const lead = await createContactCompanyOpportunity({
      firstName: "Alex",
      lastName: "Morgan",
      email: `alex-${Date.now()}@example.test`,
      companyName: `Optimum ${Date.now()}`,
      ownerUserId: owner.id,
    });

    const meeting = await createMeeting({
      opportunityId: lead.opportunity.id,
      actorUserId: owner.id,
      title: "Discovery call",
      scheduledAt: new Date("2026-08-10T15:00:00Z"),
      notes: "Discuss Blueprint",
    });

    expect(meeting.opportunityId).toBe(lead.opportunity.id);
    expect(meeting.contactId).toBe(lead.contact.id);
    expect(meeting.companyId).toBe(lead.company.id);
    expect(meeting.status).toBe(MeetingStatus.SCHEDULED);

    const updated = await updateMeeting({
      meetingId: meeting.id,
      actorUserId: owner.id,
      status: MeetingStatus.COMPLETED,
      notes: "Completed",
    });
    expect(updated.status).toBe(MeetingStatus.COMPLETED);
    expect(updated.completedAt).toBeTruthy();

    const activities = await prisma.activity.findMany({
      where: { opportunityId: lead.opportunity.id },
      orderBy: { createdAt: "asc" },
    });
    expect(activities.map((a) => a.type)).toEqual(
      expect.arrayContaining(["meeting.created", "meeting.updated"]),
    );
  });

  it("rejects meeting create for unknown opportunity", async () => {
    const owner = (await prisma.user.findFirst())!;
    await expect(
      createMeeting({
        opportunityId: "missing-id",
        actorUserId: owner.id,
        title: "Ghost",
      }),
    ).rejects.toThrow(WorkflowValidationError);
  });

  it("updates estimated value and records activity", async () => {
    const owner = (await prisma.user.findFirst())!;
    const lead = await createContactCompanyOpportunity({
      firstName: "Sam",
      lastName: "River",
      email: `sam-${Date.now()}@example.test`,
      companyName: `River Co ${Date.now()}`,
      ownerUserId: owner.id,
    });

    await updateEstimatedValue({
      opportunityId: lead.opportunity.id,
      actorUserId: owner.id,
      rawValue: "5000",
    });
    let opp = await prisma.opportunity.findUniqueOrThrow({
      where: { id: lead.opportunity.id },
    });
    expect(opp.estimatedValue).toBe(5000);

    await updateEstimatedValue({
      opportunityId: lead.opportunity.id,
      actorUserId: owner.id,
      rawValue: "",
    });
    opp = await prisma.opportunity.findUniqueOrThrow({
      where: { id: lead.opportunity.id },
    });
    expect(opp.estimatedValue).toBeNull();

    await updateEstimatedValue({
      opportunityId: lead.opportunity.id,
      actorUserId: owner.id,
      rawValue: "0",
    });
    opp = await prisma.opportunity.findUniqueOrThrow({
      where: { id: lead.opportunity.id },
    });
    expect(opp.estimatedValue).toBe(0);

    const activity = await prisma.activity.findFirst({
      where: {
        opportunityId: lead.opportunity.id,
        type: "opportunity.estimated_value_updated",
      },
      orderBy: { createdAt: "desc" },
    });
    expect(activity?.summary).toContain("$0");
  });

  it("adds, updates, and deletes proposed services with activity", async () => {
    const owner = (await prisma.user.findFirst())!;
    const lead = await createContactCompanyOpportunity({
      firstName: "Jamie",
      lastName: "Cole",
      email: `jamie-${Date.now()}@example.test`,
      companyName: `Cole Co ${Date.now()}`,
      ownerUserId: owner.id,
    });

    const a = await addProposedService({
      opportunityId: lead.opportunity.id,
      actorUserId: owner.id,
      name: "Process mapping",
    });
    const b = await addProposedService({
      opportunityId: lead.opportunity.id,
      actorUserId: owner.id,
      name: "Owner ops setup",
      status: "proposed",
    });
    expect(a.id).not.toBe(b.id);

    await updateProposedService({
      serviceId: a.id,
      actorUserId: owner.id,
      status: "accepted",
      notes: "Priority",
    });
    await deleteProposedService({
      serviceId: b.id,
      actorUserId: owner.id,
    });

    const remaining = await prisma.proposedService.findMany({
      where: { opportunityId: lead.opportunity.id },
    });
    expect(remaining).toHaveLength(1);
    expect(remaining[0].name).toBe("Process mapping");
    expect(remaining[0].status).toBe("accepted");

    const types = (
      await prisma.activity.findMany({
        where: { opportunityId: lead.opportunity.id },
      })
    ).map((x) => x.type);
    expect(types).toEqual(
      expect.arrayContaining([
        "proposed_service.added",
        "proposed_service.updated",
        "proposed_service.removed",
      ]),
    );
  });

  it("isolates mutations across two fictional opportunities", async () => {
    const owner = (await prisma.user.findFirst())!;
    const a = await createContactCompanyOpportunity({
      firstName: "One",
      lastName: "Alpha",
      email: `one-${Date.now()}@example.test`,
      companyName: `Alpha ${Date.now()}`,
      ownerUserId: owner.id,
    });
    const b = await createContactCompanyOpportunity({
      firstName: "Two",
      lastName: "Beta",
      email: `two-${Date.now()}@example.test`,
      companyName: `Beta ${Date.now()}`,
      ownerUserId: owner.id,
    });

    const meetingA = await createMeeting({
      opportunityId: a.opportunity.id,
      actorUserId: owner.id,
      title: "A only",
    });
    const serviceA = await addProposedService({
      opportunityId: a.opportunity.id,
      actorUserId: owner.id,
      name: "A service",
    });
    await updateEstimatedValue({
      opportunityId: a.opportunity.id,
      actorUserId: owner.id,
      rawValue: "1000",
    });

    const meetingOnB = await prisma.meeting.findFirst({
      where: { id: meetingA.id, opportunityId: b.opportunity.id },
    });
    expect(meetingOnB).toBeNull();

    const servicesOnB = await prisma.proposedService.findMany({
      where: { opportunityId: b.opportunity.id },
    });
    expect(servicesOnB).toHaveLength(0);
    expect(serviceA.opportunityId).toBe(a.opportunity.id);

    const oppB = await prisma.opportunity.findUniqueOrThrow({
      where: { id: b.opportunity.id },
    });
    expect(oppB.estimatedValue).toBeNull();

    await expect(
      updateMeeting({
        meetingId: meetingA.id,
        actorUserId: owner.id,
        title: "Still A",
      }),
    ).resolves.toMatchObject({ opportunityId: a.opportunity.id });
  });
});
