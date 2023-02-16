const Card = require('../models/card');

const {
  APPROVED, ERROR_CODE, NOT_FOUND, SERVER_ERROR,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      res.status(APPROVED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Ошибка валидации' });
      }
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      return;
    }
    res.status(APPROVED).send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для лайка.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
        return;
      }
      res.send(card);
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для лайка.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
