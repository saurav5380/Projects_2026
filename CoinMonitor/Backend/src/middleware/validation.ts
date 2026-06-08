import {body, validationResult} from 'express-validator';
import type {Request, Response, NextFunction} from 'express';


export const newUserRegistrationValidator = [
    body("email")
    .trim()
    .notEmpty().withMessage("Email cannot be empty")
    .isEmail().withMessage("Provide a valid email")
    .normalizeEmail()
    .isLength({max:255}).withMessage("Email is too long"),

    body("name")
    .notEmpty().withMessage("Name cannot be empty")
    .isLength({min:2, max:100}).withMessage("Name should be between 2 and 100 characters in length"),

    body("password")
    .notEmpty().withMessage("Password cannot be empty")
    .matches(/\d/).withMessage("Password should contain at least one number")
    .isLength({min:8, max:16}).withMessage("Passwords should be between 8 and 16 characters")
]

export const handleValidationError = (req: Request, res: Response, next: NextFunction) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
       return res.status(400).json({
            message: "Validation failed",
            details: errors.array()
        })
    }
    next();
};

