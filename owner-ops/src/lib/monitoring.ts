/**
 * Operational monitoring boundary for the controlled pilot.
 * Uses structured console events locally; optional Sentry when DSN is set.
 * Never include tokens, passwords, form bodies, or transcripts.
 */

export type MonitorLevel = "info" | "warn" | "error";

export type MonitorEvent = {
  type: string;
  level?: MonitorLevel;
  correlationId?: string;
  /** Safe, non-sensitive context only */
  context?: Record<string, string | number | boolean | null | undefined>;
};

function sanitizeContext(
  context?: MonitorEvent["context"],
): Record<string, string | number | boolean | null> {
  if (!context) return {};
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(context)) {
    const lower = key.toLowerCase();
    if (
      lower.includes("token") ||
      lower.includes("password") ||
      lower.includes("secret") ||
      lower.includes("cookie") ||
      lower.includes("authorization") ||
      lower.includes("payload") ||
      lower.includes("transcript") ||
      lower.includes("answer")
    ) {
      continue;
    }
    if (value === undefined) continue;
    out[key] = value;
  }
  return out;
}

export function newCorrelationId(): string {
  return `corr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function captureEvent(event: MonitorEvent): void {
  const level = event.level ?? "info";
  const safe = {
    type: event.type,
    level,
    correlationId: event.correlationId ?? null,
    context: sanitizeContext(event.context),
    at: new Date().toISOString(),
  };
  const line = `[monitor:${level}] ${JSON.stringify(safe)}`;
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);

  // Optional Sentry hook — activated only when DSN present at runtime.
  const dsn = process.env.SENTRY_DSN;
  if (dsn && level === "error") {
    // Lazy dynamic import avoided; keep boundary without hard dependency.
    // Owner activates Sentry via platform env + optional @sentry/nextjs later.
    void dsn;
  }
}

export function captureError(
  type: string,
  err: unknown,
  context?: MonitorEvent["context"],
  correlationId?: string,
): void {
  const message =
    err instanceof Error ? err.message.slice(0, 200) : "unknown_error";
  captureEvent({
    type,
    level: "error",
    correlationId,
    context: {
      ...context,
      errorName: err instanceof Error ? err.name : "unknown",
      errorMessage: message,
    },
  });
}
