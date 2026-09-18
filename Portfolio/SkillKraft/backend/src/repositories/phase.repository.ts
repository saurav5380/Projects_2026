
import prisma from "../db/prisma.js";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";
import type { Prisma, PrismaClient } from "../generated/prisma/client.js";

export const createPhases = async (id: string, phaseTitle: string, sequence: number, updateAt: Date, client: PrismaClient | Prisma.TransactionClient = prisma) => {
    try{
        const result = await client.roadmapPhase.create({
            data: {
                roadmapId: id,
                title: phaseTitle,
                order: sequence,
                updatedAt: updateAt
            }})
        return result;
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            console.error(`Error: ${error.message}`)
            throw new Error(`Could not generate roadmap phases: ${error.message}`)
        }
        throw error;
    }
}

export const findByRoadmapId = async (id: string) => {
    try{
        const result = await prisma.roadmapPhase.findFirst({
          where: {
            roadmapId:id 
            }})
        return result;
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            console.error(`Error: ${error.message}`)
            throw new Error(`Could not find roadmap. Error: ${error.message}`)
        }
    }
}

