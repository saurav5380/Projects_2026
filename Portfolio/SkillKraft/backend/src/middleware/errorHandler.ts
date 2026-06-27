// import type {Response} from 'express';

import type { NextFunction, Request, Response } from "express";

type handlerError = {
    success: boolean,
    statusCode: number,
    message: string,
    details: string[]
}

const globalErrorHandler = (error:handlerError, req:Request, res:Response, next: NextFunction) =>{
    const statusCode: number = error.statusCode;
    switch(statusCode){
        case 401:
            return res.status(401).json({
                success: false,
                message:"Check username and password",
                details: error.details
            });
        case 403: 
            return res.status(403).json({message:"Unauthorised"});
        case 400:
            return res.status(400).json({message:"Bad request"});
        case 409:
            return res.status(409).json({message:"Conflict. Duplicate resource"});
        case 422:
            return res.status(422).json({message:"Request failed validation parameters"});
        case 404: 
            return res.status(404).json({message:"Resource not found"});
        default:
            return res.status(500).json({message:"Internal Server Error"});
    }
}


export default globalErrorHandler;