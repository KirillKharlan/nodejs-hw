import type { Request, Response } from 'express';
import type { IPostController } from './post.types.ts';
import { postRepository } from './post.repository.ts';
import { postService } from './post.service.ts';

const postController: IPostController = {
    getAllPosts: async (req, res) => {
        const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
        const take = req.query.take ? parseInt(req.query.take as string) : undefined;
        const currentUserId = res.locals.userId;

        const result = await postService.getAllPosts(skip, take, currentUserId);
        if (result.status === 'success' && result.data) {
            return res.status(result.statusCode).json(result.data);
        }
        
        return res.status(result.statusCode).json({ 
            message: result.message || "Unknown error" 
        });
    },

    getPostsById: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id!, 10);
        const currentUserId = res.locals.userId;
        const includeQuery = req.query.include;
        const includes = Array.isArray(includeQuery) ? (includeQuery as string[]) : (includeQuery ? [includeQuery as string] : ['comments', 'likedBy']);
        
        const result = await postService.getPostById(id, currentUserId, includes);
        return res.status(result.statusCode).json(result.status === 'success' ? result.data : { message: result.message });
    },

    createPost: async (req, res) => {
        const userId = res.locals.userId;
        if (!userId) return res.status(401).json({ message: "Користувач не авторизований" });

        const postData = {
            ...req.body,
            createdById: userId
        };

        const result = await postService.createPost(postData);

        if (result.status === 'success' && result.data) {
            return res.status(result.statusCode).json(result.data);
        }

        return res.status(result.statusCode).json({ 
            message: result.message || "Failed to create post" 
        });
    },

    updatePostById: async (req, res) => {
        const id = parseInt(req.params.id);
        const post = await postRepository.update(id, req.body);
        return res.json(post);
    },

    deletePostById: async (req, res) => {
        const id = parseInt(req.params.id);
        const post = await postRepository.delete(id);
        return res.json(post);
    },

    createComment: async (req, res) => {
        const postId = parseInt(req.params.id!, 10);
        const userId = res.locals.userId;
        const { body } = req.body;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        if (!body) return res.status(400).json({ message: "Body is required" });

        const result = await postService.createComment(postId, userId, body);

        if (result.status === 'success' && result.data) {
            return res.status(result.statusCode).json(result.data);
        }

        return res.status(result.statusCode).json({ 
            message: result.message || "Comment creation failed" 
        });
    },

    likePost: async (req, res) => {
        const postId = parseInt(req.params.id!, 10);
        const userId = res.locals.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        try {
            await postRepository.addLike(postId, userId);
            return res.status(201).json({ message: "Post liked" });
        } catch (error) {
            return res.status(500).json({ message: "Error liking post" });
        }
    },

    unlikePost: async (req, res) => {
        const postId = parseInt(req.params.id!, 10);
        const userId = res.locals.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        try {
            await postRepository.removeLike(postId, userId);
            return res.json({ message: "Unliked" });
        } catch (error) {
            return res.status(500).json({ message: "Error unliking post" });
        }
    }
};

export default postController;