import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { addNoteAction } from "../../workflow-actions";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ company?: string }>;
}) {
  const { id } = await params;
  await requireOwnerSession({ returnTo: `/ops/contacts/${id}` });
  const { company: companyId } = await searchParams;

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      companies: { include: { company: true } },
      opportunities: {
        include: {
          company: true,
          stage: true,
          nextActions: { where: { status: "OPEN" }, take: 3 },
        },
        orderBy: { updatedAt: "desc" },
      },
      activities: { orderBy: { createdAt: "desc" }, take: 25 },
      notes: { orderBy: { createdAt: "desc" }, take: 15 },
      meetings: { orderBy: { scheduledAt: "desc" }, take: 10 },
      formInvitations: { orderBy: { createdAt: "desc" }, take: 10 },
      files: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!contact) notFound();

  const company =
    (companyId
      ? contact.companies.find((c) => c.companyId === companyId)?.company
      : null) ??
    contact.companies[0]?.company ??
    null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/ops" className="text-sm text-[var(--accent)]">
        ← Pipeline
      </Link>
      <header className="mt-4 border-b border-[var(--line)] pb-6">
        <h1 className="text-3xl">
          {contact.firstName} {contact.lastName}
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          {contact.jobTitle ? `${contact.jobTitle} · ` : ""}
          {contact.email}
          {contact.phone ? ` · ${contact.phone}` : ""}
        </p>
        {company ? (
          <p className="mt-2 text-sm">
            Company: <strong>{company.name}</strong>
            {company.industry ? ` · ${company.industry}` : ""}
            {company.website ? ` · ${company.website}` : ""}
          </p>
        ) : null}
      </header>

      <section className="mt-8">
        <h2 className="text-xl">Opportunities</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {contact.opportunities.map((o) => (
            <li key={o.id} className="flex justify-between border-b border-[var(--line)] py-2">
              <div>
                <Link
                  href={`/ops/opportunities/${o.id}`}
                  className="font-medium text-[var(--accent)]"
                >
                  {o.title}
                </Link>
                <p className="text-[var(--muted)]">
                  {o.stage.name} · {o.company.name}
                </p>
              </div>
              <span className="text-[var(--muted)]">
                {o.nextActions[0]?.title ?? "No open action"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl">Forms</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {contact.formInvitations.map((inv) => (
            <li key={inv.id}>
              <Link href={`/ops/forms/${inv.id}`} className="text-[var(--accent)]">
                {inv.status} · {inv.completionPct}% · prefix {inv.tokenPrefix}…
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-xl">Activity</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {contact.activities.map((a) => (
              <li key={a.id}>
                <p>{a.summary}</p>
                <p className="text-xs text-[var(--muted)]">
                  {a.createdAt.toLocaleString()}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-xl">Notes</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {contact.notes.map((n) => (
              <li key={n.id} className="whitespace-pre-wrap border-b border-[var(--line)] pb-2">
                {n.body}
              </li>
            ))}
          </ul>
          <form action={addNoteAction} className="mt-3 space-y-2">
            <input type="hidden" name="contactId" value={contact.id} />
            {company ? (
              <input type="hidden" name="companyId" value={company.id} />
            ) : null}
            <textarea
              name="body"
              required
              rows={3}
              className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
            >
              Add note
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl">Meetings & files</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Meeting create/edit is on the related opportunity record.
        </p>
        <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
          <ul>
            {contact.meetings.length === 0 ? (
              <li className="text-[var(--muted)]">No meetings</li>
            ) : (
              contact.meetings.map((m) => (
                <li key={m.id}>
                  {m.title} · {m.status}
                  {m.opportunityId ? (
                    <>
                      {" · "}
                      <Link
                        href={`/ops/opportunities/${m.opportunityId}`}
                        className="text-[var(--accent)]"
                      >
                        Opportunity
                      </Link>
                    </>
                  ) : null}
                </li>
              ))
            )}
          </ul>
          <ul>
            {contact.files.length === 0 ? (
              <li className="text-[var(--muted)]">No files</li>
            ) : (
              contact.files.map((f) => (
                <li key={f.id}>
                  <Link href={`/ops/files/${f.id}`} className="text-[var(--accent)]">
                    {f.originalName}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
