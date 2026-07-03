import type { UUID } from "node:crypto";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: UUID,
                firstName: string,
                lastName: string,
                email: string,
                currentRole: string,
                targetRole: string,
                weeklyHours: number,
                targetMonths: number,
                onboardingDone: boolean,
            }
        }
    }
}