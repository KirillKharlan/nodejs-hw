import express from "express"
import type { Express } from "express"

import postRouter from './Post/post.router.ts'
import userRouter from './User/user.router.ts'

const HOST:string = "localhost"
const PORT:number = 8000
const app:Express = express()

app.use(express.json())
app.use(postRouter)
app.use(userRouter)

app.listen(PORT, HOST, ()=>{
  console.log(`http://${HOST}:${PORT}/posts?skip=2&take=2`)
  console.log(`http://${HOST}:${PORT}/users/1?fields=name,email`)
})