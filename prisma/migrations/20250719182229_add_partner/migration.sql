/*
  Warnings:

  - You are about to drop the column `coords` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Partner` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nif` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Made the column `location` on table `Partner` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "coords",
DROP COLUMN "district",
DROP COLUMN "name",
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ADD COLUMN     "nif" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ALTER COLUMN "location" SET NOT NULL;
