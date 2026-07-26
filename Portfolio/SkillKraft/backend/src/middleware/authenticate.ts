import type {NextFunction, Request, Response} from 'express'
import jwt from 'jsonwebtoken'


const authenticate = (req: Request, res: Response, next: NextFunction ) => {
    try{
        const SECRET_KEY = process.env.SECRET_KEY;
        if (!SECRET_KEY){
            return ("Secret Key is missing..")
        }
        const authHeader = req.headers['authorization'];
        if (!authHeader){
            return res.status(401).json({
                message: 'Authorization Header is missing'
            })
        }
        const token = authHeader.split(" ")[1];
        if (!token){
            return res.status(401).json({
                message: "JWT is missing"
            })
        }

        const payload = jwt.verify(token, SECRET_KEY);
        if (typeof payload === 'string' || !('userId' in payload)) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }
        const userId = payload.userId as string;

        req.user = { id: userId }
        next()
    }
    catch(error){
        if (error instanceof Error){
            return res.status(400).json({
                success: false,
                error: {
                code: "VALIDATION_ERROR",
                message: error.message,
                detail: error.name
                }
            })
        }
    }
    
}


export default authenticate;
