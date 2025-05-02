/*
  Warnings:

  - You are about to drop the column `specialfreight` on the `FleteReport` table. All the data in the column will be lost.
  - You are about to drop the column `specialfreightcustomer` on the `FleteReport` table. All the data in the column will be lost.
  - You are about to drop the column `anualprojectdescription` on the `KaizenReport` table. All the data in the column will be lost.
  - You are about to drop the column `kaizenideas` on the `KaizenReport` table. All the data in the column will be lost.
  - You are about to drop the column `numerokaizen` on the `KaizenReport` table. All the data in the column will be lost.
  - You are about to drop the column `projectdescription` on the `KaizenReport` table. All the data in the column will be lost.
  - You are about to drop the column `savingsanual` on the `KaizenReport` table. All the data in the column will be lost.
  - You are about to drop the column `kgscrap` on the `ProductionReport` table. All the data in the column will be lost.
  - You are about to drop the column `produccionkg` on the `ProductionReport` table. All the data in the column will be lost.
  - You are about to drop the column `produccionkm` on the `ProductionReport` table. All the data in the column will be lost.
  - You are about to drop the column `tieldTotal` on the `ProductionReport` table. All the data in the column will be lost.
  - You are about to drop the column `cantidadquejasbateria` on the `QuejasReport` table. All the data in the column will be lost.
  - You are about to drop the column `diassinquejas` on the `QuejasReport` table. All the data in the column will be lost.
  - You are about to drop the column `diassinquejasbateria` on the `QuejasReport` table. All the data in the column will be lost.
  - You are about to drop the column `fechaquejacliente` on the `QuejasReport` table. All the data in the column will be lost.
  - You are about to drop the column `fechaquejaclientebateria` on the `QuejasReport` table. All the data in the column will be lost.
  - You are about to drop the `Area` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `specialFreight` to the `FleteReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialFreightCustomer` to the `FleteReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anualProjectDescription` to the `KaizenReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kaizenIdeas` to the `KaizenReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroKaizen` to the `KaizenReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectDescription` to the `KaizenReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `savingsAnual` to the `KaizenReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kgScrap` to the `ProductionReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produccionKg` to the `ProductionReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produccionKm` to the `ProductionReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yieldTotal` to the `ProductionReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cantidadQuejasBateria` to the `QuejasReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diasSinQuejas` to the `QuejasReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diasSinQuejasBateria` to the `QuejasReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaQuejaCliente` to the `QuejasReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaQuejaClienteBateria` to the `QuejasReport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('oauth', 'email', 'credentials');

-- DropForeignKey
ALTER TABLE "AccidentReport" DROP CONSTRAINT "AccidentReport_areaId_fkey";

-- DropForeignKey
ALTER TABLE "ControlReport" DROP CONSTRAINT "ControlReport_areaId_fkey";

-- DropForeignKey
ALTER TABLE "FleteReport" DROP CONSTRAINT "FleteReport_areaId_fkey";

-- DropForeignKey
ALTER TABLE "KaizenReport" DROP CONSTRAINT "KaizenReport_areaId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionReport" DROP CONSTRAINT "ProductionReport_areaId_fkey";

-- DropForeignKey
ALTER TABLE "QualityReport" DROP CONSTRAINT "QualityReport_areaId_fkey";

-- DropForeignKey
ALTER TABLE "QuejasReport" DROP CONSTRAINT "QuejasReport_areaId_fkey";

-- DropForeignKey
ALTER TABLE "RHReport" DROP CONSTRAINT "RHReport_areaId_fkey";

-- AlterTable
ALTER TABLE "AccidentReport" ALTER COLUMN "cantidadAccidentes" SET DEFAULT 0,
ALTER COLUMN "cantidadCuasiAccidentes" SET DEFAULT 0,
ALTER COLUMN "diasUltimoAccidente" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "type",
ADD COLUMN     "type" "AccountType" NOT NULL;

-- AlterTable
ALTER TABLE "FleteReport" DROP COLUMN "specialfreight",
DROP COLUMN "specialfreightcustomer",
ADD COLUMN     "specialFreight" TEXT NOT NULL,
ADD COLUMN     "specialFreightCustomer" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "KaizenReport" DROP COLUMN "anualprojectdescription",
DROP COLUMN "kaizenideas",
DROP COLUMN "numerokaizen",
DROP COLUMN "projectdescription",
DROP COLUMN "savingsanual",
ADD COLUMN     "anualProjectDescription" TEXT NOT NULL,
ADD COLUMN     "kaizenIdeas" INTEGER NOT NULL,
ADD COLUMN     "numeroKaizen" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "projectDescription" TEXT NOT NULL,
ADD COLUMN     "savingsAnual" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductionReport" DROP COLUMN "kgscrap",
DROP COLUMN "produccionkg",
DROP COLUMN "produccionkm",
DROP COLUMN "tieldTotal",
ADD COLUMN     "kgScrap" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "produccionKg" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "produccionKm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "yieldTotal" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "QuejasReport" DROP COLUMN "cantidadquejasbateria",
DROP COLUMN "diassinquejas",
DROP COLUMN "diassinquejasbateria",
DROP COLUMN "fechaquejacliente",
DROP COLUMN "fechaquejaclientebateria",
ADD COLUMN     "cantidadQuejasBateria" INTEGER NOT NULL,
ADD COLUMN     "diasSinQuejas" INTEGER NOT NULL,
ADD COLUMN     "diasSinQuejasBateria" INTEGER NOT NULL,
ADD COLUMN     "fechaQuejaCliente" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaQuejaClienteBateria" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Area";

-- CreateTable
CREATE TABLE "areas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "areas_nombre_key" ON "areas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "areas_codigo_key" ON "areas"("codigo");

-- CreateIndex
CREATE INDEX "areas_nombre_idx" ON "areas"("nombre");

-- CreateIndex
CREATE INDEX "AccidentReport_areaId_fecha_idx" ON "AccidentReport"("areaId", "fecha");

-- CreateIndex
CREATE INDEX "ControlReport_areaId_fecha_idx" ON "ControlReport"("areaId", "fecha");

-- CreateIndex
CREATE INDEX "FleteReport_areaId_fecha_idx" ON "FleteReport"("areaId", "fecha");

-- CreateIndex
CREATE INDEX "KaizenReport_areaId_fecha_idx" ON "KaizenReport"("areaId", "fecha");

-- CreateIndex
CREATE INDEX "ProductionReport_areaId_fecha_idx" ON "ProductionReport"("areaId", "fecha");

-- CreateIndex
CREATE INDEX "QualityReport_areaId_fecha_idx" ON "QualityReport"("areaId", "fecha");

-- CreateIndex
CREATE INDEX "QuejasReport_areaId_fechaQuejaCliente_idx" ON "QuejasReport"("areaId", "fechaQuejaCliente");

-- CreateIndex
CREATE INDEX "RHReport_areaId_fecha_idx" ON "RHReport"("areaId", "fecha");

-- AddForeignKey
ALTER TABLE "AccidentReport" ADD CONSTRAINT "AccidentReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityReport" ADD CONSTRAINT "QualityReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuejasReport" ADD CONSTRAINT "QuejasReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KaizenReport" ADD CONSTRAINT "KaizenReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RHReport" ADD CONSTRAINT "RHReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleteReport" ADD CONSTRAINT "FleteReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlReport" ADD CONSTRAINT "ControlReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReport" ADD CONSTRAINT "ProductionReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
