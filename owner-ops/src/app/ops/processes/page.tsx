import Link from "next/link";
import { requireOwnerSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProcessesIndexPage() {
  await requireOwnerSession({ returnTo: "/ops/processes" });

  const processes = await prisma.process.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      company: { select: { id: true, name: true } },
      opportunity: { select: { id: true, title: true } },
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 3,
        select: {
          id: true,
          versionNumber: true,
          classification: true,
          status: true,
        },
      },
    },
  });

  const legacyPending = await prisma.formProcess.count({
    where: { migrationStatus: "UNREVIEWED" },
  });
  const legacyPreserved = await prisma.formProcess.count({
    where: { migrationStatus: "PRESERVED_LINEAR" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-[var(--ink)]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted)]">
            <Link href="/ops" className="underline">
              Pipeline
            </Link>{" "}
            / Process graphs
          </p>
          <h1 className="text-2xl font-semibold text-[var(--navy)]">
            Process graph diagnostic
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
            Increment 1 read-only foundation inspector. No canvas, swimlanes, or
            client builder.
          </p>
        </div>
      </div>

      <section className="mb-8 rounded border border-[var(--border)] p-4 text-sm">
        <h2 className="font-medium text-[var(--navy)]">Legacy form capture</h2>
        <p className="mt-1 text-[var(--muted)]">
          Blueprint FormProcess rows are preserved without fabricated graph
          edges. Unreviewed: {legacyPending}. Preserved linear detail:{" "}
          {legacyPreserved}.
        </p>
      </section>

      {processes.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          No graph processes yet. Seed with{" "}
          <code className="text-xs">npx tsx prisma/seed-process-graph-demo.ts</code>
          .
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)] rounded border border-[var(--border)]">
          {processes.map((p) => (
            <li key={p.id} className="px-4 py-3">
              <Link
                href={`/ops/processes/${p.id}`}
                className="font-medium text-[var(--navy)] underline"
              >
                {p.name}
              </Link>
              <p className="text-sm text-[var(--muted)]">
                {p.company.name}
                {p.opportunity ? ` · ${p.opportunity.title}` : ""}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Versions:{" "}
                {p.versions
                  .map(
                    (v) =>
                      `v${v.versionNumber} ${v.classification}/${v.status}`,
                  )
                  .join(" · ") || "none"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
