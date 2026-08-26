import prisma from "../db/prisma.js";
import { AIProvider } from "../../src/generated/prisma/enums.js"

export const aiLog = async (id: string, featureName: string, provider: AIProvider, model: string = "", latencyMs: number, success: boolean, usedFallback: boolean) => {
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
    if (result === null){
        throw new Error ("No data exists for the given feature.")
    }
    return result;
};


