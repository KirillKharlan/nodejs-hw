import type { Request, Response } from 'express'
import { Prisma } from '../generated/prisma/index.js' 

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

export type Tag = Prisma.TagGetPayload<{}>
export type TagWithPosts = Prisma.TagGetPayload<{
    include: {
        posts: true
    }
}>


export interface ITagController {
    getAllTags: (
        req: Request<{}, unknown, {}, { skip?: string, take?: string }>, 
        res: Response<Tag[] | errorMessage>
    ) => void;
    getByName: ( 
        req: Request<{ name: string }, Tag | errorMessage, unknown>, 
        res: Response<Tag | errorMessage>
    ) => void;
}

export interface ITagRepositoryContract {
    getAll: (
        skip?: number, 
        take?: number
    ) => Promise<Tag[]>
    getByName: (
        name: string
    ) => Promise<Tag | null>
}