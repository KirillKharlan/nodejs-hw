import { tagRepository } from './tag.repository.ts'; 
import type { Tag, ServiceResponse } from './tag.types.ts'; 

type TagServiceResponse<T> = Promise<ServiceResponse<T>>;

export const tagService = {
    getAllTags: async (skipC?: string, takeC?: string): TagServiceResponse<Tag[]> => {
        let skip: number | undefined = undefined; 
        let take: number | undefined = undefined;
        if (skipC !== undefined && skipC !== '') {
            const parsedSkip = parseInt(skipC);
            if (isNaN(parsedSkip) || parsedSkip < 0) {
                return { status: "error", statusCode: 400, message: "Параметр 'skip' повинен бути невід'ємним числом." };
            }
            skip = parsedSkip;
        }
        if (takeC !== undefined && takeC !== '') {
            const parsedTake = parseInt(takeC);
            if (isNaN(parsedTake) || parsedTake < 0) {
                return { status: "error", statusCode: 400, message: "Параметр 'take' повинен бути невід'ємним числом." };
            }
            take = parsedTake;
        }
        try {
            const resultTags = await tagRepository.getAll(skip, take);
            return {
                status: "success",
                statusCode: 200,
                data: resultTags
            };
        } catch (error) {
            console.error("Помилка при отриманні тегів:", error);
            return {
                status: "error",
                statusCode: 500,
                message: "Внутрішня помилка сервера при отриманні тегів."
            };
        }
    },
    getTagByName: async (tagName: string): TagServiceResponse<Tag> => {
        if (!tagName) {
             return { status: "error", statusCode: 400, message: "Необхідно вказати ім'я тега." };
        }
        try {
            const tag = await tagRepository.getByName(tagName);
            if (!tag) {
                return {
                    status: "error",
                    statusCode: 404,
                    message: `Тег з ім'ям ${tagName} не знайдено.`, 
                };
            } 
            return {
                status: "success",
                statusCode: 200,
                data: tag,
            };
        } catch (error) {
             console.error("Помилка при отриманні тега:", error);
             return { status: "error", statusCode: 500, message: "Внутрішня помилка сервера." };
        }
    },
} 

export default tagService;