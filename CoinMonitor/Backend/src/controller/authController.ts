import type {Request, Response} from 'express';
import prisma from '../db.js'
import bcrypt from 'bcrypt';
import { Prisma } from '../generated/prisma/client.js';

export const register = async (req: Request, res:Response) =>{
    try{
    const email: string = req.body.email;
    const password: string = req.body.password;
    const name: string = req.body.name;
    const rounds = 10;

    const existingUser = await prisma.user.findUnique({where:{email: email}});
    if (existingUser){
        return res.status(409).json({
            message: "User already exists. Please login."
        })
    }

    const passwordHash: string =  await bcrypt.hash(password, rounds);

    const createNewUser = await prisma.user.create({
        data: {
            email: email,
            password_hash: passwordHash,
            name: name
        }
    })
    res.status(200).json({
        message: "User creation successful",
        username: createNewUser.name,
        email: createNewUser.email 
    })
    
    }
    catch(error: any){
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
            res.status(409).json({
                message: "User already exists",
                code: error.code,
                detail: error.message,
                meta: error.meta
            })
        }
        res.status(500).json({
            message: "Internal Server Error",
            details: error.message
        })
    }
};






