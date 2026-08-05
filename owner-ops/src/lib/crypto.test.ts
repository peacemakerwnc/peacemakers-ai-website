import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  generateInvitationToken,
  hashPassword,
  hashToken,
  tokenPrefix,
  verifyPassword,
  safeEqualString,
} from "./crypto";
import {
  createSessionValue,
  parseSessionValue,
} from "./session-token";
import { getEnv, resetEnvCache } from "./env";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_BYTES,
  validateUploadMeta,
  FileValidationError,
  LocalDiskStorageAdapter,
} from "./storage";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

describe("password hashing", () => {
  it("hashes and verifies a password", () => {
    const hash = hashPassword("correct-horse-battery");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(verifyPassword("correct-horse-battery", hash)).toBe(true);
    expect(verifyPassword("wrong-password!!", hash)).toBe(false);
  });

  it("rejects malformed stored hashes", () => {
    expect(verifyPassword("anything", "not-a-hash")).toBe(false);
    expect(verifyPassword("anything", "bcrypt$foo")).toBe(false);
  });
});

describe("invitation tokens", () => {
  it("generates unique high-entropy tokens", () => {
    const a = generateInvitationToken();
    const b = generateInvitationToken();
    expect(a).not.toEqual(b);
    expect(a.length).toBeGreaterThanOrEqual(40);
  });

  it("hashes tokens deterministically and exposes only a short prefix", () => {
    const raw = generateInvitationToken();
    expect(hashToken(raw)).toEqual(hashToken(raw));
    expect(hashToken(raw)).not.toEqual(raw);
    expect(tokenPrefix(raw)).toEqual(raw.slice(0, 8));
    expect(tokenPrefix(raw).length).toBe(8);
  });

  it("does not allow timing-unsafe string compare length mismatch", () => {
    expect(safeEqualString("abc", "ab")).toBe(false);
    expect(safeEqualString("abc", "abc")).toBe(true);
  });
});

describe("session cookies", () => {
  beforeEach(() => {
    process.env.DATABASE_URL = "file:./test.db";
    process.env.OWNER_EMAIL = "owner@example.com";
    process.env.OWNER_NAME = "Owner";
    process.env.OWNER_PASSWORD = "change-me-before-use";
    process.env.SESSION_SECRET =
      "test-session-secret-at-least-32-characters-long";
    process.env.STORAGE_ROOT = "./storage-test";
    process.env.APP_BASE_URL = "http://localhost:3001";
    resetEnvCache();
  });

  afterEach(() => {
    resetEnvCache();
  });

  it("creates a signed session that parses back", () => {
    const value = createSessionValue("user_1", "owner@example.com", 3600);
    const parsed = parseSessionValue(value);
    expect(parsed).not.toBeNull();
    expect(parsed!.userId).toBe("user_1");
    expect(parsed!.email).toBe("owner@example.com");
    expect(parsed!.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("rejects tampered sessions", () => {
    const value = createSessionValue("user_1", "owner@example.com", 3600);
    const tampered = value.replace(/\./, ".") + "x";
    expect(parseSessionValue(tampered)).toBeNull();
    expect(parseSessionValue("not.valid")).toBeNull();
  });

  it("rejects expired sessions", () => {
    const value = createSessionValue("user_1", "owner@example.com", -10);
    expect(parseSessionValue(value)).toBeNull();
  });

  it("loads env with validated fields", () => {
    const env = getEnv();
    expect(env.OWNER_EMAIL).toBe("owner@example.com");
    expect(env.SESSION_SECRET.length).toBeGreaterThanOrEqual(32);
  });
});

describe("file upload restrictions", () => {
  it("allows known safe mime types under size limit", () => {
    expect(() =>
      validateUploadMeta("notes.pdf", "application/pdf", 1024),
    ).not.toThrow();
    expect(ALLOWED_MIME_TYPES.has("application/pdf")).toBe(true);
  });

  it("rejects path traversal names, bad mime, and oversized files", () => {
    expect(() =>
      validateUploadMeta("../secret.pdf", "application/pdf", 10),
    ).toThrow(FileValidationError);
    expect(() =>
      validateUploadMeta("evil.exe", "application/x-msdownload", 10),
    ).toThrow(FileValidationError);
    expect(() =>
      validateUploadMeta("big.pdf", "application/pdf", MAX_FILE_BYTES + 1),
    ).toThrow(FileValidationError);
  });

  it("stores and reads files under a private root without path escape", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "owner-ops-storage-"));
    try {
      const storage = new LocalDiskStorageAdapter(root);
      const stored = await storage.store({
        originalName: "sample.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("hello"),
      });
      expect(stored.storageKey.includes("..")).toBe(false);
      const read = await storage.read(stored.storageKey);
      expect(read.toString()).toBe("hello");
      await expect(storage.read("../etc/passwd")).rejects.toThrow(
        FileValidationError,
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
