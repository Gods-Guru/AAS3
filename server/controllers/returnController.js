const asyncHandler = require('express-async-handler');
const ReturnRequest = require('../models/returnRequest');
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// @desc    Create new return request
// @route   POST /api/returns
// @access  Private (User)
exports.createReturnRequest = asyncHandler(async (req, res) => {
  try {
    const { orderId, items, reason, description, refundAmount } = req.body;
    console.log('Create Return Payload:', req.body);
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    // Ensure refundAmount is set
    const finalRefundAmount = typeof refundAmount === 'number' ? refundAmount : order.totalPrice;
    const returnRequest = await ReturnRequest.create({
      order: orderId,
      user: req.user._id,
      items,
      reason,
      description,
      refundAmount: finalRefundAmount,
    });

    res.status(201).json(returnRequest);
  } catch (err) {
    console.error('Error in createReturnRequest:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

// @desc    Get all return requests (Admin)
// @route   GET /api/returns
// @access  Private/Admin
exports.getAllReturns = asyncHandler(async (req, res) => {
  const returns = await ReturnRequest.find()
    .populate('user', 'name email')
    .populate('order', '_id createdAt totalPrice')
    .sort({ createdAt: -1 });

  res.json(returns);
});

// @desc    Get user return requests
// @route   GET /api/returns/mine
// @access  Private
exports.getMyReturns = asyncHandler(async (req, res) => {
  const returns = await ReturnRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(returns);
});

// @desc    Update return status (Admin)
// @route   PATCH /api/returns/:id/status
// @access  Private/Admin
exports.updateReturnStatus = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;

  const request = await ReturnRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Return request not found');
  }

  request.status = status || request.status;
  if (adminNote) request.adminNote = adminNote;

  await request.save();
  res.json({ message: 'Return status updated', request });
});

// @desc    Mark return as refunded
// @route   PATCH /api/returns/:id/refund
// @access  Private/Admin
exports.markAsRefunded = asyncHandler(async (req, res) => {
  try {
    const request = await ReturnRequest.findById(req.params.id);
    if (!request) {
      res.status(404);
      throw new Error('Return request not found');
    }

    if (!request.refundAmount && request.orderItem) {
      request.refundAmount = request.orderItem.price * request.orderItem.quantity;
    }

    request.isRefunded = true;
    request.status = 'Refunded';
    request.refundIssuedAt = new Date();
    await request.save();

    // Send refund email to user
    const user = await User.findById(request.user);
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: 'Your refund has been processed',
        html: `<p>Dear ${user.name || 'customer'},<br>Your return request for order #${request.order} has been approved and your refund of $${request.refundAmount} has been processed.<br>Thank you for shopping with us!</p>`
      });
    }

    res.json({ message: 'Return marked as refunded' });
  } catch (err) {
    console.error('Error in markAsRefunded:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

// @desc    Mark return as restocked
// @route   PATCH /api/returns/:id/restock
// @access  Private/Admin
exports.markAsRestocked = asyncHandler(async (req, res) => {
  const request = await ReturnRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Return request not found');
  }

  request.restocked = true;
  await request.save();

  // Optional: Adjust stock count in product model
  for (const item of request.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.qty;
      await product.save();
    }
  }

  res.json({ message: 'Items restocked successfully' });
});

// @desc    Get returns for a specific user (Admin)
// @route   GET /api/returns/user/:userId
// @access  Private/Admin
exports.getUserReturns = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const returns = await ReturnRequest.find({ user: userId })
    .populate('order', '_id totalPrice createdAt')
    .populate('items.product', 'name')
    .sort({ createdAt: -1 });

  res.json(returns);
});