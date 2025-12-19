import express from "express"
import cors from 'cors'
import type { Express } from "express"

import postRouter from './Post/post.router.ts'
import tagRouter from './Tag/tag.router.ts'
import userRouter from './User/user.router.ts'
import categoryRouter from "./category/category.router.ts"

const HOST:string = "localhost"
const PORT:number = 8000
const app:Express = express()

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json())
app.use(postRouter)
app.use(userRouter)
app.use(tagRouter)
app.use(categoryRouter)

app.listen(PORT, HOST, ()=>{
  console.log(`http://${HOST}:${PORT}/posts?skip=2&take=2`)
  console.log(`http://${HOST}:${PORT}/tags`)
  console.log(`http://${HOST}:${PORT}/categories`)
  console.log(`http://${HOST}:${PORT}/login`)
  console.log(`http://${HOST}:${PORT}/register`)
})