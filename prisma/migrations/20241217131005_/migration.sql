-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "budgetApprovedById" TEXT,
ADD COLUMN     "financeApprovedById" TEXT,
ADD COLUMN     "submittedById" TEXT;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_budgetApprovedById_fkey" FOREIGN KEY ("budgetApprovedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_financeApprovedById_fkey" FOREIGN KEY ("financeApprovedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
