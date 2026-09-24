// backend service used to reorder topics in a phase - user can drag and drop topics in a phase and re-order them.

import { findByPhaseId, updateOrder } from "../repositories/topic.repository.js";
import type { Prisma } from "../generated/prisma/client.js"
import prisma from "../db/prisma.js";

export const reorderTopics = async (userId: string, phaseId: string, topicId: string[]) => {
    // validate topicId and existingTopics match. 
    const topics = await findByPhaseId(phaseId);
    const existingTopicId = topics.map((topic) => (topic.id))
    const matchTopics = (arr1: string[], arr2: string[]): boolean => {
        if (arr1.length !== arr2.length){
            return false
        }
        const set2 = new Set(arr2);
        return arr1.every(item => set2.has(item));
    }
    if (matchTopics(topicId, existingTopicId) === false){
        throw new Error ("Mismatch in existing topic Id and provided topic Id")
    }

    const reorderedTopics = await prisma.$transaction(async(tx: Prisma.TransactionClient) => {
        topicId.map((topic, index) => (
             updateOrder(topic, index+1, tx)
        ))
    })

    return reorderedTopics;
}
