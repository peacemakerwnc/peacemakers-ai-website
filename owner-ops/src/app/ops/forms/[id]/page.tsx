import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { InvitationManageControls } from "./manage-controls";

export const dynamic = "force-dynamic";

export default async function InvitationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireOwnerSession();
  const { id } = await params;
  const invitation = await prisma.formInvitation.findUnique({
    where: { id },
    include: {
      contact: true,
      opportunity: { include: { company: true, stage: true } },
      responses: { orderBy: { version: "desc" } },
      files: true,
    },
  });
  if (!invitation) notFound();

  const base = getEnv().APP_BASE_URL.replace(/\/$/, "");
  // Raw token is not recoverable — owner must regenerate to get a new link.
  const linkHint = `${base}/f/[token] (prefix ${invitation.tokenPrefix}…)`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/ops/forms" className="text-sm text-[var(--accent)]">
        ← Forms
      </Link>
      <h1 className="mt-4 text-3xl">
        {invitation.contact.firstName} {invitation.contact.lastName}
      </h1>
      <p className="text-[var(--muted)]">{invitation.opportunity.company.name}</p>

      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[var(--muted)]">Status</dt>
          <dd className="font-medium">{invitation.status}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Completion</dt>
          <dd className="font-medium">{invitation.completionPct}%</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">First opened</dt>
          <dd>{invitation.firstOpenedAt?.toLocaleString() ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Last saved</dt>
          <dd>{invitation.lastSavedAt?.toLocaleString() ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Submitted</dt>
          <dd>{invitation.submittedAt?.toLocaleString() ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Expires</dt>
          <dd>{invitation.expiresAt.toLocaleString()}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[var(--muted)]">Stage</dt>
          <dd>{invitation.opportunity.stage.name}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[var(--muted)]">Secure link</dt>
          <dd className="font-mono text-xs">{linkHint}</dd>
        </div>
      </dl>

      <InvitationManageControls
        invitationId={invitation.id}
        email={invitation.contact.email}
        status={invitation.status}
      />

      <section className="mt-8">
        <h2 className="text-xl">Response versions</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {invitation.responses.map((r) => (
            <li key={r.id} className="flex justify-between border-b border-[var(--line)] py-2">
              <span>
                v{r.version} — {r.status}
                {r.submittedAt ? ` · ${r.submittedAt.toLocaleString()}` : ""}
              </span>
              {r.status === "SUBMITTED" || r.status === "SUPERSEDED" ? (
                <Link
                  href={`/ops/forms/${invitation.id}/review?version=${r.version}`}
                  className="text-[var(--accent)]"
                >
                  Review
                </Link>
              ) : (
                <span className="text-[var(--muted)]">Draft</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl">Files</h2>
        {invitation.files.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">No uploads yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {invitation.files.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/ops/files/${f.id}`}
                  className="text-[var(--accent)]"
                >
                  {f.originalName}
                </Link>{" "}
                <span className="text-[var(--muted)]">
                  ({Math.round(f.sizeBytes / 1024)} KB)
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
