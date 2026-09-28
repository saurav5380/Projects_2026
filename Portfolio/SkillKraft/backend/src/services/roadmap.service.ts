/* Create `backend/src/services/roadmap.service.ts`:
  -  `getActiveRoadmap(userId)` — fetches roadmap where `archivedAt` is null; 
  includes phases (ordered), topics (ordered), resources, and `UserTopicProgress` for the user; 
  computes `isBookmarkedByUser` per resource; computes `phaseProgressPercent` per phase; 
  computes overall `progressPercent`
  -  `renameRoadmap(userId, title)` — updates title on active roadmap
  -  `regenerateRoadmap(userId, body)` — sets `archivedAt` on current active roadmap; calls `onboarding.service.completeOnboarding` with updated body; returns new roadmap
*/

import { findActiveRoadmapDetails, isBookmarkedByUser } from "../repositories/roadmap.repository.js";

export const getActiveRoadmap = async (userId: string) => {
    try{
        const activeRoadmapWithDetails = await findActiveRoadmapDetails(userId);
        if (!activeRoadmapWithDetails){
            throw new Error("No active roadmap found")
        }
        const userBookmarks = await isBookmarkedByUser(userId);
        const bookmarkedResourceIds = new Set(userBookmarks.map((bookmark) => bookmark.resourceId));

        const roadmapWithComputedFields = {
            ...activeRoadmapWithDetails,
            phases: activeRoadmapWithDetails.phases.map((phase) => {
                const topicsWithComputedData = phase.topics.map((topic) => ({
                    ...topic,
                    resources: topic.resources.map((resource) => ({
                        ...resource,
                        isBookmarkedByUser: bookmarkedResourceIds.has(resource.id)
                    }))
                }))
                const phaseCompletedCount = topicsWithComputedData.filter((topic) => topic.userProgress[0]?.status === "COMPLETE").length;

                return {
                    ...phase,
                    topicsWithComputedData,
                    phaseProgressPercent: Math.round((phaseCompletedCount/topicsWithComputedData.length) * 100)
                }
            }),
        }

        const allTopics = activeRoadmapWithDetails.phases.flatMap((phase) => phase.topics);

        const completedCount = allTopics.filter(
            (topic) => topic.userProgress[0]?.status === "COMPLETE"
        ).length;

        const totalCount = allTopics.length;

        const progressPercent = totalCount > 0
            ? Math.round((completedCount / totalCount) * 100)
            : 0;
        
    return {
        ...roadmapWithComputedFields,
        progressPercent
    };
    }
    catch(error){
         console.error("Error fetching roadmap details:", error instanceof Error ? error.message : error);
        throw error;
    }
}
