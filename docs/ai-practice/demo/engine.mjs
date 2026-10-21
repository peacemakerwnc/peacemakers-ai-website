/**
 * Deterministic extraction, PII redaction, and pricing for the assessment demo.
 * Sample companies, people, and prices are fictional.
 */

export const SAMPLES = {
  storm: {
    id: "storm",
    kind: "storm",
    industry: "Commercial contractor",
    company: "Cape Fear Drainage Co.",
    documentTitle: "Field inspection report",
    outputTitle: "Maintenance proposal",
    audience: "Marsh Hen HOA",
    manualMinutes: 55,
    assistedMinutes: 6,
    manualTotal: 3480,
    manualNote:
      "The office draft priced every structure as heavy and added a second mobilization. The rate card prices the debris class written on the report.",
    sensitivity: "Moderate",
    source: `SAMPLE-ID: storm
CAPE FEAR DRAINAGE CO. — FIELD INSPECTION
Job: MH-HOA-1844
Date: 12 October 2026
Crew lead: Alex Ramirez

---LOCAL-ONLY---
homeowner: Dana Ellison
phone: (910) 555-0148
email: dana.ellison@example.test
serviceAddress: 418 Marsh Hen Lane, Wilmington, NC 28403
account: Acct 0049182736
---END LOCAL-ONLY---

Inspector notes. Do not price from the narrative. Price from STRUCTURES.
The north inlet was packed. The south inlet was leaves and silt. The manhole was light. Pipe P-9 was holding water. Clubhouse inlet was packed to the throat. Office draft on the clipboard: $3,480.

STRUCTURES
CB-12 | Curb inlet, north lot, about 70 percent blocked | 1 | heavy
CB-14 | Curb inlet, south lot, leaves and silt | 1 | moderate
MH-3 | Manhole at the green, lid seated, light sediment | 1 | light
P-9 | 36-foot pipe run, standing water and sediment | 1 | heavy
CB-18 | Curb inlet, clubhouse drive, debris to the throat | 1 | heavy
`,
  },
  hvac: {
    id: "hvac",
    kind: "hvac",
    industry: "Home services",
    company: "Oak Island Comfort Co.",
    documentTitle: "Tech notes",
    outputTitle: "Service quote",
    audience: "the homeowner",
    manualMinutes: 35,
    assistedMinutes: 5,
    manualTotal: 890,
    manualNote:
      "The number on the truck was a round figure written before the drain and the filter were on the notes. The rate card prices the lines that are actually written down. The trip charge comes off when a repair is approved.",
    sensitivity: "Moderate",
    source: `SAMPLE-ID: hvac
OAK ISLAND COMFORT CO. — TECH NOTES
Ticket: SVC-2291
Date: 14 October 2026
Tech: Jordan Blake

---LOCAL-ONLY---
customer: Sam Patel
phone: (910) 555-0172
email: sam.patel@example.test
serviceAddress: 88 Dune Grass Road, Oak Island, NC 28465
---END LOCAL-ONLY---

System: 2014 split heat pump, downstairs. No cool. Capacitor bulged. Contactor pitted. Drain slow. Filter collapsed. Told the customer "around $890" from the truck before writing the drain and the filter.

REPAIRS
CAP-455 | Run capacitor 45/5 | 1 | ea
CTR-2P | 2-pole contactor | 1 | ea
DRN | Condensate drain clear | 1 | ea
FLT-20 | 20x25 media filter | 1 | ea
LBR | Repair labor | 1.25 | hr
TRIP | Diagnostic trip | 1 | ea
`,
  },
  builder: {
    id: "builder",
    kind: "selections",
    industry: "Home builder",
    company: "Harborline Homes",
    documentTitle: "Handwritten selections",
    outputTitle: "Client selections packet",
    audience: "the buyer and the architectural review",
    manualMinutes: 70,
    assistedMinutes: 12,
    manualTotal: 14180,
    manualNote:
      "The sticky note used 2,210 square feet of flooring. The worksheet says 2,140. The packet uses the worksheet quantity until you change it.",
    sensitivity: "Moderate",
    source: `SAMPLE-ID: builder
HARBORLINE HOMES — SELECTIONS WORKSHEET
Community: Marshlight (fictional)
Lot: 14
Plan: Birchwood
Date: 9 October 2026
Designer notes, handwriting cleaned up for this sample.

---LOCAL-ONLY---
buyer: Riley Chen
phone: (910) 555-0194
email: riley.chen@example.test
serviceAddress: Lot 14, Marshlight, Leland, NC 28451
---END LOCAL-ONLY---

Sticky note total in the file: $14,180. That math used 2,210 sf. Worksheet quantity is below.

UPGRADES
FLR | White oak LVP, over the flooring allowance | 2140 | sf
QTZ | Quartz, level 2, over the counter allowance | 68 | sf
LTG | Dining linear fixture upgrade | 1 | ea

INCLUDED
Cabinets | Maple shaker, within the cabinet allowance
Hardware | Matte black pulls, included
Exterior paint | Sherwin-Williams Agreeable Gray
Brick | Standard range, within the allowance
Plumbing finish | Polished chrome
Appliances | Package B, within the allowance
`,
  },
};

