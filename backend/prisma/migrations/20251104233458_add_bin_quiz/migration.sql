-- CreateTable
CREATE TABLE "BinQuiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "choices" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
