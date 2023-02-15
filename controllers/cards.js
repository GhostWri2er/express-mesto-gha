const Card = require('../models/card.js');

const BadRequestError = require('../errors/badRequestError.js');
const NotFoundError = require('../errors/notFoundError.js');
const NotOwnerError = require('../errors/notOwnerError.js');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => console.log(err));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным id не найдена'));
      }
      if (card.owner.valueOf() !== req.user._id) {
        return next(new NotOwnerError('Попытка удалить чужую карточку'));
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((removedCard) => res.send({ data: removedCard }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      } else {
        return next(err);
      }
    });
}

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
  .then(card => res.send({ data: card }))
  .catch(err => res.status(400).send({ message: 'Произошла ошибка' }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
.then((card) => {
  if (!card) {
    res.status(404).send({ message: 'Передан несуществующий id карточки.' });
    return;
  }
  res.status(200).send(card);
  })
.catch((err) => {
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Переданы некорректные данные для лайка.' });
  } else {
    res.status(500).send({ message: `Ошибка сервера` });
  }
});
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
.then((card) => {
  if (!card) {
    res.status(404).send({ message: 'Передан несуществующий id карточки.' });
    return;
  }
  res.send(card);
}).catch((err) => {
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Переданы некорректные данные для лайка.' });
  } else {
    res.status(500).send({ message: `Ошибка сервера` });
  }
});
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}