
import type {Request, Response, NextFunction} from 'express';
import { reorderTopics } from '../services/topic.service.js';
import { reorderTopicsBody } from '../validators/topic.validator.js';

export const updateTopicOrderController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.user?.id as string;
        if (!userId){
             res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }
        const topicOrder = reorderTopicsBody.safeParse(req.body.topicOrder);
        if (!topicOrder.success){
            res.status(400).json({
                success: false,
                message: "Revised order of topics is missing"
            })
        }
        const phaseId = req.params.phaseId as string;
        const revisedTopicOrder = topicOrder.data?.topicIds || [];
        const result = await reorderTopics(userId, phaseId, revisedTopicOrder)
        return res.status(204).json({
            success: true
        })
    }
    catch(error){
        next(error)
    }
}