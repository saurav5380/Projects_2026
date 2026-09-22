import prisma from "../db/prisma.js";
import { TopicStatus } from "../generated/prisma/enums.js";

export const findByUserAndTopic = async(id: string, topicId: string) => {
  const result = await prisma.userTopicProgress.findUnique({
        where: {
            userId_topicId: {
            userId: id,
            topicId: topicId
        }}
        })
        if (!result){
            return null;
        }
        return result;
};

export const upsertTopicProgress = async(userId: string, topicId: string, topicStatus: TopicStatus) => {
    const result = await prisma.userTopicProgress.upsert({
        where: {
            userId_topicId: {
                userId,
                topicId
            }
        },
        update: {
            status: topicStatus,
            lastActivityAt: new Date(),
            completedAt: topicStatus === "COMPLETE" ? new Date() : null
        },
        create: {
            userId,
            topicId,
            status: topicStatus,
            lastActivityAt: new Date(),
            completedAt: topicStatus === "COMPLETE" ? new Date() : null

        }
    })
    if (!result){
        return null
    }
    return result;
};

export const findAllByUserAndRoadmap = async (userId: string, roadmapName: string) => {
    const result = await prisma.roadmap.findFirst({
        where: {
            userId,
            title: roadmapName
        }
    })
    if (!result){
        return null;
    }
    return result;
};

export const findActivityDatesByUser = async (userId: string, topicId: string) => {
    const result = await prisma.userTopicProgress.findMany({ 
        where: {
            
                userId, 
                topicId
        },
        select: {
            lastActivityAt: true,
        }
    })
    if (!result){
        return null;
    }
    
    const distinctDates = [...new Set(result.map((row) => (row.lastActivityAt.toISOString().split("T")[0])))];
    return distinctDates;
};
