"use client";

import { useState } from "react";
import Link from "next/link";
import type { loadWorkspaceAction } from "../../workspace-actions";

export type VersionMeta = {
  id: string;
  versionNumber: number;
  versionLabel: string | null;
  classification: string;
  status: string;
  parentVersionId: string | null;
  derivedFromVersionId: string | null;
};

export const STEP_LABELS: Record<string, string> = {
  TRIGGER: "Start",
  HUMAN_TASK: "Human task",
  AUTOMATED_TASK: "System / automated",
  COMMUNICATION: "Communication",
  DATA_ENTRY: "Data entry",
  DOCUMENT_CREATION: "Document",
  DECISION: "Decision",
  APPROVAL: "Approval",
  HANDOFF: "Handoff",
  WAITING_PERIOD: "Waiting",
  EXCEPTION: "Exception",
  SUBPROCESS: "Subprocess",
  PROCESS_END: "End",
};

export const CONN_LABELS: Record<string, string> = {
  NORMAL: "Next",
  CONDITIONAL: "If…",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  RETURNED_FOR_CORRECTION: "Needs correction",
  PARALLEL: "Also (parallel)",
  LOOP: "Returns to earlier step",
  REWORK: "Rework",
  ESCALATION: "Escalate",
  TIMEOUT: "Timed out",
  FAILURE: "Failed",
  TERMINATION: "Ends here",
};

export function PresentationSummary({
  data,
}: {
  data: NonNullable<
    Extract<Awaited<ReturnType<typeof loadWorkspaceAction>>, { ok: true }>
  >["data"] | null;
}) {
  if (!data?.version) return <p>No version loaded.</p>;
  return (
    <div className="space-y-3">
      <h2 className="text-lg text-[var(--navy)]">Blueprint presentation</h2>
      <p>
        <strong>Purpose:</strong> {data.version.purpose ?? data.process.purpose ?? "—"}
      </p>
      <p>
        <strong>Trigger:</strong> {data.version.startTrigger ?? "—"}
      </p>
      <p className="text-xs text-[var(--muted)]">
        Read-only. Destructive controls are hidden.
      </p>
      <div>
        <h3 className="font-medium">Pain points</h3>
        <ul className="mt-1 list-disc pl-5">
          {(data.version.painPoints ?? []).map((p) => (
            <li key={p.id}>
              {p.title} ({p.severity})
            </li>
          ))}
          {!data.version.painPoints?.length ? <li>None recorded</li> : null}
        </ul>
      </div>
      <div>
        <h3 className="font-medium">Metrics</h3>
        <ul className="mt-1 list-disc pl-5">
          {(data.version.metrics ?? []).map((m) => (
            <li key={m.id}>
              {m.name}: {m.currentValue ?? "—"} {m.unit ?? ""} (
              {m.dataSource})
            </li>
          ))}
          {!data.version.metrics?.length ? <li>None recorded</li> : null}
        </ul>
      </div>
      <div>
        <h3 className="font-medium">Opportunities</h3>
        <ul className="mt-1 list-disc pl-5">
          {(data.version.opportunities ?? []).map((o) => (
            <li key={o.id}>
              {o.title} · {o.priority} · {o.status}
            </li>
          ))}
          {!data.version.opportunities?.length ? <li>None captured</li> : null}
        </ul>
      </div>
      <Link href={`/ops/processes/${data.process.id}`} className="underline">
        Open diagnostic tables
      </Link>
    </div>
  );
}

