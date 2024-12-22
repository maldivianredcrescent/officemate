/*
  Warnings:

  - You are about to drop the column `expenditure` on the `Clearance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clearance" DROP COLUMN "expenditure";

-- AlterTable
ALTER TABLE "RequestItem" ADD COLUMN     "expenditure" DOUBLE PRECISION DEFAULT 0;
