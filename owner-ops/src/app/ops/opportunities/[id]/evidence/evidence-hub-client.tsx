"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createBlueprintMeetingAction } from "@/app/ops/evidence-actions";

type MeetingSummary = {
  id: string;
  title: string;
  status: string;
  meetingDate: string | null;
  sourceCount: number;
  findingCount: number;
  conflictCount: number;
};

type FindingSummary = {
  id: string;
  title: string;
  category?: string;
  reviewStatus: string;
  confidence?: string | null;
};

type ConflictSummary = {
  id: string;
  subject: string;
  status: string;
  materiality: string;
};

export function EvidenceHubClient(props: {
  opportunityId: string;
  companyId: string;
  formResponseId?: string;
  processes: { id: string; name: string }[];
  meetings: MeetingSummary[];
  acceptedFindings: FindingSummary[];
  proposedFindings: FindingSummary[];
  rejectedFindings: FindingSummary[];
  unresolvedConflicts: ConflictSummary[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("Blueprint meeting");
  const [meetingDate, setMeetingDate] = useState("");
  const [facilitator, setFacilitator] = useState("James Fullen");
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);

  function createMeeting() {
    setError(null);
    startTransition(async () => {
      const result = await createBlueprintMeetingAction({
        companyId: props.companyId,
        opportunityId: props.opportunityId,
        formResponseId: props.formResponseId,
        title,
        meetingDate: meetingDate || undefined,
        facilitatorLabel: facilitator,
        processIds: selectedProcesses,
        attendeesJson: JSON.stringify([
          { name: "James Fullen", role: "Facilitator", isClient: false },
        ]),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(
        `/ops/opportunities/${props.opportunityId}/evidence/${result.meetingId}`,
      );
      router.refresh();
    });
  }

  return (
    <div className="mt-8 space-y-8">
      <section
        className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5"
        aria-labelledby="meetings-heading"
      >
        <h2 id="meetings-heading" className="text-xl">
          Blueprint meetings
        </h2>
        {props.meetings.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            No Blueprint meeting records yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {props.meetings.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/ops/opportunities/${props.opportunityId}/evidence/${m.id}`}
                  className="block rounded-md border border-[var(--line)] px-3 py-2 hover:bg-[var(--bg)]"
                >
                  <span className="font-medium">{m.title}</span>
                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    {m.status.replaceAll("_", " ")} · {m.sourceCount} sources ·{" "}
                    {m.findingCount} findings · {m.conflictCount} conflicts
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 border-t border-[var(--line)] pt-4">
          <h3 className="text-base font-medium">Create meeting record</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              Title
              <input
                className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Meeting date
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              Facilitator
              <input
                className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
                value={facilitator}
                onChange={(e) => setFacilitator(e.target.value)}
              />
            </label>
          </div>
          {props.processes.length > 0 ? (
            <fieldset className="mt-3">
              <legend className="text-sm font-medium">
                Related processes (optional)
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {props.processes.map((p) => {
                  const on = selectedProcesses.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`rounded-md border px-2 py-1 text-xs ${
                        on
                          ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                          : "border-[var(--line)]"
                      }`}
                      onClick={() =>
                        setSelectedProcesses((prev) =>
                          on
                            ? prev.filter((x) => x !== p.id)
                            : [...prev, p.id],
                        )
                      }
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ) : null}
          {error ? (
            <p className="mt-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            onClick={createMeeting}
            disabled={pending || !title.trim()}
            className="mt-4 rounded-md bg-[var(--navy)] px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {pending ? "Creating…" : "Create Blueprint meeting"}
          </button>
        </div>
      </section>

      <section
        className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5"
        aria-labelledby="unified-heading"
      >
        <h2 id="unified-heading" className="text-xl">
          Unified requirement record
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Source types stay distinct. Proposed findings are not facts.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Accepted findings
            </h3>
            <ul className="mt-2 space-y-1 text-sm">
              {props.acceptedFindings.length === 0 ? (
                <li className="text-[var(--muted)]">None yet</li>
              ) : (
                props.acceptedFindings.map((f) => (
                  <li key={f.id} className="border-b border-[var(--line)] py-1">
                    <span className="font-medium">{f.title}</span>
                    <span className="block text-xs text-[var(--muted)]">
                      {f.category} · {f.reviewStatus}
                      {f.confidence ? ` · ${f.confidence}` : ""}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Proposed (not accepted)
            </h3>
            <ul className="mt-2 space-y-1 text-sm">
              {props.proposedFindings.length === 0 ? (
                <li className="text-[var(--muted)]">None</li>
              ) : (
                props.proposedFindings.map((f) => (
                  <li key={f.id} className="border-b border-[var(--line)] py-1">
                    {f.title}
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Rejected
            </h3>
            <ul className="mt-2 space-y-1 text-sm">
              {props.rejectedFindings.length === 0 ? (
                <li className="text-[var(--muted)]">None</li>
              ) : (
                props.rejectedFindings.map((f) => (
                  <li key={f.id}>{f.title}</li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Unresolved conflicts
            </h3>
            <ul className="mt-2 space-y-1 text-sm">
              {props.unresolvedConflicts.length === 0 ? (
                <li className="text-[var(--muted)]">None</li>
              ) : (
                props.unresolvedConflicts.map((c) => (
                  <li key={c.id} className="border-b border-[var(--line)] py-1">
                    <span className="font-medium">{c.subject}</span>
                    <span className="block text-xs text-[var(--muted)]">
                      {c.status} · {c.materiality}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
