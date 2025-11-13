import type { Request, Response } from 'express'
import userService from "./user.service.ts";
import type { 
    IUserController, 
    RegisterInput, 
    LoginInput, 
    User, 
    errorMessage 
} from "./user.types.ts";


const userController: IUserController = {
    registerUser: async (req: Request<{}, User | errorMessage, RegisterInput>, res: Response<User | errorMessage>) => {
        const data = req.body as RegisterInput;
        const responseData = await userService.registerUser(data);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(responseData.statusCode).json(responseData.data as User);
    },
    loginUser: async (req: Request<{}, { message: string } | errorMessage, LoginInput>, res: Response<{ message: string } | errorMessage>) => {
        const data = req.body as LoginInput;
        const responseData = await userService.loginUser(data);
        if (responseData.status === 'error') {
            res.status(responseData.statusCode).json({ message: responseData.message });
            return;
        }
        res.status(responseData.statusCode).json(responseData.data);
    },
}

export default userController