import express, { Router } from 'express';
import tagController from './tag.controller.ts';
const router:Router = express.Router()
router.get('/tags', tagController.getAllTags);
router.get('/tags/:name', tagController.getByName); 
export default router