const { Router } = require('express');
const { getUsers, getUser, addUser } = require('../controllers/userController');

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/add', addUser);

module.exports = router;