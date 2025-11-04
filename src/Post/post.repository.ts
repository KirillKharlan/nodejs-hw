import { client } from "../client/client.ts"
import { Prisma } from "../generated/prisma/index.js";
import type { Post, CreatePost, UpdatePost, IRepositoryContract } from './post.types.ts';

export const postRepository: IRepositoryContract = {
    getAll: async(skip?: number, take?: number): Promise<Post[]> => {
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
        
    },
    getById: async(id: number): Promise<Post | null> => {
        const post = await client.post.findUnique({
            where: { id },
            include: { 
                tags: true 
            }
        });
        return post as Post | null;
    },
    create: async(data: CreatePost): Promise<Post> => {
        const newPost = await client.post.create({
            data: data,
            include: { 
                tags: true 
            }
        });
        return newPost as Post;
    },
    update: async(id: number, data: UpdatePost): Promise<Post> => {
        const updatedPost = await client.post.update({
            where: { id },
            data: data,
            include: { 
                tags: true 
            }
        });
        return updatedPost as Post;
    },
    delete: async(id: number): Promise<Post> =>{
        const deletedPost = await client.post.delete({
            where: { id },
            include: { 
                tags: true 
            }
        });
        return deletedPost as Post;
    }
    
}

export default postRepository