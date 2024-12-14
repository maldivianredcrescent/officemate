/*
  Warnings:

  - You are about to drop the `WorkplanProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkplanProject" DROP CONSTRAINT "WorkplanProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "WorkplanProject" DROP CONSTRAINT "WorkplanProject_workplanId_fkey";

-- DropTable
DROP TABLE "WorkplanProject";

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workplanId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "budget" DOUBLE PRECISION,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_workplanId_fkey" FOREIGN KEY ("workplanId") REFERENCES "Workplan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
