import { DEFAULT_RATES, SAMPLES, prepareDocument, price } from "./engine.mjs";
import { buildPdf } from "./pdf.mjs";

const state = {
  sampleId: "storm",
  raw: "",
  local: {},
  redactedText: "",
  redactionCounts: {},
  held: 0,
  kind: null,
  lines: [],
  included: [],
  rates: structuredClone(DEFAULT_RATES.storm),
  priced: [],
  total: 0,
  mode: "deterministic",
  warning: "",
  manualTotal: 0,
  manualMinutes: 0,
  assistedMinutes: 0,
  manualNote: "",
  company: "",
  outputTitle: "",
  log: [],
};

const els = {
  source: document.querySelector("#source"),
  redacted: document.querySelector("#redacted"),
  redactionNote: document.querySelector("#redaction-note"),
  sourceMeta: document.querySelector("#source-meta"),
  rates: document.querySelector("#rates"),
  lines: document.querySelector("#lines"),
  warning: document.querySelector("#warning"),
  mode: document.querySelector("#mode"),
  manualTotal: document.querySelector("#manual-total"),
  aiTotal: document.querySelector("#ai-total"),
  manualTime: document.querySelector("#manual-time"),
  aiTime: document.querySelector("#ai-time"),
  gap: document.querySelector("#gap"),
  why: document.querySelector("#why"),
  banner: document.querySelector("#banner"),
  approve: document.querySelector("#approve"),
  reviewer: document.querySelector("#reviewer"),
  exportBtn: document.querySelector("#export"),
  localName: document.querySelector("#local-name"),
  localAddress: document.querySelector("#local-address"),
  log: document.querySelector("#log"),
};

