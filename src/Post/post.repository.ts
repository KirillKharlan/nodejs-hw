import { client } from "../client/client.ts";
import type { IRepositoryContract } from "./post.types.ts";
import type { Prisma, Post, Comment, PostLike } from "../generated/prisma/index.js";

export const postRepository: IRepositoryContract = {
    getAll: async (skip, take) => {
        return await client.post.findMany({ 
            skip, 
            take,
            include: {
                tags: true,
                _count: {
                    select: { likedBy: true, comments: true }
                }
            }
        });
    },

    getById: async (id, includes = []) => {
        return await client.post.findUnique({
            where: { id },
            include: {
                tags: true,
                likedBy: includes.includes('likedBy'),
                comments: includes.includes('comments') ? {
                    include: { author: true },
                    orderBy: { createdAt: 'desc' }
                } : false,
                _count: {
                    select: { likedBy: true, comments: true }
                }
            }
        });
    },

    create: async (data) => {
        return await client.post.create({ 
            data,
            include: { tags: true }
        });
    },

    update: async (id, data) => {
        return await client.post.update({ 
            where: { id }, 
            data,
            include: { tags: true }
        });
    },

    delete: async (id) => await client.post.delete({ where: { id } }),

    addComment: async (postId: number, userId: number, body: string) => {
        return await client.comment.create({
            data: {
                body,
                post: { connect: { id: postId } },
                author: { connect: { id: userId } }
            },
            include: { author: true }
        });
    },

    addLike: async (postId: number, userId: number): Promise<PostLike> => {
        return await client.postLike.upsert({
            where: {
                userId_postId: { userId, postId }
            },
            create: { postId, userId },
            update: {} 
        });
    },

    removeLike: async (postId: number, userId: number) => {
        return await client.postLike.delete({
            where: {
                userId_postId: { userId, postId }
            }
        });
    }
};