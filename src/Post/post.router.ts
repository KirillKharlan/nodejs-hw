import { Router } from 'express';
import postController from './post.controller.ts';
import { authMiddleware } from '../middlewares/auth-middleware.ts';

const postRouter = Router();

postRouter.get('/posts/', postController.getAllPosts);
postRouter.post('/posts/', postController.createPost);
postRouter.get('/posts/:id', postController.getPostsById);
postRouter.put('/posts/:id', postController.updatePostById);
postRouter.delete('/posts/:id', postController.deletePostById);
postRouter.post('/posts/:id/comments', authMiddleware, postController.createComment);
postRouter.put('/posts/:id/likes', authMiddleware, postController.likePost);
postRouter.delete('/posts/:id/likes', authMiddleware, postController.unlikePost);

export default postRouter;

