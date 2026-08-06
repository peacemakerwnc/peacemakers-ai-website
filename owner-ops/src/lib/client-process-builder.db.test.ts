import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  FormInvitationStatus,
  ProcessConnectionType,
  ProcessStepType,
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
import { createInvitation, resolveInvitationByRawToken } from "./invitations";
import {
  reopenSubmittedResponse,
  saveDraftByToken,
  submitByToken,
} from "./responses";
import { emptyBlueprintPayload, type BlueprintPayload } from "./form-schema";
import {
  addClientPath,
  addClientParticipant,
  addClientStep,
  connectNextStep,
  createClientProcess,
  deleteClientStep,
  duplicateClientStep,
  evaluateClientProcessCompleteness,
  listClientProcesses,
  reorderClientSteps,
  updateClientProcessOverview,
  updateClientStep,
} from "./client-process-builder";
import { ProcessGraphError } from "./process-graph";
import { LogEmailAdapter, setEmailAdapter } from "./mail";
import { resetRateLimits } from "./rate-limit";
import { applyOwnerOpsTestDatabaseEnv } from "./test-db";

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

function basePayload(email: string, company: string): BlueprintPayload {
  const p = emptyBlueprintPayload();
  return {
    ...p,
    privacy: {
      noticeVersion: "pilot-2026-08-05",
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
    },
    section1: {
      ...p.section1,
      firstName: "Alex",
      lastName: "Demo",
      email,
      companyName: company,
    },
    section8: {
      answersAreHonest: true,
      noSensitiveCredentials: true,
      mayUseForBlueprint: true,
      authorizedToProvide: true,
    },
  };
}

