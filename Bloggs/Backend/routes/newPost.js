/* Implement `POST /api/posts`:
  - Require authentication (use authMiddleware)
  - Accept: title, content (markdown), meta_description, status
  - Generate slug from title
  - Set author_id from req.user.id
  - Set published_at if status is 'published'
  - Insert into database
  - Return created post
- Validate:
  - Title is required (max 200 chars)
  - Content is required
  - Status is 'draft' or 'published'
*/


const express =  require('express');
const router = express.Router();
import validSession from '../middleware/sessionMgmt';
import slugify from '../utils/slugify';
import { postValidator } from '../validators/postValidator';
import { titleValidator } from '../validators/titleValidator';
import {handleValidatorError} from '../validators/validatorError';
const prisma = require('../db');

router.post("/newPost", validSession, 
            titleValidator, 
            postValidator, 
            handleValidatorError, 
            async(req, res) => {
              try{
                const postSlug = await slugify(req.body.title);
                const authorId = req.user.id;
                const postStatus = req.body.status;
                const postData = {
                  author_id: authorId,
                  title: req.body.title,
                  slug: postSlug,
                  content: req.body.content,
                  meta_description: req.body.meta_description,
                  status: postStatus
                }
                const result = await prisma.posts.create({data: postData});
                res.status(201).json(result)
                
              }
              catch(error){
                res.status(400).json({
                  error: error.message
                })
              }
})

