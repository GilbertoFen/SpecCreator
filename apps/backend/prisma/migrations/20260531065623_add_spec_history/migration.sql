-- CreateTable
CREATE TABLE "Spec" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "usuarios" TEXT NOT NULL,
    "funcionalidades" TEXT NOT NULL,
    "flujos" TEXT NOT NULL,
    "arquitectura" TEXT NOT NULL,
    "requisitos" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
