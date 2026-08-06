/**
 * Deterministic Blueprint readiness checks — not an AI opinion.
 */
import { EvidenceConflictStatus, EvidenceFindingReviewStatus } from "@prisma/client";
import { prisma } from "./db";
import { validateGraphIntegrity } from "./process-graph";

export type ReadinessClassification =
  | "READY"
  | "READY_WITH_OPEN_ITEMS"
  | "NOT_READY"
  | "NOT_APPLICABLE";

export type ReadinessCheck = {
  id: string;
  axis: "questionnaire" | "process" | "meeting" | "preparation";
  label: string;
  ok: boolean;
  severity: "error" | "warning" | "info";
  detail?: string;
};

export type BlueprintReadinessResult = {
  classification: ReadinessClassification;
  checks: ReadinessCheck[];
  structuralErrors: ReadinessCheck[];
  advisories: ReadinessCheck[];
};

export async function calculateBlueprintReadiness(
  opportunityId: string,
): Promise<BlueprintReadinessResult> {
  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      formInvitations: {
        include: { responses: { orderBy: { version: "desc" } } },
      },
      processes: {
        include: {
          versions: { orderBy: { versionNumber: "desc" }, take: 2 },
        },
      },
      company: true,
    },
  });
  if (!opp) {
    return {
      classification: "NOT_APPLICABLE",
      checks: [
        {
          id: "opp_missing",
          axis: "preparation",
          label: "Opportunity exists",
          ok: false,
          severity: "error",
        },
      ],
      structuralErrors: [],
      advisories: [],
    };
  }

  const checks: ReadinessCheck[] = [];
  const submitted = opp.formInvitations
    .flatMap((i) => i.responses)
    .find((r) => r.status === "SUBMITTED");

  checks.push({
    id: "questionnaire_submitted",
    axis: "questionnaire",
    label: "Questionnaire submitted",
    ok: Boolean(submitted),
    severity: "error",
    detail: submitted
      ? `Response v${submitted.version}`
      : "No submitted questionnaire response",
  });

  if (submitted) {
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(submitted.payloadJson || "{}") as Record<
        string,
        unknown
      >;
    } catch {
      payload = {};
    }
    const s1 = (payload.section1 ?? {}) as Record<string, unknown>;
    const s2 = (payload.section2 ?? {}) as Record<string, unknown>;
    const s3 = (payload.section3 ?? {}) as { tools?: unknown[] };
    const s7 = (payload.section7 ?? {}) as Record<string, unknown>;
    checks.push({
      id: "contact_company",
      axis: "questionnaire",
      label: "Contact and company present",
      ok: Boolean(s1.companyName || opp.company.name),
      severity: "error",
    });
    checks.push({
      id: "objectives",
      axis: "questionnaire",
      label: "Primary objectives documented",
      ok: Boolean(
        s2.threeGoals ||
          s2.engagementSuccessLooksLike ||
          s7.topThreeProcesses ||
          s7.improve30Days,
      ),
      severity: "warning",
      detail: "Advisory if sparse — discuss during Blueprint call",
    });
    checks.push({
      id: "tools",
      axis: "questionnaire",
      label: "Software stack entries present",
      ok: Array.isArray(s3.tools) && s3.tools.length > 0,
      severity: "warning",
    });
    checks.push({
      id: "pain_manual",
      axis: "questionnaire",
      label: "Pain / manual work signals present",
      ok: Boolean(
        s2.timeConsumingWork ||
          s2.greatestFrustration ||
          s2.whereValueIsLost,
      ),
      severity: "warning",
    });
  }

  checks.push({
    id: "processes_identified",
    axis: "process",
    label: "At least one process documented",
    ok: opp.processes.length > 0,
    severity: "error",
  });

  for (const process of opp.processes) {
    const version =
      process.versions.find((v) => v.status === "SUBMITTED") ??
      process.versions.find((v) => v.status === "APPROVED") ??
      process.versions[0];
    if (!version) {
      checks.push({
        id: `process_${process.id}_version`,
        axis: "process",
        label: `${process.name}: has a version`,
        ok: false,
        severity: "error",
      });
      continue;
    }
    const integrity = await validateGraphIntegrity(version.id);
    checks.push({
      id: `process_${process.id}_graph`,
      axis: "process",
      label: `${process.name}: structural graph valid`,
      ok: integrity.ok,
      severity: "error",
      detail: integrity.issues
        .filter((i) => i.severity === "error")
        .map((i) => i.message)
        .join("; "),
    });
    checks.push({
      id: `process_${process.id}_purpose`,
      axis: "process",
      label: `${process.name}: purpose documented`,
      ok: Boolean(version.purpose || process.purpose),
      severity: "warning",
    });
    checks.push({
      id: `process_${process.id}_trigger`,
      axis: "process",
      label: `${process.name}: trigger documented`,
      ok: Boolean(version.startTrigger),
      severity: "warning",
    });
  }

  const meetings = await prisma.blueprintMeeting.findMany({
    where: { opportunityId, companyId: opp.companyId },
    include: {
      sources: true,
      findings: true,
      conflicts: true,
    },
  });

  checks.push({
    id: "meeting_record",
    axis: "meeting",
    label: "Blueprint meeting record exists",
    ok: meetings.length > 0,
    severity: "warning",
    detail:
      meetings.length === 0
        ? "Optional before the call; required after evidence intake"
        : undefined,
  });

  if (meetings.length) {
    const hasTranscript = meetings.some((m) =>
      m.sources.some((s) => s.sourceType === "BLUEPRINT_TRANSCRIPT"),
    );
    const hasNotes = meetings.some((m) =>
      m.sources.some(
        (s) =>
          s.sourceType === "CONSULTANT_NOTE" || s.sourceType === "CLIENT_NOTE",
      ),
    );
    checks.push({
      id: "transcript_status",
      axis: "meeting",
      label: "Transcript source present",
      ok: hasTranscript,
      severity: "warning",
    });
    checks.push({
      id: "notes_status",
      axis: "meeting",
      label: "Consultant or client notes present",
      ok: hasNotes,
      severity: "info",
    });
    const proposed = meetings.flatMap((m) =>
      m.findings.filter(
        (f) => f.reviewStatus === EvidenceFindingReviewStatus.PROPOSED,
      ),
    );
    checks.push({
      id: "findings_reviewed",
      axis: "meeting",
      label: "No unreviewed proposed findings",
      ok: proposed.length === 0,
      severity: "warning",
      detail:
        proposed.length > 0
          ? `${proposed.length} proposed finding(s) awaiting owner review`
          : undefined,
    });
    const materialConflicts = meetings.flatMap((m) =>
      m.conflicts.filter(
        (c) =>
          (c.status === EvidenceConflictStatus.UNRESOLVED ||
            c.status === EvidenceConflictStatus.NEEDS_CLIENT_CONFIRMATION) &&
          c.materiality !== "LOW",
      ),
    );
    checks.push({
      id: "material_conflicts",
      axis: "meeting",
      label: "No unresolved material conflicts",
      ok: materialConflicts.length === 0,
      severity: "error",
      detail:
        materialConflicts.length > 0
          ? `${materialConflicts.length} material conflict(s) visible`
          : undefined,
    });
  }

  checks.push({
    id: "discussion_items_visible",
    axis: "preparation",
    label: "Open discussion items remain visible (not hidden)",
    ok: true,
    severity: "info",
  });

  const structuralErrors = checks.filter(
    (c) => !c.ok && c.severity === "error",
  );
  const advisories = checks.filter((c) => !c.ok && c.severity !== "error");

  let classification: ReadinessClassification = "READY";
  if (structuralErrors.length) classification = "NOT_READY";
  else if (advisories.length) classification = "READY_WITH_OPEN_ITEMS";

  return { classification, checks, structuralErrors, advisories };
}
