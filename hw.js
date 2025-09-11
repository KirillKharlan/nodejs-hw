const moment = require('moment');

    function getDate() {
      const date = moment();
      return date.format('YYYY/MM/DD HH:mm:ss');
    }


    const currentDate = getDate();
    console.log(currentDate);