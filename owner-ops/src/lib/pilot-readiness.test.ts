import { describe, expect, it, beforeEach } from "vitest";
import { rateLimit, resetRateLimits, checkRateLimit } from "./rate-limit";
import { resetEnvCache } from "./env";
import { assertProductionConfig } from "./production-guards";
import { getPrivacyNotice, PRIVACY_NOTICE_VERSION } from "./privacy";
import { buildInvitationEmail } from "./invite-email";
import { captureEvent } from "./monitoring";
import {
  draftPayloadSchema,
  emptyBlueprintPayload,
  submitPayloadSchema,
} from "./form-schema";

describe("rate limiting", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests under the limit", () => {
    const a = rateLimit("t:a", 3, 60_000);
    const b = rateLimit("t:a", 3, 60_000);
    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
  });

  it("blocks after limit", () => {
    rateLimit("t:b", 2, 60_000);
    rateLimit("t:b", 2, 60_000);
    const blocked = rateLimit("t:b", 2, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("checkRateLimit uses memory backend by default", async () => {
    const r = await checkRateLimit("t:c", 1, 60_000);
    expect(r.backend).toBe("memory");
    expect(r.ok).toBe(true);
    const blocked = await checkRateLimit("t:c", 1, 60_000);
    expect(blocked.ok).toBe(false);
  });
});

describe("production guards", () => {
  beforeEach(() => {
    resetEnvCache();
  });

  it("skips hard fail when not production", () => {
    const result = assertProductionConfig();
    expect(result.ok).toBe(true);
  });

  it("rejects sqlite DATABASE_URL in production", () => {
    const env = process.env as Record<string, string | undefined>;
    const prev = env.NODE_ENV;
    const prevDb = env.DATABASE_URL;
    env.NODE_ENV = "production";
    env.DATABASE_URL = "file:./dev.db";
    resetEnvCache();
    const result = assertProductionConfig();
    env.NODE_ENV = prev;
    env.DATABASE_URL = prevDb;
    resetEnvCache();
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("Postgres"))).toBe(true);
  });
});

describe("privacy notice", () => {
  it("exposes a stable version and acknowledgement copy", () => {
    const notice = getPrivacyNotice();
    expect(notice.version).toBe(PRIVACY_NOTICE_VERSION);
    expect(notice.acknowledgementLabel.length).toBeGreaterThan(40);
    expect(notice.paragraphs.length).toBeGreaterThan(2);
  });

  it("requires privacy acknowledgement on submit", () => {
    const payload = emptyBlueprintPayload();
    payload.section1 = {
      firstName: "A",
      lastName: "B",
      email: "a@example.com",
      companyName: "Co",
    };
    payload.section8 = {
      answersAreHonest: true,
      noSensitiveCredentials: true,
      mayUseForBlueprint: true,
      authorizedToProvide: true,
    };
    expect(submitPayloadSchema.safeParse(payload).success).toBe(false);
    payload.privacy = {
      noticeVersion: PRIVACY_NOTICE_VERSION,
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
    };
    expect(submitPayloadSchema.safeParse(payload).success).toBe(true);
  });

  it("allows drafts without privacy acknowledgement", () => {
    expect(draftPayloadSchema.safeParse({}).success).toBe(true);
  });
});

describe("invitation email template", () => {
  it("includes form URL and excludes internal CRM fields", () => {
    const content = buildInvitationEmail({
      to: "morgan@example.test",
      recipientFirstName: "Morgan",
      companyName: "Optimum Pilot Contractors",
      formUrl: "http://localhost:3001/f/testtokenvaluewithenoughlength",
      expiresAt: new Date("2026-09-01T00:00:00Z"),
      kind: "initial",
    });
    expect(content.text).toContain("http://localhost:3001/f/");
    expect(content.html).toContain("Open your secure form");
    expect(content.text).not.toContain("opportunityId");
    expect(content.text).not.toContain("SESSION_SECRET");
    // Safety copy may mention "password(s)" as a warning; forbid secret material.
    expect(content.html).not.toContain("SESSION_SECRET");
    expect(content.html).not.toMatch(/scrypt\$/);
    expect(content.html).not.toContain("rawToken");
  });
});

describe("monitoring sanitization", () => {
  it("does not throw when capturing events with sensitive keys", () => {
    expect(() =>
      captureEvent({
        type: "test.event",
        context: {
          token: "should-be-stripped",
          password: "nope",
          tokenPrefix: "abcd1234",
          status: 200,
        },
      }),
    ).not.toThrow();
  });
});

describe("postgres test-database URL guards", () => {
  it("rejects missing OWNER_OPS_TEST_DATABASE_URL without skipping", async () => {
    const {
      requireOwnerOpsTestDatabaseUrl,
      TestDatabaseConfigError,
      OWNER_OPS_TEST_DATABASE_URL_ENV,
    } = await import("./test-db");
    const prev = process.env[OWNER_OPS_TEST_DATABASE_URL_ENV];
    delete process.env[OWNER_OPS_TEST_DATABASE_URL_ENV];
    try {
      expect(() => requireOwnerOpsTestDatabaseUrl(process.env)).toThrow(
        TestDatabaseConfigError,
      );
    } finally {
      if (prev === undefined) delete process.env[OWNER_OPS_TEST_DATABASE_URL_ENV];
      else process.env[OWNER_OPS_TEST_DATABASE_URL_ENV] = prev;
    }
  });

  it("rejects sqlite and obvious production-looking URLs", async () => {
    const {
      assertSafeOwnerOpsTestDatabaseUrl,
      TestDatabaseConfigError,
    } = await import("./test-db");
    expect(() =>
      assertSafeOwnerOpsTestDatabaseUrl("file:./vitest.db"),
    ).toThrow(TestDatabaseConfigError);
    expect(() =>
      assertSafeOwnerOpsTestDatabaseUrl(
        "postgresql://u:p@ep-x.us-east-1.aws.neon.tech/neondb",
      ),
    ).toThrow(TestDatabaseConfigError);
    expect(() =>
      assertSafeOwnerOpsTestDatabaseUrl(
        "postgresql://u:p@127.0.0.1:5432/owner_ops_test",
      ),
    ).not.toThrow();
  });
});
