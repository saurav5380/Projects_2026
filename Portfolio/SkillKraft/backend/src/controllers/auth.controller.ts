
import type {Request, Response, NextFunction} from 'express';
import {register, login, refresh, logout} from '../services/auth.service.js';

export const registerController = async (req:Request, res:Response, next: NextFunction) => {
    try{
    const firstName = String(req.user?.firstName);
    const lastName = String(req.user?.lastName);
    const email = String(req.user?.email);
    const password = String(req.user?.password);
    if (!firstName || !lastName || !email || !password){
        res.status(401).json({
            message: 'Request Body is missing mandatory information'
        })
    }
    const result = await register(firstName, lastName, email, password);
    res.status(200).json({
        success: true,
        data: result
    })
    }
    catch(error){
        next(error);
    }

}; 

export const loginController = async (req:Request, res:Response, next: NextFunction) =>{
    try{
    const email = String(req.user?.email);
    const password = String(req.user?.password);
    const result = await login(email,password);
    res.status(200).json({
        success: true,
        data: result
    })
    }
    catch(error){
        next(error)
    }
}

export const refreshController = async(req:Request, res:Response, next:NextFunction) =>{
    try{
        const currToken = String(req.user?.refreshToken);
        const result = await refresh(currToken);
        res.status(200).json({
            success: true,
            data: result
        })
    }
    catch(error){
        next(error)
    }
}

export const logoutController = async(req:Request, res:Response, next: NextFunction) => {
    try{
        const currToken = String(req.user?.refreshToken);
        const result = logout(currToken);
        res.status(200).json({
            success: true,
            data: result
        })
    }
    catch(error){
        next(error)
    }
}

