import type { Request, Response } from 'express'
import postsService from "./post.service.ts";


const postController = {

    // беремо усі пости, якщо є парамети skip / take враховуємо їх
    getAllPosts: (req:Request, res:Response) => {
        const skipC = req.query.skip;
        const takeC = req.query.take;
        const filter = req.query.filter;

        const responseData = postsService.getAllPosts(skipC, takeC); 

        if (responseData.status === 'error') {
            res.status(400).json({ message: responseData.message });
            return
        }
        res.status(200).json(responseData.data);
    },

    // беремо пости по Id
    getPostsById: (req:Request, res:Response) => {
        const postIdParams = req.params.id;
        if (postIdParams === undefined) {
            res.status(400).send({ message:"idParams undefined"});
            return;
        }
        const postId = parseInt(postIdParams);
        const responseData = postsService.getPostsById(postId)
        if (responseData.status === 'error') {
            res.status(404).json({ message: responseData.message });
            return
        }
        res.status(200).json(responseData.data); 
    },

    // створюємо пости
    createPost: async (req:Request, res:Response) => {
        const data = req.body;
        const responseData = await postsService.createPost(data);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(responseData.statusCode).json(responseData.data);
    }


}

export default postController