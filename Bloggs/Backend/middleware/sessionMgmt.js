const jsonwebtoken = require('jsonwebtoken');

const validSession = (req,res,next) => {
    try{
        if (!req.headers.authorization){
            return res.status(401).json({
                message: "Authorisation headers are missing"
                })
        }
        if (!req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Invalid authorization format. Expected: "Bearer <token>"'
            });
        }
    const token = req.headers.authorization.split(" ")[1];
    if (!token){
        return res.status(401).json({
            error: "JWT token missing"
        })
    }
    const decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY);
    req.user = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name
    };
    next();
    }
    catch(error){
        if (error.name === "TokenExpiredError"){
            res.status(401).json({
                message: "Token has expired. Please login again",
                expiredAt: token.expiredAt
            })
        }
        if (error.name === 'JsonWebTokenError') {
            // Token is malformed or signature is invalid
            return res.status(401).json({
                error: 'Invalid token. Authentication failed.'
            });
        }
        console.error('Authentication Error', error);
        return res.status(500).json({
            error: 'Internal server error during authenticaiton'
        });
    }
}

module.exports = validSession;
