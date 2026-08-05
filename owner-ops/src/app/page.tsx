import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        Peacemakers AI
      </p>
      <h1 className="text-3xl leading-tight">Owner Operations</h1>
      <p className="text-[var(--muted)]">
        Phase 1 local dashboard for Business Blueprint forms and pipeline
        management. Not for production deployment on Vercel with SQLite.
      </p>
      <div className="flex gap-3">
        <Link
          href="/ops"
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          Open dashboard
        </Link>
        <Link
          href="/ops/login"
          className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--navy)]"
        >
          Owner login
        </Link>
      </div>
    </main>
  );
}
