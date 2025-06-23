const express = require('express');
const router = express.Router();
const { createDiscount, getDiscounts, updateDiscount, deleteDiscount, toggleDiscountActivation } = require('../controllers/discountController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createDiscount); // Admin-only access
router.get('/', protect, admin, getDiscounts); // Admin-only access
router.put('/:id', protect, admin, updateDiscount); // Admin-only access
router.delete('/:id/delete', protect, admin, deleteDiscount); // Admin-only access
router.put('/:id/toggle', protect, admin, toggleDiscountActivation); //Admin-only access


module.exports = router;