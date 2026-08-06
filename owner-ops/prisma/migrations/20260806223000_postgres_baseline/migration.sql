-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('OPEN', 'WON', 'LOST', 'NURTURE');

-- CreateEnum
CREATE TYPE "FormInvitationStatus" AS ENUM ('PENDING', 'SENT', 'OPENED', 'IN_PROGRESS', 'SUBMITTED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "FormResponseStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "NextActionStatus" AS ENUM ('OPEN', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "FileAccessLevel" AS ENUM ('OWNER_ONLY', 'INVITATION_SCOPED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'VOID');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'VOID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProcessVersionClassification" AS ENUM ('AS_IS', 'FUTURE_STATE');

-- CreateEnum
CREATE TYPE "ProcessVersionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'OWNER_REFINED', 'APPROVED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "ProcessAuthorType" AS ENUM ('CLIENT', 'OWNER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ProcessStepType" AS ENUM ('TRIGGER', 'HUMAN_TASK', 'AUTOMATED_TASK', 'COMMUNICATION', 'DATA_ENTRY', 'DOCUMENT_CREATION', 'DECISION', 'APPROVAL', 'HANDOFF', 'WAITING_PERIOD', 'EXCEPTION', 'SUBPROCESS', 'PROCESS_END');

-- CreateEnum
CREATE TYPE "ProcessExecutionType" AS ENUM ('HUMAN', 'SYSTEM', 'HYBRID');

-- CreateEnum
CREATE TYPE "ProcessConnectionType" AS ENUM ('NORMAL', 'CONDITIONAL', 'APPROVED', 'REJECTED', 'RETURNED_FOR_CORRECTION', 'PARALLEL', 'LOOP', 'REWORK', 'ESCALATION', 'TIMEOUT', 'FAILURE', 'TERMINATION');

