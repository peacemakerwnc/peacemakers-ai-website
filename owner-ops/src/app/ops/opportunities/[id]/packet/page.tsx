import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerSession } from "@/lib/session";
import { buildBlueprintReviewPacket } from "@/lib/blueprint-review-packet";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PacketPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const mode = sp.mode === "internal" ? "internal" : "client";
  const session = await requireOwnerSession({
    returnTo: `/ops/opportunities/${id}/packet?mode=${mode}`,
  });

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!opportunity) notFound();

  const packet = await buildBlueprintReviewPacket({
    opportunityId: id,
    mode,
    preparedBy: session.email ?? "Owner",
  });

  const cover = packet.sections.cover as Record<string, unknown>;
  const executive = packet.sections.executive as Record<string, unknown>;
  const landscape = packet.sections.landscape as unknown[] | null;
  const processReview = packet.sections.process_review as unknown[] | null;
  const meeting = packet.sections.meeting_findings as Record<
    string,
    unknown
  > | null;
  const asis = packet.sections.asis_future as unknown[] | null;
  const appendix = packet.sections.appendix as Record<string, unknown>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
        <Link
          href={`/ops/opportunities/${id}/evidence`}
          className="text-sm text-[var(--accent)]"
        >
          ← Evidence
        </Link>
        <Link
          href={`/ops/opportunities/${id}/packet?mode=${mode === "client" ? "internal" : "client"}`}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
        >
          Switch to {mode === "client" ? "Internal" : "Client"} mode
        </Link>
        <Link
          href={`/ops/opportunities/${id}/packet/print?mode=${mode}`}
          className="rounded-md bg-[var(--navy)] px-3 py-1.5 text-sm text-white"
        >
          Print / PDF view
        </Link>
      </div>

      <article className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 print:border-0 print:p-0">
        <header className="border-b border-[var(--line)] pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {String(cover.confidentiality)}
          </p>
          <h1 className="mt-2 text-3xl">{String(cover.title)}</h1>
          <p className="mt-2 text-[var(--muted)]">
            {String(cover.companyName)} · {String(cover.opportunityName)}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Prepared {String(cover.preparedDate)} by {String(cover.preparedBy)}
          </p>
        </header>

        <section className="mt-8">
          <h2 className="text-xl">Executive context</h2>
          <p className="mt-2 text-sm">{String(executive.disclaimer)}</p>
          <p className="mt-3 text-sm">
            <span className="font-medium">As of:</span>{" "}
            {String(executive.asOfDate)}
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Current-state summary:</span>{" "}
            {String(executive.currentStateSummary)}
          </p>
          {executive.objectives ? (
            <p className="mt-2 text-sm">
              <span className="font-medium">Objectives:</span>{" "}
              {String(executive.objectives)}
            </p>
          ) : null}
        </section>

        {landscape ? (
          <section className="mt-8">
            <h2 className="text-xl">Process landscape</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    <th className="py-2 pr-3">Process</th>
                    <th className="py-2 pr-3">Purpose</th>
                    <th className="py-2 pr-3">Version</th>
                    <th className="py-2">Steps</th>
                  </tr>
                </thead>
                <tbody>
                  {(landscape as Record<string, unknown>[]).map((row, i) => (
                    <tr key={i} className="border-b border-[var(--line)]">
                      <td className="py-2 pr-3 font-medium">
                        {String(row.name)}
                      </td>
                      <td className="py-2 pr-3">{String(row.purpose ?? "—")}</td>
                      <td className="py-2 pr-3">
                        {String(row.versionLabel)} ({String(row.status)})
                      </td>
                      <td className="py-2">{String(row.stepCount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {processReview ? (
          <section className="mt-8">
            <h2 className="text-xl">Individual process review</h2>
            {(processReview as Record<string, unknown>[]).map((p, i) => (
              <div
                key={i}
                className="mt-4 border-t border-[var(--line)] pt-4 break-inside-avoid"
              >
                <h3 className="text-lg">{String(p.name)}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Trigger: {String(p.trigger ?? "—")} · Outcome:{" "}
                  {String(p.outcome ?? "—")}
                </p>
                <h4 className="mt-3 text-sm font-semibold">Structured steps</h4>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">
                  {(p.structuredFallback as string[]).map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ol>
                {Array.isArray(p.painPoints) &&
                (p.painPoints as unknown[]).length ? (
                  <>
                    <h4 className="mt-3 text-sm font-semibold">Pain points</h4>
                    <ul className="mt-1 list-disc pl-5 text-sm">
                      {(
                        p.painPoints as { title: string; severity: string }[]
                      ).map((pp, j) => (
                        <li key={j}>
                          {pp.title} ({pp.severity})
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {meeting ? (
          <section className="mt-8">
            <h2 className="text-xl">Meeting findings</h2>
            {mode === "internal" && meeting.internalLabel ? (
              <p className="mt-2 rounded-md border border-amber-700/40 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                {String(meeting.internalLabel)}
              </p>
            ) : null}
            <FindingList
              title="Confirmed"
              items={meeting.confirmed as { title: string; category: string }[]}
            />
            <FindingList
              title="Decisions"
              items={meeting.decisions as { title: string; category: string }[]}
            />
            <FindingList
              title="Open questions"
              items={
                meeting.openQuestions as { title: string; category: string }[]
              }
            />
            <FindingList
              title="Assumptions"
              items={
                meeting.assumptions as { title: string; category: string }[]
              }
            />
            {Array.isArray(meeting.unresolvedConflicts) &&
            (meeting.unresolvedConflicts as unknown[]).length ? (
              <>
                <h3 className="mt-4 text-base font-medium">
                  Unresolved conflicts
                </h3>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {(
                    meeting.unresolvedConflicts as {
                      subject: string;
                      materiality: string;
                    }[]
                  ).map((c, i) => (
                    <li key={i}>
                      {c.subject} ({c.materiality})
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {mode === "internal" && Array.isArray(meeting.proposed) ? (
              <FindingList
                title="Proposed (internal)"
                items={meeting.proposed as { title: string; category: string }[]}
              />
            ) : null}
            {mode === "internal" &&
            Array.isArray(meeting.rejectedOrDuplicate) ? (
              <FindingList
                title="Rejected / duplicate (internal)"
                items={
                  meeting.rejectedOrDuplicate as {
                    title: string;
                    category: string;
                  }[]
                }
              />
            ) : null}
          </section>
        ) : null}

        {asis ? (
          <section className="mt-8">
            <h2 className="text-xl">As-Is / Future-State comparison</h2>
            {(asis as Record<string, unknown>[]).map((row, i) => (
              <div key={i} className="mt-3 text-sm">
                <h3 className="font-medium">{String(row.processName)}</h3>
                <p className="text-[var(--muted)]">{String(row.note)}</p>
                <p className="mt-1">
                  Added: {(row.added as string[]).join(", ") || "—"}
                </p>
                <p>Removed: {(row.removed as string[]).join(", ") || "—"}</p>
                <p>Retained: {(row.retained as string[]).join(", ") || "—"}</p>
              </div>
            ))}
          </section>
        ) : null}

        <section className="mt-8">
          <h2 className="text-xl">Appendix</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Evidence-source legend:{" "}
            {(appendix.evidenceSourceLegend as string[]).join(", ")}
          </p>
          {packet.omittedEmptySections.length ? (
            <p className="mt-2 text-sm text-[var(--muted)]">
              Omitted empty sections: {packet.omittedEmptySections.join(", ")}
            </p>
          ) : null}
          {packet.warnings.length ? (
            <p className="mt-2 text-sm text-amber-900">
              Warnings: {packet.warnings.join("; ")}
            </p>
          ) : null}
        </section>
      </article>
    </div>
  );
}

function FindingList({
  title,
  items,
}: {
  title: string;
  items: { title: string; category: string }[] | undefined;
}) {
  if (!items?.length) return null;
  return (
    <>
      <h3 className="mt-4 text-base font-medium">{title}</h3>
      <ul className="mt-1 list-disc pl-5 text-sm">
        {items.map((f, i) => (
          <li key={i}>
            {f.title}{" "}
            <span className="text-[var(--muted)]">({f.category})</span>
          </li>
        ))}
      </ul>
    </>
  );
}
