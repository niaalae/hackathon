CREATE EXTENSION IF NOT EXISTS vector;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "name_embedding" vector(1536);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferences" TEXT,
ADD COLUMN     "preferences_embedding" vector(1536);
