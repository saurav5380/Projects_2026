const express = require('express');
const router = express.Router();
const { getAllPosts, getPostById, getPostBySlug, getMyPosts, createNewPost, updatePost, deletePost, getAllTags, getPostWithTags, uploadImageForPost } = require("../controllers/postController");


// Get all posts (published and draft) created by author 
router.get("/posts/user/my-posts", getMyPosts)

// Get a post based on Id
router.get("/posts/:id", getPostById)

// Get a post based on Slug
router.get("/posts/slug/:slug", getPostBySlug)


// Get Post by Tags ( unauthenticated route )
router.get("/tags/:tag/posts", getPostWithTags)

// Create a New Post
router.post("/posts/newpost", createNewPost)

// Update a Post
router.put("/posts/:id", updatePost)

// Delete a Post
router.delete("/posts/:id", deletePost)

// Upload a image
router.post("/posts/:id/upload", uploadImageForPost)

// Get all published posts ( unauthenticated route)
router.get("/posts", getAllPosts)

// Get all Tags 
router.get("/tags", getAllTags)

module.exports = router;