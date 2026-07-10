import type {Request, Response} from 'express'
import jwt from 'jsonwebtoken'


const authenticate = (req: Request, res: Response) => {
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
        res.status(200).json({
            data: payload
        })

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
