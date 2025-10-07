const path = require('path')
const fs = require('fs')
const fsPromises = require("fs/promises")


const jsonPath = path.join(__dirname, "../../posts.json") 
const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

const postService = {
    getAllPosts: (skipC, takeC) => {
        let skip = 0; 
        let take = undefined;
        if (skipC !== undefined && skipC !=='') {

            const parsedSkip = parseInt(skipC);
            
            if (isNaN(parsedSkip) || parsedSkip < 0) {
                return {
                    status: "error",
                    message: "Параметр 'skip' повинен бути невід'ємним числом." 
                };
            }
            skip = parsedSkip;
        }

        if (takeC !== undefined && takeC !=='') {

            const parsedTake = parseInt(takeC);
            
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
    
    getPostsById: (postId) => {
    const post = posts.find(p => p.id === postId); 
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

    createPost: async (data) => {
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
            console.error("Ошибка записи файла post.service.js:", error);
            return {
                status: "error",
                statusCode: 500,
                message: "Внутренняя ошибка сервера при сохранении поста."
            };
        }
    }


}

module.exports = postService