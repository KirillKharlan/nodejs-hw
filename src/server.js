const express = require('express')
const postRouter = require('./Post/post.router.js')
const userRouter = require('./User/user.router.js')

const HOST = "127.0.0.1"
const PORT = 8000
const app = express()

app.use(express.json())
app.use(postRouter)
app.use(userRouter)

app.listen(PORT, HOST, ()=>{
  console.log(`http://${HOST}:${PORT}/posts?skip=2&take=2`)
  console.log(`http://${HOST}:${PORT}/users/1?fields=name,email`)
})