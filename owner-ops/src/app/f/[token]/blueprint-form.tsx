"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  emptyBlueprintPayload,
  TOOL_CATEGORIES,
  PROCESS_CATEGORIES,
  type BlueprintPayload,
} from "@/lib/form-schema";
import { calculateCompletionPct } from "@/lib/completion";
import {
  saveDraftAction,
  submitFormAction,
  uploadFormFileAction,
  acknowledgePrivacyAction,
} from "../actions";
import { ProcessBuilder } from "./process-builder";
import type { PrivacyNotice } from "@/lib/privacy";

const SECTIONS = [
  { id: 1, title: "Contact and company" },
  { id: 2, title: "Business overview" },
  { id: 3, title: "Current tools" },
  { id: 4, title: "Process inventory" },
  { id: 5, title: "Your Processes" },
  { id: 6, title: "Documents and examples" },
  { id: 7, title: "Priorities and outcomes" },
  { id: 8, title: "Confirmation" },
] as const;

function uid() {
  return crypto.randomUUID();
}

type Props = {
  token: string;
  initialPayload: unknown;
  initialCompletion: number;
  initialSavedAt: string | null;
  readOnly: boolean;
  contactFirstName: string;
  companyName: string;
  initialPrivacyAcknowledged: boolean;
  privacyNotice: PrivacyNotice;
};

