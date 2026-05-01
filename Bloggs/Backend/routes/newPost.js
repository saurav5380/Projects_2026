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
const validSession =  require('../middleware/sessionMgmt');
const slugify = require('../utils/slugify');
const { postValidator } = require('../validators/postValidator');
const { titleValidator } = require('../validators/titleValidator');
const { handleValidationErrors } = require('../validators/validatorError');
const prisma = require('../db');

router.post("/newPost", validSession, 
            titleValidator, 
            postValidator, 
            handleValidationErrors, 
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
                  status: ['draft', 'published'].includes(postStatus) ? postStatus : 'draft',
                  publishedAt: postStatus === 'published' ? new Date() : null
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

