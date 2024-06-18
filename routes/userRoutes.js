const { Router } = require('express');
const { getUsers, getUser, myinfo } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/auth');

const router = Router();

router.get('/', getUsers);
// router.get('/:id', getUser);
router.get('/myinfo', authenticateUser, myinfo);

module.exports = router;