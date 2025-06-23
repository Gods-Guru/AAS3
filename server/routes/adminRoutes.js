const express = require('express');
const router = express.Router();
const { getAdminAnalytics, getDiscountAnalytics, getOrderAnalytics, getAllAdminStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createDiscount,
  getDiscounts,
  updateDiscount,
  deleteDiscount,
} = require('../controllers/discountController');

router.get('/analytics', protect, admin, getAdminAnalytics);

router.route('/discounts').get(protect, admin, getDiscounts).post(protect, admin, createDiscount);

router.route('/discounts/:id').put(protect, admin, updateDiscount).delete(protect, admin, deleteDiscount);

router.get('/discount/analytics', protect, admin, getDiscountAnalytics);

router.get('/analytics/orders', protect, admin, getOrderAnalytics);

router.get('/stats', protect, admin, getAllAdminStats);

module.exports = router;