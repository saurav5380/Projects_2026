export{}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                // firstName: string,
                // lastName: string,
                // email: string,
                // password: string,
                // currentRole: string,
                // targetRole: string,
                // weeklyHours: number,
                // targetMonths: number,
                // onboardingDone: boolean,
                // accessToken: string,
                // refreshToken:string
            }
        }
    }
}