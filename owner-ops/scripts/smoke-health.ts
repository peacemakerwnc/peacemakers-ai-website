/**
 * Smoke-check /api/health against a running server.
 * Usage: APP_BASE_URL=http://localhost:3001 tsx scripts/smoke-health.ts
 */
const base = (process.env.APP_BASE_URL ?? "http://localhost:3001").replace(
  /\/$/,
  "",
);

async function main() {
  for (const mode of ["live", "ready"]) {
    const res = await fetch(`${base}/api/health?mode=${mode}`);
    const body = await res.json();
    console.info(mode, res.status, JSON.stringify(body));
    if (mode === "live" && res.status !== 200) process.exit(1);
    if (mode === "ready" && body.database !== "up") process.exit(1);
    // Ensure no sensitive keys leaked
    const text = JSON.stringify(body);
    for (const bad of ["DATABASE_URL", "SESSION_SECRET", "password", "token"]) {
      if (text.includes(bad)) {
        console.error("Health response leaked sensitive key:", bad);
        process.exit(1);
      }
    }
  }
  console.info("Health smoke OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
