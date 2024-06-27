const { postBook, getBooks } = require('../controllers/authorController');
const { Router } = require('express');
const { authenticateUser } = require('../middlewares/auth');

const router = Router();

router.post('/addbook', authenticateUser, postBook);
router.get('/:author/books', getBooks);

module.exports = router;