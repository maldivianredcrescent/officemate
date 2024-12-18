-- CreateTable
CREATE TABLE "Clearance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'created',
    "expenditure" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "requestId" TEXT NOT NULL,
    "rejectedById" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectedRemarks" TEXT,
    "submittedById" TEXT,
    "submittedAt" TIMESTAMP(3),
    "budgetApprovedById" TEXT,
    "budgetApprovedAt" TIMESTAMP(3),
    "financeApprovedById" TEXT,
    "financeApprovedAt" TIMESTAMP(3),
    "completedById" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clearance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clearance" ADD CONSTRAINT "Clearance_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clearance" ADD CONSTRAINT "Clearance_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clearance" ADD CONSTRAINT "Clearance_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clearance" ADD CONSTRAINT "Clearance_budgetApprovedById_fkey" FOREIGN KEY ("budgetApprovedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clearance" ADD CONSTRAINT "Clearance_financeApprovedById_fkey" FOREIGN KEY ("financeApprovedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clearance" ADD CONSTRAINT "Clearance_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