describe("client process builder", () => {
  const mail = new LogEmailAdapter();

  beforeAll(() => {
    // Requires OWNER_OPS_TEST_DATABASE_URL (non-Production Postgres). Fails hard if unset.
    applyOwnerOpsTestDatabaseEnv();
    resetEnvCache();
  }, 60_000);

  beforeEach(async () => {
    resetEnvCache();
    setEmailAdapter(mail);
    mail.sent.length = 0;
    resetRateLimits();
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

  async function openInvite() {
    const stamp = Date.now();
    const lead = await createContactCompanyOpportunity({
      firstName: "Alex",
      lastName: "Demo",
      email: `builder-${stamp}@example.test`,
      companyName: `Optimum Builder ${stamp}`,
    });
    const created = await createInvitation({
      contactId: lead.contact.id,
      opportunityId: lead.opportunity.id,
    });
    return { lead, token: created.rawToken, invitationId: created.invitation.id };
  }

  it("creates processes tied to the invitation draft and resumes", async () => {
    const { lead, token } = await openInvite();
    const a = await createClientProcess(token, {
      name: "Field photo reporting",
      purpose: "Document completed jobs",
      startTrigger: "Job marked complete",
      customerOutcome: "Report delivered",
      endEvent: "Billing notified",
    });
    await createClientProcess(token, { name: "Second process" });
    const listed = await listClientProcesses(token);
    expect(listed.versions).toHaveLength(2);
    expect(listed.session.companyId).toBe(lead.company.id);
    expect(listed.versions[0].formResponseId).toBe(listed.session.formResponseId);

    await updateClientProcessOverview(token, a.version.id, {
      purpose: "Updated purpose",
    });
    const again = await listClientProcesses(token);
    expect(
      again.versions.find((v) => v.id === a.version.id)?.purpose,
    ).toBe("Updated purpose");
  });

  it("supports steps, reorder, duplicate, insert-between, paths, and completeness", async () => {
    const { token } = await openInvite();
    const { version } = await createClientProcess(token, {
      name: "Field photo reporting",
      purpose: "Docs",
      startTrigger: "Job done",
      customerOutcome: "PDF sent",
      endEvent: "Done",
    });
    await addClientParticipant(token, version.id, {
      role: "Field Technician",
      department: "Field",
    });

    const s1 = await addClientStep(token, version.id, {
      shortName: "Trigger",
      stepType: ProcessStepType.TRIGGER,
    });
    const s2 = await addClientStep(token, version.id, {
      shortName: "Capture photos",
      stepType: ProcessStepType.HUMAN_TASK,
      afterStepId: s1.id,
      connectFromPrevious: true,
      toolOrSystem: "Phone camera",
      responsibleRole: "Field Tech",
    });
    const s3 = await addClientStep(token, version.id, {
      shortName: "Upload",
      stepType: ProcessStepType.DATA_ENTRY,
      afterStepId: s2.id,
      connectFromPrevious: true,
    });
    const between = await addClientStep(token, version.id, {
      shortName: "Label folders",
      stepType: ProcessStepType.HUMAN_TASK,
      afterStepId: s2.id,
      connectFromPrevious: false,
    });
    expect(between.displayOrder).toBe(s2.displayOrder + 1);

    const dup = await duplicateClientStep(token, s3.id);
    expect(dup.shortName).toContain("copy");

    const ordered = await reorderClientSteps(token, version.id, [
      s1.id,
      s2.id,
      between.id,
      s3.id,
      dup.id,
    ]);
    expect(ordered.map((s) => s.id)).toEqual([
      s1.id,
      s2.id,
      between.id,
      s3.id,
      dup.id,
    ]);

    await deleteClientStep(token, dup.id, { cleanupConnections: true });

    const decision = await addClientStep(token, version.id, {
      shortName: "Completeness check",
      stepType: ProcessStepType.DECISION,
    });
    const approval = await addClientStep(token, version.id, {
      shortName: "Manager approval",
      stepType: ProcessStepType.APPROVAL,
    });
    const wait = await addClientStep(token, version.id, {
      shortName: "Wait for customer",
      stepType: ProcessStepType.WAITING_PERIOD,
      typicalWaitingTime: "2 days",
    });
    const end = await addClientStep(token, version.id, {
      shortName: "End",
      stepType: ProcessStepType.PROCESS_END,
    });
    const escalate = await addClientStep(token, version.id, {
      shortName: "Escalate",
      stepType: ProcessStepType.EXCEPTION,
    });

    await connectNextStep(token, version.id, s3.id, decision.id);
    await addClientPath(token, version.id, {
      sourceStepId: decision.id,
      targetStepId: approval.id,
      connectionType: ProcessConnectionType.CONDITIONAL,
      condition: "Complete",
      isDefaultPath: true,
    });
    await addClientPath(token, version.id, {
      sourceStepId: decision.id,
      targetStepId: s2.id,
      connectionType: ProcessConnectionType.REWORK,
    });
    await addClientPath(token, version.id, {
      sourceStepId: decision.id,
      targetStepId: s3.id,
      connectionType: ProcessConnectionType.LOOP,
    });
    await addClientPath(token, version.id, {
      sourceStepId: s3.id,
      targetStepId: decision.id,
      connectionType: ProcessConnectionType.PARALLEL,
    });
    await addClientPath(token, version.id, {
      sourceStepId: between.id,
      targetStepId: decision.id,
      connectionType: ProcessConnectionType.PARALLEL,
    });
    await addClientPath(token, version.id, {
      sourceStepId: approval.id,
      targetStepId: wait.id,
      connectionType: ProcessConnectionType.APPROVED,
    });
    await addClientPath(token, version.id, {
      sourceStepId: approval.id,
      targetStepId: s2.id,
      connectionType: ProcessConnectionType.REJECTED,
    });
    await addClientPath(token, version.id, {
      sourceStepId: approval.id,
      targetStepId: s2.id,
      connectionType: ProcessConnectionType.RETURNED_FOR_CORRECTION,
    });
    await addClientPath(token, version.id, {
      sourceStepId: wait.id,
      targetStepId: end.id,
      connectionType: ProcessConnectionType.NORMAL,
      isDefaultPath: true,
    });
    await addClientPath(token, version.id, {
      sourceStepId: wait.id,
      targetStepId: escalate.id,
      connectionType: ProcessConnectionType.TIMEOUT,
    });
    await addClientPath(token, version.id, {
      sourceStepId: escalate.id,
      targetStepId: end.id,
      connectionType: ProcessConnectionType.FAILURE,
    });
    await addClientPath(token, version.id, {
      sourceStepId: escalate.id,
      targetStepId: end.id,
      connectionType: ProcessConnectionType.ESCALATION,
    });

    await updateClientStep(token, wait.id, {
      discussDuringBlueprint: true,
      clientNotes: "Confirm SLA on call",
    });

    const completeness = await evaluateClientProcessCompleteness(version.id);
    expect(completeness.validation.ok).toBe(true);
    expect(completeness.requiredOk).toBe(true);
    expect(completeness.discussCount).toBe(1);
  });

  it("blocks connected delete without cleanup and rejects cross-invite access", async () => {
    const a = await openInvite();
    const b = await openInvite();
    const { version } = await createClientProcess(a.token, {
      name: "A",
      purpose: "p",
      startTrigger: "t",
      customerOutcome: "o",
      endEvent: "e",
    });
    await addClientParticipant(a.token, version.id, { role: "Owner" });
    const s1 = await addClientStep(a.token, version.id, {
      shortName: "One",
      stepType: ProcessStepType.HUMAN_TASK,
    });
    const s2 = await addClientStep(a.token, version.id, {
      shortName: "Two",
      stepType: ProcessStepType.HUMAN_TASK,
    });
    await connectNextStep(a.token, version.id, s1.id, s2.id);
    await expect(deleteClientStep(a.token, s1.id)).rejects.toMatchObject({
      code: "conflict",
    });
    await deleteClientStep(a.token, s1.id, { cleanupConnections: true });

    await expect(
      updateClientProcessOverview(b.token, version.id, { name: "Hacked" }),
    ).rejects.toBeInstanceOf(ProcessGraphError);
  });

  it("submits freezing process versions; reopen forks; original preserved", async () => {
    const { token, invitationId, lead } = await openInvite();
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: "owner@example.com" },
    });
    const { version } = await createClientProcess(token, {
      name: "Field photo reporting",
      purpose: "Document jobs",
      startTrigger: "Job complete",
      customerOutcome: "Report delivered",
      endEvent: "Closed",
    });
    await addClientParticipant(token, version.id, { role: "Tech" });
    const s1 = await addClientStep(token, version.id, {
      shortName: "Start",
      stepType: ProcessStepType.TRIGGER,
    });
    const s2 = await addClientStep(token, version.id, {
      shortName: "End",
      stepType: ProcessStepType.PROCESS_END,
      afterStepId: s1.id,
      connectFromPrevious: true,
    });
    expect(s2.id).toBeTruthy();

    const payload = basePayload(lead.contact.email, lead.company.name);
    await saveDraftByToken(token, payload);
    await submitByToken(token, payload);

    const submitted = await prisma.processVersion.findUniqueOrThrow({
      where: { id: version.id },
    });
    expect(submitted.status).toBe(ProcessVersionStatus.SUBMITTED);

    await expect(
      updateClientStep(token, s1.id, { shortName: "Nope" }),
    ).rejects.toBeTruthy();

    const draft = await reopenSubmittedResponse(invitationId, owner.id);
    const versions = await prisma.processVersion.findMany({
      where: { processId: submitted.processId },
      orderBy: { versionNumber: "asc" },
    });
    expect(versions[0].status).toBe(ProcessVersionStatus.SUPERSEDED);
    expect(versions[0].id).toBe(version.id);
    const newDraft = versions.find((v) => v.status === ProcessVersionStatus.DRAFT);
    expect(newDraft?.formResponseId).toBe(draft.id);
    expect(newDraft?.versionNumber).toBe(2);

    const inv = await resolveInvitationByRawToken(token);
    expect(inv.status).toBe(FormInvitationStatus.IN_PROGRESS);

    // Same token can edit new draft
    const step = await prisma.processStep.findFirstOrThrow({
      where: { processVersionId: newDraft!.id },
    });
    await updateClientStep(token, step.id, { shortName: "Corrected start" });
    const originalStep = await prisma.processStep.findFirstOrThrow({
      where: { processVersionId: version.id, shortName: "Start" },
    });
    expect(originalStep.shortName).toBe("Start");
  });

  it("preserves legacy FormProcess counts independently of graph", async () => {
    const before = await prisma.formProcess.count();
    expect(before).toBe(0);
    // Graph create should not invent FormProcess rows
    const { token } = await openInvite();
    await createClientProcess(token, { name: "Graph only" });
    expect(await prisma.formProcess.count()).toBe(0);
  });

  it("blocks submit when decisions lack outcomes or graph is incomplete", async () => {
    const { token, lead } = await openInvite();
    const { version } = await createClientProcess(token, {
      name: "Incomplete decision process",
      purpose: "Test",
      startTrigger: "Start",
      customerOutcome: "Done",
      endEvent: "Done",
    });
    await addClientParticipant(token, version.id, { role: "Owner" });
    const s1 = await addClientStep(token, version.id, {
      shortName: "Start",
      stepType: ProcessStepType.TRIGGER,
    });
    const decision = await addClientStep(token, version.id, {
      shortName: "Decide",
      stepType: ProcessStepType.DECISION,
      afterStepId: s1.id,
      connectFromPrevious: true,
    });
    // Only one outcome — incomplete for a decision
    await addClientStep(token, version.id, {
      shortName: "Yes path",
      stepType: ProcessStepType.HUMAN_TASK,
    });
    const completeness = await evaluateClientProcessCompleteness(version.id);
    expect(completeness.requiredOk).toBe(false);
    expect(completeness.scorePct).toBeLessThan(100);
    expect(
      completeness.items.some(
        (i) => i.code === `decision_${decision.id}` && !i.ok,
      ),
    ).toBe(true);

    const payload = basePayload(lead.contact.email, lead.company.name);
    await saveDraftByToken(token, payload);
    await expect(submitByToken(token, payload)).rejects.toMatchObject({
      code: "invalid",
    });
  });

  it("denies process builder when invitation is revoked or expired", async () => {
    const { token, invitationId } = await openInvite();
    await createClientProcess(token, { name: "Will revoke" });
    await prisma.formInvitation.update({
      where: { id: invitationId },
      data: {
        status: FormInvitationStatus.REVOKED,
        revokedAt: new Date(),
      },
    });
    await expect(listClientProcesses(token)).rejects.toMatchObject({
      code: "revoked",
    });

    const expired = await openInvite();
    await createClientProcess(expired.token, { name: "Will expire" });
    await prisma.formInvitation.update({
      where: { id: expired.invitationId },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    await expect(listClientProcesses(expired.token)).rejects.toMatchObject({
      code: "expired",
    });
  });

  it("isolates processes by company and opportunity", async () => {
    const a = await openInvite();
    const b = await openInvite();
    const { version } = await createClientProcess(a.token, {
      name: "A only",
      purpose: "p",
      startTrigger: "t",
      customerOutcome: "o",
      endEvent: "e",
    });
    const listedB = await listClientProcesses(b.token);
    expect(listedB.versions.find((v) => v.id === version.id)).toBeUndefined();
    expect(listedB.session.companyId).not.toBe(a.lead.company.id);
    expect(listedB.session.opportunityId).not.toBe(a.lead.opportunity.id);
  });
});
