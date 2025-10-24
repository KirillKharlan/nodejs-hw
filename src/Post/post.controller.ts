import type { Request, Response} from 'express'
import postsService from "./post.service.ts";
import type{ UpdatePostChecked, PostController, Post} from "./post.types.ts";


const postController:PostController = {
    // беремо усі пости, якщо є парамети skip / take враховуємо їх
    getAllPosts: (req, res) => {
        const skipC = req.query.skip as string | undefined;
        const takeC = req.query.take as string | undefined;

        const responseData = postsService.getAllPosts(skipC, takeC);

        if (responseData.status === 'error') {
            res.status(400).json({ message: responseData.message });
            return;
        }
        res.status(200).json(responseData.data);
    },

    // беремо пости по Id
    getPostsById: (req, res) => {
        const postIdParams = req.params.id;
        if (postIdParams === undefined) {
            res.status(400).send({ message: "idParams undefined" });
            return;
        }
        const postId = parseInt(postIdParams);
        const responseData = postsService.getPostsById(postId);
        if (responseData.status === 'error') {
            res.status(404).json({ message: responseData.message });
            return;
        }
        res.status(200).json(responseData.data);
    },

    // створюємо пости
    createPost: async (req, res) => {
        const data = req.body;
        const responseData = await postsService.createPost(data);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(responseData.statusCode).json(responseData.data);
    },

    // оновлення поста по id
    updatePostById: (req, res) => {
        const postIdParams = req.params.id;
        if (!postIdParams === undefined) {
            res.status(400).send({ message: "id поста не вказано" });
            return;
        }
        const postId = parseInt(postIdParams);
        if (isNaN(postId)) {
            res.status(400).json({ message: "id поста повинен бути числом" });
            return;
        }

        const data = req.body as UpdatePostChecked;
        const responseData = postsService.updatePost(postId, data);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(responseData.statusCode).json(responseData.data);
    },

    //видалення поста по id
    deletePostById: async (req, res) => {
        const postIdParams = req.params.id;
        if (postIdParams === undefined) {
            res.status(400).send({ message: "id поста не вказано" });
            return;
        }
        const postId = parseInt(postIdParams);
        if (isNaN(postId)) {
            res.status(400).json({ message: "id поста повинен бути числом" });
            return;
        }
        const responseData = await postsService.deletePost(postId);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(responseData.statusCode).json(responseData.data);
    },
}




export default postController