-- CreateTable
CREATE TABLE "Telemetria" (
    "id" TEXT NOT NULL,
    "apiarioId" TEXT NOT NULL,
    "colmeiaId" TEXT NOT NULL,
    "pesoKg" DOUBLE PRECISION NOT NULL,
    "tempInterna" DOUBLE PRECISION NOT NULL,
    "umidadeInterna" DOUBLE PRECISION NOT NULL,
    "bateriaV" DOUBLE PRECISION NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Telemetria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Telemetria_apiarioId_colmeiaId_idx" ON "Telemetria"("apiarioId", "colmeiaId");
