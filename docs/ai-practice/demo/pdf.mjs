function escapePdf(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, " ");
}

function wrap(text, width) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > width && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function money(n) {
  return Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function buildPdf(doc) {
  const pageWidth = 612;
  const pageHeight = 792;
  const commands = [];
  const draw = (s) => commands.push(s);

  draw("0.090 0.125 0.184 rg");
  draw(`0 ${pageHeight - 78} ${pageWidth} 78 re f`);
  draw("0.141 0.420 0.992 rg");
  draw(`0 ${pageHeight - 82} ${pageWidth} 4 re f`);
  draw("1 1 1 rg");
  draw("BT /F2 18 Tf 36 742 Td (" + escapePdf(doc.company) + ") Tj ET");
  draw("BT /F1 11 Tf 36 724 Td (" + escapePdf(`${doc.outputTitle}  ·  Sample document, not a real bid`) + ") Tj ET");
  draw("0.09 0.13 0.18 rg");
  draw("BT /F2 13 Tf 36 690 Td (" + escapePdf(doc.audienceLine) + ") Tj ET");
  draw("BT /F1 10 Tf 36 674 Td (" + escapePdf(doc.localLine) + ") Tj ET");

  let y = 646;
  draw("BT /F1 10 Tf 36 " + y + " Td (" + escapePdf("Reviewed by " + doc.approver + " before this file was created. Prices come from the rate card, not from the model.") + ") Tj ET");
  y -= 28;
  draw("BT /F2 11 Tf 36 " + y + " Td (Line items) Tj ET");
  y -= 18;

  for (const line of doc.lines) {
    if (y < 92) break;
    const label = `${line.qty} ${line.unit || ""}  ${line.label}`.replace(/\s+/g, " ").trim();
    draw("0.09 0.13 0.18 rg");
    draw("BT /F1 10 Tf 36 " + y + " Td (" + escapePdf(label) + ") Tj ET");
    draw("BT /F1 10 Tf 470 " + y + " Td (" + escapePdf(money(line.amount)) + ") Tj ET");
    y -= 16;
  }

  y -= 6;
  draw("0.09 0.13 0.18 rg");
  draw(`36 ${y - 4} 540 0.6 re f`);
  y -= 22;
  draw("BT /F2 13 Tf 36 " + y + " Td (Total  " + escapePdf(money(doc.total)) + ") Tj ET");
  y -= 18;
  draw("BT /F1 10 Tf 36 " + y + " Td (Office draft on the source document: " + escapePdf(money(doc.manualTotal)) + ". Difference: " + escapePdf(money(doc.total - doc.manualTotal)) + ".) Tj ET");

  if (doc.included.length) {
    y -= 28;
    draw("BT /F2 11 Tf 36 " + y + " Td (Within allowance) Tj ET");
    y -= 16;
    for (const item of doc.included) {
      if (y < 92) break;
      draw("BT /F1 10 Tf 36 " + y + " Td (" + escapePdf(`${item.label}: ${item.detail}`) + ") Tj ET");
      y -= 14;
    }
  }

  y -= 24;
  for (const line of wrap(doc.note, 92)) {
    if (y < 78) break;
    draw("0.29 0.33 0.39 rg");
    draw("BT /F1 9 Tf 36 " + y + " Td (" + escapePdf(line) + ") Tj ET");
    y -= 12;
  }

  draw("0.09 0.13 0.18 rg");
  draw("BT /F1 8 Tf 36 40 Td (" + escapePdf("Fictional sample. Human approval was required. Contact details were kept on the reviewer machine and were not part of the priced extraction.") + ") Tj ET");
  draw("BT /F1 8 Tf 36 28 Td (" + escapePdf(doc.footer) + ") Tj ET");

  const stream = commands.join("\n");
  const objects = [];
  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n");
  objects.push("2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj\n");
  objects.push(
    `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >> endobj\n`,
  );
  objects.push(`4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj\n`);
  objects.push("5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n");
  objects.push("6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj\n");

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}
