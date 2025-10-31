import { client } from "../client/client.ts"
import type { Category, CreateCategory, ICategoryRepositoryContract } from './category.types.ts';

class CategoryRepository implements ICategoryRepositoryContract {
    async getAll(skip?: number, take?: number): Promise<Category[]> {
        const args: { skip?: number, take?: number } = {};
        if (skip !== undefined) args.skip = skip;
        if (take !== undefined) args.take = take;
        const categories = await client.category.findMany(args);
        return categories as Category[];
    }
    async getById(id: number): Promise<Category | null> {
        const category = await client.category.findUnique({
            where: { id },
        });
        return category as Category | null;
    }
    async create(data: CreateCategory): Promise<Category> {
        const newCategory = await client.category.create({
            data: data
        });
        return newCategory as Category;
    }
}

export const categoryRepository = new CategoryRepository();