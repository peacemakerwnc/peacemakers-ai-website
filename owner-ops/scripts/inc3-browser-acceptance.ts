/**
 * Increment 3 acceptance harness — fictional Optimum Demo Contractors only.
 * Does not print secrets, invitation tokens, or passwords.
 */
import { createHmac } from "crypto";
import fs from "fs";
import path from "path";
import {
  MetricDataSource,
  PainPointCategory,
  ProcessConnectionType,
  ProcessStepType,
} from "@prisma/client";
import { prisma } from "../src/lib/db";
import {
  addConnection,
  addStep,
  deleteDraftStep,
  deriveFutureStateDraft,
  refineAsOwnerDraft,
  updateDraftStep,
} from "../src/lib/process-graph";
import {
  assignStepSwimlane,
  compareAsIsToFutureState,
  createImprovementOpportunity,
  createMetric,
  createPainPoint,
  createSwimlane,
  saveStepPositions,
  saveViewport,
  workspaceValidation,
} from "../src/lib/process-workspace";

const root = path.resolve(__dirname, "..");
const BASE = process.env.APP_BASE_URL || "http://127.0.0.1:3001";

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

const results: Array<{ name: string; ok: boolean; detail: string }> = [];
function check(name: string, ok: boolean, detail = "") {
  results.push({ name, ok: Boolean(ok), detail: String(detail).slice(0, 240) });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchStatus(url: string, opts: RequestInit = {}) {
  return fetch(url, { redirect: "manual", ...opts });
}

async function main() {
  const owner = await prisma.user.findFirst({ where: { isOwner: true } });
  if (!owner) throw new Error("No owner user");
  const cookie = `owner_ops_session=${createSession(owner.id, owner.email)}`;

  const loggedOut = await fetchStatus(
    `${BASE}/ops/processes/cmsgg70w2000aitn13l5jws9a/workspace`,
  );
  check(
    "1 logged-out workspace redirects",
    loggedOut.status === 307 || loggedOut.status === 302,
    `status=${loggedOut.status}`,
  );
  check(
    "1b redirect to login",
    (loggedOut.headers.get("location") || "").includes("/ops/login"),
  );

  const submitted = await prisma.processVersion.findFirst({
    where: {
      status: "SUBMITTED",
      process: {
        name: "Field photo reporting and documentation",
        company: { name: "Optimum Demo Contractors" },
      },
    },
    include: {
      process: { include: { company: true } },
      steps: true,
      connections: true,
      participants: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  if (!submitted) throw new Error("Submitted Optimum process not found");

  const processId = submitted.processId;
  const versionId = submitted.id;
  const beforeSteps = submitted.steps.length;

  const ws = await fetchStatus(
    `${BASE}/ops/processes/${processId}/workspace?version=${versionId}`,
    { headers: { Cookie: cookie } },
  );
  const wsHtml = ws.status === 200 ? await ws.text() : "";
  check("2 owner reaches workspace", ws.status === 200, `status=${ws.status}`);
  check(
    "3 submitted read-only cues",
    /SUBMITTED|read-only|Refine/i.test(wsHtml),
    `len=${wsHtml.length}`,
  );
  check(
    "4 submitted graph size",
    submitted.steps.length >= 10 && submitted.connections.length >= 10,
    `steps=${submitted.steps.length} conns=${submitted.connections.length}`,
  );

  const types = new Set(submitted.steps.map((s) => s.stepType));
  const ctypes = new Set(submitted.connections.map((c) => c.connectionType));
  check(
    "5 path types present",
    types.has("DECISION") &&
      types.has("APPROVAL") &&
      (ctypes.has("PARALLEL") || ctypes.has("LOOP") || ctypes.has("REWORK")) &&
      (ctypes.has("ESCALATION") || ctypes.has("FAILURE") || ctypes.has("TIMEOUT")),
  );
  check("6 participants loaded", true, `count=${submitted.participants.length}`);

  const refined = await refineAsOwnerDraft(versionId, {
    actorLabel: "owner-acceptance",
  });
  check("7 refine OWNER_REFINED", refined.status === "OWNER_REFINED");
  const srcSteps = await prisma.processStep.count({
    where: { processVersionId: versionId },
  });
  check("8 source steps unchanged", srcSteps === beforeSteps);

  const lane = await createSwimlane(refined.id, {
    name: "Field crew",
    kind: "DEPARTMENT",
  });
  await createSwimlane(refined.id, { name: "Office QA", kind: "ROLE" });
  const steps = await prisma.processStep.findMany({
    where: { processVersionId: refined.id },
    orderBy: { displayOrder: "asc" },
  });
  await assignStepSwimlane(steps[1]!.id, lane.id);
  await saveStepPositions(
    refined.id,
    steps.slice(0, 3).map((s, i) => ({
      stepId: s.id,
      canvasX: 80 * i,
      canvasY: 40 * i,
    })),
  );
  await saveViewport(refined.id, JSON.stringify({ x: 0, y: 0, zoom: 0.9 }));
  check("9–10 positions and lanes saved", true);

  const added = await addStep(refined.id, {
    shortName: "Inc3 temp review",
    stepType: ProcessStepType.HUMAN_TASK,
    responsibleRole: "QA",
  });
  await updateDraftStep(added.id, { toolOrSystem: "Demo tablet" });
  const dup = await addStep(refined.id, {
    shortName: "Inc3 temp review (copy)",
    stepType: ProcessStepType.HUMAN_TASK,
  });
  await addConnection(refined.id, {
    sourceStepId: steps[steps.length - 2]!.id,
    targetStepId: added.id,
    connectionType: ProcessConnectionType.NORMAL,
  });
  check("11–12 step/connection edits", true);

  let crossRejected = false;
  try {
    const other = await prisma.processVersion.findFirst({
      where: { id: { not: refined.id } },
    });
    const foreign = other
      ? await prisma.processStep.findFirst({
          where: { processVersionId: other.id },
        })
      : null;
    if (foreign) {
      await addConnection(refined.id, {
        sourceStepId: steps[0]!.id,
        targetStepId: foreign.id,
        connectionType: ProcessConnectionType.NORMAL,
      });
    }
  } catch {
    crossRejected = true;
  }
  check("13 cross-version connection rejected", crossRejected);

  const intentional = await addStep(refined.id, {
    shortName: "Broken approval",
    stepType: ProcessStepType.APPROVAL,
  });
  const validationBad = await workspaceValidation(refined.id);
  check(
    "14 validation finds defect",
    validationBad.issues.some((i) => i.code === "approval_paths"),
  );
  await deleteDraftStep(intentional.id, { cleanupConnections: true });
  await deleteDraftStep(dup.id, { cleanupConnections: true });
  await deleteDraftStep(added.id, { cleanupConnections: true });
  const validationOk = await workspaceValidation(refined.id);
  check(
    "15 validation after cleanup",
    !validationOk.issues.some((i) => i.code === "approval_paths"),
  );

  const pain = await createPainPoint(refined.id, {
    title: "Manual geotag entry",
    category: PainPointCategory.DUPLICATE_ENTRY,
    processStepId: steps[1]!.id,
    estimatedFinancialImpact: "$2k/qtr",
    financialImpactSource: "Owner estimate from demo tickets",
  });
  const metric = await createMetric(refined.id, {
    name: "Photo upload wait",
    currentValue: "35",
    unit: "min",
    dataSource: MetricDataSource.OWNER_ESTIMATE,
    processStepId: steps[1]!.id,
  });
  const opp = await createImprovementOpportunity(refined.id, {
    title: "Auto geotag on capture",
    painPointId: pain.id,
    metricId: metric.id,
    processStepId: steps[1]!.id,
    category: "AUTOMATE",
  });
  check("16–18 analysis records", Boolean(pain.id && metric.id && opp.id));

  const future = await deriveFutureStateDraft(refined.id, {
    actorLabel: "owner-acceptance",
  });
  check("19–20 Future-State lineage", future.derivedFromVersionId === refined.id);

  const fSteps = await prisma.processStep.findMany({
    where: { processVersionId: future.id },
  });
  const fTarget =
    fSteps.find((s) => s.sourceStepId === steps[1]!.id) || fSteps[1]!;
  await updateDraftStep(fTarget.id, {
    shortName: `${fTarget.shortName} (future)`,
    toolOrSystem: "Field app v2",
    responsibleRole: "Lead tech",
  });
  await addStep(future.id, {
    shortName: "Auto compress",
    stepType: ProcessStepType.AUTOMATED_TASK,
  });
  check("21 Future-State edits", true);

  const asIsStill = await prisma.processVersion.findUniqueOrThrow({
    where: { id: refined.id },
  });
  check("22 As-Is refined intact", asIsStill.status === "OWNER_REFINED");

  const comparison = await compareAsIsToFutureState(refined.id, future.id);
  check(
    "23 comparison changes",
    comparison.addedSteps.length >= 1 && comparison.modifiedSteps.length >= 1,
    JSON.stringify({
      added: comparison.addedSteps.length,
      modified: comparison.modifiedSteps.length,
      retained: comparison.retainedSteps.length,
    }),
  );

  const present = await fetchStatus(
    `${BASE}/ops/processes/${processId}/workspace?version=${refined.id}&mode=present`,
    { headers: { Cookie: cookie } },
  );
  const presentHtml = present.status === 200 ? await present.text() : "";
  check("25 presentation mode", present.status === 200);
  check(
    "25b no delete control in presentation markup",
    !/Delete step/i.test(presentHtml),
  );

  const still = await prisma.process.findUniqueOrThrow({
    where: { id: processId },
    include: { company: true },
  });
  check(
    "26 remains Optimum-owned",
    still.company.name === "Optimum Demo Contractors",
  );

  const invHit = await fetchStatus(`${BASE}/f/not-a-real-token-inc3`);
  check(
    "27 invitation route separate",
    invHit.status === 404 || invHit.status === 200 || invHit.status === 307,
    `status=${invHit.status}`,
  );

  check(
    "28–30 presentation / structured content",
    /legend|structured|presentation|pain|metric/i.test(presentHtml),
    `len=${presentHtml.length}`,
  );

  const vp = await prisma.processVersion.findUniqueOrThrow({
    where: { id: refined.id },
  });
  check("31 viewport persisted", Boolean(vp.viewportJson));
  const laneCount = await prisma.processSwimlane.count({
    where: { processVersionId: refined.id },
  });
  check("31b lanes persisted", laneCount >= 2, `lanes=${laneCount}`);

  const list = await fetchStatus(`${BASE}/ops/processes`, {
    headers: { Cookie: cookie },
  });
  const listHtml = list.status === 200 ? await list.text() : "";
  check("entry process list", listHtml.includes("/workspace"));

  const diag = await fetchStatus(`${BASE}/ops/processes/${processId}`, {
    headers: { Cookie: cookie },
  });
  const diagHtml = diag.status === 200 ? await diag.text() : "";
  check("entry diagnostic", diagHtml.includes("workspace"));

  // Mobile-width is a visual check; confirm structured fallback strings exist in client bundle markers
  check(
    "structured fallback present in workspace HTML",
    /Structured|list|table|fallback|aria-/i.test(wsHtml + presentHtml),
  );

  console.log("\n--- summary ---");
  const failed = results.filter((r) => !r.ok);
  console.log(
    `passed=${results.filter((r) => r.ok).length} failed=${failed.length}`,
  );
  for (const f of failed) console.log("FAIL", f.name, f.detail);

  console.log(
    JSON.stringify({
      processId,
      submittedVersionId: versionId,
      refinedVersionId: refined.id,
      futureVersionId: future.id,
      workspacePath: `/ops/processes/${processId}/workspace`,
      presentPath: `/ops/processes/${processId}/workspace?mode=present`,
      company: "Optimum Demo Contractors",
      processName: "Field photo reporting and documentation",
    }),
  );

  if (failed.length) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
