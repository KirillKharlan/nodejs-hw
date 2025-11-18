import express, { Router } from 'express';
import postController from './post.controller.ts';
import { authMiddleware } from "../middlewares/auth-middleware.ts";


const router:Router = express.Router()

router.get("/posts/:id", postController.getPostsById)
router.get("/posts", postController.getAllPosts)
router.post("/posts", authMiddleware, postController.createPost)
router.patch("/posts/:id", authMiddleware, postController.updatePostById)
router.delete("/posts/:id", authMiddleware, postController.deletePostById)


export default router