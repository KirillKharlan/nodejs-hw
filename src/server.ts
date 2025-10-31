import express from "express"
import type { Express } from "express"

import postRouter from './Post/post.router.ts'
import tagRouter from './Tag/tag.router.ts'
import userRouter from './User/user.router.ts'
import categoryRouter from "./category/category.router.ts"

const HOST:string = "localhost"
const PORT:number = 8000
const app:Express = express()

app.use(express.json())
app.use(postRouter)
app.use(userRouter)
app.use(tagRouter)
app.use(categoryRouter)

app.listen(PORT, HOST, ()=>{
  console.log(`http://${HOST}:${PORT}/posts?skip=2&take=2`)
  console.log(`http://${HOST}:${PORT}/users/1?fields=name,email`)
  console.log(`http://${HOST}:${PORT}/tags`)
  console.log(`http://${HOST}:${PORT}/categories`)
})