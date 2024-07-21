const { Router } = require('express');
const { register, login, logout } = require('../controllers/authController');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;

