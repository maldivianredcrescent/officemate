-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "budgetApprovedAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "completedById" TEXT,
ADD COLUMN     "financeApprovedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'created';

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
