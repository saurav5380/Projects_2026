import {z} from 'zod';

export const aiResponseSchema = z.object({
    suggestedTitle: z.string().min(3, "Minimum 3 characters are required").max(128, "Maximum 128 characters are allowed"),
    searchQuery: z.string().min(12, "Minimum 12 characters are required").max(512, "Maximum 512 characters are allowed"), 
    resourceType: z.string().min(3, "Minimum 3 characters are required").max(128, "Maximum 128 characters are allowed")
})


export const roadmapSchema = z.object({phases: z.array(z.object({
    title: z.string().min(3, "Minimum 3 characters are required").max(128, "Maximum 128 characters are allowed"),
    order: z.number().int({ message: "Must be a whole number" }).positive({ message: "Must be greater than 0" }).min(1, { message: "Minimum value allowed is 1" })
    .max(100, { message: "Max value allowed is 100" }),
    topics: z.array(
        z.object({
            title: z.string().min(3, "Minimum 3 characters are required").max(128, "Maximum 128 characters are allowed"),
            description: z.string().min(3, "Minimum 3 characters are required").max(128, "Maximum 128 characters are allowed"),
            estimatedHours: z.float32(),
            isCheckpoint: z.boolean(),
            order: z.number().int({ message: "Must be a whole number" }).positive({ message: "Must be greater than 0" }).min(1, { message: "Minimum value allowed is 1" })
            .max(100, { message: "Max value allowed is 100" })
        })
    )
}))})


