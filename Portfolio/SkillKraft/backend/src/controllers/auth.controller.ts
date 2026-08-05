
import type {Request, Response, NextFunction} from 'express';
import {register, login, refresh, logout} from '../services/auth.service.js';
import { RegisterBody, LoginBody, RefreshBody } from '../validators/auth.validators.js';


export const registerController = async (req:Request, res:Response, next: NextFunction) => {
    try{
    const validation = RegisterBody.safeParse(req.body)
    if (!validation.success){
        const details = validation.error.issues.map((err) => ({
            field: err.path[0],
            message: err.message
        }));
        return res.status(422).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Request validation failed",
                    details: details
                }
            })
    }

    const { firstName, lastName, email, password } = validation.data;
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
        const validation = LoginBody.safeParse(req.body)
        if (!validation.success){
            const details = validation.error.issues.map((err) => ({
                field: err.path[0],
                message: err.message
            }));
            return res.status(422).json({
                    success: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Request validation failed",
                        details: details
                    }
                })
        }
        const {email, password} = validation.data;
        const result = await login(email,password);
        res.status(200).json({
            success: true,
            data: result
        })
        console.log(result);
    }
    catch(error){
        next(error)
    }
}

export const refreshController = async(req:Request, res:Response, next:NextFunction) =>{
    try{
        const validation = RefreshBody.safeParse(req.body)
        if (!validation.success){
            const details = validation.error.issues.map((err) => ({
                field: err.path[0],
                message: err.message
            }));
            return res.status(422).json({
                    success: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Request validation failed",
                        details: details
                    }
                })
        }
        const {currToken} = validation.data;
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
        const currToken = req.body.currToken;
        const result = await logout(currToken);
        res.status(200).json({
            success: true,
            data: result
        })
    }
    catch(error){
        next(error)
    }
}
