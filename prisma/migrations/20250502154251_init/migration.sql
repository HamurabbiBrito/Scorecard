-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SA', 'Operador');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'Operador',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccidentReport" (
    "fecha" TIMESTAMP(3) NOT NULL,
    "cantidadAccidentes" INTEGER NOT NULL,
    "cantidadCuasiAccidentes" INTEGER NOT NULL,
    "diasUltimoAccidente" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "AccidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityReport" (
    "fecha" TIMESTAMP(3) NOT NULL,
    "qualityCreditNoteUSD" TEXT NOT NULL,
    "qualityCreditNoteUSDBattery" DOUBLE PRECISION NOT NULL,
    "mesAnterior" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "cantidadQuejas" INTEGER NOT NULL,
    "cantidadQuejasBateria" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "QualityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuejasReport" (
    "fechaquejacliente" TIMESTAMP(3) NOT NULL,
    "cantidadQuejas" INTEGER NOT NULL,
    "diassinquejas" INTEGER NOT NULL,
    "fechaquejaclientebateria" TIMESTAMP(3) NOT NULL,
    "cantidadquejasbateria" INTEGER NOT NULL,
    "diassinquejasbateria" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "QuejasReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KaizenReport" (
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "anualprojectdescription" TEXT NOT NULL,
    "kaizenideas" INTEGER NOT NULL,
    "numerokaizen" DOUBLE PRECISION NOT NULL,
    "percentAudit5s" DOUBLE PRECISION NOT NULL,
    "projectdescription" TEXT NOT NULL,
    "savings" INTEGER NOT NULL,
    "savingsanual" TEXT NOT NULL,
    "target5s" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "KaizenReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RHReport" (
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hrAbsenteeims" INTEGER NOT NULL,
    "hrInability" INTEGER NOT NULL,
    "hrTurnover" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "RHReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleteReport" (
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "specialfreight" TEXT NOT NULL,
    "specialfreightcustomer" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "FleteReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlReport" (
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "capacityUtilization" DOUBLE PRECISION NOT NULL,
    "capacityUtilizationBattery" DOUBLE PRECISION NOT NULL,
    "dlp" DOUBLE PRECISION NOT NULL,
    "dlpBattery" DOUBLE PRECISION NOT NULL,
    "dlpSemana" DOUBLE PRECISION NOT NULL,
    "dlpSemanaMaterial" DOUBLE PRECISION NOT NULL,
    "impactoDlpEnUsd" DOUBLE PRECISION NOT NULL,
    "impactoDlpEnUsdBateria" DOUBLE PRECISION NOT NULL,
    "metaMensual" DOUBLE PRECISION NOT NULL,
    "metaMensualBateria" DOUBLE PRECISION NOT NULL,
    "variationsInventoryCableKg" DOUBLE PRECISION NOT NULL,
    "variationsInventoryCableUSD" DOUBLE PRECISION NOT NULL,
    "variationsInventoryCobreKg" DOUBLE PRECISION NOT NULL,
    "variationsInventoryCobreUSD" DOUBLE PRECISION NOT NULL,
    "variationsInventoryCompuestoKg" DOUBLE PRECISION NOT NULL,
    "variationsInventoryCompuestoUSD" DOUBLE PRECISION NOT NULL,
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "ControlReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionReport" (
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comentariosOee" TEXT,
    "comentariosScrap" TEXT,
    "concatenado" TEXT,
    "kgscrap" DOUBLE PRECISION NOT NULL,
    "kmEnviadosRebobinados" DOUBLE PRECISION NOT NULL,
    "kmRebobinados" DOUBLE PRECISION NOT NULL,
    "kmReventon" DOUBLE PRECISION NOT NULL,
    "maquinas" TEXT NOT NULL,
    "numeroSap" DOUBLE PRECISION NOT NULL,
    "oee" DOUBLE PRECISION NOT NULL,
    "percentAvailability" DOUBLE PRECISION NOT NULL,
    "percentPerformance" DOUBLE PRECISION NOT NULL,
    "percentQuality" DOUBLE PRECISION NOT NULL,
    "percentScrap" DOUBLE PRECISION NOT NULL,
    "produccionkg" DOUBLE PRECISION NOT NULL,
    "produccionkm" DOUBLE PRECISION NOT NULL,
    "reventones" DOUBLE PRECISION NOT NULL,
    "scrapCu" DOUBLE PRECISION NOT NULL,
    "scrapSn" DOUBLE PRECISION NOT NULL,
    "scrapTotal" DOUBLE PRECISION NOT NULL,
    "targetOeeL5" DOUBLE PRECISION NOT NULL,
    "targetScrapL5" DOUBLE PRECISION NOT NULL,
    "tieldTotal" DOUBLE PRECISION NOT NULL,
    "tiempoMuerto" DOUBLE PRECISION NOT NULL,
    "validacion" TEXT,
    "yield" DOUBLE PRECISION NOT NULL,
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "ProductionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "id" SERIAL NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccidentReport" ADD CONSTRAINT "AccidentReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityReport" ADD CONSTRAINT "QualityReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuejasReport" ADD CONSTRAINT "QuejasReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KaizenReport" ADD CONSTRAINT "KaizenReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RHReport" ADD CONSTRAINT "RHReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleteReport" ADD CONSTRAINT "FleteReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlReport" ADD CONSTRAINT "ControlReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReport" ADD CONSTRAINT "ProductionReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
