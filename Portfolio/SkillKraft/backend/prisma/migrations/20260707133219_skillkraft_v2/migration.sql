/*
  Warnings:

  - Added the required column `updatedAt` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "AIProvider" AS ENUM ('OPENAI', 'ANTHROPIC', 'NONE');

-- CreateEnum
CREATE TYPE "ExplainRatingValue" AS ENUM ('THUMBS_UP', 'THUMBS_DOWN');

-- DropIndex
DROP INDEX "QuizAttempt_userId_topicId_attemptedAt_idx";

-- DropIndex
DROP INDEX "Roadmap_userId_archivedAt_idx";

-- DropIndex
DROP INDEX "UserResourceBookmark_userId_idx";

-- DropIndex
DROP INDEX "UserTopicProgress_userId_lastActivityAt_idx";

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "flaggedForRevalidation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT,
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "WeeklyReview" ADD COLUMN     "careerReadinessScoreAtReview" INTEGER;

-- CreateTable
CREATE TABLE "AICallLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "featureName" TEXT NOT NULL,
    "provider" "AIProvider" NOT NULL,
    "model" TEXT,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "latencyMs" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "usedFallback" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AICallLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplainSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "turns" JSONB NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExplainSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplainRating" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "turnIndex" INTEGER NOT NULL,
    "rating" "ExplainRatingValue" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExplainRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExplainSession_userId_topicId_key" ON "ExplainSession"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "ExplainRating_sessionId_turnIndex_key" ON "ExplainRating"("sessionId", "turnIndex");

-- AddForeignKey
ALTER TABLE "ExplainSession" ADD CONSTRAINT "ExplainSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplainSession" ADD CONSTRAINT "ExplainSession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplainRating" ADD CONSTRAINT "ExplainRating_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExplainSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
