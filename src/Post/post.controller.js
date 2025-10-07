const postsService = require("./post.service")

const postController = {

    // беремо усі пости, якщо є парамети skip / take враховуємо їх
    getAllPosts: (req, res) => {
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
    getPostsById: (req, res) => {
        const postId = parseInt(req.params.id);
        const responseData = postsService.getPostsById(postId)
        if (responseData.status === 'error') {
            res.status(404).json({ message: responseData.message });
            return
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
    }


}

module.exports = postController