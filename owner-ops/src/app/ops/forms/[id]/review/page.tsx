import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import type { BlueprintPayload } from "@/lib/form-schema";
import { markReviewedAction } from "../../../workflow-actions";
import {
  evaluateClientProcessCompleteness,
  listClientProcessesForResponse,
} from "@/lib/client-process-builder";

export const dynamic = "force-dynamic";

async function RelationalProcessReview({
  formResponseId,
}: {
  formResponseId: string;
}) {
  const versions = await listClientProcessesForResponse(formResponseId);
  if (!versions.length) {
    return (
      <section className="mt-8">
        <h2 className="text-xl">Your Processes (relational)</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          No relational process versions linked to this response.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-xl">Your Processes (relational graph)</h2>
      {await Promise.all(
        versions.map(async (v) => {
          const completeness = await evaluateClientProcessCompleteness(v.id);
          const stepName = new Map(v.steps.map((s) => [s.id, s.shortName]));
          return (
            <article
              key={v.id}
              className="space-y-3 rounded border border-[var(--line)] p-4 text-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-medium">{v.process.name}</h3>
                <p className="text-xs text-[var(--muted)]">
                  {v.classification} · {v.status} · v{v.versionNumber}
                </p>
              </div>
              <p>
                <strong>Purpose:</strong> {v.purpose ?? v.process.purpose ?? "—"}
              </p>
              <p>
                <strong>Trigger:</strong> {v.startTrigger ?? "—"}
              </p>
              <p>
                <strong>Outcome / end:</strong>{" "}
                {v.outcome ?? v.endEvent ?? "—"}
              </p>
              <p>
                Validation:{" "}
                {completeness.validation.ok ? "PASS" : "FAIL"} · Completeness{" "}
                {completeness.scorePct}%
              </p>
              <div>
                <p className="font-medium">Participants</p>
                <ul className="list-disc pl-5">
                  {v.participants.map((p) => (
                    <li key={p.id}>
                      {p.role || p.personLabel || p.participantType}
                      {p.department ? ` · ${p.department}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium">Steps</p>
                <ol className="list-decimal space-y-1 pl-5">
                  {v.steps.map((s) => (
                    <li key={s.id}>
                      {s.shortName}{" "}
                      <span className="text-[var(--muted)]">({s.stepType})</span>
                      {s.discussDuringBlueprint
                        ? " — discuss on Blueprint call"
                        : ""}
                      {s.toolOrSystem ? ` · ${s.toolOrSystem}` : ""}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="font-medium">Directed connections</p>
                <ul className="list-disc pl-5">
                  {v.connections.map((c) => (
                    <li key={c.id}>
                      {stepName.get(c.sourceStepId) ?? c.sourceStepId} →{" "}
                      {stepName.get(c.targetStepId) ?? c.targetStepId}{" "}
                      <span className="text-[var(--muted)]">
                        ({c.connectionType}
                        {c.condition ? `: ${c.condition}` : ""})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                <Link
                  href={`/ops/processes/${v.processId}?version=${v.id}`}
                  className="text-[var(--accent)] underline"
                >
                  Open graph diagnostic
                </Link>
                {" · "}
                <Link
                  href={`/ops/processes/${v.processId}/workspace?version=${v.id}`}
                  className="text-[var(--accent)] underline"
                >
                  Open visual workspace
                </Link>
              </p>
            </article>
          );
        }),
      )}
    </section>
  );
}

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ version?: string }>;
}) {
  const { id } = await params;
  await requireOwnerSession({ returnTo: `/ops/forms/${id}/review` });
  const { version } = await searchParams;

  const invitation = await prisma.formInvitation.findUnique({
    where: { id },
    include: {
      contact: true,
      opportunity: {
        include: {
          company: true,
          proposedServices: { orderBy: { sortOrder: "asc" } },
        },
      },
      responses: { orderBy: { version: "desc" } },
    },
  });
  if (!invitation) notFound();

  const response = version
    ? invitation.responses.find((r) => String(r.version) === version)
    : invitation.responses.find((r) => r.status === "SUBMITTED") ??
      invitation.responses[0];
  if (!response) notFound();

  let payload: BlueprintPayload;
  try {
    payload = JSON.parse(response.payloadJson) as BlueprintPayload;
  } catch {
    payload = {} as BlueprintPayload;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 print:max-w-none print:px-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={`/ops/forms/${id}`} className="text-sm text-[var(--accent)]">
          ← Invitation
        </Link>
        <p className="text-sm text-[var(--muted)]">
          Use your browser Print for a clean copy
        </p>
      </div>

      {response.status === "SUBMITTED" ? (
        <form
          action={markReviewedAction}
          className="mb-6 space-y-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 print:hidden"
        >
          <input type="hidden" name="responseId" value={response.id} />
          <input type="hidden" name="invitationId" value={invitation.id} />
          <label className="block text-sm">
            <span className="font-medium">Internal review notes</span>
            <textarea
              name="internalNotes"
              defaultValue={response.internalNotes ?? ""}
              rows={3}
              className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white"
          >
            {response.reviewedAt ? "Update review" : "Mark reviewed"}
          </button>
          {response.reviewedAt ? (
            <p className="text-xs text-[var(--muted)]">
              Reviewed {response.reviewedAt.toLocaleString()}
            </p>
          ) : null}
        </form>
      ) : null}

      <header className="border-b border-[var(--line)] pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Peacemakers AI
        </p>
        <h1 className="mt-2 text-3xl">Blueprint response summary</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {invitation.contact.firstName} {invitation.contact.lastName} ·{" "}
          {invitation.opportunity.company.name} · v{response.version} ·{" "}
          {response.status}
        </p>
      </header>

      <ReviewBlock title="Contact and company" data={payload.section1} />
      <ReviewBlock title="Business overview" data={payload.section2} />
      <section className="mt-8">
        <h2 className="text-xl">Tools</h2>
        {(payload.section3?.tools ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">None</p>
        ) : (
          (payload.section3.tools ?? []).map((t) => (
            <div
              key={t.id}
              className="mt-3 border-b border-[var(--line)] pb-3 text-sm"
            >
              <p className="font-medium">{t.name}</p>
              <p className="text-[var(--muted)]">{t.category}</p>
              <p>{t.usedFor}</p>
            </div>
          ))
        )}
      </section>
      <section className="mt-8">
        <h2 className="text-xl">Process inventory</h2>
        {(payload.section4?.processes ?? []).map((p) => (
          <div
            key={p.id}
            className="mt-3 border-b border-[var(--line)] pb-3 text-sm"
          >
            <p className="font-medium">{p.name}</p>
            <p className="text-[var(--muted)]">{p.category}</p>
          </div>
        ))}
      </section>
      <section className="mt-8">
        <h2 className="text-xl">Detailed process maps (legacy JSON)</h2>
        {(payload.section5?.detailedProcesses ?? []).map((p) => (
          <article
            key={p.id}
            className="mt-4 space-y-2 border border-[var(--line)] p-4 text-sm"
          >
            <h3 className="text-lg">{p.name}</h3>
            <p>
              <strong>Objective:</strong> {p.businessObjective}
            </p>
            <p>
              <strong>Trigger:</strong> {p.trigger}
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              {p.steps.map((s) => (
                <li key={s.id}>
                  <strong>{s.exactAction}</strong> — {s.responsibleRole} via{" "}
                  {s.toolUsed}
                </li>
              ))}
            </ol>
            <p>
              <strong>If perfect:</strong> {p.ifPerfect}
            </p>
          </article>
        ))}
      </section>

      <RelationalProcessReview formResponseId={response.id} />
      <ReviewBlock title="Priorities" data={payload.section7} />
      <ReviewBlock title="Confirmations" data={payload.section8} />

      <section className="mt-8">
        <h2 className="text-xl">Proposed services (opportunity)</h2>
        {invitation.opportunity.proposedServices.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            None recorded yet. Manage on the{" "}
            <Link
              href={`/ops/opportunities/${invitation.opportunityId}`}
              className="text-[var(--accent)] print:hidden"
            >
              opportunity
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {invitation.opportunity.proposedServices.map((svc) => (
              <li key={svc.id} className="border-b border-[var(--line)] pb-2">
                <p className="font-medium">
                  {svc.name}{" "}
                  <span className="font-normal text-[var(--muted)]">
                    ({svc.status})
                  </span>
                </p>
                {svc.notes ? (
                  <p className="text-[var(--muted)]">{svc.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ReviewBlock({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown> | undefined;
}) {
  if (!data) return null;
  const entries = Object.entries(data).filter(
    ([, v]) => v !== undefined && v !== "" && v !== null,
  );
  return (
    <section className="mt-8">
      <h2 className="text-xl">{title}</h2>
      <dl className="mt-3 space-y-2 text-sm">
        {entries.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[var(--muted)]">{k}</dt>
            <dd className="whitespace-pre-wrap">{String(v)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
