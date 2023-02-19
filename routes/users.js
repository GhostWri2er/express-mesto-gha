const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserID, updateUser, updateAvatar, currentUser,
} = require('../controllers/users');

router.get('/users/me', currentUser);
router.get('/', getUsers);

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
      .uri(),
  }),
}), updateAvatar);

module.exports = router;
