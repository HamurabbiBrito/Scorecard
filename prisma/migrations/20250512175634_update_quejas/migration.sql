-- AlterTable
ALTER TABLE "QuejasReport" ALTER COLUMN "cantidadQuejas" DROP NOT NULL,
ALTER COLUMN "cantidadQuejasBateria" DROP NOT NULL,
ALTER COLUMN "diasSinQuejas" DROP NOT NULL,
ALTER COLUMN "diasSinQuejasBateria" DROP NOT NULL,
ALTER COLUMN "fechaQuejaCliente" DROP NOT NULL,
ALTER COLUMN "fechaQuejaClienteBateria" DROP NOT NULL;
