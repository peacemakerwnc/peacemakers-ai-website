import { DEFAULT_RATES, SAMPLES, prepareDocument, price } from "./engine.mjs";
import { buildPdf } from "./pdf.mjs";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const storm = prepareDocument(SAMPLES.storm.source);
assert(storm.held === 5, `expected 5 local fields, got ${storm.held}`);
assert(!storm.redacted.text.includes("555-0148"), "phone leaked into model text");
assert(!storm.redacted.text.includes("example.test"), "email leaked into model text");
assert(!storm.redacted.text.includes("0049182736"), "account leaked into model text");
assert(!storm.redacted.text.includes("Marsh Hen Lane"), "service address leaked into model text");
const stormPrice = price("storm", storm.extraction.lines, DEFAULT_RATES.storm);
assert(stormPrice.total === 3210, `storm total ${stormPrice.total}`);

const hvac = prepareDocument(SAMPLES.hvac.source);
const hvacPrice = price("hvac", hvac.extraction.lines, DEFAULT_RATES.hvac);
assert(hvacPrice.total === 741, `hvac total ${hvacPrice.total}`);
assert(hvacPrice.lines.find((line) => line.code === "TRIP").amount === 0, "trip was not waived");

const builder = prepareDocument(SAMPLES.builder.source);
const builderPrice = price("selections", builder.extraction.lines, DEFAULT_RATES.selections);
assert(builderPrice.total === 13768, `builder total ${builderPrice.total}`);
assert(builder.extraction.included.length === 6, "included selections missing");

const leaked = prepareDocument("Call Dana at (910) 555-0148 or dana.ellison@example.test. SSN 123-45-6789. Acct 0049182736");
assert(leaked.redacted.total === 4, `expected 4 redactions, got ${leaked.redacted.total}`);
assert(!/555-0148|example\.test|123-45-6789|0049182736/.test(leaked.redacted.text), "redaction missed a pattern");

const pdf = buildPdf({
  company: "Cape Fear Drainage Co.",
  outputTitle: "Maintenance proposal",
  audienceLine: "Prepared for Dana Ellison",
  localLine: "Location: Lot 14",
  approver: "JF",
  lines: stormPrice.lines,
  included: [],
  total: stormPrice.total,
  manualTotal: 3480,
  note: SAMPLES.storm.manualNote,
  footer: "sample",
});
const header = new TextDecoder().decode(pdf.slice(0, 8));
assert(header === "%PDF-1.4", header);
console.log("self-check ok", { storm: stormPrice.total, hvac: hvacPrice.total, builder: builderPrice.total });