export const DEFAULT_RATES = {
  storm: {
    mobilization: 385,
    disposalHeavy: 90,
    light: 225,
    moderate: 410,
    heavy: 640,
  },
  hvac: {
    "CAP-455": 186,
    "CTR-2P": 214,
    DRN: 139,
    "FLT-20": 42,
    LBR: 128,
    TRIP: 89,
    waiveTripIfRepair: true,
  },
  selections: {
    FLR: 4.8,
    QTZ: 42,
    LTG: 640,
  },
};

const REDACTORS = [
  {
    type: "ssn",
    re: /\b\d{3}-\d{2}-\d{4}\b/g,
  },
  {
    type: "email",
    re: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
  {
    type: "phone",
    re: /\b(?:\+1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g,
  },
  {
    type: "account",
    re: /\b(?:acct|account|routing)\b[:\s#-]*\d[\d\s-]{3,}\b/gi,
  },
];

export function splitLocal(raw) {
  const match = raw.match(/---LOCAL-ONLY---([\s\S]*?)---END LOCAL-ONLY---/);
  const local = {};
  if (match) {
    for (const line of match[1].split("\n")) {
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key && value) local[key] = value;
    }
  }
  const body = raw.replace(/---LOCAL-ONLY---[\s\S]*?---END LOCAL-ONLY---/g, "[Local contact block removed before extraction]\n");
  return { body, local, held: Object.keys(local).length };
}

export function redact(text) {
  let out = text;
  const counts = {};
  for (const rule of REDACTORS) {
    const found = out.match(rule.re);
    counts[rule.type] = found ? found.length : 0;
    out = out.replace(rule.re, `[REDACTED:${rule.type}]`);
  }
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return { text: out, counts, total };
}

function section(text, name) {
  const re = new RegExp(`^${name}\\s*$`, "m");
  const start = text.search(re);
  if (start === -1) return "";
  const rest = text.slice(start + name.length);
  const next = rest.search(/\n[A-Z][A-Z ]{2,}\n/);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function parseTable(block) {
  const rows = [];
  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split("|").map((part) => part.trim());
    if (parts.length < 4) continue;
    const qty = Number(parts[2]);
    if (!Number.isFinite(qty)) continue;
    rows.push({
      code: parts[0],
      label: parts[1],
      qty,
      unit: parts[3].toLowerCase(),
      klass: (parts[4] || "").toLowerCase(),
    });
  }
  return rows;
}

export function detectKind(text) {
  if (/^STRUCTURES\s*$/m.test(text)) return "storm";
  if (/^REPAIRS\s*$/m.test(text)) return "hvac";
  if (/^UPGRADES\s*$/m.test(text)) return "selections";
  if (/SAMPLE-ID:\s*storm/i.test(text)) return "storm";
  if (/SAMPLE-ID:\s*hvac/i.test(text)) return "hvac";
  if (/SAMPLE-ID:\s*builder/i.test(text)) return "selections";
  return null;
}

export function extractDeterministic(text) {
  const kind = detectKind(text);
  if (!kind) {
    return {
      kind: null,
      lines: [],
      included: [],
      warning:
        "This file does not match a sample pattern. Nothing was priced. Use a sample, add a STRUCTURES, REPAIRS, or UPGRADES table, or run the local server with an API key.",
    };
  }
  if (kind === "storm") {
    const lines = parseTable(section(text, "STRUCTURES")).map((row) => ({
      code: row.code,
      label: row.label,
      qty: row.qty,
      unit: "ea",
      klass: row.unit,
    }));
    return { kind, lines, included: [], warning: lines.length ? "" : "No structure rows found." };
  }
  if (kind === "hvac") {
    const lines = parseTable(section(text, "REPAIRS")).map((row) => ({
      code: row.code,
      label: row.label,
      qty: row.qty,
      unit: row.unit,
      klass: "",
    }));
    return { kind, lines, included: [], warning: lines.length ? "" : "No repair rows found." };
  }
  const lines = parseTable(section(text, "UPGRADES")).map((row) => ({
    code: row.code,
    label: row.label,
    qty: row.qty,
    unit: row.unit,
    klass: "",
  }));
  const included = [];
  for (const line of section(text, "INCLUDED").split("\n")) {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length >= 2 && parts[0]) included.push({ label: parts[0], detail: parts[1] });
  }
  return { kind, lines, included, warning: lines.length ? "" : "No upgrade rows found." };
}

function money(n) {
  return Math.round(n * 100) / 100;
}

export function price(kind, lines, rates) {
  const priced = [];
  if (kind === "storm") {
    const mobilization = money(Number(rates.mobilization) || 0);
    priced.push({
      code: "MOB",
      label: "Mobilization",
      qty: 1,
      unit: "ea",
      rate: mobilization,
      amount: mobilization,
    });
    let heavyQty = 0;
    for (const line of lines) {
      const klass = String(line.klass || "").toLowerCase();
      const rate = money(Number(rates[klass]) || 0);
      const amount = money(rate * Number(line.qty || 0));
      if (klass === "heavy") heavyQty += Number(line.qty || 0);
      priced.push({ ...line, rate, amount });
    }
    const disposalRate = money(Number(rates.disposalHeavy) || 0);
    if (heavyQty > 0) {
      priced.push({
        code: "DISP",
        label: "Disposal, heavy debris",
        qty: heavyQty,
        unit: "ea",
        rate: disposalRate,
        amount: money(disposalRate * heavyQty),
      });
    }
  } else if (kind === "hvac") {
    const repairCodes = new Set(lines.map((line) => line.code));
    const hasRepair = [...repairCodes].some((code) => code !== "TRIP");
    for (const line of lines) {
      let rate = money(Number(rates[line.code]) || 0);
      let amount = money(rate * Number(line.qty || 0));
      let label = line.label;
      if (line.code === "TRIP" && rates.waiveTripIfRepair && hasRepair) {
        rate = 0;
        amount = 0;
        label = `${line.label} (waived — repair approved)`;
      }
      priced.push({ ...line, label, rate, amount });
    }
  } else if (kind === "selections") {
    for (const line of lines) {
      const rate = money(Number(rates[line.code]) || 0);
      priced.push({ ...line, rate, amount: money(rate * Number(line.qty || 0)) });
    }
  }
  const total = money(priced.reduce((sum, line) => sum + line.amount, 0));
  return { lines: priced, total };
}

export function prepareDocument(raw) {
  const { body, local, held } = splitLocal(raw);
  const redacted = redact(body);
  const extraction = extractDeterministic(redacted.text);
  return { local, held, redacted, extraction };
}

export function modelInstruction(kind) {
  return [
    "You extract structured fields from a redacted field document for a pricing worksheet.",
    "Do not invent rows, quantities, prices, or personal data.",
    "Do not include phone numbers, emails, account numbers, or street addresses even if present.",
    "Return JSON only with this shape:",
    '{"kind":"storm|hvac|selections","lines":[{"code":"","label":"","qty":0,"unit":"ea","klass":"light|moderate|heavy|"}],"included":[{"label":"","detail":""}]}',
    kind === "storm"
      ? "kind must be storm. klass is the debris class. One row per structure."
      : kind === "hvac"
        ? "kind must be hvac. Use the codes already written in the notes when they exist."
        : kind === "selections"
          ? "kind must be selections. Upgrades are lines. Allowance items go in included, not in lines."
          : "Set kind from the document: storm for structures, hvac for repairs, selections for upgrades.",
  ].join(" ");
}
