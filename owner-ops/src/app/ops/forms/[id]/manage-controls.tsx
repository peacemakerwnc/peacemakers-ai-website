"use client";

import { useState, useTransition } from "react";
import {
  revokeInvitationAction,
  regenerateInvitationAction,
  resendInvitationAction,
  reopenFormAction,
} from "../actions";

export function InvitationManageControls({
  invitationId,
  email,
  status,
}: {
  invitationId: string;
  email: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState<string | null>(null);

  return (
    <div className="mt-6 space-y-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
      <h2 className="text-lg">Actions</h2>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending || status === "REVOKED"}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
          onClick={() =>
            startTransition(async () => {
              await revokeInvitationAction(invitationId);
              setMessage("Invitation revoked.");
            })
          }
        >
          Revoke
        </button>
        <button
          type="button"
          disabled={pending}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
          onClick={() =>
            startTransition(async () => {
              const res = await regenerateInvitationAction(invitationId);
              if (res.ok) {
                setNewUrl(res.formUrl);
                setMessage("New link generated — copy now.");
                await resendInvitationAction(
                  res.invitationId,
                  res.formUrl,
                  email,
                );
                setMessage("New link generated and mock email logged.");
              }
            })
          }
        >
          Regenerate + mock send
        </button>
        <button
          type="button"
          disabled={pending || status !== "SUBMITTED"}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
          onClick={() =>
            startTransition(async () => {
              await reopenFormAction(invitationId);
              setMessage("Submission reopened as a new draft version.");
            })
          }
        >
          Reopen for edits
        </button>
      </div>
      {newUrl ? (
        <p className="break-all font-mono text-xs">{newUrl}</p>
      ) : null}
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
