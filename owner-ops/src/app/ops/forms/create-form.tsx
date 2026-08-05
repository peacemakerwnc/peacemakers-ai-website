"use client";

import { useState, useTransition } from "react";
import { createLeadAndInvitationAction } from "./actions";

export function CreateInvitationForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    formUrl: string;
    rawTokenShownOnce: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
      <h2 className="text-lg">Create invitation</h2>
      <form
        className="mt-4 grid gap-3 sm:grid-cols-2"
        action={(fd) => {
          setError(null);
          setResult(null);
          startTransition(async () => {
            const res = await createLeadAndInvitationAction(fd);
            if (!res.ok) {
              setError(res.error);
              return;
            }
            setResult({
              formUrl: res.formUrl,
              rawTokenShownOnce: res.rawTokenShownOnce,
            });
          });
        }}
      >
        <label className="text-sm">
          <span className="font-medium">First name</span>
          <input name="firstName" required className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Last name</span>
          <input name="lastName" required className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Email</span>
          <input name="email" type="email" required className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Phone</span>
          <input name="phone" className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2" />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="font-medium">Company name</span>
          <input name="companyName" required className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2" />
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="sendNow" type="checkbox" />
          Queue mock invitation email (log-only)
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white sm:col-span-2"
        >
          {pending ? "Creating…" : "Create secure form link"}
        </button>
      </form>
      {error ? (
        <p className="mt-3 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      {result ? (
        <div className="mt-4 space-y-2 rounded-md border border-[var(--accent)]/30 bg-teal-50/50 p-4 text-sm">
          <p className="font-medium text-[var(--navy)]">
            Link created — copy now. The raw token is not stored and will not be shown again.
          </p>
          <p className="break-all font-mono text-xs">{result.formUrl}</p>
          <button
            type="button"
            className="rounded-md border border-[var(--line)] bg-white px-3 py-1.5"
            onClick={async () => {
              await navigator.clipboard.writeText(result.formUrl);
              setCopied(true);
            }}
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
