import type { Request, Response, NextFunction } from 'express';
import * as z from 'zod';

const validateBody = (userSchema:z.ZodType) => {
    return (req:Request, res:Response, next:NextFunction) => {
        try{
            const result = userSchema.parse(req.body);
            req.body = result;
            next();
        }
        catch(error){
            if (error instanceof z.ZodError){
                res.status(422).json({
                    success: false,
                    error: {
                    code: "VALIDATION_ERROR",
                    message: error.message,
                    details: error.issues
                }
                })
            }
            else (error instanceof Error)
            {
                res.status(500).json({message: "Internal Server Error"})
            }
        }
    }
}


export default validateBody;