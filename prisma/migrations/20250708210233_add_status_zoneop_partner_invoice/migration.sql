-- CreateEnum
CREATE TYPE "Status" AS ENUM ('IN_MAINTENANCE', 'COMPLETED', 'LATE_PAYMENT', 'IN_CIRCULATION', 'BROKEN_DOWN');

-- AlterTable
ALTER TABLE "MaintenanceRecord" ADD COLUMN     "invoice" TEXT,
ADD COLUMN     "partnerId" INTEGER;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "km" INTEGER,
ADD COLUMN     "manufactureDate" TIMESTAMP(3),
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'IN_CIRCULATION',
ADD COLUMN     "zoneOp" TEXT;

-- CreateTable
CREATE TABLE "Partner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "district" TEXT,
    "coords" TEXT,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
