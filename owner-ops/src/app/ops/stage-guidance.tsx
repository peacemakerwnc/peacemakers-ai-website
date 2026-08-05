type Stage = {
  name: string;
  objective: string;
  requiredInformation: string;
  requiredOwnerAction: string;
  clientFacingArtifact: string | null;
  suggestedMessage: string | null;
  relevantSopSlug: string | null;
  exitCriteria: string;
  nextStageSlug: string | null;
  checklists?: { label: string; isRequired: boolean }[];
};

export function StageGuidance({ stage }: { stage: Stage }) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        What happens next
      </p>
      <h2 className="mt-1 text-xl">{stage.name}</h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[var(--muted)]">Objective</dt>
          <dd>{stage.objective}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Required owner action</dt>
          <dd>{stage.requiredOwnerAction}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Required information</dt>
          <dd>{stage.requiredInformation}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Exit criteria</dt>
          <dd>{stage.exitCriteria}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Client-facing artifact</dt>
          <dd>{stage.clientFacingArtifact ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Next stage</dt>
          <dd>{stage.nextStageSlug ?? "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[var(--muted)]">Suggested message</dt>
          <dd className="whitespace-pre-wrap">{stage.suggestedMessage ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Relevant SOP</dt>
          <dd>{stage.relevantSopSlug ?? "—"}</dd>
        </div>
      </dl>
      {stage.checklists && stage.checklists.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          {stage.checklists.map((c) => (
            <li key={c.label}>
              {c.label}
              {c.isRequired ? "" : " (optional)"}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
