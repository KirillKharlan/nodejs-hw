import postsService from "./post.service.ts";
import type{ UpdatePostChecked, IPostController} from "./post.types.ts";


const postController:IPostController = {
    // беремо усі пости, якщо є парамети skip / take враховуємо їх
    getAllPosts: async (req, res) => {
        const skipC = req.query.skip as string | undefined;
        const takeC = req.query.take as string | undefined;

        const responseData = await postsService.getAllPosts(skipC, takeC);

        if (responseData.status === 'error') {
            res.status(400).json({ message: responseData.message });
            return;
        }
        res.status(200).json(responseData.data);
    },

    // беремо пости по Id
    getPostsById: async (req, res) => {
        const postIdParams = req.params.id;
        if (postIdParams === undefined) {
            res.status(400).send({ message: "idParams undefined" });
            return;
        }
        const postId = parseInt(postIdParams);
        const responseData = await postsService.getPostsById(postId);
        if (responseData.status === 'error') {
            res.status(404).json({ message: responseData.message });
            return;
        }
        res.status(200).json(responseData.data);
    },

    // створюємо пости
    createPost: async (req, res) => {
        try {
            const userId = res.locals.userId;
            const postInputData = {
                ...req.body,
                createdBy: {
                    connect: {
                        id: userId
                    }
                }
                
            }
            const result = await postsService.createPost(postInputData);
            if (result.status === 'error') {
                res.status(result.statusCode).json({ message: result.message });
                return
            }

            res.status(result.statusCode).json(result.data);

        } catch (error) {
            
        }
    },

    // оновлення поста по id
    updatePostById: async (req, res) => {
        const userId = res.locals.userId;
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
        const responseData = await postsService.updatePost(postId, data, userId);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(responseData.statusCode).json(responseData.data);
    },

    //видалення поста по id
    deletePostById: async (req, res) => {
        const userId = res.locals.userId;
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
        const responseData = await postsService.deletePost(postId, userId);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(responseData.statusCode).json(responseData.data);
    },
}


export default postController