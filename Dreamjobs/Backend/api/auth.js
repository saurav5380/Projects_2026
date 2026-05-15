const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const bcrypt = require("bcrypt");

const authrouter = express.Router();

// ===============================REGISTRATION================================================= //

authrouter.post("/register", async(req,res) => {
    try{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;
    
    // check if user already exists.
    const existingUser = await prisma.user.findUnique({where: { email: email}});
    if (existingUser){
        return res.status(409).json({
            error: "User account with this email already exists"
        })
    }

    // create new user in Database
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
        data: {
            email: email,
            name: username,
            password_hash: passwordHash,
            role: role
        },
        select: {
            id: true,
            email: true,
            name: true,
            password_hash: true,
            role: role
        }
    })

    res.status(201).json({
        message: "User created successfully",
        user: newUser
    })

    }
    catch(error){
        console.error("Error during registration")
        res.status(500).json({
            message: error.message
        });
    }
});

// =========================================== LOGIN ================================================== //

authrouter.post("/login", async(req, res) => {
    try{
    const SECRET_KEY = process.env.SECRET_KEY;
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!existingUser){
        return res.status(404).json({
            message: "User does not exist"
        })
    }

    const checkPassword = await bcrypt.compare(password, existingUser.password_hash);
    if (checkPassword !== true){
        return res.status(401).json({
            message: "Username or password does not match"
        })
    }

    // create jwt token based on user payload
    const userPayload = {
        sub: existingUser.id,
        email: email,
        name: existingUser.name,
        role: existingUser.role
    }

    const token = jwt.sign(userPayload,
                        SECRET_KEY,
                        {
                            expiresIn: process.env.JWT_EXPIRES_IN || '24h',
                            algorithm: 'HS256'
                        });

    return res.status(200).json({
        token: token
        });
    }

    catch(error){
        return res.status(500).json({
            message: "Internal Server Error",
            details: error.message
        })
    }
});


module.exports = authrouter;