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
  const skipC = req.query.skip;
  const takeC = req.query.take;

  let skip = 0;
  let take;

  if (skipC !== undefined && skipC !=='') {
    skip = parseInt(skipC);
    if (isNaN(skip) || skip < 0) {
      return res.status(400).send({ error: "Параметр 'skip' повинен бути невід'ємним числом." });
    }
  }

  if (takeC !== undefined && takeC !=='') {
    take = parseInt(takeC);
    if (isNaN(take) || take < 0) {
      return res.status(400).send({ error: "Параметр 'take' повинен бути невід'ємним числом." });
    }
  }

  let resultPosts = posts.slice(skip);

  if (take !== undefined) {
    resultPosts = resultPosts.slice(0, take);
  }

  res.json({resultPosts});

  res.status(200).json()
});


app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);

  const post = posts.find(p => p.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).send({
      error: `Пост з ID ${postId} не знайдено.`
      });
    }

    res.status(200).json()
});

  


app.listen(PORT, HOST, ()=>{
  console.log(`http://${HOST}:${PORT}/posts?skip=2&take=2`)
})

