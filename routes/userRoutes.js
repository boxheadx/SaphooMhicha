const { Router } = require('express');
const { getUsers, getUser } = require('../controllers/userController');

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;