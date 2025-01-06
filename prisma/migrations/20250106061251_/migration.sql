-- CreateTable
CREATE TABLE "WorkplanMiscPayment" (
    "id" TEXT NOT NULL,
    "workplanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkplanMiscPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkplanMiscPayment" ADD CONSTRAINT "WorkplanMiscPayment_workplanId_fkey" FOREIGN KEY ("workplanId") REFERENCES "Workplan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