function money(n) {
  return Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function stamp(event, detail) {
  state.log.push({
    at: new Date().toISOString(),
    event,
    detail,
  });
  els.log.innerHTML = "";
  for (const entry of state.log) {
    const item = document.createElement("li");
    item.textContent = `${entry.at.slice(11, 19)}  ${entry.event}  ${entry.detail}`;
    els.log.appendChild(item);
  }
}

function rateFields(kind) {
  if (kind === "storm") {
    return [
      ["mobilization", "Mobilization"],
      ["light", "Light debris, each"],
      ["moderate", "Moderate debris, each"],
      ["heavy", "Heavy debris, each"],
      ["disposalHeavy", "Disposal, each heavy structure"],
    ];
  }
  if (kind === "hvac") {
    return [
      ["CAP-455", "Capacitor 45/5"],
      ["CTR-2P", "Contactor"],
      ["DRN", "Drain clear"],
      ["FLT-20", "Media filter"],
      ["LBR", "Labor, per hour"],
      ["TRIP", "Diagnostic trip, before waiver"],
    ];
  }
  return [
    ["FLR", "Flooring upgrade, per sf"],
    ["QTZ", "Quartz upgrade, per sf"],
    ["LTG", "Dining light, each"],
  ];
}

function renderRates() {
  els.rates.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "rate-grid";
  for (const [key, label] of rateFields(state.kind)) {
    const row = document.createElement("label");
    row.className = "rate-row";
    row.append(document.createTextNode(label));
    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.01";
    input.value = String(state.rates[key] ?? 0);
    input.addEventListener("input", () => {
      state.rates[key] = Number(input.value);
      reprice(false);
      stamp("rates_edited", key);
    });
    row.appendChild(input);
    grid.appendChild(row);
  }
  els.rates.appendChild(grid);
}

function renderLines() {
  els.lines.innerHTML = "";
  if (!state.priced.length) {
    const empty = document.createElement("p");
    empty.className = "note";
    empty.textContent = "No priced lines yet.";
    els.lines.appendChild(empty);
    return;
  }
  for (const line of state.priced) {
    const row = document.createElement("div");
    row.className = "line";
    const left = document.createElement("div");
    left.textContent = `${line.label}`;
    const meta = document.createElement("span");
    meta.textContent = `  ${line.qty} × ${money(line.rate)}`;
    left.appendChild(meta);
    const right = document.createElement("strong");
    right.textContent = money(line.amount);
    row.append(left, right);
    els.lines.appendChild(row);
  }
}

function renderSummary() {
  els.manualTotal.textContent = money(state.manualTotal);
  els.aiTotal.textContent = money(state.total);
  els.manualTime.textContent = `Assumption: about ${state.manualMinutes} minutes by hand`;
  els.aiTime.textContent = `Assumption: about ${state.assistedMinutes} minutes to review`;
  const gap = Math.round((state.total - state.manualTotal) * 100) / 100;
  const direction = gap === 0 ? "The totals match." : gap < 0 ? `${money(Math.abs(gap))} under the office draft.` : `${money(gap)} over the office draft.`;
  els.gap.textContent = direction;
  els.why.textContent = state.manualNote;
  els.banner.textContent = `${state.company} · ${state.outputTitle}. Fictional sample. Sensitivity: ${state.sensitivity}.`;
  els.sourceMeta.textContent = state.sampleId ? "Loaded from a built-in sample." : "Loaded from an upload. The file was not saved.";
  els.redacted.textContent = state.redactedText;
  const counts = Object.entries(state.redactionCounts)
    .filter(([, n]) => n > 0)
    .map(([type, n]) => `${n} ${type}`)
    .join(", ");
  els.redactionNote.textContent = `${state.held} local contact field${state.held === 1 ? "" : "s"} held on this page. ${counts || "No additional PII patterns"} redacted from the text a model would see.`;
  els.warning.hidden = !state.warning;
  els.warning.textContent = state.warning;
  els.mode.textContent =
    state.mode === "model"
      ? "Last extraction: model, using the redacted text only. Prices still come from the rate card."
      : "Last extraction: deterministic. No model was called.";
  syncExport();
}

function syncExport() {
  const ready = els.approve.checked && els.reviewer.value.trim().length > 0 && state.priced.length > 0;
  els.exportBtn.disabled = !ready;
}

function reprice(resetApproval = true) {
  const result = price(state.kind, state.lines, state.rates);
  state.priced = result.lines;
  state.total = result.total;
  if (resetApproval && els.approve.checked) {
    els.approve.checked = false;
    stamp("approval_cleared", "totals changed");
  }
  renderLines();
  renderSummary();
}

function applyPrepared(raw, meta = {}) {
  const prepared = prepareDocument(raw);
  state.raw = raw;
  state.local = prepared.local;
  state.held = prepared.held;
  state.redactedText = prepared.redacted.text;
  state.redactionCounts = prepared.redacted.counts;
  state.kind = prepared.extraction.kind;
  state.lines = prepared.extraction.lines;
  state.included = prepared.extraction.included;
  state.warning = prepared.extraction.warning;
  state.mode = "deterministic";
  if (state.kind && DEFAULT_RATES[state.kind]) state.rates = structuredClone(DEFAULT_RATES[state.kind]);
  state.company = meta.company || state.company || "Uploaded document";
  state.outputTitle = meta.outputTitle || state.outputTitle || "Draft";
  state.manualTotal = meta.manualTotal ?? state.manualTotal ?? 0;
  state.manualMinutes = meta.manualMinutes ?? state.manualMinutes ?? 0;
  state.assistedMinutes = meta.assistedMinutes ?? state.assistedMinutes ?? 0;
  state.manualNote = meta.manualNote || state.manualNote || "No office-draft comparison is stored for an uploaded file.";
  state.sensitivity = meta.sensitivity || "Unknown until you classify it";
  els.source.value = raw;
  els.localName.value = prepared.local.homeowner || prepared.local.customer || prepared.local.buyer || "";
  els.localAddress.value = prepared.local.serviceAddress || "";
  els.approve.checked = false;
  renderRates();
  reprice(false);
  stamp("document_loaded", `${state.sampleId || "upload"} · local fields ${state.held} · redactions ${prepared.redacted.total}`);
}

function loadSample(id) {
  const sample = SAMPLES[id];
  state.sampleId = id;
  document.querySelectorAll(".sample").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.sample === id ? "true" : "false");
  });
  applyPrepared(sample.source, sample);
}

document.querySelectorAll(".sample").forEach((button) => {
  button.addEventListener("click", () => loadSample(button.dataset.sample));
});

els.source.addEventListener("change", () => {
  state.sampleId = "";
  applyPrepared(els.source.value, {
    company: "Uploaded document",
    outputTitle: "Draft from uploaded notes",
    manualTotal: 0,
    manualMinutes: 0,
    assistedMinutes: 0,
    manualNote: "An upload has no office-draft total until you type one into the conversation. This demo does not invent one.",
    sensitivity: "Classify it before you treat the upload as safe to send.",
  });
});

