const { Router } = require('express');
const { getUsers, getUser, editUser } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/auth');

const router = Router();

router.get('/', getUsers);
router.get('/me', authenticateUser, getUser);
router.post('/edit', authenticateUser, editUser);

module.exports = router;