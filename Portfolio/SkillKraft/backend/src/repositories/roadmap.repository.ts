
import prisma from "../db/prisma.js";
// import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";
import type { Prisma, PrismaClient } from "../generated/prisma/client.js";

export const createRoadmap = async (id: string,
    title: string, archivedAt: Date | null = null,
    createdAt: Date, updatedAt: Date, client: PrismaClient | Prisma.TransactionClient = prisma) => {
        const result = await client.roadmap.create({
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

export const findActiveByUserId = async (id: string) => {
    const result = await prisma.roadmap.findFirst({where: {
        userId: id,
        archivedAt: null
    }})
    return result;
}

export const archiveById = async (id: string, archivalDate: Date) => {
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

export const rename = async (id: string, newTitle: string) => {
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


