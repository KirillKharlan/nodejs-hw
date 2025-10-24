import fs from 'fs'
import fsPromises from "fs/promises"
import path from 'path';
import type{ Post, UpdatePostChecked, CreatePostChecked, ServiceResponse } from "./post.types.ts";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../../posts.json") 
const posts:Post[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

const postService = {
    getAllPosts: (skipC?:string, takeC?:string):ServiceResponse<Post[]> => {
        let skip = 0; 
        let take = undefined;

        const effectiveSkipC = Array.isArray(skipC) ? skipC[0] : skipC;
        const effectiveTakeC = Array.isArray(takeC) ? takeC[0] : takeC;

        if (effectiveSkipC !== undefined && skipC !=='') {

            const parsedSkip = parseInt(effectiveSkipC);
            
            if (isNaN(parsedSkip) || parsedSkip < 0) {
                return {
                    status: "error",                    
                    statusCode: 400,
                    message: "Параметр 'skip' повинен бути невід'ємним числом." 
                };
            }
            skip = parsedSkip;
        }

        if (effectiveTakeC !== undefined && takeC !=='') {

            const parsedTake = parseInt(effectiveTakeC);
            
            if (isNaN(parsedTake) || parsedTake < 0) {
                return {
                    status:"error",
                    statusCode: 400,
                    message:"Параметр 'take' повинен бути невід'ємним числом."
                };
            }
            take = parsedTake;
        }

        let resultPosts = posts.slice(skip);

        if (take !== undefined) {
            resultPosts = resultPosts.slice(0, take);
        }

        return {
            status: "success",
            statusCode: 200,
            data: resultPosts
        };

    },
    
    getPostsById: (postId:number):ServiceResponse<Post> => {
    const post = posts.find(p => p.id === postId); 
        if (!post) {
            return {
                status: "error",
                statusCode: 404,
                message: `Пост з ID ${postId} не знайдено.`
            };
        } 
        return {
            status: "success",
            statusCode: 200,
            data: post,
        };
    },

    createPost: async (data:CreatePostChecked):Promise<ServiceResponse<Post>> => {
        if (!data.name || !data.description || !data.img) {
            return {
                status: "error",
                statusCode: 422,
                message: "Необхідні поля 'name', 'postDescription' та 'img' не заповнені."
            };
        }
        const lastPost = posts[posts.length - 1];
        const newId = lastPost ? lastPost.id + 1 : 1; 
        const newPost = { ...data, id: newId };
        try {
            posts.push(newPost);
            await fsPromises.writeFile(jsonPath, JSON.stringify(posts, null, 2));
            
            return {
                status: "success",
                data: newPost,
                statusCode: 201
            };
        } catch (error) {
            console.error("Помилка запису файла post.service.js:", error);
            return {
                status: "error",
                statusCode: 500,
                message: "Внутрішня помилка сервера при збереженні поста."
            };
        }
    },
    // Оновлюємо інформацію про пост
    updatePost: (postId: number, data: UpdatePostChecked): ServiceResponse<Post> => {
        const postIndex = posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) {
            return { status: 'error', statusCode: 404, message: `Пост з ID ${postId} не знайдено.` };
        }
        if (Object.keys(data).length === 0) {
            return { status: 'error', statusCode: 400, message: "Тіло запиту не може бути пустим." };
        }

        const updatedPost = { ...posts[postIndex], ...data }as Post;
        
        return { status: 'success', statusCode: 200, data: updatedPost };
    },
    // Видаляємо пост
    deletePost: async (postId: number): Promise<ServiceResponse<Post>> => {
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) {
            return { 
                status: 'error', 
                statusCode: 404, 
                message: `Пост з ID ${postId} не знайдено.` 
            };
        }
        const [deletedPost] = posts.splice(postIndex, 1) as [Post];
        try {
            await fsPromises.writeFile(jsonPath, JSON.stringify(posts, null, 2));
            return { 
                status: 'success', 
                statusCode: 200, 
                data: deletedPost 
            };
        } catch (error) {
            console.error("Помилка запису файла post.service.js після видалення:", error);
            return {
                status: "error",
                statusCode: 500,
                message: "Внутрішня помилка сервера при видаленні поста."
            };
        }
    }  
} 

export default postService