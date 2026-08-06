-- Increment 4: Blueprint evidence foundation (additive only).
-- Forward: create new tables. Rollback: DROP new tables after confirming no app dependency.
-- Does not rewrite FormResponse, Process*, FormProcess*, or submitted graphs.

CREATE TABLE "BlueprintMeeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "formResponseId" TEXT,
    "title" TEXT NOT NULL,
    "meetingDate" DATETIME,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "durationMinutes" INTEGER,
    "facilitatorLabel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "processingStatus" TEXT,
    "reviewStatus" TEXT,
    "summaryManual" TEXT,
    "decisionsJson" TEXT NOT NULL DEFAULT '[]',
    "openQuestionsJson" TEXT NOT NULL DEFAULT '[]',
    "followUpsJson" TEXT NOT NULL DEFAULT '[]',
    "createdByUserId" TEXT,
    "updatedByUserId" TEXT,
    "supersededById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlueprintMeeting_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlueprintMeeting_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlueprintMeeting_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "BlueprintMeeting_companyId_idx" ON "BlueprintMeeting"("companyId");
CREATE INDEX "BlueprintMeeting_opportunityId_idx" ON "BlueprintMeeting"("opportunityId");
CREATE INDEX "BlueprintMeeting_formResponseId_idx" ON "BlueprintMeeting"("formResponseId");
CREATE INDEX "BlueprintMeeting_status_idx" ON "BlueprintMeeting"("status");

CREATE TABLE "BlueprintMeetingAttendee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "meetingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "email" TEXT,
    "isClient" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "BlueprintMeetingAttendee_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "BlueprintMeeting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "BlueprintMeetingAttendee_meetingId_idx" ON "BlueprintMeetingAttendee"("meetingId");

CREATE TABLE "BlueprintMeetingProcess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "meetingId" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    CONSTRAINT "BlueprintMeetingProcess_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "BlueprintMeeting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "BlueprintMeetingProcess_meetingId_processId_key" ON "BlueprintMeetingProcess"("meetingId", "processId");
CREATE INDEX "BlueprintMeetingProcess_processId_idx" ON "BlueprintMeetingProcess"("processId");

CREATE TABLE "EvidenceSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "formResponseId" TEXT,
    "meetingId" TEXT,
    "processId" TEXT,
    "sourceType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL DEFAULT '',
    "originalBodyText" TEXT NOT NULL DEFAULT '',
    "authorLabel" TEXT,
    "speakerNotesJson" TEXT,
    "fileName" TEXT,
    "mimeType" TEXT,
    "byteSize" INTEGER,
    "storageKey" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentSourceId" TEXT,
    "isSensitive" BOOLEAN NOT NULL DEFAULT false,
    "isIrrelevant" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "finalizedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EvidenceSource_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EvidenceSource_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EvidenceSource_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EvidenceSource_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "BlueprintMeeting" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "EvidenceSource_companyId_idx" ON "EvidenceSource"("companyId");
CREATE INDEX "EvidenceSource_opportunityId_idx" ON "EvidenceSource"("opportunityId");
CREATE INDEX "EvidenceSource_meetingId_idx" ON "EvidenceSource"("meetingId");
CREATE INDEX "EvidenceSource_formResponseId_idx" ON "EvidenceSource"("formResponseId");
CREATE INDEX "EvidenceSource_sourceType_status_idx" ON "EvidenceSource"("sourceType", "status");

CREATE TABLE "EvidenceFinding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "meetingId" TEXT,
    "processId" TEXT,
    "sourceId" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "excerpt" TEXT,
    "sourceLocation" TEXT,
    "speakerOrAuthor" TEXT,
    "confidence" TEXT,
    "extractionMethod" TEXT NOT NULL DEFAULT 'MANUAL_OWNER',
    "reviewStatus" TEXT NOT NULL DEFAULT 'PROPOSED',
    "correctedTitle" TEXT,
    "correctedBody" TEXT,
    "reviewedByUserId" TEXT,
    "reviewedAt" DATETIME,
    "duplicateOfId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EvidenceFinding_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EvidenceFinding_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EvidenceFinding_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "BlueprintMeeting" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EvidenceFinding_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "EvidenceSource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EvidenceFinding_companyId_idx" ON "EvidenceFinding"("companyId");
CREATE INDEX "EvidenceFinding_opportunityId_idx" ON "EvidenceFinding"("opportunityId");
CREATE INDEX "EvidenceFinding_meetingId_idx" ON "EvidenceFinding"("meetingId");
CREATE INDEX "EvidenceFinding_sourceId_idx" ON "EvidenceFinding"("sourceId");
CREATE INDEX "EvidenceFinding_processId_idx" ON "EvidenceFinding"("processId");
CREATE INDEX "EvidenceFinding_reviewStatus_idx" ON "EvidenceFinding"("reviewStatus");

CREATE TABLE "EvidenceConflict" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "meetingId" TEXT,
    "processId" TEXT,
    "subject" TEXT NOT NULL,
    "explanation" TEXT,
    "materiality" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'UNRESOLVED',
    "sourceAId" TEXT,
    "sourceBId" TEXT,
    "findingAId" TEXT,
    "findingBId" TEXT,
    "statementA" TEXT NOT NULL,
    "statementB" TEXT NOT NULL,
    "resolutionRationale" TEXT,
    "correctedValue" TEXT,
    "requiresClientConfirm" BOOLEAN NOT NULL DEFAULT false,
    "resolvedByUserId" TEXT,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EvidenceConflict_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EvidenceConflict_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EvidenceConflict_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "BlueprintMeeting" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EvidenceConflict_sourceAId_fkey" FOREIGN KEY ("sourceAId") REFERENCES "EvidenceSource" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EvidenceConflict_sourceBId_fkey" FOREIGN KEY ("sourceBId") REFERENCES "EvidenceSource" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EvidenceConflict_findingAId_fkey" FOREIGN KEY ("findingAId") REFERENCES "EvidenceFinding" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EvidenceConflict_findingBId_fkey" FOREIGN KEY ("findingBId") REFERENCES "EvidenceFinding" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "EvidenceConflict_companyId_idx" ON "EvidenceConflict"("companyId");
CREATE INDEX "EvidenceConflict_opportunityId_idx" ON "EvidenceConflict"("opportunityId");
CREATE INDEX "EvidenceConflict_meetingId_idx" ON "EvidenceConflict"("meetingId");
CREATE INDEX "EvidenceConflict_status_idx" ON "EvidenceConflict"("status");
