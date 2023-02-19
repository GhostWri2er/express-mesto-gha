const express = require('express');

const { login, createUser } = require('./controllers/users');
const auth  = require('./middlewares/auth');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

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

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
