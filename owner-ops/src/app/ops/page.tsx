import Link from "next/link";
import { requireOwnerSession } from "@/lib/session";
import { logoutAction } from "./actions";
import { prisma } from "@/lib/db";
import { DEFAULT_PIPELINE_SLUG } from "@/lib/pipeline-seed-data";
import {
  formatPersonName,
  opportunityWarning,
} from "@/lib/pipeline-view";
import { StageGuidance } from "./stage-guidance";

export const dynamic = "force-dynamic";

export default async function OpsPipelinePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    stage?: string;
    sort?: string;
  }>;
}) {
  const session = await requireOwnerSession();
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const stageFilter = params.stage ?? "";
  const sort = params.sort ?? "activity";

  const pipeline = await prisma.pipeline.findUnique({
    where: { slug: DEFAULT_PIPELINE_SLUG },
    include: {
      stages: { orderBy: { sortOrder: "asc" }, include: { checklists: true } },
    },
  });

  const opportunities = await prisma.opportunity.findMany({
    where: {
      ...(stageFilter
        ? { stage: { slug: stageFilter } }
        : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { contact: { firstName: { contains: q } } },
              { contact: { lastName: { contains: q } } },
              { contact: { email: { contains: q } } },
              { company: { name: { contains: q } } },
            ],
          }
        : {}),
    },
    include: {
      contact: true,
      company: true,
      stage: true,
      owner: true,
      nextActions: {
        where: { status: "OPEN" },
        orderBy: { dueAt: "asc" },
      },
      formInvitations: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy:
      sort === "due"
        ? { nextActionDueAt: "asc" }
        : sort === "value"
          ? { estimatedValue: "desc" }
          : { lastActivityAt: "desc" },
  });

  const selectedStage =
    pipeline?.stages.find((s) => s.slug === stageFilter) ??
    pipeline?.stages[0] ??
    null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Peacemakers AI
          </p>
          <h1 className="mt-1 text-3xl">Pipeline</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Signed in as {session.email}
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/ops/forms" className="text-[var(--accent)]">
            Forms
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5"
            >
              Sign out
            </button>
          </form>
        </nav>
      </header>

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search people, companies…"
          className="min-w-[200px] flex-1 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
        <select
          name="stage"
          defaultValue={stageFilter}
          className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
        >
          <option value="">All stages</option>
          {pipeline?.stages.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={sort}
          className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
        >
          <option value="activity">Last activity</option>
          <option value="due">Next action due</option>
          <option value="value">Estimated value</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
        >
          Apply
        </button>
      </form>

      {selectedStage ? <StageGuidance stage={selectedStage} /> : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] text-[var(--muted)]">
              <th className="px-3 py-3 font-medium">Person</th>
              <th className="px-3 py-3 font-medium">Company</th>
              <th className="px-3 py-3 font-medium">Stage</th>
              <th className="px-3 py-3 font-medium">Last activity</th>
              <th className="px-3 py-3 font-medium">Next action</th>
              <th className="px-3 py-3 font-medium">Due</th>
              <th className="px-3 py-3 font-medium">Form</th>
              <th className="px-3 py-3 font-medium">Owner</th>
              <th className="px-3 py-3 font-medium">Value</th>
              <th className="px-3 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-[var(--muted)]">
                  No opportunities yet.{" "}
                  <Link href="/ops/forms" className="text-[var(--accent)]">
                    Create a Blueprint invitation
                  </Link>{" "}
                  to start.
                </td>
              </tr>
            ) : (
              opportunities.map((opp) => {
                const next = opp.nextActions[0];
                const form = opp.formInvitations[0];
                const warn = opportunityWarning({
                  nextActionDueAt: opp.nextActionDueAt,
                  formStatus: opp.formStatus,
                  stage: opp.stage,
                  openActions: opp.nextActions,
                });
                return (
                  <tr key={opp.id} className="border-b border-[var(--line)]">
                    <td className="px-3 py-3">
                      <Link
                        href={`/ops/opportunities/${opp.id}`}
                        className="font-medium text-[var(--navy)] hover:text-[var(--accent)]"
                      >
                        {formatPersonName(
                          opp.contact.firstName,
                          opp.contact.lastName,
                        )}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`/ops/contacts/${opp.contactId}?company=${opp.companyId}`}
                        className="hover:text-[var(--accent)]"
                      >
                        {opp.company.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3">{opp.stage.name}</td>
                    <td className="px-3 py-3 text-[var(--muted)]">
                      {opp.lastActivityAt
                        ? opp.lastActivityAt.toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-3 py-3">{next?.title ?? "—"}</td>
                    <td className="px-3 py-3">
                      {next?.dueAt ? next.dueAt.toLocaleDateString() : "—"}
                    </td>
                    <td className="px-3 py-3">
                      {form ? (
                        <Link
                          href={`/ops/forms/${form.id}`}
                          className="text-[var(--accent)]"
                        >
                          {form.status} ({form.completionPct}%)
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-3">{opp.owner?.name ?? "—"}</td>
                    <td className="px-3 py-3">
                      {opp.estimatedValue != null
                        ? `$${opp.estimatedValue.toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={
                          warn === "overdue"
                            ? "text-[var(--danger)]"
                            : warn === "waiting"
                              ? "text-[var(--warning)]"
                              : "text-[var(--muted)]"
                        }
                      >
                        {warn === "overdue"
                          ? "Overdue"
                          : warn === "waiting"
                            ? "Waiting"
                            : "On track"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
