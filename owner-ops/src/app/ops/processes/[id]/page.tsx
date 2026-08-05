import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerSession } from "@/lib/session";
import { getProcessGraph, listProcessVersions } from "@/lib/process-graph";
import {
  DeriveFutureForm,
  DraftStepEditForm,
  ImmutableProbeForm,
  ReopenForm,
} from "../diagnostic-controls";

export const dynamic = "force-dynamic";

export default async function ProcessDiagnosticPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ version?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  await requireOwnerSession({ returnTo: `/ops/processes/${id}` });

  let graph;
  try {
    graph = await getProcessGraph(id, sp.version);
  } catch {
    notFound();
  }
  if (!graph.process) notFound();

  const versions = await listProcessVersions(id);
  const { process, version, validation } = graph;
  const stepName = new Map(
    (version?.steps ?? []).map((s) => [s.id, s.shortName]),
  );
  const immutable =
    version?.status === "SUBMITTED" ||
    version?.status === "APPROVED" ||
    version?.status === "SUPERSEDED";
  const isDraft =
    version?.status === "DRAFT" || version?.status === "OWNER_REFINED";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-[var(--ink)]">
      <p className="text-sm text-[var(--muted)]">
        <Link href="/ops" className="underline">
          Pipeline
        </Link>{" "}
        /{" "}
        <Link href="/ops/processes" className="underline">
          Processes
        </Link>{" "}
        / diagnostic
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">
        {process.name}
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Company: {process.company.name}
        {process.opportunity ? ` · ${process.opportunity.title}` : ""} · Status:{" "}
        {process.status}
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Purpose: {process.purpose ?? "—"} · Owner: {process.processOwner ?? "—"}
      </p>

      <section className="mt-6 rounded border border-[var(--border)] p-4">
        <h2 className="font-medium text-[var(--navy)]">Version lineage</h2>
        <table className="mt-2 w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-[var(--muted)]">
              <th className="py-1">#</th>
              <th>Classification</th>
              <th>Status</th>
              <th>Parent</th>
              <th>Derived from</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {versions.map((v) => (
              <tr key={v.id} className="border-t border-[var(--border)]">
                <td className="py-1">v{v.versionNumber}</td>
                <td>{v.classification}</td>
                <td>{v.status}</td>
                <td className="text-xs">{v.parentVersionId ?? "—"}</td>
                <td className="text-xs">{v.derivedFromVersionId ?? "—"}</td>
                <td>
                  <Link
                    href={`/ops/processes/${id}?version=${v.id}`}
                    className="text-xs underline"
                  >
                    view
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {version ? (
        <>
          <section className="mt-6 rounded border border-[var(--border)] p-4">
            <h2 className="font-medium text-[var(--navy)]">
              Viewing v{version.versionNumber} — {version.classification} /{" "}
              {version.status}
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Label: {version.versionLabel ?? "—"} · submitted:{" "}
              {version.submittedAt?.toISOString() ?? "—"} · approved:{" "}
              {version.approvedAt?.toISOString() ?? "—"}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {(version.status === "SUBMITTED" ||
                version.status === "APPROVED") && (
                <ReopenForm processId={id} versionId={version.id} />
              )}
              {version.classification === "AS_IS" &&
                (version.status === "APPROVED" ||
                  version.status === "SUBMITTED") && (
                  <DeriveFutureForm processId={id} versionId={version.id} />
                )}
            </div>
            {immutable && version.steps[0] ? (
              <ImmutableProbeForm
                processId={id}
                stepId={version.steps[0].id}
              />
            ) : null}
          </section>

          <section className="mt-6 rounded border border-[var(--border)] p-4">
            <h2 className="font-medium text-[var(--navy)]">
              Graph validation
            </h2>
            <p className="mt-1 text-sm">
              Result:{" "}
              <strong>{validation?.ok ? "PASS" : "FAIL"}</strong>
            </p>
            {(validation?.issues.length ?? 0) === 0 ? (
              <p className="text-xs text-[var(--muted)]">No issues</p>
            ) : (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {validation!.issues.map((i, idx) => (
                  <li key={idx}>
                    [{i.severity}] {i.code}: {i.message}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-6 rounded border border-[var(--border)] p-4">
            <h2 className="font-medium text-[var(--navy)]">
              Steps ({version.steps.length})
            </h2>
            <table className="mt-2 w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-[var(--muted)]">
                  <th className="py-1">Order</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Role / Dept</th>
                  <th>Tool</th>
                </tr>
              </thead>
              <tbody>
                {version.steps.map((s) => (
                  <tr key={s.id} className="border-t border-[var(--border)] align-top">
                    <td className="py-1">{s.displayOrder}</td>
                    <td>
                      {s.shortName}
                      {isDraft ? (
                        <DraftStepEditForm
                          processId={id}
                          stepId={s.id}
                          currentName={s.shortName}
                        />
                      ) : null}
                    </td>
                    <td>{s.stepType}</td>
                    <td className="text-xs">
                      {s.responsibleRole ?? "—"}
                      <br />
                      {s.department ?? "—"}
                    </td>
                    <td className="text-xs">{s.toolOrSystem ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mt-6 rounded border border-[var(--border)] p-4">
            <h2 className="font-medium text-[var(--navy)]">
              Connections ({version.connections.length})
            </h2>
            <p className="mb-2 text-xs text-[var(--muted)]">
              Directed edges are relational records — not array order.
            </p>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-[var(--muted)]">
                  <th className="py-1">Source</th>
                  <th>Target</th>
                  <th>Type</th>
                  <th>Label / condition</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                {version.connections.map((c) => (
                  <tr key={c.id} className="border-t border-[var(--border)]">
                    <td className="py-1">
                      {stepName.get(c.sourceStepId) ?? c.sourceStepId}
                    </td>
                    <td>{stepName.get(c.targetStepId) ?? c.targetStepId}</td>
                    <td>
                      <span
                        className={
                          c.connectionType === "APPROVED" ||
                          c.connectionType === "REJECTED"
                            ? "font-medium"
                            : undefined
                        }
                      >
                        {c.connectionType}
                      </span>
                    </td>
                    <td className="text-xs">
                      {c.displayLabel ?? "—"}
                      {c.condition ? (
                        <>
                          <br />
                          {c.condition}
                        </>
                      ) : null}
                    </td>
                    <td>{c.isDefaultPath ? "yes" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mt-6 rounded border border-[var(--border)] p-4">
            <h2 className="font-medium text-[var(--navy)]">
              Participants ({version.participants.length})
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {version.participants.map((p) => (
                <li key={p.id}>
                  {p.participantType}
                  {p.role ? ` · ${p.role}` : ""}
                  {p.department ? ` · ${p.department}` : ""}
                  {p.personLabel ? ` · ${p.personLabel}` : ""}
                  {` · ${p.responsibilityType}`}
                </li>
              ))}
            </ul>
          </section>

          {version.approvals.length > 0 ? (
            <section className="mt-6 rounded border border-[var(--border)] p-4">
              <h2 className="font-medium text-[var(--navy)]">Approvals</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {version.approvals.map((a) => (
                  <li key={a.id}>
                    {a.approvalType} / {a.status}
                    {a.decidedAt
                      ? ` · ${a.decidedAt.toISOString()}`
                      : ""}
                    {a.criteriaOrNotes ? ` — ${a.criteriaOrNotes}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : (
        <p className="mt-6 text-sm text-[var(--muted)]">No version selected.</p>
      )}
    </main>
  );
}
