/**
 * Ensure two additional fictional Optimum processes share the Field photo
 * opportunity/company context for visual-acceptance landscape testing.
 */
import { ProcessStepType, ProcessConnectionType } from "@prisma/client";
import { prisma } from "../src/lib/db";
import { addConnection, addStep, createProcess } from "../src/lib/process-graph";

async function main() {
  const field = await prisma.process.findFirst({
    where: {
      name: "Field photo reporting and documentation",
      company: { name: "Optimum Demo Contractors" },
      versions: { some: { status: "SUBMITTED" } },
    },
    include: { company: true },
    orderBy: { updatedAt: "desc" },
  });
  if (!field) throw new Error("Submitted field photo process not found");

  const siblings = [
    {
      name: "Estimating site visit and quote",
      purpose: "Capture site measurements and produce a customer quote",
      trigger: "Customer requests estimate",
      end: "Quote sent to customer",
    },
    {
      name: "Invoicing and payment collection",
      purpose: "Invoice completed work and record payment",
      trigger: "Job marked complete",
      end: "Payment recorded",
    },
  ];

  for (const s of siblings) {
    const existing = await prisma.process.findFirst({
      where: {
        companyId: field.companyId,
        opportunityId: field.opportunityId,
        name: s.name,
      },
    });
    if (existing) {
      console.log("exists", existing.id, s.name);
      continue;
    }
    const { process, version } = await createProcess({
      companyId: field.companyId,
      opportunityId: field.opportunityId ?? undefined,
      name: s.name,
      purpose: s.purpose,
      processOwner: "Office manager",
    });
    await prisma.processVersion.update({
      where: { id: version.id },
      data: {
        startTrigger: s.trigger,
        endEvent: s.end,
        purpose: s.purpose,
        outcome: s.end,
      },
    });
    const a = await addStep(version.id, {
      shortName: "Start",
      stepType: ProcessStepType.TRIGGER,
      canvasX: 40,
      canvasY: 80,
    });
    const b = await addStep(version.id, {
      shortName: "Do the work",
      stepType: ProcessStepType.HUMAN_TASK,
      responsibleRole: "Coordinator",
      canvasX: 280,
      canvasY: 80,
    });
    const c = await addStep(version.id, {
      shortName: "End",
      stepType: ProcessStepType.PROCESS_END,
      canvasX: 520,
      canvasY: 80,
    });
    await addConnection(version.id, {
      sourceStepId: a.id,
      targetStepId: b.id,
      connectionType: ProcessConnectionType.NORMAL,
      isDefaultPath: true,
    });
    await addConnection(version.id, {
      sourceStepId: b.id,
      targetStepId: c.id,
      connectionType: ProcessConnectionType.NORMAL,
      isDefaultPath: true,
    });
    console.log("created", process.id, s.name);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
