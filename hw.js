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