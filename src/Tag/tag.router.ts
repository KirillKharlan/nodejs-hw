import { Router } from 'express';
import tagController from './tag.controller.ts';
const tagRouter = Router();
tagRouter.get('/tags', tagController.getAllTags);
tagRouter.get('/tags/:name', tagController.getByName); 
export default tagRouter;