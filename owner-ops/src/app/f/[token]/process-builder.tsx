"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import type {
  ProcessConnectionType,
  ProcessStepType,
} from "@prisma/client";
import {
  addPathAction,
  addParticipantAction,
  addStepAction,
  completenessAction,
  connectNextAction,
  createProcessAction,
  deleteStepAction,
  duplicateStepAction,
  listProcessesAction,
  removePathAction,
  reorderStepsAction,
  updateProcessOverviewAction,
  updateStepAction,
} from "../process-actions";

const STEP_TYPE_OPTIONS: { value: ProcessStepType; label: string }[] = [
  { value: "TRIGGER", label: "What starts the work" },
  { value: "HUMAN_TASK", label: "Someone does work" },
  { value: "AUTOMATED_TASK", label: "A system does work" },
  { value: "COMMUNICATION", label: "Someone sends a message" },
  { value: "DATA_ENTRY", label: "Information is entered" },
  { value: "DOCUMENT_CREATION", label: "A document is created" },
  { value: "DECISION", label: "Someone makes a decision" },
  { value: "APPROVAL", label: "Someone approves or rejects" },
  { value: "HANDOFF", label: "Work is handed to another team" },
  { value: "WAITING_PERIOD", label: "Work is waiting" },
  { value: "EXCEPTION", label: "Something went wrong" },
  { value: "SUBPROCESS", label: "A smaller process inside this one" },
  { value: "PROCESS_END", label: "The process finishes" },
];

const PATH_OPTIONS: { value: ProcessConnectionType; label: string }[] = [
  { value: "NORMAL", label: "What happens next" },
  { value: "CONDITIONAL", label: "Depends on a condition" },
  { value: "APPROVED", label: "When approved" },
  { value: "REJECTED", label: "When rejected" },
  { value: "RETURNED_FOR_CORRECTION", label: "Returned for correction" },
  { value: "PARALLEL", label: "Happens at the same time" },
  { value: "LOOP", label: "Returns to an earlier step" },
  { value: "REWORK", label: "Rework / try again" },
  { value: "ESCALATION", label: "Escalate for help" },
  { value: "TIMEOUT", label: "Took too long" },
  { value: "FAILURE", label: "Failed" },
  { value: "TERMINATION", label: "Ends here" },
];

type ProcessView = {
  versionId: string;
  processId: string;
  name: string;
  purpose: string | null;
  outcome: string | null;
  startTrigger: string | null;
  endEvent: string | null;
  status: string;
  stepCount: number;
  connectionCount: number;
  participantCount: number;
  steps: Array<{
    id: string;
    shortName: string;
    stepType: ProcessStepType;
    displayOrder: number;
    detailedDescription: string | null;
    responsibleRole: string | null;
    department: string | null;
    toolOrSystem: string | null;
    discussDuringBlueprint: boolean;
    typicalWaitingTime: string | null;
    expectedWorkTime: string | null;
  }>;
  connections: Array<{
    id: string;
    sourceStepId: string;
    targetStepId: string;
    connectionType: ProcessConnectionType;
    displayLabel: string | null;
    condition: string | null;
  }>;
  participants: Array<{
    id: string;
    role: string | null;
    personLabel: string | null;
    department: string | null;
  }>;
};

type Phase = "list" | "overview" | "people" | "steps" | "paths" | "review";

