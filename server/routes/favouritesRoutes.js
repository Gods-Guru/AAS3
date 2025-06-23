const express = require('express');
const {
  addToFavourites,
  removeFromFavourites,
  getUserFavourites,
} = require('../controllers/favouritesController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/', protect, addToFavourites);
router.delete('/:productId', protect, removeFromFavourites);
router.get('/', protect, getUserFavourites);

module.exports = router;