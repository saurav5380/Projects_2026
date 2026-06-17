import jwt from "jsonwebtoken";
import prisma from "./db.js";

// assumption - registered user exists in DB

// Generate new JWT //
export const generateToken = async (username:string, email:string) => {
    try{
    const SECRET_KEY = process.env.SECRET_KEY; 
    if (SECRET_KEY == null){
        return "Secret key is not set"
    }
    
    const userPayload = {
        username: username,
        email: email
    }
    const token = jwt.sign(userPayload, SECRET_KEY,
                        {
                            expiresIn: '24h',
                            algorithm: 'HS256'
                        });
    return token;

}
catch(error){
    if (error instanceof Error){
        return (`Error: ${error.message}`)
}
}
}


