import { postRepository } from "./post.repository.ts";
import type { Post, Comment, PostLike } from "../generated/prisma/index.js";
import type { errorMessage } from "./post.types.ts";


export type ServiceResponse<T> = {
    status: 'success' | 'error';
    statusCode: number;
    data?: T;
    message?: string;
};

export const postService = {
    getAllPosts: async (skip?: number, take?: number): Promise<ServiceResponse<Post[]>> => {
        try {
            const posts = await postRepository.getAll(skip, take);
            return { status: 'success', statusCode: 200, data: posts };
        } catch (error) {
            return { status: 'error', statusCode: 500, message: "Не вдалося завантажити пости" };
        }
    },

    getPostById: async (id: number, currentUserId?: number, includes: string[] = []): Promise<ServiceResponse<any>> => {
        try {
            const post = await postRepository.getById(id, includes);
            if (!post) return { status: 'error', statusCode: 404, message: "Пост не знайдено" };
            const postData = {
                ...post,
                isLiked: false
            };
            if (currentUserId && post.likedBy) {
                postData.isLiked = post.likedBy.some((like: any) => like.userId === currentUserId);
            }
            return { status: 'success', statusCode: 200, data: postData };
        } catch (error) {
            return { status: 'error', statusCode: 500, message: "Помилка сервера" };
        }
    },

    createComment: async (postId: number, userId: number, body: string): Promise<ServiceResponse<Comment>> => {
        try {
            const comment = await postRepository.addComment(postId, userId, body);
            return { status: 'success', statusCode: 201, data: comment };
        } catch (error) {
            return { status: 'error', statusCode: 500, message: "Помилка при створенні коментаря" };
        }
    },

    likePost: async (postId: number, userId: number): Promise<ServiceResponse<{ message: string }>> => {
        try {
            await postRepository.addLike(postId, userId);
            return { status: 'success', statusCode: 201, data: { message: "Liked" } };
        } catch (error) {
            return { status: 'error', statusCode: 400, message: "Помилка: можливо, лайк вже існує" };
        }
    },

    unlikePost: async (postId: number, userId: number): Promise<ServiceResponse<{ message: string }>> => {
        try {
            await postRepository.removeLike(postId, userId);
            return { status: 'success', statusCode: 200, data: { message: "Unliked" } };
        } catch (error) {
            return { status: 'error', statusCode: 404, message: "Лайк не знайдено" };
        }
    }
};