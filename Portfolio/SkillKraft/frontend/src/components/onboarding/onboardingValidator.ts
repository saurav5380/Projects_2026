import z from "zod";

export const OnboardingSchema = z.object({
    currentRole: z.string().min(1, "Minimum one character").max(100, "Maximum 100 characters"),
    targetRole: z.string().min(1, "Minimum one character").max(100, "Maximum 100 characters"),
    weeklyHours: z.number().int().positive().min(2, "Minimum 2 hours").max(20, "Maximum 20 hours"),
    targetMonths: z.union([z.literal(3), z.literal(6), z.literal(12)])
});

export type Onboarding = z.infer<typeof OnboardingSchema>

