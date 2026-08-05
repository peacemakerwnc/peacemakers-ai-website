import Link from "next/link";
import { requireOwnerSession } from "@/lib/session";
import { logoutAction } from "./actions";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OpsHomePage() {
  const session = await requireOwnerSession();
  const stageCount = await prisma.pipelineStage.count();
  const opportunityCount = await prisma.opportunity.count();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Peacemakers AI
          </p>
          <h1 className="mt-1 text-3xl">Owner Operations</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Signed in as {session.email}
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-sm"
          >
            Sign out
          </button>
        </form>
      </header>

      <p className="mb-6 text-sm text-[var(--muted)]">
        Increment 1 foundation is live: auth, audit, seeded pipeline (
        {stageCount} stages), {opportunityCount} opportunities. Form and
        pipeline UI arrive in later increments.
      </p>

      <nav className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/ops"
          className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
        >
          <h2 className="text-lg">Pipeline</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Overview coming in Increment 3
          </p>
        </Link>
        <Link
          href="/ops/forms"
          className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
        >
          <h2 className="text-lg">Forms</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Invitation management coming in Increment 2–3
          </p>
        </Link>
      </nav>
    </div>
  );
}
