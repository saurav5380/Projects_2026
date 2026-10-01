import type { Request, Response, NextFunction } from 'express';
import { getActiveRoadmap, renameRoadmap, regenerateRoadmap, presentRoadmap } from '../services/roadmap.service.js';
import { RoadmapBodySchema, RenameRoadmapSchema } from '../validators/roadmap.validators.js';
 

export const activeRoadmapController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.user?.id as string;
        if (!id){
             res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }
        const fetchActiveRoadmap = await getActiveRoadmap(id);

        return res.status(200).json({
            success: true,
            data: fetchActiveRoadmap
        });
    }
    catch(error){
        next(error)
    }
}

export const renameRoadmapController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.user?.id as string;
        if (!id){
             res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }

        const title = RenameRoadmapSchema.safeParse(req.body);
        if (!title.success){
            res.status(400).json({
                success: false,
                message: "Invalid request body",
                errors: title.error.name,
                details: title.error.message
            })
            return
        }

        const {newTitle} = title.data

        const currRoadmap = await presentRoadmap(id);

        const renamedRoadmap = await renameRoadmap(currRoadmap?.id, newTitle);

        return res.status(200).json({
            success: true,
            message: "Roadmap has been renamed",
            details: renamedRoadmap
        });
    }
    catch(error){
        next(error)
    }
}

export const regenerateRoadmapController = async (req: Request, res: Response, next: NextFunction) => {
    try{
    const userId = req.user?.id as string;
    if (!userId){
        res.status(401).json({
            success: false,
             message: "User not authenticated"
        })
    }

    const newRoadmapBody = RoadmapBodySchema.safeParse(req.body);
    if (!newRoadmapBody.success){
            res.status(400).json({
                success: false,
                message: "Invalid request body",
                errors: newRoadmapBody.error.name,
                details: newRoadmapBody.error.message
        })
        return;
    }

    const {currentRole, targetRole, weeklyHours, tgtMonths}  = newRoadmapBody.data;

    const roadmapBody = {currentRole, targetRole, weeklyHours, targetMonths: tgtMonths};

    const newRoadmap = await regenerateRoadmap(userId, roadmapBody);
    if (!newRoadmap){
        res.status(400).json({
            success: false,
            message: "Roadmap regeneration failed"
        })
    }
     return res.status(200).json({
        success: true,
        data: newRoadmap
     })
    }
    catch(error){
        next(error);
    }
}