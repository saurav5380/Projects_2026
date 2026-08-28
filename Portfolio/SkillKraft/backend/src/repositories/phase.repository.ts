
import prisma from "../db/prisma.js";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";

export const createPhases = async (id: string, phaseTitle: string, sequence: number, updateAt: Date) => {
    try{
        const result = await prisma.roadmapPhase.createMany({
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
            throw new Error(`Could not generate roadmpa phases: ${error.message}`)
        }
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

