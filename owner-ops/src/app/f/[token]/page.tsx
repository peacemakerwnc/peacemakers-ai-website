import { openFormAction } from "../actions";
import { BlueprintForm } from "./blueprint-form";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const opened = await openFormAction(token);

  if (!opened.ok) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Peacemakers AI
        </p>
        <h1 className="mt-2 text-3xl">Form unavailable</h1>
        <p className="mt-3 text-[var(--muted)]">{opened.error}</p>
      </main>
    );
  }

  return (
    <BlueprintForm
      token={token}
      initialPayload={opened.payload}
      initialCompletion={opened.completionPct}
      initialSavedAt={opened.lastSavedAt}
      readOnly={opened.submitted}
      contactFirstName={opened.contactFirstName}
      companyName={opened.companyName}
    />
  );
}
