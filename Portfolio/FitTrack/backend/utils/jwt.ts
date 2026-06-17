import jwt from "jsonwebtoken";
import prisma from "./db.js";

// assumption - registered user exists in DB

// Generate new JWT //
export const generateToken = async (id:number) => {
    try{
    const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : "null"; 
    const data = await prisma.users.findUnique({where:{
        id: id
    }})
    if (!data){
        return ("User does not exist")
    }
    const userPayload = {
        name: data.name,
        email: data.email
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


