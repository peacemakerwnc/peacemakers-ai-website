import type { BlueprintPayload } from "./form-schema";

function filled(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return true;
  if (typeof value === "string") return value.trim().length > 0;
  return false;
}

function objectCompletion(
  obj: Record<string, unknown>,
  keys: string[],
): number {
  if (!keys.length) return 0;
  const done = keys.filter((k) => filled(obj[k])).length;
  return done / keys.length;
}

/**
 * Weighted completion across sections for autosave / progress UI.
 * Not a security control — server still validates on submit.
 * Section 5 score prefers relational Your Processes when processCount > 0.
 */
export function calculateCompletionPct(
  payload: BlueprintPayload,
  opts?: { relationalProcessCount?: number; relationalRequiredOk?: boolean },
): number {
  const s1Keys = [
    "firstName",
    "lastName",
    "email",
    "companyName",
    "industry",
    "jobTitle",
    "phone",
  ];
  const s2Keys = [
    "productsServices",
    "primaryCustomers",
    "inquiryToFollowUp",
    "threeGoals",
    "greatestFrustration",
  ];
  const s7Keys = [
    "topThreeProcesses",
    "improve30Days",
    "greatestFinancialValue",
  ];

  let section5Score = 0;
  if ((opts?.relationalProcessCount ?? 0) > 0) {
    section5Score = opts?.relationalRequiredOk ? 1 : 0.5;
  } else if (payload.section5.detailedProcesses.some((p) => p.steps.length > 0)) {
    section5Score = 1;
  } else if (payload.section5.detailedProcesses.length > 0) {
    section5Score = 0.5;
  }

  const sections = [
    objectCompletion(payload.section1 as Record<string, unknown>, s1Keys),
    objectCompletion(payload.section2 as Record<string, unknown>, s2Keys),
    payload.section3.tools.length > 0 ? 1 : 0,
    payload.section4.processes.length > 0 ||
    (opts?.relationalProcessCount ?? 0) > 0
      ? 1
      : 0,
    section5Score,
    payload.section6.acknowledgedSensitiveWarning ? 1 : 0,
    objectCompletion(payload.section7 as Record<string, unknown>, s7Keys),
    [
      payload.section8.answersAreHonest,
      payload.section8.noSensitiveCredentials,
      payload.section8.mayUseForBlueprint,
      payload.section8.authorizedToProvide,
    ].filter(Boolean).length / 4,
  ];

  const avg = sections.reduce((a, b) => a + b, 0) / sections.length;
  return Math.min(100, Math.max(0, Math.round(avg * 100)));
}
