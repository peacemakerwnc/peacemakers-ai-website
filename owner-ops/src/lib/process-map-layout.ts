/**
 * Presentation-only map layout helpers for the owner process workspace.
 * Never invents ProcessConnection records or changes workflow relationships.
 */

export type LayoutStep = {
  id: string;
  displayOrder: number;
  stepType: string;
  canvasX: number | null;
  canvasY: number | null;
  swimlaneId: string | null;
};

export type LayoutConnection = {
  id: string;
  sourceStepId: string;
  targetStepId: string;
  connectionType: string;
  isDefaultPath: boolean;
};

const SECONDARY_TYPES = new Set([
  "FAILURE",
  "ESCALATION",
  "TIMEOUT",
  "REJECTED",
  "RETURNED_FOR_CORRECTION",
  "LOOP",
  "REWORK",
  "TERMINATION",
]);

export function isSecondaryConnection(connectionType: string) {
  return SECONDARY_TYPES.has(connectionType);
}

export function isPrimaryConnectionType(connectionType: string) {
  return (
    connectionType === "NORMAL" ||
    connectionType === "PARALLEL" ||
    connectionType === "CONDITIONAL" ||
    connectionType === "APPROVED"
  );
}

/** Walk default/normal paths from TRIGGER; do not number branches as a false sequence. */
export function computePrimaryPath(
  steps: LayoutStep[],
  connections: LayoutConnection[],
): { orderedIds: string[]; numbered: Map<string, number> } {
  const byId = new Map(steps.map((s) => [s.id, s]));
  const outs = new Map<string, LayoutConnection[]>();
  for (const c of connections) {
    const list = outs.get(c.sourceStepId) ?? [];
    list.push(c);
    outs.set(c.sourceStepId, list);
  }

  const start =
    steps.find((s) => s.stepType === "TRIGGER") ??
    [...steps].sort((a, b) => a.displayOrder - b.displayOrder)[0];
  if (!start) return { orderedIds: [], numbered: new Map() };

  const orderedIds: string[] = [];
  const numbered = new Map<string, number>();
  const visited = new Set<string>();
  let current: string | null = start.id;
  let n = 1;

  while (current && !visited.has(current)) {
    visited.add(current);
    orderedIds.push(current);
    numbered.set(current, n);
    n += 1;

    const candidates: LayoutConnection[] = (outs.get(current) ?? []).filter(
      (c) =>
        !isSecondaryConnection(c.connectionType) &&
        byId.has(c.targetStepId) &&
        !visited.has(c.targetStepId),
    );
    if (!candidates.length) break;

    const preferred: LayoutConnection | undefined =
      candidates.find((c: LayoutConnection) => c.isDefaultPath) ??
      candidates.find((c: LayoutConnection) => c.connectionType === "NORMAL") ??
      candidates.find((c: LayoutConnection) => c.connectionType === "APPROVED") ??
      candidates[0];
    // Stop numbering through multi-way branches without a default — label outcomes instead
    if (
      candidates.length > 1 &&
      !candidates.some((c: LayoutConnection) => c.isDefaultPath) &&
      preferred?.connectionType === "CONDITIONAL"
    ) {
      break;
    }
    current = preferred?.targetStepId ?? null;
  }

  return { orderedIds, numbered };
}

export function versionHasManualLayout(steps: LayoutStep[]) {
  return steps.some((s) => s.canvasX != null && s.canvasY != null);
}

/**
 * Left-to-right primary flow with secondary paths offset downward.
 * Does not mutate connections — returns positions only.
 */
export function computeAutoArrangePositions(
  steps: LayoutStep[],
  connections: LayoutConnection[],
  lanes: Array<{ id: string; displayOrder: number }> = [],
): Array<{ stepId: string; canvasX: number; canvasY: number }> {
  const { orderedIds, numbered } = computePrimaryPath(steps, connections);
  const laneIndex = new Map(lanes.map((l, i) => [l.id, i]));
  const primaryIndex = new Map(orderedIds.map((id, i) => [id, i]));

  const COL = 240;
  const ROW = 150;
  const BASE_X = 40;
  const BASE_Y = 40;

  // Place non-primary by displayOrder after primary column span
  let side = 0;
  return steps.map((s) => {
    const laneRow = laneIndex.get(s.swimlaneId ?? "") ?? 0;
    if (primaryIndex.has(s.id)) {
      const col = primaryIndex.get(s.id)!;
      return {
        stepId: s.id,
        canvasX: BASE_X + col * COL,
        canvasY: BASE_Y + laneRow * ROW,
      };
    }
    const col =
      numbered.size > 0
        ? Math.min(side % Math.max(numbered.size, 1), numbered.size)
        : s.displayOrder;
    const row = 1 + Math.floor(side / Math.max(numbered.size, 1)) + laneRow;
    side += 1;
    return {
      stepId: s.id,
      canvasX: BASE_X + col * COL,
      canvasY: BASE_Y + row * ROW + 40,
    };
  });
}

export function plainConnectionLabel(
  connectionType: string,
  displayLabel: string | null | undefined,
  condition: string | null | undefined,
) {
  if (displayLabel?.trim()) return displayLabel.trim();
  if (condition?.trim()) return condition.trim();
  const map: Record<string, string> = {
    NORMAL: "Next",
    CONDITIONAL: "If…",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    RETURNED_FOR_CORRECTION: "Needs correction",
    PARALLEL: "Also",
    LOOP: "Returns to earlier step",
    REWORK: "Rework",
    ESCALATION: "Escalate",
    TIMEOUT: "Timed out",
    FAILURE: "Failed",
    TERMINATION: "Ends here",
  };
  return map[connectionType] ?? connectionType;
}
