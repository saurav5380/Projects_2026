const express = require('express');
const router = express.Router();
const { getAllPosts, getPostById, getPostBySlug, getMyPosts, createNewPost, updatePost, deletePost, getAllTags, getPostWithTags, uploadImageForPost } = require("../controllers/postController");

// Get all published posts ( unauthenticated route)
router.get("/", getAllPosts)

// Get all posts (published and draft) created by author
router.get("/user/my-posts", getMyPosts)

// Get a post based on Slug (must be before /:id to avoid conflict)
router.get("/slug/:slug", getPostBySlug)

// Get all Tags
router.get("/tags", getAllTags)

// Get Posts by Tag
router.get("/tags/:tag/posts", getPostWithTags)

// Get a post based on Id
router.get("/:id", getPostById)

// Create a New Post
router.post("/newpost", createNewPost)

// Update a Post
router.patch("/:id", updatePost)

// Delete a Post
router.delete("/deletePost/:id", deletePost)

module.exports = router;
