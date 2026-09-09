import {z} from 'zod';

export const aiResponseSchema = z.object({
    suggestedTitle: z.string().min(3, "Minimum 3 characters are required").max(128, "Maximum 128 characters are allowed"),
    searchQuery: z.string().min(12, "Minimum 12 characters are required").max(512, "Maximum 512 characters are allowed"), 
    resourceType: z.string().min(3, "Minimum 3 characters are required").max(128, "Maximum 128 characters are allowed")
})

