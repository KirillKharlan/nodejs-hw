import type { Request, Response } from 'express'
import categoryService from "./category.service.ts";
import type { ICategoryController, Category, CreateCategory, errorMessage } from "./category.types.ts";

const categoryController: ICategoryController = {
    getAllCategories: async (req, res) => {
        const skipC = req.query.skip as string | undefined;
        const takeC = req.query.take as string | undefined;
        const responseData = await categoryService.getAllCategories(skipC, takeC);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(200).json(responseData.data as Category[]);
    },
    getCategoryById: async (req, res) => {
        const categoryIdParams = req.params.id;
        const categoryId = parseInt(categoryIdParams);
        if (isNaN(categoryId) || categoryId <= 0) {
            res.status(400).json({ message: "ID категорії має бути позитивним числом." });
            return;
        }
        const responseData = await categoryService.getCategoryById(categoryId);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(200).json(responseData.data);
    },
    createCategory: async (req, res) => {
        const data = req.body as CreateCategory;
        const responseData = await categoryService.createCategory(data);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(responseData.statusCode).json(responseData.data);
    }
}

export default categoryController