document.querySelector("#upload").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  state.sampleId = "";
  document.querySelectorAll(".sample").forEach((button) => button.setAttribute("aria-pressed", "false"));
  applyPrepared(text, {
    company: file.name.replace(/\.txt$/i, ""),
    outputTitle: "Draft from uploaded notes",
    manualTotal: 0,
    manualMinutes: 0,
    assistedMinutes: 0,
    manualNote: "An upload has no office-draft total. The comparison stays at zero rather than inventing a manual price.",
    sensitivity: "Classify it before you treat the upload as safe to send.",
  });
  stamp("upload_received", `${file.name} · ${file.size} bytes · contents not stored`);
});

document.querySelector("#reprice").addEventListener("click", () => {
  applyPrepared(els.source.value, {
    company: state.company,
    outputTitle: state.outputTitle,
    manualTotal: state.manualTotal,
    manualMinutes: state.manualMinutes,
    assistedMinutes: state.assistedMinutes,
    manualNote: state.manualNote,
    sensitivity: state.sensitivity,
  });
  stamp("repriced", "deterministic");
});

document.querySelector("#model").addEventListener("click", async () => {
  const prepared = prepareDocument(els.source.value);
  stamp("model_requested", `redactions ${prepared.redacted.total} · local fields ${prepared.held} held back`);
  try {
    const response = await fetch("/api/practice-extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: prepared.redacted.text }),
    });
    const payload = await response.json();
    if (!response.ok || payload.mode !== "model" || !payload.extraction) {
      state.mode = "deterministic";
      els.mode.textContent = payload.note || payload.error || "No model is configured. Deterministic extraction is still in use.";
      stamp("model_skipped", payload.note || payload.error || "no model");
      return;
    }
    state.mode = "model";
    state.kind = payload.extraction.kind;
    state.lines = payload.extraction.lines || [];
    state.included = payload.extraction.included || [];
    state.warning = payload.extraction.warning || "";
    if (state.kind && DEFAULT_RATES[state.kind]) state.rates = structuredClone(DEFAULT_RATES[state.kind]);
    renderRates();
    reprice(false);
    stamp("model_completed", payload.model || "model");
  } catch (error) {
    state.mode = "deterministic";
    els.mode.textContent = "The model call did not complete. Deterministic extraction is still in use. No document was stored.";
    stamp("model_failed", "call did not complete");
  }
});

els.approve.addEventListener("change", () => {
  stamp(els.approve.checked ? "approval_granted" : "approval_revoked", els.reviewer.value.trim() || "reviewer not named yet");
  syncExport();
});
els.reviewer.addEventListener("input", syncExport);

els.exportBtn.addEventListener("click", () => {
  if (els.exportBtn.disabled) return;
  const name = els.localName.value.trim();
  const address = els.localAddress.value.trim();
  const bytes = buildPdf({
    company: state.company,
    outputTitle: state.outputTitle,
    audienceLine: name ? `Prepared for ${name}` : "Prepared for the customer on file",
    localLine: address ? `Location: ${address}` : "Location printed only from the local field",
    approver: els.reviewer.value.trim(),
    lines: state.priced,
    included: state.included,
    total: state.total,
    manualTotal: state.manualTotal,
    note: state.manualNote,
    footer: `Audit events this session: ${state.log.length}. Session memory only.`,
  });
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.sampleId || "upload"}-approved-draft.pdf`;
  link.click();
  URL.revokeObjectURL(url);
  stamp("pdf_exported", `total ${state.total} · reviewer ${els.reviewer.value.trim()} · document body not logged`);
});

document.querySelector("#clear").addEventListener("click", () => {
  state.log = [];
  els.log.innerHTML = "";
  els.reviewer.value = "";
  els.approve.checked = false;
  loadSample("storm");
  stamp("session_cleared", "previous document dropped from the page");
});

const initial = (location.hash || "").replace("#", "");
loadSample(SAMPLES[initial] ? initial : "storm");
if (initial === "approved") {
  loadSample("storm");
  els.reviewer.value = "JF";
  els.approve.checked = true;
  stamp("approval_granted", "JF");
  syncExport();
}
