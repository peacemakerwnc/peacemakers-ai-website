import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "child_process";
import path from "path";
import {
  EvidenceConflictStatus,
  EvidenceFindingReviewStatus,
  EvidenceSourceStatus,
  EvidenceSourceType,
  FormResponseStatus,
  ProcessStepType,
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
  EvidenceError,
  addEvidenceSource,
  assertSecureAttachmentStorageAvailable,
  createBlueprintMeeting,
  createEvidenceConflict,
  createProposedFinding,
  finalizeEvidenceSource,
  getBlueprintMeeting,
  resolveEvidenceConflict,
  reviewFinding,
  supersedeEvidenceSource,
  validateTranscriptUpload,
} from "./blueprint-evidence";
import { calculateBlueprintReadiness } from "./blueprint-readiness";
import { buildBlueprintReviewPacket } from "./blueprint-review-packet";
import { createProcess, addStep, submitVersion } from "./process-graph";
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

async function setupPair() {
  const a = await createContactCompanyOpportunity({
    firstName: "Ann",
    lastName: "Alpha",
    email: `ann-${Date.now()}@example.com`,
    companyName: `Alpha Co ${Date.now()}`,
  });
  const b = await createContactCompanyOpportunity({
    firstName: "Bob",
    lastName: "Beta",
    email: `bob-${Date.now()}@example.com`,
    companyName: `Beta Co ${Date.now()}`,
  });
  return { a, b };
}

async function createSubmittedResponse(opts: {
  opportunityId: string;
  contactId: string;
  payload: Record<string, unknown>;
}) {
  const template = await prisma.formTemplate.findFirstOrThrow();
  const inv = await prisma.formInvitation.create({
    data: {
      tokenHash: `hash-${Date.now()}-${Math.random()}`,
      tokenPrefix: `tp${Date.now()}`.slice(0, 8),
      opportunityId: opts.opportunityId,
      contactId: opts.contactId,
      formTemplateId: template.id,
      status: "SENT",
      expiresAt: new Date(Date.now() + 86400000),
    },
  });
  return prisma.formResponse.create({
    data: {
      invitationId: inv.id,
      status: FormResponseStatus.SUBMITTED,
      version: 1,
      payloadJson: JSON.stringify(opts.payload),
      completionPct: 90,
      submittedAt: new Date(),
    },
  });
}

