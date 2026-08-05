import { describe, expect, it } from "vitest";
import { safeOpsReturnPath } from "./session";

describe("safeOpsReturnPath", () => {
  it("accepts nested /ops paths", () => {
    expect(safeOpsReturnPath("/ops")).toBe("/ops");
    expect(safeOpsReturnPath("/ops/opportunities/abc")).toBe(
      "/ops/opportunities/abc",
    );
    expect(safeOpsReturnPath("/ops/forms/x/review")).toBe("/ops/forms/x/review");
  });

  it("rejects open redirects and login loops", () => {
    expect(safeOpsReturnPath(null)).toBeNull();
    expect(safeOpsReturnPath("")).toBeNull();
    expect(safeOpsReturnPath("https://evil.test")).toBeNull();
    expect(safeOpsReturnPath("//evil.test")).toBeNull();
    expect(safeOpsReturnPath("/ops.evil.test")).toBeNull();
    expect(safeOpsReturnPath("/login")).toBeNull();
    expect(safeOpsReturnPath("/ops/login")).toBeNull();
    expect(safeOpsReturnPath("/ops/login?x=1")).toBeNull();
    expect(safeOpsReturnPath("/ops/\n/evil")).toBeNull();
    expect(safeOpsReturnPath(" /ops ")).toBe("/ops");
  });
});
