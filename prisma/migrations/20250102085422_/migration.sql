-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "paymentProcessedAt" TIMESTAMP(3),
ADD COLUMN     "paymentProcessedById" TEXT,
ADD COLUMN     "paymentProcessedSignature" TEXT;
