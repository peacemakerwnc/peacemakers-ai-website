/**
 * Create a fictional Optimum Demo invitation for correction browser acceptance.
 * Prints JSON: { rawToken, invitationId, formUrl }
 */
import { createInvitation } from "../../../src/lib/invitations";
import { prisma } from "../../../src/lib/db";

const OPP = "cmsgg70vx0004itn1ybw2bg0s";

const opportunity = await prisma.opportunity.findUniqueOrThrow({
  where: { id: OPP },
  include: { company: true, contact: true },
});

if (!opportunity.company.name.includes("Optimum Demo")) {
  throw new Error(`Expected Optimum Demo Contractors, got ${opportunity.company.name}`);
}

const created = await createInvitation({
  contactId: opportunity.contactId,
  opportunityId: opportunity.id,
});

const base = process.env.ACCEPT_BASE_URL || "http://127.0.0.1:3001";
console.log(
  JSON.stringify({
    rawToken: created.rawToken,
    invitationId: created.invitation.id,
    formUrl: `${base}/f/${created.rawToken}`,
    company: opportunity.company.name,
  }),
);
