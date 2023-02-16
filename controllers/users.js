const User = require('../models/user.js');
const {APPROVED, ERROR_CODE, NOT_FOUND, SERVER_ERROR} = require('../errors/errors.js');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const getUserID = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий id' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан некорректный id' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Ошибка сервера1' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.user._id);

  User.create({ name, about, avatar })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные в методы создания пользователя' });
    return;
  }
  res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
  })
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // Передадим объект опций:
    {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
    },
)
.then((user) => {
  if (!user) {
    res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
    return;
  }
  res.status(APPROVED).send(user);
})
.catch((err) => {
 if (err.name === 'ValidationError') {
    res.status(ERROR_CODE).send({ message: 'Данные не прошли валидацию при обновлении пользователя' });
    return;
  } else {
    res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
  }
});
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
  .then(user => res.send({ data: user }))
  .catch(user => res.send( "Данные не прошли валидацию. Либо произошло что-то совсем немыслимое" ));
};

module.exports = {
  getUsers,
  getUserID,
  createUser,
  updateUser,
  updateAvatar
}