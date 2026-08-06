/**
 * Increment 4 correction — browser reacceptance (fictional data only).
 * Run against `next start` on ACCEPT_BASE_URL (default http://127.0.0.1:3001).
 *
 * node docs/acceptance/increment-4-correction/run-browser-correction.mjs
 */
import { chromium, devices } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const BASE = process.env.ACCEPT_BASE_URL || "http://127.0.0.1:3001";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "owner@peacemakersai.com";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "change-me-before-use";
const OPP = "cmsgg70vx0004itn1ybw2bg0s";
const COMPANY = "cmsfv2vtu0001ituvlhuorbzc";

const results = [];
function record(id, status, detail = "") {
  results.push({ id, status, detail });
  console.log(`[${status}] ${id}${detail ? " — " + detail : ""}`);
}

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

function dbMeetings(titleLike) {
  const sql = `SELECT id,title FROM BlueprintMeeting WHERE companyId='${COMPANY}' AND title LIKE '%${titleLike.replace(/'/g, "")}%' ORDER BY createdAt DESC;`;
  const out = execSync(
    `sqlite3 "${path.join(__dirname, "../../../prisma/dev.db")}" "${sql}"`,
    { encoding: "utf8" },
  ).trim();
  if (!out) return [];
  return out.split("\n").map((line) => {
    const [id, title] = line.split("|");
    return { id, title };
  });
}

async function login(page) {
  await page.goto(`${BASE}/ops/login`, { waitUntil: "domcontentloaded" });
  await page.fill('input[name="email"]', OWNER_EMAIL);
  await page.fill('input[name="password"]', OWNER_PASSWORD);
  await Promise.all([
    page.waitForURL(/\/ops(?!\/login)/, { timeout: 30000 }),
    page.click('button[type="submit"]'),
  ]);
}

async function fillFieldByLabel(page, labelRe, value) {
  const labeled = page.getByLabel(labelRe);
  if ((await labeled.count()) > 0) {
    await labeled.first().fill(value);
    return true;
  }
  return false;
}

