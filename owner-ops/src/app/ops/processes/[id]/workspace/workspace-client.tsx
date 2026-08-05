"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Handle,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  type OnEdgesChange,
  type OnNodeDrag,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ProcessConnectionType, ProcessStepType } from "@prisma/client";
import type { RelatedProcessCard } from "@/lib/process-workspace";
import {
  computeAutoArrangePositions,
  computePrimaryPath,
  isSecondaryConnection,
  plainConnectionLabel,
  versionHasManualLayout,
} from "@/lib/process-map-layout";
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
import {
  AnalysisPanel,
  ComparePanel,
  InspectorPanel,
  PresentationSummary,
  STEP_LABELS,
  type VersionMeta,
} from "./workspace-panels";

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
  primaryNumber: number | null;
  detailLevel: DetailLevel;
};

type DetailLevel = "overview" | "standard" | "detailed";
type ViewMode = "all" | "process";

type MapFilters = {
  primaryOnly: boolean;
  showExceptions: boolean;
  showApprovals: boolean;
  showLoops: boolean;
  showParallel: boolean;
  blueprintOnly: boolean;
  painPointSteps: boolean;
  opportunitySteps: boolean;
  swimlaneId: string;
};

const DEFAULT_FILTERS: MapFilters = {
  primaryOnly: false,
  showExceptions: true,
  showApprovals: true,
  showLoops: true,
  showParallel: true,
  blueprintOnly: false,
  painPointSteps: false,
  opportunitySteps: false,
  swimlaneId: "",
};

