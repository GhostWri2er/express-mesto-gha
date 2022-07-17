const router = require('express').Router();

const { getUsers, getUserID, createUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/users/:userId', getUserID);
router.post('/', createUser);

module.exports = router;