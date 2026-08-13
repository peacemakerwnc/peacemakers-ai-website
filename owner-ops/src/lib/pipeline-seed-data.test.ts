import { describe, expect, it } from "vitest";
import {
  DEFAULT_STAGES,
  LIFECYCLE_ORDER_SLUGS,
} from "./pipeline-seed-data";

function indexOfSlug(slug: string): number {
  const i = DEFAULT_STAGES.findIndex((s) => s.slug === slug);
  if (i < 0) throw new Error(`missing stage ${slug}`);
  return i;
}

describe("pipeline seed semantics (OD-MR-06)", () => {
  it("keeps unique slugs", () => {
    const slugs = DEFAULT_STAGES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("places Blueprint commercial (sign/pay) before questionnaire release", () => {
    expect(indexOfSlug("agreement-sent")).toBeLessThan(
      indexOfSlug("blueprint-form-not-sent"),
    );
    expect(indexOfSlug("awaiting-payment")).toBeLessThan(
      indexOfSlug("blueprint-form-not-sent"),
    );
    expect(indexOfSlug("qualified")).toBeLessThan(indexOfSlug("agreement-sent"));
  });

  it("keeps Blueprint Complete before Implementation Interest and Active", () => {
    expect(indexOfSlug("blueprint-complete")).toBeLessThan(
      indexOfSlug("implementation-interest"),
    );
    expect(indexOfSlug("implementation-interest")).toBeLessThan(
      indexOfSlug("implementation-scoping"),
    );
    expect(indexOfSlug("implementation-scoping")).toBeLessThan(
      indexOfSlug("implementation-commercial"),
    );
    expect(indexOfSlug("implementation-commercial")).toBeLessThan(
      indexOfSlug("won-client"),
    );
  });

  it("does not chain Blueprint Complete directly to Implementation Active", () => {
    const complete = DEFAULT_STAGES.find((s) => s.slug === "blueprint-complete");
    expect(complete?.nextStageSlug).toBe("implementation-interest");
    expect(complete?.nextStageSlug).not.toBe("won-client");
  });

  it("treats Implementation Active (won-client) as terminal and Blueprint Complete as non-terminal success", () => {
    expect(
      DEFAULT_STAGES.find((s) => s.slug === "won-client")?.isTerminal,
    ).toBe(true);
    expect(
      DEFAULT_STAGES.find((s) => s.slug === "blueprint-complete")?.isTerminal,
    ).toBe(false);
  });

  it("exposes lifecycle order anchors used by OD-MR-06", () => {
    for (const slug of LIFECYCLE_ORDER_SLUGS) {
      expect(DEFAULT_STAGES.some((s) => s.slug === slug)).toBe(true);
    }
  });

  it("preserves form-automation slugs required by responses.ts", () => {
    for (const slug of [
      "blueprint-form-started",
      "waiting-for-client",
      "blueprint-form-submitted",
      "blueprint-review-required",
    ]) {
      expect(DEFAULT_STAGES.some((s) => s.slug === slug)).toBe(true);
    }
  });
});
