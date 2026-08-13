import { prisma } from "./db";
import { DEFAULT_PIPELINE_SLUG } from "./pipeline-seed-data";
import { recordAudit } from "./audit";

export type CreateLeadInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  companyName: string;
  companyWebsite?: string;
  industry?: string;
  source?: string;
  ownerUserId?: string;
  stageSlug?: string;
  title?: string;
};

export async function createContactCompanyOpportunity(input: CreateLeadInput) {
  const email = input.email.trim().toLowerCase();
  const pipeline = await prisma.pipeline.findUnique({
    where: { slug: DEFAULT_PIPELINE_SLUG },
    include: { stages: true },
  });
  if (!pipeline) throw new Error("Default pipeline not seeded");

  const stageSlug = input.stageSlug ?? "qualified";
  const stage = pipeline.stages.find((s) => s.slug === stageSlug);
  if (!stage) throw new Error(`Stage not found: ${stageSlug}`);

  const result = await prisma.$transaction(async (tx) => {
    let contact = await tx.contact.findFirst({ where: { email } });
    if (!contact) {
      contact = await tx.contact.create({
        data: {
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email,
          phone: input.phone?.trim() || null,
          jobTitle: input.jobTitle?.trim() || null,
        },
      });
    } else {
      contact = await tx.contact.update({
        where: { id: contact.id },
        data: {
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          phone: input.phone?.trim() || contact.phone,
          jobTitle: input.jobTitle?.trim() || contact.jobTitle,
        },
      });
    }

    let company = await tx.company.findFirst({
      where: { name: input.companyName.trim() },
    });
    if (!company) {
      company = await tx.company.create({
        data: {
          name: input.companyName.trim(),
          website: input.companyWebsite?.trim() || null,
          industry: input.industry?.trim() || null,
        },
      });
    }

    const link = await tx.companyContact.findUnique({
      where: {
        companyId_contactId: { companyId: company.id, contactId: contact.id },
      },
    });
    if (!link) {
      await tx.companyContact.create({
        data: {
          companyId: company.id,
          contactId: contact.id,
          isPrimary: true,
          role: input.jobTitle?.trim() || null,
        },
      });
    }

    const opportunity = await tx.opportunity.create({
      data: {
        pipelineId: pipeline.id,
        stageId: stage.id,
        contactId: contact.id,
        companyId: company.id,
        ownerUserId: input.ownerUserId ?? null,
        title:
          input.title?.trim() ||
          `${input.companyName.trim()} — Business Blueprint`,
        source: input.source ?? "owner-ops",
        formStatus: "PENDING",
        lastActivityAt: new Date(),
      },
    });

    await tx.activity.create({
      data: {
        type: "opportunity.created",
        summary: `Opportunity created for ${contact.firstName} ${contact.lastName}`,
        actorType: "owner",
        opportunityId: opportunity.id,
        contactId: contact.id,
        companyId: company.id,
      },
    });

    return { contact, company, opportunity, stage };
  });

  await recordAudit({
    action: "opportunity.created",
    actorUserId: input.ownerUserId,
    entityType: "Opportunity",
    entityId: result.opportunity.id,
    details: {
      contactId: result.contact.id,
      companyId: result.company.id,
      stageSlug,
    },
  });

  return result;
}