-- CreateEnum
CREATE TYPE "ProcessParticipantType" AS ENUM ('ROLE', 'PERSON', 'DEPARTMENT', 'CUSTOMER', 'VENDOR', 'SYSTEM', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "ProcessResponsibilityType" AS ENUM ('ACCOUNTABLE', 'RESPONSIBLE', 'CONSULTED', 'INFORMED', 'APPROVER', 'EXECUTOR');

-- CreateEnum
CREATE TYPE "ProcessApprovalType" AS ENUM ('AS_IS_BASELINE', 'FUTURE_STATE_BASELINE', 'OWNER_REVIEW');

-- CreateEnum
CREATE TYPE "ProcessApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RETURNED');

-- CreateEnum
CREATE TYPE "ProcessSwimlaneKind" AS ENUM ('ROLE', 'DEPARTMENT', 'PARTICIPANT', 'SYSTEM', 'EXTERNAL', 'UNASSIGNED');

-- CreateEnum
CREATE TYPE "PainPointCategory" AS ENUM ('DELAY_WAITING', 'DUPLICATE_ENTRY', 'MANUAL_TRANSFER', 'ERROR_REWORK', 'APPROVAL_BOTTLENECK', 'HANDOFF_FAILURE', 'SYSTEM_LIMITATION', 'MISSING_INFORMATION', 'COMMUNICATION_FAILURE', 'COMPLIANCE_RISK', 'CUSTOMER_EXPERIENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "PainPointSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('VOLUME', 'WORK_TIME', 'WAIT_TIME', 'TOTAL_CYCLE_TIME', 'ERROR_RATE', 'REWORK_RATE', 'APPROVAL_TIME', 'COST', 'CUSTOMER_RESPONSE_TIME', 'COMPLETION_RATE', 'OTHER');

-- CreateEnum
CREATE TYPE "MetricDataSource" AS ENUM ('CLIENT_PROVIDED', 'OWNER_ESTIMATE', 'VERIFIED_MEASUREMENT');

-- CreateEnum
CREATE TYPE "ImprovementCategory" AS ENUM ('ELIMINATE', 'SIMPLIFY', 'STANDARDIZE', 'AUTOMATE', 'INTEGRATE', 'IMPROVE_HANDOFF', 'IMPROVE_CONTROLS', 'IMPROVE_REPORTING', 'IMPROVE_CUSTOMER_COMMUNICATION', 'REDESIGN_RESPONSIBILITY', 'OTHER');

-- CreateEnum
CREATE TYPE "ImprovementStatus" AS ENUM ('CAPTURED', 'UNDER_REVIEW', 'CANDIDATE', 'DEFERRED', 'REJECTED', 'IMPLEMENTED');

-- CreateEnum
CREATE TYPE "ImprovementPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FormProcessMigrationStatus" AS ENUM ('UNREVIEWED', 'PRESERVED_LINEAR', 'LINKED_TO_GRAPH');

-- CreateEnum
CREATE TYPE "BlueprintMeetingStatus" AS ENUM ('PLANNED', 'COMPLETED', 'EVIDENCE_PROCESSING', 'AWAITING_OWNER_REVIEW', 'REVIEWED', 'SUPERSEDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EvidenceSourceType" AS ENUM ('QUESTIONNAIRE_RESPONSE', 'QUESTIONNAIRE_PROCESS', 'BLUEPRINT_TRANSCRIPT', 'CONSULTANT_NOTE', 'CLIENT_NOTE', 'ATTACHMENT', 'OWNER_OBSERVATION', 'OWNER_ESTIMATE', 'VERIFIED_MEASUREMENT', 'CLIENT_CONFIRMED_FACT', 'DECISION', 'ASSUMPTION', 'EXTERNAL_RESEARCH', 'SYSTEM_DERIVED_VALIDATION');

-- CreateEnum
CREATE TYPE "EvidenceSourceStatus" AS ENUM ('DRAFT', 'FINALIZED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "EvidenceFindingCategory" AS ENUM ('BUSINESS_OBJECTIVE', 'PROCESS', 'PROCESS_STEP', 'TRIGGER', 'OUTCOME', 'ROLE', 'SOFTWARE_SYSTEM', 'MANUAL_TASK', 'PAIN_POINT', 'BOTTLENECK', 'EXCEPTION', 'METRIC', 'TIME_ESTIMATE', 'COST_ESTIMATE', 'RISK', 'REQUIREMENT', 'CONSTRAINT', 'PREFERENCE', 'DECISION', 'ASSUMPTION', 'OPEN_QUESTION', 'FOLLOW_UP_ITEM', 'IMPROVEMENT_IDEA', 'OTHER');

-- CreateEnum
CREATE TYPE "EvidenceFindingReviewStatus" AS ENUM ('PROPOSED', 'ACCEPTED', 'CORRECTED_AND_ACCEPTED', 'REJECTED', 'DUPLICATE', 'NEEDS_CLARIFICATION', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "EvidenceConflictStatus" AS ENUM ('UNRESOLVED', 'NEEDS_CLIENT_CONFIRMATION', 'RESOLVED_SOURCE_A', 'RESOLVED_SOURCE_B', 'RESOLVED_CORRECTED', 'BOTH_VALID', 'NOT_MATERIAL', 'DEFERRED');

-- CreateEnum
CREATE TYPE "EvidenceConflictMateriality" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "EvidenceExtractionMethod" AS ENUM ('MANUAL_OWNER', 'DETERMINISTIC', 'PROPOSED_AI');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "primaryLocation" TEXT,
    "serviceAreas" TEXT,
    "industry" TEXT,
    "yearsInBusiness" INTEGER,
    "employeeCount" INTEGER,
    "adminEmployeeCount" INTEGER,
    "customersPerMonth" INTEGER,
    "annualRevenueRange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "jobTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyContact" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "role" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pipeline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineStage" (
    "id" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "objective" TEXT NOT NULL,
    "requiredInformation" TEXT NOT NULL DEFAULT '',
    "requiredOwnerAction" TEXT NOT NULL DEFAULT '',
    "clientFacingArtifact" TEXT,
    "suggestedMessage" TEXT,
    "relevantSopSlug" TEXT,
    "exitCriteria" TEXT NOT NULL DEFAULT '',
    "nextStageSlug" TEXT,
    "isTerminal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PipelineStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageChecklist" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StageChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "title" TEXT NOT NULL,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'OPEN',
    "estimatedValue" INTEGER,
    "formStatus" "FormInvitationStatus",
    "lastActivityAt" TIMESTAMP(3),
    "nextActionDueAt" TIMESTAMP(3),
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposedService" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'proposed',
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposedService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormTemplate" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "schemaJson" TEXT NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormInvitation" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "tokenPrefix" TEXT NOT NULL,
    "formTemplateId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "status" "FormInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "firstOpenedAt" TIMESTAMP(3),
    "lastSavedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "completionPct" INTEGER NOT NULL DEFAULT 0,
    "privacyNoticeVersion" TEXT,
    "privacyAcknowledgedAt" TIMESTAMP(3),
    "lastEmailSentAt" TIMESTAMP(3),
    "lastEmailProvider" TEXT,
    "lastEmailMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponse" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "FormResponseStatus" NOT NULL DEFAULT 'DRAFT',
    "payloadJson" TEXT NOT NULL DEFAULT '{}',
    "completionPct" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormProcess" (
    "id" TEXT NOT NULL,
    "formResponseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT,
    "processOwner" TEXT,
    "peopleInvolved" TEXT,
    "frequency" TEXT,
    "estimatedTime" TEXT,
    "businessImportance" TEXT,
    "frustrationLevel" TEXT,
    "errorReworkFrequency" TEXT,
    "affectsRevenue" BOOLEAN NOT NULL DEFAULT false,
    "affectsCustomerExp" BOOLEAN NOT NULL DEFAULT false,
    "affectsCost" BOOLEAN NOT NULL DEFAULT false,
    "affectsRisk" BOOLEAN NOT NULL DEFAULT false,
    "affectsWorkload" BOOLEAN NOT NULL DEFAULT false,
    "wantDetailedMap" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "isDetailedMap" BOOLEAN NOT NULL DEFAULT false,
    "businessObjective" TEXT,
    "averageVolume" TEXT,
    "averageCompletionTime" TEXT,
    "detailJson" TEXT NOT NULL DEFAULT '{}',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "migrationStatus" "FormProcessMigrationStatus" NOT NULL DEFAULT 'UNREVIEWED',
    "linkedProcessId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormProcessStep" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "responsibleRole" TEXT,
    "exactAction" TEXT,
    "toolUsed" TEXT,
    "informationReceived" TEXT,
    "informationChanged" TEXT,
    "outputRecipient" TEXT,
    "decisionInvolved" TEXT,
    "expectedTime" TEXT,
    "waitingTime" TEXT,
    "notificationSent" TEXT,
    "completionEvidence" TEXT,
    "problems" TEXT,
    "exceptions" TEXT,
    "workaround" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormProcessStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Process" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "name" TEXT NOT NULL,
    "purpose" TEXT,
    "customerOutcome" TEXT,
    "processOwner" TEXT,
    "status" "ProcessStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentDraftVersionId" TEXT,
    "currentApprovedAsIsVersionId" TEXT,
    "currentFutureStateVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessVersion" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "versionLabel" TEXT,
    "classification" "ProcessVersionClassification" NOT NULL,
    "status" "ProcessVersionStatus" NOT NULL DEFAULT 'DRAFT',
    "parentVersionId" TEXT,
    "derivedFromVersionId" TEXT,
    "authorType" "ProcessAuthorType" NOT NULL DEFAULT 'OWNER',
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
    "formResponseId" TEXT,
    "viewportJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "supersededAt" TIMESTAMP(3),

    CONSTRAINT "ProcessVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessStep" (
    "id" TEXT NOT NULL,
    "processVersionId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "shortName" TEXT NOT NULL,
    "detailedDescription" TEXT,
    "stepType" "ProcessStepType" NOT NULL,
    "responsibleRole" TEXT,
    "responsiblePerson" TEXT,
    "department" TEXT,
    "executionType" "ProcessExecutionType" NOT NULL DEFAULT 'HUMAN',
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
    "discussDuringBlueprint" BOOLEAN NOT NULL DEFAULT false,
    "completenessStatus" TEXT,
    "confidenceStatus" TEXT,
    "canvasX" DOUBLE PRECISION,
    "canvasY" DOUBLE PRECISION,
    "swimlaneId" TEXT,
    "sourceStepId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessConnection" (
    "id" TEXT NOT NULL,
    "processVersionId" TEXT NOT NULL,
    "sourceStepId" TEXT NOT NULL,
    "targetStepId" TEXT NOT NULL,
    "connectionType" "ProcessConnectionType" NOT NULL,
    "displayLabel" TEXT,
    "condition" TEXT,
    "businessRule" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isDefaultPath" BOOLEAN NOT NULL DEFAULT false,
    "exceptionMetadata" TEXT,
    "escalationMetadata" TEXT,
    "presentationRouteJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessParticipant" (
    "id" TEXT NOT NULL,
    "processVersionId" TEXT NOT NULL,
    "processStepId" TEXT,
    "participantType" "ProcessParticipantType" NOT NULL,
    "role" TEXT,
    "personLabel" TEXT,
    "contactId" TEXT,
    "department" TEXT,
    "externalDesignation" TEXT,
    "responsibilityType" "ProcessResponsibilityType" NOT NULL DEFAULT 'RESPONSIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessApproval" (
    "id" TEXT NOT NULL,
    "processVersionId" TEXT NOT NULL,
    "approvalType" "ProcessApprovalType" NOT NULL,
    "status" "ProcessApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "approverUserId" TEXT,
    "approverRole" TEXT,
    "criteriaOrNotes" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessSwimlane" (
    "id" TEXT NOT NULL,
    "processVersionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "ProcessSwimlaneKind" NOT NULL DEFAULT 'ROLE',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "colorHint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessSwimlane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessPainPoint" (
    "id" TEXT NOT NULL,
    "processVersionId" TEXT NOT NULL,
    "processStepId" TEXT,
    "processConnectionId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "PainPointCategory" NOT NULL DEFAULT 'OTHER',
    "severity" "PainPointSeverity" NOT NULL DEFAULT 'MEDIUM',
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessPainPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessMetric" (
    "id" TEXT NOT NULL,
    "processVersionId" TEXT NOT NULL,
    "processStepId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metricType" "MetricType" NOT NULL DEFAULT 'OTHER',
    "currentValue" TEXT,
    "unit" TEXT,
    "targetValue" TEXT,
    "measurementPeriod" TEXT,
    "dataSource" "MetricDataSource" NOT NULL DEFAULT 'OWNER_ESTIMATE',
    "confidence" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImprovementOpportunity" (
    "id" TEXT NOT NULL,
    "processVersionId" TEXT NOT NULL,
    "processStepId" TEXT,
    "processConnectionId" TEXT,
    "painPointId" TEXT,
    "metricId" TEXT,
    "title" TEXT NOT NULL,
    "problemAddressed" TEXT,
    "proposedChange" TEXT,
    "category" "ImprovementCategory" NOT NULL DEFAULT 'OTHER',
    "expectedBenefit" TEXT,
    "estimatedImpact" TEXT,
    "estimatedEffort" TEXT,
    "priority" "ImprovementPriority" NOT NULL DEFAULT 'MEDIUM',
    "confidence" TEXT,
    "dependencies" TEXT,
    "risks" TEXT,
    "assumptions" TEXT,
    "validationNeeded" TEXT,
    "status" "ImprovementStatus" NOT NULL DEFAULT 'CAPTURED',
    "ownerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImprovementOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyTool" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "formResponseId" TEXT,
    "toolId" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "usedFor" TEXT,
    "whoUses" TEXT,
    "informationHeld" TEXT,
    "connectsTo" TEXT,
    "worksWell" TEXT,
    "doesNotWorkWell" TEXT,
    "costOptional" TEXT,
    "retainDecision" TEXT,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAttachment" (
    "id" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "accessLevel" "FileAccessLevel" NOT NULL DEFAULT 'OWNER_ONLY',
    "category" TEXT,
    "companyId" TEXT,
    "contactId" TEXT,
    "opportunityId" TEXT,
    "invitationId" TEXT,
    "formResponseId" TEXT,
    "uploadedByOwner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "detailsJson" TEXT NOT NULL DEFAULT '{}',
    "actorType" TEXT NOT NULL DEFAULT 'system',
    "actorLabel" TEXT,
    "opportunityId" TEXT,
    "contactId" TEXT,
    "companyId" TEXT,
    "invitationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "authorUserId" TEXT,
    "opportunityId" TEXT,
    "contactId" TEXT,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "meetingType" TEXT NOT NULL,
    "status" "MeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "locationOrUrl" TEXT,
    "notes" TEXT,
    "opportunityId" TEXT,
    "contactId" TEXT,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NextAction" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "NextActionStatus" NOT NULL DEFAULT 'OPEN',
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "opportunityId" TEXT,
    "assigneeId" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NextAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT,
    "companyId" TEXT,
    "title" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "amountCents" INTEGER,
    "summary" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agreement" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT,
    "companyId" TEXT,
    "title" TEXT NOT NULL,
    "status" "AgreementStatus" NOT NULL DEFAULT 'DRAFT',
    "signedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT,
    "companyId" TEXT,
    "title" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'DRAFT',
    "amountCents" INTEGER,
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "externalRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectStage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sop" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "stageSlug" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "stageSlug" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorLabel" TEXT NOT NULL DEFAULT 'system',
    "entityType" TEXT,
    "entityId" TEXT,
    "detailsJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlueprintMeeting" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "formResponseId" TEXT,
    "title" TEXT NOT NULL,
    "meetingDate" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "facilitatorLabel" TEXT,
    "status" "BlueprintMeetingStatus" NOT NULL DEFAULT 'PLANNED',
    "processingStatus" TEXT,
    "reviewStatus" TEXT,
    "summaryManual" TEXT,
    "decisionsJson" TEXT NOT NULL DEFAULT '[]',
    "openQuestionsJson" TEXT NOT NULL DEFAULT '[]',
    "followUpsJson" TEXT NOT NULL DEFAULT '[]',
    "createdByUserId" TEXT,
    "updatedByUserId" TEXT,
    "supersededById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlueprintMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlueprintMeetingAttendee" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "email" TEXT,
    "isClient" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BlueprintMeetingAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlueprintMeetingProcess" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "processId" TEXT NOT NULL,

    CONSTRAINT "BlueprintMeetingProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceSource" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "formResponseId" TEXT,
    "meetingId" TEXT,
    "processId" TEXT,
    "sourceType" "EvidenceSourceType" NOT NULL,
    "status" "EvidenceSourceStatus" NOT NULL DEFAULT 'DRAFT',
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
    "finalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvidenceSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceFinding" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "meetingId" TEXT,
    "processId" TEXT,
    "sourceId" TEXT NOT NULL,
    "category" "EvidenceFindingCategory" NOT NULL DEFAULT 'OTHER',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "excerpt" TEXT,
    "sourceLocation" TEXT,
    "speakerOrAuthor" TEXT,
    "confidence" TEXT,
    "extractionMethod" "EvidenceExtractionMethod" NOT NULL DEFAULT 'MANUAL_OWNER',
    "reviewStatus" "EvidenceFindingReviewStatus" NOT NULL DEFAULT 'PROPOSED',
    "correctedTitle" TEXT,
    "correctedBody" TEXT,
    "reviewedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "duplicateOfId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvidenceFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceConflict" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "meetingId" TEXT,
    "processId" TEXT,
    "subject" TEXT NOT NULL,
    "explanation" TEXT,
    "materiality" "EvidenceConflictMateriality" NOT NULL DEFAULT 'MEDIUM',
    "status" "EvidenceConflictStatus" NOT NULL DEFAULT 'UNRESOLVED',
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
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvidenceConflict_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyContact_companyId_contactId_key" ON "CompanyContact"("companyId", "contactId");

-- CreateIndex
CREATE UNIQUE INDEX "Pipeline_slug_key" ON "Pipeline"("slug");

-- CreateIndex
CREATE INDEX "PipelineStage_pipelineId_sortOrder_idx" ON "PipelineStage"("pipelineId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PipelineStage_pipelineId_slug_key" ON "PipelineStage"("pipelineId", "slug");

-- CreateIndex
CREATE INDEX "StageChecklist_stageId_sortOrder_idx" ON "StageChecklist"("stageId", "sortOrder");

-- CreateIndex
CREATE INDEX "Opportunity_stageId_idx" ON "Opportunity"("stageId");

-- CreateIndex
CREATE INDEX "Opportunity_companyId_idx" ON "Opportunity"("companyId");

-- CreateIndex
CREATE INDEX "Opportunity_contactId_idx" ON "Opportunity"("contactId");

-- CreateIndex
CREATE INDEX "Opportunity_status_idx" ON "Opportunity"("status");

-- CreateIndex
CREATE INDEX "Opportunity_nextActionDueAt_idx" ON "Opportunity"("nextActionDueAt");

-- CreateIndex
CREATE INDEX "ProposedService_opportunityId_sortOrder_idx" ON "ProposedService"("opportunityId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "FormTemplate_slug_key" ON "FormTemplate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FormInvitation_tokenHash_key" ON "FormInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "FormInvitation_opportunityId_idx" ON "FormInvitation"("opportunityId");

-- CreateIndex
CREATE INDEX "FormInvitation_contactId_idx" ON "FormInvitation"("contactId");

-- CreateIndex
CREATE INDEX "FormInvitation_status_idx" ON "FormInvitation"("status");

-- CreateIndex
CREATE INDEX "FormInvitation_expiresAt_idx" ON "FormInvitation"("expiresAt");

-- CreateIndex
CREATE INDEX "FormResponse_invitationId_status_idx" ON "FormResponse"("invitationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponse_invitationId_version_key" ON "FormResponse"("invitationId", "version");

-- CreateIndex
CREATE INDEX "FormProcess_formResponseId_idx" ON "FormProcess"("formResponseId");

-- CreateIndex
CREATE INDEX "FormProcess_migrationStatus_idx" ON "FormProcess"("migrationStatus");

-- CreateIndex
CREATE INDEX "FormProcess_linkedProcessId_idx" ON "FormProcess"("linkedProcessId");

-- CreateIndex
CREATE INDEX "FormProcessStep_processId_sortOrder_idx" ON "FormProcessStep"("processId", "sortOrder");

-- CreateIndex
CREATE INDEX "Process_companyId_idx" ON "Process"("companyId");

-- CreateIndex
CREATE INDEX "Process_opportunityId_idx" ON "Process"("opportunityId");

-- CreateIndex
CREATE INDEX "Process_status_idx" ON "Process"("status");

-- CreateIndex
CREATE INDEX "ProcessVersion_processId_status_idx" ON "ProcessVersion"("processId", "status");

-- CreateIndex
CREATE INDEX "ProcessVersion_classification_idx" ON "ProcessVersion"("classification");

-- CreateIndex
CREATE INDEX "ProcessVersion_parentVersionId_idx" ON "ProcessVersion"("parentVersionId");

-- CreateIndex
CREATE INDEX "ProcessVersion_derivedFromVersionId_idx" ON "ProcessVersion"("derivedFromVersionId");

-- CreateIndex
CREATE INDEX "ProcessVersion_formResponseId_idx" ON "ProcessVersion"("formResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessVersion_processId_versionNumber_key" ON "ProcessVersion"("processId", "versionNumber");

-- CreateIndex
CREATE INDEX "ProcessStep_processVersionId_displayOrder_idx" ON "ProcessStep"("processVersionId", "displayOrder");

-- CreateIndex
CREATE INDEX "ProcessStep_stepType_idx" ON "ProcessStep"("stepType");

-- CreateIndex
CREATE INDEX "ProcessStep_swimlaneId_idx" ON "ProcessStep"("swimlaneId");

-- CreateIndex
CREATE INDEX "ProcessStep_sourceStepId_idx" ON "ProcessStep"("sourceStepId");

-- CreateIndex
CREATE INDEX "ProcessConnection_processVersionId_idx" ON "ProcessConnection"("processVersionId");

-- CreateIndex
CREATE INDEX "ProcessConnection_sourceStepId_idx" ON "ProcessConnection"("sourceStepId");

-- CreateIndex
CREATE INDEX "ProcessConnection_targetStepId_idx" ON "ProcessConnection"("targetStepId");

-- CreateIndex
CREATE INDEX "ProcessConnection_connectionType_idx" ON "ProcessConnection"("connectionType");

-- CreateIndex
CREATE INDEX "ProcessParticipant_processVersionId_idx" ON "ProcessParticipant"("processVersionId");

-- CreateIndex
CREATE INDEX "ProcessParticipant_processStepId_idx" ON "ProcessParticipant"("processStepId");

-- CreateIndex
CREATE INDEX "ProcessParticipant_contactId_idx" ON "ProcessParticipant"("contactId");

-- CreateIndex
CREATE INDEX "ProcessApproval_processVersionId_idx" ON "ProcessApproval"("processVersionId");

-- CreateIndex
CREATE INDEX "ProcessApproval_status_idx" ON "ProcessApproval"("status");

-- CreateIndex
CREATE INDEX "ProcessSwimlane_processVersionId_displayOrder_idx" ON "ProcessSwimlane"("processVersionId", "displayOrder");

-- CreateIndex
CREATE INDEX "ProcessPainPoint_processVersionId_idx" ON "ProcessPainPoint"("processVersionId");

-- CreateIndex
CREATE INDEX "ProcessPainPoint_processStepId_idx" ON "ProcessPainPoint"("processStepId");

-- CreateIndex
CREATE INDEX "ProcessPainPoint_category_idx" ON "ProcessPainPoint"("category");

-- CreateIndex
CREATE INDEX "ProcessPainPoint_severity_idx" ON "ProcessPainPoint"("severity");

-- CreateIndex
CREATE INDEX "ProcessMetric_processVersionId_idx" ON "ProcessMetric"("processVersionId");

-- CreateIndex
CREATE INDEX "ProcessMetric_processStepId_idx" ON "ProcessMetric"("processStepId");

-- CreateIndex
CREATE INDEX "ProcessMetric_metricType_idx" ON "ProcessMetric"("metricType");

-- CreateIndex
CREATE INDEX "ImprovementOpportunity_processVersionId_idx" ON "ImprovementOpportunity"("processVersionId");

-- CreateIndex
CREATE INDEX "ImprovementOpportunity_processStepId_idx" ON "ImprovementOpportunity"("processStepId");

-- CreateIndex
CREATE INDEX "ImprovementOpportunity_painPointId_idx" ON "ImprovementOpportunity"("painPointId");

-- CreateIndex
CREATE INDEX "ImprovementOpportunity_metricId_idx" ON "ImprovementOpportunity"("metricId");

-- CreateIndex
CREATE INDEX "ImprovementOpportunity_status_idx" ON "ImprovementOpportunity"("status");

-- CreateIndex
CREATE INDEX "ImprovementOpportunity_priority_idx" ON "ImprovementOpportunity"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_name_key" ON "Tool"("name");

-- CreateIndex
CREATE INDEX "CompanyTool_companyId_idx" ON "CompanyTool"("companyId");

-- CreateIndex
CREATE INDEX "CompanyTool_formResponseId_idx" ON "CompanyTool"("formResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "FileAttachment_storageKey_key" ON "FileAttachment"("storageKey");

-- CreateIndex
CREATE INDEX "FileAttachment_opportunityId_idx" ON "FileAttachment"("opportunityId");

-- CreateIndex
CREATE INDEX "FileAttachment_invitationId_idx" ON "FileAttachment"("invitationId");

-- CreateIndex
CREATE INDEX "FileAttachment_formResponseId_idx" ON "FileAttachment"("formResponseId");

-- CreateIndex
CREATE INDEX "Activity_opportunityId_createdAt_idx" ON "Activity"("opportunityId", "createdAt");

-- CreateIndex
CREATE INDEX "Activity_contactId_createdAt_idx" ON "Activity"("contactId", "createdAt");

-- CreateIndex
CREATE INDEX "Activity_companyId_createdAt_idx" ON "Activity"("companyId", "createdAt");

-- CreateIndex
CREATE INDEX "Note_opportunityId_idx" ON "Note"("opportunityId");

-- CreateIndex
CREATE INDEX "Note_contactId_idx" ON "Note"("contactId");

-- CreateIndex
CREATE INDEX "Note_companyId_idx" ON "Note"("companyId");

-- CreateIndex
CREATE INDEX "Meeting_opportunityId_idx" ON "Meeting"("opportunityId");

-- CreateIndex
CREATE INDEX "Meeting_scheduledAt_idx" ON "Meeting"("scheduledAt");

-- CreateIndex
CREATE INDEX "NextAction_opportunityId_status_idx" ON "NextAction"("opportunityId", "status");

-- CreateIndex
CREATE INDEX "NextAction_dueAt_idx" ON "NextAction"("dueAt");

-- CreateIndex
CREATE INDEX "NextAction_status_idx" ON "NextAction"("status");

-- CreateIndex
CREATE INDEX "ProjectStage_projectId_sortOrder_idx" ON "ProjectStage"("projectId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Sop_slug_key" ON "Sop"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_action_idx" ON "AuditEvent"("action");

-- CreateIndex
CREATE INDEX "BlueprintMeeting_companyId_idx" ON "BlueprintMeeting"("companyId");

-- CreateIndex
CREATE INDEX "BlueprintMeeting_opportunityId_idx" ON "BlueprintMeeting"("opportunityId");

-- CreateIndex
CREATE INDEX "BlueprintMeeting_formResponseId_idx" ON "BlueprintMeeting"("formResponseId");

-- CreateIndex
CREATE INDEX "BlueprintMeeting_status_idx" ON "BlueprintMeeting"("status");

-- CreateIndex
CREATE INDEX "BlueprintMeetingAttendee_meetingId_idx" ON "BlueprintMeetingAttendee"("meetingId");

-- CreateIndex
CREATE INDEX "BlueprintMeetingProcess_processId_idx" ON "BlueprintMeetingProcess"("processId");

-- CreateIndex
CREATE UNIQUE INDEX "BlueprintMeetingProcess_meetingId_processId_key" ON "BlueprintMeetingProcess"("meetingId", "processId");

-- CreateIndex
CREATE INDEX "EvidenceSource_companyId_idx" ON "EvidenceSource"("companyId");

-- CreateIndex
CREATE INDEX "EvidenceSource_opportunityId_idx" ON "EvidenceSource"("opportunityId");

-- CreateIndex
CREATE INDEX "EvidenceSource_meetingId_idx" ON "EvidenceSource"("meetingId");

-- CreateIndex
CREATE INDEX "EvidenceSource_formResponseId_idx" ON "EvidenceSource"("formResponseId");

-- CreateIndex
CREATE INDEX "EvidenceSource_sourceType_status_idx" ON "EvidenceSource"("sourceType", "status");

-- CreateIndex
CREATE INDEX "EvidenceFinding_companyId_idx" ON "EvidenceFinding"("companyId");

-- CreateIndex
CREATE INDEX "EvidenceFinding_opportunityId_idx" ON "EvidenceFinding"("opportunityId");

-- CreateIndex
CREATE INDEX "EvidenceFinding_meetingId_idx" ON "EvidenceFinding"("meetingId");

-- CreateIndex
CREATE INDEX "EvidenceFinding_sourceId_idx" ON "EvidenceFinding"("sourceId");

-- CreateIndex
CREATE INDEX "EvidenceFinding_processId_idx" ON "EvidenceFinding"("processId");

-- CreateIndex
CREATE INDEX "EvidenceFinding_reviewStatus_idx" ON "EvidenceFinding"("reviewStatus");

-- CreateIndex
CREATE INDEX "EvidenceConflict_companyId_idx" ON "EvidenceConflict"("companyId");

-- CreateIndex
CREATE INDEX "EvidenceConflict_opportunityId_idx" ON "EvidenceConflict"("opportunityId");

-- CreateIndex
CREATE INDEX "EvidenceConflict_meetingId_idx" ON "EvidenceConflict"("meetingId");

-- CreateIndex
CREATE INDEX "EvidenceConflict_status_idx" ON "EvidenceConflict"("status");

-- AddForeignKey
ALTER TABLE "CompanyContact" ADD CONSTRAINT "CompanyContact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyContact" ADD CONSTRAINT "CompanyContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineStage" ADD CONSTRAINT "PipelineStage_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageChecklist" ADD CONSTRAINT "StageChecklist_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "PipelineStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "PipelineStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposedService" ADD CONSTRAINT "ProposedService_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInvitation" ADD CONSTRAINT "FormInvitation_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "FormTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInvitation" ADD CONSTRAINT "FormInvitation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInvitation" ADD CONSTRAINT "FormInvitation_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "FormInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormProcess" ADD CONSTRAINT "FormProcess_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormProcess" ADD CONSTRAINT "FormProcess_linkedProcessId_fkey" FOREIGN KEY ("linkedProcessId") REFERENCES "Process"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormProcessStep" ADD CONSTRAINT "FormProcessStep_processId_fkey" FOREIGN KEY ("processId") REFERENCES "FormProcess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessVersion" ADD CONSTRAINT "ProcessVersion_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessVersion" ADD CONSTRAINT "ProcessVersion_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessVersion" ADD CONSTRAINT "ProcessVersion_parentVersionId_fkey" FOREIGN KEY ("parentVersionId") REFERENCES "ProcessVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessVersion" ADD CONSTRAINT "ProcessVersion_derivedFromVersionId_fkey" FOREIGN KEY ("derivedFromVersionId") REFERENCES "ProcessVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessStep" ADD CONSTRAINT "ProcessStep_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessStep" ADD CONSTRAINT "ProcessStep_swimlaneId_fkey" FOREIGN KEY ("swimlaneId") REFERENCES "ProcessSwimlane"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessStep" ADD CONSTRAINT "ProcessStep_sourceStepId_fkey" FOREIGN KEY ("sourceStepId") REFERENCES "ProcessStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessConnection" ADD CONSTRAINT "ProcessConnection_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessConnection" ADD CONSTRAINT "ProcessConnection_sourceStepId_fkey" FOREIGN KEY ("sourceStepId") REFERENCES "ProcessStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessConnection" ADD CONSTRAINT "ProcessConnection_targetStepId_fkey" FOREIGN KEY ("targetStepId") REFERENCES "ProcessStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessParticipant" ADD CONSTRAINT "ProcessParticipant_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessParticipant" ADD CONSTRAINT "ProcessParticipant_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessApproval" ADD CONSTRAINT "ProcessApproval_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessSwimlane" ADD CONSTRAINT "ProcessSwimlane_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessPainPoint" ADD CONSTRAINT "ProcessPainPoint_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessPainPoint" ADD CONSTRAINT "ProcessPainPoint_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessMetric" ADD CONSTRAINT "ProcessMetric_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessMetric" ADD CONSTRAINT "ProcessMetric_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImprovementOpportunity" ADD CONSTRAINT "ImprovementOpportunity_processVersionId_fkey" FOREIGN KEY ("processVersionId") REFERENCES "ProcessVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImprovementOpportunity" ADD CONSTRAINT "ImprovementOpportunity_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImprovementOpportunity" ADD CONSTRAINT "ImprovementOpportunity_painPointId_fkey" FOREIGN KEY ("painPointId") REFERENCES "ProcessPainPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImprovementOpportunity" ADD CONSTRAINT "ImprovementOpportunity_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "ProcessMetric"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyTool" ADD CONSTRAINT "CompanyTool_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyTool" ADD CONSTRAINT "CompanyTool_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyTool" ADD CONSTRAINT "CompanyTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAttachment" ADD CONSTRAINT "FileAttachment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAttachment" ADD CONSTRAINT "FileAttachment_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAttachment" ADD CONSTRAINT "FileAttachment_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAttachment" ADD CONSTRAINT "FileAttachment_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "FormInvitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAttachment" ADD CONSTRAINT "FileAttachment_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "FormInvitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextAction" ADD CONSTRAINT "NextAction_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextAction" ADD CONSTRAINT "NextAction_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStage" ADD CONSTRAINT "ProjectStage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlueprintMeeting" ADD CONSTRAINT "BlueprintMeeting_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlueprintMeeting" ADD CONSTRAINT "BlueprintMeeting_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlueprintMeeting" ADD CONSTRAINT "BlueprintMeeting_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlueprintMeetingAttendee" ADD CONSTRAINT "BlueprintMeetingAttendee_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "BlueprintMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlueprintMeetingProcess" ADD CONSTRAINT "BlueprintMeetingProcess_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "BlueprintMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceSource" ADD CONSTRAINT "EvidenceSource_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceSource" ADD CONSTRAINT "EvidenceSource_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceSource" ADD CONSTRAINT "EvidenceSource_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceSource" ADD CONSTRAINT "EvidenceSource_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "BlueprintMeeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceFinding" ADD CONSTRAINT "EvidenceFinding_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceFinding" ADD CONSTRAINT "EvidenceFinding_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceFinding" ADD CONSTRAINT "EvidenceFinding_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "BlueprintMeeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceFinding" ADD CONSTRAINT "EvidenceFinding_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "EvidenceSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceConflict" ADD CONSTRAINT "EvidenceConflict_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceConflict" ADD CONSTRAINT "EvidenceConflict_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceConflict" ADD CONSTRAINT "EvidenceConflict_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "BlueprintMeeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceConflict" ADD CONSTRAINT "EvidenceConflict_sourceAId_fkey" FOREIGN KEY ("sourceAId") REFERENCES "EvidenceSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceConflict" ADD CONSTRAINT "EvidenceConflict_sourceBId_fkey" FOREIGN KEY ("sourceBId") REFERENCES "EvidenceSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceConflict" ADD CONSTRAINT "EvidenceConflict_findingAId_fkey" FOREIGN KEY ("findingAId") REFERENCES "EvidenceFinding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceConflict" ADD CONSTRAINT "EvidenceConflict_findingBId_fkey" FOREIGN KEY ("findingBId") REFERENCES "EvidenceFinding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

