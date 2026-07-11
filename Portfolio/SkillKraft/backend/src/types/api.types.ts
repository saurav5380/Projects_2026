
export type NewUser = {
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string
}



export type UserDataForJWT = {
    userId: string,
    email: string,
}
