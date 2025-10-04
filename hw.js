const express = require('express')
const path = require('path')
const fs = require('fs')
const fsPromises = require("fs/promises")
const HOST = "127.0.0.1"
const PORT = 8000
const app = express()
const moment = require('moment');
const jsonPath = path.join(__dirname, "posts.json") 
const jsonUsersPath = path.join(__dirname, "users.json")
const users = JSON.parse(fs.readFileSync(jsonUsersPath, 'utf-8'))
const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  console.log(posts)
  console.log(users)

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






// по запиту /posts якщо не вказано skip та take отримаємо усі пости, якщо вказан skip то пропускаємо стільки постів скільки вказано, якщо вказан take то беремо стільки постів скільки вказано
app.get('/posts', (req, res) => {
  const skipC = req.query.skip;
  const takeC = req.query.take;

  let skip = 0;
  let take;

  //Перевіряємо чи правильно вказан skip та взагалі чи він вказан
  if (skipC !== undefined && skipC !=='') {
    skip = parseInt(skipC);
    if (isNaN(skip) || skip < 0) {
      return res.status(400).send({ error: "Параметр 'skip' повинен бути невід'ємним числом." });
    }
  }

  //Перевіряємо чи правильно вказан take та взагалі чи він вказан
  if (takeC !== undefined && takeC !=='') {
    take = parseInt(takeC);
    if (isNaN(take) || take < 0) {
      return res.status(400).send({ error: "Параметр 'take' повинен бути невід'ємним числом." });
    }
  }

  //Пропускаємо стільки постів скільки вказано в skip
  let resultPosts = posts.slice(skip);

  //Беремо стільки постів скільки вказано у take
  if (take !== undefined) {
    resultPosts = resultPosts.slice(0, take);
  }

  res.json({resultPosts});

  res.status(200).json()
});

// шукаємо пости по id, беремо id який користувач указав в запиті та переводино його в числовий тип данних, потім шукаємо його по цьому id в массиві, якщо такий пост є то він виводиться як відповідь користувачу, якщо його немає то ми відправляємо помилку 404 користувачу 
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






app.get('/users/:id', (req, res) => {
  // Пошук користувача, usersId робимо з id число, userFound шукаємо користувача в масиві
  const usersId = parseInt(req.params.id);
  const userFound = users.find(user => user.id === usersId);
  // Перевіряємо чи є такий користувач, якщо ні то повертаємо помилку що такого користувача нема
  if (!userFound) {
    return res.status(404).send({error: `Користувача з ID ${usersId} не знайдено.`});
  }
  // Вилучаємо id з фінального массиву який буде відображено на сторінці
  const { id, ...fList } = userFound; 
  // Ініціалізуємо массив для полів які були вказані у запиті
  let fieldsToSelect = [];
  // Обробка query параметру fields де ми перевіряємо запит на усі помилки; .split(',') розбиваємо строку на , ; .map(field => field.trim()) видаляємо пробіли поблизу ім'я поля ; фільтруємо порожні строки.
  if (req.query.fields) {
    fieldsToSelect = req.query.fields
      .split(',')
      .map(field => field.trim()) 
      .filter(field => field.length > 0);
  }
  // фінальний об'єкт який відправляється користувачу
  const responseObject = {};
  // Повертаємо увесь об'єкт користувача id якого вказано
  if (fieldsToSelect.length === 0) {
    // Копіюємо усі властивості з flist без id у responseObject 
    Object.assign(responseObject, fList);
  } else {
  // ФІльтруємо запит та виводимо тільки ті поля які вказані
    // шукаємо чи є поля які вказали в запиті в массиві, і якщо є то додаємо їх у відповідь
    for (const field of fieldsToSelect) {
      if (fList.hasOwnProperty(field)) {
        responseObject[field] = fList[field];
      } 
    }
  }
  // відправка відповіді
  res.json(responseObject)

    res.status(200).json()
});

// Отримаємо усіх користувачів по запиту /users
app.get("/users", (reg, res)=>{
  res.json({allUsers: users})
})






// оброьник post для posts в яклму стровюємо нові пости
app.post("/posts", async (req, res) => {
  try {
    const data = req.body;
    // Оброник який приймає данні з тіла запросу POST, якщи хоча б одного значення немає то виводимо помилку 422
    if (!data.name || !data.postDescription || !data.img) {
      res.status(422).json("invalid data")
    }
    // додаємо новий останній пост за допомогою length - 1 та lastPost + 1
    const lastPost = posts[posts.length - 1];
    let id = 0;
    if(lastPost) {
      id = lastPost + 1;
    }

    const post = { ...data, id: id };
    // записуємо новий останній пост до массиву, та відправляємо цей пост разом зі статус кодом 201, повідомляючи що пост успішно додано
    posts.push(post);
    await fsPromises.writeFile(jsonPath, JSON.stringify(posts));
    res.status(201).json(post);
    // перехватуємо помилку та виводимо її в консоль якщо вона виникає
  } catch (error) {
    console.log(error)
  }
})
//






app.listen(PORT, HOST, ()=>{
  console.log(`http://${HOST}:${PORT}/posts?skip=2&take=2`)
  console.log(`http://${HOST}:${PORT}/users/1?fields=name,email`)
})

