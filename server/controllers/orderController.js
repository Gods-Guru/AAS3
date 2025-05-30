const Order = require('../models/Order');
const Discount = require('../models/Discounts');

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({ status });
    await order.save();

    res.status(200).json({
      message: 'Order status updated',
      currentStatus: order.status,
      statusHistory: order.statusHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order status
// @route   GET /api/orders/:id/status
// @access  User/Admin
exports.getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      currentStatus: order.status,
      statusHistory: order.statusHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create an order
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      discountCode // optional
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let finalPrice = totalPrice;
    let appliedDiscountCode = null;
    let discountPercentage = 0;
    let discountAmount = 0;

    if (discountCode) {
      const discount = await Discount.findOne({ code: discountCode.toUpperCase(), active: true });

      if (!discount) {
        return res.status(400).json({ message: 'Invalid or inactive discount code' });
      }

      if (discount.expiryDate < new Date()) {
        return res.status(400).json({ message: 'Discount code has expired' });
      }

      if (discount.usageLimit !== 0 && discount.usedCount >= discount.usageLimit) {
        return res.status(400).json({ message: 'Discount code has reached its usage limit' });
      }

      // Apply discount
      discountPercentage = discount.discountPercentage;
      discountAmount = totalPrice * (discountPercentage / 100);
      finalPrice = totalPrice - discountAmount;
      appliedDiscountCode = discount.code;

      // Update usage count
      discount.usedCount += 1;
      await discount.save();
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: finalPrice,
      discountCode: appliedDiscountCode,
      discountPercentage,
      discountAmount,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get order', error: error.message });
  }
};

// Get logged-in user's orders
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user orders', error: error.message });
  }
};

// Admin: Get all orders
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate('user', 'name email');
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to get all orders', error: error.message });
//   }
// };
// Changed my mind about this one ^^

// Update order to paid
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = req.body.paymentResult; // e.g. from PayPal

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

// Update order to delivered
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, user, startDate, endDate, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    if (status) query.status = status;
    if (user) query.user = user;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sortOption = { [sortBy]: order === 'asc' ? 1 : -1 };

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort(sortOption);

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};