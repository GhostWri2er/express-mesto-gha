const router = require('express').Router();

const {
  getUsers, getUserID, updateUser, updateAvatar, currentUser,
} = require('../controllers/users');

router.get('/users/me', currentUser);
router.get('/', getUsers);
router.get('/:userId', getUserID);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
