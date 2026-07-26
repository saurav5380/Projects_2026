// controller for `getProfile`, `updateProfile`, `changePassword`

import type {Request, Response, NextFunction} from 'express';
import {getProfile, updateUserProfile, changeUserPassword} from '../services/user.service.js';
import { UpdateProfileBody, ChangePassword } from '../validators/user.validators.js';

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.user?.id as string;
        console.log("User Id: ", userId)
        const userProfile = await getProfile(userId)
        if (!userProfile){
            res.status(500).json({
                message: 'Invalid userId'
            })
        }
        res.status(200).json(userProfile)
    }
    catch(error){
        next(error)
    }
}


export const updateProfileController = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const userId = req.user?.id as string;
        if (!userId){
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }
        const result = UpdateProfileBody.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid request body",
                errors: result.error.name,
                details: result.error.message
            });
            return;
        }
        const {firstName, lastName, currentRole, targetRole, weeklyHours, targetMonths} = result.data;
        const updateData = {userId,firstName, lastName, currentRole, targetRole, weeklyHours, targetMonths };
        const updatedProfile = await updateUserProfile(updateData);
        
        res.status(201).json({
            message: "User profile updated",
            data: updatedProfile
        })
    }
    catch(error){
        next(error)
    }
}

export const changePasswordController = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.user?.id as string;
        if (!userId){
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }
        const result = ChangePassword.safeParse(req.body);
        if (!result.success){
            res.status(400).json({
                success: false,
                message: "Invalid request body",
                errors: result.error.name,
                details: result.error.message
            });
            return;
        }
        const {currentPassword, newPassword} = result.data;
        const passwordUpdated = await changeUserPassword(userId, currentPassword,newPassword)
        res.status(201).json({
            message: "Password changed",
            data: passwordUpdated
        })
    }
    catch(error){
        next(error)
    }
}

