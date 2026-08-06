import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerSession } from "@/lib/session";
import { getBlueprintMeeting } from "@/lib/blueprint-evidence";
import { prisma } from "@/lib/db";
import { MeetingIntakeClient } from "./meeting-intake-client";

export const dynamic = "force-dynamic";

export default async function BlueprintMeetingPage({
  params,
}: {
  params: Promise<{ id: string; meetingId: string }>;
}) {
  const { id, meetingId } = await params;
  await requireOwnerSession({
    returnTo: `/ops/opportunities/${id}/evidence/${meetingId}`,
  });

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      company: true,
      processes: { select: { id: true, name: true } },
    },
  });
  if (!opportunity) notFound();

  let meeting;
  try {
    meeting = await getBlueprintMeeting(meetingId, opportunity.companyId);
  } catch {
    notFound();
  }
  if (meeting.opportunityId !== id) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={`/ops/opportunities/${id}/evidence`}
        className="text-sm text-[var(--accent)]"
      >
        ← Evidence hub
      </Link>
      <header className="mt-4 border-b border-[var(--line)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Blueprint meeting
        </p>
        <h1 className="mt-2 text-3xl">{meeting.title}</h1>
        <p className="mt-2 text-[var(--muted)]">
          {opportunity.company.name} · {meeting.status.replaceAll("_", " ")}
          {meeting.meetingDate
            ? ` · ${meeting.meetingDate.toLocaleString()}`
            : ""}
        </p>
      </header>

      <MeetingIntakeClient
        opportunityId={id}
        companyId={opportunity.companyId}
        meetingId={meeting.id}
        status={meeting.status}
        processes={opportunity.processes}
        sources={meeting.sources.map((s) => ({
          id: s.id,
          title: s.title,
          sourceType: s.sourceType,
          status: s.status,
          bodyText: s.bodyText,
          originalBodyText: s.originalBodyText,
          version: s.version,
          parentSourceId: s.parentSourceId,
          isSensitive: s.isSensitive,
        }))}
        findings={meeting.findings.map((f) => ({
          id: f.id,
          title: f.title,
          body: f.body,
          category: f.category,
          reviewStatus: f.reviewStatus,
          excerpt: f.excerpt,
          sourceId: f.sourceId,
          correctedTitle: f.correctedTitle,
          confidence: f.confidence,
        }))}
        conflicts={meeting.conflicts.map((c) => ({
          id: c.id,
          subject: c.subject,
          statementA: c.statementA,
          statementB: c.statementB,
          status: c.status,
          materiality: c.materiality,
          resolutionRationale: c.resolutionRationale,
        }))}
      />
    </div>
  );
}
