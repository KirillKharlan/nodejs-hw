import { postRepository } from './post.repository.ts'; 
import type { 
    Post, 
    UpdatePostChecked, 
    CreatePostChecked, 
    ServiceResponse, 
    PostWithTags, 
    SimplePost
} from './post.types.ts'; 

type PostServiceResponse<T> = Promise<ServiceResponse<T>>;


export const postService = {
    getAllPosts: async (skipC?: string, takeC?: string): PostServiceResponse<PostWithTags[]> => {
        let skip: number | undefined = undefined; 
        let take: number | undefined = undefined;
    if (skipC !== undefined && skipC !=='') {
            const parsedSkip = parseInt(skipC);
            if (isNaN(parsedSkip) && parsedSkip < 0) {
                return { status: "error", statusCode: 400, message: "Параметр 'skip' повинен бути невід'ємним числом." };
            }
            skip = parsedSkip;
        }
        if (takeC !== undefined && takeC !=='') {
            const parsedTake = parseInt(takeC);
            if (isNaN(parsedTake) && parsedTake < 0) {
                return { status: "error", statusCode: 400, message: "Параметр 'take' повинен бути невід'ємним числом." };
            }
            take = parsedTake;
        }
        try {
            const resultPosts = await postRepository.getAll(skip, take);
            return {
                status: "success",
                statusCode: 200,
                data: resultPosts as PostWithTags[]
            };
        } catch (error) {
            console.error("Помилка при отриманні постів:", error);
            return {
                status: "error",
                statusCode: 500,
                message: "Внутрішня помилка сервера при отриманні постів."
            };
        }
    },
    getPostsById: async (postId: number): PostServiceResponse<Post> => {
        try {
            const post = await postRepository.getById(postId);

            if (!post) {
                return {
                    status: "error",
                    statusCode: 404,
                    message: `Пост з ID ${postId} не знайдено.`,
                };
            } 
            return {
                status: "success",
                statusCode: 200,
                data: post,
            };
        } catch (error) {
             console.error("Помилка при отриманні поста:", error);
             return { status: "error", statusCode: 500, message: "Внутрішня помилка сервера." };
        }
    },

    createPost: async (data: CreatePostChecked): PostServiceResponse<Post> => {
        if (!data.name && !data.postDescription && !data.img) {
             return {
                status: "error",
                statusCode: 422,
                message: "Необхідні поля 'name', 'postDescription' та 'img' не заповнені."
            };
        }

        try {
            const newPost = await postRepository.create(data);
            
            return {
                status: "success",
                data: newPost,
                statusCode: 201
            };
        } catch (error: any) {
            console.error("Помилка при створенні поста:", error);
            if (error.code === 'P2002') {
                return { status: "error", statusCode: 409, message: "Пост з таким ім'ям вже існує." };
            }
            return {
                status: "error",
                statusCode: 500,
                message: "Внутрішня помилка сервера при збереженні поста."
            };
        }
    },
    updatePost: async (postId: number, data: UpdatePostChecked): PostServiceResponse<Post> => {
        if (Object.keys(data).length === 0) {
            return { status: 'error', statusCode: 400, message: "Тіло запиту не може бути пустим." };
        }
        try {
            const updatedPost = await postRepository.update(postId, data);
            return { status: 'success', statusCode: 200, data: updatedPost };
        } catch (error: any) {
            if (error.code === 'P2025') {
                 return { status: 'error', statusCode: 404, message: `Пост з ID ${postId} не знайдено.`};
            }
            console.error("Помилка при оновленні поста:", error);
            return { status: 'error', statusCode: 500, message: "Внутрішня помилка сервера." };
        }
    },
    deletePost: async (postId: number): PostServiceResponse<Post> => {
        try {
            const deletedPost = await postRepository.delete(postId);
            return { 
                status: 'success', 
                statusCode: 200, 
                data: deletedPost 
            };
        } catch (error: any) {
            if (error.code === 'P2025') {
                 return { status: 'error', statusCode: 404, message: `Пост з ID ${postId} не знайдено.` };
            }
            console.error("Помилка при видаленні поста:", error);
            return {
                status: "error",
                statusCode: 500,
                message: "Внутрішня помилка сервера при видаленні поста."
            };
        }
    }
}

export default postService;