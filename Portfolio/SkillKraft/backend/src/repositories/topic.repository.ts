// `createMany`, `findById`, `findByPhaseId`, `updateOrder`

import prisma from "../db/prisma.js";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";

export const createTopics = async (phaseId: string, 
    title: string, 
    description: string, 
    estimatedHours:number, 
    isCheckpoint:boolean = false, 
    order: number,
    createdAt: Date,
    updatedAt: Date) => {
    const result = await prisma.topic.createMany({
        data: {
            phaseId,
            title,
            description,
            estimatedHours,
            isCheckpoint,
            order,
            createdAt,
            updatedAt
        }
    });
    if (result.count === 0){
        throw new Error(`Could not create topics.`)
    }
    return result;
}

export const findTopic = async (topicId: string) => {
    const result = await prisma.topic.findFirst({
        where: {id: topicId}
    })
    if (result === null){
        throw new Error(`Could not find the requested topic.`)
    }
    return result;
}

export const findByPhaseId = async (id: string) => {
    const result = await prisma.topic.findFirst({
        where: {phaseId: id}
    })
    if (result === null){
        throw new Error(`Phase with id : ${id} does not exist`)
    }
    return result;
}

export const updateOrder = async (id: string, revisedOrder: number) => {
    try{
        const result = await prisma.topic.update({
            where: {
                id: id
            },
            data: {
                order: revisedOrder
            }
    })
    return result;
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            console.error(`Error: ${error.message}`)
            return (`Could not update order. Error: ${error.message}`)
        }
    }
}

