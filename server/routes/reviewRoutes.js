const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  deleteReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// User creates a review
router.post('/', protect, createReview);

// Get all reviews for a product
router.get('/:productId', getProductReviews);

// Admin deletes a review
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;