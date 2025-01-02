/*
  Warnings:

  - You are about to drop the column `rejectedReason` on the `Clearance` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedReason` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clearance" DROP COLUMN "rejectedReason";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "rejectedReason";
