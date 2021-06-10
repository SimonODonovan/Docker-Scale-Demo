import express from 'express';
import * as postController from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router
    .route("/")
    .get(protect, postController.getAllPosts)
    .post(protect, postController.createPost);

router
    .route("/:id")
    .get(protect, postController.getOnePost)
    .patch(protect, postController.updatePost)
    .delete(protect, postController.deletePost);

export default router;