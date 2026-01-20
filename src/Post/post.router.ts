import { Router } from 'express';
import postController from './post.controller.ts';
import { authMiddleware } from '../middlewares/auth-middleware.ts';

const postRouter = Router();

postRouter.get('/posts/', postController.getAllPosts);
postRouter.get('/posts/:id', postController.getPostsById);

postRouter.post('/posts/', authMiddleware, postController.createPost);
postRouter.put('/posts/:id', authMiddleware, postController.updatePostById);
postRouter.delete('/posts/:id', authMiddleware, postController.deletePostById);
postRouter.post('/posts/:id/comments', authMiddleware, postController.createComment);
postRouter.put('/posts/:id/likes', authMiddleware, postController.likePost);
postRouter.delete('/posts/:id/likes', authMiddleware, postController.unlikePost);

export default postRouter;