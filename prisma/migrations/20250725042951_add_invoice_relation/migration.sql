/*
  Warnings:

  - You are about to drop the column `invoice` on the `MaintenanceRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceDocumentId]` on the table `MaintenanceRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MaintenanceRecord" DROP COLUMN "invoice",
ADD COLUMN     "invoiceDocumentId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceRecord_invoiceDocumentId_key" ON "MaintenanceRecord"("invoiceDocumentId");

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_invoiceDocumentId_fkey" FOREIGN KEY ("invoiceDocumentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
