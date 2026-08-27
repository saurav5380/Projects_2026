
import prisma from "../db/prisma.js";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";

export const createRoadmap = async (id: string,  
    title: string, archivedAt: Date | null = null, 
    createdAt: Date, updatedAt: Date) => {
    try{
        const result = await prisma.roadmap.create({
        data: {
            userId: id,
            title: title,
            archivedAt: archivedAt,
            createdAt: createdAt,
            updatedAt: updatedAt
        }
    })
    return result;
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            console.error("Error creating roadmap: ", error.message)
        }
        else{
            throw new Error ("unable to create roadmap")
        }   
    }  
}

export const findActiveByUserId = async (id: string) => {
    const result = await prisma.roadmap.findFirst({where: {
        id: id,
        archivedAt: null
    }})
    if (result === null){
        throw new Error("No active roadmap available for user")
    }
    return result;
}

export const archiveById = async (id: string, archivalDate: Date) => {
    try{
        const result = await prisma.roadmap.update({
        where: {
            id: id
        },
        data: {
            archivedAt: archivalDate
        }
        })
        return result
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            console.error(`Error: ${error.message}`)
            throw new Error (`Error updating roadmap: ${error.message}`)
        }
        
    }
}

export const rename = async (id: string, newTitle: string) => {
    try{
        const result = await prisma.roadmap.update({
        where: {
            id: id
        },
        data: {
            title: newTitle
        }
    })
    return result
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            console.error(`Error: ${error.message}`)
            throw new Error (`Error updating roadmap: ${error.message}`)
        }
    }
}


