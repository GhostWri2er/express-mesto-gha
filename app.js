const express = require('express');

const mongoose = require('mongoose');

const { NOT_FOUND } = require('./errors/errors');
const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.json().urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62d3dd9ad89632972e698684',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => {
  next(res.status(NOT_FOUND).send({ message: 'Страница не найдена' }));
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
