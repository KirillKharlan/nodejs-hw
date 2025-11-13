import { userRepository } from './user.repository.ts'; 
import type { User, RegisterInput, LoginInput, ServiceResponse } from './user.types.ts';


type UserServiceResponse<T> = Promise<ServiceResponse<T>>;


export const userService = {
    registerUser: async (data: RegisterInput): UserServiceResponse<User> => {
        if (!data.email || !data.password) {
            return { status: "error", statusCode: 422, message: "Email та пароль є обов'язковими." };
        }
        try {
            const existingUser = await userRepository.findByEmail(data.email);
            if (existingUser) {
                return { status: "error", statusCode: 409, message: "Користувач з таким email вже зареєстрований." };
            }
            const newUser = await userRepository.register(data);
            return {
                status: "success",
                statusCode: 201,
                data: newUser,
                message: "Реєстрація успішна!"
            };
        } catch (error: any) {
            console.error("Помилка при реєстрації:", error);
            return { status: "error", statusCode: 500, message: "Внутрішня помилка сервера." };
        }
    },
    loginUser: async (data: LoginInput): UserServiceResponse<{ message: string }> => {
        if (!data.email || !data.password) {
            return { status: "error", statusCode: 422, message: "Email та пароль є обов'язковими." };
        }
        try {
            const user = await userRepository.findByEmail(data.email);
            if (!user) {
                return { status: "error", statusCode: 401, message: "Неправильний email або пароль." };
            }
            const isPasswordValid = (data.password === user.password);
            if (!isPasswordValid) {
                 return { status: "error", statusCode: 401, message: "Неправильний email або пароль." };
            }
            return {
                status: "success",
                statusCode: 200,
                data: { message: "Авторизація успішна! (Далі тут має бути токен)" }
            };
        } catch (error) {
            console.error("Помилка при авторизації:", error);
            return { status: "error", statusCode: 500, message: "Внутрішня помилка сервера." };
        }
    }
} 


export default userService;




