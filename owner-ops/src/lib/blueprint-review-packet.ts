/**
 * Blueprint Review Packet — factual evidence only; no recommendations/ROI.
 * Aligns to ProcessVersion / Evidence* schema field names.
 */
import type {
  EvidenceConflict,
  EvidenceFinding,
  EvidenceSource,
} from "@prisma/client";
import { prisma } from "./db";
import {
  calculateBlueprintReadiness,
  type BlueprintReadinessResult,
} from "./blueprint-readiness";

export type PacketMode = "client" | "internal";

export type PacketSection =
  | "cover"
  | "executive"
  | "landscape"
  | "process_review"
  | "meeting_findings"
  | "asis_future"
  | "appendix";

export type BlueprintReviewPacket = {
  mode: PacketMode;
  preparedAt: string;
  preparedBy: string;
  confidentiality: string;
  companyName: string;
  opportunityName: string;
  title: string;
  sections: Record<PacketSection, unknown | null>;
  omittedEmptySections: PacketSection[];
  warnings: string[];
};

function isEmptySection(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object") {
    const vals = Object.values(value as Record<string, unknown>);
    if (
      vals.every(
        (v) =>
          v == null || v === "" || (Array.isArray(v) && !v.length),
      )
    )
      return true;
  }
  return false;
}

