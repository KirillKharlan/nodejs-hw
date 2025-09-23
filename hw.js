const express = require('express')
const path = require('path')
const fs = require('fs')
const HOST = "127.0.0.1"
const PORT = 8000
const app = express()
const moment = require('moment');
const jsonPath = path.join(__dirname, "posts.json")


    function getDate() {
      const date = moment();
      return date.format('YYYY/MM/DD HH:mm:ss');
    }

    const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    console.log(posts)

    const currentDate = getDate();
    console.log(currentDate);


    function getCurrentWeekDay() {
      const day = moment();
      return day.format('dddd');
    }

    const currentDay = getCurrentWeekDay();
    console.log(currentDay);

app.get("/timestamp", (reg, res)=>{
  res.json({currentTime: currentDate})
})

app.get("/posts", (reg, res)=>{
  res.json({allPosts: posts})
})

app.listen(PORT, HOST, ()=>{
  console.log(`http://${HOST}:${PORT}`)
})

