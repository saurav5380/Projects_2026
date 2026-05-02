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
    return 
}

const getAllTags = async(req,res) => {
    return 
}

const getPostWithTags = async(req,res) => {
    return 
}

const createNewPost = async(req,res) => {
    return 
}

const updatePost = async(req,res) => {
    return 
}

const deletePost = async(req,res) => {
    return
}

const uploadImageForPost = async(req,res) => {
    return
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
    uploadImageForPost
}
