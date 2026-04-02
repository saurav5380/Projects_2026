const { validSession } = require("../middleware/sessionMgmt");
const express = require("express");
const router = express.Router();

router.post("/logout", validSession, async (req, res) => {
    let user;
    try{
        user = req.user.name;
        console.log(`User ${user} has logged out at: ${new Date().toISOString()}`);
        res.status(200).json({
            message: 'User logged out successfully'
        })
    }
    catch(error){
        console.error(`Error logging out user: ${user || 'unknown'}`, error.message);
        res.status(500).json({
            message: 'Internal Server Error. Could not log out user.'
        })
    }
})

module.exports = router;