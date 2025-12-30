import type { Request, Response } from 'express';
import type { IPostController, errorMessage } from './post.types.ts';
import { postRepository } from './post.repository.ts';
import { postService } from './post.service.ts';

const postController: IPostController = {
    getAllPosts: async (req, res) => {
        const skip = req.query.skip ? parseInt(req.query.skip) : undefined;
        const take = req.query.take ? parseInt(req.query.take) : undefined;
        const posts = await postRepository.getAll(skip, take);
        return res.json(posts);
    },

    getPostsById: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id!, 10);
        const currentUserId = res.locals.userId;
        const includeQuery = req.query.include;
        const includes = Array.isArray(includeQuery) ? (includeQuery as string[]) : (includeQuery ? [includeQuery as string] : []);
        if (currentUserId && !includes.includes('likedBy')) {
            includes.push('likedBy');
        }
        const result = await postService.getPostById(id, currentUserId, includes);
        return res.status(result.statusCode).json(result.data);
    },

    createPost: async (req, res) => {
        const post = await postRepository.create(req.body);
        return res.status(201).json(post);
    },

    updatePostById: async (req, res) => {
        const post = await postRepository.update(parseInt(req.params.id), req.body);
        return res.json(post);
    },

    deletePostById: async (req, res) => {
        const post = await postRepository.delete(parseInt(req.params.id));
        return res.json(post);
    },

    createComment: async (req: Request, res: Response) => {
        try {
            const postId = parseInt(req.params.id!, 10);
            const { body } = req.body;
            const userId = res.locals.userId; 

            if (!userId) {
                return res.status(401).json({ message: "Користувач не авторизований" });
            }
            if (!body) {
                return res.status(400).json({ message: "Текст коментаря обов'язковий" });
            }
            const result = await postService.createComment(postId, userId, body);
            
            if (result.status === 'error') {
                return res.status(result.statusCode).json({ message: result.message });
            }
            return res.status(201).json(result.data);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    },

    likePost: async (req: Request, res: Response) => {
        try {
            const postId = parseInt(req.params.id!, 10);
            const userId = res.locals.userId; 
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            await postRepository.addLike(postId, userId);
            return res.status(201).json({ message: "Post liked successfully" });
        } catch (error: any) {
            console.error("Like error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    unlikePost: async (req: Request, res: Response) => {
        const postId = parseInt(req.params.id!, 10);
        const userId = res.locals.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        await postRepository.removeLike(postId, userId);
        return res.json({ message: "Unliked" });
    }
};

export default postController;