const express = require('express')
const path = require('path')
const fs = require('fs')
const HOST = "127.0.0.1"
const PORT = 8000
const app = express()
const moment = require('moment');
const jsonPath = path.join(__dirname, "posts.json") 
const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  console.log(posts)

    function getDate() {
      const date = moment();
      return date.format('YYYY/MM/DD HH:mm:ss');
    }

    

    const currentDate = getDate();
    console.log(currentDate);


    function getCurrentWeekDay() {
      const day = moment();
      return day.format('dddd');
    }

    const currentDay = getCurrentWeekDay();
    console.log(currentDay);

app.get("/timestamp", (req, res)=>{
  res.json({currentTime: currentDate})
})


app.get('/posts', (req, res) => {
  const skip = parseInt(req.query.skip, 4) || 0;
  const take = parseInt(req.query.take, 4) || 4;

  if (take <= 0) {
        return res.status(400).json({ error: "Параметр 'take' должен числом." });
  }

  const filteredPosts = posts.filter(post => {
      return post.idPost > skip;
  });

  const resultPage = filteredPosts.slice(0, take);

  res.json({
      request: { skip, take },
      data: resultPage,
      nextAfterId: resultPage.length > 0 ? resultPage[resultPage.length - 1].idPost : null,
  });

  res.status(200).json()
});


app.get("/posts/:id", (req, res)=>{
  const id = Number(req.query.idPost);

  if (isNaN(id)){
    res.status(404).json('Вказано не число')
    return;
  }

  res.status(200).json()
})

app.get("/posts", (reg, res)=>{
  res.json({allPosts: posts})
})

app.listen(PORT, HOST, ()=>{
  console.log(`http://${HOST}:${PORT}/posts?skip=2&take=2`)
})

