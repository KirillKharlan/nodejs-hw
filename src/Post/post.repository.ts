import { client } from "../client/client.ts";
import type { IRepositoryContract } from "./post.types.ts";
import type { Prisma, Post, Comment, PostLike } from "../generated/prisma/index.js";

export const postRepository: IRepositoryContract = {
    getAll: async (skip, take) => await client.post.findMany({ skip, take }),

    getById: async (id, includes = []) => {
        return await client.post.findUnique({
            where: { id },
            include: {
                comments: includes.includes('comments'),
                likedBy: includes.includes('likedBy'),
            }
        });
    },

    create: async (data) => await client.post.create({ data }),

    update: async (id, data) => await client.post.update({ where: { id }, data }),

    delete: async (id) => await client.post.delete({ where: { id } }),

    addComment: async (postId: number, userId: number, body: string) => {
        return await client.comment.create({
            data: {
                body: body,
                post: {
                    connect: { id: postId }
                },
                author: {
                    connect: { id: userId }
                }
            },
            include: {
                author: true
            }
        });
    },



    addLike: async (postId: number, userId: number): Promise<PostLike> => {
        const existingLike = await client.postLike.findUnique({
            where: {
                userId_postId: { userId, postId }
            }
        });
        if (existingLike) {
            return existingLike;
        }
        return await client.postLike.create({
            data: { postId, userId }
        });
    },

    removeLike: async (postId, userId) => {
        return await client.postLike.delete({
            where: { userId_postId: { userId, postId } }
        });
    }
};