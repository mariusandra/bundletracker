/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[token]` on the table `Bundle`. If there are existing duplicate values, the migration will fail.
  - Added the required column `token` to the `Bundle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bundle" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "commit" TEXT,
ADD COLUMN     "branch" TEXT;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project.token_unique" ON "Project"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Bundle.token_unique" ON "Bundle"("token");

-- AddForeignKey
ALTER TABLE "Bundle" ADD FOREIGN KEY("projectId")REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
