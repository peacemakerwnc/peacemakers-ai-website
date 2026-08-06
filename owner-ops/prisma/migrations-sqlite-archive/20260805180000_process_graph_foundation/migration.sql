-- Phase 1.1 Increment 1 — relational process graph foundation
-- SAFE migration: preserves all Phase 1 FormResponse-captured Process/ProcessStep rows.
-- Strategy:
--   1) Rename legacy Process → FormProcess and ProcessStep → FormProcessStep (data intact).
--   2) Mark legacy rows for review; do NOT fabricate connections, branches, or approvals.
--   3) Create new graph tables Process / ProcessVersion / ProcessStep / ProcessConnection /
--      ProcessParticipant / ProcessApproval.
-- Rollback (non-destructive guidance):
--   - If no graph Process rows exist, rename FormProcess→Process and FormProcessStep→ProcessStep,
--     drop new graph tables, remove migrationStatus/linkedProcessId columns.
--   - If graph rows exist, export them before any rename reverse.
--   - Never DROP FormProcess / FormProcessStep as a rollback shortcut.

PRAGMA foreign_keys=OFF;

-- 1) Preserve legacy linear capture tables under new names
ALTER TABLE "ProcessStep" RENAME TO "FormProcessStep";
ALTER TABLE "Process" RENAME TO "FormProcess";

-- 2) Review markers — no inferred edges
ALTER TABLE "FormProcess" ADD COLUMN "migrationStatus" TEXT NOT NULL DEFAULT 'UNREVIEWED';
ALTER TABLE "FormProcess" ADD COLUMN "linkedProcessId" TEXT;

UPDATE "FormProcess"
SET "migrationStatus" = 'PRESERVED_LINEAR'
WHERE "isDetailedMap" = 1;

-- Drop old indexes that referenced previous table names (SQLite keeps some; recreate below)
DROP INDEX IF EXISTS "Process_formResponseId_idx";
DROP INDEX IF EXISTS "ProcessStep_processId_sortOrder_idx";

CREATE INDEX "FormProcess_formResponseId_idx" ON "FormProcess"("formResponseId");
CREATE INDEX "FormProcess_migrationStatus_idx" ON "FormProcess"("migrationStatus");
CREATE INDEX "FormProcess_linkedProcessId_idx" ON "FormProcess"("linkedProcessId");
CREATE INDEX "FormProcessStep_processId_sortOrder_idx" ON "FormProcessStep"("processId", "sortOrder");

-- 3) New durable Process identity (graph) — empty; no row fabricated from legacy prose
CREATE TABLE "Process" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "name" TEXT NOT NULL,
    "purpose" TEXT,
    "customerOutcome" TEXT,
    "processOwner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "currentDraftVersionId" TEXT,
    "currentApprovedAsIsVersionId" TEXT,
    "currentFutureStateVersionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Process_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Process_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "Process_companyId_idx" ON "Process"("companyId");
CREATE INDEX "Process_opportunityId_idx" ON "Process"("opportunityId");
CREATE INDEX "Process_status_idx" ON "Process"("status");

-- Optional link from preserved form capture → graph process (set only by explicit owner action later)
-- SQLite cannot easily ADD CONSTRAINT after; enforce via application + nullable column.

CREATE TABLE "ProcessVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "versionLabel" TEXT,
    "classification" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "parentVersionId" TEXT,
    "derivedFromVersionId" TEXT,
    "authorType" TEXT NOT NULL DEFAULT 'OWNER',
    "authorUserId" TEXT,
    "authorLabel" TEXT,
    "purpose" TEXT,
    "outcome" TEXT,
    "startTrigger" TEXT,
    "endEvent" TEXT,
    "startBoundary" TEXT,
    "endBoundary" TEXT,
    "frequency" TEXT,
    "averageVolume" TEXT,
    "peakVolume" TEXT,
    "averageCompletionTime" TEXT,
    "governingRules" TEXT,
    "policies" TEXT,
    "contractualObligations" TEXT,
    "deadlines" TEXT,
    "serviceExpectations" TEXT,
    "successMeasures" TEXT,
    "currentPerformance" TEXT,
    "internalNotes" TEXT,
    "clientNotes" TEXT,
    "completenessStatus" TEXT,
    "confidenceStatus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "submittedAt" DATETIME,
    "approvedAt" DATETIME,
    "supersededAt" DATETIME,
    CONSTRAINT "ProcessVersion_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcessVersion_parentVersionId_fkey" FOREIGN KEY ("parentVersionId") REFERENCES "ProcessVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProcessVersion_derivedFromVersionId_fkey" FOREIGN KEY ("derivedFromVersionId") REFERENCES "ProcessVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "ProcessVersion_processId_status_idx" ON "ProcessVersion"("processId", "status");
