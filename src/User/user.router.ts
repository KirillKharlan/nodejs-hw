import express, { Router } from 'express'
import userController from './user.controller.ts'
const router:Router = express.Router()
router.get("/users/:id", userController.getUserById)
router.get("/users", userController.getAllUsers)
export default router
