import { Prisma } from "../generated/prisma/index.js";
import type { Request, Response } from "express";
export type UserWithoutPassword = Prisma.UserGetPayload<{
    omit: {
        password: true
    }
}>
export type IResponse = {
    token: string
}
export type IStatus<T> = {
    status: string,
    message?: string,
    data: T
}
export type CreateUser = Prisma.UserUncheckedCreateInput
export interface AuthenticatedUser {
	id: number;
}

export interface IControllerContract {
    register: (
        req: Request<object, IResponse | string, CreateUser>,
        res: Response<IResponse | string>
    ) => Promise<void>,
    login: (
        req: Request<object, IResponse | string, CreateUser>,
        res: Response<IResponse | string>
    ) => Promise<void>,
    me: (
        req: Request<object, UserWithoutPassword | string, object, object>,
        res: Response<UserWithoutPassword | string>
    ) => Promise<void>
}
export interface IServiceContract {
    createUser: (data: CreateUser) => Promise<IResponse | string>
    findUserByEmail: (data: CreateUser) => Promise<IResponse | string>
    me: (id: number) => Promise<UserWithoutPassword | string>
}
export interface IRepositoryContract {
    createUser: (data: CreateUser) => Promise<CreateUser | null>
    findUserByEmail: (email: string) => Promise<CreateUser | null>
    findByIdWithoutPassword: (id: number) => Promise<UserWithoutPassword | null>
}