/**
 * Visual acceptance screenshots for process-map readability correction.
 * Fictional Optimum data only. Does not print secrets.
 */
import { createHmac } from "crypto";
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const root = path.resolve(__dirname, "..");
const BASE = process.env.APP_BASE_URL || "http://127.0.0.1:3001";
const PROCESS_ID = "cmsgg70w2000aitn13l5jws9a";
const OUT = path.join(root, "docs/visual-acceptance");

function parseEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return {} as Record<string, string>;
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[trimmed.slice(0, eq).trim()] = val;
  }
  return out;
}

const env = {
  ...parseEnvFile(path.join(root, ".env.example")),
  ...parseEnvFile(path.join(root, ".env")),
};

function createSession(userId: string, email: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({ userId, email, iat: now, exp: now + 3600 }),
  ).toString("base64url");
  const sig = createHmac("sha256", env.SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const owner = await prisma.user.findFirstOrThrow({ where: { isOwner: true } });
  const cookie = createSession(owner.id, owner.email);
  await prisma.$disconnect();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.context().addCookies([
    {
      name: "owner_ops_session",
      value: cookie,
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
    },
  ]);

  const shots: string[] = [];
  async function shot(name: string) {
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    shots.push(file);
    console.log("SHOT", file);
  }

  await page.goto(`${BASE}/ops/processes/${PROCESS_ID}/workspace?view=all`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForSelector("text=All processes", { timeout: 30000 });
  await page.waitForTimeout(1000);
  await shot("01-all-processes-landscape");

  await page.goto(
    `${BASE}/ops/processes/${PROCESS_ID}/workspace?view=process&version=cmsgg70w4000citn1rf45gp5l`,
    { waitUntil: "domcontentloaded", timeout: 60000 },
  );
  await page.waitForSelector("text=Field photo reporting", { timeout: 30000 });
  await page.waitForTimeout(2000);
  await shot("02-individual-process-standard");

  const overview = page.getByRole("button", { name: "Overview", exact: true });
  if (await overview.count()) {
    await overview.click();
    await page.waitForTimeout(500);
    await shot("03-individual-process-overview");
  }

  const detailed = page.getByRole("button", { name: "Detailed", exact: true });
  if (await detailed.count()) {
    await detailed.click();
    await page.waitForTimeout(500);
    await shot("04-individual-process-detailed");
  }

  const primary = page.getByLabel("Primary path");
  if (await primary.count()) {
    await primary.check();
    await page.waitForTimeout(500);
    await shot("05-filtered-primary-path");
    await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  }

  await page.getByRole("button", { name: "Presentation", exact: true }).click();
  await page.waitForTimeout(800);
  await shot("06-presentation-mode");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Exit presentation", exact: true }).click();
  await page.waitForTimeout(800);
  await shot("07-mobile-structured-fallback");

  await page.setViewportSize({ width: 820, height: 1100 });
  await page.goto(`${BASE}/ops/processes/${PROCESS_ID}/workspace?view=all`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(800);
  await shot("08-tablet-all-processes");

  await browser.close();
  console.log(JSON.stringify({ shots, processId: PROCESS_ID }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
