
export type NewUser = {
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string
}

export type UserDataForJWT = {
    userId: string,
    // email: string, // removed because auth.service.ts needs to generate new accessToken and email is not available in findByToken function
}
