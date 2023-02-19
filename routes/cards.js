const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .hex()
      .length(24)
      .required(),
  }),
}), deleteCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .min(2)
      .max(30)
      .required(),
    link: Joi
      .string()
      .uri()
      .required(),
  }),
}), createCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .hex()
      .length(24)
      .required(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .hex()
      .length(24)
      .required(),
  }),
}), dislikeCard);

module.exports = router;
