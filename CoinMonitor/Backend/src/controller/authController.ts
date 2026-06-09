import type {Request, Response} from 'express';
import prisma from '../db.js'
import bcrypt from 'bcrypt';
import { Prisma } from '../generated/prisma/client.js';
import jwt from 'jsonwebtoken';


//=================================================== REGISTER =======================================================================//

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

//=================================================== LOGIN =======================================================================//

export const login = async(req:Request, res:Response) => {

    try{
        const SECRET_KEY = process.env.SECRET_KEY;
        if (!SECRET_KEY) {
            return res.status(500).json({
                message: "JWT secret key is not configured"
            });
        }

        const userEmail = req.body.email;
        const password = req.body.password;
        const user = await prisma.user.findUnique({where:{email:userEmail}})
        if (user === null){
            return res.status(404).json({
                message: "User does not exist"
            })
        }
        const userId = user.id;
        const password_hash = user.password_hash;
        const userName = user.name;
        const correctPassword = await bcrypt.compare(password, password_hash);
        if (!correctPassword){
            return res.status(401).json({
                message: "Incorrect Password"
            })
        }
        const userPayload = {
            id: userId,
            email: userEmail,
            name: userName
        }

        const signOptions: jwt.SignOptions = {
            expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : '24h',
            algorithm: "HS256"
        };

        const token = jwt.sign(userPayload, SECRET_KEY as jwt.Secret, signOptions);

        return res.status(200).json({token:token});

    }
    catch(error){
        if (error instanceof Prisma.PrismaClientValidationError){
            res.status(400).json({
                message: "Validation Error. Check credentials",
                error: error.name,
                details: error.message
            })
        }
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

//=================================================== LOGOUT =======================================================================//

export const logout = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token){
        return res.status(401).json({message:"token not found"})
    }
    res.clearCookie(token, {secure: true, sameSite: 'strict'});

    return res.status(200).json({
        message: "Logged out successfully"
    });
};

//=================================================== UserDetails =======================================================================//

export const userDetails = (req: Request & {user?: {id?: number | string | undefined, email?: string | undefined, name?: string | undefined}} , res: Response) => {
    if (!req.user) {
        return res.status(401).json({message: "User not authenticated"});
    }
    return res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
    });
}