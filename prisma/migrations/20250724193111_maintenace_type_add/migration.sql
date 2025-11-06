-- CreateEnum
CREATE TYPE "InterventionType" AS ENUM ('BODYWORK', 'TYRES', 'MAINTENANCE', 'INSPECTION', 'HVAC', 'OTHER');

-- AlterTable
ALTER TABLE "MaintenanceRecord" ADD COLUMN     "type" "InterventionType" NOT NULL DEFAULT 'OTHER';
