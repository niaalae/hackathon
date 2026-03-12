/*
  Warnings:

  - You are about to drop the column `name_embedding` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `preferences_embedding` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Place" DROP COLUMN "name_embedding";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "preferences_embedding";
