/*
  Warnings:

  - You are about to drop the column `numeroSap` on the `ProductionReport` table. All the data in the column will be lost.
  - Added the required column `numero_sap` to the `ProductionReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductionReport" DROP COLUMN "numeroSap",
ADD COLUMN     "numero_sap" TEXT NOT NULL;
