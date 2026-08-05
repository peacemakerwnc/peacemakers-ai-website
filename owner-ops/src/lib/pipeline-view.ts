import { NextActionStatus, type Opportunity, type PipelineStage } from "@prisma/client";

export function isOverdue(dueAt: Date | null | undefined, now = new Date()): boolean {
  if (!dueAt) return false;
  return dueAt.getTime() < now.getTime();
}

export function opportunityWarning(input: {
  nextActionDueAt?: Date | null;
  formStatus?: string | null;
  stage: Pick<PipelineStage, "slug" | "isTerminal">;
  openActions?: { dueAt: Date | null; status: NextActionStatus }[];
}): "overdue" | "waiting" | "ok" {
  if (input.stage.isTerminal) return "ok";
  const open = (input.openActions ?? []).filter(
    (a) => a.status === NextActionStatus.OPEN,
  );
  if (open.some((a) => isOverdue(a.dueAt)) || isOverdue(input.nextActionDueAt)) {
    return "overdue";
  }
  if (
    input.formStatus === "SENT" ||
    input.formStatus === "OPENED" ||
    input.formStatus === "IN_PROGRESS" ||
    input.stage.slug === "waiting-for-client"
  ) {
    return "waiting";
  }
  return "ok";
}

export function formatPersonName(first: string, last: string): string {
  return `${first} ${last}`.trim();
}

export type PipelineRow = Opportunity & {
  contact: { firstName: string; lastName: string; email: string };
  company: { name: string };
  stage: PipelineStage;
  owner: { name: string; email: string } | null;
  nextActions: { id: string; title: string; dueAt: Date | null; status: NextActionStatus }[];
  formInvitations: {
    id: string;
    status: string;
    completionPct: number;
    lastSavedAt: Date | null;
  }[];
};
