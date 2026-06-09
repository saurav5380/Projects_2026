import jwt from 'jsonwebtoken';
import type {Request, Response, NextFunction} from 'express';

const validSession = (req: Request, res: Response, next: NextFunction)=>{
    try{
        const SECRET_KEY = process.env.SECRET_KEY 
        if (!SECRET_KEY){
            return res.status(401).json({
                message: "Secret Key is missing."
            })
        }
        if (!req.headers.authorization){
        return res.status(401).json({
            message: "Authorisation headers are missing"
        })
    }
    else if (!req.headers.authorization.startsWith("Bearer")){
        return res.status(401).json({
            message: "Invalid token format"
        })
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token){
        return res.status(401).json({
            message: "Token is missing"
        })
    }
    const decoded = jwt.verify(token,SECRET_KEY) as jwt.JwtPayload;
    const sessionReq = req as Request & { user?: { sub?: string | number | undefined; email?: string | undefined; name?: string | undefined } };
    sessionReq.user = {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name
    }
    next();


}
catch(error){
   if (error instanceof jwt.TokenExpiredError){
            return res.status(401).json({
                message: "Token has expired. Please login again.",
                tokenExpired: error.expiredAt
            })
        }

        if (error instanceof jwt.JsonWebTokenError){
            return res.status(401).json({
                message: "Invalid Token. Authentication failed"
            })
        }
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Authentication error:", errorMessage);
        return res.status(500).json({
            message: "Internal Server Error",
            details: errorMessage
        })
}

};

export default validSession;