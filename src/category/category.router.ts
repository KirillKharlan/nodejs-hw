import express, { Router } from 'express';
import categoryController from './category.controller.ts';
const router:Router = express.Router()
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', categoryController.createCategory);
export default router