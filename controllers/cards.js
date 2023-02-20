const Card = require('../models/card');

const {
  APPROVED, ERROR_CODE, NOT_FOUND, SERVER_ERROR,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка сервера' }));
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
      if (card.owner && card.owner.id === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(res.status(APPROVED).send({ card }))
          .catch(() => res.status(SERVER_ERROR).send({ message: "Ошибка сервера" }));
      } else {
        res.status(ERROR_CODE).send({ message: 'Нельзя удалить чужую карточку' });
      }
    } else {
      res.status(NOT_FOUND).send({ message: 'Такой карточки не существует' });
    }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Передан несуществующий id карточки.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Ошибка валидации' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
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
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для лайка.' });
      } else {
        return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
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
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для лайка.' });
      } else {
        return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
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