export async function buildBlueprintReviewPacket(input: {
  opportunityId: string;
  mode: PacketMode;
  preparedBy: string;
  processIds?: string[];
  versionIds?: string[];
}): Promise<BlueprintReviewPacket> {
  const opp = await prisma.opportunity.findUnique({
    where: { id: input.opportunityId },
    include: {
      company: true,
      processes: {
        include: {
          versions: {
            orderBy: { versionNumber: "desc" },
            include: {
              steps: { orderBy: { displayOrder: "asc" } },
              connections: true,
              painPoints: true,
              metrics: true,
              opportunities: true,
            },
          },
        },
      },
      formInvitations: {
        include: { responses: { orderBy: { version: "desc" } } },
      },
      blueprintMeetings: {
        include: {
          sources: true,
          findings: { include: { source: true } },
          conflicts: true,
          attendees: true,
        },
      },
    },
  });

  if (!opp) {
    throw new Error("Opportunity not found");
  }

  type ProcessWithVersions = (typeof opp.processes)[number];
  type VersionRow = ProcessWithVersions["versions"][number];

  const warnings: string[] = [];
  const submitted = opp.formInvitations
    .flatMap((i) => i.responses)
    .find((r) => r.status === "SUBMITTED");

  let questionnaireSummary: Record<string, unknown> | null = null;
  if (submitted) {
    try {
      const payload = JSON.parse(submitted.payloadJson || "{}") as Record<
        string,
        unknown
      >;
      const s1 = (payload.section1 ?? {}) as Record<string, unknown>;
      const s2 = (payload.section2 ?? {}) as Record<string, unknown>;
      const s3 = (payload.section3 ?? {}) as { tools?: unknown[] };
      questionnaireSummary = {
        version: submitted.version,
        submittedAt: submitted.submittedAt,
        companyName: s1.companyName,
        primaryGoals: s2.threeGoals ?? s2.engagementSuccessLooksLike,
        toolsCount: Array.isArray(s3.tools) ? s3.tools.length : 0,
      };
    } catch {
      questionnaireSummary = { note: "Questionnaire payload unreadable" };
      warnings.push("Questionnaire payload could not be parsed");
    }
  }

  const processFilter = input.processIds?.length
    ? new Set(input.processIds)
    : null;
  const versionFilter = input.versionIds?.length
    ? new Set(input.versionIds)
    : null;

  function pickVersion(versions: VersionRow[]) {
    const filtered = versionFilter
      ? versions.filter((v) => versionFilter.has(v.id))
      : versions;
    return (
      filtered.find((v) => v.status === "SUBMITTED") ??
      filtered.find((v) => v.status === "APPROVED") ??
      filtered[0] ??
      versions[0]
    );
  }

  const landscape = opp.processes
    .filter((p) => !processFilter || processFilter.has(p.id))
    .map((p) => {
      const version = pickVersion(p.versions);
      if (!version) return null;
      return {
        name: p.name,
        purpose: version.purpose || p.purpose,
        trigger: version.startTrigger,
        outcome: version.outcome,
        versionLabel: version.versionLabel ?? `v${version.versionNumber}`,
        versionNumber: version.versionNumber,
        classification: version.classification,
        status: version.status,
        stepCount: version.steps.length,
        painPointCount: version.painPoints.length,
        metricCount: version.metrics.length,
        opportunityCount: version.opportunities.length,
      };
    })
    .filter(Boolean);

  const processReviews = opp.processes
    .filter((p) => !processFilter || processFilter.has(p.id))
    .map((p) => {
      const version = pickVersion(p.versions);
      if (!version) return null;
      return {
        name: p.name,
        purpose: version.purpose || p.purpose,
        trigger: version.startTrigger,
        outcome: version.outcome,
        frequency: version.frequency,
        averageCompletionTime: version.averageCompletionTime,
        steps: version.steps.map((s) => ({
          name: s.shortName,
          type: s.stepType,
          role: s.responsibleRole,
          description: s.detailedDescription,
          tool: s.toolOrSystem,
        })),
        painPoints: version.painPoints.map((pp) => ({
          title: pp.title,
          severity: pp.severity,
          description: pp.description,
          evidenceSource: pp.evidenceSource,
        })),
        metrics: version.metrics.map((m) => ({
          name: m.name,
          currentValue: m.currentValue,
          unit: m.unit,
          confidence: m.confidence,
          dataSource: m.dataSource,
        })),
        opportunities: version.opportunities.map((o) => ({
          title: o.title,
          problemAddressed: o.problemAddressed,
          proposedChange: o.proposedChange,
          priority: o.priority,
        })),
        structuredFallback: version.steps.map(
          (s, i) => `${i + 1}. [${s.stepType}] ${s.shortName}`,
        ),
      };
    })
    .filter(Boolean);

  const meetings = opp.blueprintMeetings;
  const acceptedFindings = meetings.flatMap((m) =>
    m.findings.filter(
      (f) =>
        f.reviewStatus === "ACCEPTED" ||
        f.reviewStatus === "CORRECTED_AND_ACCEPTED",
    ),
  );
  const proposedFindings = meetings.flatMap((m) =>
    m.findings.filter((f) => f.reviewStatus === "PROPOSED"),
  );
  const rejectedFindings = meetings.flatMap((m) =>
    m.findings.filter(
      (f) =>
        f.reviewStatus === "REJECTED" || f.reviewStatus === "DUPLICATE",
    ),
  );
  const openConflicts = meetings.flatMap((m) =>
    m.conflicts.filter(
      (c) =>
        c.status === "UNRESOLVED" ||
        c.status === "NEEDS_CLIENT_CONFIRMATION",
    ),
  );

  function mapFinding(
    f: EvidenceFinding & { source?: EvidenceSource | null },
  ) {
    const displayTitle =
      f.reviewStatus === "CORRECTED_AND_ACCEPTED" && f.correctedTitle
        ? f.correctedTitle
        : f.title;
    const displayBody =
      f.reviewStatus === "CORRECTED_AND_ACCEPTED" && f.correctedBody
        ? f.correctedBody
        : f.body;
    return {
      title: displayTitle,
      category: f.category,
      body: displayBody,
      excerpt: f.excerpt,
      confidence: f.confidence,
      reviewStatus: f.reviewStatus,
      sourceType: f.source?.sourceType ?? null,
      speakerOrAuthor: f.speakerOrAuthor,
      sourceLocation: f.sourceLocation,
      extractionMethod: f.extractionMethod,
    };
  }

  const meetingFindingsSection = {
    confirmed: acceptedFindings.map(mapFinding),
    decisions: acceptedFindings
      .filter((f) => f.category === "DECISION")
      .map(mapFinding),
    openQuestions: [
      ...acceptedFindings.filter((f) => f.category === "OPEN_QUESTION"),
      ...meetings.flatMap((m) =>
        m.findings.filter((f) => f.reviewStatus === "NEEDS_CLARIFICATION"),
      ),
    ].map(mapFinding),
    assumptions: acceptedFindings
      .filter((f) => f.category === "ASSUMPTION")
      .map(mapFinding),
    unresolvedConflicts: openConflicts.map((c: EvidenceConflict) => ({
      subject: c.subject,
      explanation: c.explanation,
      status: c.status,
      materiality: c.materiality,
      requiresClientConfirm: c.requiresClientConfirm,
      statementA: input.mode === "internal" ? c.statementA : undefined,
      statementB: input.mode === "internal" ? c.statementB : undefined,
    })),
    followUps: acceptedFindings
      .filter((f) => f.category === "FOLLOW_UP_ITEM")
      .map(mapFinding),
    ...(input.mode === "internal"
      ? {
          proposed: proposedFindings.map(mapFinding),
          rejectedOrDuplicate: rejectedFindings.map(mapFinding),
          internalLabel: "INTERNAL WORKING REVIEW — not for client delivery",
        }
      : {}),
  };

  const asisFuture = opp.processes
    .filter((p) => !processFilter || processFilter.has(p.id))
    .map((p) => {
      const asIs =
        p.versions.find(
          (v) =>
            v.classification === "AS_IS" &&
            (v.status === "SUBMITTED" || v.status === "APPROVED"),
        ) ?? p.versions.find((v) => v.classification === "AS_IS");
      const future = p.versions.find((v) => v.classification === "FUTURE_STATE");
      if (!asIs || !future) return null;
      const asIsLabels = new Set(asIs.steps.map((s) => s.shortName));
      const futureLabels = new Set(future.steps.map((s) => s.shortName));
      return {
        processName: p.name,
        asIsVersion: asIs.versionLabel ?? `v${asIs.versionNumber}`,
        futureVersion: future.versionLabel ?? `v${future.versionNumber}`,
        added: [...futureLabels].filter((l) => !asIsLabels.has(l)),
        removed: [...asIsLabels].filter((l) => !futureLabels.has(l)),
        retained: [...asIsLabels].filter((l) => futureLabels.has(l)),
        note: "Comparison is structural by step name only; not a recommendation.",
      };
    })
    .filter(Boolean);

  const readiness: BlueprintReadinessResult =
    await calculateBlueprintReadiness(input.opportunityId);

  const cover = {
    companyName: opp.company.name,
    title: "Blueprint Review Packet",
    preparedDate: new Date().toISOString().slice(0, 10),
    preparedBy: input.preparedBy,
    confidentiality:
      input.mode === "client"
        ? "Confidential — Client Review"
        : "Confidential — Internal Working Review",
    opportunityName: opp.title,
    mode: input.mode,
  };

  const executive = {
    objectives: questionnaireSummary?.primaryGoals ?? null,
    currentStateSummary: `Documented processes: ${landscape.length}. Submitted questionnaire: ${
      submitted ? "yes" : "no"
    }.`,
    documentedScope: landscape.map((l) => (l as { name: string }).name),
    evidenceIncluded: {
      questionnaire: Boolean(submitted),
      meetingRecords: meetings.length,
      acceptedFindings: acceptedFindings.length,
    },
    knownLimitations: readiness.advisories.map((a) => a.label),
    asOfDate: new Date().toISOString().slice(0, 10),
    disclaimer:
      "This packet reflects information available as of the prepared date. It does not include software recommendations, ROI claims, or implementation proposals.",
  };

  const appendix = {
    questionnaireSummary,
    evidenceSourceLegend: [
      "QUESTIONNAIRE_RESPONSE",
      "BLUEPRINT_TRANSCRIPT",
      "CONSULTANT_NOTE",
      "CLIENT_NOTE",
      "OWNER_OBSERVATION",
      "ASSUMPTION",
      "DECISION",
      "CLIENT_CONFIRMED_FACT",
    ],
    confidenceLegend: ["HIGH", "MEDIUM", "LOW", "UNKNOWN"],
    readiness,
    meetingSourceRegister: meetings.flatMap((m) =>
      m.sources.map((s) => ({
        meetingTitle: m.title,
        sourceType: s.sourceType,
        status: s.status,
        authorLabel: s.authorLabel,
        createdAt: s.createdAt,
      })),
    ),
  };

  const hasMeetingContent =
    acceptedFindings.length > 0 ||
    openConflicts.length > 0 ||
    (input.mode === "internal" &&
      (proposedFindings.length > 0 || rejectedFindings.length > 0));

  const rawSections: Record<PacketSection, unknown | null> = {
    cover,
    executive,
    landscape: landscape.length ? landscape : null,
    process_review: processReviews.length ? processReviews : null,
    meeting_findings: hasMeetingContent ? meetingFindingsSection : null,
    asis_future: asisFuture.length ? asisFuture : null,
    appendix,
  };

  const omittedEmptySections: PacketSection[] = [];
  for (const key of Object.keys(rawSections) as PacketSection[]) {
    if (key === "cover" || key === "executive" || key === "appendix") continue;
    if (isEmptySection(rawSections[key])) {
      omittedEmptySections.push(key);
      rawSections[key] = null;
    }
  }

  const serialized = JSON.stringify(rawSections);
  if (/\binviteToken\b|\bpassword\b|\bapi[_-]?key\b/i.test(serialized)) {
    warnings.push(
      "Packet serialization matched sensitive keyword patterns — review before client share",
    );
  }

  return {
    mode: input.mode,
    preparedAt: new Date().toISOString(),
    preparedBy: input.preparedBy,
    confidentiality: cover.confidentiality,
    companyName: opp.company.name,
    opportunityName: opp.title,
    title: cover.title,
    sections: rawSections,
    omittedEmptySections,
    warnings,
  };
}
