import express, { Router } from 'express';
import postController from './post.controller.ts';
const router:Router = express.Router()
router.get("/posts/:id", postController.getPostsById)
router.get("/posts", postController.getAllPosts)
router.post("/posts", postController.createPost)
export default router