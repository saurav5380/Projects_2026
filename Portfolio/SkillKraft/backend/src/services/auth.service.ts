import { createNewUser, findByEmail } from "../repositories/user.repository.js";
import type { NewUser } from "../types/api.types.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { findByToken, create, revoke } from "../repositories/refreshToken.repository.js";

// service layer for new user creation
export const register = async (firstName:string, lastName:string, email: string, password: string) => {
    const hashed = await hashPassword(password);
    if (!hashed){
        throw new Error ('password hashing failed')
    }
    const newUserData: NewUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        passwordHash: hashed
    }
    const newUser = await createNewUser(newUserData)
    if (!newUser){
        throw new Error (`Could not create user`)
    }
    return newUser;
}

//service layer for user login
export const login = async (email: string, password: string) => {
    const user = await findByEmail(email);
    if (!user){
        throw new Error (`Invalid email or password`)
    }
    
    const verified = await verifyPassword(password, user?.passwordHash);
    
    if (!verified){
        throw new Error (`Incorrect Password`)
    }
    const userId = user.id;
    const accessToken =  signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);
    

    const userPayload = {
           user:
           { 
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email:user.email,
            onboardingDone: user.onboardingDone
           },
            accessToken: accessToken,
            refreshToken: refreshToken
    }
    
    await create(userId, refreshToken);

    return userPayload;
}

// service layer for refresh token
export const refresh = async (currToken:string) => {
    
    // check if old refresh token is valid
    const validToken = await findByToken(currToken);
    const userId = validToken.userId;
    const accessToken = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);

    await create(userId, refreshToken);
    await revoke(currToken);

    return {
        accessToken: accessToken, 
        refreshToken: refreshToken
    }
}

// service layer to logout a user

export const logout = async (currToken: string) => {
    
    const result = await revoke(currToken);
    if (result==null){
        throw new Error(`Could not revoke token`)
    }
    return result

}
