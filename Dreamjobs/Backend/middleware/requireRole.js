
// middleware to check if the user role stored in DB matches with the provide user role 

const requireRole = (userRole) => {
    return (req, res, next)=> {
        const {role} = req.user; 
        if (userRole !== role){
            return res.status(403).json({
                message: "Forbidden Request"
            })
        }
        next();
    }
} 

module.exports = requireRole;