const jsonwebtoken = require('jsonwebtoken');

const validSession = (req, res, next) => {
    try{
    if (!req.headers.authorization){
        return res.status(401).json({
            message: "Authorization headers are missing"
        })
    }

    if (!req.headers.authorization.startsWith('Bearer ')){
        return res.status(401).json({
            message: "Invalid authorization format. Expected 'Bearer <token>'"
        })
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token){
        return res.status(401).json({
            message: "Token is missing"
        })
    }

    const decodedData = jsonwebtoken.verify(token,process.env.SECRET_KEY);

    req.user = {
        sub: decodedData.id,
        email: decodedData.email,
        name:decodedData.name,
        role:decodedData.role
    };
    
    next();

    }

    catch(error){
        if (error.name === "TokenExpiredError"){
            return res.status(401).json({
                message: "Token has expired. Please login again.",
                tokenExpired: error.expiredAt
            })
        }

        if (error.name === "JsonWebTokenError"){
            return res.status(401).json({
                message: "Invalid Token. Authentication failed"
            })
        }
        console.error("Authentication error:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            details: error.message
        })
    }
}

module.exports = validSession;