-- AlterTable
ALTER TABLE "Clearance" ADD COLUMN     "budgetApprovedSignature" TEXT,
ADD COLUMN     "financeApprovedSignature" TEXT,
ADD COLUMN     "submittedSignature" TEXT;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "budgetApprovedSignature" TEXT,
ADD COLUMN     "financeApprovedSignature" TEXT,
ADD COLUMN     "submittedSignature" TEXT;
