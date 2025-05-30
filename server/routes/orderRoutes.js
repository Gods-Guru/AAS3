// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrderStatus
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');

// Create new order (logged-in user)
router.post('/', protect, createOrder);

// Admin: get all orders
router.get('/admin', protect, admin, getAllOrders);

// Get logged-in user's orders
router.get('/myorders', protect, getOrdersByUser);

// Get order by ID (logged-in user)
router.get('/:id', protect, getOrderById);

// Update order to paid (logged-in user)
router.put('/:id/pay', protect, updateOrderToPaid);

// Update order to delivered (admin only)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

// Update order status
router.patch('/:id/status', protect, admin, updateOrderStatus);

// Get order status
router.get('/:id/status', protect, getOrderStatus);

module.exports = router;