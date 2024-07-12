const { Router } = require('express');
const { latestBooks, 
        latestBooksGenre, getTopBooks, 
        getBook, postReview, bookSearch } = require('../controllers/bookController');
const { authenticateUser } = require('../middlewares/auth');

const router = Router();

router.get('/latest', latestBooks);
// router.get('/latest/:genre', latestBooksGenre);
// router.get('/top', getTopBooks);
router.get('/details/:id', getBook);
router.post('/review/:id', authenticateUser,postReview);
router.post('/search', bookSearch);

module.exports = router;

