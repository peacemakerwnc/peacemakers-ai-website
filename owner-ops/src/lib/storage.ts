/**
 * Private file storage interface.
 * Local disk is for development only — not production on Vercel.
 * Swap to a durable private object store in the production-readiness phase.
 */

import { createHash, randomBytes } from "crypto";
import { mkdir, writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import { getEnv } from "./env";

export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.ms-excel",
]);

export const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MiB

export type StoredFile = {
  storageKey: string;
  sha256: string;
  sizeBytes: number;
  mimeType: string;
  originalName: string;
};

export type StoreFileInput = {
  originalName: string;
  mimeType: string;
  buffer: Buffer;
};

export interface StorageAdapter {
  store(input: StoreFileInput): Promise<StoredFile>;
  read(storageKey: string): Promise<Buffer>;
  delete(storageKey: string): Promise<void>;
}

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}

export function validateUploadMeta(
  originalName: string,
  mimeType: string,
  sizeBytes: number,
): void {
  if (!originalName || originalName.length > 255) {
    throw new FileValidationError("Invalid file name");
  }
  if (originalName.includes("..") || originalName.includes("/") || originalName.includes("\\")) {
    throw new FileValidationError("Invalid file name");
  }
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new FileValidationError("File type not allowed");
  }
  if (sizeBytes <= 0 || sizeBytes > MAX_FILE_BYTES) {
    throw new FileValidationError("File size not allowed");
  }
}

function sanitizeExtension(name: string): string {
  const ext = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return ext.slice(0, 12);
}

export class LocalDiskStorageAdapter implements StorageAdapter {
  constructor(private readonly root: string) {}

  private resolveKey(storageKey: string): string {
    if (
      !storageKey ||
      storageKey.includes("..") ||
      storageKey.includes("\\") ||
      storageKey.startsWith("/")
    ) {
      throw new FileValidationError("Invalid storage key");
    }
    const full = path.resolve(this.root, storageKey);
    const rootResolved = path.resolve(this.root);
    if (!full.startsWith(rootResolved + path.sep) && full !== rootResolved) {
      throw new FileValidationError("Invalid storage key");
    }
    return full;
  }

  async store(input: StoreFileInput): Promise<StoredFile> {
    validateUploadMeta(input.originalName, input.mimeType, input.buffer.length);
    const sha256 = createHash("sha256").update(input.buffer).digest("hex");
    const id = randomBytes(16).toString("hex");
    const ext = sanitizeExtension(input.originalName);
    const storageKey = `${id}${ext}`;
    await mkdir(this.root, { recursive: true });
    const full = this.resolveKey(storageKey);
    await writeFile(full, input.buffer, { flag: "wx" });
    return {
      storageKey,
      sha256,
      sizeBytes: input.buffer.length,
      mimeType: input.mimeType,
      originalName: input.originalName,
    };
  }

  async read(storageKey: string): Promise<Buffer> {
    const full = this.resolveKey(storageKey);
    return readFile(full);
  }

  async delete(storageKey: string): Promise<void> {
    const full = this.resolveKey(storageKey);
    await unlink(full);
  }
}

let adapter: StorageAdapter | null = null;

export function getStorageAdapter(): StorageAdapter {
  if (!adapter) {
    adapter = new LocalDiskStorageAdapter(getEnv().STORAGE_ROOT);
  }
  return adapter;
}

export function setStorageAdapter(next: StorageAdapter): void {
  adapter = next;
}

export function resetStorageAdapter(): void {
  adapter = null;
}
