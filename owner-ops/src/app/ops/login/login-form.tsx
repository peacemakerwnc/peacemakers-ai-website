"use client";

import { useState, useTransition } from "react";
import { loginAction } from "../actions";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  return (
    <form
      className="flex flex-col gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6"
      action={(formData) => {
        setError(false);
        startTransition(async () => {
          const result = await loginAction(formData);
          if (result?.error) setError(true);
        });
      }}
    >
      <input type="hidden" name="next" value={nextPath} />
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--navy)]">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="rounded-md border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--navy)]">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={12}
          className="rounded-md border border-[var(--line)] px-3 py-2"
        />
      </label>
      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          Invalid email or password.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
