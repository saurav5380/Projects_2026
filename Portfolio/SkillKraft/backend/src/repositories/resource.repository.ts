
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";
import prisma from "../db/prisma.js";
import { ResourceType, ResourceSource, VerificationStatus } from "../generated/prisma/enums.js";
import type { Resource, Prisma, PrismaClient } from "../generated/prisma/client.js";

export const createResources = async (topicId: string, title: string, url: string | null,
    searchQuery: string, resourceType: ResourceType,
    source: ResourceSource,
    verificationStatus: VerificationStatus,
    flaggedForRevalidation: boolean,
    addedByUserId: string | null,
    client: PrismaClient | Prisma.TransactionClient = prisma) => {
    const result = await client.resource.create({
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

export const findByTopicId = async (id: string) => {
    const result = await prisma.resource.findMany({
        where: {
            topicId: id
        }
    })
    return result;
}

export const createOne = async (userId: string, topicId: string, title: string, url: string, resourceType: ResourceType) => {
        const result = await prisma.resource.create({
            data: {
                topicId,
                title,
                url,
                searchQuery: "",
                resourceType,
                source: "USER",
                verificationStatus: "VERIFIED",
                flaggedForRevalidation: false,
                addedByUserId: userId
            }
        })
        return result;
    }

export const deleteById = async (resourceId: string) => {
        const result = await prisma.resource.delete({
            where: {
                id: resourceId
            }
        })
        return result;
    }
    

export const updateVerificationStatus = async (resourceId: string, isValidated: VerificationStatus) => {
        const result = await prisma.resource.update({
            where: {
                id: resourceId
            },
            data: {
                verificationStatus: isValidated
            }
        })
        return result;
    }
    

export const setFlaggedForRevalidation = async (resourceId: string, revalidationFlag: boolean) => {
        const result = await prisma.resource.update({
            where: {
                id: resourceId
            },
            data: {
                flaggedForRevalidation: revalidationFlag
            }
        })
        return result;
    }
    
export const findFlaggedForRevalidation = async (): Promise<Resource[] | { error: string; details: string; code: string } | string | undefined> => {
        const result = await prisma.resource.findMany({
            where: {
                flaggedForRevalidation: true
            }
        })
        return result;
    }
    