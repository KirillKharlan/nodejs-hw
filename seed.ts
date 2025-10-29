import { PrismaClient } from "./src/generated/prisma/index.js";

const client = new PrismaClient()

async function createPost(){
    try {
        const post = await client.post.create({
        data: {
            name:"firstPost",
            postDescription:"first first post",
            img:"image",
            likes:51601
        }
        })
        console.log("Post created:", post);
    } catch (e: any) {
        if (e.code === 'P2002') {
            console.log("Post already exists (P2002 error). Skipping creation.");
        } else {
            console.error("Error creating post:", e);
        }
    }
}

async function createTag(tagName: string){
    try {
        const tag = await client.tag.create({
            data: {
                name: tagName
            }
        });
        console.log(`Tag '${tagName}' created:`, tag);
        return tag;
    } catch (e: any) {
        if (e.code === 'P2002') {
            console.log(`Tag '${tagName}' already exists. Skipping creation.`);
            // Якщо тег вже існує, повертаємо його
            return client.tag.findUnique({ where: { name: tagName } });
        } else {
            console.error(`Error creating tag '${tagName}':`, e);
        }
    }
}

async function main() {
    console.log("Starting seed");
    // створення посту
    await createPost();
    // генеруємо унікальний name для кожного тегу
    const uniqueTimestamp = Date.now();
    const uniqueTagName = `TestTag_${uniqueTimestamp}`; 
    console.log(`\nAttempting to create a unique tag: ${uniqueTagName}`);
    const newUniqueTag = await createTag(uniqueTagName);
    
    // Створення фіксованого тегу
    const fixedTag = await createTag("FixedTag_For_Testing");

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await client.$disconnect();
    });