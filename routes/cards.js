const router = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/', getCards);
router.delete('/users/:cardId', deleteCard);
router.post('/', createCard);


module.exports = router;