
import * as jwt from 'jsonwebtoken';
import type { UserDataForJWT } from '../types/api.types.js';



// access token - short lived - 15 mins

export const signAccessToken = (userData: UserDataForJWT) => {
        
    const SECRET_KEY = process.env.SECRET_KEY;

    if (!SECRET_KEY){
        throw new Error("Secret Key is missing")
    }

    const token = jwt.sign(userData, SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: 900000
    });
         
    return token;
}

//session management - check if user token is valid
export const verifyToken = (token:string) => {
    
    const SECRET_KEY = process.env.SECRET_KEY;
    
    if (!SECRET_KEY){
        throw new Error("Secret Key is missing")
    }
    
    const userData = jwt.verify(token, SECRET_KEY);
    
    return userData;
}
    

// refresh token - long expiry - 48 hours
export const signRefreshToken = (userData: UserDataForJWT) => {
    
    const SECRET_KEY = process.env.SECRET_KEY;
    
    if(!SECRET_KEY){
        throw new Error("Secret Key is missing")
    }
    
    const refershToken = jwt.sign(userData,SECRET_KEY,{
        algorithm: 'HS256',
        expiresIn: '48h'
    })
    
    return refershToken;
    
}
    
    
    



