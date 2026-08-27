import { literal, z } from 'zod';

export const onboardingSchema = z.object({
    currentRole: z.string().min(1, "Minimum 1 character are required").max(100, "Maximum 100 characters are allowed"),
    targetRole: z.string().min(1, "Minimum 1 character are required").max(100, "Maximum 100 characters are allowed"), 
    weeklyHours: z.number().min(2, "Minimum is 2 hours per week").max(20,"Maximum is 20 hours per week"), 
    targetMonths: z.union([literal(3), literal(6), literal(12)], {error: () => ({message: "Please select 3,6 or 12 months"})})
})