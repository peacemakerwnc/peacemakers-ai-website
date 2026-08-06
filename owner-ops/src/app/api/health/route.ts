import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertProductionConfig } from "@/lib/production-guards";
import { isProduction } from "@/lib/env";
import { captureError } from "@/lib/monitoring";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Liveness + readiness health check.
 * Never returns env values, connection strings, or client counts.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") ?? "ready";

  if (mode === "live") {
    return NextResponse.json(
      { status: "ok", check: "live" },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  }

  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (err) {
    captureError("health.db_failed", err);
  }

  const guards = isProduction()
    ? assertProductionConfig()
    : { ok: true, errors: [] as string[], warnings: [] as string[] };

  const ready = dbOk && guards.ok;
  const status = ready ? "ok" : dbOk ? "degraded" : "fail";
  const http = ready ? 200 : 503;

  return NextResponse.json(
    {
      status,
      check: "ready",
      database: dbOk ? "up" : "down",
      config: guards.ok ? "ok" : "fail",
      // Expose error codes only — not secrets
      configErrors: guards.errors.map((e) => e.slice(0, 120)),
    },
    {
      status: http,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
