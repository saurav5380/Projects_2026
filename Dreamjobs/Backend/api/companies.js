const validSession = require('../middleware/sessionMgmt');
const requireRole = require('../middleware/requireRole');
const express = require('express');
const prisma = require('../db');
const {Prisma} = require('@prisma/client');
const multer = require('multer');

const companiesRouter = express.Router();
const uploads = multer({dest: './uploads/'})

companiesRouter.patch("/profile", uploads.single("companyLogo"), (req,res) =>{
    console.log(req.body)
    console.log(req.file)
    res.status(200).json({
        message: "file upload successful",
        data: req.file
    })
})

module.exports = companiesRouter;