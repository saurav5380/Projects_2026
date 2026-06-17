import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type {Request, Response, NextFunction} from 'express';

interface SessionPayload extends JwtPayload {
    name: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                name: string;
                email: string;
            };
        }
    }
}

const isSessionPayload = (payload: string | JwtPayload): payload is SessionPayload => {
    return (
        typeof payload !== "string" &&
        typeof payload.name === "string" &&
        typeof payload.email === "string"
    );
};

export const validSession = (req:Request, res:Response, next:NextFunction) => {
    try{
        const SECRET_KEY = process.env.SECRET_KEY;
        if (!SECRET_KEY){
            return res.status(401).json({
                message: "SECRET KEY is not configured"
            })
        }
        if (!req.headers.authorization){
            return res.status(401).json({
                message: "Authorization headers are missing"
            })
        }
        const token = req.headers?.authorization?.split(" ")[1];

        if (!token){
            return res.status(401).json({
                message: "Authorization Token is missing"
            })
        }
        

        const decodeData = jwt.verify(token, SECRET_KEY);

        if (!isSessionPayload(decodeData)){
            return res.status(401).json({
                message: "Invalid session payload"
            })
        }

        req.user = {
            name: decodeData.name,
            email: decodeData.email
        }

        next();

}
catch(error){
    return res.status(401).json({
        message: "Invalid or expired authorization token"
    })
}
}