function StepNode({ data, selected }: NodeProps<Node<StepData>>) {
  const shapeHint =
    data.stepType === "TRIGGER" || data.stepType === "PROCESS_END"
      ? "rounded-full"
      : data.stepType === "DECISION" || data.stepType === "APPROVAL"
        ? "rounded-lg border-dashed"
        : "rounded-md";
  const showMeta = data.detailLevel !== "overview";
  const showDetail = data.detailLevel === "detailed";
  return (
    <div
      className={`min-w-[168px] max-w-[210px] border bg-[var(--surface)] px-2.5 py-2 text-left shadow-sm ${shapeHint} ${
        selected
          ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
          : data.stepType === "TRIGGER" || data.stepType === "PROCESS_END"
            ? "border-[var(--navy)]"
            : "border-[var(--line)]"
      }`}
      role="group"
      aria-label={`${data.primaryNumber ? `Step ${data.primaryNumber}, ` : ""}${data.shortName}, ${STEP_LABELS[data.stepType] ?? data.stepType}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-[var(--navy)]"
        aria-label="Incoming path"
      />
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
        {data.primaryNumber != null ? `${data.primaryNumber}. ` : ""}
        {data.stepType === "TRIGGER"
          ? "Start"
          : data.stepType === "PROCESS_END"
            ? "End"
            : (STEP_LABELS[data.stepType] ?? data.stepType)}
        {showDetail && data.discussDuringBlueprint ? " · Blueprint" : ""}
      </p>
      <p className="text-sm font-medium leading-snug text-[var(--navy)]">
        {data.shortName}
      </p>
      {showMeta ? (
        <p className="mt-0.5 text-[11px] text-[var(--muted)]">
          {data.responsibleRole || data.department || "Unassigned"}
          {showDetail && data.toolOrSystem ? ` · ${data.toolOrSystem}` : ""}
          {showDetail ? ` · ${data.executionType}` : ""}
        </p>
      ) : null}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-[var(--navy)]"
        aria-label="Outgoing path"
      />
    </div>
  );
}

const nodeTypes = { processStep: StepNode };

function MapCanvas({
  editable,
  presentation,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDragStop,
  onNodeClick,
  onEdgeClick,
  fitToken,
}: {
  editable: boolean;
  presentation: boolean;
  nodes: Node<StepData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node<StepData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: (c: Connection) => void;
  onNodeDragStop: OnNodeDrag;
  onNodeClick: (e: MouseEvent, n: Node) => void;
  onEdgeClick: (e: MouseEvent, edge: Edge) => void;
  fitToken: number;
}) {
  const { fitView, zoomIn, zoomOut, setViewport } = useReactFlow();
  useEffect(() => {
    if (fitToken > 0) {
      void fitView({ padding: 0.2, duration: 280 });
    }
  }, [fitToken, fitView]);

  return (
    <div className="relative hidden min-h-[420px] flex-1 bg-[#eef1f4] md:block">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={editable ? onNodesChange : undefined}
        onEdgesChange={editable ? onEdgesChange : undefined}
        onConnect={editable ? onConnect : undefined}
        onNodeDragStop={editable ? onNodeDragStop : undefined}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={editable && !presentation}
        nodesConnectable={editable && !presentation}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
        }}
      >
        <Background gap={20} size={1} color="#d5dbe3" />
        <Controls showInteractive={false} aria-label="Map zoom controls" />
        <MiniMap pannable zoomable aria-label="Process minimap" />
      </ReactFlow>
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
        <button
          type="button"
          className="rounded border border-[var(--line)] bg-white px-2 py-1 text-xs shadow-sm"
          onClick={() => void fitView({ padding: 0.2, duration: 200 })}
        >
          Fit process
        </button>
        <button
          type="button"
          className="rounded border border-[var(--line)] bg-white px-2 py-1 text-xs shadow-sm"
          onClick={() => zoomIn({ duration: 150 })}
        >
          Zoom in
        </button>
        <button
          type="button"
          className="rounded border border-[var(--line)] bg-white px-2 py-1 text-xs shadow-sm"
          onClick={() => zoomOut({ duration: 150 })}
        >
          Zoom out
        </button>
        <button
          type="button"
          className="rounded border border-[var(--line)] bg-white px-2 py-1 text-xs shadow-sm"
          onClick={() =>
            void setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 200 })
          }
        >
          Reset view
        </button>
      </div>
    </div>
  );
}

export function ProcessWorkspaceClient({
  processId,
  initialVersionId,
  versions,
  relatedProcesses,
  initialView,
  initialPresentation,
}: {
  processId: string;
  initialVersionId: string;
  versions: VersionMeta[];
  relatedProcesses: RelatedProcessCard[];
  initialView: ViewMode;
  initialPresentation: boolean;
}) {
  const router = useRouter();
  const processNavRef = useRef<HTMLDivElement>(null);
  const [versionId, setVersionId] = useState(initialVersionId);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saveState, setSaveState] = useState("Saved");
  const [presentation, setPresentation] = useState(initialPresentation);
  const [panel, setPanel] = useState<"inspector" | "analysis" | "compare">(
    "inspector",
  );
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("standard");
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
  const [legendOpen, setLegendOpen] = useState(false);
  const [focusLaneId, setFocusLaneId] = useState<string>("");
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
  const [fitToken, setFitToken] = useState(0);
  const [related] = useState(relatedProcesses);

  const data = workspace?.ok ? workspace.data : null;
  const editable = Boolean(data?.editable) && !presentation;

  const processIndex = related.findIndex((p) => p.id === processId);
  const prevProcess = processIndex > 0 ? related[processIndex - 1] : null;
  const nextProcess =
    processIndex >= 0 && processIndex < related.length - 1
      ? related[processIndex + 1]
      : null;

  const syncUrl = useCallback(
    (opts: {
      view?: ViewMode;
      version?: string;
      present?: boolean;
      process?: string;
    }) => {
      const pid = opts.process ?? processId;
      const params = new URLSearchParams();
      const view = opts.view ?? viewMode;
      params.set("view", view);
      const ver = opts.version ?? versionId;
      if (ver) params.set("version", ver);
      if (opts.present ?? presentation) params.set("mode", "present");
      router.replace(`/ops/processes/${pid}/workspace?${params.toString()}`, {
        scroll: false,
      });
    },
    [processId, presentation, router, versionId, viewMode],
  );

  const openProcess = (id: string, version?: string | null) => {
    if (dirty && !confirm("Discard unsaved position changes?")) return;
    if (id === processId) {
      setViewMode("process");
      if (version && version !== versionId) setVersionId(version);
      syncUrl({ view: "process", version: version ?? versionId, process: id });
      setFitToken((t) => t + 1);
      return;
    }
    const params = new URLSearchParams();
    params.set("view", "process");
    if (version) params.set("version", version);
    if (presentation) params.set("mode", "present");
    router.push(`/ops/processes/${id}/workspace?${params.toString()}`);
  };

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
        const { numbered } = computePrimaryPath(v.steps, v.connections);
        const positions = v.steps.map((s, i) => {
          if (s.canvasX != null && s.canvasY != null) {
            return { x: s.canvasX, y: s.canvasY };
          }
          const arranged = computeAutoArrangePositions(
            v.steps,
            v.connections,
            v.swimlanes ?? [],
          );
          const hit = arranged[i];
          return { x: hit?.canvasX ?? 80 + i * 220, y: hit?.canvasY ?? 60 };
        });

        setNodes(
          v.steps.map((s, i) => ({
            id: s.id,
            type: "processStep",
            position: positions[i]!,
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
              primaryNumber: numbered.get(s.id) ?? null,
              detailLevel,
            },
            draggable: res.data.editable && !presentation,
          })),
        );
        setEdges(
          v.connections.map((c) => {
            const secondary = isSecondaryConnection(c.connectionType);
            return {
              id: c.id,
              source: c.sourceStepId,
              target: c.targetStepId,
              type: "smoothstep",
              label: plainConnectionLabel(
                c.connectionType,
                c.displayLabel,
                c.condition,
              ),
              labelStyle: {
                fontSize: 11,
                fill: "var(--text)",
                fontWeight: secondary ? 500 : 600,
              },
              labelBgStyle: { fill: "#f8fafc", fillOpacity: 0.92 },
              labelBgPadding: [4, 6] as [number, number],
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: secondary ? 14 : 18,
                height: secondary ? 14 : 18,
                color: secondary ? "var(--muted)" : "var(--navy)",
              },
              style: {
                stroke: secondary
                  ? c.connectionType === "FAILURE" ||
                    c.connectionType === "ESCALATION"
                    ? "var(--danger)"
                    : "var(--muted)"
                  : "var(--navy)",
                strokeWidth: secondary ? 1.4 : 2.4,
                strokeDasharray:
                  c.connectionType === "LOOP" || c.connectionType === "REWORK"
                    ? "6 4"
                    : c.connectionType === "CONDITIONAL"
                      ? "4 3"
                      : undefined,
              },
              data: {
                connectionType: c.connectionType,
                condition: c.condition,
                isDefaultPath: c.isDefaultPath,
                secondary,
              },
            };
          }),
        );
        setDirty(false);
        setSaveState("Loaded");
        setFitToken((t) => t + 1);
      });
    },
    [processId, versionId, presentation, detailLevel, setNodes, setEdges],
  );

  useEffect(() => {
    if (viewMode === "process") reload(versionId);
  }, [versionId, viewMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        data: { ...n.data, detailLevel },
        draggable: editable,
      })),
    );
  }, [detailLevel, editable, setNodes]);

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

  const runAutoArrange = () => {
    if (!editable || !data?.version) return;
    const hasManual = versionHasManualLayout(data.version.steps);
    if (
      hasManual &&
      !confirm(
        "Auto Arrange will replace the saved manual layout for this draft. Process connections will not change. Continue?",
      )
    ) {
      return;
    }
    const arranged = computeAutoArrangePositions(
      data.version.steps,
      data.version.connections,
      data.version.swimlanes ?? [],
    );
    const byId = new Map(arranged.map((p) => [p.stepId, p]));
    setNodes((ns) =>
      ns.map((n) => {
        const p = byId.get(n.id);
        return p
          ? { ...n, position: { x: p.canvasX, y: p.canvasY } }
          : n;
      }),
    );
    setDirty(true);
    setSaveState("Unsaved auto-arrange");
    setMessage(
      "Auto Arrange applied to presentation positions only. Save to persist. Connections unchanged.",
    );
    setFitToken((t) => t + 1);
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

  const primary = useMemo(() => {
    if (!data?.version) return { orderedIds: [] as string[], numbered: new Map() };
    return computePrimaryPath(data.version.steps, data.version.connections);
  }, [data]);

  const painStepIds = useMemo(
    () =>
      new Set(
        (data?.version?.painPoints ?? [])
          .map((p) => p.processStepId)
          .filter(Boolean) as string[],
      ),
    [data],
  );
  const oppStepIds = useMemo(
    () =>
      new Set(
        (data?.version?.opportunities ?? [])
          .map((o) => o.processStepId)
          .filter(Boolean) as string[],
      ),
    [data],
  );

  const filtersActive = useMemo(() => {
    return (
      filters.primaryOnly ||
      !filters.showExceptions ||
      !filters.showApprovals ||
      !filters.showLoops ||
      !filters.showParallel ||
      filters.blueprintOnly ||
      filters.painPointSteps ||
      filters.opportunitySteps ||
      Boolean(filters.swimlaneId) ||
      Boolean(focusLaneId)
    );
  }, [filters, focusLaneId]);

  const visibleNodes = useMemo(() => {
    return nodes.map((n) => {
      let hidden = false;
      if (focusLaneId && n.data.swimlaneId !== focusLaneId) hidden = true;
      if (filters.swimlaneId && n.data.swimlaneId !== filters.swimlaneId)
        hidden = true;
      if (filters.blueprintOnly && !n.data.discussDuringBlueprint) hidden = true;
      if (filters.painPointSteps && !painStepIds.has(n.id)) hidden = true;
      if (filters.opportunitySteps && !oppStepIds.has(n.id)) hidden = true;
      if (filters.primaryOnly && !primary.numbered.has(n.id)) {
        // keep branch origins visible lightly
        hidden = true;
      }
      return {
        ...n,
        hidden,
        style: { ...n.style, opacity: hidden ? 0.15 : 1 },
      };
    });
  }, [nodes, filters, focusLaneId, painStepIds, oppStepIds, primary.numbered]);

  const visibleEdges = useMemo(() => {
    const showLabel = detailLevel !== "overview";
    return edges.map((e) => {
      const t = String(e.data?.connectionType ?? "");
      let hide = false;
      if (filters.primaryOnly) {
        const isPrimaryEdge =
          e.data?.isDefaultPath ||
          t === "NORMAL" ||
          (t === "APPROVED" && !isSecondaryConnection(t));
        if (isSecondaryConnection(t) || t === "CONDITIONAL" || t === "PARALLEL") {
          if (!(t === "NORMAL" || (Boolean(e.data?.isDefaultPath) && t !== "LOOP"))) {
            hide = !isPrimaryEdge || isSecondaryConnection(t) || t === "PARALLEL";
          }
        }
        if (isSecondaryConnection(t) || t === "PARALLEL" || t === "CONDITIONAL") {
          hide = true;
        }
      }
      if (
        !filters.showExceptions &&
        (t === "FAILURE" || t === "ESCALATION" || t === "TIMEOUT" || t === "TERMINATION")
      )
        hide = true;
      if (
        !filters.showApprovals &&
        (t === "APPROVED" || t === "REJECTED" || t === "RETURNED_FOR_CORRECTION")
      )
        hide = true;
      if (!filters.showLoops && (t === "LOOP" || t === "REWORK")) hide = true;
      if (!filters.showParallel && t === "PARALLEL") hide = true;

      const sourceHidden = visibleNodes.find((n) => n.id === e.source)?.hidden;
      const targetHidden = visibleNodes.find((n) => n.id === e.target)?.hidden;
      if (sourceHidden || targetHidden) hide = true;

      return {
        ...e,
        hidden: hide,
        label: showLabel ? e.label : undefined,
        style: {
          ...e.style,
          opacity: hide ? 0.08 : 1,
        },
      };
    });
  }, [edges, filters, detailLevel, visibleNodes]);

  const setView = (mode: ViewMode) => {
    if (dirty && mode === "all" && !confirm("Discard unsaved position changes?"))
      return;
    setViewMode(mode);
    syncUrl({ view: mode });
    if (mode === "process") setFitToken((t) => t + 1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-[var(--line)] bg-[var(--surface)] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--navy)]">
              {viewMode === "all"
                ? "All processes"
                : (data?.process.name ?? "Process map")}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {data?.process.company.name ?? related[0]?.companyName ?? ""}
              {data?.process.opportunity
                ? ` · ${data.process.opportunity.title}`
                : ""}
              {viewMode === "process"
                ? ` · v${data?.version?.versionNumber ?? "—"} · ${data?.version?.classification ?? ""} · ${data?.version?.status ?? ""}`
                : ` · ${related.length} process${related.length === 1 ? "" : "es"}`}
            </p>
            {viewMode === "process" && data?.version?.purpose ? (
              <p className="mt-1 max-w-3xl text-sm text-[var(--text)]">
                {data.version.purpose}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-[var(--muted)]" aria-live="polite">
              View: {viewMode === "all" ? "All processes" : "Individual process"}
              {presentation ? " · Presentation (read-only)" : ""}
              {editable ? " · Editable draft" : " · Read-only"}
              {" · "}
              {saveState}
              {pending ? " · Working…" : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Process view"
              className="flex rounded border border-[var(--line)] p-0.5"
            >
              <button
                type="button"
                aria-pressed={viewMode === "all"}
                className={`rounded px-3 py-1.5 text-sm ${
                  viewMode === "all"
                    ? "bg-[var(--navy)] text-white"
                    : "text-[var(--text)]"
                }`}
                onClick={() => setView("all")}
              >
                All processes
              </button>
              <button
                type="button"
                aria-pressed={viewMode === "process"}
                className={`rounded px-3 py-1.5 text-sm ${
                  viewMode === "process"
                    ? "bg-[var(--navy)] text-white"
                    : "text-[var(--text)]"
                }`}
                onClick={() => setView("process")}
              >
                This process
              </button>
            </div>
            <button
              type="button"
              className="rounded border border-[var(--line)] px-3 py-1.5 text-sm"
              onClick={() => {
                const next = !presentation;
                setPresentation(next);
                syncUrl({ present: next });
              }}
            >
              {presentation ? "Exit presentation" : "Presentation"}
            </button>
          </div>
        </div>

        <div
          ref={processNavRef}
          className="mt-3 flex flex-wrap items-end gap-3"
          aria-label="Process selector"
        >
          <label className="text-xs text-[var(--muted)]">
            Open process
            <select
              className="ml-2 min-w-[220px] rounded border border-[var(--line)] bg-white px-2 py-1.5 text-sm text-[var(--text)]"
              value={processId}
              aria-current={viewMode === "process" ? "page" : undefined}
              onChange={(e) => {
                const card = related.find((p) => p.id === e.target.value);
                openProcess(e.target.value, card?.versionId);
              }}
            >
              {related.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          {viewMode === "process" ? (
            <>
              <button
                type="button"
                className="rounded border border-[var(--line)] px-2 py-1.5 text-xs"
                disabled={!prevProcess}
                onClick={() =>
                  prevProcess &&
                  openProcess(prevProcess.id, prevProcess.versionId)
                }
              >
                Previous process
              </button>
              <button
                type="button"
                className="rounded border border-[var(--line)] px-2 py-1.5 text-xs"
                disabled={!nextProcess}
                onClick={() =>
                  nextProcess &&
                  openProcess(nextProcess.id, nextProcess.versionId)
                }
              >
                Next process
              </button>
              <button
                type="button"
                className="rounded border border-[var(--line)] px-2 py-1.5 text-xs"
                onClick={() => setView("all")}
              >
                Return to all processes
              </button>
              <label className="text-xs text-[var(--muted)]">
                Version
                <select
                  className="ml-2 rounded border border-[var(--line)] bg-white px-2 py-1 text-sm"
                  value={versionId}
                  onChange={(e) => {
                    if (dirty && !confirm("Discard unsaved position changes?"))
                      return;
                    setVersionId(e.target.value);
                    syncUrl({ version: e.target.value, view: "process" });
                  }}
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      v{v.versionNumber} · {v.classification} · {v.status}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : null}
        </div>
      </header>

      {error ? (
        <p className="bg-red-50 px-4 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="bg-green-50 px-4 py-2 text-sm text-green-900" role="status">
          {message}
        </p>
      ) : null}

      {viewMode === "all" ? (
        <LandscapeView
          processes={related}
          currentId={processId}
          presentation={presentation}
          onOpen={(id, versionId) => openProcess(id, versionId)}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <section className="flex min-h-[50vh] flex-1 flex-col border-b border-[var(--line)] lg:border-b-0 lg:border-r">
            {!presentation ? (
              <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] px-4 py-2 text-xs">
                {!data?.editable ? (
                  <button
                    type="button"
                    className="rounded bg-[var(--accent)] px-3 py-1.5 text-white"
                    onClick={() =>
                      startTransition(async () => {
                        const res = await refineAction(versionId);
                        if (!res.ok) {
                          setError(res.error);
                          return;
                        }
                        setMessage("Owner-refined draft created. Source unchanged.");
                        setVersionId(res.versionId);
                        syncUrl({ version: res.versionId, view: "process" });
                      })
                    }
                  >
                    Refine this process
                  </button>
                ) : null}
                {data?.version?.classification === "AS_IS" ? (
                  <button
                    type="button"
                    className="rounded border border-[var(--line)] px-3 py-1.5"
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
                {editable ? (
                  <>
                    <button
                      type="button"
                      className="rounded border border-[var(--line)] px-3 py-1.5"
                      onClick={persistPositions}
                    >
                      Save positions
                    </button>
                    <button
                      type="button"
                      className="rounded border border-[var(--line)] px-3 py-1.5"
                      onClick={runAutoArrange}
                    >
                      Auto arrange
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}

            <div
              className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] px-4 py-2 text-xs"
              role="group"
              aria-label="Detail level"
            >
              <span className="text-[var(--muted)]">Detail:</span>
              {(
                [
                  ["overview", "Overview"],
                  ["standard", "Standard"],
                  ["detailed", "Detailed"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={detailLevel === id}
                  className={`rounded px-2 py-1 ${
                    detailLevel === id
                      ? "bg-[var(--navy)] text-white"
                      : "border border-[var(--line)]"
                  }`}
                  onClick={() => setDetailLevel(id)}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                className="ml-auto rounded border border-[var(--line)] px-2 py-1"
                aria-expanded={legendOpen}
                onClick={() => setLegendOpen((o) => !o)}
              >
                {legendOpen ? "Hide legend" : "Show legend"}
              </button>
            </div>

            {legendOpen ? <PlainLanguageLegend /> : null}

            <div
              className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] px-4 py-2 text-xs"
              role="group"
              aria-label="Map filters"
            >
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={filters.primaryOnly}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, primaryOnly: e.target.checked }))
                  }
                />
                Primary path
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={filters.showExceptions}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      showExceptions: e.target.checked,
                    }))
                  }
                />
                Exceptions
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={filters.showApprovals}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      showApprovals: e.target.checked,
                    }))
                  }
                />
                Approvals
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={filters.showLoops}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, showLoops: e.target.checked }))
                  }
                />
                Loops / rework
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={filters.showParallel}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      showParallel: e.target.checked,
                    }))
                  }
                />
                Parallel
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={filters.blueprintOnly}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      blueprintOnly: e.target.checked,
                    }))
                  }
                />
                Blueprint items
              </label>
              <label className="text-[var(--muted)]">
                Lane
                <select
                  className="ml-1 rounded border border-[var(--line)] px-1 py-0.5"
                  value={focusLaneId || filters.swimlaneId}
                  onChange={(e) => {
                    setFocusLaneId(e.target.value);
                    setFilters((f) => ({ ...f, swimlaneId: e.target.value }));
                  }}
                >
                  <option value="">All lanes</option>
                  {(data?.version?.swimlanes ?? []).map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="rounded border border-[var(--line)] px-2 py-1"
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  setFocusLaneId("");
                }}
              >
                Reset filters
              </button>
              {filtersActive ? (
                <span
                  className="rounded bg-[var(--warning)]/15 px-2 py-1 text-[var(--warning)]"
                  role="status"
                  aria-live="polite"
                >
                  Some steps or paths are hidden by filters
                </span>
              ) : null}
            </div>

            {primary.orderedIds.length ? (
              <nav
                className="flex gap-1 overflow-x-auto border-b border-[var(--line)] px-4 py-2 text-xs"
                aria-label="Main path orientation"
              >
                <span className="shrink-0 text-[var(--muted)]">Main path:</span>
                {primary.orderedIds.map((id, i) => {
                  const step = data?.version?.steps.find((s) => s.id === id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`shrink-0 rounded border px-2 py-1 ${
                        selectedStepId === id
                          ? "border-[var(--accent)] bg-[var(--accent)]/10"
                          : "border-[var(--line)]"
                      }`}
                      onClick={() => {
                        setSelectedStepId(id);
                        setPanel("inspector");
                      }}
                    >
                      {i + 1}. {step?.shortName ?? id}
                    </button>
                  );
                })}
                <span className="shrink-0 text-[var(--muted)]">
                  (Branches are labeled by outcome — not numbered.)
                </span>
              </nav>
            ) : null}

            <ReactFlowProvider>
              <MapCanvas
                editable={editable}
                presentation={presentation}
                nodes={visibleNodes}
                edges={visibleEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={onNodeDragStop}
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
                fitToken={fitToken}
              />
            </ReactFlowProvider>

            <details
              className="border-t border-[var(--line)] bg-[var(--surface)] px-4 py-3"
              open
            >
              <summary className="cursor-pointer text-sm font-medium md:hidden">
                Structured process list (mobile / accessible)
              </summary>
              <div className="mt-2 hidden md:block">
                <p className="text-xs text-[var(--muted)]">
                  Structured equivalent of the map (always available to screen
                  readers):
                </p>
              </div>
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
                      {primary.numbered.get(s.id)
                        ? `${primary.numbered.get(s.id)}. `
                        : ""}
                      {s.shortName}
                    </button>{" "}
                    <span className="text-[var(--muted)]">
                      ({STEP_LABELS[s.stepType]})
                      {s.responsibleRole ? ` · ${s.responsibleRole}` : ""}
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
                      {plainConnectionLabel(
                        c.connectionType,
                        c.displayLabel,
                        c.condition,
                      )}
                      )
                    </li>
                  );
                })}
              </ul>
            </details>
          </section>

          <aside
            className={`flex w-full flex-col border-t border-[var(--line)] bg-[var(--surface)] lg:w-[360px] lg:border-t-0 ${
              presentation ? "" : ""
            }`}
          >
            {presentation ? (
              <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
                <PresentationSummary data={data} />
                <button
                  type="button"
                  className="rounded border border-[var(--line)] px-3 py-1.5 text-xs"
                  onClick={() => setView("all")}
                >
                  Back to all processes
                </button>
              </div>
            ) : (
              <>
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
                  {panel === "inspector" ? (
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
                          if (
                            !confirm(
                              "Delete this step? Connected paths may block deletion.",
                            )
                          )
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
                          const res = await createPainPointAction(
                            versionId,
                            input,
                          );
                          if (!res.ok) setError(res.error);
                          else {
                            setMessage("Pain point recorded.");
                            reload();
                          }
                        })
                      }
                      onAddMetric={(input) =>
                        startTransition(async () => {
                          const res = await createMetricAction(
                            versionId,
                            input,
                          );
                          if (!res.ok) setError(res.error);
                          else {
                            setMessage("Metric recorded.");
                            reload();
                          }
                        })
                      }
                      onAddOpp={(input) =>
                        startTransition(async () => {
                          const res = await createOpportunityAction(
                            versionId,
                            input,
                          );
                          if (!res.ok) setError(res.error);
                          else {
                            setMessage(
                              "Improvement opportunity captured (not approved scope).",
                            );
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
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function LandscapeView({
  processes,
  currentId,
  presentation,
  onOpen,
}: {
  processes: RelatedProcessCard[];
  currentId: string;
  presentation: boolean;
  onOpen: (id: string, versionId: string | null) => void;
}) {
  return (
    <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-6" aria-label="All processes landscape">
      <p className="max-w-3xl text-sm text-[var(--muted)]">
        High-level view of documented processes for this company
        {processes.some((p) => p.contextAssociation === "same_opportunity")
          ? " and opportunity"
          : ""}
        . Process-to-process handoffs are not recorded in the data model — shared
        context is labeled when inferred.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {processes.map((p) => (
          <article
            key={p.id}
            className={`rounded-lg border bg-[var(--surface)] p-4 ${
              p.id === currentId
                ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/40"
                : "border-[var(--line)]"
            }`}
          >
            <h2 className="text-lg text-[var(--navy)]">{p.name}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {p.purpose || "Purpose not recorded"}
            </p>
            <dl className="mt-3 space-y-1 text-xs text-[var(--text)]">
              <div>
                <dt className="inline text-[var(--muted)]">Starts: </dt>
                <dd className="inline">{p.startTrigger || "—"}</dd>
              </div>
              <div>
                <dt className="inline text-[var(--muted)]">Ends: </dt>
                <dd className="inline">{p.endEvent || p.outcome || "—"}</dd>
              </div>
              <div>
                <dt className="inline text-[var(--muted)]">Owner: </dt>
                <dd className="inline">{p.processOwner || "—"}</dd>
              </div>
              <div>
                <dt className="inline text-[var(--muted)]">Status: </dt>
                <dd className="inline">
                  {p.versionStatus ?? p.status}
                  {p.classification ? ` · ${p.classification}` : ""}
                </dd>
              </div>
            </dl>
            <ul className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <li className="rounded bg-[var(--bg)] px-2 py-0.5">
                {p.stepCount} steps
              </li>
              {p.blueprintItemCount ? (
                <li className="rounded bg-[var(--warning)]/15 px-2 py-0.5 text-[var(--warning)]">
                  {p.blueprintItemCount} Blueprint items
                </li>
              ) : null}
              {p.painPointCount ? (
                <li className="rounded bg-[var(--danger)]/10 px-2 py-0.5 text-[var(--danger)]">
                  {p.painPointCount} pain points
                </li>
              ) : null}
              {p.validationOk === false ? (
                <li className="rounded bg-[var(--danger)]/10 px-2 py-0.5 text-[var(--danger)]">
                  Validation issues
                </li>
              ) : null}
            </ul>
            <p className="mt-2 text-[11px] italic text-[var(--muted)]">
              {p.contextAssociationLabel}
            </p>
            <button
              type="button"
              className={`mt-3 rounded px-3 py-1.5 text-sm ${
                presentation
                  ? "border border-[var(--line)]"
                  : "bg-[var(--accent)] text-white"
              }`}
              onClick={() => onOpen(p.id, p.versionId)}
            >
              Open process
            </button>
          </article>
        ))}
      </div>
      {!processes.length ? (
        <p className="mt-6 text-sm text-[var(--muted)]">
          No related processes found for this company context.
        </p>
      ) : null}
    </section>
  );
}

function PlainLanguageLegend() {
  return (
    <div
      className="border-b border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-xs"
      aria-label="Process map legend"
    >
      <p className="font-medium text-[var(--navy)]">How to read this map</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <p>
          <span className="font-semibold">Start / End</span> — pill-shaped boxes
          mark where work begins and finishes.
        </p>
        <p>
          <span className="font-semibold">Human / System</span> — solid boxes for
          people work or automated tools.
        </p>
        <p>
          <span className="font-semibold">Decision / Approval</span> — dashed
          boxes where a yes/no or sign-off happens.
        </p>
        <p>
          <span className="font-semibold">Waiting / Handoff</span> — pauses or
          transfers between people or teams.
        </p>
        <p>
          <span className="font-semibold">Main path</span> — thicker solid arrows
          with numbers on the primary sequence.
        </p>
        <p>
          <span className="font-semibold">Exception / loop</span> — thinner or
          dashed arrows for rejection, failure, escalation, or return to an
          earlier step.
        </p>
      </div>
    </div>
  );
}
