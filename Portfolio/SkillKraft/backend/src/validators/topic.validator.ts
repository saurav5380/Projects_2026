
import z from 'zod';

export const updateProgressBody = z.object({
    status:  z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"])
})

export const reorderTopicsBody = z.object({
    topicIds: z.array(z.string().min(1))
})