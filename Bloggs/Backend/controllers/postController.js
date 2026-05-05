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
        const userId = parseInt(req.body.id);
        const result = await prisma.posts.findMany({
            where:{
                author_id: userId 
            }
        })
        res.status(200).json(result);
    
    }
    catch(error){
        error: error.message
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

const createNewPost = async(req,res) => {
    try{
        const newPost = {
            'author_id': req.body.author_id,
            'title': req.body.title,
            'slug': req.body.slug,
            'content' : req.body.content,
            'meta_description': req.body.meta_description,
            'cover_image_url': req.body.cover_image_url,
            'status': req.body.status,
            'published_at': req.body.published_at
        }

        const result = await prisma.posts.create({
            data: newPost
        })
       
        res.status(201).json(result);
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            return res.status(400).json({
                message: error.message,
                code: error.code,
                details: error.meta
            })
        }
        else if (error instanceof PrismaClientValidationError){
            return res.status(422).json({
                message: error.message
            })
        }
        else{
            // generic catch-all for unknown errors
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
}

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
