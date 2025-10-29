import type { Request, Response } from 'express'
import tagService from "./tag.service.ts";
import type { ITagController, Tag, errorMessage } from "./tag.types.ts";


const tagController: ITagController = {
    getAllTags: async (req, res) => {
        const skipC = req.query.skip as string | undefined;
        const takeC = req.query.take as string | undefined;
        const responseData = await tagService.getAllTags(skipC, takeC);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(200).json(responseData.data as Tag[]);
    },
    getByName: async (req, res) => {
        const tagName = req.params.name; 
        if (!tagName) {
            res.status(400).send({ message: "Ім'я тега не вказано" });
            return;
        }
        const responseData = await tagService.getTagByName(tagName);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(200).json(responseData.data);
    },
}

export default tagController