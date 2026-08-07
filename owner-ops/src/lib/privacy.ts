/**
 * Pilot privacy notice — operational copy for one controlled client pilot.
 * Not a substitute for legal review before broader launch.
 */

export const PRIVACY_NOTICE_VERSION = "pilot-2026-08-07";

export const PRIVACY_RETENTION_DAYS_PILOT = 365;

export type PrivacyNotice = {
  version: string;
  title: string;
  paragraphs: string[];
  bullets: string[];
  acknowledgementLabel: string;
};

export function getPrivacyNotice(): PrivacyNotice {
  return {
    version: PRIVACY_NOTICE_VERSION,
    title: "Before you begin — privacy and data use",
    paragraphs: [
      "Peacemakers AI collects the information you enter in this Business Blueprint Preparation questionnaire so your consultant can prepare for your Blueprint discovery meeting and related consulting work.",
      "Your answers may be saved automatically while incomplete. After you submit, responses become read-only so we preserve an accurate record of what you provided.",
      "Only Peacemakers AI (your consultant and authorized operators working on your engagement) can review your responses. This pilot questionnaire does not produce automated recommendations, ROI claims, or guarantees of savings.",
      `Pilot information is ordinarily retained for about ${PRIVACY_RETENTION_DAYS_PILOT} days after the engagement closes, unless a longer business or legal record obligation applies. You may request correction or deletion by contacting Peacemakers AI; some records may need to be retained for legitimate business reasons.`,
    ],
    bullets: [
      "Do not enter passwords, API keys, tokens, payment credentials, bank account numbers, protected health information, or other secrets.",
      "Share process and systems information at a business level — product names, workflows, pain points, and approximate volumes are enough.",
      "You can save and continue later using this private link. Treat the link like a password; do not forward it broadly.",
      "Estimated completion time is typically 45–90 minutes depending on process detail.",
    ],
    acknowledgementLabel:
      "I have read this notice. I understand what is collected, who may review it, that drafts may be saved, that submitted answers become read-only, and that I must not enter passwords or other secrets.",
  };
}
