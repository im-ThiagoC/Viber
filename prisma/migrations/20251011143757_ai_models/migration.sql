-- CreateEnum
CREATE TYPE "AIModel" AS ENUM ('GPT_4_1_NANO', 'GPT_4_1', 'CLAUDE_SONNET_4_5');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "ai" "AIModel";
