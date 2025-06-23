// routes/productViews.js
const express = require('express');
const { trackProductView, getUserMostViewed } = require('../controllers/autoFavouritesController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/:productId', protect, trackProductView);
router.get('/', protect, getUserMostViewed);

module.exports = router;