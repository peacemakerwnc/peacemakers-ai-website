import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { StageGuidance } from "../../stage-guidance";
import {
  changeStageAction,
  addNextActionAction,
  completeActionAction,
  addNoteAction,
} from "../../workflow-actions";

export const dynamic = "force-dynamic";

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireOwnerSession();
  const { id } = await params;

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      contact: true,
      company: true,
      stage: { include: { checklists: { orderBy: { sortOrder: "asc" } } } },
      pipeline: { include: { stages: { orderBy: { sortOrder: "asc" } } } },
      owner: true,
      activities: { orderBy: { createdAt: "desc" }, take: 30 },
      notes: { orderBy: { createdAt: "desc" }, take: 20 },
      meetings: { orderBy: { scheduledAt: "desc" } },
      nextActions: { orderBy: [{ status: "asc" }, { dueAt: "asc" }] },
      formInvitations: {
        orderBy: { createdAt: "desc" },
        include: {
          responses: {
            where: { status: { in: ["SUBMITTED", "DRAFT"] } },
            orderBy: { version: "desc" },
            take: 2,
          },
        },
      },
      files: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!opportunity) notFound();

  const latestInvite = opportunity.formInvitations[0];
  const submitted = latestInvite?.responses.find((r) => r.status === "SUBMITTED");
  let goals = "";
  let problems = "";
  let tools: { name: string; category: string | null }[] = [];
  if (submitted) {
    try {
      const payload = JSON.parse(submitted.payloadJson) as {
        section2?: { threeGoals?: string; greatestFrustration?: string };
      };
      goals = payload.section2?.threeGoals ?? "";
      problems = payload.section2?.greatestFrustration ?? "";
    } catch {
      /* ignore */
    }
    tools = await prisma.companyTool.findMany({
      where: { formResponseId: submitted.id },
      select: { name: true, category: true },
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/ops" className="text-sm text-[var(--accent)]">
        ← Pipeline
      </Link>
      <header className="mt-4 border-b border-[var(--line)] pb-6">
        <h1 className="text-3xl">{opportunity.title}</h1>
        <p className="mt-2 text-[var(--muted)]">
          <Link
            href={`/ops/contacts/${opportunity.contactId}?company=${opportunity.companyId}`}
            className="text-[var(--accent)]"
          >
            {opportunity.contact.firstName} {opportunity.contact.lastName}
          </Link>
          {" · "}
          {opportunity.company.name}
          {" · "}
          {opportunity.stage.name}
        </p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <StageGuidance stage={opportunity.stage} />

          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="text-lg">Contact & company</h2>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[var(--muted)]">Email</dt>
                <dd>{opportunity.contact.email}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Phone</dt>
                <dd>{opportunity.contact.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Website</dt>
                <dd>{opportunity.company.website ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Industry</dt>
                <dd>{opportunity.company.industry ?? "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="text-lg">Goals & problems</h2>
            <p className="mt-2 text-sm">
              <span className="text-[var(--muted)]">Goals: </span>
              {goals || "—"}
            </p>
            <p className="mt-2 text-sm">
              <span className="text-[var(--muted)]">Key frustration: </span>
              {problems || "—"}
            </p>
            <h3 className="mt-4 text-sm font-medium">Tools in use</h3>
            {tools.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">None captured yet</p>
            ) : (
              <ul className="mt-1 list-disc pl-5 text-sm">
                {tools.map((t) => (
                  <li key={t.name}>
                    {t.name}
                    {t.category ? ` (${t.category})` : ""}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="text-lg">Forms</h2>
            {opportunity.formInvitations.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                No form invitations.{" "}
                <Link href="/ops/forms" className="text-[var(--accent)]">
                  Create one
                </Link>
              </p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {opportunity.formInvitations.map((inv) => (
                  <li key={inv.id} className="flex justify-between gap-3">
                    <span>
                      {inv.status} · {inv.completionPct}%
                    </span>
                    <span className="flex gap-3">
                      <Link href={`/ops/forms/${inv.id}`} className="text-[var(--accent)]">
                        Manage
                      </Link>
                      <Link
                        href={`/ops/forms/${inv.id}/review`}
                        className="text-[var(--accent)]"
                      >
                        Review
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="text-lg">Activity</h2>
            <ol className="mt-3 space-y-3 text-sm">
              {opportunity.activities.map((a) => (
                <li key={a.id} className="border-b border-[var(--line)] pb-2">
                  <p className="font-medium">{a.summary}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {a.createdAt.toLocaleString()} · {a.type}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="text-lg">Move stage</h2>
            <form action={changeStageAction} className="mt-3 space-y-3">
              <input type="hidden" name="opportunityId" value={opportunity.id} />
              <select
                name="stageSlug"
                defaultValue={opportunity.stage.slug}
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              >
                {opportunity.pipeline.stages.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
              <textarea
                name="note"
                placeholder="Optional note"
                rows={2}
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white"
              >
                Update stage
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="text-lg">Next actions</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {opportunity.nextActions.map((action) => (
                <li key={action.id} className="flex items-start justify-between gap-2 border-b border-[var(--line)] pb-2">
                  <div>
                    <p className={action.status === "DONE" ? "line-through text-[var(--muted)]" : ""}>
                      {action.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {action.status}
                      {action.dueAt ? ` · due ${action.dueAt.toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  {action.status === "OPEN" ? (
                    <form action={completeActionAction}>
                      <input type="hidden" name="actionId" value={action.id} />
                      <input type="hidden" name="opportunityId" value={opportunity.id} />
                      <button type="submit" className="text-xs text-[var(--accent)]">
                        Done
                      </button>
                    </form>
                  ) : null}
                </li>
              ))}
            </ul>
            <form action={addNextActionAction} className="mt-4 space-y-2">
              <input type="hidden" name="opportunityId" value={opportunity.id} />
              <input
                name="title"
                required
                placeholder="New next action"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              />
              <input
                name="dueAt"
                type="date"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
              >
                Add action
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="text-lg">Notes</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {opportunity.notes.map((n) => (
                <li key={n.id} className="border-b border-[var(--line)] pb-2">
                  <p className="whitespace-pre-wrap">{n.body}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {n.createdAt.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
            <form action={addNoteAction} className="mt-3 space-y-2">
              <input type="hidden" name="opportunityId" value={opportunity.id} />
              <input type="hidden" name="contactId" value={opportunity.contactId} />
              <input type="hidden" name="companyId" value={opportunity.companyId} />
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
          </section>

          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="text-lg">Meetings</h2>
            {opportunity.meetings.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">No meetings recorded</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {opportunity.meetings.map((m) => (
                  <li key={m.id}>
                    {m.title} · {m.status}
                    {m.scheduledAt ? ` · ${m.scheduledAt.toLocaleString()}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="text-lg">Files</h2>
            {opportunity.files.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">No files</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {opportunity.files.map((f) => (
                  <li key={f.id}>
                    <Link href={`/ops/files/${f.id}`} className="text-[var(--accent)]">
                      {f.originalName}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
