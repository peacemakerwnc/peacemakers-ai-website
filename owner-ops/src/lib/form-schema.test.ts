import { describe, expect, it } from "vitest";
import {
  draftPayloadSchema,
  emptyBlueprintPayload,
  submitPayloadSchema,
} from "./form-schema";
import { calculateCompletionPct } from "./completion";

describe("form validation", () => {
  it("allows empty drafts", () => {
    const parsed = draftPayloadSchema.safeParse({});
    expect(parsed.success).toBe(true);
  });

  it("requires contact fields, detailed process, and confirmations on submit", () => {
    const empty = submitPayloadSchema.safeParse(emptyBlueprintPayload());
    expect(empty.success).toBe(false);

    const payload = emptyBlueprintPayload();
    payload.section1 = {
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      companyName: "Analytical Engines",
    };
    payload.section5 = {
      detailedProcesses: [
        {
          id: "1",
          name: "Lead response",
          steps: [],
        },
      ],
    };
    payload.section8 = {
      answersAreHonest: true,
      noSensitiveCredentials: true,
      mayUseForBlueprint: true,
      authorizedToProvide: true,
    };
    payload.privacy = {
      noticeVersion: "pilot-2026-08-05",
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
    };
    expect(submitPayloadSchema.safeParse(payload).success).toBe(true);
  });

  it("calculates completion percentage from filled sections", () => {
    const payload = emptyBlueprintPayload();
    expect(calculateCompletionPct(payload)).toBe(0);
    payload.section1 = {
      firstName: "A",
      lastName: "B",
      email: "a@b.com",
      companyName: "Co",
      industry: "Services",
      jobTitle: "Owner",
      phone: "555",
    };
    expect(calculateCompletionPct(payload)).toBeGreaterThan(0);
  });
});
