
import prisma from "../db/prisma.js";
import HttpError from "../utils/httpError.js";

// create refresh token - expires in 7 days
export const create = async (userId: string, token: string) => {

        const result = await prisma.refreshToken.create({
        data: {
            userId,
            token: token,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        },
        select: {
            userId: true,
            token: true,
            expiresAt: true
        }
    })
    return result
};

// param - existing refreshToken, returns a refreshToken if exists or null 
export const findByToken = async(currToken: string) => {
    const tokenData = await prisma.refreshToken.findUnique({where: {token: currToken}});
    if ( tokenData === null){
        throw new HttpError("Invalid refresh token", 401);
    }
    if (tokenData.revokedAt !== null){
        throw new HttpError("Invalid refresh token", 401);
    }
    if (tokenData.expiresAt < new Date()){
        throw new HttpError("Refresh token has expired", 401);
    }
    return tokenData;
};

// revoke token based on refresh token provided - soft delete (revokedAt field updated in DB) 
export const revoke = async(currToken:string) => {
    const tokenData = await prisma.refreshToken.update({
        where: {token: currToken},
        data: {revokedAt: new Date}
    });
    return tokenData.revokedAt;
}

// revoke token based on userId - hard delete
export const revokeAllForUser = async(id: string) => {
    const tokenData = await prisma.refreshToken.deleteMany({where: {userId: id}});
    return tokenData.count;
}

