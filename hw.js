const express = require('express')
const HOST = "127.0.0.1"
const PORT = 8000
const app = express()
const moment = require('moment');


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

app.get("/timestamp", (reg, res)=>{
  res.json({currentTime: currentDate})
})

app.listen(PORT, HOST, ()=>{
  console.log(`http://${HOST}:${PORT}`)
})