describe("Increment 4 blueprint evidence foundation", () => {
  beforeAll(() => {
    process.env.DATABASE_URL = "file:./prisma/vitest.db";
    resetEnvCache();
    const root = path.resolve(__dirname, "../..");
    const dbFile = path.join(root, "prisma/vitest.db");
    const nested = path.join(root, "prisma/prisma/vitest.db");
    try {
      execSync(
        `rm -f "${dbFile}" "${dbFile}-journal" "${nested}" "${nested}-journal"`,
        { stdio: "pipe" },
      );
    } catch {
      /* ignore */
    }
    resetSqliteTestDatabase("prisma/vitest.db");
  }, 60_000);

  beforeEach(async () => {
    resetEnvCache();
    await prisma.evidenceConflict.deleteMany();
    await prisma.evidenceFinding.deleteMany();
    await prisma.evidenceSource.deleteMany();
    await prisma.blueprintMeetingAttendee.deleteMany();
    await prisma.blueprintMeetingProcess.deleteMany();
    await prisma.blueprintMeeting.deleteMany();
    await prisma.processConnection.deleteMany();
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

  it("creates authorized meeting and rejects cross-company access", async () => {
    const { a, b } = await setupPair();
    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Blueprint call",
      facilitatorLabel: "James",
    });
    expect(meeting.status).toBe("PLANNED");
    await expect(
      getBlueprintMeeting(meeting.id, b.company.id),
    ).rejects.toMatchObject({ code: "isolation" });
  });

  it("client company mismatch on form response fails", async () => {
    const { a, b } = await setupPair();
    const fr = await createSubmittedResponse({
      opportunityId: b.opportunity.id,
      contactId: b.contact.id,
      payload: {},
    });
    await expect(
      createBlueprintMeeting({
        companyId: a.company.id,
        opportunityId: a.opportunity.id,
        formResponseId: fr.id,
        title: "Bad link",
      }),
    ).rejects.toMatchObject({ code: "isolation" });
  });

  it("preserves original transcript when superseding", async () => {
    const { a } = await setupPair();
    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Call",
    });
    const source = await addEvidenceSource({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      sourceType: EvidenceSourceType.BLUEPRINT_TRANSCRIPT,
      title: "Transcript",
      bodyText: "Original transcript text about two hours.",
      finalize: true,
    });
    expect(source.status).toBe(EvidenceSourceStatus.FINALIZED);
    expect(source.originalBodyText).toContain("two hours");
    const next = await supersedeEvidenceSource(source.id, a.company.id, {
      bodyText: "Corrected: six hours.",
    });
    const original = await prisma.evidenceSource.findUniqueOrThrow({
      where: { id: source.id },
    });
    expect(original.status).toBe(EvidenceSourceStatus.SUPERSEDED);
    expect(original.originalBodyText).toContain("two hours");
    expect(next.parentSourceId).toBe(source.id);
    expect(next.version).toBe(source.version + 1);
  });

  it("proposed findings are not accepted until review; rejection does not mutate questionnaire", async () => {
    const { a } = await setupPair();
    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Call",
    });
    const source = await addEvidenceSource({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      sourceType: EvidenceSourceType.CONSULTANT_NOTE,
      title: "Notes",
      bodyText: "Photo reporting takes six hours monthly.",
      finalize: true,
    });
    const finding = await createProposedFinding({
      sourceId: source.id,
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      title: "Time burden: photo reporting",
      excerpt: "six hours monthly",
      sourceLocation: "notes:1",
      confidence: "MEDIUM",
    });
    expect(finding.reviewStatus).toBe(EvidenceFindingReviewStatus.PROPOSED);

    const payloadBefore = { section2: { threeGoals: "Grow" } };
    const fr = await createSubmittedResponse({
      opportunityId: a.opportunity.id,
      contactId: a.contact.id,
      payload: payloadBefore,
    });

    await reviewFinding(finding.id, a.company.id, { type: "reject" });
    const rejected = await prisma.evidenceFinding.findUniqueOrThrow({
      where: { id: finding.id },
    });
    expect(rejected.reviewStatus).toBe(EvidenceFindingReviewStatus.REJECTED);
    const frAfter = await prisma.formResponse.findUniqueOrThrow({
      where: { id: fr.id },
    });
    expect(frAfter.payloadJson).toBe(JSON.stringify(payloadBefore));
  });

  it("accept / correct_accept / duplicate / needs_clarification retain source", async () => {
    const { a } = await setupPair();
    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Call",
    });
    const source = await addEvidenceSource({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      sourceType: EvidenceSourceType.BLUEPRINT_TRANSCRIPT,
      title: "T",
      bodyText: "Approver is the PM and the owner.",
      finalize: true,
    });
    const f1 = await createProposedFinding({
      sourceId: source.id,
      companyId: a.company.id,
      title: "Two approvers",
      excerpt: "PM and the owner",
    });
    const f2 = await createProposedFinding({
      sourceId: source.id,
      companyId: a.company.id,
      title: "Dup candidate",
    });
    const f3 = await createProposedFinding({
      sourceId: source.id,
      companyId: a.company.id,
      title: "Unclear metric",
    });
    await reviewFinding(f1.id, a.company.id, {
      type: "correct_accept",
      title: "Two approvers (PM + owner)",
      body: "Confirmed in meeting",
    });
    await reviewFinding(f2.id, a.company.id, {
      type: "duplicate",
      duplicateOfId: f1.id,
    });
    await reviewFinding(f3.id, a.company.id, { type: "needs_clarification" });

    const updated = await prisma.evidenceFinding.findMany({
      where: { id: { in: [f1.id, f2.id, f3.id] } },
    });
    const byId = Object.fromEntries(updated.map((f) => [f.id, f]));
    expect(byId[f1.id].reviewStatus).toBe("CORRECTED_AND_ACCEPTED");
    expect(byId[f1.id].correctedTitle).toContain("PM");
    expect(byId[f1.id].sourceId).toBe(source.id);
    expect(byId[f2.id].reviewStatus).toBe("DUPLICATE");
    expect(byId[f3.id].reviewStatus).toBe("NEEDS_CLARIFICATION");
  });

  it("conflicts stay unresolved until owner action and retain both statements", async () => {
    const { a } = await setupPair();
    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Call",
    });
    const sA = await addEvidenceSource({
      companyId: a.company.id,
      meetingId: meeting.id,
      sourceType: EvidenceSourceType.QUESTIONNAIRE_RESPONSE,
      title: "Q",
      bodyText: "two hours",
      finalize: true,
    });
    const sB = await addEvidenceSource({
      companyId: a.company.id,
      meetingId: meeting.id,
      sourceType: EvidenceSourceType.BLUEPRINT_TRANSCRIPT,
      title: "T",
      bodyText: "six hours",
      finalize: true,
    });
    const conflict = await createEvidenceConflict({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      subject: "Photo reporting time",
      statementA: "Questionnaire: two hours",
      statementB: "Transcript: six hours",
      sourceAId: sA.id,
      sourceBId: sB.id,
      materiality: "HIGH",
    });
    expect(conflict.status).toBe(EvidenceConflictStatus.UNRESOLVED);
    await resolveEvidenceConflict(conflict.id, a.company.id, {
      status: EvidenceConflictStatus.RESOLVED_CORRECTED,
      rationale: "Use six hours pending client confirmation of peak weeks",
      correctedValue: "6 hours (peak); 2 hours typical",
    });
    const resolved = await prisma.evidenceConflict.findUniqueOrThrow({
      where: { id: conflict.id },
    });
    expect(resolved.statementA).toContain("two hours");
    expect(resolved.statementB).toContain("six hours");
    expect(resolved.status).toBe("RESOLVED_CORRECTED");
  });

  it("cross-company finding and conflict access fail", async () => {
    const { a, b } = await setupPair();
    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Call",
    });
    const source = await addEvidenceSource({
      companyId: a.company.id,
      meetingId: meeting.id,
      sourceType: EvidenceSourceType.CLIENT_NOTE,
      title: "N",
      bodyText: "note",
      finalize: true,
    });
    const finding = await createProposedFinding({
      sourceId: source.id,
      companyId: a.company.id,
      title: "F",
    });
    await expect(
      reviewFinding(finding.id, b.company.id, { type: "accept" }),
    ).rejects.toMatchObject({ code: "isolation" });
    const conflict = await createEvidenceConflict({
      companyId: a.company.id,
      subject: "X",
      statementA: "a",
      statementB: "b",
    });
    await expect(
      resolveEvidenceConflict(conflict.id, b.company.id, {
        status: EvidenceConflictStatus.NOT_MATERIAL,
        rationale: "no",
      }),
    ).rejects.toMatchObject({ code: "isolation" });
  });

  it("validates transcript uploads without faking storage", () => {
    expect(
      validateTranscriptUpload({ name: "notes.txt", size: 100 }).ok,
    ).toBe(true);
    expect(
      validateTranscriptUpload({ name: "malware.exe", size: 100 }).ok,
    ).toBe(false);
    expect(
      validateTranscriptUpload({ name: "huge.txt", size: 5_000_000 }).ok,
    ).toBe(false);
    expect(
      validateTranscriptUpload({ name: "x.bin", size: 10 }).ok,
    ).toBe(false);
    expect(() => assertSecureAttachmentStorageAvailable()).toThrow(EvidenceError);
  });

  it("readiness exposes checks; structural errors vs advisories", async () => {
    const { a } = await setupPair();
    const empty = await calculateBlueprintReadiness(a.opportunity.id);
    expect(empty.checks.length).toBeGreaterThan(0);
    expect(empty.classification).toBe("NOT_READY");
    expect(empty.structuralErrors.some((c) => !c.ok)).toBe(true);

    const created = await createProcess({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      name: "Field photo reporting",
      purpose: "Document field work",
    });
    await addStep(created.version.id, {
      shortName: "Capture",
      stepType: ProcessStepType.HUMAN_TASK,
    });
    await addStep(created.version.id, {
      shortName: "Upload",
      stepType: ProcessStepType.HUMAN_TASK,
    });
    try {
      await submitVersion(created.version.id);
    } catch {
      /* graph may need connections; readiness still runs */
    }

    await createSubmittedResponse({
      opportunityId: a.opportunity.id,
      contactId: a.contact.id,
      payload: {
        section1: { companyName: a.company.name },
        section2: { threeGoals: "Reduce admin time" },
        section3: { tools: [{ id: "1", name: "Jobber" }] },
      },
    });

    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Call",
    });
    await addEvidenceSource({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      sourceType: EvidenceSourceType.BLUEPRINT_TRANSCRIPT,
      title: "T",
      bodyText: "Discussed field photo reporting.",
      finalize: true,
    });

    const ready = await calculateBlueprintReadiness(a.opportunity.id);
    expect(ready.checks.some((c) => c.id === "questionnaire_submitted" && c.ok)).toBe(
      true,
    );
    expect(ready.checks.some((c) => c.id === "meeting_record" && c.ok)).toBe(
      true,
    );
    expect(ready.structuralErrors).not.toBe(ready.advisories);
  });

  it("client packet excludes internal notes and rejected findings; includes accepted", async () => {
    const { a } = await setupPair();
    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Call",
    });
    const source = await addEvidenceSource({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      sourceType: EvidenceSourceType.CONSULTANT_NOTE,
      title: "Internal note",
      bodyText: "Sensitive internal observation",
      isSensitive: true,
      finalize: true,
    });
    const accepted = await createProposedFinding({
      sourceId: source.id,
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      title: "Accepted pain: photo lag",
    });
    const rejected = await createProposedFinding({
      sourceId: source.id,
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      title: "Rejected speculation",
    });
    await reviewFinding(accepted.id, a.company.id, { type: "accept" });
    await reviewFinding(rejected.id, a.company.id, { type: "reject" });

    const client = await buildBlueprintReviewPacket({
      opportunityId: a.opportunity.id,
      mode: "client",
      preparedBy: "james@example.com",
    });
    const clientMeeting = client.sections.meeting_findings as {
      confirmed: { title: string }[];
      proposed?: unknown;
      rejectedOrDuplicate?: unknown;
    } | null;
    expect(clientMeeting?.confirmed.some((f) => f.title.includes("Accepted"))).toBe(
      true,
    );
    expect(clientMeeting?.proposed).toBeUndefined();
    expect(clientMeeting?.rejectedOrDuplicate).toBeUndefined();
    expect(JSON.stringify(client)).not.toMatch(/inviteToken|password/i);

    const internal = await buildBlueprintReviewPacket({
      opportunityId: a.opportunity.id,
      mode: "internal",
      preparedBy: "james@example.com",
    });
    const internalMeeting = internal.sections.meeting_findings as {
      proposed: { title: string }[];
      rejectedOrDuplicate: { title: string }[];
      internalLabel: string;
    };
    expect(internalMeeting.internalLabel).toMatch(/INTERNAL/i);
    expect(
      internalMeeting.rejectedOrDuplicate.some((f) =>
        f.title.includes("Rejected"),
      ),
    ).toBe(true);
  });

  it("packet does not mutate sources and omits empty optional sections", async () => {
    const { a } = await setupPair();
    const before = await prisma.evidenceSource.count({
      where: { companyId: a.company.id },
    });
    const packet = await buildBlueprintReviewPacket({
      opportunityId: a.opportunity.id,
      mode: "client",
      preparedBy: "owner",
    });
    const after = await prisma.evidenceSource.count({
      where: { companyId: a.company.id },
    });
    expect(after).toBe(before);
    expect(packet.sections.cover).toBeTruthy();
    expect(packet.omittedEmptySections).toContain("meeting_findings");
  });

  it("finalize is idempotent; forged company on finalize fails", async () => {
    const { a, b } = await setupPair();
    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Call",
    });
    const source = await addEvidenceSource({
      companyId: a.company.id,
      meetingId: meeting.id,
      sourceType: EvidenceSourceType.CLIENT_NOTE,
      title: "N",
      bodyText: "hello",
    });
    await finalizeEvidenceSource(source.id, a.company.id);
    await finalizeEvidenceSource(source.id, a.company.id);
    await expect(
      finalizeEvidenceSource(source.id, b.company.id),
    ).rejects.toMatchObject({ code: "isolation" });
  });

  it("A4-1: create returns meeting id once; cross-company process fails with no partial row", async () => {
    const { a, b } = await setupPair();
    const before = await prisma.blueprintMeeting.count({
      where: { companyId: a.company.id },
    });
    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Optimum Blueprint Discovery — Unit Correction",
      facilitatorLabel: "James Fullen",
    });
    expect(meeting.id).toBeTruthy();
    expect(meeting.title).toContain("Unit Correction");
    const afterOk = await prisma.blueprintMeeting.count({
      where: { companyId: a.company.id },
    });
    expect(afterOk).toBe(before + 1);

    const foreignProcess = await prisma.process.create({
      data: {
        companyId: b.company.id,
        opportunityId: b.opportunity.id,
        name: "Foreign process",
      },
    });
    await expect(
      createBlueprintMeeting({
        companyId: a.company.id,
        opportunityId: a.opportunity.id,
        title: "Should not persist",
        processIds: [foreignProcess.id],
      }),
    ).rejects.toMatchObject({ code: "isolation" });
    const afterFail = await prisma.blueprintMeeting.count({
      where: { companyId: a.company.id },
    });
    expect(afterFail).toBe(afterOk);
    await expect(
      createBlueprintMeeting({
        companyId: a.company.id,
        opportunityId: b.opportunity.id,
        title: "Forged opportunity",
      }),
    ).rejects.toBeTruthy();
  });

  it("A4-3: Client Review packet omits rejected findings (print-safe content)", async () => {
    const { a } = await setupPair();
    const meeting = await createBlueprintMeeting({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      title: "Packet check",
    });
    const source = await addEvidenceSource({
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      sourceType: EvidenceSourceType.CONSULTANT_NOTE,
      title: "Notes",
      bodyText: "Rejected claim about ROI.",
      finalize: true,
    });
    const finding = await createProposedFinding({
      sourceId: source.id,
      companyId: a.company.id,
      opportunityId: a.opportunity.id,
      meetingId: meeting.id,
      title: "Should not appear in client packet",
      excerpt: "ROI",
      sourceLocation: "notes:1",
      confidence: "LOW",
    });
    await reviewFinding(finding.id, a.company.id, { type: "reject" });
    const client = await buildBlueprintReviewPacket({
      opportunityId: a.opportunity.id,
      mode: "client",
      preparedBy: "owner",
    });
    const serialized = JSON.stringify(client);
    expect(serialized).not.toContain("Should not appear in client packet");
    expect(serialized).not.toMatch(/sk_live|Bearer |password/i);
    const findings = client.sections.meeting_findings as
      | {
          rejectedOrDuplicate?: { title: string }[];
          proposed?: { title: string }[];
        }
      | null;
    if (findings) {
      expect(findings.rejectedOrDuplicate).toBeUndefined();
      expect(findings.proposed).toBeUndefined();
    }
  });
});

describe("future recommendation policy boundary", () => {
  it("documents preference order and forbids Phase 1.1 recommendation outputs", async () => {
    const fs = await import("fs");
    const pathMod = await import("path");
    const doc = fs.readFileSync(
      pathMod.resolve(
        __dirname,
        "../../docs/future-recommendation-philosophy.md",
      ),
      "utf8",
    );
    expect(doc).toMatch(/Eliminate unnecessary work/);
    expect(doc).toMatch(/Require James/);
    expect(doc).toMatch(/proposed/);
    expect(doc).not.toMatch(/generate ROI in Increment 4/i);
  });
});
