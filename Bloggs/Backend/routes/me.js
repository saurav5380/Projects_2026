const express = require('express');
const router = express.Router();
const validSession = require("../middleware/sessionMgmt");
const prisma = require('../db');

router.get("/currentUser", validSession, async(req, res, next) => {
    try{
       
        const currentUser = await prisma.user.findUnique({where: {id : req.user.id}});

        if (!currentUser){
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email
        })

    }
    catch(error){
        console.error("Error occurred: ", error);
        return res.status(500).json({
            message: "Internal Server error",
            details: error.message
        })
    }
})

module.exports = router;