CREATE INDEX "ProcessVersion_classification_idx" ON "ProcessVersion"("classification");
CREATE INDEX "ProcessVersion_parentVersionId_idx" ON "ProcessVersion"("parentVersionId");
CREATE INDEX "ProcessVersion_derivedFromVersionId_idx" ON "ProcessVersion"("derivedFromVersionId");
CREATE UNIQUE INDEX "ProcessVersion_processId_versionNumber_key" ON "ProcessVersion"("processId", "versionNumber");

CREATE TABLE "ProcessStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processVersionId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "shortName" TEXT NOT NULL,
    "detailedDescription" TEXT,
    "stepType" TEXT NOT NULL,
    "responsibleRole" TEXT,
    "responsiblePerson" TEXT,
    "department" TEXT,
    "executionType" TEXT NOT NULL DEFAULT 'HUMAN',
    "toolOrSystem" TEXT,
    "requiredInputs" TEXT,
    "dataReceived" TEXT,
    "informationHandled" TEXT,
    "outputProduced" TEXT,
    "outputRecipient" TEXT,
    "expectedWorkTime" TEXT,
    "typicalWaitingTime" TEXT,
    "deadline" TEXT,
    "serviceExpectation" TEXT,
    "notification" TEXT,
    "evidenceOfCompletion" TEXT,
    "problems" TEXT,
    "workarounds" TEXT,
    "valueClassification" TEXT,
    "automationSuitability" TEXT,
    "internalNotes" TEXT,
    "clientNotes" TEXT,
    "unresolvedQuestions" TEXT,
    "completenessStatus" TEXT,
    "confidenceStatus" TEXT,
    "canvasX" REAL,
    "canvasY" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcessStep_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ProcessStep_processVersionId_displayOrder_idx" ON "ProcessStep"("processVersionId", "displayOrder");
CREATE INDEX "ProcessStep_stepType_idx" ON "ProcessStep"("stepType");

CREATE TABLE "ProcessConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processVersionId" TEXT NOT NULL,
    "sourceStepId" TEXT NOT NULL,
    "targetStepId" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL,
    "displayLabel" TEXT,
    "condition" TEXT,
    "businessRule" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isDefaultPath" BOOLEAN NOT NULL DEFAULT false,
    "exceptionMetadata" TEXT,
    "escalationMetadata" TEXT,
    "presentationRouteJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcessConnection_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcessConnection_sourceStepId_fkey" FOREIGN KEY ("sourceStepId") REFERENCES "ProcessStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessConnection_targetStepId_fkey" FOREIGN KEY ("targetStepId") REFERENCES "ProcessStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "ProcessConnection_processVersionId_idx" ON "ProcessConnection"("processVersionId");
CREATE INDEX "ProcessConnection_sourceStepId_idx" ON "ProcessConnection"("sourceStepId");
CREATE INDEX "ProcessConnection_targetStepId_idx" ON "ProcessConnection"("targetStepId");
CREATE INDEX "ProcessConnection_connectionType_idx" ON "ProcessConnection"("connectionType");

CREATE TABLE "ProcessParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processVersionId" TEXT NOT NULL,
    "processStepId" TEXT,
    "participantType" TEXT NOT NULL,
    "role" TEXT,
    "personLabel" TEXT,
    "contactId" TEXT,
    "department" TEXT,
    "externalDesignation" TEXT,
    "responsibilityType" TEXT NOT NULL DEFAULT 'RESPONSIBLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcessParticipant_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcessParticipant_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ProcessParticipant_processVersionId_idx" ON "ProcessParticipant"("processVersionId");
CREATE INDEX "ProcessParticipant_processStepId_idx" ON "ProcessParticipant"("processStepId");
CREATE INDEX "ProcessParticipant_contactId_idx" ON "ProcessParticipant"("contactId");

CREATE TABLE "ProcessApproval" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processVersionId" TEXT NOT NULL,
    "approvalType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approverUserId" TEXT,
    "approverRole" TEXT,
    "criteriaOrNotes" TEXT,
    "decidedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProcessApproval_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ProcessApproval_processVersionId_idx" ON "ProcessApproval"("processVersionId");
CREATE INDEX "ProcessApproval_status_idx" ON "ProcessApproval"("status");

PRAGMA foreign_keys=ON;
