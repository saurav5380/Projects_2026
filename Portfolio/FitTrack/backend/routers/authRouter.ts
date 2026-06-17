import express from 'express';
import type { Request, Response } from 'express';
import { hashPassword, comparePasswords } from '../utils/passwordHashCompare.js';
import {z, ZodError} from 'zod';
import prisma from '../utils/db.js';
import { generateToken } from '../utils/jwt.js';
import {Prisma} from "../generated/prisma/client.js";
const authRouter = express.Router();


//========================================= Registration ===========================================//

authRouter.post("/register", async (req:Request, res: Response) => {
    try{
    const userSchema = z.object({
        name: z.string().min(2, {error:"Name must be at least two characters"}),
        email: z.email({error: "Invalid email address"}),
        password: z.string().min(8, {error: "Password should be of minimum 8 characters"})
    })

    type User = z.infer<typeof userSchema>

    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password 
    }

    const user: User = userSchema.parse(userData);
    const hashedPwd = await hashPassword(user.password);

    const result = await prisma.users.create({
        data: {
            name: user.name,
            email: user.email,
            password_hash: hashedPwd
        },
        select:{
            name: true,
            email: true,
            password_hash: true
            
        }
    });

    return res.status(201).json({
        message: "User registration successful"
    })

    }
    catch(error){
        if (error instanceof ZodError){
            return res.status(400).json({
                message: error.issues
            })
        }
        else if (error instanceof Prisma.PrismaClientKnownRequestError){
            return res.status(409).json({
                message: "User data already exists",
                error: error.message,
                code: error.code,
                meta: error.meta
            })
        }
        else if (error instanceof Prisma.PrismaClientValidationError){
            return res.status(400).json({
                message: "Invalid data provided",
                error: error.message
            })
        }

        else return res.status(500).json({message: "Internal server error"})
    }
})

//========================================= Login ===========================================//

authRouter.post("/login", async (req:Request, res:Response) =>{
    try{
        const user = await prisma.users.findUnique({where: {email:req.body.email}});
        if (!user){
            return res.status(404).json({
                message: "User does not exist"
            })
        }
        
        const validateUser = await comparePasswords(req.body.password, user.password_hash);
        if (validateUser === false){
            return res.status(401).json({
                message: "Username or password is incorrect"
            })
        }
        const token =  await generateToken(user.name, user.email);
        if (!token){
            return res.status(500).json({
                message: "Could Not generate JWT"
            })
        }
        else if(token.startsWith('Error')){
            return res.status(500).json({
                message: "Error generating token"
            })
        }
        return res.status(200).json({ token });
        }
        catch(error){
            return res.status(404).json({
                message: "User not found"
            })
        }
})



export default authRouter;