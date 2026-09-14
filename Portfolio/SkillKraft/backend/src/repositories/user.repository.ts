// this file contains all logic which touches the DB using Prisma ORM



import prisma from "../db/prisma.js";
import type { NewUser, UserProfileUpdate, UpdatePassword } from "../types/api.types.js";

export const createNewUser = async (user: NewUser, client = prisma) => {

    const result = await client.user.create({
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            passwordHash: user.passwordHash
        },
        select: {
            firstName: true,
            lastName: true,
            email: true,
            passwordHash: true
        }
    });
    return result
};


export const findByEmail = async (userEmail: string, client = prisma) => {

    const result = await client.user.findUnique({ where: { email: userEmail } });
    if (!result) {
        return null
    }
    return result;
};

export const findById = async (userId: string, client = prisma) => {
    const result = await client.user.findUnique({ where: { id: userId } });
    if (!result) {
        return null
    }
    return result
};

export const updateProfile = async(userData: UserProfileUpdate, client = prisma) =>{
    const result = await client.user.update({
        where: {
            id: userData.userId
        },
        data:{
            firstName: userData.firstName,
            lastName: userData.lastName,
            currentRole: userData.currentRole,
            targetRole: userData.targetRole,
            weeklyHours: userData.weeklyHours,
            targetMonths: userData.targetMonths
        }
    });
    if (!result){
        return null
    }
    return result
};

export const updatePassword = async(passwordInfo:UpdatePassword, client = prisma) => {
    const userId = passwordInfo.userId;
    const result = await client.user.update({
        where: {
            id: userId,
        },
        data: {
            passwordHash: passwordInfo.newPasswordHash
        }
    })
    if(!result){
        return null
    }
    return result
}


