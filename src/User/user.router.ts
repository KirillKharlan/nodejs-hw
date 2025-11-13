import { Router } from 'express';
import userController from './user.controller.ts';


const userRouter = Router();
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser); 


export default userRouter;