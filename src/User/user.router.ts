import { Router } from 'express';
import userController from './user.controller.ts'; 


const userRouter = Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/me', userController.me);


export default userRouter;