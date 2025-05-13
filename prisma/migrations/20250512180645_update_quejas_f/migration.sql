/*
  Warnings:

  - You are about to drop the column `cantidadQuejasBateria` on the `QuejasReport` table. All the data in the column will be lost.
  - You are about to drop the column `diasSinQuejas` on the `QuejasReport` table. All the data in the column will be lost.
  - You are about to drop the column `diasSinQuejasBateria` on the `QuejasReport` table. All the data in the column will be lost.
  - You are about to drop the column `fechaQuejaCliente` on the `QuejasReport` table. All the data in the column will be lost.
  - You are about to drop the column `fechaQuejaClienteBateria` on the `QuejasReport` table. All the data in the column will be lost.
  - Added the required column `diasSinQueja` to the `QuejasReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaQueja` to the `QuejasReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `QuejasReport` table without a default value. This is not possible if the table is not empty.
  - Made the column `cantidadQuejas` on table `QuejasReport` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "QuejaType" AS ENUM ('CLIENTE', 'BATERIA');

-- DropIndex
DROP INDEX "QuejasReport_areaId_fechaQuejaCliente_idx";

-- AlterTable
ALTER TABLE "QuejasReport" DROP COLUMN "cantidadQuejasBateria",
DROP COLUMN "diasSinQuejas",
DROP COLUMN "diasSinQuejasBateria",
DROP COLUMN "fechaQuejaCliente",
DROP COLUMN "fechaQuejaClienteBateria",
ADD COLUMN     "diasSinQueja" INTEGER NOT NULL,
ADD COLUMN     "fechaQueja" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tipo" "QuejaType" NOT NULL,
ALTER COLUMN "cantidadQuejas" SET NOT NULL;

-- CreateIndex
CREATE INDEX "QuejasReport_areaId_fechaQueja_idx" ON "QuejasReport"("areaId", "fechaQueja");
