/**
 * Fail closed when NODE_ENV=production and config is unsafe for pilot.
 * Usage: NODE_ENV=production tsx scripts/assert-production-env.ts
 */
import { resetEnvCache } from "../src/lib/env";
import { assertProductionConfig } from "../src/lib/production-guards";

resetEnvCache();
const result = assertProductionConfig();
for (const w of result.warnings) console.warn(`[warn] ${w}`);
for (const e of result.errors) console.error(`[error] ${e}`);
if (!result.ok) {
  console.error("Production env assertion FAILED");
  process.exit(1);
}
console.info("Production env assertion OK");
