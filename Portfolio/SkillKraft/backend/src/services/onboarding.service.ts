
import { generateRoadmap } from "./ai/generateRoadmap.js"
import { recommendResources } from "./ai/recommendResources.js"
import { updateProfile } from "../repositories/user.repository.js"
import { createRoadmap } from "../repositories/roadmap.repository.js"
import { createPhases } from "../repositories/phase.repository.js"
import { createTopics } from "../repositories/topic.repository.js"
import { createResources } from "../repositories/resource.repository.js"
import { searchAndValidate } from "./resourceValidator.service.js"
import prisma from "../db/prisma.js"
import type { Prisma } from "../generated/prisma/client.js"
import { ResourceType, ResourceSource, VerificationStatus } from "../generated/prisma/enums.js"

enum tgtMonths {three = 3,six = 6,twelve = 12}

type Body = {
    "currentRole" : string,
    "targetRole" : string,
    "weeklyHours" : number,
    "targetMonths" : tgtMonths
}

const RESOURCE_TYPES = new Set(["ARTICLE", "COURSE", "DOCUMENTATION", "VIDEO"]);

const toResourceType = (value: string): ResourceType => {
    if (!RESOURCE_TYPES.has(value)) {
        throw new Error(`AI returned an unknown resourceType: ${value}`);
    }
    return value as ResourceType;
};

export const completeOnboarding = async (userId: string, body: Body) => {
    try {
        const userPayLoad = {
            currentRole: body.currentRole,
            targetRole: body.targetRole,
            targetMonths: body.targetMonths,
            weeklyHours: body.weeklyHours,
            onboardingDone: true
        }

        const roadmapResult = await generateRoadmap(userId, userPayLoad);
        if (!roadmapResult || typeof roadmapResult === "string") {
            throw new Error(typeof roadmapResult === "string" ? roadmapResult : "Roadmap generation failed");
        }
        
        const parsedRoadmap = roadmapResult;

        const getResourceProposal = async (topic: { title: string, description: string }) => {
            const result = await recommendResources(userId, { topic: topic.title, description: topic.description });
            if (!result || typeof result === "string") {
                throw new Error(typeof result === "string" ? result : "Resource recommendation failed");
            }
            return result;
        };

        const phasesWithResources = await Promise.all(
            parsedRoadmap.phases.map(async (phase) => ({
                ...phase,
                topics: await Promise.all(
                    phase.topics.map(async (topic) => {
                        const proposal = await getResourceProposal(topic);
                        const validated = await searchAndValidate(proposal.suggestedTitle, proposal.searchQuery);
                        const resource = {
                            title: validated.title,
                            url: validated.url,
                            searchQuery: proposal.searchQuery,
                            resourceType: toResourceType(proposal.resourceType),
                            verified: validated.verified
                        };
                        return { ...topic, resources: [resource] };
                    })
                )
            }))
        );

        const now = new Date();
        const roadmapTitle = `${body.currentRole} → ${body.targetRole}`;

        const savedRoadmap = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await updateProfile(userId, userPayLoad, tx);

            const roadmapRecord = await createRoadmap(userId, roadmapTitle, null, now, now, tx);

            for (const phase of phasesWithResources) {
                const phaseRecord = await createPhases(roadmapRecord.id, phase.title, phase.order, now, tx);

                for (const topic of phase.topics) {
                    const topicRecord = await createTopics(
                        phaseRecord.id,
                        topic.title,
                        topic.description,
                        topic.estimatedHours,
                        topic.isCheckpoint,
                        topic.order,
                        now,
                        now,
                        tx
                    );

                    for (const resource of topic.resources) {
                        await createResources(
                            topicRecord.id,
                            resource.title,
                            resource.url,
                            resource.searchQuery,
                            resource.resourceType,
                            ResourceSource.AI,
                            resource.verified ? VerificationStatus.VERIFIED : VerificationStatus.UNVERIFIED,
                            false,
                            null,
                            tx
                        );
                    }
                }
            }

            return tx.roadmap.findUniqueOrThrow({
                where: { id: roadmapRecord.id },
                include: { phases: { include: { topics: { include: { resources: true } } } } }
            });
        });

        return savedRoadmap;
    }
    catch (error) {
        console.error("Error completing onboarding:", error instanceof Error ? error.message : error);
        throw error;
    }
}
