-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_unitId_fkey";

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "unitId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