export function ProcessBuilder({
  token,
  readOnly,
  onChanged,
}: {
  token: string;
  readOnly: boolean;
  onChanged?: () => void;
}) {
  const [processes, setProcesses] = useState<ProcessView[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("list");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [completeness, setCompleteness] = useState<{
    scorePct: number;
    requiredOk: boolean;
    items: { code: string; label: string; level: string; ok: boolean }[];
  } | null>(null);

  const active = processes.find((p) => p.versionId === activeId) ?? null;

  const reload = useCallback(async () => {
    const res = await listProcessesAction(token);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setProcesses(res.processes as ProcessView[]);
    onChanged?.();
  }, [token, onChanged]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await listProcessesAction(token);
      if (cancelled) return;
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setProcesses(res.processes as ProcessView[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const refreshCompleteness = async (versionId: string) => {
    const res = await completenessAction(token, versionId);
    if (res.ok) {
      setCompleteness({
        scorePct: res.scorePct,
        requiredOk: res.requiredOk,
        items: res.items,
      });
    }
  };

  const selectProcess = (versionId: string) => {
    setActiveId(versionId);
    setPhase("overview");
    setError(null);
    void refreshCompleteness(versionId);
  };

  const stepName = (id: string) =>
    active?.steps.find((s) => s.id === id)?.shortName ?? id.slice(0, 6);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl text-[var(--navy)]">Your Processes</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Describe how work really happens today — in plain language. You do not
          need flowchart experience. Save as you go; you can leave and come back
          with the same link.
        </p>
      </div>

      {error ? (
        <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-900">
          {message}
        </p>
      ) : null}

      {phase === "list" || !active ? (
        <div className="space-y-3">
          {processes.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              No processes yet. Start with one important workflow — for example
              how field photos become a customer report.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--line)] rounded border border-[var(--line)]">
              {processes.map((p) => (
                <li key={p.versionId} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {p.stepCount} steps · {p.connectionCount} paths ·{" "}
                      {p.status}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded border border-[var(--line)] px-3 py-1.5 text-sm focus:outline focus:outline-2 focus:outline-[var(--accent)]"
                    onClick={() => selectProcess(p.versionId)}
                  >
                    {readOnly ? "View" : "Continue"}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!readOnly ? (
            <NewProcessForm
              pending={pending}
              onCreate={(input) => {
                startTransition(async () => {
                  setError(null);
                  const res = await createProcessAction(token, input);
                  if (!res.ok) {
                    setError(res.error);
                    return;
                  }
                  await reload();
                  selectProcess(res.versionId);
                  setMessage("Process created. Tell us what starts it and what success looks like.");
                });
              }}
            />
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="text-sm underline"
              onClick={() => {
                setPhase("list");
                setActiveId(null);
              }}
            >
              ← All processes
            </button>
            <span className="font-medium text-[var(--navy)]">{active.name}</span>
          </div>

          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Process builder steps">
            {(
              [
                ["overview", "1. Overview"],
                ["people", "2. People"],
                ["steps", "3. Steps"],
                ["paths", "4. What happens next"],
                ["review", "5. Review"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`rounded px-2 py-1 focus:outline focus:outline-2 focus:outline-[var(--accent)] ${
                  phase === id
                    ? "bg-[var(--navy)] text-white"
                    : "border border-[var(--line)]"
                }`}
                onClick={() => {
                  setPhase(id);
                  if (id === "review") void refreshCompleteness(active.versionId);
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          {phase === "overview" ? (
            <OverviewPhase
              key={active.versionId + String(active.purpose) + String(active.startTrigger)}
              active={active}
              readOnly={readOnly}
              pending={pending}
              onSave={(patch) => {
                startTransition(async () => {
                  const res = await updateProcessOverviewAction(
                    token,
                    active.versionId,
                    patch,
                  );
                  if (!res.ok) setError(res.error);
                  else {
                    setMessage("Overview saved");
                    await reload();
                  }
                });
              }}
            />
          ) : null}

          {phase === "people" ? (
            <PeoplePhase
              active={active}
              readOnly={readOnly}
              onAdd={(input) => {
                startTransition(async () => {
                  const res = await addParticipantAction(
                    token,
                    active.versionId,
                    input,
                  );
                  if (!res.ok) setError(res.error);
                  else {
                    setMessage("Person / role added");
                    await reload();
                  }
                });
              }}
            />
          ) : null}

          {phase === "steps" ? (
            <StepsPhase
              active={active}
              readOnly={readOnly}
              onAdd={(input) => {
                startTransition(async () => {
                  const res = await addStepAction(token, active.versionId, input);
                  if (!res.ok) setError(res.error);
                  else {
                    setMessage("Step added");
                    await reload();
                  }
                });
              }}
              onUpdate={(stepId, patch) => {
                startTransition(async () => {
                  const res = await updateStepAction(token, stepId, patch);
                  if (!res.ok) setError(res.error);
                  else await reload();
                });
              }}
              onDuplicate={(stepId) => {
                startTransition(async () => {
                  const res = await duplicateStepAction(token, stepId);
                  if (!res.ok) setError(res.error);
                  else {
                    setMessage("Step duplicated");
                    await reload();
                  }
                });
              }}
              onDelete={async (stepId, cleanup) => {
                const res = await deleteStepAction(token, stepId, cleanup);
                if (!res.ok) {
                  if ("needsCleanup" in res && res.needsCleanup) {
                    const ok = window.confirm(
                      "This step is connected to other steps. Delete those connections too?",
                    );
                    if (ok) {
                      const again = await deleteStepAction(token, stepId, true);
                      if (!again.ok) setError(again.error);
                      else await reload();
                    } else setError(res.error);
                  } else setError(res.error);
                } else {
                  setMessage("Step deleted");
                  await reload();
                }
              }}
              onReorder={(ids) => {
                startTransition(async () => {
                  const res = await reorderStepsAction(
                    token,
                    active.versionId,
                    ids,
                  );
                  if (!res.ok) setError(res.error);
                  else await reload();
                });
              }}
              onConnectNext={(sourceId, targetId) => {
                startTransition(async () => {
                  const res = await connectNextAction(
                    token,
                    active.versionId,
                    sourceId,
                    targetId,
                  );
                  if (!res.ok) setError(res.error);
                  else {
                    setMessage("Connected as “what happens next”");
                    await reload();
                  }
                });
              }}
            />
          ) : null}

          {phase === "paths" ? (
            <PathsPhase
              active={active}
              readOnly={readOnly}
              stepName={stepName}
              onAdd={(input) => {
                startTransition(async () => {
                  const res = await addPathAction(token, active.versionId, input);
                  if (!res.ok) setError(res.error);
                  else {
                    setMessage("Path added");
                    await reload();
                  }
                });
              }}
              onRemove={(id) => {
                startTransition(async () => {
                  const res = await removePathAction(token, id);
                  if (!res.ok) setError(res.error);
                  else await reload();
                });
              }}
            />
          ) : null}

          {phase === "review" ? (
            <ReviewPhase
              active={active}
              completeness={completeness}
              stepName={stepName}
              onRefresh={() => void refreshCompleteness(active.versionId)}
            />
          ) : null}
        </div>
      )}
      {pending ? (
        <p className="text-xs text-[var(--muted)]" aria-live="polite">
          Saving…
        </p>
      ) : null}
    </div>
  );
}

function NewProcessForm({
  onCreate,
  pending,
}: {
  onCreate: (input: {
    name: string;
    purpose: string;
    customerOutcome: string;
    startTrigger: string;
    endEvent: string;
  }) => void;
  pending: boolean;
}) {
  const [name, setName] = useState("");
  return (
    <form
      className="space-y-2 rounded border border-[var(--line)] p-3"
      onSubmit={(e) => {
        e.preventDefault();
        onCreate({
          name,
          purpose: "",
          customerOutcome: "",
          startTrigger: "",
          endEvent: "",
        });
        setName("");
      }}
    >
      <label className="block text-sm font-medium">
        What process do you want to describe?
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border border-[var(--line)] px-3 py-2"
          placeholder="e.g. Field photo reporting"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent)]"
      >
        Add process
      </button>
    </form>
  );
}

function OverviewPhase({
  active,
  readOnly,
  pending,
  onSave,
}: {
  active: ProcessView;
  readOnly: boolean;
  pending: boolean;
  onSave: (patch: {
    name: string;
    purpose: string;
    customerOutcome: string;
    startTrigger: string;
    endEvent: string;
  }) => void;
}) {
  const [name, setName] = useState(active.name);
  const [purpose, setPurpose] = useState(active.purpose ?? "");
  const [outcome, setOutcome] = useState(active.outcome ?? "");
  const [trigger, setTrigger] = useState(active.startTrigger ?? "");
  const [endEvent, setEnd] = useState(active.endEvent ?? "");

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!readOnly)
          onSave({
            name,
            purpose,
            customerOutcome: outcome,
            startTrigger: trigger,
            endEvent,
          });
      }}
    >
      <Field label="Process name" value={name} onChange={setName} readOnly={readOnly} required />
      <Field
        label="Why does this process exist?"
        value={purpose}
        onChange={setPurpose}
        readOnly={readOnly}
        multiline
      />
      <Field
        label="What starts it?"
        value={trigger}
        onChange={setTrigger}
        readOnly={readOnly}
        hint="Example: technician marks the job complete"
      />
      <Field
        label="What does successful completion look like?"
        value={outcome}
        onChange={setOutcome}
        readOnly={readOnly}
        multiline
      />
      <Field
        label="How does it end?"
        value={endEvent}
        onChange={setEnd}
        readOnly={readOnly}
      />
      {!readOnly ? (
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[var(--accent)] px-3 py-2 text-sm text-white"
        >
          Save overview
        </button>
      ) : null}
    </form>
  );
}

function PeoplePhase({
  active,
  readOnly,
  onAdd,
}: {
  active: ProcessView;
  readOnly: boolean;
  onAdd: (input: { role: string; personLabel: string; department: string }) => void;
}) {
  const [role, setRole] = useState("");
  const [person, setPerson] = useState("");
  const [dept, setDept] = useState("");
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--muted)]">
        Who is involved? Roles are enough — names are optional.
      </p>
      <ul className="space-y-1 text-sm">
        {active.participants.map((p) => (
          <li key={p.id}>
            {p.role || p.personLabel || "Participant"}
            {p.department ? ` · ${p.department}` : ""}
          </li>
        ))}
      </ul>
      {!readOnly ? (
        <form
          className="grid gap-2 sm:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd({ role, personLabel: person, department: dept });
            setRole("");
            setPerson("");
            setDept("");
          }}
        >
          <input
            required
            placeholder="Role (e.g. Field Technician)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded border border-[var(--line)] px-2 py-1.5 text-sm"
            aria-label="Role"
          />
          <input
            placeholder="Name (optional)"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="rounded border border-[var(--line)] px-2 py-1.5 text-sm"
            aria-label="Person name"
          />
          <input
            placeholder="Department"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="rounded border border-[var(--line)] px-2 py-1.5 text-sm"
            aria-label="Department"
          />
          <button type="submit" className="rounded border border-[var(--line)] px-3 py-1.5 text-sm sm:col-span-3">
            Add person or role
          </button>
        </form>
      ) : null}
    </div>
  );
}

