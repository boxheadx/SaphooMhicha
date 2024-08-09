const { postBook, getBooks, editBook, topAuthors } = require('../controllers/authorController');
const { Router } = require('express');
const { authenticateUser } = require('../middlewares/auth');

const router = Router();

router.post('/addbook', authenticateUser, postBook);
router.post('/editbook/:id', authenticateUser, editBook);
router.get('/:author_id/books', getBooks);
router.get('/top', topAuthors);

module.exports = router;