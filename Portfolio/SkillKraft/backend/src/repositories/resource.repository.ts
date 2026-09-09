//`createMany`, `findByTopicId`, `createOne` (user-added), `deleteById`, `updateVerificationStatus`, 
// `setFlaggedForRevalidation`, `findFlaggedForRevalidation`
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";
import prisma from "../db/prisma.js";
import { ResourceType, ResourceSource, VerificationStatus } from "../generated/prisma/enums.js";
import type { Resource } from "../generated/prisma/client.js";

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
        else if (error instanceof Error){
            return (`Error: ${error.message}`)
        }
    }
}

export const findByTopicId = async (id: string) => {
    const result = await prisma.resource.findFirst({
        where: {
            topicId: id
        }
    })
    if (result === null){
        return (`No topic found. Check the topic ID: ${id}`)
    }
    return result;
}

export const createOne = async (userId: string, topicId:string, title:string, url:string, resourceType:ResourceType) => {
    try {
        const result = await prisma.resource.create({
            data: {
                topicId,
                title,
                url,
                searchQuery:"",
                resourceType,
                source:"USER",
                verificationStatus:"VERIFIED",
                flaggedForRevalidation:false,
                addedByUserId: userId
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
        else if (error instanceof Error){
            return (`Error: ${error.message}`)
        }
    }
}

export const deleteById = async (resourceId: string) => {
    try{
        const result = await prisma.resource.delete({
        where: {
            id: resourceId
        }
    })
    return result;
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
         console.error(`Error: ${error.message}`)
            return {
                "error": error.name,
                "details": error.message,
                "code": error.code
            }   
        }
        else if (error instanceof Error){
            return (`Error: ${error.message}`)
        }
    }
}

export const updateVerificationStatus = async (resourceId: string, isValidated: VerificationStatus) => {
    try{
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
    catch(error){
         if (error instanceof PrismaClientKnownRequestError){
         console.error(`Error: ${error.message}`)
            return {
                "error": error.name,
                "details": error.message,
                "code": error.code
            }   
        }
        else if (error instanceof Error){
            return (`Error: ${error.message}`)
        }
    }
}

export const setFlaggedForRevalidation = async (resourceId: string, revalidationFlag:boolean) => {
    try{
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
    catch(error){
         if (error instanceof PrismaClientKnownRequestError){
         console.error(`Error: ${error.message}`)
            return {
                "error": error.name,
                "details": error.message,
                "code": error.code
            }   
        }
         else if (error instanceof Error){
            return (`Error: ${error.message}`)
        }
    }
}

export const findFlaggedForRevalidation = async (): Promise<Resource[]|{ error: string; details: string; code: string } | string | undefined> => {
    try{
        const result = await prisma.resource.findMany({
        where: {
            flaggedForRevalidation: true
        }
    })
        return result;
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
         console.error(`Error: ${error.message}`)
            return {
                "error": error.name,
                "details": error.message,
                "code": error.code
            }   
        }
        else if (error instanceof Error){
            return (`Error: ${error.message}`)
        }
    }
}