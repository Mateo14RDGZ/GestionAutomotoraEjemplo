-- CreateTable
CREATE TABLE "Permuta" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT,
    "autoMarca" TEXT,
    "autoModelo" TEXT,
    "autoAnio" INTEGER,
    "autoMatricula" TEXT,
    "motoMarca" TEXT,
    "motoModelo" TEXT,
    "motoAnio" INTEGER,
    "valorEstimado" DOUBLE PRECISION NOT NULL,
    "valorReal" DOUBLE PRECISION,
    "clienteId" INTEGER NOT NULL,
    "autoVendidoId" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "notas" TEXT,
    "fechaRecepcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Permuta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Permuta"
ADD CONSTRAINT "Permuta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permuta"
ADD CONSTRAINT "Permuta_autoVendidoId_fkey" FOREIGN KEY ("autoVendidoId") REFERENCES "Auto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;