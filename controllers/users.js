const User = require('../models/user.js');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const getUserID = (req, res) => {
  User.findById(req.params.id)
  .then(user => res.send({ data: user }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.user._id);

  User.create({ name, about, avatar })
  .then(user => res.send({ data: user }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.params.id,
    { name, about },
    // Передадим объект опций:
    {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true // если пользователь не найден, он будет создан
    }
)
  .then(user => res.send({ data: user }))
  .catch(user => res.send("Данные не прошли валидацию. Либо произошло что-то совсем немыслимое"));
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