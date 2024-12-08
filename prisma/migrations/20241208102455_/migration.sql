-- AddForeignKey
ALTER TABLE "WorkplanProject" ADD CONSTRAINT "WorkplanProject_workplanId_fkey" FOREIGN KEY ("workplanId") REFERENCES "Workplan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkplanProject" ADD CONSTRAINT "WorkplanProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
