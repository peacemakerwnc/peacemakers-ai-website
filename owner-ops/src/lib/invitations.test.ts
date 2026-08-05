import { beforeAll, afterAll, beforeEach, describe, expect, it } from "vitest";
import {
  FormInvitationStatus,
  FormResponseStatus,
} from "@prisma/client";
import { execSync } from "child_process";
import path from "path";
import { prisma } from "./db";
import { hashPassword } from "./crypto";
import { createContactCompanyOpportunity } from "./crm";
import {
  createInvitation,
  revokeInvitation,
  regenerateInvitation,
  resolveInvitationByRawToken,
  InvitationError,
  markInvitationSent,
} from "./invitations";
import {
  saveDraftByToken,
  submitByToken,
  reopenSubmittedResponse,
  ResponseLockedError,
} from "./responses";
import { emptyBlueprintPayload, type BlueprintPayload } from "./form-schema";
import { resetEnvCache } from "./env";
import { LogEmailAdapter, setEmailAdapter } from "./mail";
import {
  DEFAULT_STAGES,
  DEFAULT_PIPELINE_SLUG,
  BLUEPRINT_FORM_TEMPLATE_SLUG,
} from "./pipeline-seed-data";
import { resetRateLimits } from "./rate-limit";

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
      where: {
        pipelineId_slug: { pipelineId: pipeline.id, slug: s.slug },
      },
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

function validSubmitPayload(): BlueprintPayload {
  const base = emptyBlueprintPayload();
  return {
    ...base,
    section1: {
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      companyName: "Analytical Engines",
      jobTitle: "Owner",
    },
    section5: {
      detailedProcesses: [
        {
          id: "proc-1",
          name: "Lead response",
          businessObjective: "Respond quickly",
          processOwner: "Ada",
          peopleInvolved: "Ada, assistant",
          frequency: "Daily",
          averageVolume: "10",
          averageCompletionTime: "30m",
          trigger: "Inbound email",
          whoFirstAware: "Ada",
          initialInfoSource: "Inbox",
          firstAction: "Open email",
          requiredBeforeStart: "Email address",
          steps: [
            {
              id: "step-1",
              stepNumber: 1,
              responsibleRole: "Owner",
              exactAction: "Read inquiry",
              toolUsed: "Email",
              informationReceived: "Customer need",
              informationChanged: "None",
              outputRecipient: "Self",
              decisionInvolved: "Qualify?",
              expectedTime: "5m",
              waitingTime: "0",
              notificationSent: "None",
              completionEvidence: "Reply sent",
              problems: "Missed emails",
              exceptions: "Spam",
              workaround: "Manual search",
            },
          ],
          decisions: "Qualify lead",
          decisionAuthority: "Owner",
          decisionRules: "Budget fit",
          exceptionsChangeProcess: "VIP",
          whenInfoMissing: "Ask",
          whenNoResponse: "Follow up",
          whenProcessFails: "Call",
          repeatedProblems: "Delay",
          singlePersonKnowledge: "Pricing",
          finalStep: "Log CRM",
          successEvidence: "CRM row",
          whoInformed: "Team",
          finalInfoStored: "CRM",
          followUpRequired: "Yes",
          reportsUpdated: "None",
          commonlyUnfinished: "Notes",
          unnecessarilyManual: "Copy/paste",
          doubleEntry: "CRM and sheet",
          copyBetweenSystems: "Yes",
          waitingOnPeople: "Estimator",
          mistakeProne: "Pricing",
          wouldEliminate: "Double entry",
          shouldAutomate: "Logging",
          shouldRemainHuman: "Discovery",
          ifPerfect: "Same-day reply",
        },
      ],
    },
    section8: {
      answersAreHonest: true,
      noSensitiveCredentials: true,
      mayUseForBlueprint: true,
      authorizedToProvide: true,
    },
  };
}

