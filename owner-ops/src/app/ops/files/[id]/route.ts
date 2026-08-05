import { notFound } from "next/navigation";
import { requireOwnerApiSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getStorageAdapter } from "@/lib/storage";
import { recordAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireOwnerApiSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await context.params;
  const file = await prisma.fileAttachment.findUnique({ where: { id } });
  if (!file) notFound();

  try {
    const buffer = await getStorageAdapter().read(file.storageKey);
    await recordAudit({
      action: "file.downloaded",
      actorUserId: session.userId,
      actorLabel: session.email,
      entityType: "FileAttachment",
      entityId: file.id,
      details: { sizeBytes: file.sizeBytes },
    });

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `attachment; filename="${file.originalName.replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
