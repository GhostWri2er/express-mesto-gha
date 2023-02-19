const router = require('express').Router();

const {
  getUsers, getUserID, updateUser, updateAvatar,
} = require('../controllers/users');

//router.get('/users/me', currentUsers);
router.get('/', getUsers);
router.get('/:userId', getUserID);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
