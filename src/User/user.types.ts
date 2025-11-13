import { Prisma } from "../generated/prisma/index.js";
import type { Request, Response } from "express";


export type User = Prisma.UserGetPayload<{}>
export type RegisterInput = Prisma.UserUncheckedCreateInput
export type LoginInput = Pick<User, 'password' | 'email'>


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


export interface IUserRepositoryContract {
    register: (
        data: RegisterInput
    ) => Promise<User>
    findByEmail: (
        email:string
    ) => Promise<User | null>
}
export interface IUserController {
    registerUser: (
        req: Request<{}, User | errorMessage, RegisterInput>,
        res: Response<User | errorMessage>
    ) => void;
    loginUser: (
        req: Request<{}, { message: string } | errorMessage, LoginInput>,
        res: Response<{ message: string } | errorMessage >
    ) => void
}