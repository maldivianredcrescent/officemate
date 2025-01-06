-- AlterTable
ALTER TABLE "WorkplanMiscPayment" ADD COLUMN     "activityId" TEXT;

-- AddForeignKey
ALTER TABLE "WorkplanMiscPayment" ADD CONSTRAINT "WorkplanMiscPayment_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
