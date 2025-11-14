// import { PrismaClient } from "./src/generated/prisma/index.js";

// const client = new PrismaClient()

// async function createPost(){
//     try {
//         const post = await client.post.create({
//         data: {
//             name:"firstPost",
//             postDescription:"first first post",
//             img:"image",
//             likes:51601
//         }
//         })
//         console.log("Post created:", post);
//     } catch (e: any) {
//         if (e.code === 'P2002') {
//             console.log("Post already exists (P2002 error). Skipping creation.");
//         } else {
//             console.error("Error creating post:", e);
//         }
//     }
// }

// async function createTag(tagName: string){
//     try {
//         const tag = await client.tag.create({
//             data: {
//                 name: tagName
//             }
//         });
//         console.log(`Tag '${tagName}' created:`, tag);
//         return tag;
//     } catch (e: any) {
//         if (e.code === 'P2002') {
//             console.log(`Tag '${tagName}' already exists. Skipping creation.`);
//             // Якщо тег вже існує, повертаємо його
//             return client.tag.findUnique({ where: { name: tagName } });
//         } else {
//             console.error(`Error creating tag '${tagName}':`, e);
//         }
//     }
// }

// async function createCategory(name: string, description: string){
//     try {
//         const category = await client.category.create({
//             data: {
//                 name: name,
//                 description: description
//             }
//         });
//         console.log(`Category '${name}' created:, category`);
//         return category;
//     } catch (e: any) {
//         // Обработка ошибки P2002, если категория уже существует
//         if (e.code === 'P2002') {
//             console.log(`Category '${name}' already exists. Skipping creation.`);
//             return client.category.findUnique({ where: { name } });
//         } else {
//             console.error(`Error creating category '${name}':`, e);
//         }
//     }
// }

// async function main() {
//     console.log("Starting seed");
    
//     // створення поста
//     await createPost();

//     // створення тегів
//     const uniqueTimestamp = Date.now();
//     const uniqueTagName = `AutoTag_${uniqueTimestamp}`; 
//     await createTag(uniqueTagName);
//     await createTag("FixedTag_DevOps");

//     // створення категорій
//     console.log("\nCreating categories...");
//     const techCategory = await createCategory("Technology", "все о новітніх технологіях");
//     const sportCategory = await createCategory("Sport", "усі новини про спорт");
//     const newsCategory = await createCategory("WorldNews", "усі новини о глобальних подіях");

//     // зв'язуємо пост з категооріїю
//     if (techCategory) {
//         await client.post.updateMany({
//             where: { name: "firstPost" },
//             data: { categoryId: techCategory.id }
//         });
//         console.log(`Post 'firstPost' linked to Category: ${techCategory.name}`);
//     }

//     console.log("Seeding finished.");
// }

// main()
//     .catch((e) => {
//         console.error("Critical seeding error:", e);
//         process.exit(1);
//     })