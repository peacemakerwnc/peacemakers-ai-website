/**
 * Email delivery interface. Phase 1 uses log-only mock.
 * Swap implementation when a provider is approved — do not rebuild callers.
 */

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  /** Optional HTML body — never required in Phase 1. */
  html?: string;
  tags?: string[];
};

export type EmailSendResult = {
  ok: boolean;
  provider: string;
  messageId: string;
};

export interface EmailAdapter {
  send(message: EmailMessage): Promise<EmailSendResult>;
}

export class LogEmailAdapter implements EmailAdapter {
  readonly sent: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<EmailSendResult> {
    // Never log message body content that may include form answers.
    const safe = {
      to: message.to,
      subject: message.subject,
      tags: message.tags ?? [],
      textLength: message.text.length,
    };
    console.info("[email:mock]", JSON.stringify(safe));
    this.sent.push(message);
    return {
      ok: true,
      provider: "log",
      messageId: `mock_${Date.now()}`,
    };
  }
}

let adapter: EmailAdapter = new LogEmailAdapter();

export function getEmailAdapter(): EmailAdapter {
  return adapter;
}

/** Test helper to inject a mock. */
export function setEmailAdapter(next: EmailAdapter): void {
  adapter = next;
}

export function resetEmailAdapter(): void {
  adapter = new LogEmailAdapter();
}
