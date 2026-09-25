
import prisma from "../db/prisma.js";
// import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";
import type { Prisma, PrismaClient } from "../generated/prisma/client.js";

export const createPhases = async (id: string, phaseTitle: string, sequence: number, updateAt: Date, client: PrismaClient | Prisma.TransactionClient = prisma) => {
        const result = await client.roadmapPhase.create({
            data: {
                roadmapId: id,
                title: phaseTitle,
                order: sequence,
                updatedAt: updateAt
            }})
        return result;
}

export const findByRoadmapId = async (id: string) => {
        const result = await prisma.roadmapPhase.findFirst({
          where: {
            roadmapId:id 
            }})
        return result;
}

