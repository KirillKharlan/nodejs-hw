import fs from 'fs'
import fsPromises from "fs/promises"
import path from 'path';
import type{ IPost, updatePostData } from "./post.types.ts";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../../posts.json") 
const posts:IPost[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

const postService = {
    getAllPosts: (skipC:string, takeC:string) => {
        let skip = 0; 
        let take = undefined;

        const effectiveSkipC = Array.isArray(skipC) ? skipC[0] : skipC;
        const effectiveTakeC = Array.isArray(takeC) ? takeC[0] : takeC;

        if (effectiveSkipC !== undefined && skipC !=='') {

            const parsedSkip = parseInt(effectiveSkipC);
            
            if (isNaN(parsedSkip) || parsedSkip < 0) {
                return {
                    status: "error",
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
            data: resultPosts
        };

    },
    
    getPostsById: (postId:number) => {
    const post = posts.find((p: { id: number }) => p.id === postId); 
        if (post) {
            return {
                status: "success",
                data: post
            };
        } 
        return {
            status: "error",
            message: `Пост з ID ${postId} не знайдено.`,
        };
    },

    createPost: async (data:any) => {
        if (!data.name || !data.postDescription || !data.img) {
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
    updatePost: (postId: number, data: updatePostData): IPost => {
        if (Object.keys(data).length === 0) {
            throw new Error(JSON.stringify({ statusCode: 400, message: "Тіло запиту не повинно бути пустим для PATCH-запиту." }));
        }
        // перевіряємо чи вказано name та чи його тип string
        if (data.name !== undefined && typeof data.name !== 'string') {
            throw new Error(JSON.stringify({ statusCode: 400, message: "Поле 'name' повинно бути строкою." }));
        }
        //перевіряємо чи вказано description та чи його тип string
        if (data.description !== undefined && typeof data.description !== 'string') {
            throw new Error(JSON.stringify({ statusCode: 400, message: "Поле 'description' повинно бути строкою." }));
        }
        //перевіряємо чи вказано likes та чи його тип number
        if (data.likes !== undefined && typeof data.likes !== 'number') {
            throw new Error(JSON.stringify({ statusCode: 400, message: "Поле 'likes' повинно бути числом." }));
        }
        // перевіряємо чи вказано img та чи його тип string
        if (data.img !== undefined && typeof data.img !== 'string') {
            throw new Error(JSON.stringify({ statusCode: 400, message: "Поле 'img' повинно бути строкою." }));
        }

        const updatedPost: IPost = {
            id: postId,
            name: data.name || "Старе ім'я",
            description: data.description || "Старий опис",
            img: data.img || "Старе зображення",
            likes: data.likes || 0
        };

        return updatedPost;
    }


}

export default postService