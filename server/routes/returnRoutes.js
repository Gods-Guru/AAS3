const express = require('express');
const router = express.Router();
const {
  createReturnRequest,
  getAllReturns,
  updateReturnStatus,
  markOrderAsRefunded
} = require('../controllers/returnController');

const { protect, admin } = require('../middleware/authMiddleware');

// User submits return
router.post('/', protect, createReturnRequest);

// Admin views all returns
router.get('/', protect, admin, getAllReturns);

router.put('/orders/:id/refund', protect, admin, markOrderAsRefunded);

// Admin updates a return request
router.put('/:id/status', protect, admin, updateReturnStatus);

module.exports = router;