export function InspectorPanel(props: {
  editable: boolean;
  selectedStep: {
    id: string;
    shortName: string;
    stepType: string;
    responsibleRole: string | null;
    department: string | null;
    toolOrSystem: string | null;
    discussDuringBlueprint: boolean;
    swimlaneId: string | null;
    detailedDescription: string | null;
  } | null;
  selectedEdgeId: string | null;
  edges: Array<{
    id: string;
    sourceStepId: string;
    targetStepId: string;
    connectionType: string;
    displayLabel: string | null;
  }>;
  steps: Array<{ id: string; shortName: string }>;
  lanes: Array<{ id: string; name: string }>;
  onUpdateStep: (id: string, patch: Record<string, unknown>) => void;
  onDeleteStep: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onAssignLane: (stepId: string, laneId: string | null) => void;
  onAddStep: () => void;
  onAddLane: () => void;
}) {
  const edge = props.edges.find((e) => e.id === props.selectedEdgeId);
  const stepName = new Map(props.steps.map((s) => [s.id, s.shortName]));

  return (
    <div className="space-y-4">
      {!props.editable ? (
        <p className="rounded border border-[var(--line)] bg-[var(--bg)] p-2 text-xs text-[var(--muted)]">
          Read-only version. Use “Refine this process” or “Create Future-State”
          to edit a new draft.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded bg-[var(--accent)] px-2 py-1 text-xs text-white"
            onClick={props.onAddStep}
          >
            Add step
          </button>
          <button
            type="button"
            className="rounded border border-[var(--line)] px-2 py-1 text-xs"
            onClick={props.onAddLane}
          >
            Add swimlane
          </button>
        </div>
      )}

      {props.selectedStep ? (
        <div className="space-y-2">
          <h2 className="font-medium text-[var(--navy)]">Selected step</h2>
          <label className="block text-xs">
            Name
            <input
              className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1"
              defaultValue={props.selectedStep.shortName}
              disabled={!props.editable}
              key={props.selectedStep.id + "-name"}
              onBlur={(e) =>
                props.editable &&
                props.onUpdateStep(props.selectedStep!.id, {
                  shortName: e.target.value,
                })
              }
            />
          </label>
          <label className="block text-xs">
            Role
            <input
              className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1"
              defaultValue={props.selectedStep.responsibleRole ?? ""}
              disabled={!props.editable}
              key={props.selectedStep.id + "-role"}
              onBlur={(e) =>
                props.editable &&
                props.onUpdateStep(props.selectedStep!.id, {
                  responsibleRole: e.target.value || null,
                })
              }
            />
          </label>
          <label className="block text-xs">
            Tool / system
            <input
              className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1"
              defaultValue={props.selectedStep.toolOrSystem ?? ""}
              disabled={!props.editable}
              key={props.selectedStep.id + "-tool"}
              onBlur={(e) =>
                props.editable &&
                props.onUpdateStep(props.selectedStep!.id, {
                  toolOrSystem: e.target.value || null,
                })
              }
            />
          </label>
          <label className="block text-xs">
            Swimlane
            <select
              className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1"
              value={props.selectedStep.swimlaneId ?? ""}
              disabled={!props.editable}
              onChange={(e) =>
                props.onAssignLane(
                  props.selectedStep!.id,
                  e.target.value || null,
                )
              }
            >
              <option value="">Unassigned</option>
              {props.lanes.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={props.selectedStep.discussDuringBlueprint}
              disabled={!props.editable}
              onChange={(e) =>
                props.onUpdateStep(props.selectedStep!.id, {
                  discussDuringBlueprint: e.target.checked,
                })
              }
            />
            Discuss during Blueprint call
          </label>
          {props.editable ? (
            <button
              type="button"
              className="text-xs text-[var(--danger)] underline"
              onClick={() => props.onDeleteStep(props.selectedStep!.id)}
            >
              Delete step
            </button>
          ) : null}
        </div>
      ) : edge ? (
        <div className="space-y-2">
          <h2 className="font-medium text-[var(--navy)]">Selected path</h2>
          <p>
            {stepName.get(edge.sourceStepId)} → {stepName.get(edge.targetStepId)}
          </p>
          <p className="text-[var(--muted)]">
            {CONN_LABELS[edge.connectionType] ?? edge.connectionType}
            {edge.displayLabel ? ` · ${edge.displayLabel}` : ""}
          </p>
          {props.editable ? (
            <button
              type="button"
              className="text-xs text-[var(--danger)] underline"
              onClick={() => props.onDeleteEdge(edge.id)}
            >
              Delete connection
            </button>
          ) : null}
        </div>
      ) : (
        <p className="text-[var(--muted)]">
          Select a step or path on the diagram. Drag between handles to connect
          steps when editing.
        </p>
      )}

      <div>
        <h3 className="font-medium">Swimlanes</h3>
        <ul className="mt-1 list-disc pl-5 text-xs">
          {props.lanes.map((l) => (
            <li key={l.id}>{l.name}</li>
          ))}
          {!props.lanes.length ? <li>Unassigned (default)</li> : null}
        </ul>
      </div>
    </div>
  );
}

export function AnalysisPanel(props: {
  editable: boolean;
  versionId: string;
  data: NonNullable<
    Extract<Awaited<ReturnType<typeof loadWorkspaceAction>>, { ok: true }>
  >["data"] | null;
  validation: {
    ok: boolean;
    issues: { message: string; severity: string }[];
    advisory?: { message: string; severity: string }[];
  } | null;
  onValidate: () => void;
  onAddPain: (input: {
    title: string;
    category?: "DELAY_WAITING" | "MANUAL_TRANSFER" | "ERROR_REWORK" | "OTHER";
    severity?: "LOW" | "MEDIUM" | "HIGH";
    processStepId?: string;
  }) => void;
  onAddMetric: (input: {
    name: string;
    currentValue?: string;
    unit?: string;
    dataSource?: "OWNER_ESTIMATE" | "CLIENT_PROVIDED" | "VERIFIED_MEASUREMENT";
  }) => void;
  onAddOpp: (input: {
    title: string;
    proposedChange?: string;
    category?: "AUTOMATE" | "SIMPLIFY" | "OTHER";
  }) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-medium text-[var(--navy)]">Validation</h2>
          <button
            type="button"
            className="text-xs underline"
            onClick={props.onValidate}
          >
            Run validation
          </button>
        </div>
        {props.validation ? (
          <ul className="mt-2 space-y-1 text-xs">
            {props.validation.issues.map((i, idx) => (
              <li
                key={idx}
                className={
                  i.severity === "error" ? "text-[var(--danger)]" : "text-[var(--muted)]"
                }
              >
                [{i.severity}] {i.message}
              </li>
            ))}
            {(props.validation.advisory ?? []).map((i, idx) => (
              <li key={`a-${idx}`} className="text-[var(--muted)]">
                [advisory] {i.message}
              </li>
            ))}
            {!props.validation.issues.length &&
            !(props.validation.advisory ?? []).length ? (
              <li>No issues</li>
            ) : null}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-[var(--muted)]">Not run yet.</p>
        )}
      </div>

      <div>
        <h2 className="font-medium text-[var(--navy)]">Pain points</h2>
        <ul className="mt-1 list-disc pl-5 text-xs">
          {(props.data?.version?.painPoints ?? []).map((p) => (
            <li key={p.id}>
              {p.title} · {p.category} · {p.severity}
            </li>
          ))}
        </ul>
        {props.editable ? (
          <button
            type="button"
            className="mt-2 text-xs underline"
            onClick={() => {
              const title = prompt("Pain point title");
              if (!title) return;
              props.onAddPain({
                title,
                category: "DELAY_WAITING",
                severity: "MEDIUM",
              });
            }}
          >
            Add pain point
          </button>
        ) : null}
      </div>

      <div>
        <h2 className="font-medium text-[var(--navy)]">Metrics</h2>
        <ul className="mt-1 list-disc pl-5 text-xs">
          {(props.data?.version?.metrics ?? []).map((m) => (
            <li key={m.id}>
              {m.name}: {m.currentValue ?? "—"} {m.unit ?? ""} · {m.dataSource}
            </li>
          ))}
        </ul>
        {props.editable ? (
          <button
            type="button"
            className="mt-2 text-xs underline"
            onClick={() => {
              const name = prompt("Metric name");
              if (!name) return;
              const currentValue = prompt("Current value") ?? undefined;
              props.onAddMetric({
                name,
                currentValue,
                unit: "minutes",
                dataSource: "OWNER_ESTIMATE",
              });
            }}
          >
            Add metric
          </button>
        ) : null}
      </div>

      <div>
        <h2 className="font-medium text-[var(--navy)]">
          Improvement opportunities
        </h2>
        <p className="text-[11px] text-[var(--muted)]">
          Owner judgment only — not AI recommendations, approved scope, or promised
          savings.
        </p>
        <ul className="mt-1 list-disc pl-5 text-xs">
          {(props.data?.version?.opportunities ?? []).map((o) => (
            <li key={o.id}>
              {o.title} · {o.status}
            </li>
          ))}
        </ul>
        {props.editable ? (
          <button
            type="button"
            className="mt-2 text-xs underline"
            onClick={() => {
              const title = prompt("Opportunity title");
              if (!title) return;
              props.onAddOpp({
                title,
                category: "SIMPLIFY",
                proposedChange: prompt("Proposed change") ?? undefined,
              });
            }}
          >
            Add opportunity
          </button>
        ) : null}
      </div>

      <div>
        <h2 className="font-medium text-[var(--navy)]">Blueprint items</h2>
        <ul className="mt-1 list-disc pl-5 text-xs">
          {(props.data?.version?.steps ?? [])
            .filter((s) => s.discussDuringBlueprint)
            .map((s) => (
              <li key={s.id}>{s.shortName}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export function ComparePanel(props: {
  versions: VersionMeta[];
  currentId: string;
  comparison: Record<string, unknown> | null;
  onCompare: (asIsId: string, futureId: string) => void;
}) {
  const asIs = props.versions.filter((v) => v.classification === "AS_IS");
  const future = props.versions.filter((v) => v.classification === "FUTURE_STATE");
  const [asIsId, setAsIsId] = useState(asIs.at(-1)?.id ?? "");
  const [futureId, setFutureId] = useState(
    future.find((v) => v.id === props.currentId)?.id ?? future.at(-1)?.id ?? "",
  );
  const c = props.comparison as {
    addedSteps?: { shortName: string }[];
    removedSteps?: { shortName: string }[];
    modifiedSteps?: { shortName: string; changes: string[] }[];
    retainedSteps?: { shortName: string }[];
    connectionChanges?: { added: number; removed: number };
    toolChanges?: { step: string; from: string | null; to: string | null }[];
  } | null;

  return (
    <div className="space-y-3">
      <h2 className="font-medium text-[var(--navy)]">As-Is vs Future-State</h2>
      <label className="block text-xs">
        As-Is
        <select
          className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1"
          value={asIsId}
          onChange={(e) => setAsIsId(e.target.value)}
        >
          {asIs.map((v) => (
            <option key={v.id} value={v.id}>
              v{v.versionNumber} · {v.status}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs">
        Future-State
        <select
          className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1"
          value={futureId}
          onChange={(e) => setFutureId(e.target.value)}
        >
          {future.map((v) => (
            <option key={v.id} value={v.id}>
              v{v.versionNumber} · {v.status}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="rounded bg-[var(--navy)] px-3 py-1.5 text-xs text-white"
        disabled={!asIsId || !futureId}
        onClick={() => props.onCompare(asIsId, futureId)}
      >
        Compare
      </button>
      {c ? (
        <div className="space-y-2 text-xs">
          <p>
            <strong>Added:</strong>{" "}
            {(c.addedSteps ?? []).map((s) => s.shortName).join(", ") || "—"}
          </p>
          <p>
            <strong>Removed:</strong>{" "}
            {(c.removedSteps ?? []).map((s) => s.shortName).join(", ") || "—"}
          </p>
          <p>
            <strong>Modified:</strong>{" "}
            {(c.modifiedSteps ?? [])
              .map((s) => `${s.shortName} (${s.changes.join("/")})`)
              .join(", ") || "—"}
          </p>
          <p>
            <strong>Retained:</strong> {(c.retainedSteps ?? []).length}
          </p>
          <p>
            <strong>Connections:</strong> +{c.connectionChanges?.added ?? 0} / −
            {c.connectionChanges?.removed ?? 0}
          </p>
          <p>
            <strong>Tool changes:</strong>{" "}
            {(c.toolChanges ?? [])
              .map((t) => `${t.step}: ${t.from ?? "—"} → ${t.to ?? "—"}`)
              .join("; ") || "—"}
          </p>
        </div>
      ) : null}
    </div>
  );
}
