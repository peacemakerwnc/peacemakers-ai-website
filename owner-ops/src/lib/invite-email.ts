import { getEnv } from "./env";

export type InvitationEmailContent = {
  to: string;
  subject: string;
  text: string;
  html: string;
  tags: string[];
};

/**
 * Build invitation email. Includes only client-facing copy and the form URL.
 * Never include internal opportunity IDs, owner notes, or other CRM data.
 */
export function buildInvitationEmail(input: {
  to: string;
  recipientFirstName: string;
  companyName: string;
  formUrl: string;
  expiresAt: Date;
  kind?: "initial" | "reminder" | "reissue";
}): InvitationEmailContent {
  const kind = input.kind ?? "initial";
  const support = getEnv().OWNER_EMAIL;
  const expiresLabel = input.expiresAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject =
    kind === "reminder"
      ? "Reminder: your Business Blueprint Preparation form"
      : kind === "reissue"
        ? "Updated link: Business Blueprint Preparation form"
        : "Your Business Blueprint Preparation form";

  const intro =
    kind === "reminder"
      ? "This is a friendly reminder to complete your Business Blueprint Preparation form."
      : kind === "reissue"
        ? "Your previous form link was replaced. Please use this new secure link only."
        : "Please complete your Business Blueprint Preparation form so we can prepare for your Blueprint discovery meeting.";

  const text = [
    `Hello ${input.recipientFirstName},`,
    "",
    intro,
    "",
    `Company: ${input.companyName}`,
    `Secure form link: ${input.formUrl}`,
    `Link expires: ${expiresLabel}`,
    "",
    "You can save progress and continue later.",
    "Do not enter passwords, API keys, or other secrets in the form.",
    "Treat this link like a password — do not forward it broadly.",
    "",
    `Questions? Contact ${support}`,
    "",
    "— Peacemakers AI",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html>
<body style="font-family: Georgia, serif; color: #1a1a1a; line-height: 1.5;">
  <p>Hello ${escapeHtml(input.recipientFirstName)},</p>
  <p>${escapeHtml(intro)}</p>
  <p><strong>Company:</strong> ${escapeHtml(input.companyName)}</p>
  <p><a href="${escapeAttr(input.formUrl)}">Open your secure form</a></p>
  <p><strong>Link expires:</strong> ${escapeHtml(expiresLabel)}</p>
  <ul>
    <li>You can save progress and continue later.</li>
    <li>Do not enter passwords, API keys, or other secrets.</li>
    <li>Treat this link like a password — do not forward it broadly.</li>
  </ul>
  <p>Questions? Contact <a href="mailto:${escapeAttr(support)}">${escapeHtml(support)}</a></p>
  <p>— Peacemakers AI</p>
</body>
</html>`;

  return {
    to: input.to,
    subject,
    text,
    html,
    tags: [`blueprint-invite-${kind}`],
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
