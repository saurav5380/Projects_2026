import prisma from "../db/prisma.js";
import { AIProvider } from "../../src/generated/prisma/enums.js"
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";

export const aiLog = async (id: string, featureName: string, provider: AIProvider, model: string = "", latencyMs: number, success: boolean, usedFallback: boolean) => {
    try{
        const result = await prisma.aICallLog.create({
        data: {
            userId: id,
            featureName,
            provider,
            model,
            latencyMs,
            success,
            usedFallback
        }
    })
        return result;
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            console.error("Could not write log: ", error.message)
        }
        else{
            throw new Error("Error writing log")
        }
    }
};

export const findByUserId = async (id: string) => {

    const result = await prisma.aICallLog.findMany({where:{userId: id}});
    if (result === null){
        throw new Error ("No data exists for given userId")
    }

    return result;
};

export const findByFeature = async(feature: string) => {
    const result = await prisma.aICallLog.findMany({where:{featureName: feature}})
    if (result.length === 0){
        throw new Error ("No data exists for the given feature.")
    }
    return result;
};


