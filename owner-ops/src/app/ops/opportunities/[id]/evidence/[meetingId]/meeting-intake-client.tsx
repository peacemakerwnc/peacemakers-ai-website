"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addPastedSourceAction,
  createConflictAction,
  createProposedFindingAction,
  finalizeSourceAction,
  rejectTranscriptUploadAction,
  resolveConflictAction,
  reviewFindingAction,
  supersedeSourceAction,
  updateMeetingStatusAction,
} from "@/app/ops/evidence-actions";
import type {
  BlueprintMeetingStatus,
  EvidenceConflictStatus,
} from "@prisma/client";

type SourceRow = {
  id: string;
  title: string;
  sourceType: string;
  status: string;
  bodyText: string;
  originalBodyText: string;
  version: number;
  parentSourceId: string | null;
  isSensitive: boolean;
};

type FindingRow = {
  id: string;
  title: string;
  body: string;
  category: string;
  reviewStatus: string;
  excerpt: string | null;
  sourceId: string;
  correctedTitle: string | null;
  confidence: string | null;
};

type ConflictRow = {
  id: string;
  subject: string;
  statementA: string;
  statementB: string;
  status: string;
  materiality: string;
  resolutionRationale: string | null;
};

export function MeetingIntakeClient(props: {
  opportunityId: string;
  companyId: string;
  meetingId: string;
  status: string;
  processes: { id: string; name: string }[];
  sources: SourceRow[];
  findings: FindingRow[];
  conflicts: ConflictRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<
    "BLUEPRINT_TRANSCRIPT" | "CONSULTANT_NOTE" | "CLIENT_NOTE"
  >("BLUEPRINT_TRANSCRIPT");
  const [sourceTitle, setSourceTitle] = useState("Meeting transcript");
  const [sourceBody, setSourceBody] = useState("");
  const [processId, setProcessId] = useState("");
  const [findingTitle, setFindingTitle] = useState("");
  const [findingBody, setFindingBody] = useState("");
  const [findingExcerpt, setFindingExcerpt] = useState("");
  const [findingSourceId, setFindingSourceId] = useState(
    props.sources[0]?.id ?? "",
  );
  const [conflictSubject, setConflictSubject] = useState("");
  const [statementA, setStatementA] = useState("");
  const [statementB, setStatementB] = useState("");
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  function refresh() {
    router.refresh();
  }

  function run(fn: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div className="mt-8 space-y-8">
      {error ? (
        <p className="text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-xl">Meeting status</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Current: {props.status.replaceAll("_", " ")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              "COMPLETED",
              "EVIDENCE_PROCESSING",
              "AWAITING_OWNER_REVIEW",
              "REVIEWED",
            ] as BlueprintMeetingStatus[]
          ).map((s) => (
            <button
              key={s}
              type="button"
              disabled={pending}
              className="rounded-md border border-[var(--line)] px-2 py-1 text-xs"
              onClick={() =>
                run(async () => {
                  const r = await updateMeetingStatusAction(
                    props.meetingId,
                    props.companyId,
                    s,
                  );
                  if (!r.ok) throw new Error(r.error);
                })
              }
            >
              Mark {s.replaceAll("_", " ").toLowerCase()}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-xl">Paste transcript or notes</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Original text is preserved. File upload storage is deferred — paste
          first. Unsupported/executable uploads are rejected.
        </p>
        <div className="mt-3 grid gap-3">
          <label className="text-sm">
            Source type
            <select
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
              value={sourceType}
              onChange={(e) =>
                setSourceType(e.target.value as typeof sourceType)
              }
            >
              <option value="BLUEPRINT_TRANSCRIPT">Transcript</option>
              <option value="CONSULTANT_NOTE">Consultant notes</option>
              <option value="CLIENT_NOTE">Client notes</option>
            </select>
          </label>
          <label className="text-sm">
            Title
            <input
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
              value={sourceTitle}
              onChange={(e) => setSourceTitle(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Body
            <textarea
              rows={8}
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2 font-mono text-sm"
              value={sourceBody}
              onChange={(e) => setSourceBody(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Associate process (optional)
            <select
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
              value={processId}
              onChange={(e) => setProcessId(e.target.value)}
            >
              <option value="">None</option>
              {props.processes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending || !sourceBody.trim()}
            className="rounded-md bg-[var(--navy)] px-4 py-2 text-sm text-white disabled:opacity-50"
            onClick={() =>
              run(async () => {
                const r = await addPastedSourceAction({
                  companyId: props.companyId,
                  opportunityId: props.opportunityId,
                  meetingId: props.meetingId,
                  sourceType,
                  title: sourceTitle,
                  bodyText: sourceBody,
                  processId: processId || undefined,
                  finalize: true,
                });
                if (!r.ok) throw new Error(r.error);
                setSourceBody("");
              })
            }
          >
            Save and finalize source
          </button>
          <label className="rounded-md border border-[var(--line)] px-3 py-2 text-sm">
            Check file upload…
            <input
              type="file"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                startTransition(async () => {
                  const r = await rejectTranscriptUploadAction({
                    fileName: file.name,
                    size: file.size,
                    mimeType: file.type,
                  });
                  setUploadMsg(
                    r && "error" in r && r.error
                      ? r.error
                      : "Upload path not available",
                  );
                });
              }}
            />
          </label>
        </div>
        {uploadMsg ? (
          <p className="mt-2 text-sm text-amber-900" role="status">
            {uploadMsg}
          </p>
        ) : null}

        <ul className="mt-6 space-y-3">
          {props.sources.map((s) => (
            <li
              key={s.id}
              className="rounded-md border border-[var(--line)] p-3 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">
                  {s.title}{" "}
                  <span className="text-xs text-[var(--muted)]">
                    ({s.sourceType} · {s.status} · v{s.version})
                  </span>
                </span>
                {s.status === "DRAFT" ? (
                  <button
                    type="button"
                    className="text-xs text-[var(--accent)]"
                    onClick={() =>
                      run(async () => {
                        const r = await finalizeSourceAction(
                          s.id,
                          props.companyId,
                        );
                        if (!r.ok) throw new Error(r.error);
                      })
                    }
                  >
                    Finalize
                  </button>
                ) : null}
              </div>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-[var(--bg)] p-2 text-xs">
                {s.bodyText}
              </pre>
              {s.status === "FINALIZED" ? (
                <button
                  type="button"
                  className="mt-2 text-xs text-[var(--accent)]"
                  onClick={() => {
                    const next = window.prompt(
                      "Supersede with corrected text (original preserved):",
                      s.bodyText,
                    );
                    if (!next) return;
                    run(async () => {
                      const r = await supersedeSourceAction({
                        sourceId: s.id,
                        companyId: props.companyId,
                        bodyText: next,
                      });
                      if (!r.ok) throw new Error(r.error);
                    });
                  }}
                >
                  Supersede (preserve history)
                </button>
              ) : null}
              {s.originalBodyText &&
              s.originalBodyText !== s.bodyText &&
              s.status !== "SUPERSEDED" ? (
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Original snapshot retained separately.
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-xl">Proposed findings</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Manual extraction only. Proposed ≠ accepted fact.
        </p>
        <div className="mt-3 grid gap-3">
          <label className="text-sm">
            Source
            <select
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
              value={findingSourceId}
              onChange={(e) => setFindingSourceId(e.target.value)}
            >
              {props.sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Title
            <input
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
              value={findingTitle}
              onChange={(e) => setFindingTitle(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Body
            <textarea
              rows={3}
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
              value={findingBody}
              onChange={(e) => setFindingBody(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Excerpt
            <input
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
              value={findingExcerpt}
              onChange={(e) => setFindingExcerpt(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={pending || !findingTitle.trim() || !findingSourceId}
            className="w-fit rounded-md bg-[var(--navy)] px-4 py-2 text-sm text-white disabled:opacity-50"
            onClick={() =>
              run(async () => {
                const r = await createProposedFindingAction({
                  sourceId: findingSourceId,
                  companyId: props.companyId,
                  opportunityId: props.opportunityId,
                  meetingId: props.meetingId,
                  processId: processId || undefined,
                  title: findingTitle,
                  body: findingBody,
                  excerpt: findingExcerpt || undefined,
                  confidence: "MEDIUM",
                });
                if (!r.ok) throw new Error(r.error);
                setFindingTitle("");
                setFindingBody("");
                setFindingExcerpt("");
              })
            }
          >
            Create proposed finding
          </button>
        </div>

        <ul className="mt-6 space-y-3">
          {props.findings.map((f) => (
            <li
              key={f.id}
              className="rounded-md border border-[var(--line)] p-3 text-sm"
            >
              <div className="font-medium">
                {f.correctedTitle || f.title}{" "}
                <span className="text-xs font-normal text-[var(--muted)]">
                  {f.reviewStatus} · {f.category}
                </span>
              </div>
              <p className="mt-1 text-[var(--muted)]">{f.body}</p>
              {f.excerpt ? (
                <blockquote className="mt-1 border-l-2 border-[var(--line)] pl-2 text-xs italic">
                  {f.excerpt}
                </blockquote>
              ) : null}
              {f.reviewStatus === "PROPOSED" ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded border border-[var(--line)] px-2 py-1 text-xs"
                    onClick={() =>
                      run(async () => {
                        const r = await reviewFindingAction({
                          findingId: f.id,
                          companyId: props.companyId,
                          action: { type: "accept" },
                        });
                        if (!r.ok) throw new Error(r.error);
                      })
                    }
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="rounded border border-[var(--line)] px-2 py-1 text-xs"
                    onClick={() => {
                      const title = window.prompt("Corrected title", f.title);
                      if (!title) return;
                      run(async () => {
                        const r = await reviewFindingAction({
                          findingId: f.id,
                          companyId: props.companyId,
                          action: {
                            type: "correct_accept",
                            title,
                            body: f.body,
                          },
                        });
                        if (!r.ok) throw new Error(r.error);
                      });
                    }}
                  >
                    Correct & accept
                  </button>
                  <button
                    type="button"
                    className="rounded border border-[var(--line)] px-2 py-1 text-xs"
                    onClick={() =>
                      run(async () => {
                        const r = await reviewFindingAction({
                          findingId: f.id,
                          companyId: props.companyId,
                          action: { type: "reject" },
                        });
                        if (!r.ok) throw new Error(r.error);
                      })
                    }
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="rounded border border-[var(--line)] px-2 py-1 text-xs"
                    onClick={() =>
                      run(async () => {
                        const r = await reviewFindingAction({
                          findingId: f.id,
                          companyId: props.companyId,
                          action: { type: "needs_clarification" },
                        });
                        if (!r.ok) throw new Error(r.error);
                      })
                    }
                  >
                    Needs clarification
                  </button>
                  {props.findings.find((x) => x.id !== f.id) ? (
                    <button
                      type="button"
                      className="rounded border border-[var(--line)] px-2 py-1 text-xs"
                      onClick={() => {
                        const other = props.findings.find((x) => x.id !== f.id);
                        if (!other) return;
                        run(async () => {
                          const r = await reviewFindingAction({
                            findingId: f.id,
                            companyId: props.companyId,
                            action: {
                              type: "duplicate",
                              duplicateOfId: other.id,
                            },
                          });
                          if (!r.ok) throw new Error(r.error);
                        });
                      }}
                    >
                      Mark duplicate
                    </button>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-xl">Conflicts</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Never auto-resolved. Both statements remain visible.
        </p>
        <div className="mt-3 grid gap-3">
          <input
            className="rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
            placeholder="Subject"
            value={conflictSubject}
            onChange={(e) => setConflictSubject(e.target.value)}
          />
          <textarea
            className="rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
            placeholder="Statement A (e.g. questionnaire)"
            rows={2}
            value={statementA}
            onChange={(e) => setStatementA(e.target.value)}
          />
          <textarea
            className="rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
            placeholder="Statement B (e.g. transcript)"
            rows={2}
            value={statementB}
            onChange={(e) => setStatementB(e.target.value)}
          />
          <button
            type="button"
            disabled={pending || !conflictSubject.trim()}
            className="w-fit rounded-md bg-[var(--navy)] px-4 py-2 text-sm text-white disabled:opacity-50"
            onClick={() =>
              run(async () => {
                const r = await createConflictAction({
                  companyId: props.companyId,
                  opportunityId: props.opportunityId,
                  meetingId: props.meetingId,
                  processId: processId || undefined,
                  subject: conflictSubject,
                  statementA,
                  statementB,
                  sourceAId: props.sources[0]?.id,
                  sourceBId: props.sources[1]?.id ?? props.sources[0]?.id,
                  materiality: "HIGH",
                });
                if (!r.ok) throw new Error(r.error);
                setConflictSubject("");
                setStatementA("");
                setStatementB("");
              })
            }
          >
            Record conflict
          </button>
        </div>
        <ul className="mt-6 space-y-3">
          {props.conflicts.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-[var(--line)] p-3 text-sm"
            >
              <div className="font-medium">{c.subject}</div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <div className="rounded bg-[var(--bg)] p-2">
                  <div className="text-xs uppercase text-[var(--muted)]">A</div>
                  {c.statementA}
                </div>
                <div className="rounded bg-[var(--bg)] p-2">
                  <div className="text-xs uppercase text-[var(--muted)]">B</div>
                  {c.statementB}
                </div>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">
                {c.status} · {c.materiality}
                {c.resolutionRationale
                  ? ` · ${c.resolutionRationale}`
                  : ""}
              </p>
              {c.status === "UNRESOLVED" ||
              c.status === "NEEDS_CLIENT_CONFIRMATION" ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      "RESOLVED_SOURCE_A",
                      "RESOLVED_SOURCE_B",
                      "RESOLVED_CORRECTED",
                      "NEEDS_CLIENT_CONFIRMATION",
                      "NOT_MATERIAL",
                    ] as EvidenceConflictStatus[]
                  ).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className="rounded border border-[var(--line)] px-2 py-1 text-xs"
                      onClick={() => {
                        const rationale =
                          window.prompt("Resolution rationale") ?? "";
                        if (!rationale.trim()) return;
                        run(async () => {
                          const r = await resolveConflictAction({
                            conflictId: c.id,
                            companyId: props.companyId,
                            status,
                            rationale,
                          });
                          if (!r.ok) throw new Error(r.error);
                        });
                      }}
                    >
                      {status.replaceAll("_", " ")}
                    </button>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
