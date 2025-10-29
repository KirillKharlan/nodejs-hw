// import { client } from "../client/client.ts"
// import { Prisma } from "../generated/prisma/index.js";
// import { CreatePost, IRepositoryContract, Post } from "./post.types.ts";

import { client } from "../client/client.ts"
import type { Post, CreatePost, UpdatePost, IRepositoryContract } from './post.types.ts';

class PostRepository implements IRepositoryContract {
    [x: string]: any;
    async getAll(skip?: number, take?: number): Promise<Post[]> {
        const args: { skip?: number, take?: number, include: any }={
            include: {
                tags: true
            }
        };
        if (skip !== undefined){
            args.skip = skip;
        }
        if (take !== undefined){
            args.take = take;
        }
        const posts = await client.post.findMany(args);
        return posts as Post[];
    }
    async getById(id: number): Promise<Post | null> {
        const post = await client.post.findUnique({
            where: { id },
            include: { 
                tags: true 
            }
        });
        return post as Post | null;
    }
    async create(data: CreatePost): Promise<Post> {
        const newPost = await client.post.create({
            data: data,
            include: { 
                tags: true 
            }
        });
        return newPost as Post;
    }
    async update(id: number, data: UpdatePost): Promise<Post> {
        const updatedPost = await client.post.update({
            where: { id },
            data: data,
            include: { 
                tags: true 
            }
        });
        return updatedPost as Post;
    }
    async delete(id: number): Promise<Post> {
        const deletedPost = await client.post.delete({
            where: { id },
            include: { 
                tags: true 
            }
        });
        return deletedPost as Post;
    }
    
}


export const postRepository = new PostRepository();
