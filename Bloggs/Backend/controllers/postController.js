const slugify = require ('../utils/slugify');
const { PrismaClientKnownRequestError, PrismaClientValidationError } = require('@prisma/client/runtime/client');
const prisma = require('../db');


const getAllPosts = async(req, res) => {
    try{
        const result = await prisma.posts.findMany();
        res.status(200).json(result);
    }
    catch(error){
        res.status(400).json({
            error: error.message
        })
    }
}

const getPostById = async(req,res) => {
    try{
        const postId = parseInt(req.params.id);
        const result = await prisma.posts.findUnique({where: {id: postId}});
        if (!result){
            return res.status(404).json({
                message: "No data found"
            })
        }
        res.status(200).json(result);
    }
    catch(error){
        res.status(400).json({
            error: error.message
        })
    } 
}

const getPostBySlug = async(req,res) => {
    try{
        const postSlug = req.params.slug;
        const result = await prisma.posts.findUnique({where: {slug: postSlug}});
        if (!result){
            return res.status(404).json({
                message: "No Post found"
            })
            
        }
        res.status(200).json(result);
    }
    catch(error){
        res.status(400).json({
            error: error.message
        })
    }
}

const getMyPosts = async(req,res) => {   
    try{
        const userId = parseInt(req.user.id);
        const result = await prisma.posts.findMany({
            where:{
                author_id: userId 
            }
        })
        res.status(200).json(result);
    
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
}

const getAllTags = async(req,res) => {
    try{
        const result = await prisma.tags.findMany();
        res.status(200).json(result);
    }
    catch(error){
        error: error.message
    }
}

const getPostWithTags = async(req,res) => {
    try{
    const requiredTags = req.params.tag;
    const result = await prisma.tags.findMany({
        where:{
            tags: requiredTags
        },
        select: {
            posts: true,
            name: true
        }
    })
    res.status(200).json(result);
    }
    catch(error){
        error: error.message
    }
    
}

const createNewPost = async (req, res) => {
    try {
        // ---- EXTRACT AND PROCESS DATA ----
        
        // Get author from authenticated user 
        const authorId = req.user.id;  // Set by validSession middleware
        
        // Generate slug from title
        const postSlug = await slugify(req.body.title);
        
        // Get and validate status
        const postStatus = req.body.status;
        const validStatus = ['draft', 'published'].includes(postStatus) ? postStatus : 'draft';
        
        // Set published_at based on status
        const publishedAt = validStatus === 'published' ? new Date() : null;
        
        // ---- BUILD POST DATA ----
        
        const newPost = {
            author_id: authorId,           // From JWT token
            title: req.body.title,         // Validated by titleValidator
            slug: postSlug,                // Generated from title
            content: req.body.content,     // Validated by postValidator
            meta_description: req.body.meta_description || null,  
            cover_image_url: req.body.cover_image_url || null,    
            status: validStatus,           
            published_at: publishedAt      
        };
        
        // ---- CREATE POST IN DATABASE ----
        
        const result = await prisma.posts.create({
            data: newPost
        });
        
        // ---- RETURN SUCCESS RESPONSE ----
        
        res.status(201).json({
            message: 'Post created successfully',
            post: result
        });
        
    } catch (error) {
        // ---- ERROR HANDLING ----
        
        // Prisma-specific errors
        if (error instanceof PrismaClientKnownRequestError) {
            // Handle known database errors (unique constraint, foreign key, etc.)
            return res.status(400).json({
                error: 'Database error',
                message: error.message,
                code: error.code,
                details: error.meta
            });
        }
        
        if (error instanceof PrismaClientValidationError) {
            // Handle validation errors from Prisma
            return res.status(422).json({
                error: 'Validation error',
                message: error.message
            });
        }
        
        // Generic error (unknown)
        console.error('Unexpected error in createNewPost:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};

const updatePost = async(req,res) => {
    try{
    const postId = parseInt(req.params.id);
    const updateAllowed = ['title', 'status', 'content', 'meta_description', 'cover_image_url']
    let updateData = {}
    updateAllowed.forEach(element => {
        if (element in req.body){
            updateData[element] = req.body[element]
        }
    });
    const result = await prisma.posts.update({
        where:{id: postId},
        data:{updateData}
    }) 

    res.status(200).json({
        message: "Post updated successfully",
        data: result
    });
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            return res.status(400).json({
                message: error.message,
                code: error.code,
                details: error.meta
            })
        }
        else{
            return res.status(500).json({
                message: "Unknown Server Error",
                details: error.message
            })
        }
    }
}

const deletePost = async(req,res) => {
    try{
        const postId = parseInt(req.params.id);
        const result = await prisma.posts.delete({
            where:{
                id: postId
            }
        })
        res.status(200).json({
            message: "Post deleted"
        })
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            return res.status(400).json({
                message: error.message,
                errorcode: error.code, 
                details: error.meta
            })
        }
        else{
            return res.status(500).json({
                message: "Internal Server Error",
                details: error.message
            })
        }
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    getPostBySlug,
    getMyPosts,
    getAllTags,
    getPostWithTags,
    createNewPost,
    updatePost,
    deletePost,
    // uploadImageForPost
}
