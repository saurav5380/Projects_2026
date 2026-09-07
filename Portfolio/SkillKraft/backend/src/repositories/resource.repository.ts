//`createMany`, `findByTopicId`, `createOne` (user-added), `deleteById`, `updateVerificationStatus`, 
// `setFlaggedForRevalidation`, `findFlaggedForRevalidation`
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";
import prisma from "../db/prisma.js";
import { ResourceType, ResourceSource, VerificationStatus } from "../generated/prisma/enums.js";

export const createResources = async (topicId: string, title: string, url: string | null,
    searchQuery: string, resourceType: ResourceType,
    source: ResourceSource,
    verificationStatus: VerificationStatus,
    flaggedForRevalidation: boolean,
    addedByUserId: string | null) => {
    try {
        const result = await prisma.resource.createMany({
            data: {
                topicId,
                title,
                url,
                searchQuery,
                resourceType,
                source,
                verificationStatus,
                flaggedForRevalidation,
                addedByUserId
            }
        })
        return result;
    }
    catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            console.error(`Error: ${error.message}`)
            return {
                "error": error.name,
                "details": error.message,
                "code": error.code
            }
        }
    }
}

export const findTopic = async () => {

}