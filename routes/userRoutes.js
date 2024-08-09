const { Router } = require('express');
const { getUsers, getUser, editUser, getProfile } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/auth');

const router = Router();

router.get('/', getUsers);
router.get('/profile/:user_id', getProfile);
router.get('/me', authenticateUser, getUser);
router.post('/edit', authenticateUser, editUser);

module.exports = router;