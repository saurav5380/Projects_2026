
export type NewUser = {
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string
}

export type UserProfileUpdate = {
    userId: string,
    firstName: string,
    lastName: string,
    currentRole: string,
    targetRole: string,
    weeklyHours: number,
    targetMonths: number
}

export type UpdatePassword = {
    userId: string,
    currentPasswordHash: string,
    newPasswordHash: string
}
