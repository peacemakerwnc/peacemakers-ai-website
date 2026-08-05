import Link from "next/link";
import { requireOwnerSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { CreateInvitationForm } from "./create-form";

export const dynamic = "force-dynamic";

export default async function FormsPage() {
  await requireOwnerSession({ returnTo: "/ops/forms" });
  const invitations = await prisma.formInvitation.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      contact: true,
      opportunity: { include: { company: true, stage: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Peacemakers AI
          </p>
          <h1 className="mt-1 text-3xl">Blueprint form management</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Create secure invitations and track completion. Raw tokens are shown
            only at creation or regeneration.
          </p>
        </div>
        <Link href="/ops" className="text-sm text-[var(--accent)]">
          ← Pipeline
        </Link>
      </div>

      <CreateInvitationForm />

      <section className="mt-10">
        <h2 className="text-xl">Recent invitations</h2>
        {invitations.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            No invitations yet. Create one above.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--muted)]">
                  <th className="py-2 pr-3 font-medium">Person</th>
                  <th className="py-2 pr-3 font-medium">Company</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Progress</th>
                  <th className="py-2 pr-3 font-medium">Prefix</th>
                  <th className="py-2 font-medium">Open</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.id} className="border-b border-[var(--line)]">
                    <td className="py-3 pr-3">
                      {inv.contact.firstName} {inv.contact.lastName}
                    </td>
                    <td className="py-3 pr-3">{inv.opportunity.company.name}</td>
                    <td className="py-3 pr-3">{inv.status}</td>
                    <td className="py-3 pr-3">{inv.completionPct}%</td>
                    <td className="py-3 pr-3 font-mono text-xs">
                      {inv.tokenPrefix}…
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/ops/forms/${inv.id}`}
                        className="text-[var(--accent)]"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