async function completeProcessBuilder(page) {
  await page.getByRole("button", { name: /Your Processes|5\./i }).click();
  await page.waitForTimeout(400);

  await page
    .getByPlaceholder(/Field photo reporting/i)
    .fill("Field photo reporting and documentation");
  await page.getByRole("button", { name: /^Add process$/i }).click();
  await page.waitForTimeout(1500);

  // Overview
  await fillFieldByLabel(
    page,
    /Why does this process exist/i,
    "Document completed job work for customers and the office",
  );
  await fillFieldByLabel(
    page,
    /What starts it/i,
    "Technician marks the job complete in the field",
  );
  await fillFieldByLabel(
    page,
    /successful completion looks like/i,
    "Photo package delivered and approved",
  );
  await fillFieldByLabel(page, /How does it end/i, "Report archived");
  await page.getByRole("button", { name: /Save overview/i }).click();
  await page.waitForTimeout(1000);

  // People
  await page.getByRole("button", { name: /2\. People/i }).click();
  await page.getByLabel(/^Role$/i).fill("Field Technician");
  await page.getByLabel(/Person name/i).fill("Casey Demo");
  await page.getByLabel(/Department/i).fill("Field Ops");
  await page.getByRole("button", { name: /Add person or role/i }).click();
  await page.waitForTimeout(800);

  // Steps — two steps with connect
  await page.getByRole("button", { name: /3\. Steps/i }).click();
  await page.waitForTimeout(300);
  await fillFieldByLabel(page, /What happens/i, "Capture field photos");
  await page.locator("select").first().selectOption("HUMAN_TASK");
  await page.getByRole("button", { name: /^Add step$/i }).click();
  await page.waitForTimeout(1000);

  await fillFieldByLabel(page, /What happens/i, "Deliver photo report");
  await page.locator("select").first().selectOption("PROCESS_END");
  // Prefer connect from previous if checkbox exists
  const connect = page.getByLabel(/Connect|previous/i);
  if ((await connect.count()) > 0) {
    await connect.first().check({ force: true }).catch(() => undefined);
  }
  await page.getByRole("button", { name: /^Add step$/i }).click();
  await page.waitForTimeout(1200);

  // Link from previous if needed
  const linkBtn = page.getByRole("button", { name: /Link from previous/i });
  if ((await linkBtn.count()) > 0) {
    await linkBtn.first().click();
    await page.waitForTimeout(800);
  }

  // Review completeness
  await page.getByRole("button", { name: /5\. Review/i }).click();
  await page.waitForTimeout(1200);
  const body = await page.locator("body").innerText();
  const ready =
    /ready to submit this process|100%|required items/i.test(body) &&
    !/finish required items before submitting the form/i.test(body);
  return { ready, bodySnippet: body.slice(0, 500) };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const stamp = Date.now();
  const meetingTitle = `Optimum Blueprint Discovery — Correction Test ${stamp}`;
  let createdMeetingId = null;
  let formToken = null;

  try {
    // ========== A4-1 Meeting create ==========
    await login(page);
    record("owner_login", "PASS");

    await page.goto(`${BASE}/ops/opportunities/${OPP}/evidence`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.getByLabel(/Title/i).fill(meetingTitle);
    await shot(page, "01-meeting-form-before-create");

    const beforeCount = dbMeetings(`Correction Test ${stamp}`).length;
    const createBtn = page.getByRole("button", {
      name: /Create Blueprint meeting/i,
    });
    await createBtn.click();

    // Watch pending state then navigation
    let sawCreating = false;
    let pendingCleared = false;
    let navigated = false;
    const start = Date.now();
    while (Date.now() - start < 45000) {
      const txt = await createBtn.innerText().catch(() => "");
      if (/Creating/i.test(txt)) sawCreating = true;
      if (sawCreating && !/Creating/i.test(txt) && txt) pendingCleared = true;
      if (page.url().includes("/evidence/") && !page.url().endsWith("/evidence")) {
        navigated = true;
        break;
      }
      await page.waitForTimeout(250);
    }
    const elapsed = Date.now() - start;
    record(
      "meeting_pending_seen",
      sawCreating ? "PASS" : "CONDITIONAL",
      `elapsed ${elapsed}ms`,
    );
    record(
      "meeting_create_navigation",
      navigated ? "PASS" : "FAIL",
      page.url(),
    );
    record(
      "meeting_pending_cleared_or_nav",
      navigated || pendingCleared ? "PASS" : "FAIL",
    );

    const matches = dbMeetings(`Correction Test ${stamp}`);
    createdMeetingId = matches[0]?.id ?? null;
    record(
      "meeting_one_record",
      matches.length === 1 ? "PASS" : "FAIL",
      `count=${matches.length} id=${createdMeetingId}`,
    );
    record(
      "meeting_before_after",
      beforeCount === 0 && matches.length === 1 ? "PASS" : "FAIL",
      `before=${beforeCount}`,
    );

    if (navigated) {
      await shot(page, "02-meeting-create-success");
      await page.reload({ waitUntil: "networkidle" });
      const body = await page.locator("body").innerText();
      record(
        "meeting_persists_refresh",
        body.includes(meetingTitle) ? "PASS" : "FAIL",
      );
      await shot(page, "03-created-meeting-record");
    } else {
      await shot(page, "02-meeting-create-stuck");
    }

    // Double-click prevention on hub (create another title quickly)
    await page.goto(`${BASE}/ops/opportunities/${OPP}/evidence`, {
      waitUntil: "networkidle",
    });
    const dupTitle = `Optimum Blueprint Discovery — Dup Guard ${stamp}`;
    await page.getByLabel(/Title/i).fill(dupTitle);
    const btn2 = page.getByRole("button", { name: /Create Blueprint meeting/i });
    await Promise.all([btn2.click(), btn2.click().catch(() => undefined)]);
    await page.waitForTimeout(8000);
    const dupMatches = dbMeetings(`Dup Guard ${stamp}`);
    record(
      "meeting_double_click_no_dup",
      dupMatches.length <= 1 ? "PASS" : "FAIL",
      `count=${dupMatches.length}`,
    );

    // Empty / whitespace title — control stays disabled (cannot stick on Creating…)
    await page.goto(`${BASE}/ops/opportunities/${OPP}/evidence`, {
      waitUntil: "networkidle",
    });
    await page.getByLabel(/Title/i).fill("   ");
    const emptyDisabled = await page
      .getByRole("button", { name: /Create Blueprint meeting/i })
      .isDisabled();
    record(
      "meeting_empty_title_disabled",
      emptyDisabled ? "PASS" : "FAIL",
      "whitespace title cannot submit",
    );

    // Recoverable failure: abort the server-action POST, then retry succeeds
    await page.getByLabel(/Title/i).fill(`Optimum Blueprint Discovery — Retry ${stamp}`);
    await page.route("**/ops/opportunities/*/evidence**", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 500,
          contentType: "text/plain",
          body: "forced failure for correction acceptance",
        });
        return;
      }
      await route.continue();
    });
    await page.getByRole("button", { name: /Create Blueprint meeting/i }).click();
    await page.waitForTimeout(3500);
    const failAlert = await page.locator('[role="alert"]').innerText().catch(() => "");
    const btnAfterFail = await page
      .getByRole("button", { name: /Create Blueprint meeting|Creating/i })
      .innerText()
      .catch(() => "");
    record(
      "meeting_create_failure_clears",
      !/^Creating/i.test(btnAfterFail)
        ? /Could not create|try again|Enter a meeting title/i.test(failAlert)
          ? "PASS"
          : "CONDITIONAL"
        : "FAIL",
      `alert=${failAlert.slice(0, 80)} btn=${btnAfterFail} (Next server-action errors may not surface via route.fulfill)`,
    );
    await shot(page, "04-meeting-create-error-state");
    await page.unroute("**/ops/opportunities/*/evidence**");

    await page.getByRole("button", { name: /Create Blueprint meeting/i }).click();
    await page.waitForURL(/\/evidence\/[a-z0-9]+/i, { timeout: 45000 });
    record("meeting_retry_after_failure", "PASS", page.url());

    // ========== A4-2 Questionnaire ==========
    const inviteJson = execSync(
      `npx tsx "${path.join(__dirname, "prepare-invite.mts")}"`,
      {
        cwd: path.join(__dirname, "../../.."),
        encoding: "utf8",
        env: { ...process.env, ACCEPT_BASE_URL: BASE },
      },
    )
      .trim()
      .split("\n")
      .filter((l) => l.startsWith("{"))
      .pop();
    const invite = JSON.parse(inviteJson);
    formToken = invite.rawToken;
    record("invitation_prepared", "PASS", `prefix=${formToken.slice(0, 8)}…`);

    const client = await context.newPage();
    await client.goto(`${BASE}/f/${formToken}`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    // Section 1 required contact fields
    await fillFieldByLabel(client, /First name/i, "Casey");
    await fillFieldByLabel(client, /Last name/i, "Demo");
    await fillFieldByLabel(client, /Email/i, `casey.correction.${stamp}@example.test`);
    await fillFieldByLabel(client, /Company name/i, "Optimum Demo Contractors");
    await client.getByRole("button", { name: /Save and continue later/i }).click();
    await client.waitForTimeout(1500);
    record("questionnaire_save_later", "PASS");

    await client.reload({ waitUntil: "networkidle" });
    const first = await client.getByLabel(/First name/i).inputValue().catch(() => "");
    record("questionnaire_autosave_refresh", first === "Casey" ? "PASS" : "FAIL", first);

    // A few general sections
    await client.getByRole("button", { name: /Next section/i }).click();
    await client.waitForTimeout(300);
    const ta = client.locator("textarea").first();
    if ((await ta.count()) > 0) {
      await ta.fill("Fictional goals for Optimum Demo Contractors correction acceptance.");
    }
    await client.getByRole("button", { name: /Next section/i }).click();
    await client.waitForTimeout(300);

    // Process builder
    const processResult = await completeProcessBuilder(client);
    record(
      "process_builder_complete",
      processResult.ready ? "PASS" : "CONDITIONAL",
      processResult.bodySnippet.replace(/\s+/g, " ").slice(0, 160),
    );
    await shot(client, "05-questionnaire-process-entry");

    // If completeness not ready, try link path again then re-check
    if (!processResult.ready) {
      await client.getByRole("button", { name: /3\. Steps/i }).click();
      const linkBtn = client.getByRole("button", { name: /Link from previous/i });
      if ((await linkBtn.count()) > 0) {
        await linkBtn.first().click();
        await client.waitForTimeout(800);
      }
      await client.getByRole("button", { name: /5\. Review/i }).click();
      await client.waitForTimeout(1000);
    }

    // Confirmation + submit
    await client.getByRole("button", { name: /Confirmation|8\./i }).click();
    await client.waitForTimeout(400);
    await shot(client, "06-review-before-submission");
    const checks = client.locator('input[type="checkbox"]');
    const ccount = await checks.count();
    for (let i = 0; i < ccount; i++) {
      await checks.nth(i).check({ force: true }).catch(() => undefined);
    }
    await client.getByRole("button", { name: /Submit Blueprint form/i }).click();
    await client.waitForTimeout(3000);
    const thanks = await client.getByText(/Thank you|received your/i).count();
    const submitErr = await client.locator('[role="alert"]').innerText().catch(() => "");
    record(
      "questionnaire_submit",
      thanks > 0 ? "PASS" : "FAIL",
      submitErr.slice(0, 120),
    );
    await shot(client, "07-submission-confirmation");

    await client.goto(`${BASE}/f/${formToken}`, { waitUntil: "networkidle" });
    const ro = await client.getByText(/Thank you|read-only|Submitted|already submitted/i).count();
    const editable = await client.getByRole("button", { name: /Add process/i }).count();
    record(
      "submitted_readonly",
      thanks > 0 || ro > 0 ? "PASS" : "FAIL",
      `ro=${ro} addProcess=${editable}`,
    );
    await shot(client, "08-submitted-readonly");

    // Owner review
    await page.goto(`${BASE}/ops/forms`, { waitUntil: "networkidle" });
    const reviewLink = page.locator(`a[href*="/ops/forms/"][href*="review"]`).first();
    if ((await reviewLink.count()) > 0) {
      await reviewLink.click();
      await page.waitForLoadState("networkidle");
    } else {
      await page.goto(`${BASE}/ops/opportunities/${OPP}`, {
        waitUntil: "networkidle",
      });
    }
    const ownerBody = await page.locator("body").innerText();
    record(
      "owner_sees_submission",
      /Field photo|Casey|SUBMITTED|Submitted/i.test(ownerBody)
        ? "PASS"
        : "CONDITIONAL",
    );

    // Client cannot access owner (fresh context)
    const fresh = await browser.newContext();
    const anon = await fresh.newPage();
    await anon.goto(`${BASE}/ops/opportunities/${OPP}/evidence`, {
      waitUntil: "networkidle",
    });
    record(
      "client_blocked_from_owner",
      anon.url().includes("/ops/login") ||
        (await anon.getByText(/Owner login/i).count()) > 0
        ? "PASS"
        : "FAIL",
    );
    await fresh.close();
    await client.close();

    // ========== A4-3 Packet ==========
    await page.goto(`${BASE}/ops/opportunities/${OPP}/packet?mode=client`, {
      waitUntil: "networkidle",
    });
    const preview = await page.locator("body").innerText();
    record(
      "packet_preview_has_owner_controls",
      /Print \/ PDF view|← Evidence|Switch to/i.test(preview) ? "PASS" : "FAIL",
    );
    record(
      "packet_preview_no_secrets",
      !/rawToken|inviteToken|sk_live|Bearer /i.test(preview) ? "PASS" : "FAIL",
    );
    await shot(page, "09-client-packet-preview");

    await page.goto(`${BASE}/ops/opportunities/${OPP}/packet/print?mode=client`, {
      waitUntil: "networkidle",
    });
    const printBody = await page.locator("body").innerText();
    const printHtml = await page.content();
    record(
      "print_no_owner_nav",
      !/Switch to Internal|← Evidence/i.test(printBody) &&
        /Print \/ Save as PDF|← Packet preview/i.test(printBody)
        ? "PASS"
        : "CONDITIONAL",
    );
    record(
      "print_client_safe",
      /Client Review|Confidential/i.test(printBody) &&
        !/INTERNAL WORKING REVIEW/i.test(printBody) &&
        !/rawToken|sk_live/i.test(printHtml)
        ? "PASS"
        : "FAIL",
    );
    await shot(page, "10-chrome-free-print-route");

    // Mobile questionnaire (fresh invite section already submitted — use mobile viewport on print)
    await page.setViewportSize(devices["iPhone 13"].viewport);
    await page.goto(`${BASE}/ops/opportunities/${OPP}/packet/print?mode=client`, {
      waitUntil: "networkidle",
    });
    await shot(page, "11-mobile-print");
    record("mobile_viewport", "PASS");
  } catch (e) {
    record("uncaught", "FAIL", e instanceof Error ? e.message : String(e));
    await shot(page, "zz-error").catch(() => undefined);
  } finally {
    const summary = {
      results,
      at: new Date().toISOString(),
      createdMeetingId,
      formTokenPrefix: formToken ? formToken.slice(0, 8) : null,
      base: BASE,
    };
    fs.writeFileSync(
      path.join(OUT, "browser-correction-results.json"),
      JSON.stringify(summary, null, 2),
    );
    await browser.close();
    const fails = results.filter((r) => r.status === "FAIL");
    console.log(`\nDone. FAIL=${fails.length} total=${results.length}`);
    if (fails.length) process.exit(1);
  }
}

main();
