const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createWebsiteReview,
  getAllWebsiteReviews,
  replyToReview,
  featureReview,
  getFeaturedWebsiteReviews
} = require('../controllers/websiteReviewController');

// User submits a review
router.post('/', protect, createWebsiteReview);

// Admin gets all reviews
router.get('/', protect, admin, getAllWebsiteReviews);

// Admin replies to a review
router.patch('/:id/reply', protect, admin, replyToReview);

// Admin features/unfeatures a review
router.patch('/:id/feature', protect, admin, featureReview);

// Public: Get featured website reviews
router.get('/featured', getFeaturedWebsiteReviews);

module.exports = router;
