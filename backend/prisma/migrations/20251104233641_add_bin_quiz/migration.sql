/*
  Warnings:

  - Added the required column `item` to the `BinQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BinQuiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item" TEXT NOT NULL,
    "choices" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_BinQuiz" ("answer", "choices", "createdAt", "id", "updatedAt") SELECT "answer", "choices", "createdAt", "id", "updatedAt" FROM "BinQuiz";
DROP TABLE "BinQuiz";
ALTER TABLE "new_BinQuiz" RENAME TO "BinQuiz";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
