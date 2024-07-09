const express = require('express');
const router = express.Router();
const { createPost, deletePost, updatePost } = require('../controller/postController');
const authMiddleware = require('../middleware/auth');

// Create a post
router.post('/create', authMiddleware, createPost);

// Delete a post
router.delete('/delete/:postId', authMiddleware, deletePost);

// Update a post
router.put('/update/:postId', authMiddleware, updatePost);

module.exports = router;
