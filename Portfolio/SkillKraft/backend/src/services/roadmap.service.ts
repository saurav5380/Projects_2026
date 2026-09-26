/* Create `backend/src/services/roadmap.service.ts`:
  -  `getActiveRoadmap(userId)` — fetches roadmap where `archivedAt` is null; 
  includes phases (ordered), topics (ordered), resources, and `UserTopicProgress` for the user; 
  computes `isBookmarkedByUser` per resource; computes `phaseProgressPercent` per phase; 
  computes overall `progressPercent`
  -  `renameRoadmap(userId, title)` — updates title on active roadmap
  -  `regenerateRoadmap(userId, body)` — sets `archivedAt` on current active roadmap; calls `onboarding.service.completeOnboarding` with updated body; returns new roadmap
*/

import { findActiveRoadmapDetails, isBookmarkedByUser } from "../repositories/roadmap.repository.js";
// import { findByRoadmapId } from "../repositories/phase.repository.js";
// import { findByPhaseId } from "../repositories/topic.repository.js";
// import { findByTopicId } from "../repositories/resource.repository.js";


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
            phases: 
        }
        
    return;
    }
    catch(error){
         console.error("Error fetching roadmap details:", error instanceof Error ? error.message : error);
        throw error;
    }
}
