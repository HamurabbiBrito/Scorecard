-- CreateTable
CREATE TABLE "AccidentReport" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "cantidadAccidentes" INTEGER NOT NULL,
    "cantidadCuasiAccidentes" INTEGER NOT NULL,
    "diasUltimoAccidente" INTEGER NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityReport" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "qualityCreditNoteUSD" TEXT NOT NULL,
    "qualityCreditNoteUSDBattery" DOUBLE PRECISION NOT NULL,
    "today" INTEGER NOT NULL,
    "mesAnterior" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "cantidadQuejas" INTEGER NOT NULL,
    "cantidadQuejasBateria" INTEGER NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KaizenReport" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "proyecto" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "impacto" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "responsable" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KaizenReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RHReport" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "personalActual" INTEGER NOT NULL,
    "vacantes" INTEGER NOT NULL,
    "necesidadesCapacitacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RHReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleteReport" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "transportista" TEXT NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleteReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlReport" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "turno" TEXT NOT NULL,
    "metaDiaria" INTEGER NOT NULL,
    "producido" INTEGER NOT NULL,
    "rechazos" INTEGER NOT NULL,
    "eficiencia" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ControlReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionReport" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "producto" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "horasMaquina" INTEGER NOT NULL,
    "paradas" INTEGER NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionReport_pkey" PRIMARY KEY ("id")
);
