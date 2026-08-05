-- Increment 3: owner visual workspace — swimlanes, analysis entities, presentation metadata.
-- Forward: additive only. Rollback: DROP new tables/columns after confirming no dependent app code.
-- Does not rewrite ProcessVersion graphs or FormProcess/FormProcessStep rows.

ALTER TABLE "ProcessVersion" ADD COLUMN "viewportJson" TEXT;

ALTER TABLE "ProcessStep" ADD COLUMN "swimlaneId" TEXT;
ALTER TABLE "ProcessStep" ADD COLUMN "sourceStepId" TEXT;

CREATE TABLE "ProcessSwimlane" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processVersionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'ROLE',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "colorHint" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProcessSwimlane_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ProcessPainPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processVersionId" TEXT NOT NULL,
    "processStepId" TEXT,
    "processConnectionId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "frequency" TEXT,
    "estimatedTimeImpact" TEXT,
    "estimatedFinancialImpact" TEXT,
    "financialImpactSource" TEXT,
    "customerImpact" TEXT,
    "complianceOrOpsRisk" TEXT,
    "evidenceSource" TEXT,
    "currentWorkaround" TEXT,
    "confidence" TEXT,
    "ownerNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProcessPainPoint_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcessPainPoint_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "ProcessMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processVersionId" TEXT NOT NULL,
    "processStepId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metricType" TEXT NOT NULL DEFAULT 'OTHER',
    "currentValue" TEXT,
    "unit" TEXT,
    "targetValue" TEXT,
    "measurementPeriod" TEXT,
    "dataSource" TEXT NOT NULL DEFAULT 'OWNER_ESTIMATE',
    "confidence" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProcessMetric_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcessMetric_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "ImprovementOpportunity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processVersionId" TEXT NOT NULL,
    "processStepId" TEXT,
    "processConnectionId" TEXT,
    "painPointId" TEXT,
    "metricId" TEXT,
    "title" TEXT NOT NULL,
    "problemAddressed" TEXT,
    "proposedChange" TEXT,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "expectedBenefit" TEXT,
    "estimatedImpact" TEXT,
    "estimatedEffort" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "confidence" TEXT,
    "dependencies" TEXT,
    "risks" TEXT,
    "assumptions" TEXT,
    "validationNeeded" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CAPTURED',
    "ownerNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImprovementOpportunity_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ImprovementOpportunity_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ImprovementOpportunity_painPointId_fkey" FOREIGN KEY ("painPointId") REFERENCES "ProcessPainPoint" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ImprovementOpportunity_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "ProcessMetric" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "ProcessSwimlane_processVersionId_displayOrder_idx" ON "ProcessSwimlane"("processVersionId", "displayOrder");
CREATE INDEX "ProcessPainPoint_processVersionId_idx" ON "ProcessPainPoint"("processVersionId");
CREATE INDEX "ProcessPainPoint_processStepId_idx" ON "ProcessPainPoint"("processStepId");
CREATE INDEX "ProcessPainPoint_category_idx" ON "ProcessPainPoint"("category");
CREATE INDEX "ProcessPainPoint_severity_idx" ON "ProcessPainPoint"("severity");
CREATE INDEX "ProcessMetric_processVersionId_idx" ON "ProcessMetric"("processVersionId");
CREATE INDEX "ProcessMetric_processStepId_idx" ON "ProcessMetric"("processStepId");
CREATE INDEX "ProcessMetric_metricType_idx" ON "ProcessMetric"("metricType");
CREATE INDEX "ImprovementOpportunity_processVersionId_idx" ON "ImprovementOpportunity"("processVersionId");
CREATE INDEX "ImprovementOpportunity_processStepId_idx" ON "ImprovementOpportunity"("processStepId");
CREATE INDEX "ImprovementOpportunity_painPointId_idx" ON "ImprovementOpportunity"("painPointId");
CREATE INDEX "ImprovementOpportunity_metricId_idx" ON "ImprovementOpportunity"("metricId");
CREATE INDEX "ImprovementOpportunity_status_idx" ON "ImprovementOpportunity"("status");
CREATE INDEX "ImprovementOpportunity_priority_idx" ON "ImprovementOpportunity"("priority");
CREATE INDEX "ProcessStep_swimlaneId_idx" ON "ProcessStep"("swimlaneId");
CREATE INDEX "ProcessStep_sourceStepId_idx" ON "ProcessStep"("sourceStepId");
