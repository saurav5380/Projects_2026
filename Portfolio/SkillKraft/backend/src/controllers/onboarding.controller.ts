// controller for user onboarding - roadmap generation, finding resources, and validating resources
import type {Request, Response, NextFunction} from 'express'
import { completeOnboarding } from '../services/onboarding.service.js'
import { onboardingSchema } from '../validators/onboarding.validators.js'

// service layer requires: userId, currentRole, targetRole, weeklyHours, targetMonths
export const onboardingController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.user?.id as string;
        if (!id){
             res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }
        const userData = onboardingSchema.safeParse(req.body);
        if (!userData.success){
            res.status(400).json({
                success: false,
                message: "Invalid request body",
                errors: userData.error.name,
                details: userData.error.message
            })
            return
        }

        const {currentRole, targetRole, weeklyHours, targetMonths} = userData?.data; 
        const userPayLoad = {currentRole, targetRole, weeklyHours, targetMonths};
        const userOnboarded = await completeOnboarding(id, userPayLoad);
        res.status(200).json({
            message: "User onboarding successful",
            data: userOnboarded
        })

    }
    catch(error){
        next(error)
    }
}
