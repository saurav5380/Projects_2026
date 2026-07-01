-- CreateIndex
CREATE INDEX "QuizAttempt_userId_topicId_attemptedAt_idx" ON "QuizAttempt"("userId", "topicId", "attemptedAt");

-- CreateIndex
CREATE INDEX "Roadmap_userId_archivedAt_idx" ON "Roadmap"("userId", "archivedAt");

-- CreateIndex
CREATE INDEX "UserResourceBookmark_userId_idx" ON "UserResourceBookmark"("userId");

-- CreateIndex
CREATE INDEX "UserTopicProgress_userId_lastActivityAt_idx" ON "UserTopicProgress"("userId", "lastActivityAt");
