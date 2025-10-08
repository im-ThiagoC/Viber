/*
  Warnings:

  - You are about to drop the column `expiry` on the `Usage` table. All the data in the column will be lost.
  - Added the required column `expire` to the `Usage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usage" DROP COLUMN "expiry",
ADD COLUMN     "expire" TIMESTAMP(3) NOT NULL;
