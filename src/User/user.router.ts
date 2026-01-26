import { Router } from 'express';
import userController from './user.controller.ts'; 
import { authMiddleware } from "../middlewares/auth-middleware.ts";


const userRouter = Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/me', authMiddleware, userController.me);
userRouter.put('/update', authMiddleware, userController.updateMe);


export default userRouter;