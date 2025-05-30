const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItem
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes require the user to be logged in
router.post('/', protect, addToCart); // Add to cart
router.get('/', protect, getCart); // Get cart
router.delete('/clear', protect, clearCart); // Clear cart
router.delete('/:productId', protect, removeFromCart); // Remove item
router.put('/update/:productId', protect, updateCartItem);

module.exports = router;