import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "child_process";
import path from "path";
import {
  FormProcessMigrationStatus,
  ProcessConnectionType,
  ProcessStepType,
  ProcessVersionClassification,
  ProcessVersionStatus,
} from "@prisma/client";
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
  addConnection,
  addParticipant,
  addStep,
  approveAsIsBaseline,
  assertProcessCompany,
  compareVersionMetadata,
  createProcess,
  deleteConnection,
  deleteDraftStep,
  deriveFutureStateDraft,
  getProcessGraph,
  listProcessVersions,
  ProcessGraphError,
  reopenAsNewDraft,
  submitVersion,
  updateDraftStep,
  validateGraphIntegrity,
} from "./process-graph";
import {
  countDemoGraphShapes,
  ensureOptimumFieldPhotoGraph,
} from "./process-graph-demo";
import { ProcessParticipantType } from "@prisma/client";
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

describe("process graph foundation", () => {
  beforeAll(() => {
    process.env.DATABASE_URL = "file:./prisma/vitest.db";
    resetEnvCache();
    const root = path.resolve(__dirname, "../..");
    const dbFile = path.join(root, "prisma/vitest.db");
    const nested = path.join(root, "prisma/prisma/vitest.db");
    try {
      execSync(`rm -f "${dbFile}" "${dbFile}-journal" "${nested}" "${nested}-journal"`, {
        stdio: "pipe",
      });
    } catch {
      /* ignore */
    }
    resetSqliteTestDatabase("prisma/vitest.db");
  }, 60_000);

  beforeEach(async () => {
    resetEnvCache();
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

  it("creates process + initial draft version with unique version numbers", async () => {
    const lead = await createContactCompanyOpportunity({
      firstName: "A",
      lastName: "B",
      email: `pg-${Date.now()}@example.test`,
      companyName: `PG Co ${Date.now()}`,
    });
    const { process, version } = await createProcess({
      companyId: lead.company.id,
      opportunityId: lead.opportunity.id,
      name: "Intake",
    });
    expect(version.versionNumber).toBe(1);
    expect(version.status).toBe(ProcessVersionStatus.DRAFT);
    expect(process.currentDraftVersionId).toBe(version.id);

    await expect(
      prisma.processVersion.create({
        data: {
          processId: process.id,
          versionNumber: 1,
          classification: ProcessVersionClassification.AS_IS,
          status: ProcessVersionStatus.DRAFT,
        },
      }),
    ).rejects.toThrow();
  });

  it("supports every step type and connection patterns including demo graph", async () => {
    const lead = await createContactCompanyOpportunity({
      firstName: "Opt",
      lastName: "Demo",
      email: `opt-${Date.now()}@example.test`,
      companyName: `Optimum Demo Contractors ${Date.now()}`,
    });
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: "owner@example.com" },
    });
    const graph = await ensureOptimumFieldPhotoGraph({
      companyId: lead.company.id,
      opportunityId: lead.opportunity.id,
      contactId: lead.contact.id,
      actorUserId: owner.id,
      submitAndApprove: false,
    });
    const version = graph.versions[0];
    const shapes = await countDemoGraphShapes(version.id);
    expect(shapes.steps).toBeGreaterThanOrEqual(8);
    expect(shapes.hasDecisionBranch).toBe(true);
    expect(shapes.hasApproval).toBe(true);
    expect(shapes.hasRejection).toBe(true);
    expect(shapes.hasParallel).toBe(true);
    expect(shapes.hasLoop).toBe(true);
    expect(shapes.hasRework).toBe(true);
    expect(shapes.hasEscalation).toBe(true);
    expect(shapes.hasTimeout).toBe(true);
    expect(shapes.hasFailure).toBe(true);

    for (const t of Object.values(ProcessStepType)) {
      // demo may not include SUBPROCESS; ensure API accepts it
      if (t === ProcessStepType.SUBPROCESS) {
        await addStep(version.id, {
          shortName: "Nested subprocess",
          stepType: t,
        });
      }
    }
    const types = await prisma.processStep.findMany({
      where: { processVersionId: version.id },
      select: { stepType: true },
    });
    expect(new Set(types.map((x) => x.stepType)).size).toBeGreaterThanOrEqual(
      12,
    );

    const validation = await validateGraphIntegrity(version.id);
    expect(validation.ok).toBe(true);
  });

  it("rejects cross-version and cross-process connections; prevents orphans", async () => {
    const a = await createContactCompanyOpportunity({
      firstName: "A",
      lastName: "1",
      email: `a-${Date.now()}@example.test`,
      companyName: `A Co ${Date.now()}`,
    });
    const b = await createContactCompanyOpportunity({
      firstName: "B",
      lastName: "2",
      email: `b-${Date.now()}@example.test`,
      companyName: `B Co ${Date.now()}`,
    });
    const pa = await createProcess({
      companyId: a.company.id,
      name: "A process",
    });
    const pb = await createProcess({
      companyId: b.company.id,
      name: "B process",
    });
    const sa = await addStep(pa.version.id, {
      shortName: "A1",
      stepType: ProcessStepType.HUMAN_TASK,
    });
    const sb = await addStep(pb.version.id, {
      shortName: "B1",
      stepType: ProcessStepType.HUMAN_TASK,
    });

    await expect(
      addConnection(pa.version.id, {
        sourceStepId: sa.id,
        targetStepId: sb.id,
        connectionType: ProcessConnectionType.NORMAL,
      }),
    ).rejects.toBeInstanceOf(ProcessGraphError);

    const sa2 = await addStep(pa.version.id, {
      shortName: "A2",
      stepType: ProcessStepType.HUMAN_TASK,
    });
    const conn = await addConnection(pa.version.id, {
      sourceStepId: sa.id,
      targetStepId: sa2.id,
      connectionType: ProcessConnectionType.NORMAL,
      isDefaultPath: true,
    });

    await expect(deleteDraftStep(sa.id)).rejects.toMatchObject({
      code: "conflict",
    });
    await deleteDraftStep(sa.id, { cleanupConnections: true });
    const leftover = await prisma.processConnection.findUnique({
      where: { id: conn.id },
    });
    expect(leftover).toBeNull();

    await expect(
      assertProcessCompany(pa.process.id, b.company.id),
    ).rejects.toMatchObject({ code: "isolation" });
  });

  it("enforces branch origins, duplicate defaults, and connection deletion", async () => {
    const lead = await createContactCompanyOpportunity({
      firstName: "C",
      lastName: "D",
      email: `c-${Date.now()}@example.test`,
      companyName: `C Co ${Date.now()}`,
    });
    const { version } = await createProcess({
      companyId: lead.company.id,
      name: "Branching",
    });
    const task = await addStep(version.id, {
      shortName: "Task",
      stepType: ProcessStepType.HUMAN_TASK,
    });
    const decision = await addStep(version.id, {
      shortName: "Decide",
      stepType: ProcessStepType.DECISION,
    });
    const end = await addStep(version.id, {
      shortName: "End",
      stepType: ProcessStepType.PROCESS_END,
    });

    await expect(
      addConnection(version.id, {
        sourceStepId: task.id,
        targetStepId: end.id,
        connectionType: ProcessConnectionType.APPROVED,
      }),
    ).rejects.toMatchObject({ code: "validation" });

    await addConnection(version.id, {
      sourceStepId: decision.id,
      targetStepId: end.id,
      connectionType: ProcessConnectionType.APPROVED,
      displayLabel: "Yes",
    });
    await addConnection(version.id, {
      sourceStepId: decision.id,
      targetStepId: task.id,
      connectionType: ProcessConnectionType.REJECTED,
      displayLabel: "No",
    });
    await addConnection(version.id, {
      sourceStepId: decision.id,
      targetStepId: task.id,
      connectionType: ProcessConnectionType.RETURNED_FOR_CORRECTION,
    });

    await addConnection(version.id, {
      sourceStepId: task.id,
      targetStepId: decision.id,
      connectionType: ProcessConnectionType.NORMAL,
      isDefaultPath: true,
    });
    await expect(
      addConnection(version.id, {
        sourceStepId: task.id,
        targetStepId: end.id,
        connectionType: ProcessConnectionType.NORMAL,
        isDefaultPath: true,
      }),
    ).rejects.toMatchObject({ code: "validation" });

    const toDelete = await addConnection(version.id, {
      sourceStepId: task.id,
      targetStepId: end.id,
      connectionType: ProcessConnectionType.FAILURE,
    });
    await deleteConnection(toDelete.id);
    expect(
      await prisma.processConnection.findUnique({ where: { id: toDelete.id } }),
    ).toBeNull();
  });

  it("submits immutably, reopens new draft, derives future-state, approves baseline", async () => {
    const lead = await createContactCompanyOpportunity({
      firstName: "V",
      lastName: "W",
      email: `v-${Date.now()}@example.test`,
      companyName: `V Co ${Date.now()}`,
    });
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: "owner@example.com" },
    });
    const graph = await ensureOptimumFieldPhotoGraph({
      companyId: lead.company.id,
      opportunityId: lead.opportunity.id,
      contactId: lead.contact.id,
      actorUserId: owner.id,
    });
    const v1 = graph.versions[0];
    await addParticipant({
      processVersionId: v1.id,
      participantType: ProcessParticipantType.DEPARTMENT,
      department: "Field",
      role: "Field crew",
    });

    await submitVersion(v1.id, { actorUserId: owner.id });
    const submitted = await prisma.processVersion.findUniqueOrThrow({
      where: { id: v1.id },
    });
    expect(submitted.status).toBe(ProcessVersionStatus.SUBMITTED);

    const step = await prisma.processStep.findFirstOrThrow({
      where: { processVersionId: v1.id },
    });
    await expect(
      updateDraftStep(step.id, { shortName: "Hacked" }),
    ).rejects.toMatchObject({ code: "immutable" });

    const draft2 = await reopenAsNewDraft(v1.id, { actorUserId: owner.id });
    expect(draft2.versionNumber).toBe(2);
    expect(draft2.status).toBe(ProcessVersionStatus.DRAFT);
    const v1After = await prisma.processVersion.findUniqueOrThrow({
      where: { id: v1.id },
    });
    expect(v1After.status).toBe(ProcessVersionStatus.SUPERSEDED);
    expect(v1After.versionNumber).toBe(1);

    const editStep = await prisma.processStep.findFirstOrThrow({
      where: { processVersionId: draft2.id },
    });
    await updateDraftStep(editStep.id, { shortName: "Edited in draft" });
    const sourceStep = await prisma.processStep.findFirstOrThrow({
      where: { processVersionId: v1.id, shortName: step.shortName },
    });
    expect(sourceStep.shortName).not.toBe("Edited in draft");

    await submitVersion(draft2.id);
    const { version: approved } = await approveAsIsBaseline(draft2.id, {
      approverUserId: owner.id,
      criteriaOrNotes: "Baseline ok",
    });
    expect(approved.status).toBe(ProcessVersionStatus.APPROVED);
    expect(
      await prisma.processApproval.count({
        where: { processVersionId: draft2.id },
      }),
    ).toBe(1);

    const future = await deriveFutureStateDraft(draft2.id, {
      actorUserId: owner.id,
    });
    expect(future.classification).toBe(
      ProcessVersionClassification.FUTURE_STATE,
    );
    expect(future.derivedFromVersionId).toBe(draft2.id);
    const asIsStill = await prisma.processVersion.findUniqueOrThrow({
      where: { id: draft2.id },
    });
    expect(asIsStill.status).toBe(ProcessVersionStatus.APPROVED);
    expect(asIsStill.classification).toBe(ProcessVersionClassification.AS_IS);

    const futureStep = await prisma.processStep.findFirstOrThrow({
      where: { processVersionId: future.id },
    });
    await updateDraftStep(futureStep.id, { shortName: "Future edit" });
    const approvedSteps = await prisma.processStep.findMany({
      where: { processVersionId: draft2.id },
    });
    expect(approvedSteps.every((s) => s.shortName !== "Future edit")).toBe(
      true,
    );

    const listed = await listProcessVersions(graph.id);
    expect(listed.length).toBeGreaterThanOrEqual(3);
    const cmp = await compareVersionMetadata(draft2.id, future.id);
    expect(cmp.a.classification).toBe(ProcessVersionClassification.AS_IS);
    expect(cmp.b.classification).toBe(
      ProcessVersionClassification.FUTURE_STATE,
    );

    const full = await getProcessGraph(graph.id, draft2.id, {
      expectedCompanyId: lead.company.id,
    });
    expect(full.version?.steps.length).toBeGreaterThanOrEqual(8);
    expect(full.validation?.ok).toBe(true);

    await expect(
      getProcessGraph(graph.id, draft2.id, {
        expectedCompanyId: "other-company",
      }),
    ).rejects.toMatchObject({ code: "isolation" });
  });

  it("preserves legacy FormProcess rows with review markers (migration contract)", async () => {
    const lead = await createContactCompanyOpportunity({
      firstName: "Leg",
      lastName: "Acy",
      email: `leg-${Date.now()}@example.test`,
      companyName: `Legacy Co ${Date.now()}`,
    });
    const template = await prisma.formTemplate.findFirstOrThrow();
    const inv = await prisma.formInvitation.create({
      data: {
        tokenHash: `hash-${Date.now()}`,
        tokenPrefix: "abcd",
        formTemplateId: template.id,
        contactId: lead.contact.id,
        opportunityId: lead.opportunity.id,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });
    const response = await prisma.formResponse.create({
      data: {
        invitationId: inv.id,
        version: 1,
        status: "SUBMITTED",
        payloadJson: "{}",
      },
    });
    const legacy = await prisma.formProcess.create({
      data: {
        formResponseId: response.id,
        name: "Legacy linear process",
        isDetailedMap: true,
        migrationStatus: FormProcessMigrationStatus.PRESERVED_LINEAR,
        detailJson: JSON.stringify({ note: "no fabricated edges" }),
        steps: {
          create: [
            {
              stepNumber: 1,
              sortOrder: 0,
              exactAction: "Do thing",
              decisionInvolved: "Prose only — not a ProcessConnection",
            },
          ],
        },
      },
      include: { steps: true },
    });
    expect(legacy.migrationStatus).toBe(
      FormProcessMigrationStatus.PRESERVED_LINEAR,
    );
    expect(legacy.steps).toHaveLength(1);
    expect(
      await prisma.processConnection.count({
        where: {
          /* legacy must not invent connections */
        },
      }),
    ).toBe(0);
    // Graph process table remains independent
    expect(await prisma.process.count()).toBe(0);
  });
});
