-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PERIODIC_INSPECTION', 'INVOICE', 'INSURANCE', 'OTHER');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "expireDate" TIMESTAMP(3),
ADD COLUMN     "type" "DocumentType" NOT NULL DEFAULT 'OTHER';
