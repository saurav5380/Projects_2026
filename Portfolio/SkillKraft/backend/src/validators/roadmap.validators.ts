import z from "zod";
import { tgtMonths } from "../types/ai.types.js";

export const RoadmapBody = z.object({
    currentRole: z.string().min(1, "Minimum single character is required").max(150, "Max 150 characters are allowed"),
    targetRole: z.string().min(1, "Minimum single character is required").max(150, "Max 150 characters are allowed"),
    weeklyHours: z.number().min(2, "Minimum 2 hours per week").max(20, "Maximum of 20 hours per week"),
    tgtMonths: z.enum(tgtMonths)
})