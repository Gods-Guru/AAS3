const Order = require('../models/Order');
const Discount = require('../models/Discounts');
const Product = require('../models/Product');

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
    const { items, shippingAddress, discountCode, paymentMethod = 'card', paymentInfo } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }
    const userId = req.user.id;
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
      if (product.inStock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      // Decrement stock
      product.inStock -= item.quantity;
      if (product.inStock === 0) {
        product.status = 'out of stock';
      }
      await product.save();
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      orderItems.push({
        product: product._id,
        name: product.name,
        qty: item.quantity,
        price: product.price,
      });
    }
    let discountAmount = 0;
    let discountPercentage = 0;
    if (discountCode) {
      const discount = await Discount.findOne({ code: discountCode });
      if (!discount) return res.status(400).json({ message: "Invalid discount code" });
      discountPercentage = discount.discountPercentage;
      discountAmount = (discount.discountPercentage / 100) * subtotal;
      // Increment usedCount
      discount.usedCount = (discount.usedCount || 0) + 1;
      await discount.save();
    }
    const shippingFee = 0.04 * subtotal;
    const total = subtotal - discountAmount + shippingFee;
    const newOrder = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
      discountCode,
      discountAmount,
      discountPercentage,
      shippingFee,
      subtotal,
      total,
      status: "Pending",
      statusHistory: [{ status: "Pending" }],
      paymentMethod,
      paymentResult: paymentInfo || undefined,
      isPaid: paymentMethod === 'card',
      paidAt: paymentMethod === 'card' ? Date.now() : undefined,
    });
    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
    // Only allow marking as paid if payment method is 'cod' (cash on delivery)
    if (order.paymentMethod !== 'cod') {
      return res.status(400).json({ message: 'Order is not eligible for manual payment marking.' });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = req.body.paymentResult || { status: 'PAID_ON_DELIVERY' };
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

// Cancel order and restock products
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order already cancelled' });
    }
    // Restock each product
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.inStock += item.qty;
        if (product.inStock > 0 && product.status === 'out of stock') {
          product.status = 'in stock';
        }
        await product.save();
      }
    }
    order.status = 'Cancelled';
    order.statusHistory.push({ status: 'Cancelled' });
    await order.save();
    res.status(200).json({ message: 'Order cancelled and products restocked', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
};
