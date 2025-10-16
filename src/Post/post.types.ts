import type { Request, Response} from 'express'


export interface IPost {
    id: number,
    name: string,
    description: string,
    img: string,
    likes: number
}
export type createPostData = Omit<IPost,"id"> & {id?:number}
export type updatePostData = Partial<Omit<IPost,"id">>

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

type errorMessage = { message: string };

export interface IPostController {
    getAllPosts: (
        req: Request<{}, unknown, {}, {skip?: string, take?: string }>, 
        res: Response<IPost[] | errorMessage>
    ) => void;
    getPostsById: (
        req: Request<{ id: string }, IPost | Partial<IPost> | errorMessage, { fields?: string }>, 
        res: Response<IPost | Partial<IPost> | errorMessage>
    ) => void;

    createPost: (
        req: Request<{}, IPost | errorMessage, createPostData, {}>, 
        res: Response<IPost | errorMessage>
    ) => Promise<void>;

    updatePostById: (
        req: Request<{ id: string }, IPost | errorMessage, updatePostData, {}>, 
        res: Response<IPost | errorMessage>
    ) => void;

}

export default IPost