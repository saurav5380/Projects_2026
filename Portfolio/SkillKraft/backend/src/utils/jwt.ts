
import * as jwt from 'jsonwebtoken';
import type {Request, Response, NextFunction} from 'express';

// type userData = {
//     id: string,
//     firstName: string,
//     lastName:string,
//     email: string
// }

// access token - short lived - 15 mins

export const signAccessToken = (req:Request, res: Response, next: NextFunction) => {
    try{
        const SECRET_KEY = process.env.SECRET_KEY;

        if (!SECRET_KEY){
            throw new Error("Secret Key is missing")
        }

        const userData = req.body.userData;

        const token = jwt.sign(userData, SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: 900000
        });
         
        res.status(200).json(token);
    }
    catch(error){
        if (error instanceof Error){
            res.status(500).json({message: error.message})
        }
    }
    next();
}

//session management - check if user token is valid
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try{
        const SECRET_KEY = process.env.SECRET_KEY;
        if (!SECRET_KEY){
            throw new Error("Secret Key is missing")
        }
        const token = req.body.token;
        const userData = jwt.verify(token, SECRET_KEY);
        res.status(200).json(userData);
    }
    catch(error){
        if (error instanceof Error){
            res.status(401).json({message: error.message});
        }
    }
    next();
}
    

// refresh token - long expiry - 48 hours
export const signRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    try{
        const SECRET_KEY = process.env.SECRET_KEY;
        if(!SECRET_KEY){
            throw new Error("Secret Key is missing")
        }

        const userData = req.body.userData;
        const refershToken = jwt.sign(userData,SECRET_KEY,{
            algorithm: 'HS256',
            expiresIn: '48h'
        })
        res.status(200).json(refershToken);

    }
    catch(error){
        if (error instanceof Error){
            res.status(500).json({
                message: error.message
            })
        }
    }
    
    next();
}


