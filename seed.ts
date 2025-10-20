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
        console.log(post)
    } catch {
        console.log("error")
    }

}
createPost()