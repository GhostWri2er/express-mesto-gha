const express = require('express');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const mongoose = require('mongoose');

const { errors, celebrate, Joi } = require('celebrate');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const NotFoundError = require('./errors/not-found-err');
const errorHandler  = require('./middlewares/errorHandler');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https|http)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i),
  }),
}), createUser);

app.use(auth)

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Ошибка сервера" } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
    next();
});

app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.use(errors()); // обработчик ошибок celebrate


app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
