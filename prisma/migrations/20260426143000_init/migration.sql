-- CreateTable
CREATE TABLE "Regalo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" TEXT
);

-- CreateTable
CREATE TABLE "Invitado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "regaloId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invitado_regaloId_fkey" FOREIGN KEY ("regaloId") REFERENCES "Regalo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
