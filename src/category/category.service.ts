import { categoryRepository } from './category.repository.ts'; 
import type { Category, CreateCategory, ServiceResponse } from './category.types.ts'; 

type CategoryServiceResponse<T> = Promise<ServiceResponse<T>>;

export const categoryService = {
    
    getAllCategories: async (skipC?: string, takeC?: string): CategoryServiceResponse<Category[]> => {
        let skip: number | undefined = undefined; 
        let take: number | undefined = undefined;
        if (skipC !== undefined && skipC !=='') {
            const parsedSkip = parseInt(skipC);
            if (isNaN(parsedSkip) && parsedSkip < 0) {
                return { status: "error", statusCode: 400, message: "Параметр 'skip' повинен бути невід'ємним числом." };
            }
            skip = parsedSkip;
        }
        if (takeC !== undefined && takeC !=='') {
            const parsedTake = parseInt(takeC);
            if (isNaN(parsedTake) && parsedTake < 0) {
                return { status: "error", statusCode: 400, message: "Параметр 'take' повинен бути невід'ємним числом." };
            }
            take = parsedTake;
        }
        try {
            const result = await categoryRepository.getAll(skip, take);
            return { status: "success", statusCode: 200, data: result };
        } catch (error) {
            console.error("Помилка при отриманні категорій:", error);
            return { status: "error", statusCode: 500, message: "Внутрішня помилка сервера." };
        }
    },
    
    getCategoryById: async (id: number): CategoryServiceResponse<Category> => {
        try {
            const category = await categoryRepository.getById(id);
            if (!category) {
                return { status: "error", statusCode: 404, message: `Категорію з ID ${id} не знайдено.` };
            } 
            return { status: "success", statusCode: 200, data: category };
        } catch (error) {
             console.error("Помилка при отриманні категорії:", error);
             return { status: "error", statusCode: 500, message: "Внутрішня помилка сервера." };
        }
    },
    
    createCategory: async (data: CreateCategory): CategoryServiceResponse<Category> => {
        if (!data.name) {
             return { status: "error", statusCode: 422, message: "Поле 'name' є обов'язковим." };
        }
        try {
            const newCategory = await categoryRepository.create(data);
            return { status: "success", data: newCategory, statusCode: 201 };
        } catch (error: any) {
            console.error("Помилка при створенні категорії:", error);
            if (error.code === 'P2002') {
                 return { status: "error", statusCode: 409, message: "Категорія з таким ім'ям вже існує." };
            }
            return { status: "error", statusCode: 500, message: "Внутрішня помилка сервера при збереженні категорії." };
        }
    }
} 

export default categoryService;