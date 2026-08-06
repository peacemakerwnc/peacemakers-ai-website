-- Phase 1.1 Increment 2 — link ProcessVersion to FormResponse; Blueprint discussion marker on steps.
-- Preserves all Phase 1 / Increment 1 data. No legacy FormProcess conversion.
-- Rollback: DROP INDEX ProcessVersion_formResponseId_idx; remove columns if unused.

ALTER TABLE "ProcessVersion" ADD COLUMN "formResponseId" TEXT;
CREATE INDEX "ProcessVersion_formResponseId_idx" ON "ProcessVersion"("formResponseId");

ALTER TABLE "ProcessStep" ADD COLUMN "discussDuringBlueprint" BOOLEAN NOT NULL DEFAULT false;
