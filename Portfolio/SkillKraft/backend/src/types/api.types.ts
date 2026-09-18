
export type NewUser = {
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string
}

export type UserProfileUpdate = {
    firstName?: string,
    lastName?: string,
    currentRole?: string,
    targetRole?: string,
    weeklyHours?: number,
    targetMonths?: number,
    onboardingDone?: boolean
}

export type UpdatePassword = {
    userId: string,
    currentPasswordHash: string,
    newPasswordHash: string
}
