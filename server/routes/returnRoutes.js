const express = require('express');
const router = express.Router();
const {
  createReturnRequest,
  getAllReturns,
  getMyReturns,
  updateReturnStatus,
  markAsRefunded,
  markAsRestocked,
  getUserReturns
} = require('../controllers/returnController');
const { protect, admin } = require('../middleware/authMiddleware');

// User: Submit a return request
router.post('/', protect, createReturnRequest);

// User: View their return history
router.get('/mine', protect, getMyReturns);

// Admin: View all return requests
router.get('/', protect, admin, getAllReturns);

// Admin: Update status of a return request
router.patch('/:id/status', protect, admin, updateReturnStatus);

// Admin: Mark as refunded
router.patch('/:id/refund', protect, admin, markAsRefunded);

// Admin: Mark as restocked
router.patch('/:id/restock', protect, admin, markAsRestocked);

// Admin: Get returns for a specific user
router.get('/user/:userId', protect, admin, getUserReturns);

module.exports = router;