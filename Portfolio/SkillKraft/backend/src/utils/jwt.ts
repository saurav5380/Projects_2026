
import jwt from 'jsonwebtoken';


// access token - short lived - 15 mins

export const signAccessToken = (userId: string) => {
    const SECRET_KEY = process.env.SECRET_KEY;

    if (!SECRET_KEY){
        throw new Error("SECRET_KEY is missing");
    }

    return jwt.sign({ userId }, SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: 900
    });
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
    

// refresh token - long expiry - 7 days
export const signRefreshToken = (userId: string) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    
    if(!SECRET_KEY){
        throw new Error("SECRET_KEY is missing");
    }
    
    return jwt.sign({ userId }, SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '7d'
    });
}
    
    
    


