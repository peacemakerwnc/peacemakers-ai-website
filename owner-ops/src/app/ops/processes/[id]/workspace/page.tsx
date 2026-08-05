import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireOwnerSession } from "@/lib/session";
import { listProcessVersions } from "@/lib/process-graph";
import { loadWorkspace } from "@/lib/process-workspace";
import { ProcessWorkspaceClient } from "./workspace-client";

export const dynamic = "force-dynamic";

export default async function ProcessWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ version?: string; mode?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  await requireOwnerSession({
    returnTo: `/ops/processes/${id}/workspace`,
  });

  let workspace;
  try {
    workspace = await loadWorkspace(id, sp.version);
  } catch {
    notFound();
  }

  if (!workspace.version) {
    redirect(`/ops/processes/${id}`);
  }

  const versions = await listProcessVersions(id);
  const presentation = sp.mode === "present";

  return (
    <main className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <div className="border-b border-[var(--line)] bg-[var(--surface)] px-4 py-3 sm:px-6">
        <p className="text-xs text-[var(--muted)]">
          <Link href="/ops" className="underline">
            Pipeline
          </Link>{" "}
          /{" "}
          <Link href="/ops/processes" className="underline">
            Processes
          </Link>{" "}
          /{" "}
          <Link href={`/ops/processes/${id}`} className="underline">
            Diagnostic
          </Link>{" "}
          / Workspace
        </p>
      </div>
      <ProcessWorkspaceClient
        processId={id}
        initialVersionId={workspace.version.id}
        versions={versions}
        initialPresentation={presentation}
      />
    </main>
  );
}
