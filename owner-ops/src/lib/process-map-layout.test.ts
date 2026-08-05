import { describe, expect, it } from "vitest";
import {
  computeAutoArrangePositions,
  computePrimaryPath,
  isSecondaryConnection,
  versionHasManualLayout,
} from "./process-map-layout";

describe("process map layout helpers", () => {
  const steps = [
    {
      id: "t",
      displayOrder: 0,
      stepType: "TRIGGER",
      canvasX: null,
      canvasY: null,
      swimlaneId: null,
    },
    {
      id: "a",
      displayOrder: 1,
      stepType: "HUMAN_TASK",
      canvasX: null,
      canvasY: null,
      swimlaneId: null,
    },
    {
      id: "d",
      displayOrder: 2,
      stepType: "DECISION",
      canvasX: null,
      canvasY: null,
      swimlaneId: null,
    },
    {
      id: "e",
      displayOrder: 3,
      stepType: "PROCESS_END",
      canvasX: null,
      canvasY: null,
      swimlaneId: null,
    },
    {
      id: "fail",
      displayOrder: 4,
      stepType: "EXCEPTION",
      canvasX: null,
      canvasY: null,
      swimlaneId: null,
    },
  ];
  const connections = [
    {
      id: "c1",
      sourceStepId: "t",
      targetStepId: "a",
      connectionType: "NORMAL",
      isDefaultPath: true,
    },
    {
      id: "c2",
      sourceStepId: "a",
      targetStepId: "d",
      connectionType: "NORMAL",
      isDefaultPath: true,
    },
    {
      id: "c3",
      sourceStepId: "d",
      targetStepId: "e",
      connectionType: "NORMAL",
      isDefaultPath: true,
    },
    {
      id: "c4",
      sourceStepId: "d",
      targetStepId: "fail",
      connectionType: "FAILURE",
      isDefaultPath: false,
    },
  ];

  it("numbers only the primary path and leaves failure off the sequence", () => {
    const { numbered, orderedIds } = computePrimaryPath(steps, connections);
    expect(orderedIds).toEqual(["t", "a", "d", "e"]);
    expect(numbered.get("fail")).toBeUndefined();
    expect(numbered.get("t")).toBe(1);
    expect(isSecondaryConnection("FAILURE")).toBe(true);
  });

  it("auto-arrange returns positions without needing connection mutation", () => {
    const before = connections.map((c) => ({ ...c }));
    const positions = computeAutoArrangePositions(steps, connections);
    expect(positions).toHaveLength(steps.length);
    expect(positions.every((p) => typeof p.canvasX === "number")).toBe(true);
    expect(connections).toEqual(before);
  });

  it("detects manual layout presence", () => {
    expect(versionHasManualLayout(steps)).toBe(false);
    expect(
      versionHasManualLayout([
        { ...steps[0]!, canvasX: 10, canvasY: 20 },
        ...steps.slice(1),
      ]),
    ).toBe(true);
  });
});
