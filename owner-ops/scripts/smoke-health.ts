/**
 * Smoke-check /api/health against a running server.
 * Usage: APP_BASE_URL=http://localhost:3001 tsx scripts/smoke-health.ts
 *
 * Local production `next start` against SQLite is expected to report ready
 * config=fail (Postgres required). This script still requires database=up and
 * that response bodies do not echo actual secret values.
 */
const base = (process.env.APP_BASE_URL ?? "http://localhost:3001").replace(
  /\/$/,
  "",
);

function assertNoSecretValues(body: unknown): void {
  const text = JSON.stringify(body);
  const candidates = [
    process.env.DATABASE_URL,
    process.env.SESSION_SECRET,
    process.env.OWNER_PASSWORD,
    process.env.RESEND_API_KEY,
  ].filter((v): v is string => Boolean(v && v.length >= 8));

  for (const value of candidates) {
    if (text.includes(value)) {
      console.error("Health response echoed a configured secret value");
      process.exit(1);
    }
  }

  // Reject obvious secret material shapes (not mere env var names in errors).
  if (/scrypt\$/.test(text) || /postgres(?:ql)?:\/\/[^"\s]+/i.test(text)) {
    console.error("Health response contained secret-shaped material");
    process.exit(1);
  }
}

async function main() {
  for (const mode of ["live", "ready"]) {
    const res = await fetch(`${base}/api/health?mode=${mode}`);
    const body = await res.json();
    console.info(mode, res.status, JSON.stringify(body));
    if (mode === "live" && res.status !== 200) process.exit(1);
    if (mode === "ready" && body.database !== "up") process.exit(1);
    assertNoSecretValues(body);
  }
  console.info("Health smoke OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
