const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const authrouter = express.Router();
const {
    registerValidation,
    loginValidation,
    handleValidationErrors
} = require('../middleware/validator');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;

//========================================================================
// REGISTRATION ENDPOINT
//========================================================================


authrouter.post("/registration", registerValidation, handleValidationErrors, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await prisma.user.findUnique({ where: {email: email}})

        if (existingUser) {
            return res.status(409).json({
                error: ' An account with this email already exists'
            })
        }

        // hash password 
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password,saltRounds);

        // create new user in database

        const newUser = await prisma.user.create({
            data: {
                email,
                password_hash: passwordHash,
                name
            },
            select: {
                id: true,
                email: true,
                name: true,
                created_at: true
            }
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        });
        
    } catch (error) {
        console.error('Registration error', error)
        res.status(500).json({
            error: 'Internal server error during registration' 
        });
    }
});

//========================================================================
// LOGIN ENDPOINT
//========================================================================

authrouter.post("/login", loginValidation, validationResult, async (req, res) => {
    try{
        const {email, password} = await req.body;
        const checkUser = await prisma.user.findUnique({where: {email}});
        if (!checkUser){
            res.status(404).json({
                message: "User email or password does not match"
            });
        }

        const checkPassword = await bcrypt.compare(password, user.passwordHash);
        if (!checkPassword){
            res.status(401).json({
                message: "User email or password does not match"
            });
        }
        
        // construct payload for jwt generation
        const userPayload = {
            sub: user.id,
            email: user.email,
            name: user.name
        }

        const userToken = jwt.sign(
            userPayload,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h',
                algorithm: "HS256"
            });
        
        // success response
        res.status(200).json({
            userToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch(error){
        console.error("Internal server error during login");
        res.status(500).json({
            error: 'Internal server error'
        })
    }
});

module.exports = authrouter;
