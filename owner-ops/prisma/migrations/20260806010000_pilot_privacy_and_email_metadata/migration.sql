-- AlterTable
ALTER TABLE "FormInvitation" ADD COLUMN "privacyNoticeVersion" TEXT;
ALTER TABLE "FormInvitation" ADD COLUMN "privacyAcknowledgedAt" DATETIME;
ALTER TABLE "FormInvitation" ADD COLUMN "lastEmailSentAt" DATETIME;
ALTER TABLE "FormInvitation" ADD COLUMN "lastEmailProvider" TEXT;
ALTER TABLE "FormInvitation" ADD COLUMN "lastEmailMessageId" TEXT;
