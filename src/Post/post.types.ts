import type { Request, Response} from 'express'
import { Prisma } from '../generated/prisma/index.js'

// export interface IPost {
//     id: number,
//     name: string,
//     description: string,
//     img: string,
//     likes: number
// }
// export type createPostData = Omit<IPost,"id"> & {id?:number}
// export type updatePostData = Partial<Omit<IPost,"id">>


export type Post = Prisma.PostGetPayload<{}>
export type PostWithTags = Prisma.PostGetPayload<{
    include: {
        tags:true
    }
}>
export type CreatePost = Prisma.PostUncheckedCreateInput
export type CreatePostChecked = Prisma.PostCreateInput
export type UpdatePost = Prisma.PostUncheckedUpdateInput
export type UpdatePostChecked = Prisma.PostUpdateInput

export type SimplePost = Omit<Post, 'tags'>;




interface SuccessResponse<T> {
    status: 'success';
    statusCode: number;
    data: T;
    message?: string;
}

interface ErrorResponse {
    status: 'error';
    statusCode: number;
    message: string;
    data?: never;
}

export type ServiceResponse<T> = SuccessResponse<T> | ErrorResponse;

export type errorMessage = { message: string };

export interface IPostController {
    getAllPosts: (
        req: Request<{}, unknown, {}, {skip?: string, take?: string }>, 
        res: Response<SimplePost[] | errorMessage>
    ) => void;
    getPostsById: (
        req: Request<{ id: string }, SimplePost | errorMessage, { fields?: string }>, 
        res: Response<SimplePost | errorMessage>
    ) => void;

    createPost: (
        req: Request<{}, SimplePost | errorMessage, CreatePostChecked, {}>, 
        res: Response<SimplePost | errorMessage>
    ) => Promise<void>;

    updatePostById: (
        req: Request<{ id: string }, SimplePost | errorMessage, UpdatePostChecked, {}>, 
        res: Response<SimplePost | errorMessage>
    ) => void;

    deletePostById: (
        req: Request<{ id: string }, SimplePost | errorMessage, unknown, {}>, 
        res: Response<SimplePost | errorMessage>
    ) => Promise<void>;
}


export interface IRepositoryContract {
    getAll: (skip?: number, take?: number
    ) => Promise<Post[]>
	getById: (
        id: number
    ) => Promise<Post | null>
	create: (
        data: CreatePost
    ) => Promise<Post | null>
	update: (
        id: number, data: UpdatePost
    ) => Promise<Post | null>
}

