-- AlterTable
ALTER TABLE "Clearance" ADD COLUMN     "budgetApprovedDesignation" TEXT,
ADD COLUMN     "completedDesignation" TEXT,
ADD COLUMN     "financeApprovedDesignation" TEXT,
ADD COLUMN     "submittedDesignation" TEXT;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "budgetApprovedDesignation" TEXT,
ADD COLUMN     "completedDesignation" TEXT,
ADD COLUMN     "financeApprovedDesignation" TEXT,
ADD COLUMN     "paymentProcessedDesignation" TEXT,
ADD COLUMN     "submittedDesignation" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "designation" TEXT;
