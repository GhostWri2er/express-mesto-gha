const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

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
      .required()
      .regex(/^(https|http)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/i),
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
