const {body, validationResult } = require('express-validator');

const registerValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage("Email cannot be empty")
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail()
        .isLength({max: 255}).withMessage("Email is too long"),
    
    body('password')
        .notEmpty().withMessage("Password cannot be empty")
        .isLength({min: 6}).withMessage("Password should be at least 6 characters long")
        .isLength({max: 32}).withMessage("Password exceeds max length of 32 characters.")
        .matches(/\d/).withMessage("Password must contain at least one number"), 
    
    body('name')
        .notEmpty().withMessage("Name cannot be empty")
        .isLength({min: 2, max: 100}).withMessage("Name should be at between 2 and 100 characters long")
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces')
];

// Validation rules for login //

const loginValidation = [
    body('email')
    .trim()
    .notEmpty().withMessage("Email cannot be empty")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

    body('password')
      .notEmpty().withMessage('Password cannot be empty'),
];

// middleware to check for validation results
const handleValidationErrors = (req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next(); // if validation has passed then move to the next route handler
};

module.exports = {
    registerValidation,
    loginValidation,
    handleValidationErrors
};

