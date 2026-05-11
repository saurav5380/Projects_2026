const express = require('express');
const router = express.Router();
const validSession =  require('../middleware/sessionMgmt');
const slugify = require('../utils/slugify');
const { postValidator } = require('../validators/postValidator');
const { titleValidator } = require('../validators/titleValidator');
const { handleValidationErrors } = require('../validators/validatorError');
const { getAllPosts, getPostById, getPostBySlug, getMyPosts, createNewPost, updatePost, deletePost, getAllTags, getPostWithTags, uploadImageForPost } = require("../controllers/postController");

// Get all published posts ( unauthenticated route)
router.get("/", getAllPosts)

// Get all posts (published and draft) created by author
router.get("/user/my-posts", validSession, getMyPosts)

// Get a post based on Slug (must be before /:id to avoid conflict)
router.get("/slug/:slug", getPostBySlug)

// Get all Tags
router.get("/tags", getAllTags)

// Get Posts by Tag
router.get("/tags/:tag/posts", getPostWithTags)

// Get a post based on Id
router.get("/:id", getPostById)

// Create a New Post
router.post("/newpost", validSession, 
            titleValidator, 
            postValidator, 
            handleValidationErrors, createNewPost)

// Update a Post
router.patch("/updatePost/:id", validSession, updatePost)

// Delete a Post
router.delete("/deletePost/:id", validSession, deletePost)

module.exports = router;
