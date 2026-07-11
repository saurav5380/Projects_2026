import { createNewUser, findByEmail } from "../repositories/user.repository.js"
import type { NewUser } from "../types/api.types.js"
import { hashPassword, verifyPassword } from "../utils/password.js"

// service layer for new user creation
export const register = async (user: NewUser) => {
    const newUser = await createNewUser(user)
    if (!newUser){
        throw new Error (`Could not create user`)
    }
    return newUser;
}

export const login = async (email: string, password: string) => {
    const user = await findByEmail(email);
    if (!user){
        throw new Error (`Invalid email or password`)
    }
    const verified = verifyPassword(password, user?.passwordHash)
    
    if (!verified){
        throw new Error (`Incorrect Password`)
    }

    const userPayload = {
        success: true,
        data: {
            user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email:user.email,
            onboardingDone: user.onboardingDone
            },
            accessToken: "aaadas..",
            refreshToken: "eyJ..."
        }
    }
    return userPayload;
}