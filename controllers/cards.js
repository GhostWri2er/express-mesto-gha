const Card = require('../models/card.js');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => console.log(err));
};

const deleteCard = (req, res) => {
  findByIdAndRemove(req.params.cardId)
  .then(card => res.send({ data: card }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createCard = (req, res) => {
  const { name, link } = req.body;

  User.create({ name, link })
  .then(card => res.send({ data: card }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
}