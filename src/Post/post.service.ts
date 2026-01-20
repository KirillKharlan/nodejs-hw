import { postRepository } from "./post.repository.ts";
import type { Post, Comment } from "../generated/prisma/index.js";

export type ServiceResponse<T> = {
    status: 'success' | 'error';
    statusCode: number;
    data?: T;
    message?: string;
};

export const postService = {
    getAllPosts: async (skip?: number, take?: number, currentUserId?: number): Promise<ServiceResponse<any[]>> => {
        try {
            const posts = await postRepository.getAll(skip, take);
            const data = posts.map(post => ({
                ...post,
                isLiked: currentUserId ? (post as any).likedBy?.some((l: any) => l.userId === currentUserId) : false
            }));
            return { status: 'success', statusCode: 200, data };
        } catch (error) {
            return { status: 'error', statusCode: 500, message: "Не вдалося завантажити пости" };
        }
    },

    getPostById: async (id: number, currentUserId?: number, includes: string[] = []): Promise<ServiceResponse<any>> => {
        try {
            const post = await postRepository.getById(id, includes);
            if (!post) return { status: 'error', statusCode: 404, message: "Пост не знайдено" };
            
            const isLiked = currentUserId && post.likedBy 
                ? post.likedBy.some((like: any) => like.userId === currentUserId) 
                : false;

            return { 
                status: 'success', 
                statusCode: 200, 
                data: { ...post, isLiked } 
            };
        } catch (error) {
            return { status: 'error', statusCode: 500, message: "Помилка сервера" };
        }
    },

    createPost: async (data: any): Promise<ServiceResponse<Post>> => {
        try {
            const post = await postRepository.create(data);
            return { status: 'success', statusCode: 201, data: post };
        } catch (error) {
            return { status: 'error', statusCode: 400, message: "Помилка при створенні поста" };
        }
    },

    createComment: async (postId: number, userId: number, body: string): Promise<ServiceResponse<Comment>> => {
        try {
            const comment = await postRepository.addComment(postId, userId, body);
            return { status: 'success', statusCode: 201, data: comment };
        } catch (error) {
            return { status: 'error', statusCode: 500, message: "Не вдалося додати коментар" };
        }
    }
};