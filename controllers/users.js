const User = require('../models/user.js');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => console.log(err));
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

module.exports = {
  getUsers,
  getUserID,
  createUser,
}