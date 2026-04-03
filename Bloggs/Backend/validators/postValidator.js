const {body} = require('express-validator');
const {Buffer} = require('buffer');

const postValidator = [
    body('content')
    .trim()
    .notEmpty().withMessage("Content cannot be empty")
    .isLength({min:50}).withMessage("Please add a minimum of 50 words to save this post.")
    .custom((value) => {
        const MAX_BYTES = 65535;
        const contentSize = Buffer.byteLength(value, 'utf8')

        if (contentSize > MAX_BYTES){
            const approxWords = Math.ceil(contentSize/6.5);
            const maxWords = Math.ceil(MAX_BYTES/6.5);
            throw new Error(
                `Content exceeds maximum size. ` +
                `Max words allowed are ${maxWords}` +
                `Your content contains approximately ${approxWords}` + 
                ` Please reduce content length`
            );
        }
        return true;
    })
    .custom((value) =>{
        if (value.includes('<script>')){
            throw new Error (`Content possibly contains malicious content.`)
        }
        return true;
    })
]

module.exports = {postValidator};

