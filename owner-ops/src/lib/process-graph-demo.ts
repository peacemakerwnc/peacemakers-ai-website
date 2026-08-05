/**
 * Fictional Optimum Demo Contractors — Field photo-reporting process graph.
 * Used by automated tests and owner diagnostic acceptance. Not production data.
 */
import {
  ProcessConnectionType,
  ProcessExecutionType,
  ProcessParticipantType,
  ProcessResponsibilityType,
  ProcessStepType,
  ProcessVersionStatus,
} from "@prisma/client";
import { prisma } from "./db";
import {
  addConnection,
  addParticipant,
  addStep,
  approveAsIsBaseline,
  createProcess,
  submitVersion,
} from "./process-graph";

export const DEMO_FIELD_PHOTO_PROCESS_NAME =
  "Field photo reporting and documentation";

export async function ensureOptimumFieldPhotoGraph(input: {
  companyId: string;
  opportunityId?: string | null;
  contactId?: string | null;
  actorUserId?: string;
  actorLabel?: string;
  submitAndApprove?: boolean;
}) {
  const existing = await prisma.process.findFirst({
    where: {
      companyId: input.companyId,
      name: DEMO_FIELD_PHOTO_PROCESS_NAME,
    },
    include: { versions: { orderBy: { versionNumber: "asc" } } },
  });
  if (existing) {
    return existing;
  }

  const { process, version } = await createProcess({
    companyId: input.companyId,
    opportunityId: input.opportunityId ?? null,
    name: DEMO_FIELD_PHOTO_PROCESS_NAME,
    purpose:
      "Capture, review, and deliver job-site photo documentation for customers and insurers",
    customerOutcome: "Complete photo report delivered within SLA",
    processOwner: "Operations Manager",
    actorUserId: input.actorUserId,
    actorLabel: input.actorLabel ?? "owner",
  });

  const vId = version.id;

  const s1 = await addStep(vId, {
    shortName: "Job complete trigger",
    stepType: ProcessStepType.TRIGGER,
    displayOrder: 0,
    department: "Field",
    responsibleRole: "Field Technician",
    toolOrSystem: "SMS / Jobber",
    detailedDescription: "Technician marks job complete in scheduling system",
  });
  const s2 = await addStep(vId, {
    shortName: "Capture site photos",
    stepType: ProcessStepType.HUMAN_TASK,
    displayOrder: 1,
    department: "Field",
    responsibleRole: "Field Technician",
    toolOrSystem: "Smartphone camera",
    expectedWorkTime: "15 min",
  });
  const s3 = await addStep(vId, {
    shortName: "Upload to shared drive",
    stepType: ProcessStepType.DATA_ENTRY,
    displayOrder: 2,
    department: "Field",
    responsibleRole: "Field Technician",
    toolOrSystem: "Google Drive",
    executionType: ProcessExecutionType.HYBRID,
  });
  const s4 = await addStep(vId, {
    shortName: "Auto-notify office",
    stepType: ProcessStepType.AUTOMATED_TASK,
    displayOrder: 3,
    department: "Office",
    responsibleRole: "System",
    toolOrSystem: "Zapier",
    executionType: ProcessExecutionType.SYSTEM,
  });
  const s5 = await addStep(vId, {
    shortName: "Completeness decision",
    stepType: ProcessStepType.DECISION,
    displayOrder: 4,
    department: "Office",
    responsibleRole: "Admin Coordinator",
    toolOrSystem: "Google Drive checklist",
  });
  const s6 = await addStep(vId, {
    shortName: "Manager approval",
    stepType: ProcessStepType.APPROVAL,
    displayOrder: 5,
    department: "Operations",
    responsibleRole: "Operations Manager",
  });
  const s7 = await addStep(vId, {
    shortName: "Waiting on customer confirm",
    stepType: ProcessStepType.WAITING_PERIOD,
    displayOrder: 6,
    department: "Office",
    typicalWaitingTime: "1–2 business days",
  });
  const s8 = await addStep(vId, {
    shortName: "Build final PDF report",
    stepType: ProcessStepType.DOCUMENT_CREATION,
    displayOrder: 7,
    department: "Office",
    responsibleRole: "Admin Coordinator",
    toolOrSystem: "Google Docs / PDF",
  });
  const s9 = await addStep(vId, {
    shortName: "Email report to customer",
    stepType: ProcessStepType.COMMUNICATION,
    displayOrder: 8,
    department: "Office",
    responsibleRole: "Admin Coordinator",
    toolOrSystem: "Gmail",
  });
  const s10 = await addStep(vId, {
    shortName: "Escalate to owner",
    stepType: ProcessStepType.EXCEPTION,
    displayOrder: 9,
    department: "Leadership",
    responsibleRole: "Owner",
  });
  const s11 = await addStep(vId, {
    shortName: "Handoff to billing",
    stepType: ProcessStepType.HANDOFF,
    displayOrder: 10,
    department: "Billing",
    responsibleRole: "Bookkeeper",
  });
  const s12 = await addStep(vId, {
    shortName: "Process end",
    stepType: ProcessStepType.PROCESS_END,
    displayOrder: 11,
    department: "Office",
  });

  // Happy path + parallel notify
  await addConnection(vId, {
    sourceStepId: s1.id,
    targetStepId: s2.id,
    connectionType: ProcessConnectionType.NORMAL,
    isDefaultPath: true,
    displayLabel: "Start capture",
  });
  await addConnection(vId, {
    sourceStepId: s2.id,
    targetStepId: s3.id,
    connectionType: ProcessConnectionType.NORMAL,
    isDefaultPath: true,
  });
  // Parallel split: upload also triggers auto-notify, then both rejoin at decision
  await addConnection(vId, {
    sourceStepId: s3.id,
    targetStepId: s4.id,
    connectionType: ProcessConnectionType.PARALLEL,
    displayLabel: "Notify office (parallel)",
  });
  await addConnection(vId, {
    sourceStepId: s3.id,
    targetStepId: s5.id,
    connectionType: ProcessConnectionType.PARALLEL,
    displayLabel: "Queue for review (parallel)",
  });
  await addConnection(vId, {
    sourceStepId: s4.id,
    targetStepId: s5.id,
    connectionType: ProcessConnectionType.PARALLEL,
    displayLabel: "Rejoin review",
  });

  // Conditional branch from decision
  await addConnection(vId, {
    sourceStepId: s5.id,
    targetStepId: s6.id,
    connectionType: ProcessConnectionType.CONDITIONAL,
    condition: "Photos complete and labeled",
    isDefaultPath: true,
    displayLabel: "Complete → approval",
  });
  await addConnection(vId, {
    sourceStepId: s5.id,
    targetStepId: s2.id,
    connectionType: ProcessConnectionType.REWORK,
    condition: "Missing angles or poor quality",
    displayLabel: "Rework → recapture",
  });

  // Approval / rejection
  await addConnection(vId, {
    sourceStepId: s6.id,
    targetStepId: s7.id,
    connectionType: ProcessConnectionType.APPROVED,
    displayLabel: "Approved",
  });
  await addConnection(vId, {
    sourceStepId: s6.id,
    targetStepId: s2.id,
    connectionType: ProcessConnectionType.REJECTED,
    displayLabel: "Rejected → field rework",
  });
  await addConnection(vId, {
    sourceStepId: s6.id,
    targetStepId: s10.id,
    connectionType: ProcessConnectionType.ESCALATION,
    escalationMetadata: "Customer complaint or insurance deadline risk",
    displayLabel: "Escalate",
  });

  await addConnection(vId, {
    sourceStepId: s7.id,
    targetStepId: s8.id,
    connectionType: ProcessConnectionType.NORMAL,
    isDefaultPath: true,
  });
  await addConnection(vId, {
    sourceStepId: s7.id,
    targetStepId: s10.id,
    connectionType: ProcessConnectionType.TIMEOUT,
    condition: "No customer response in 3 business days",
    displayLabel: "Timeout escalate",
  });

  await addConnection(vId, {
    sourceStepId: s8.id,
    targetStepId: s9.id,
    connectionType: ProcessConnectionType.NORMAL,
    isDefaultPath: true,
  });
  await addConnection(vId, {
    sourceStepId: s9.id,
    targetStepId: s11.id,
    connectionType: ProcessConnectionType.NORMAL,
    isDefaultPath: true,
  });
  await addConnection(vId, {
    sourceStepId: s11.id,
    targetStepId: s12.id,
    connectionType: ProcessConnectionType.NORMAL,
    isDefaultPath: true,
  });
  await addConnection(vId, {
    sourceStepId: s10.id,
    targetStepId: s12.id,
    connectionType: ProcessConnectionType.FAILURE,
    displayLabel: "Close after escalation handling",
  });
  await addConnection(vId, {
    sourceStepId: s12.id,
    targetStepId: s12.id,
    connectionType: ProcessConnectionType.TERMINATION,
    displayLabel: "Terminate",
  });
  // Explicit loop label (in addition to rework)
  await addConnection(vId, {
    sourceStepId: s5.id,
    targetStepId: s3.id,
    connectionType: ProcessConnectionType.LOOP,
    condition: "Folder naming wrong — re-upload only",
    displayLabel: "Loop to upload",
  });

  await addParticipant({
    processVersionId: vId,
    processStepId: s2.id,
    participantType: ProcessParticipantType.ROLE,
    role: "Field Technician",
    department: "Field",
    responsibilityType: ProcessResponsibilityType.EXECUTOR,
  });
  await addParticipant({
    processVersionId: vId,
    processStepId: s6.id,
    participantType: ProcessParticipantType.PERSON,
    role: "Operations Manager",
    personLabel: "Alex Demo",
    contactId: input.contactId ?? null,
    department: "Operations",
    responsibilityType: ProcessResponsibilityType.APPROVER,
  });
  await addParticipant({
    processVersionId: vId,
    participantType: ProcessParticipantType.SYSTEM,
    role: "Zapier automation",
    externalDesignation: "system",
    responsibilityType: ProcessResponsibilityType.EXECUTOR,
  });

  if (input.submitAndApprove) {
    await submitVersion(vId, {
      actorUserId: input.actorUserId,
      actorLabel: input.actorLabel,
    });
    await approveAsIsBaseline(vId, {
      approverUserId: input.actorUserId,
      approverRole: "owner",
      criteriaOrNotes: "UAT As-Is baseline for field photo reporting",
      actorLabel: input.actorLabel,
    });
  }

  return prisma.process.findUniqueOrThrow({
    where: { id: process.id },
    include: {
      versions: {
        include: {
          steps: true,
          connections: true,
          participants: true,
          approvals: true,
        },
      },
    },
  });
}

export async function countDemoGraphShapes(versionId: string) {
  const connections = await prisma.processConnection.findMany({
    where: { processVersionId: versionId },
  });
  const steps = await prisma.processStep.count({
    where: { processVersionId: versionId },
  });
  const types = new Set(connections.map((c) => c.connectionType));
  return {
    steps,
    connections: connections.length,
    hasDecisionBranch: types.has(ProcessConnectionType.CONDITIONAL),
    hasApproval: types.has(ProcessConnectionType.APPROVED),
    hasRejection: types.has(ProcessConnectionType.REJECTED),
    hasParallel: types.has(ProcessConnectionType.PARALLEL),
    hasLoop: types.has(ProcessConnectionType.LOOP),
    hasRework: types.has(ProcessConnectionType.REWORK),
    hasEscalation: types.has(ProcessConnectionType.ESCALATION),
    hasTimeout: types.has(ProcessConnectionType.TIMEOUT),
    hasFailure: types.has(ProcessConnectionType.FAILURE),
    status: (
      await prisma.processVersion.findUniqueOrThrow({ where: { id: versionId } })
    ).status as ProcessVersionStatus,
  };
}
