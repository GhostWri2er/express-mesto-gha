const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUserID, updateUser, updateAvatar, currentUser,
} = require('../controllers/users');

router.get('/me', currentUser);
router.get('/', auth, getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi
      .string()
      .hex()
      .length(24)
      .required(),
  }),
}), getUserID);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .min(2)
      .max(30),
    about: Joi
      .string()
      .min(2)
      .max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .min(2)
      .uri()
      .regex(/^(https|http)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/i),
  }),
}), updateAvatar);

module.exports = router;
