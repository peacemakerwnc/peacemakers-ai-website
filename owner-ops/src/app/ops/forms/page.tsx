import { requireOwnerSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function FormsPlaceholderPage() {
  await requireOwnerSession();
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl">Form management</h1>
      <p className="mt-2 text-[var(--muted)]">
        Invitation create/send/review UI lands in Increments 2–3.
      </p>
    </div>
  );
}
