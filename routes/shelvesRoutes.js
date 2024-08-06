const { Router } = require('express');
const { getShelves, getStatusShelves, getShelfBooks, addABookToShelf, createShelf, removeBook } = require('../controllers/shelvesController');
const { authenticateUser } = require('../middlewares/auth');

const router = Router();

router.get('/', authenticateUser, getShelves);
router.get('/:shelf_id/books', authenticateUser, getShelfBooks);
router.post('/:shelf_id/addbook', authenticateUser, addABookToShelf);
router.post('/:shelf_id/removebook', authenticateUser, removeBook);
router.post('/create', authenticateUser, createShelf);
router.get('/shelfids', authenticateUser, getStatusShelves);

module.exports = router;
