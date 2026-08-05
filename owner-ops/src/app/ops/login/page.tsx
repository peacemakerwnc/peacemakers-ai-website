import { redirect } from "next/navigation";
import { getSession, safeOpsReturnPath } from "@/lib/session";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const nextPath = safeOpsReturnPath(params.next) ?? "/ops";
  if (session) {
    redirect(nextPath);
  }

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Peacemakers AI
        </p>
        <h1 className="mt-2 text-3xl">Owner login</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Single-owner access for the operations dashboard. Local Phase 1 only.
        </p>
      </div>
      {params.error ? (
        <p className="rounded-md border border-[var(--danger)]/30 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]" role="alert">
          Invalid email or password.
        </p>
      ) : null}
      <LoginForm nextPath={nextPath} />
    </main>
  );
}
