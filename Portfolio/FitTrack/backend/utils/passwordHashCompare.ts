import bcrypt from 'bcryptjs';
import prisma from './db.js';

interface User {
    id: number,
    name: string,
    email: string,
    password_hash: string
}

export const hashPassword = async (password:string) =>{
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
}

export const comparePasswords = async (password: string, password_hash: string) => {
    try{
        
        // const user: User| null = await prisma.users.findUnique({where:{email:email}});
        // if (!user){
        //    return false
        // }
        const isPasswordValid = await bcrypt.compare(password, password_hash)
        if (isPasswordValid){
            return true
        }
        else {
            return false
        }
    }
    catch(error){
        if (error instanceof Error){
            return error.message
        }
        else {
            return "Internal Server Error"
        }
    }
    
}