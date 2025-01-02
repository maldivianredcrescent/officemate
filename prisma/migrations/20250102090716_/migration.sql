-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_paymentProcessedById_fkey" FOREIGN KEY ("paymentProcessedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
