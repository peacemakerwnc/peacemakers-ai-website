"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type MouseEvent,
} from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  type OnNodeDrag,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ProcessConnectionType, ProcessStepType } from "@prisma/client";
import {
  addConnectionAction,
  addStepAction,
  assignLaneAction,
  compareVersionsAction,
  createLaneAction,
  createMetricAction,
  createOpportunityAction,
  createPainPointAction,
  deleteConnectionAction,
  deleteStepAction,
  deriveFutureAction,
  loadWorkspaceAction,
  refineAction,
  savePositionsAction,
  updateStepAction,
  validateWorkspaceAction,
} from "../../workspace-actions";

type VersionMeta = {
  id: string;
  versionNumber: number;
  versionLabel: string | null;
  classification: string;
  status: string;
  parentVersionId: string | null;
  derivedFromVersionId: string | null;
};

type StepData = {
  id: string;
  shortName: string;
  stepType: ProcessStepType;
  responsibleRole: string | null;
  department: string | null;
  executionType: string;
  toolOrSystem: string | null;
  discussDuringBlueprint: boolean;
  swimlaneId: string | null;
  label: string;
};

const STEP_LABELS: Record<string, string> = {
  TRIGGER: "Trigger",
  HUMAN_TASK: "Human",
  AUTOMATED_TASK: "System",
  COMMUNICATION: "Message",
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

const CONN_LABELS: Record<string, string> = {
  NORMAL: "Next",
  CONDITIONAL: "If",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  RETURNED_FOR_CORRECTION: "Returned",
  PARALLEL: "Parallel",
  LOOP: "Loop",
  REWORK: "Rework",
  ESCALATION: "Escalate",
  TIMEOUT: "Timeout",
  FAILURE: "Failure",
  TERMINATION: "Ends",
};

function StepNode({ data, selected }: NodeProps<Node<StepData>>) {
  return (
    <div
      className={`min-w-[160px] max-w-[200px] rounded-md border bg-[var(--surface)] px-2 py-2 text-left shadow-sm ${
        selected
          ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
          : "border-[var(--line)]"
      }`}
      role="group"
      aria-label={`${data.shortName}, ${STEP_LABELS[data.stepType] ?? data.stepType}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[var(--navy)]" />
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
        {STEP_LABELS[data.stepType] ?? data.stepType}
        {data.discussDuringBlueprint ? " · Blueprint" : ""}
      </p>
      <p className="text-sm font-medium text-[var(--navy)]">{data.shortName}</p>
      <p className="mt-0.5 text-[11px] text-[var(--muted)]">
        {data.responsibleRole || data.department || data.executionType}
        {data.toolOrSystem ? ` · ${data.toolOrSystem}` : ""}
      </p>
      <Handle type="source" position={Position.Bottom} className="!bg-[var(--navy)]" />
    </div>
  );
}

const nodeTypes = { processStep: StepNode };

function autoLayout(
  steps: Array<{ id: string; displayOrder: number; canvasX: number | null; canvasY: number | null; swimlaneId: string | null }>,
  lanes: Array<{ id: string; displayOrder: number }>,
) {
  const laneIndex = new Map(lanes.map((l, i) => [l.id, i]));
  return steps.map((s, i) => {
    const row = laneIndex.get(s.swimlaneId ?? "") ?? lanes.length;
    return {
      x: s.canvasX ?? 80 + (s.displayOrder || i) * 220,
      y: s.canvasY ?? 60 + row * 160,
    };
  });
}

export function ProcessWorkspaceClient({
  processId,
  initialVersionId,
  versions,
  initialPresentation,
}: {
  processId: string;
  initialVersionId: string;
  versions: VersionMeta[];
  initialPresentation: boolean;
}) {
  const [versionId, setVersionId] = useState(initialVersionId);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saveState, setSaveState] = useState("Saved");
  const [presentation, setPresentation] = useState(initialPresentation);
  const [panel, setPanel] = useState<"inspector" | "analysis" | "compare">(
    "inspector",
  );
  const [overlay, setOverlay] = useState<string>("none");
  const [workspace, setWorkspace] = useState<Awaited<
    ReturnType<typeof loadWorkspaceAction>
  > | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [validation, setValidation] = useState<{
    ok: boolean;
    issues: { code: string; message: string; severity: string }[];
    advisory?: { code: string; message: string; severity: string }[];
  } | null>(null);
  const [comparison, setComparison] = useState<Record<string, unknown> | null>(
    null,
  );
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<StepData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [dirty, setDirty] = useState(false);

  const data = workspace?.ok ? workspace.data : null;
  const editable = Boolean(data?.editable) && !presentation;

  const reload = useCallback(
    (vid?: string) => {
      startTransition(async () => {
        setError(null);
        const res = await loadWorkspaceAction(processId, vid ?? versionId);
        setWorkspace(res);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        const v = res.data.version!;
        const lanes = v.swimlanes ?? [];
        const layout = autoLayout(v.steps, lanes);
        setNodes(
          v.steps.map((s, i) => ({
            id: s.id,
            type: "processStep",
            position: { x: layout[i].x, y: layout[i].y },
            data: {
              id: s.id,
              shortName: s.shortName,
              stepType: s.stepType,
              responsibleRole: s.responsibleRole,
              department: s.department,
              executionType: s.executionType,
              toolOrSystem: s.toolOrSystem,
              discussDuringBlueprint: s.discussDuringBlueprint,
              swimlaneId: s.swimlaneId,
              label: s.shortName,
            },
            draggable: res.data.editable && !presentation,
          })),
        );
        setEdges(
          v.connections.map((c) => ({
            id: c.id,
            source: c.sourceStepId,
            target: c.targetStepId,
            label: c.displayLabel || CONN_LABELS[c.connectionType] || c.connectionType,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: {
              stroke:
                c.connectionType === "FAILURE" ||
                c.connectionType === "ESCALATION" ||
                c.connectionType === "TIMEOUT"
                  ? "var(--danger)"
                  : c.connectionType === "APPROVED"
                    ? "var(--accent)"
                    : c.connectionType === "REJECTED" ||
                        c.connectionType === "RETURNED_FOR_CORRECTION"
                      ? "var(--warning)"
                      : "var(--navy)",
            },
            data: { connectionType: c.connectionType, condition: c.condition },
          })),
        );
        setDirty(false);
        setSaveState("Loaded");
      });
    },
    [processId, versionId, presentation, setNodes, setEdges],
  );

  useEffect(() => {
    reload(versionId);
  }, [versionId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const onNodeDragStop: OnNodeDrag = useCallback(() => {
    setDirty(true);
    setSaveState("Unsaved positions");
  }, []);

  const persistPositions = () => {
    if (!editable) return;
    startTransition(async () => {
      const positions = nodes.map((n) => ({
        stepId: n.id,
        canvasX: n.position.x,
        canvasY: n.position.y,
      }));
      const res = await savePositionsAction(versionId, positions);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDirty(false);
      setSaveState("Positions saved");
      setMessage("Node positions saved (presentation only).");
    });
  };

  const onConnect = (connection: Connection) => {
    if (!editable || !connection.source || !connection.target) return;
    startTransition(async () => {
      const res = await addConnectionAction(versionId, {
        sourceStepId: connection.source!,
        targetStepId: connection.target!,
        connectionType: "NORMAL" as ProcessConnectionType,
        isDefaultPath: true,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setMessage("Connection created.");
      reload();
    });
  };

  const selectedStep = useMemo(
    () => data?.version?.steps.find((s) => s.id === selectedStepId) ?? null,
    [data, selectedStepId],
  );

  const filteredEdges = useMemo(() => {
    if (overlay === "none") return edges;
    return edges.map((e) => {
      const t = String(e.data?.connectionType ?? "");
      const highlight =
        (overlay === "approvals" &&
          (t === "APPROVED" || t === "REJECTED" || t === "RETURNED_FOR_CORRECTION")) ||
        (overlay === "exceptions" &&
          (t === "FAILURE" || t === "ESCALATION" || t === "TIMEOUT")) ||
        (overlay === "parallel" && t === "PARALLEL") ||
        (overlay === "loops" && (t === "LOOP" || t === "REWORK"));
      return {
        ...e,
        style: {
          ...e.style,
          opacity: highlight || overlay === "none" ? 1 : 0.2,
          strokeWidth: highlight ? 2.5 : 1.5,
        },
      };
    });
  }, [edges, overlay]);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <section className="flex min-h-[55vh] flex-1 flex-col border-b border-[var(--line)] lg:border-b-0 lg:border-r">
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface)] px-4 py-3">
          <div>
            <h1 className="text-xl text-[var(--navy)]">
              {data?.process.name ?? "Process workspace"}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {data?.process.company.name}
              {data?.process.opportunity
                ? ` · ${data.process.opportunity.title}`
                : ""}{" "}
              · v{data?.version?.versionNumber} · {data?.version?.classification}{" "}
              · {data?.version?.status}
              {data?.version?.derivedFrom
                ? ` · from v${data.version.derivedFrom.versionNumber}`
                : ""}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]" aria-live="polite">
              Validation:{" "}
              {data?.validation?.ok === false
                ? "Issues found"
                : data?.validation?.ok
                  ? "PASS"
                  : "—"}{" "}
              · {saveState}
              {pending ? " · Working…" : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-[var(--muted)]">
              Version
              <select
                className="ml-2 rounded border border-[var(--line)] bg-white px-2 py-1 text-sm"
                value={versionId}
                onChange={(e) => {
                  if (dirty && !confirm("Discard unsaved position changes?")) {
                    return;
                  }
                  setVersionId(e.target.value);
                }}
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    v{v.versionNumber} · {v.classification} · {v.status}
                  </option>
                ))}
              </select>
            </label>
            {!presentation && data && !data.editable ? (
              <button
                type="button"
                className="rounded bg-[var(--accent)] px-3 py-1.5 text-sm text-white"
                onClick={() =>
                  startTransition(async () => {
                    const res = await refineAction(versionId);
                    if (!res.ok) {
                      setError(res.error);
                      return;
                    }
                    setMessage("Owner-refined draft created. Source unchanged.");
                    setVersionId(res.versionId);
                  })
                }
              >
                Refine this process
              </button>
            ) : null}
            {!presentation && data?.version?.classification === "AS_IS" ? (
              <button
                type="button"
                className="rounded border border-[var(--line)] px-3 py-1.5 text-sm"
                onClick={() =>
                  startTransition(async () => {
                    const res = await deriveFutureAction(versionId);
                    if (!res.ok) {
                      setError(res.error);
                      return;
                    }
                    setMessage("Future-State draft derived. As-Is unchanged.");
                    setVersionId(res.versionId);
                  })
                }
              >
                Create Future-State
              </button>
            ) : null}
            <button
              type="button"
              className="rounded border border-[var(--line)] px-3 py-1.5 text-sm"
              onClick={() => setPresentation((p) => !p)}
            >
              {presentation ? "Exit presentation" : "Presentation mode"}
            </button>
            {editable ? (
              <button
                type="button"
                className="rounded border border-[var(--line)] px-3 py-1.5 text-sm"
                onClick={persistPositions}
              >
                Save positions
              </button>
            ) : null}
          </div>
        </header>

        {error ? (
          <p className="bg-red-50 px-4 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="bg-green-50 px-4 py-2 text-sm text-green-900">{message}</p>
        ) : null}

        {!presentation ? (
          <div className="flex flex-wrap gap-2 border-b border-[var(--line)] px-4 py-2 text-xs">
            <span className="text-[var(--muted)]">Overlay:</span>
            {[
              ["none", "None"],
              ["approvals", "Approvals"],
              ["exceptions", "Exceptions"],
              ["parallel", "Parallel"],
              ["loops", "Loops/rework"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`rounded px-2 py-1 ${
                  overlay === id
                    ? "bg-[var(--navy)] text-white"
                    : "border border-[var(--line)]"
                }`}
                onClick={() => setOverlay(id)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="relative min-h-[420px] flex-1 bg-[#f3f5f7]">
          <ReactFlow
            nodes={nodes}
            edges={filteredEdges}
            onNodesChange={editable ? onNodesChange : undefined}
            onEdgesChange={editable ? onEdgesChange : undefined}
            onConnect={editable ? onConnect : undefined}
            onNodeDragStop={editable ? onNodeDragStop : undefined}
            onNodeClick={(_: MouseEvent, node: Node) => {
              setSelectedStepId(node.id);
              setSelectedEdgeId(null);
              setPanel("inspector");
            }}
            onEdgeClick={(_: MouseEvent, edge: Edge) => {
              setSelectedEdgeId(edge.id);
              setSelectedStepId(null);
              setPanel("inspector");
            }}
            nodeTypes={nodeTypes}
            fitView
            nodesDraggable={editable}
            nodesConnectable={editable}
            elementsSelectable
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={18} size={1} />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>

        {/* Structured fallback for accessibility / mobile */}
        <details className="border-t border-[var(--line)] bg-[var(--surface)] px-4 py-3 lg:hidden">
          <summary className="cursor-pointer text-sm font-medium">
            Structured process list (accessible fallback)
          </summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            {(data?.version?.steps ?? []).map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setSelectedStepId(s.id);
                    setPanel("inspector");
                  }}
                >
                  {s.shortName}
                </button>{" "}
                <span className="text-[var(--muted)]">
                  ({STEP_LABELS[s.stepType]})
                </span>
              </li>
            ))}
          </ol>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {(data?.version?.connections ?? []).map((c) => {
              const name = new Map(
                (data?.version?.steps ?? []).map((s) => [s.id, s.shortName]),
              );
              return (
                <li key={c.id}>
                  {name.get(c.sourceStepId)} → {name.get(c.targetStepId)} (
                  {CONN_LABELS[c.connectionType]})
                </li>
              );
            })}
          </ul>
        </details>
      </section>

      <aside className="flex w-full flex-col border-t border-[var(--line)] bg-[var(--surface)] lg:w-[360px] lg:border-t-0">
        <nav
          className="flex gap-1 border-b border-[var(--line)] p-2"
          aria-label="Workspace panels"
        >
          {(
            [
              ["inspector", "Inspector"],
              ["analysis", "Analysis"],
              ["compare", "Compare"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`flex-1 rounded px-2 py-1.5 text-sm ${
                panel === id
                  ? "bg-[var(--navy)] text-white"
                  : "border border-[var(--line)]"
              }`}
              onClick={() => setPanel(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
          {presentation ? (
            <PresentationSummary data={data} />
          ) : panel === "inspector" ? (
            <InspectorPanel
              editable={editable}
              selectedStep={selectedStep}
              selectedEdgeId={selectedEdgeId}
              edges={data?.version?.connections ?? []}
              steps={data?.version?.steps ?? []}
              lanes={data?.version?.swimlanes ?? []}
              onUpdateStep={(id, patch) =>
                startTransition(async () => {
                  const res = await updateStepAction(id, patch);
                  if (!res.ok) setError(res.error);
                  else {
                    setMessage("Step updated.");
                    reload();
                  }
                })
              }
              onDeleteStep={(id) =>
                startTransition(async () => {
                  if (!confirm("Delete this step? Connected paths may block deletion."))
                    return;
                  const res = await deleteStepAction(id, true);
                  if (!res.ok) setError(res.error);
                  else {
                    setSelectedStepId(null);
                    reload();
                  }
                })
              }
              onDeleteEdge={(id) =>
                startTransition(async () => {
                  if (!confirm("Delete this connection?")) return;
                  const res = await deleteConnectionAction(id);
                  if (!res.ok) setError(res.error);
                  else reload();
                })
              }
              onAssignLane={(stepId, laneId) =>
                startTransition(async () => {
                  const res = await assignLaneAction(stepId, laneId);
                  if (!res.ok) setError(res.error);
                  else reload();
                })
              }
              onAddStep={() =>
                startTransition(async () => {
                  const res = await addStepAction(versionId, {
                    shortName: "New step",
                    stepType: "HUMAN_TASK",
                    canvasX: 120,
                    canvasY: 120,
                  });
                  if (!res.ok) setError(res.error);
                  else {
                    setSelectedStepId(res.step.id);
                    reload();
                  }
                })
              }
              onAddLane={() =>
                startTransition(async () => {
                  const name = prompt("Lane name (role or department)");
                  if (!name) return;
                  const res = await createLaneAction(versionId, {
                    name,
                    kind: "ROLE",
                  });
                  if (!res.ok) setError(res.error);
                  else reload();
                })
              }
            />
          ) : panel === "analysis" ? (
            <AnalysisPanel
              editable={editable}
              versionId={versionId}
              data={data}
              validation={validation}
              onValidate={() =>
                startTransition(async () => {
                  const res = await validateWorkspaceAction(versionId);
                  if (!res.ok) setError(res.error);
                  else setValidation(res.result);
                })
              }
              onAddPain={(input) =>
                startTransition(async () => {
                  const res = await createPainPointAction(versionId, input);
                  if (!res.ok) setError(res.error);
                  else {
                    setMessage("Pain point recorded.");
                    reload();
                  }
                })
              }
              onAddMetric={(input) =>
                startTransition(async () => {
                  const res = await createMetricAction(versionId, input);
                  if (!res.ok) setError(res.error);
                  else {
                    setMessage("Metric recorded.");
                    reload();
                  }
                })
              }
              onAddOpp={(input) =>
                startTransition(async () => {
                  const res = await createOpportunityAction(versionId, input);
                  if (!res.ok) setError(res.error);
                  else {
                    setMessage("Improvement opportunity captured (not approved scope).");
                    reload();
                  }
                })
              }
            />
          ) : (
            <ComparePanel
              versions={versions}
              currentId={versionId}
              comparison={comparison}
              onCompare={(asIs, future) =>
                startTransition(async () => {
                  const res = await compareVersionsAction(asIs, future);
                  if (!res.ok) setError(res.error);
                  else setComparison(res.comparison as never);
                })
              }
            />
          )}
        </div>
      </aside>
    </div>
  );
}

function PresentationSummary({
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

function InspectorPanel(props: {
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

function AnalysisPanel(props: {
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

function ComparePanel(props: {
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
