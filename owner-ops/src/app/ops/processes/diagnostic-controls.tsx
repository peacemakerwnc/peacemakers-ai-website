"use client";

import { useActionState } from "react";
import {
  deriveFutureAction,
  editDraftStepAction,
  reopenVersionAction,
  tryEditImmutableAction,
  type ProcessActionState,
} from "./actions";

const initial: ProcessActionState = {};

export function DeriveFutureForm({
  processId,
  versionId,
}: {
  processId: string;
  versionId: string;
}) {
  const [state, action] = useActionState(deriveFutureAction, initial);
  return (
    <form action={action} className="inline">
      <input type="hidden" name="processId" value={processId} />
      <input type="hidden" name="versionId" value={versionId} />
      <button
        type="submit"
        className="rounded border border-[var(--border)] px-2 py-1 text-xs"
      >
        Derive Future-State draft
      </button>
      {state.error ? (
        <span className="ml-2 text-xs text-red-700">{state.error}</span>
      ) : null}
      {state.ok ? (
        <span className="ml-2 text-xs text-green-800">{state.ok}</span>
      ) : null}
    </form>
  );
}

export function ReopenForm({
  processId,
  versionId,
}: {
  processId: string;
  versionId: string;
}) {
  const [state, action] = useActionState(reopenVersionAction, initial);
  return (
    <form action={action} className="inline">
      <input type="hidden" name="processId" value={processId} />
      <input type="hidden" name="versionId" value={versionId} />
      <button
        type="submit"
        className="rounded border border-[var(--border)] px-2 py-1 text-xs"
      >
        Reopen as new draft
      </button>
      {state.error ? (
        <span className="ml-2 text-xs text-red-700">{state.error}</span>
      ) : null}
      {state.ok ? (
        <span className="ml-2 text-xs text-green-800">{state.ok}</span>
      ) : null}
    </form>
  );
}

export function ImmutableProbeForm({
  processId,
  stepId,
}: {
  processId: string;
  stepId: string;
}) {
  const [state, action] = useActionState(tryEditImmutableAction, initial);
  return (
    <form action={action} className="mt-2">
      <input type="hidden" name="processId" value={processId} />
      <input type="hidden" name="stepId" value={stepId} />
      <button
        type="submit"
        className="rounded border border-amber-700 px-2 py-1 text-xs text-amber-900"
      >
        Probe edit on this version (should block if immutable)
      </button>
      {state.error ? (
        <p className="mt-1 text-xs text-red-700">{state.error}</p>
      ) : null}
      {state.ok ? (
        <p className="mt-1 text-xs text-green-800">{state.ok}</p>
      ) : null}
    </form>
  );
}

export function DraftStepEditForm({
  processId,
  stepId,
  currentName,
}: {
  processId: string;
  stepId: string;
  currentName: string;
}) {
  const [state, action] = useActionState(editDraftStepAction, initial);
  return (
    <form action={action} className="mt-1 flex flex-wrap items-center gap-2">
      <input type="hidden" name="processId" value={processId} />
      <input type="hidden" name="stepId" value={stepId} />
      <input
        name="shortName"
        defaultValue={currentName}
        className="rounded border border-[var(--border)] px-2 py-1 text-xs"
      />
      <button
        type="submit"
        className="rounded border border-[var(--border)] px-2 py-1 text-xs"
      >
        Save draft name
      </button>
      {state.error ? (
        <span className="text-xs text-red-700">{state.error}</span>
      ) : null}
      {state.ok ? (
        <span className="text-xs text-green-800">{state.ok}</span>
      ) : null}
    </form>
  );
}
