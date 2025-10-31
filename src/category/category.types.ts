import type { Request, Response } from 'express'
import { Prisma } from '../generated/prisma/index.js'

export type Category = Prisma.CategoryGetPayload<{}>
export type CategoryWithPosts = Prisma.CategoryGetPayload<{
    include: {
        posts: true
    }
}>
export type CreateCategory = Prisma.CategoryUncheckedCreateInput
export type UpdateCategory = Prisma.CategoryUncheckedUpdateInput


export interface ICategoryRepositoryContract {
    getAll: (skip?: number, take?: number) => Promise<Category[]>
    getById: (id: number) => Promise<Category | null>
    create: (data: CreateCategory) => Promise<Category>
}



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


export interface ICategoryController {
    getAllCategories: (
        req: Request<{}, unknown, {}, { skip?: string, take?: string }>, 
        res: Response<Category[] | errorMessage>
    ) => void;
    getCategoryById: (
        req: Request<{ id: string }, Category | errorMessage, unknown>, 
        res: Response<Category | errorMessage>
    ) => void;
    createCategory: (
        req: Request<{}, Category | errorMessage, CreateCategory, unknown>, 
        res: Response<Category | errorMessage>
    ) => void;
}