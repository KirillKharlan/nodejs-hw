import { client } from "../client/client.ts"
import type { Tag, ITagRepositoryContract } from './tag.types.ts';

class TagRepository implements ITagRepositoryContract {
    async getAll(skip?: number, take?: number): Promise<Tag[]> {
        const args: { skip?: number, take?: number } = {};

        if (skip !== undefined){
            args.skip = skip;
        }

        if (take !== undefined){
            args.take = take;
        }

        const tags = await client.tag.findMany(args);
        
        return tags as Tag[];
    }
    async getByName(name: string): Promise<Tag | null> {
        const tag = await client.tag.findUnique({
            where: { name },
        });
        return tag as Tag | null;
    }
}

export const tagRepository = new TagRepository();

