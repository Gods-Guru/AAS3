const express = require('express');
const router = express.Router();
const { toggleWishlist, getWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/toggle', protect, toggleWishlist);
router.get('/', protect, getWishlist);

module.exports = router;