export function BlueprintForm({
  token,
  initialPayload,
  initialCompletion,
  initialSavedAt,
  readOnly,
  contactFirstName,
  companyName,
  initialPrivacyAcknowledged,
  privacyNotice,
}: Props) {
  const [section, setSection] = useState(1);
  const [privacyOk, setPrivacyOk] = useState(
    readOnly || initialPrivacyAcknowledged,
  );
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [payload, setPayload] = useState<BlueprintPayload>(() => {
    try {
      const base = emptyBlueprintPayload();
      const incoming = (initialPayload ?? {}) as Partial<BlueprintPayload>;
      return {
        ...base,
        ...incoming,
        privacy: { ...base.privacy, ...(incoming.privacy ?? {}) },
        section1: { ...base.section1, ...(incoming.section1 ?? {}) },
        section2: { ...base.section2, ...(incoming.section2 ?? {}) },
        section3: {
          tools: incoming.section3?.tools ?? base.section3.tools,
        },
        section4: {
          processes: incoming.section4?.processes ?? base.section4.processes,
        },
        section5: {
          detailedProcesses:
            incoming.section5?.detailedProcesses ??
            base.section5.detailedProcesses,
        },
        section6: { ...base.section6, ...(incoming.section6 ?? {}) },
        section7: { ...base.section7, ...(incoming.section7 ?? {}) },
        section8: { ...base.section8, ...(incoming.section8 ?? {}) },
      };
    } catch {
      return emptyBlueprintPayload();
    }
  });
  const [saveStatus, setSaveStatus] = useState<string>(
    initialSavedAt ? `Saved ${new Date(initialSavedAt).toLocaleString()}` : "Not saved yet",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(readOnly);
  const [uploads, setUploads] = useState<
    { id: string; originalName: string; sizeBytes: number }[]
  >([]);
  const [pending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);
  const dirty = useRef(false);
  const payloadRef = useRef(payload);

  useEffect(() => {
    payloadRef.current = payload;
  }, [payload]);

  const completion = useMemo(() => calculateCompletionPct(payload), [payload]);

  const update = useCallback((updater: (prev: BlueprintPayload) => BlueprintPayload) => {
    if (readOnly || submitted) return;
    dirty.current = true;
    setPayload((prev) => updater(prev));
  }, [readOnly, submitted]);

  const save = useCallback(async () => {
    if (readOnly || submitted || !privacyOk) return false;
    setError(null);
    setSaveStatus("Saving…");
    const result = await saveDraftAction(token, payloadRef.current);
    if (!result.ok) {
      setSaveStatus("Save failed — retry");
      setError(result.error);
      return false;
    }
    dirty.current = false;
    setSaveStatus(`Saved ${new Date(result.savedAt!).toLocaleTimeString()}`);
    return true;
  }, [token, readOnly, submitted, privacyOk]);

  useEffect(() => {
    if (readOnly || submitted || !privacyOk) return;
    const id = window.setInterval(() => {
      if (dirty.current) void save();
    }, 20000);
    return () => window.clearInterval(id);
  }, [save, readOnly, submitted, privacyOk]);

  useEffect(() => {
    if (readOnly || submitted) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [readOnly, submitted]);

  function go(next: number) {
    startTransition(() => {
      void save().finally(() => setSection(next));
    });
  }

  async function onAcknowledgePrivacy() {
    if (!privacyChecked) {
      setError("Please confirm you have read the privacy notice.");
      return;
    }
    setError(null);
    const result = await acknowledgePrivacyAction(token, privacyNotice.version);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    update((prev) => ({
      ...prev,
      privacy: {
        noticeVersion: privacyNotice.version,
        acknowledged: true,
        acknowledgedAt: result.acknowledgedAt,
      },
    }));
    setPrivacyOk(true);
  }

  async function onSubmit() {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    startTransition(async () => {
      try {
        const saved = await save();
        if (saved === false && dirty.current) {
          setError("Save your answers before submitting, then try again.");
          return;
        }
        const result = await submitFormAction(token, payloadRef.current);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        dirty.current = false;
        setSubmitted(true);
        setSaveStatus("Submitted");
      } finally {
        setSubmitting(false);
      }
    });
  }

  async function onUpload(fileList: FileList | null) {
    if (!fileList?.length || readOnly || submitted) return;
    const file = fileList[0];
    const fd = new FormData();
    fd.set("token", token);
    fd.set("file", file);
    fd.set("category", "supporting");
    const result = await uploadFormFileAction(fd);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setUploads((u) => [...u, result.file]);
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Peacemakers AI
        </p>
        <h1 className="mt-2 text-3xl">Thank you</h1>
        <p className="mt-3 text-[var(--muted)]">
          We received your Business Blueprint Preparation answers
          {companyName ? ` for ${companyName}` : ""}. A confirmation has been
          queued, and our team will review them before your Blueprint discussion.
        </p>
      </main>
    );
  }

  if (!privacyOk) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Peacemakers AI
        </p>
        <h1 className="mt-2 text-3xl">{privacyNotice.title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Hello{contactFirstName ? ` ${contactFirstName}` : ""}
          {companyName ? ` — ${companyName}` : ""}. Estimated time: 45–90 minutes.
        </p>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--foreground)]">
          {privacyNotice.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <ul className="list-disc space-y-2 pl-5">
            {privacyNotice.bullets.map((b) => (
              <li key={b.slice(0, 40)}>{b}</li>
            ))}
          </ul>
          <p className="text-xs text-[var(--muted)]">
            Notice version: {privacyNotice.version}
          </p>
        </div>
        <label className="mt-6 flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={privacyChecked}
            onChange={(e) => setPrivacyChecked(e.target.checked)}
          />
          <span>{privacyNotice.acknowledgementLabel}</span>
        </label>
        {error ? (
          <p className="mt-3 text-sm text-[var(--danger)]" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          className="mt-6 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          onClick={() => void onAcknowledgePrivacy()}
          disabled={!privacyChecked}
        >
          Continue to questionnaire
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="border-b border-[var(--line)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Peacemakers AI
        </p>
        <h1 className="mt-2 text-3xl">Business Blueprint Preparation</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Estimated time: about 45–75 minutes. You can save and return anytime.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {contactFirstName ? `Hi ${contactFirstName} — ` : ""}
          To design the right solution, we need to understand how your work
          actually happens today—from the moment a process begins until it is
          completely finished. Please describe the real process, including manual
          steps, decisions, delays, exceptions, tools, and handoffs. Do not
          describe only how the process is supposed to work. Optional questions
          are marked. “I don’t know” and “We need to discuss this” are acceptable
          answers — do not invent details.
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Do not enter passwords, API keys, payment credentials, or other secrets.
          We use this information to prepare your Blueprint meeting — not to
          generate automated recommendations in this step.
        </p>
        <details className="mt-4 rounded-md border border-[var(--line)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
          <summary className="cursor-pointer font-medium text-[var(--navy)]">
            What level of detail helps?
          </summary>
          <p className="mt-3">
            A broad answer would be: “I wake up and go to the bathroom.”
          </p>
          <p className="mt-2">
            A Blueprint-ready answer would be: “I wake up, open my eyes, sit up,
            place my feet on the floor, stand, walk toward the bathroom, and enter
            through the doorway. Sometimes it is dark, and I stub my toe on the
            right side of the doorframe.”
          </p>
          <p className="mt-2">
            Extra detail reveals actions, handoffs, decisions, tools, conditions,
            exceptions, delays, repeated work, error sources, and automation
            opportunities.
          </p>
        </details>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div
              className="h-2 w-40 overflow-hidden rounded-full bg-[var(--line)]"
              role="progressbar"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Form completion"
            >
              <div
                className="h-full bg-[var(--accent)] transition-all"
                style={{ width: `${completion || initialCompletion}%` }}
              />
            </div>
            <span className="text-[var(--muted)]">{completion}% complete</span>
          </div>
          <span className="flex items-center gap-2 text-[var(--muted)]" aria-live="polite">
            {pending || submitting ? "Working…" : saveStatus}
            {saveStatus.startsWith("Save failed") ? (
              <button
                type="button"
                className="underline"
                onClick={() => void save()}
              >
                Retry save
              </button>
            ) : null}
          </span>
        </div>
      </header>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Sections">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(s.id)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
              section === s.id
                ? "bg-[var(--navy)] text-white"
                : "border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"
            }`}
          >
            {s.id}. {s.title}
          </button>
        ))}
      </nav>

      {error ? (
        <p className="mt-4 rounded-md border border-[var(--danger)]/30 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <section className="mt-6 space-y-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-xl">{SECTIONS[section - 1].title}</h2>

        {section === 1 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["firstName", "First name", "text"],
                ["lastName", "Last name", "text"],
                ["jobTitle", "Job title", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
                ["companyName", "Company name", "text"],
                ["companyWebsite", "Company website", "url"],
                ["primaryLocation", "Primary business location", "text"],
                ["serviceAreas", "Service areas", "text"],
                ["industry", "Industry", "text"],
                ["annualRevenueRange", "Approx. annual revenue range (optional)", "text"],
                ["primaryDecisionMaker", "Primary decision-maker", "text"],
                ["additionalStakeholders", "Additional stakeholders", "text"],
                ["howHeard", "How did you hear about Peacemakers AI?", "text"],
              ] as const
            ).map(([key, label, type]) => (
              <Field
                key={key}
                label={label}
                type={type}
                value={String(payload.section1[key] ?? "")}
                onChange={(v) =>
                  update((p) => ({
                    ...p,
                    section1: { ...p.section1, [key]: v },
                  }))
                }
              />
            ))}
            {(
              [
                ["yearsInBusiness", "Years in business"],
                ["employeeCount", "Number of employees"],
                ["adminEmployeeCount", "Office / administrative employees"],
                ["customersPerMonth", "Customers or jobs per month"],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                type="number"
                value={String(payload.section1[key] ?? "")}
                onChange={(v) =>
                  update((p) => ({
                    ...p,
                    section1: {
                      ...p.section1,
                      [key]: v === "" ? "" : Number(v),
                    },
                  }))
                }
              />
            ))}
          </div>
        )}

        {section === 2 && (
          <div className="grid gap-3">
            {(
              [
                ["productsServices", "What products or services do you provide?"],
                ["primaryCustomers", "Who are your primary customers?"],
                ["howCustomersFindYou", "How does a customer normally find and contact you?"],
                ["inquiryToFollowUp", "What happens from first inquiry through completion and follow-up?"],
                ["differentiators", "What makes your company different?"],
                ["threeGoals", "What are your three most important business goals?"],
                ["goalBlockers", "What currently prevents achieving those goals?"],
                ["timeConsumingWork", "What work consumes the most owner or staff time?"],
                ["greatestFrustration", "What causes the greatest frustration?"],
                ["whereValueIsLost", "Where are leads, revenue, time, or information most likely lost?"],
                ["priorImprovementAttempts", "What have you already attempted to improve or automate?"],
                ["engagementSuccessLooksLike", "What would make this engagement successful?"],
              ] as const
            ).map(([key, label]) => (
              <TextArea
                key={key}
                label={label}
                value={String(payload.section2[key] ?? "")}
                onChange={(v) =>
                  update((p) => ({
                    ...p,
                    section2: { ...p.section2, [key]: v },
                  }))
                }
              />
            ))}
          </div>
        )}

        {section === 3 && (
          <ToolsSection
            tools={payload.section3.tools}
            onChange={(tools) =>
              update((p) => ({ ...p, section3: { tools } }))
            }
          />
        )}

        {section === 4 && (
          <ProcessInventorySection
            processes={payload.section4.processes}
            onChange={(processes) =>
              update((p) => ({ ...p, section4: { processes } }))
            }
          />
        )}

        {section === 5 && (
          <ProcessBuilder
            token={token}
            readOnly={readOnly || submitted}
            onChanged={() => {
              dirty.current = true;
            }}
          />
        )}

        {section === 6 && (
          <div className="space-y-4">
            <p className="rounded-md border border-[var(--warning)]/40 bg-amber-50 px-3 py-2 text-sm text-[var(--warning)]">
              Do not upload passwords, payment-card information, Social Security
              numbers, private health information, or other unnecessary sensitive
              personal data.
            </p>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(payload.section6.acknowledgedSensitiveWarning)}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    section6: {
                      ...p.section6,
                      acknowledgedSensitiveWarning: e.target.checked,
                    },
                  }))
                }
              />
              <span>I understand and will not upload unnecessary sensitive data.</span>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[var(--navy)]">Upload supporting files</span>
              <input
                type="file"
                className="mt-2 block w-full text-sm"
                onChange={(e) => void onUpload(e.target.files)}
                accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              />
            </label>
            {uploads.length > 0 ? (
              <ul className="text-sm text-[var(--muted)]">
                {uploads.map((f) => (
                  <li key={f.id}>
                    {f.originalName} ({Math.round(f.sizeBytes / 1024)} KB)
                  </li>
                ))}
              </ul>
            ) : null}
            <TextArea
              label="Notes about documents (optional)"
              value={String(payload.section6.notes ?? "")}
              onChange={(v) =>
                update((p) => ({
                  ...p,
                  section6: { ...p.section6, notes: v },
                }))
              }
            />
          </div>
        )}

        {section === 7 && (
          <div className="grid gap-3">
            {(
              [
                ["topThreeProcesses", "Three most important processes to improve"],
                ["improve30Days", "What should improve in the first 30 days?"],
                ["improve60Days", "What should improve in the first 60 days?"],
                ["improve90Days", "What should improve in the first 90 days?"],
                ["greatestFinancialValue", "Outcome with greatest financial value"],
                ["mostTimeSaved", "Outcome that would save the most time"],
                ["bestCustomerExperience", "Outcome that improves customer experience most"],
                ["greatestRiskReduction", "Outcome that reduces the greatest risk"],
                ["budgetRange", "Budget range considered"],
                ["implementationStart", "When would you like implementation to begin?"],
                ["timingConstraints", "Deadlines, seasons, renewals, or other timing factors"],
                ["anythingElse", "Anything else we should understand before the Blueprint call?"],
              ] as const
            ).map(([key, label]) => (
              <TextArea
                key={key}
                label={label}
                value={String(payload.section7[key] ?? "")}
                onChange={(v) =>
                  update((p) => ({
                    ...p,
                    section7: { ...p.section7, [key]: v },
                  }))
                }
              />
            ))}
          </div>
        )}

        {section === 8 && (
          <div className="space-y-6 text-sm">
            <div className="rounded-md border border-[var(--line)] bg-[var(--surface)] p-4">
              <h2 className="text-base font-medium">Review before submission</h2>
              <p className="mt-1 text-[var(--muted)]">
                After you submit, answers become read-only for the Blueprint
                meeting. You can still use Save and continue later until then.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-[var(--muted)]">
                <li>
                  Contact: {payload.section1.firstName || "—"}{" "}
                  {payload.section1.lastName || ""} ·{" "}
                  {payload.section1.companyName || companyName || "—"}
                </li>
                <li>Tools listed: {payload.section3.tools.length}</li>
                <li>
                  Processes in inventory: {payload.section4.processes.length}
                </li>
                <li>
                  Detailed process maps:{" "}
                  {payload.section5.detailedProcesses.length}
                </li>
                <li>Completion shown above: {completion}%</li>
              </ul>
            </div>
            {(
              [
                ["answersAreHonest", "My answers describe current operations honestly."],
                ["noSensitiveCredentials", "I have not included passwords, API keys, payment credentials, or other secrets."],
                ["mayUseForBlueprint", "Peacemakers AI may use this information to prepare for the Business Blueprint discussion."],
                ["authorizedToProvide", "I am authorized to provide this business information."],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={payload.section8[key] === true}
                  onChange={(e) =>
                    update((p) => ({
                      ...p,
                      section8: {
                        ...p.section8,
                        [key]: e.target.checked ? true : undefined,
                      },
                    }))
                  }
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm"
          disabled={section === 1}
          onClick={() => go(section - 1)}
        >
          Previous
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm"
            onClick={() => void save()}
          >
            Save and continue later
          </button>
          {section < 8 ? (
            <button
              type="button"
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
              onClick={() => go(section + 1)}
            >
              Next section
            </button>
          ) : (
            <button
              type="button"
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
              onClick={() => void onSubmit()}
              disabled={pending || submitting}
            >
              {submitting ? "Submitting…" : "Submit Blueprint form"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={id}>
      <span className="font-medium text-[var(--navy)]">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-[var(--line)] px-3 py-2"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={id}>
      <span className="font-medium text-[var(--navy)]">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="rounded-md border border-[var(--line)] px-3 py-2"
      />
    </label>
  );
}

function ToolsSection({
  tools,
  onChange,
}: {
  tools: BlueprintPayload["section3"]["tools"];
  onChange: (tools: BlueprintPayload["section3"]["tools"]) => void;
}) {
  return (
    <div className="space-y-4">
      {tools.map((tool, index) => (
        <div key={tool.id} className="space-y-2 border-t border-[var(--line)] pt-4 first:border-0 first:pt-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[var(--navy)]">Tool {index + 1}</h3>
            <button
              type="button"
              className="text-sm text-[var(--danger)]"
              onClick={() => onChange(tools.filter((t) => t.id !== tool.id))}
            >
              Remove
            </button>
          </div>
          <Field
            label="Tool or system name"
            value={tool.name}
            onChange={(name) =>
              onChange(tools.map((t) => (t.id === tool.id ? { ...t, name } : t)))
            }
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[var(--navy)]">Category</span>
            <select
              className="rounded-md border border-[var(--line)] px-3 py-2"
              value={tool.category ?? ""}
              onChange={(e) =>
                onChange(
                  tools.map((t) =>
                    t.id === tool.id ? { ...t, category: e.target.value } : t,
                  ),
                )
              }
            >
              <option value="">Select…</option>
              {TOOL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          {(
            [
              ["usedFor", "What it is used for"],
              ["whoUses", "Who uses it"],
              ["informationHeld", "What information it contains"],
              ["connectsTo", "Whether it connects to other tools"],
              ["worksWell", "What works well"],
              ["doesNotWorkWell", "What does not work well"],
              ["costOptional", "Monthly or annual cost (optional)"],
              ["notes", "Additional notes"],
            ] as const
          ).map(([key, label]) => (
            <TextArea
              key={key}
              label={label}
              value={String(tool[key] ?? "")}
              onChange={(v) =>
                onChange(
                  tools.map((t) => (t.id === tool.id ? { ...t, [key]: v } : t)),
                )
              }
            />
          ))}
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[var(--navy)]">Retain / replace / evaluate</span>
            <select
              className="rounded-md border border-[var(--line)] px-3 py-2"
              value={tool.retainDecision ?? ""}
              onChange={(e) =>
                onChange(
                  tools.map((t) =>
                    t.id === tool.id
                      ? {
                          ...t,
                          retainDecision: e.target.value as
                            | "retain"
                            | "replace"
                            | "evaluate"
                            | "",
                        }
                      : t,
                  ),
                )
              }
            >
              <option value="">Select…</option>
              <option value="retain">Retain</option>
              <option value="replace">Replace</option>
              <option value="evaluate">Evaluate</option>
            </select>
          </label>
        </div>
      ))}
      <button
        type="button"
        className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        onClick={() =>
          onChange([
            ...tools,
            {
              id: uid(),
              name: "",
              category: "",
              usedFor: "",
              whoUses: "",
              informationHeld: "",
              connectsTo: "",
              worksWell: "",
              doesNotWorkWell: "",
              costOptional: "",
              retainDecision: "",
              notes: "",
            },
          ])
        }
      >
        Add tool
      </button>
    </div>
  );
}

function ProcessInventorySection({
  processes,
  onChange,
}: {
  processes: BlueprintPayload["section4"]["processes"];
  onChange: (processes: BlueprintPayload["section4"]["processes"]) => void;
}) {
  return (
    <div className="space-y-4">
      {processes.map((proc, index) => (
        <div key={proc.id} className="space-y-2 border-t border-[var(--line)] pt-4 first:border-0 first:pt-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[var(--navy)]">Process {index + 1}</h3>
            <button
              type="button"
              className="text-sm text-[var(--danger)]"
              onClick={() => onChange(processes.filter((p) => p.id !== proc.id))}
            >
              Remove
            </button>
          </div>
          <Field
            label="Process name"
            value={proc.name}
            onChange={(name) =>
              onChange(processes.map((p) => (p.id === proc.id ? { ...p, name } : p)))
            }
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[var(--navy)]">Suggested category</span>
            <select
              className="rounded-md border border-[var(--line)] px-3 py-2"
              value={proc.category ?? ""}
              onChange={(e) =>
                onChange(
                  processes.map((p) =>
                    p.id === proc.id ? { ...p, category: e.target.value } : p,
                  ),
                )
              }
            >
              <option value="">Select…</option>
              {PROCESS_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          {(
            [
              ["department", "Department or business area"],
              ["processOwner", "Process owner"],
              ["peopleInvolved", "People involved"],
              ["frequency", "Frequency"],
              ["estimatedTime", "Estimated time required"],
              ["businessImportance", "Business importance"],
              ["frustrationLevel", "Current frustration level"],
              ["errorReworkFrequency", "Approximate error or rework frequency"],
            ] as const
          ).map(([key, label]) => (
            <Field
              key={key}
              label={label}
              value={String(proc[key] ?? "")}
              onChange={(v) =>
                onChange(
                  processes.map((p) =>
                    p.id === proc.id ? { ...p, [key]: v } : p,
                  ),
                )
              }
            />
          ))}
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["affectsRevenue", "Affects revenue"],
                ["affectsCustomerExp", "Affects customer experience"],
                ["affectsCost", "Affects cost"],
                ["affectsRisk", "Affects risk"],
                ["affectsWorkload", "Affects employee workload"],
                ["wantDetailedMap", "Want to map in detail"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(proc[key])}
                  onChange={(e) =>
                    onChange(
                      processes.map((p) =>
                        p.id === proc.id ? { ...p, [key]: e.target.checked } : p,
                      ),
                    )
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        onClick={() =>
          onChange([
            ...processes,
            {
              id: uid(),
              name: "",
              category: "",
              department: "",
              processOwner: "",
              peopleInvolved: "",
              frequency: "",
              estimatedTime: "",
              businessImportance: "",
              frustrationLevel: "",
              errorReworkFrequency: "",
              affectsRevenue: false,
              affectsCustomerExp: false,
              affectsCost: false,
              affectsRisk: false,
              affectsWorkload: false,
              wantDetailedMap: false,
            },
          ])
        }
      >
        Add process
      </button>
    </div>
  );
}
