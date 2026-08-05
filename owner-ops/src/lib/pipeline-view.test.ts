import { describe, expect, it } from "vitest";
import { opportunityWarning, isOverdue } from "./pipeline-view";
import { NextActionStatus } from "@prisma/client";

describe("pipeline warnings", () => {
  it("flags overdue next actions", () => {
    expect(
      opportunityWarning({
        stage: { slug: "blueprint-form-sent", isTerminal: false },
        openActions: [
          {
            dueAt: new Date(Date.now() - 86400000),
            status: NextActionStatus.OPEN,
          },
        ],
      }),
    ).toBe("overdue");
  });

  it("flags waiting form states", () => {
    expect(
      opportunityWarning({
        stage: { slug: "blueprint-form-sent", isTerminal: false },
        formStatus: "SENT",
        openActions: [],
      }),
    ).toBe("waiting");
  });

  it("treats terminal stages as ok", () => {
    expect(
      opportunityWarning({
        stage: { slug: "won-client", isTerminal: true },
        nextActionDueAt: new Date(Date.now() - 1000),
      }),
    ).toBe("ok");
  });

  it("detects overdue dates", () => {
    expect(isOverdue(new Date(Date.now() - 1))).toBe(true);
    expect(isOverdue(new Date(Date.now() + 60_000))).toBe(false);
    expect(isOverdue(null)).toBe(false);
  });
});
