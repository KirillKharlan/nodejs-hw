import type { Request, Response } from 'express'
import type { 
    Post as PrismaPost, 
    Comment, 
    PostLike, 
    Prisma 
} from '../generated/prisma/index.js'

export type Post = Prisma.PostGetPayload<{}>

export type CommentWithAuthor = Prisma.CommentGetPayload<{
    include: { author: true }
}>;

export type PostWithTags = Prisma.PostGetPayload<{
    include: { tags: true }
}>

export type PostFull = Prisma.PostGetPayload<{
    include: { 
        tags: true, 
        comments: { include: { author: true } },
        likedBy: true 
    }
}>;

export type CreatePostChecked = Prisma.PostCreateInput
export type UpdatePostChecked = Prisma.PostUpdateInput

export type LikeAction = 'like' | 'unlike';

export type PostWithMeta = Post & {
    isLiked?: boolean;
    _count?: {
        likedBy: number;
        comments: number;
    };
};

export interface SuccessResponse<T> {
    status: 'success';
    statusCode: number;
    data: T;
    message?: string;
}
export interface ErrorResponse {
    status: 'error';
    statusCode: number;
    message: string;
    data?: never;
}
export type ServiceResponse<T> = SuccessResponse<T> | ErrorResponse;
export type errorMessage = { message: string };

export type CreatePostData = Prisma.PostUncheckedCreateInput & {
    name: string;
    postDescription: string;
    img: string;
    createdById: number;
};

export interface IRepositoryContract {
    getAll: (skip?: number, take?: number) => Promise<PrismaPost[]>;
    getById: (id: number, includes?: string[]) => Promise<any | null>;
    create: (data: Prisma.PostUncheckedCreateInput) => Promise<PrismaPost>;
    update: (id: number, data: Prisma.PostUpdateInput) => Promise<PrismaPost>;
    delete: (id: number) => Promise<PrismaPost>;
    addComment: (postId: number, userId: number, body: string) => Promise<Comment>;
    addLike: (postId: number, userId: number) => Promise<PostLike>;
    removeLike: (postId: number, userId: number) => Promise<PostLike>;
}

export interface IPostController {
    getAllPosts: (
        req: Request<{}, unknown, {}, { skip?: string; take?: string }>,
        res: Response<Post[] | errorMessage>
    ) => Promise<Response | void> | void;

    getPostsById: (
        req: Request<{ id: string }, any, unknown, { include?: string | string[] }>,
        res: Response<any | errorMessage>
    ) => Promise<Response | void> | void;

    createPost: (
        req: Request<{}, Post | errorMessage, Prisma.PostUncheckedCreateInput, {}>,
        res: Response<Post | errorMessage>
    ) => Promise<Response | void>;

    updatePostById: (
        req: Request<{ id: string }, Post | errorMessage, Prisma.PostUpdateInput, {}>,
        res: Response<Post | errorMessage>
    ) => Promise<Response | void> | void;

    deletePostById: (
        req: Request<{ id: string }, Post | errorMessage, unknown, {}>,
        res: Response<Post | errorMessage>
    ) => Promise<Response | void>;
    createComment: (
        req: Request<{ id: string }, Comment | errorMessage, { body: string }>,
        res: Response<Comment | errorMessage>
    ) => Promise<Response | void>;

    likePost: (
        req: Request<{ id: string; userId: string }>,
        res: Response<{ message: string } | errorMessage>
    ) => Promise<Response | void>;

    unlikePost: (
        req: Request<{ id: string; userId: string }>,
        res: Response<{ message: string } | errorMessage>
    ) => Promise<Response | void>;
}