describe("invitation + response lifecycle", () => {
  const mail = new LogEmailAdapter();

  beforeAll(() => {
    resetEnvCache();
    const dbFile = path.join(__dirname, "../../prisma/vitest.db");
    try {
      // Local disposable SQLite test DB only — never production.
      execSync(`rm -f "${dbFile}" "${dbFile}-journal"`, { stdio: "pipe" });
    } catch {
      /* ignore */
    }
    execSync("npx prisma db push --skip-generate", {
      cwd: path.join(__dirname, "../.."),
      env: { ...process.env, DATABASE_URL: "file:./prisma/vitest.db" },
      stdio: "pipe",
    });
  });

  beforeEach(async () => {
    resetEnvCache();
    setEmailAdapter(mail);
    mail.sent.length = 0;
    resetRateLimits();
    // Clean transactional tables between tests while keeping seed reference data
    await prisma.nextAction.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.auditEvent.deleteMany();
    await prisma.processStep.deleteMany();
    await prisma.process.deleteMany();
    await prisma.companyTool.deleteMany();
    await prisma.formResponse.deleteMany();
    await prisma.formInvitation.deleteMany();
    await prisma.proposedService.deleteMany();
    await prisma.meeting.deleteMany();
    await prisma.opportunity.deleteMany();
    await prisma.companyContact.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.company.deleteMany();
    await seedMinimal();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates invitation with hashed token only and draft response", async () => {
    const lead = await createContactCompanyOpportunity({
      firstName: "Ada",
      lastName: "Lovelace",
      email: `ada-${Date.now()}@example.com`,
      companyName: `Engines ${Date.now()}`,
    });

    const created = await createInvitation({
      contactId: lead.contact.id,
      opportunityId: lead.opportunity.id,
      actorUserId: (await prisma.user.findFirst())!.id,
    });

    expect(created.rawToken.length).toBeGreaterThan(20);
    expect(created.formUrl).toContain("/f/");
    expect(created.invitation.tokenHash).not.toEqual(created.rawToken);
    expect(created.invitation.tokenPrefix).toEqual(created.rawToken.slice(0, 8));

    const stored = await prisma.formInvitation.findUnique({
      where: { id: created.invitation.id },
      include: { responses: true },
    });
    expect(stored?.tokenHash).toEqual(created.invitation.tokenHash);
    expect(JSON.stringify(stored)).not.toContain(created.rawToken);
    expect(stored?.responses[0]?.status).toBe(FormResponseStatus.DRAFT);

    const action = await prisma.nextAction.findFirst({
      where: {
        opportunityId: lead.opportunity.id,
        source: "form.invitation_created",
      },
    });
    expect(action).not.toBeNull();
  });

  it("rejects unauthorized/invalid tokens and revoked/expired links", async () => {
    await expect(resolveInvitationByRawToken("too-short")).rejects.toBeInstanceOf(
      InvitationError,
    );
    await expect(
      resolveInvitationByRawToken("a".repeat(40)),
    ).rejects.toMatchObject({ code: "not_found" });

    const lead = await createContactCompanyOpportunity({
      firstName: "Grace",
      lastName: "Hopper",
      email: `grace-${Date.now()}@example.com`,
      companyName: `Navy ${Date.now()}`,
    });
    const created = await createInvitation({
      contactId: lead.contact.id,
      opportunityId: lead.opportunity.id,
    });

    await revokeInvitation(created.invitation.id);
    await expect(
      resolveInvitationByRawToken(created.rawToken),
    ).rejects.toMatchObject({ code: "revoked" });

    const lead2 = await createContactCompanyOpportunity({
      firstName: "Alan",
      lastName: "Turing",
      email: `alan-${Date.now()}@example.com`,
      companyName: `Bletchley ${Date.now()}`,
    });
    const expired = await createInvitation({
      contactId: lead2.contact.id,
      opportunityId: lead2.opportunity.id,
      expiresInDays: 30,
    });
    await prisma.formInvitation.update({
      where: { id: expired.invitation.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    await expect(
      resolveInvitationByRawToken(expired.rawToken),
    ).rejects.toMatchObject({ code: "expired" });
  });

  it("saves drafts, updates completion, and isolates by token", async () => {
    const a = await createContactCompanyOpportunity({
      firstName: "A",
      lastName: "One",
      email: `a-${Date.now()}@example.com`,
      companyName: `CoA ${Date.now()}`,
    });
    const b = await createContactCompanyOpportunity({
      firstName: "B",
      lastName: "Two",
      email: `b-${Date.now()}@example.com`,
      companyName: `CoB ${Date.now()}`,
    });
    const invA = await createInvitation({
      contactId: a.contact.id,
      opportunityId: a.opportunity.id,
    });
    const invB = await createInvitation({
      contactId: b.contact.id,
      opportunityId: b.opportunity.id,
    });

    const payload = emptyBlueprintPayload();
    payload.section1 = {
      firstName: "A",
      lastName: "One",
      email: a.contact.email,
      companyName: a.company.name,
    };
    await saveDraftByToken(invA.rawToken, payload);

    const resolvedB = await resolveInvitationByRawToken(invB.rawToken);
    const draftB = resolvedB.responses.find(
      (r) => r.status === FormResponseStatus.DRAFT,
    );
    const parsedB = JSON.parse(draftB!.payloadJson) as BlueprintPayload;
    expect(parsedB.section1.firstName).toBeUndefined();

    const resolvedA = await resolveInvitationByRawToken(invA.rawToken);
    expect(resolvedA.completionPct).toBeGreaterThan(0);
    expect(resolvedA.status).toBe(FormInvitationStatus.IN_PROGRESS);
  });

  it("submits immutably, creates review action, and blocks duplicate edits", async () => {
    const lead = await createContactCompanyOpportunity({
      firstName: "Ada",
      lastName: "Lovelace",
      email: `submit-${Date.now()}@example.com`,
      companyName: `Submit Co ${Date.now()}`,
    });
    const created = await createInvitation({
      contactId: lead.contact.id,
      opportunityId: lead.opportunity.id,
    });
    await markInvitationSent(created.invitation.id);

    const payload = validSubmitPayload();
    payload.section1.email = lead.contact.email;
    payload.section1.companyName = lead.company.name;

    await submitByToken(created.rawToken, payload);

    const invitation = await prisma.formInvitation.findUnique({
      where: { id: created.invitation.id },
      include: {
        responses: true,
        opportunity: { include: { stage: true, nextActions: true } },
      },
    });
    expect(invitation?.status).toBe(FormInvitationStatus.SUBMITTED);
    expect(invitation?.responses[0]?.status).toBe(FormResponseStatus.SUBMITTED);
    expect(invitation?.opportunity.stage.slug).toBe("blueprint-review-required");
    expect(
      invitation?.opportunity.nextActions.some(
        (a) => a.source === "form.submitted",
      ),
    ).toBe(true);
    expect(mail.sent.length).toBe(2);

    await expect(
      saveDraftByToken(created.rawToken, payload),
    ).rejects.toBeInstanceOf(ResponseLockedError);
    await expect(submitByToken(created.rawToken, payload)).rejects.toBeInstanceOf(
      ResponseLockedError,
    );

    const processes = await prisma.process.findMany({
      where: { formResponseId: invitation!.responses[0].id },
      include: { steps: true },
    });
    expect(processes.some((p) => p.isDetailedMap && p.steps.length === 1)).toBe(
      true,
    );
  });

  it("reopens with the same token and accepts a corrected resubmission", async () => {
    const lead = await createContactCompanyOpportunity({
      firstName: "Corr",
      lastName: "Ected",
      email: `correct-${Date.now()}@example.test`,
      companyName: `Correct Co ${Date.now()}`,
    });
    const created = await createInvitation({
      contactId: lead.contact.id,
      opportunityId: lead.opportunity.id,
    });
    const payload = validSubmitPayload();
    payload.section1.email = lead.contact.email;
    payload.section1.companyName = lead.company.name;
    payload.section1.industry = "Original industry";
    await submitByToken(created.rawToken, payload);

    const owner = (await prisma.user.findFirst())!;
    await reopenSubmittedResponse(created.invitation.id, owner.id);

    const corrected = validSubmitPayload();
    corrected.section1.email = lead.contact.email;
    corrected.section1.companyName = lead.company.name;
    corrected.section1.industry = "Corrected industry";
    await saveDraftByToken(created.rawToken, corrected);
    await submitByToken(created.rawToken, corrected);

    const responses = await prisma.formResponse.findMany({
      where: { invitationId: created.invitation.id },
      orderBy: { version: "asc" },
    });
    expect(responses).toHaveLength(2);
    expect(responses[0].status).toBe(FormResponseStatus.SUPERSEDED);
    expect(responses[1].status).toBe(FormResponseStatus.SUBMITTED);
    expect(JSON.parse(responses[0].payloadJson).section1.industry).toBe(
      "Original industry",
    );
    expect(JSON.parse(responses[1].payloadJson).section1.industry).toBe(
      "Corrected industry",
    );
  });

  it("regenerates a new token after revoke and supports explicit reopen versioning", async () => {
    const lead = await createContactCompanyOpportunity({
      firstName: "Kate",
      lastName: "Greg",
      email: `reopen-${Date.now()}@example.com`,
      companyName: `Reopen Co ${Date.now()}`,
    });
    const first = await createInvitation({
      contactId: lead.contact.id,
      opportunityId: lead.opportunity.id,
    });
    const payload = validSubmitPayload();
    payload.section1.email = lead.contact.email;
    payload.section1.companyName = lead.company.name;
    await submitByToken(first.rawToken, payload);

    const owner = (await prisma.user.findFirst())!;
    await reopenSubmittedResponse(first.invitation.id, owner.id);

    const responses = await prisma.formResponse.findMany({
      where: { invitationId: first.invitation.id },
      orderBy: { version: "asc" },
    });
    expect(responses).toHaveLength(2);
    expect(responses[0].status).toBe(FormResponseStatus.SUPERSEDED);
    expect(responses[1].status).toBe(FormResponseStatus.DRAFT);
    expect(responses[1].version).toBe(2);

    const regenerated = await regenerateInvitation(
      first.invitation.id,
      owner.id,
    );
    expect(regenerated.rawToken).not.toEqual(first.rawToken);
    await expect(
      resolveInvitationByRawToken(first.rawToken),
    ).rejects.toMatchObject({ code: "revoked" });
    await expect(
      resolveInvitationByRawToken(regenerated.rawToken),
    ).resolves.toBeTruthy();
  });
});
