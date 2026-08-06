"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form
      className="flex flex-col gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6"
      action={formAction}
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
      {state?.error === "rate_limited" ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          Too many sign-in attempts. Please wait and try again.
        </p>
      ) : state?.error ? (
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
