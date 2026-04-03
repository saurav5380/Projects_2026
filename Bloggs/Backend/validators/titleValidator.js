const {body} = require("express-validator");

const titleValidator = [
    body('title')
    .trim()
    .exists().withMessage("Title cannot be null")
    .notEmpty().withMessage("Title cannot be empty")
    .isLength({max:255}).withMessage("Title is too long. Max characters allowed is 255")
    .isLength({min:4}).withMessage("Title is too short. Min characters allowed is 4")
];

module.exports = {titleValidator};