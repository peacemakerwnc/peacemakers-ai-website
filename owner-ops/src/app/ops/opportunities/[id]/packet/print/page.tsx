import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerSession } from "@/lib/session";
import { buildBlueprintReviewPacket } from "@/lib/blueprint-review-packet";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PacketPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const mode = sp.mode === "internal" ? "internal" : "client";
  const session = await requireOwnerSession({
    returnTo: `/ops/opportunities/${id}/packet/print?mode=${mode}`,
  });

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!opportunity) notFound();

  const packet = await buildBlueprintReviewPacket({
    opportunityId: id,
    mode,
    preparedBy: session.email ?? "Owner",
  });

  const cover = packet.sections.cover as Record<string, string>;
  const executive = packet.sections.executive as Record<string, unknown>;
  const landscape = packet.sections.landscape as
    | Record<string, unknown>[]
    | null;
  const processReview = packet.sections.process_review as
    | Record<string, unknown>[]
    | null;
  const meeting = packet.sections.meeting_findings as Record<
    string,
    unknown
  > | null;

  return (
    <div className="packet-print mx-auto max-w-[8.5in] bg-white px-8 py-8 text-black">
      <style>{`
        @media print {
          @page { size: letter; margin: 0.75in; }
          body * { visibility: hidden; }
          .packet-print, .packet-print * { visibility: visible; }
          .packet-print {
            position: absolute; left: 0; top: 0; width: 100%;
            margin: 0; padding: 0; max-width: none;
          }
          .no-print { display: none !important; }
          thead { display: table-header-group; }
          h2, h3, .break { break-inside: avoid; }
        }
        .packet-print {
          font-family: Georgia, "Times New Roman", serif;
          line-height: 1.45; font-size: 11pt;
        }
        .packet-print h1 { font-size: 20pt; margin: 0 0 0.25rem; }
        .packet-print h2 { font-size: 14pt; margin: 1.4rem 0 0.4rem; }
        .packet-print h3 { font-size: 12pt; margin: 1rem 0 0.3rem; }
        .packet-print .meta { color: #444; font-size: 10pt; }
        .packet-print table { width: 100%; border-collapse: collapse; }
        .packet-print th, .packet-print td {
          border-bottom: 1px solid #ccc; text-align: left;
          padding: 0.35rem 0.4rem; vertical-align: top;
        }
      `}</style>

      <div className="no-print mb-4 flex flex-wrap gap-3 text-sm">
        <Link href={`/ops/opportunities/${id}/packet?mode=${mode}`}>
          ← Packet preview
        </Link>
        <button
          type="button"
          className="rounded-md bg-[var(--navy)] px-3 py-1.5 text-white"
          // print via inline script below for progressive enhancement
          id="packet-print-btn"
        >
          Print / Save as PDF
        </button>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.getElementById('packet-print-btn')?.addEventListener('click',()=>window.print())`,
          }}
        />
      </div>

      <header>
        <p className="meta">{cover.confidentiality}</p>
        <h1>{cover.title}</h1>
        <p className="meta">
          {cover.companyName} · {cover.opportunityName}
        </p>
        <p className="meta">
          Prepared {cover.preparedDate} by {cover.preparedBy}
        </p>
      </header>

      <h2>1. Executive context</h2>
      <p>{String(executive.disclaimer)}</p>
      <p>
        <strong>As of:</strong> {String(executive.asOfDate)}
      </p>
      <p>{String(executive.currentStateSummary)}</p>

      {landscape ? (
        <>
          <h2>2. Process landscape</h2>
          <table>
            <thead>
              <tr>
                <th>Process</th>
                <th>Purpose</th>
                <th>Version</th>
                <th>Steps</th>
              </tr>
            </thead>
            <tbody>
              {landscape.map((row, i) => (
                <tr key={i}>
                  <td>{String(row.name)}</td>
                  <td>{String(row.purpose ?? "—")}</td>
                  <td>{String(row.versionLabel)}</td>
                  <td>{String(row.stepCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      {processReview ? (
        <>
          <h2>3. Individual process review</h2>
          {processReview.map((p, i) => (
            <div key={i} className="break">
              <h3>{String(p.name)}</h3>
              <p>
                Trigger: {String(p.trigger ?? "—")} · Outcome:{" "}
                {String(p.outcome ?? "—")}
              </p>
              <ol>
                {(p.structuredFallback as string[]).map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ol>
            </div>
          ))}
        </>
      ) : null}

      {meeting ? (
        <>
          <h2>4. Meeting findings</h2>
          {mode === "internal" && meeting.internalLabel ? (
            <p>
              <strong>{String(meeting.internalLabel)}</strong>
            </p>
          ) : null}
          <PrintFindings
            title="Confirmed"
            items={meeting.confirmed as { title: string }[]}
          />
          <PrintFindings
            title="Open questions"
            items={meeting.openQuestions as { title: string }[]}
          />
          {mode === "internal" ? (
            <PrintFindings
              title="Proposed (internal only)"
              items={(meeting.proposed as { title: string }[]) ?? []}
            />
          ) : null}
        </>
      ) : null}

      <h2>Appendix</h2>
      <p className="meta">
        This print view excludes application navigation, invitation tokens, and
        unnecessary raw IDs. Client Review omits internal notes and rejected
        findings.
      </p>
    </div>
  );
}

function PrintFindings({
  title,
  items,
}: {
  title: string;
  items: { title: string }[];
}) {
  if (!items?.length) return null;
  return (
    <>
      <h3>{title}</h3>
      <ul>
        {items.map((f, i) => (
          <li key={i}>{f.title}</li>
        ))}
      </ul>
    </>
  );
}
