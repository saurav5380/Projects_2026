// service layer for `getProfile`, `updateProfile`, `changePassword`

import { findById, updateProfile, updatePassword } from "../repositories/user.repository.js";
import type { UserProfileUpdate, UpdatePassword } from "../types/api.types.js";
import { hashPassword, verifyPassword } from "../utils/password.js";


export const getProfile = async(userId: string) => {
    const user = await findById(userId);
    if (!user){
        throw new Error ('Check UserId')
    }
    return user;
}

export const updateUserProfile = async(userData: UserProfileUpdate) => {
    const result = await updateProfile(userData)
    if (!result){
        throw new Error ('Profile Update failed')
    }
    return result;
}

export const changeUserPassword = async(userId: string, currentPassword:string, newPassword:string) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    const checkUser = await findById(userId)
    if (!checkUser){
        throw new Error ('Invalid userId')
    }
    const currentPwdHash = checkUser?.passwordHash;
    const verifyPwd = verifyPassword(currentPassword, currentPwdHash);
    if (!verifyPwd){
        throw new Error('Password mismatch')
    }
    const newPwdHash = await hashPassword(newPassword);
    if (!newPwdHash){
        throw new Error ('New Password hashing failed')
    }
    const passwordInfo: UpdatePassword = {
        userId,
        currentPasswordHash: currentPwdHash,
        newPasswordHash: newPwdHash
    }
    const result = await updatePassword(passwordInfo);
    if (!result){
        throw new Error("Password Update failed")
    }
    return result
}