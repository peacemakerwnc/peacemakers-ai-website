/**
 * Email delivery interface with swappable providers.
 * Local default: log adapter. Pilot: Resend when EMAIL_PROVIDER=resend.
 */

import { getEnv } from "./env";
import { captureError, captureEvent } from "./monitoring";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  /** Optional HTML body */
  html?: string;
  tags?: string[];
};

export type EmailSendResult = {
  ok: boolean;
  provider: string;
  messageId: string;
  error?: string;
};

export interface EmailAdapter {
  send(message: EmailMessage): Promise<EmailSendResult>;
}

export class LogEmailAdapter implements EmailAdapter {
  readonly sent: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<EmailSendResult> {
    // Never log message body content that may include form answers or tokens in URL path.
    const safe = {
      to: message.to,
      subject: message.subject,
      tags: message.tags ?? [],
      textLength: message.text.length,
      htmlLength: message.html?.length ?? 0,
    };
    console.info("[email:mock]", JSON.stringify(safe));
    this.sent.push(message);
    captureEvent({
      type: "email.sent",
      context: { provider: "log", toDomain: message.to.split("@")[1] ?? "unknown" },
    });
    return {
      ok: true,
      provider: "log",
      messageId: `mock_${Date.now()}`,
    };
  }
}

export class ResendEmailAdapter implements EmailAdapter {
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async send(message: EmailMessage): Promise<EmailSendResult> {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.from,
          to: [message.to],
          subject: message.subject,
          text: message.text,
          html: message.html,
          tags: (message.tags ?? []).map((name) => ({ name })),
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        captureEvent({
          type: "email.send_failed",
          level: "error",
          context: {
            provider: "resend",
            status: res.status,
            bodyLength: body.length,
          },
        });
        return {
          ok: false,
          provider: "resend",
          messageId: "",
          error: "Email provider rejected the message",
        };
      }
      const data = (await res.json()) as { id?: string };
      captureEvent({
        type: "email.sent",
        context: {
          provider: "resend",
          toDomain: message.to.split("@")[1] ?? "unknown",
        },
      });
      return {
        ok: true,
        provider: "resend",
        messageId: data.id ?? `resend_${Date.now()}`,
      };
    } catch (err) {
      captureError("email.send_exception", err, { provider: "resend" });
      return {
        ok: false,
        provider: "resend",
        messageId: "",
        error: "Email provider unavailable",
      };
    }
  }
}

let adapter: EmailAdapter | null = null;

export function createEmailAdapterFromEnv(): EmailAdapter {
  const env = getEnv();
  if (env.EMAIL_PROVIDER === "resend") {
    if (!env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY required when EMAIL_PROVIDER=resend");
    }
    const from =
      env.EMAIL_FROM ?? `${env.OWNER_NAME} <${env.OWNER_EMAIL}>`;
    return new ResendEmailAdapter(env.RESEND_API_KEY, from);
  }
  return new LogEmailAdapter();
}

export function getEmailAdapter(): EmailAdapter {
  if (!adapter) adapter = createEmailAdapterFromEnv();
  return adapter;
}

/** Test helper to inject a mock. */
export function setEmailAdapter(next: EmailAdapter): void {
  adapter = next;
}

export function resetEmailAdapter(): void {
  adapter = new LogEmailAdapter();
}