function StepsPhase({
  active,
  readOnly,
  onAdd,
  onUpdate,
  onDuplicate,
  onDelete,
  onReorder,
  onConnectNext,
}: {
  active: ProcessView;
  readOnly: boolean;
  onAdd: (input: {
    shortName: string;
    stepType: ProcessStepType;
    detailedDescription?: string;
    responsibleRole?: string;
    department?: string;
    toolOrSystem?: string;
    afterStepId?: string;
    connectFromPrevious?: boolean;
    discussDuringBlueprint?: boolean;
    typicalWaitingTime?: string;
  }) => void;
  onUpdate: (stepId: string, patch: Record<string, unknown>) => void;
  onDuplicate: (stepId: string) => void;
  onDelete: (stepId: string, cleanup?: boolean) => void;
  onReorder: (ids: string[]) => void;
  onConnectNext: (sourceId: string, targetId: string) => void;
}) {
  const [shortName, setShortName] = useState("");
  const [stepType, setStepType] = useState<ProcessStepType>("HUMAN_TASK");
  const [desc, setDesc] = useState("");
  const [role, setRole] = useState("");
  const [tool, setTool] = useState("");
  const [dept, setDept] = useState("");
  const [afterId, setAfterId] = useState("");
  const [connect, setConnect] = useState(true);
  const [discuss, setDiscuss] = useState(false);
  const [wait, setWait] = useState("");

  const sorted = [...active.steps].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-4">
      <ol className="space-y-3">
        {sorted.map((s, index) => (
          <li
            key={s.id}
            className="rounded border border-[var(--line)] p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">
                  {index + 1}. {s.shortName}{" "}
                  <span className="text-xs font-normal text-[var(--muted)]">
                    ({STEP_TYPE_OPTIONS.find((o) => o.value === s.stepType)?.label})
                  </span>
                </p>
                {s.detailedDescription ? (
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {s.detailedDescription}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {[s.responsibleRole, s.department, s.toolOrSystem]
                    .filter(Boolean)
                    .join(" · ") || "Details optional"}
                  {s.discussDuringBlueprint
                    ? " · Discuss during Blueprint call"
                    : ""}
                </p>
              </div>
              {!readOnly ? (
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-xs"
                    onClick={() => {
                      if (index > 0) {
                        const ids = sorted.map((x) => x.id);
                        [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
                        onReorder(ids);
                      }
                    }}
                    aria-label={`Move ${s.shortName} up`}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-xs"
                    onClick={() => {
                      if (index < sorted.length - 1) {
                        const ids = sorted.map((x) => x.id);
                        [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
                        onReorder(ids);
                      }
                    }}
                    aria-label={`Move ${s.shortName} down`}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-xs"
                    onClick={() => onDuplicate(s.id)}
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-xs"
                    onClick={() => {
                      if (window.confirm(`Delete step “${s.shortName}”?`)) {
                        onDelete(s.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                  {index > 0 ? (
                    <button
                      type="button"
                      className="rounded border px-2 py-1 text-xs"
                      onClick={() => onConnectNext(sorted[index - 1].id, s.id)}
                    >
                      Link from previous
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-xs"
                    onClick={() =>
                      onUpdate(s.id, {
                        discussDuringBlueprint: !s.discussDuringBlueprint,
                      })
                    }
                  >
                    {s.discussDuringBlueprint
                      ? "Unmark Blueprint discuss"
                      : "Discuss on Blueprint call"}
                  </button>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {!readOnly ? (
        <form
          className="space-y-2 rounded border border-dashed border-[var(--line)] p-3"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd({
              shortName,
              stepType,
              detailedDescription: desc || undefined,
              responsibleRole: role || undefined,
              department: dept || undefined,
              toolOrSystem: tool || undefined,
              afterStepId: afterId || undefined,
              connectFromPrevious: connect && Boolean(afterId),
              discussDuringBlueprint: discuss,
              typicalWaitingTime:
                stepType === "WAITING_PERIOD" ? wait || undefined : undefined,
            });
            setShortName("");
            setDesc("");
            setRole("");
            setTool("");
            setDept("");
            setWait("");
            setDiscuss(false);
          }}
        >
          <p className="text-sm font-medium">Add a step</p>
          <Field label="What happens?" value={shortName} onChange={setShortName} required />
          <label className="block text-sm">
            What kind of step is this?
            <select
              value={stepType}
              onChange={(e) => setStepType(e.target.value as ProcessStepType)}
              className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1.5"
            >
              {STEP_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <Field label="Describe it (optional)" value={desc} onChange={setDesc} multiline />
          <Field label="Who is responsible?" value={role} onChange={setRole} />
          <Field label="Department" value={dept} onChange={setDept} />
          <Field label="Which software or tools?" value={tool} onChange={setTool} />
          {stepType === "WAITING_PERIOD" ? (
            <Field
              label="How long does it usually wait?"
              value={wait}
              onChange={setWait}
            />
          ) : null}
          <label className="block text-sm">
            Insert after (optional)
            <select
              value={afterId}
              onChange={(e) => setAfterId(e.target.value)}
              className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1.5"
            >
              <option value="">Add at end</option>
              {sorted.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={connect}
              onChange={(e) => setConnect(e.target.checked)}
            />
            Connect as “what happens next” from the step above
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={discuss}
              onChange={(e) => setDiscuss(e.target.checked)}
            />
            Discuss during Blueprint call
          </label>
          <button type="submit" className="rounded bg-[var(--accent)] px-3 py-2 text-sm text-white">
            Add step
          </button>
        </form>
      ) : null}
    </div>
  );
}

function PathsPhase({
  active,
  readOnly,
  stepName,
  onAdd,
  onRemove,
}: {
  active: ProcessView;
  readOnly: boolean;
  stepName: (id: string) => string;
  onAdd: (input: {
    sourceStepId: string;
    targetStepId: string;
    connectionType: ProcessConnectionType;
    displayLabel?: string;
    condition?: string;
    isDefaultPath?: boolean;
  }) => void;
  onRemove: (id: string) => void;
}) {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [type, setType] = useState<ProcessConnectionType>("NORMAL");
  const [label, setLabel] = useState("");
  const [condition, setCondition] = useState("");

  const sourceStep = active.steps.find((s) => s.id === source);
  const needsOutcomes =
    sourceStep?.stepType === "DECISION" || sourceStep?.stepType === "APPROVAL";

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--muted)]">
        Paths describe where work goes next — including decisions, approvals,
        parallel work, loops, and problems. Only add paths you know are real.
      </p>
      <ul className="space-y-2 text-sm">
        {active.connections.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--line)] px-3 py-2"
          >
            <span>
              <strong>{stepName(c.sourceStepId)}</strong>
              {" → "}
              <strong>{stepName(c.targetStepId)}</strong>
              <span className="ml-2 rounded bg-[var(--surface)] px-1.5 py-0.5 text-xs">
                {PATH_OPTIONS.find((p) => p.value === c.connectionType)?.label ??
                  c.connectionType}
              </span>
              {c.condition ? (
                <span className="block text-xs text-[var(--muted)]">
                  When: {c.condition}
                </span>
              ) : null}
            </span>
            {!readOnly ? (
              <button
                type="button"
                className="text-xs underline"
                onClick={() => {
                  if (window.confirm("Remove this path?")) onRemove(c.id);
                }}
              >
                Remove
              </button>
            ) : null}
          </li>
        ))}
      </ul>

      {!readOnly ? (
        <form
          className="space-y-2 rounded border border-dashed border-[var(--line)] p-3"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd({
              sourceStepId: source,
              targetStepId: target,
              connectionType: type,
              displayLabel: label || undefined,
              condition: condition || undefined,
              isDefaultPath: type === "NORMAL" || type === "CONDITIONAL",
            });
            setLabel("");
            setCondition("");
          }}
        >
          <p className="text-sm font-medium">Add a path</p>
          <label className="block text-sm">
            From step
            <select
              required
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1.5"
            >
              <option value="">Select…</option>
              {active.steps.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            To step
            <select
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1.5"
            >
              <option value="">Select…</option>
              {active.steps.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            What kind of path?
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ProcessConnectionType)}
              className="mt-1 w-full rounded border px-2 py-1.5"
            >
              {PATH_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          {needsOutcomes ? (
            <p className="text-xs text-[var(--muted)]">
              For decisions and approvals, add every real outcome (for example
              approved and rejected).
            </p>
          ) : null}
          <Field label="Label (optional)" value={label} onChange={setLabel} />
          <Field
            label="When does this path happen? (optional)"
            value={condition}
            onChange={setCondition}
          />
          <button type="submit" className="rounded bg-[var(--accent)] px-3 py-2 text-sm text-white">
            Add path
          </button>
        </form>
      ) : null}
    </div>
  );
}

function ReviewPhase({
  active,
  completeness,
  stepName,
  onRefresh,
}: {
  active: ProcessView;
  completeness: {
    scorePct: number;
    requiredOk: boolean;
    items: { code: string; label: string; level: string; ok: boolean }[];
  } | null;
  stepName: (id: string) => string;
  onRefresh: () => void;
}) {
  const sorted = [...active.steps].sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium text-[var(--navy)]">Review before submit</h3>
        <button type="button" className="text-sm underline" onClick={onRefresh}>
          Refresh checklist
        </button>
      </div>
      {completeness ? (
        <div
          className={`rounded border px-3 py-2 text-sm ${
            completeness.requiredOk
              ? "border-green-300 bg-green-50"
              : "border-amber-300 bg-amber-50"
          }`}
        >
          <p>
            Completeness: {completeness.scorePct}%
            {completeness.requiredOk
              ? " — ready to submit this process"
              : " — finish required items before submitting the form"}
          </p>
          <ul className="mt-2 list-disc pl-5">
            {completeness.items.map((i) => (
              <li key={i.code}>
                <span className="sr-only">{i.ok ? "Done: " : "Needed: "}</span>
                {i.ok ? "✓" : "○"} [{i.level}] {i.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className="rounded border border-[var(--line)] p-3 text-sm">
        <h4 className="font-medium">{active.name}</h4>
        <p className="mt-1 text-[var(--muted)]">
          Trigger: {active.startTrigger || "—"}
        </p>
        <p className="text-[var(--muted)]">
          Outcome: {active.outcome || active.endEvent || "—"}
        </p>
        <p className="mt-2 font-medium">Main sequence</p>
        <ol className="mt-1 list-decimal pl-5">
          {sorted.map((s) => (
            <li key={s.id}>
              {s.shortName}
              {s.discussDuringBlueprint ? " (discuss on call)" : ""}
            </li>
          ))}
        </ol>
        <p className="mt-2 font-medium">Paths</p>
        <ul className="mt-1 list-disc pl-5">
          {active.connections.map((c) => (
            <li key={c.id}>
              {stepName(c.sourceStepId)} → {stepName(c.targetStepId)} (
              {c.connectionType})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
  required,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  required?: boolean;
  multiline?: boolean;
  hint?: string;
}) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  return (
    <label className="block text-sm" htmlFor={id}>
      <span className="font-medium">{label}</span>
      {hint ? (
        <span className="mt-0.5 block text-xs text-[var(--muted)]">{hint}</span>
      ) : null}
      {multiline ? (
        <textarea
          id={id}
          required={required}
          readOnly={readOnly}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded border border-[var(--line)] px-3 py-2"
        />
      ) : (
        <input
          id={id}
          required={required}
          readOnly={readOnly}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded border border-[var(--line)] px-3 py-2"
        />
      )}
    </label>
  );
}
