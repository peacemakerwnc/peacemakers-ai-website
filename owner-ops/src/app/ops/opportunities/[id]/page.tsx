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
  createMeetingAction,
  updateMeetingAction,
  updateEstimatedValueAction,
  addProposedServiceAction,
  updateProposedServiceAction,
  deleteProposedServiceAction,
} from "../../workflow-actions";

export const dynamic = "force-dynamic";

function toDatetimeLocal(d: Date | null | undefined): string {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireOwnerSession({ returnTo: `/ops/opportunities/${id}` });

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
      proposedServices: { orderBy: { sortOrder: "asc" } },
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

  const upcomingMeetings = opportunity.meetings.filter(
    (m) => m.status === "SCHEDULED",
  );
  const pastMeetings = opportunity.meetings.filter(
    (m) => m.status !== "SCHEDULED",
  );

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
          {" · "}
          {opportunity.estimatedValue != null
            ? `$${opportunity.estimatedValue.toLocaleString()}`
            : "Value unset"}
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
            <h2 className="text-lg">Proposed services</h2>
            {opportunity.proposedServices.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">None yet</p>
            ) : (
              <ul className="mt-3 space-y-4">
                {opportunity.proposedServices.map((svc) => (
                  <li
                    key={svc.id}
                    className="border-b border-[var(--line)] pb-4 text-sm last:border-0"
                  >
                    <form action={updateProposedServiceAction} className="space-y-2">
                      <input type="hidden" name="serviceId" value={svc.id} />
                      <input
                        type="hidden"
                        name="opportunityId"
                        value={opportunity.id}
                      />
                      <input
                        name="name"
                        required
                        defaultValue={svc.name}
                        className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                      />
                      <div className="flex flex-wrap gap-2">
                        <select
                          name="status"
                          defaultValue={svc.status}
                          className="rounded-md border border-[var(--line)] px-2 py-1.5"
                        >
                          <option value="proposed">proposed</option>
                          <option value="accepted">accepted</option>
                          <option value="declined">declined</option>
                          <option value="deferred">deferred</option>
                        </select>
                        <button
                          type="submit"
                          className="rounded-md border border-[var(--line)] px-3 py-1.5"
                        >
                          Save
                        </button>
                      </div>
                      <textarea
                        name="notes"
                        rows={2}
                        defaultValue={svc.notes ?? ""}
                        placeholder="Notes (optional)"
                        className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                      />
                    </form>
                    <form action={deleteProposedServiceAction} className="mt-2">
                      <input type="hidden" name="serviceId" value={svc.id} />
                      <input
                        type="hidden"
                        name="opportunityId"
                        value={opportunity.id}
                      />
                      <button type="submit" className="text-xs text-[var(--danger)]">
                        Remove
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <form action={addProposedServiceAction} className="mt-4 space-y-2">
              <input type="hidden" name="opportunityId" value={opportunity.id} />
              <input
                name="name"
                required
                placeholder="Service name"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              />
              <select
                name="status"
                defaultValue="proposed"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              >
                <option value="proposed">proposed</option>
                <option value="accepted">accepted</option>
                <option value="declined">declined</option>
                <option value="deferred">deferred</option>
              </select>
              <textarea
                name="notes"
                rows={2}
                placeholder="Notes (optional)"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
              >
                Add service
              </button>
            </form>
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
            <h2 className="text-lg">Estimated value</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Whole dollars. Leave blank for unknown (distinct from $0).
            </p>
            <form action={updateEstimatedValueAction} className="mt-3 space-y-2">
              <input type="hidden" name="opportunityId" value={opportunity.id} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--muted)]">$</span>
                <input
                  name="estimatedValue"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  defaultValue={
                    opportunity.estimatedValue != null
                      ? String(opportunity.estimatedValue)
                      : ""
                  }
                  placeholder="Unknown"
                  className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white"
              >
                Save value
              </button>
            </form>
          </section>

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
                <li
                  key={action.id}
                  className="flex items-start justify-between gap-2 border-b border-[var(--line)] pb-2"
                >
                  <div>
                    <p
                      className={
                        action.status === "DONE"
                          ? "line-through text-[var(--muted)]"
                          : ""
                      }
                    >
                      {action.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {action.status}
                      {action.dueAt
                        ? ` · due ${action.dueAt.toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  {action.status === "OPEN" ? (
                    <form action={completeActionAction}>
                      <input type="hidden" name="actionId" value={action.id} />
                      <input
                        type="hidden"
                        name="opportunityId"
                        value={opportunity.id}
                      />
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
            <h3 className="mt-3 text-sm font-medium">Upcoming / scheduled</h3>
            {upcomingMeetings.length === 0 ? (
              <p className="mt-1 text-sm text-[var(--muted)]">None scheduled</p>
            ) : (
              <ul className="mt-2 space-y-4">
                {upcomingMeetings.map((m) => (
                  <li key={m.id} className="border-b border-[var(--line)] pb-3 text-sm">
                    <form action={updateMeetingAction} className="space-y-2">
                      <input type="hidden" name="meetingId" value={m.id} />
                      <input
                        type="hidden"
                        name="opportunityId"
                        value={opportunity.id}
                      />
                      <input
                        name="title"
                        required
                        defaultValue={m.title}
                        className="w-full rounded-md border border-[var(--line)] px-2 py-1.5"
                      />
                      <input
                        name="scheduledAt"
                        type="datetime-local"
                        defaultValue={toDatetimeLocal(m.scheduledAt)}
                        className="w-full rounded-md border border-[var(--line)] px-2 py-1.5"
                      />
                      <select
                        name="status"
                        defaultValue={m.status}
                        className="w-full rounded-md border border-[var(--line)] px-2 py-1.5"
                      >
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="NO_SHOW">NO_SHOW</option>
                      </select>
                      <input
                        name="locationOrUrl"
                        defaultValue={m.locationOrUrl ?? ""}
                        placeholder="Location or URL"
                        className="w-full rounded-md border border-[var(--line)] px-2 py-1.5"
                      />
                      <textarea
                        name="notes"
                        rows={2}
                        defaultValue={m.notes ?? ""}
                        placeholder="Notes"
                        className="w-full rounded-md border border-[var(--line)] px-2 py-1.5"
                      />
                      <button
                        type="submit"
                        className="rounded-md border border-[var(--line)] px-2 py-1 text-xs"
                      >
                        Update meeting
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <h3 className="mt-4 text-sm font-medium">Completed / other</h3>
            {pastMeetings.length === 0 ? (
              <p className="mt-1 text-sm text-[var(--muted)]">None</p>
            ) : (
              <ul className="mt-2 space-y-4">
                {pastMeetings.map((m) => (
                  <li key={m.id} className="border-b border-[var(--line)] pb-3 text-sm">
                    <form action={updateMeetingAction} className="space-y-2">
                      <input type="hidden" name="meetingId" value={m.id} />
                      <input
                        type="hidden"
                        name="opportunityId"
                        value={opportunity.id}
                      />
                      <input
                        name="title"
                        required
                        defaultValue={m.title}
                        className="w-full rounded-md border border-[var(--line)] px-2 py-1.5"
                      />
                      <input
                        name="scheduledAt"
                        type="datetime-local"
                        defaultValue={toDatetimeLocal(m.scheduledAt)}
                        className="w-full rounded-md border border-[var(--line)] px-2 py-1.5"
                      />
                      <select
                        name="status"
                        defaultValue={m.status}
                        className="w-full rounded-md border border-[var(--line)] px-2 py-1.5"
                      >
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="NO_SHOW">NO_SHOW</option>
                      </select>
                      <textarea
                        name="notes"
                        rows={2}
                        defaultValue={m.notes ?? ""}
                        className="w-full rounded-md border border-[var(--line)] px-2 py-1.5"
                      />
                      <button
                        type="submit"
                        className="rounded-md border border-[var(--line)] px-2 py-1 text-xs"
                      >
                        Update meeting
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <form action={createMeetingAction} className="mt-4 space-y-2 border-t border-[var(--line)] pt-4">
              <p className="text-sm font-medium">Schedule meeting</p>
              <input type="hidden" name="opportunityId" value={opportunity.id} />
              <input
                name="title"
                required
                placeholder="Title"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              />
              <input
                name="scheduledAt"
                type="datetime-local"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              />
              <select
                name="status"
                defaultValue="SCHEDULED"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="NO_SHOW">NO_SHOW</option>
              </select>
              <input
                name="locationOrUrl"
                placeholder="Location or URL"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              />
              <textarea
                name="notes"
                rows={2}
                placeholder="Notes"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
              >
                Create meeting
              </button>
            </form>
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

          <section className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="text-lg">Proposals & agreements</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Not available in Phase 1 — proposal documents, e-sign, and
              agreements ship in a later increment.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
