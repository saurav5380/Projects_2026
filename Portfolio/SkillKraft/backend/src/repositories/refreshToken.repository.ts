
import prisma from "../db/prisma.js";
import type { UUID } from "node:crypto";


export const create = async (id: UUID, token: string) => {
    try{
        const result = await prisma.refreshToken.create({
        data: {
            userId: id,
            token: token,
            expiresAt: '24h'
        },
        select: {
            userId: true,
            token: true,
            expiresAt: true
        }
    })
    return result
    }
    catch(error){
        if (error instanceof Error){
            return (`Error: ${error.message}`);
        }
    }
}

// param - existing refreshToken, returns a refreshToken if exists in DB or null 
export const findByToken = async(currToken: string) => {
    const tokenData = await prisma.refreshToken.findUnique({where: {token: currToken}});
    if ( tokenData === null){
        return (`Token does not exist`)
    }
    else if (tokenData.revokedAt !== null){
        return (`Invalid token. Token has been revoked at:${token.revokedAt}`)
    }
    else return tokenData;
}


