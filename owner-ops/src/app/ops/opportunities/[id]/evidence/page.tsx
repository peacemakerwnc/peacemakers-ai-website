import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { calculateBlueprintReadiness } from "@/lib/blueprint-readiness";
import { loadUnifiedEvidenceRecord } from "@/lib/blueprint-evidence";
import { EvidenceHubClient } from "./evidence-hub-client";

export const dynamic = "force-dynamic";

export default async function OpportunityEvidencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireOwnerSession({ returnTo: `/ops/opportunities/${id}/evidence` });

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      company: true,
      contact: true,
      processes: { select: { id: true, name: true } },
      formInvitations: {
        include: {
          responses: {
            where: { status: "SUBMITTED" },
            orderBy: { version: "desc" },
            take: 1,
          },
        },
      },
    },
  });
  if (!opportunity) notFound();

  const [readiness, unified] = await Promise.all([
    calculateBlueprintReadiness(id),
    loadUnifiedEvidenceRecord(id),
  ]);

  const submitted = opportunity.formInvitations.flatMap((i) => i.responses)[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={`/ops/opportunities/${id}`}
        className="text-sm text-[var(--accent)]"
      >
        ← Opportunity
      </Link>
      <header className="mt-4 border-b border-[var(--line)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Evidence foundation
        </p>
        <h1 className="mt-2 text-3xl">Blueprint evidence</h1>
        <p className="mt-2 text-[var(--muted)]">
          {opportunity.company.name} · {opportunity.title}
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
          Meeting transcripts and notes become proposed findings until you
          accept them. Submitted questionnaire answers stay immutable.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/ops/opportunities/${id}/packet?mode=client`}
            className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5"
          >
            Client Review packet
          </Link>
          <Link
            href={`/ops/opportunities/${id}/packet?mode=internal`}
            className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5"
          >
            Internal Working Review
          </Link>
          <Link
            href={`/ops/processes?company=${opportunity.companyId}`}
            className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5"
          >
            Process workspace
          </Link>
        </div>
      </header>

      <section
        className="mt-8 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5"
        aria-labelledby="readiness-heading"
      >
        <h2 id="readiness-heading" className="text-xl">
          Blueprint readiness
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Deterministic checks — not an AI opinion.
        </p>
        <p
          className="mt-3 text-lg font-medium"
          data-testid="readiness-classification"
        >
          {readiness.classification.replaceAll("_", " ")}
        </p>
        <ul className="mt-4 space-y-2" role="list">
          {readiness.checks.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-start gap-2 border-b border-[var(--line)] py-2 text-sm last:border-0"
            >
              <span
                className={
                  c.ok
                    ? "text-emerald-800"
                    : c.severity === "error"
                      ? "text-red-800"
                      : "text-amber-900"
                }
                aria-label={c.ok ? "Pass" : c.severity}
              >
                {c.ok ? "Pass" : c.severity === "error" ? "Fail" : "Gap"}
              </span>
              <span>
                <span className="font-medium">{c.label}</span>
                {c.detail ? (
                  <span className="block text-[var(--muted)]">{c.detail}</span>
                ) : null}
                <span className="sr-only"> Axis: {c.axis}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <EvidenceHubClient
        opportunityId={opportunity.id}
        companyId={opportunity.companyId}
        formResponseId={submitted?.id}
        processes={opportunity.processes}
        meetings={unified.meetings.map((m) => ({
          id: m.id,
          title: m.title,
          status: m.status,
          meetingDate: m.meetingDate?.toISOString() ?? null,
          sourceCount: m.sources.length,
          findingCount: m.findings.length,
          conflictCount: m.conflicts.length,
        }))}
        acceptedFindings={unified.acceptedFindings.map((f) => ({
          id: f.id,
          title: f.title,
          category: f.category,
          reviewStatus: f.reviewStatus,
          confidence: f.confidence,
        }))}
        proposedFindings={unified.proposedFindings.map((f) => ({
          id: f.id,
          title: f.title,
          category: f.category,
          reviewStatus: f.reviewStatus,
        }))}
        rejectedFindings={unified.rejectedFindings.map((f) => ({
          id: f.id,
          title: f.title,
          reviewStatus: f.reviewStatus,
        }))}
        unresolvedConflicts={unified.unresolvedConflicts.map((c) => ({
          id: c.id,
          subject: c.subject,
          status: c.status,
          materiality: c.materiality,
        }))}
      />
    </div>
  );
}
