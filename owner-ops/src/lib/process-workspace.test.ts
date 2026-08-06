import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "child_process";
import path from "path";
import {
  ProcessConnectionType,
  ProcessStepType,
  ProcessVersionStatus,
  PainPointCategory,
  MetricDataSource,
} from "@prisma/client";
import { prisma } from "./db";
import { hashPassword } from "./crypto";
import { resetEnvCache } from "./env";
import {
  DEFAULT_PIPELINE_SLUG,
  DEFAULT_STAGES,
  BLUEPRINT_FORM_TEMPLATE_SLUG,
} from "./pipeline-seed-data";
import {
  addConnection,
  addStep,
  createProcess,
  deriveFutureStateDraft,
  submitVersion,
  refineAsOwnerDraft,
  updateDraftStep,
  ProcessGraphError,
} from "./process-graph";
import {
import { resetSqliteTestDatabase } from "./test-db";
  assignStepSwimlane,
  compareAsIsToFutureState,
  createImprovementOpportunity,
  createMetric,
  createPainPoint,
  createSwimlane,
  isOwnerEditableStatus,
  listRelatedProcessesForWorkspace,
  reorderSwimlanes,
  saveStepPositions,
  saveViewport,
  workspaceValidation,
} from "./process-workspace";

async function seedMinimal() {
  await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: {
      email: "owner@example.com",
      name: "Owner",
      passwordHash: hashPassword("change-me-before-use"),
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

describe("owner visual process workspace", () => {
  beforeAll(() => {
    resetEnvCache();
    const root = path.resolve(__dirname, "../..");
    const dbFile = path.join(root, "prisma/vitest.db");
    try {
      execSync(`rm -f "${dbFile}" "${dbFile}-journal"`, { stdio: "pipe" });
    } catch {
      /* ignore */
    }
    resetSqliteTestDatabase("prisma/vitest.db");
  }, 60_000);

  beforeEach(async () => {
    resetEnvCache();
    await prisma.improvementOpportunity.deleteMany();
    await prisma.processMetric.deleteMany();
    await prisma.processPainPoint.deleteMany();
    await prisma.processConnection.deleteMany();
    await prisma.processParticipant.deleteMany();
    await prisma.processApproval.deleteMany();
    await prisma.processStep.deleteMany();
    await prisma.processSwimlane.deleteMany();
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

  async function seedGraph() {
    const company = await prisma.company.create({
      data: { name: `WS Co ${Date.now()}` },
    });
    const { process, version } = await createProcess({
      companyId: company.id,
      name: "Field photo reporting and documentation",
      purpose: "Docs",
    });
    const s1 = await addStep(version.id, {
      shortName: "Start",
      stepType: ProcessStepType.TRIGGER,
    });
    const s2 = await addStep(version.id, {
      shortName: "Capture",
      stepType: ProcessStepType.HUMAN_TASK,
      responsibleRole: "Tech",
    });
    const s3 = await addStep(version.id, {
      shortName: "End",
      stepType: ProcessStepType.PROCESS_END,
    });
    await addConnection(version.id, {
      sourceStepId: s1.id,
      targetStepId: s2.id,
      connectionType: ProcessConnectionType.NORMAL,
      isDefaultPath: true,
    });
    await addConnection(version.id, {
      sourceStepId: s2.id,
      targetStepId: s3.id,
      connectionType: ProcessConnectionType.NORMAL,
      isDefaultPath: true,
    });
    return { company, process, version, s1, s2, s3 };
  }

  it("refines submitted version without mutating source; positions and lanes persist", async () => {
    const { process, version, s1, s2 } = await seedGraph();
    await submitVersion(version.id);
    const submitted = await prisma.processVersion.findUniqueOrThrow({
      where: { id: version.id },
    });
    expect(submitted.status).toBe(ProcessVersionStatus.SUBMITTED);
    expect(isOwnerEditableStatus(submitted.status)).toBe(false);

    const refined = await refineAsOwnerDraft(version.id, {
      actorLabel: "owner",
    });
    expect(refined.status).toBe(ProcessVersionStatus.OWNER_REFINED);
    expect(refined.parentVersionId).toBe(version.id);

    const originalSteps = await prisma.processStep.count({
      where: { processVersionId: version.id },
    });
    expect(originalSteps).toBe(3);

    const lane = await createSwimlane(refined.id, {
      name: "Field",
      kind: "DEPARTMENT",
    });
    const lane2 = await createSwimlane(refined.id, { name: "Office" });
    await reorderSwimlanes(refined.id, [lane2.id, lane.id]);
    const ordered = await prisma.processSwimlane.findMany({
      where: { processVersionId: refined.id },
      orderBy: { displayOrder: "asc" },
    });
    expect(ordered.map((l) => l.id)).toEqual([lane2.id, lane.id]);

    const draftStep = await prisma.processStep.findFirstOrThrow({
      where: { processVersionId: refined.id, sourceStepId: s2.id },
    });
    await assignStepSwimlane(draftStep.id, lane.id);
    const assigned = await prisma.processStep.findUniqueOrThrow({
      where: { id: draftStep.id },
    });
    expect(assigned.swimlaneId).toBe(lane.id);
    expect(assigned.department).toBe("Field");

    await saveStepPositions(refined.id, [
      { stepId: draftStep.id, canvasX: 42, canvasY: 99 },
    ]);
    const positioned = await prisma.processStep.findUniqueOrThrow({
      where: { id: draftStep.id },
    });
    expect(positioned.canvasX).toBe(42);
    expect(positioned.canvasY).toBe(99);

    // source step positions unchanged
    const src = await prisma.processStep.findUniqueOrThrow({ where: { id: s1.id } });
    expect(src.canvasX).toBeNull();
    expect(process.id).toBeTruthy();
  });

  it("captures pain points, metrics, opportunities; blocks savings without source", async () => {
    const { version, s2 } = await seedGraph();
    await expect(
      createPainPoint(version.id, {
        title: "Manual upload delay",
        category: PainPointCategory.DELAY_WAITING,
        estimatedFinancialImpact: "$10k",
      }),
    ).rejects.toMatchObject({ code: "validation" });

    const pain = await createPainPoint(version.id, {
      title: "Manual upload delay",
      category: PainPointCategory.DELAY_WAITING,
      processStepId: s2.id,
      estimatedFinancialImpact: "$10k",
      financialImpactSource: "Owner estimate from last quarter tickets",
    });
    const metric = await createMetric(version.id, {
      name: "Upload wait",
      currentValue: "45",
      unit: "minutes",
      dataSource: MetricDataSource.OWNER_ESTIMATE,
      processStepId: s2.id,
    });
    const opp = await createImprovementOpportunity(version.id, {
      title: "Auto-upload from phone",
      painPointId: pain.id,
      metricId: metric.id,
      processStepId: s2.id,
      category: "AUTOMATE",
    });
    expect(opp.painPointId).toBe(pain.id);
    expect(metric.dataSource).toBe(MetricDataSource.OWNER_ESTIMATE);
  });

  it("derives Future-State, compares lineage, and validates approval paths", async () => {
    const { version, s2 } = await seedGraph();
    await submitVersion(version.id);
    const future = await deriveFutureStateDraft(version.id);
    expect(future.classification).toBe("FUTURE_STATE");
    expect(future.derivedFromVersionId).toBe(version.id);

    const futureStep = await prisma.processStep.findFirstOrThrow({
      where: { processVersionId: future.id, sourceStepId: s2.id },
    });
    await prisma.processStep.update({
      where: { id: futureStep.id },
      data: { shortName: "Capture + geotag", toolOrSystem: "Field app v2" },
    });
    const added = await addStep(future.id, {
      shortName: "Auto compress",
      stepType: ProcessStepType.AUTOMATED_TASK,
    });
    expect(added.sourceStepId).toBeNull();

    const comparison = await compareAsIsToFutureState(version.id, future.id);
    expect(comparison.modifiedSteps.some((m) => m.changes.includes("name"))).toBe(
      true,
    );
    expect(comparison.addedSteps.some((a) => a.shortName === "Auto compress")).toBe(
      true,
    );
    expect(comparison.retainedSteps.length + comparison.modifiedSteps.length).toBeGreaterThan(
      0,
    );

    const asIsStill = await prisma.processVersion.findUniqueOrThrow({
      where: { id: version.id },
    });
    expect(asIsStill.status).toBe(ProcessVersionStatus.SUBMITTED);

    const decision = await addStep(future.id, {
      shortName: "Approve?",
      stepType: ProcessStepType.APPROVAL,
    });
    const result = await workspaceValidation(future.id);
    expect(result.issues.some((i) => i.code === "approval_paths")).toBe(true);
    expect(decision.id).toBeTruthy();
  });

  it("rejects lane assignment and analysis edits on submitted versions", async () => {
    const { version, s2 } = await seedGraph();
    await submitVersion(version.id);
    await expect(
      createSwimlane(version.id, { name: "Nope" }),
    ).rejects.toBeInstanceOf(ProcessGraphError);
    await expect(
      saveStepPositions(version.id, [
        { stepId: s2.id, canvasX: 1, canvasY: 1 },
      ]),
    ).rejects.toBeInstanceOf(ProcessGraphError);
  });

  it("preserves legacy FormProcess independently", async () => {
    expect(await prisma.formProcess.count()).toBe(0);
    await seedGraph();
    expect(await prisma.formProcess.count()).toBe(0);
  });

  it("persists viewport metadata; unassigned steps stay lane-null after reorder", async () => {
    const { version, s2 } = await seedGraph();
    await submitVersion(version.id);
    const refined = await refineAsOwnerDraft(version.id, { actorLabel: "owner" });
    await saveViewport(refined.id, JSON.stringify({ x: 10, y: 20, zoom: 1.2 }));
    const withVp = await prisma.processVersion.findUniqueOrThrow({
      where: { id: refined.id },
    });
    expect(JSON.parse(withVp.viewportJson ?? "{}")).toMatchObject({
      x: 10,
      y: 20,
      zoom: 1.2,
    });

    const lane = await createSwimlane(refined.id, { name: "Ops" });
    const draftStep = await prisma.processStep.findFirstOrThrow({
      where: { processVersionId: refined.id, sourceStepId: s2.id },
    });
    expect(draftStep.swimlaneId).toBeNull();
    await assignStepSwimlane(draftStep.id, lane.id);
    await reorderSwimlanes(refined.id, [lane.id]);
    const after = await prisma.processStep.findUniqueOrThrow({
      where: { id: draftStep.id },
    });
    expect(after.swimlaneId).toBe(lane.id);
    const untouched = await prisma.processStep.findFirstOrThrow({
      where: {
        processVersionId: refined.id,
        sourceStepId: { not: s2.id },
        shortName: "Start",
      },
    });
    expect(untouched.swimlaneId).toBeNull();
  });

  it("copies connections and participants on refine; rejects cross-process compare", async () => {
    const a = await seedGraph();
    await prisma.processParticipant.create({
      data: {
        processVersionId: a.version.id,
        processStepId: a.s2.id,
        participantType: "ROLE",
        role: "Field tech",
        responsibilityType: "RESPONSIBLE",
      },
    });
    await submitVersion(a.version.id);
    const refined = await refineAsOwnerDraft(a.version.id, { actorLabel: "owner" });
    expect(
      await prisma.processConnection.count({
        where: { processVersionId: refined.id },
      }),
    ).toBe(2);
    expect(
      await prisma.processParticipant.count({
        where: { processVersionId: refined.id },
      }),
    ).toBe(1);

    const b = await seedGraph();
    await expect(
      compareAsIsToFutureState(a.version.id, b.version.id),
    ).rejects.toMatchObject({ code: "isolation" });
  });

  it("separates structural errors from advisory warnings", async () => {
    const { version } = await seedGraph();
    const decision = await addStep(version.id, {
      shortName: "Need path?",
      stepType: ProcessStepType.DECISION,
    });
    await updateDraftStep(decision.id, { discussDuringBlueprint: true });
    const result = await workspaceValidation(version.id);
    expect(result.issues.some((i) => i.severity === "error")).toBe(true);
    expect(result.advisory.some((i) => i.code === "blueprint_item")).toBe(true);
  });

  it("lists related processes for landscape with company isolation", async () => {
    const company = await prisma.company.create({
      data: { name: `Landscape Co ${Date.now()}` },
    });
    const other = await prisma.company.create({
      data: { name: `Other Co ${Date.now()}` },
    });
    const contact = await prisma.contact.create({
      data: {
        firstName: "Pat",
        lastName: "Owner",
        email: `pat-${Date.now()}@example.com`,
      },
    });
    await prisma.companyContact.create({
      data: { companyId: company.id, contactId: contact.id },
    });
    const pipeline = await prisma.pipeline.findFirstOrThrow();
    const stage = await prisma.pipelineStage.findFirstOrThrow({
      where: { pipelineId: pipeline.id },
    });
    const opp = await prisma.opportunity.create({
      data: {
        companyId: company.id,
        contactId: contact.id,
        pipelineId: pipeline.id,
        stageId: stage.id,
        title: "Landscape opp",
      },
    });
    const otherOpp = await prisma.opportunity.create({
      data: {
        companyId: company.id,
        contactId: contact.id,
        pipelineId: pipeline.id,
        stageId: stage.id,
        title: "Other opp",
      },
    });

    const a = await createProcess({
      companyId: company.id,
      opportunityId: opp.id,
      name: "Process A",
    });
    const b = await createProcess({
      companyId: company.id,
      opportunityId: opp.id,
      name: "Process B",
    });
    await createProcess({
      companyId: company.id,
      opportunityId: otherOpp.id,
      name: "Wrong opportunity",
    });
    await createProcess({
      companyId: other.id,
      name: "Wrong company",
    });

    const landscape = await listRelatedProcessesForWorkspace(a.process.id);
    const names = landscape.processes.map((p) => p.name).sort();
    expect(names).toEqual(["Process A", "Process B"]);
    expect(landscape.processes.every((p) => p.companyId === company.id)).toBe(
      true,
    );
    expect(b.process.id).toBeTruthy();
  });

  it("auto-arrange positions do not alter connection records", async () => {
    const { version } = await seedGraph();
    const before = await prisma.processConnection.findMany({
      where: { processVersionId: version.id },
    });
    const steps = await prisma.processStep.findMany({
      where: { processVersionId: version.id },
    });
    const { computeAutoArrangePositions } = await import("./process-map-layout");
    const positions = computeAutoArrangePositions(steps, before);
    await saveStepPositions(
      version.id,
      positions.map((p) => ({
        stepId: p.stepId,
        canvasX: p.canvasX,
        canvasY: p.canvasY,
      })),
    );
    const after = await prisma.processConnection.findMany({
      where: { processVersionId: version.id },
    });
    expect(after.map((c) => c.id).sort()).toEqual(
      before.map((c) => c.id).sort(),
    );
    expect(after.map((c) => c.sourceStepId + c.targetStepId).sort()).toEqual(
      before.map((c) => c.sourceStepId + c.targetStepId).sort(),
    );
    const moved = await prisma.processStep.findMany({
      where: { processVersionId: version.id },
    });
    expect(moved.every((s) => s.canvasX != null)).toBe(true);
  });
});
