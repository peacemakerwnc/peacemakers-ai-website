import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ownerOpsRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

type Practice = {
  id: string;
  slide: number;
  title: string;
  creator: string;
  youtubeId: string;
  duration: string;
  teaches: string[];
  practice: string;
  doNot: string[];
  measure: string;
};

const catalog = JSON.parse(
  readFileSync(
    path.join(
      ownerOpsRoot,
      "skills/owner-practice-loop/references/practices.json",
    ),
    "utf8",
  ),
) as { practices: Practice[] };

const course = readFileSync(
  path.join(ownerOpsRoot, "docs/learning/twelve-youtube-courses.md"),
  "utf8",
);

const loop = readFileSync(
  path.join(ownerOpsRoot, "skills/owner-practice-loop/references/loop.md"),
  "utf8",
);

describe("owner practice catalog", () => {
  it("has the twelve carousel courses", () => {
    expect(catalog.practices).toHaveLength(12);
    const ids = catalog.practices.map((practice) => practice.id);
    expect(new Set(ids).size).toBe(12);
  });

  it("points each practice at a video the course names", () => {
    for (const practice of catalog.practices) {
      expect(practice.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(course).toContain(practice.youtubeId);
      expect(course).toContain(`\`${practice.id}\``);
      expect(practice.teaches.length).toBeGreaterThan(1);
      expect(practice.practice.length).toBeGreaterThan(40);
      expect(practice.doNot.length).toBeGreaterThan(0);
      expect(practice.measure.length).toBeGreaterThan(20);
    }
  });

  it("keeps the improvement loop repeatable", () => {
    for (const step of ["Observe", "Practice", "Measure", "Revise"]) {
      expect(loop).toContain(step);
    }
    expect(loop).toContain("used");
    expect(loop).toContain("boundary");
  });
});
