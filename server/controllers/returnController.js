const ReturnRequest = require('../models/returnRequest');
const Order = require('../models/Order');

// USER: Request a return
exports.createReturnRequest = async (req, res) => {
  const { orderId, reason } = req.body;

  try {
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder || existingOrder.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Order not found or unauthorized.' });
    }

    const request = new ReturnRequest({
      order: orderId,
      user: req.user.id,
      reason
    });

    await request.save();
    res.status(201).json({ message: 'Return request submitted.', request });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ADMIN: Get all return requests
exports.getAllReturns = async (req, res) => {
  try {
    const returns = await ReturnRequest.find().populate('order').populate('user');
    res.status(200).json(returns);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateReturnStatus = async (req, res) => {
  const { status, responseMessage } = req.body;

  try {
    const returnRequest = await ReturnRequest.findById(req.params.id);

    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    returnRequest.status = status;
    returnRequest.responseMessage = responseMessage || returnRequest.responseMessage;

    // Add to history
    returnRequest.statusHistory.push({ status });

    await returnRequest.save();

    res.status(200).json({ message: 'Return status updated successfully', returnRequest });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update return status', error: error.message });
  }
};

exports.markOrderAsRefunded = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.refunded) {
      return res.status(400).json({ message: 'Order is already marked as refunded' });
    }

    // Restock each product in the order
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.inStock += item.qty;
        await product.save();
      }
    }

    order.refunded = true;
    order.status = 'Refunded';
    await order.save();

    res.status(200).json({ message: 'Order marked as refunded and stock updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing refund', error: error.message });
  }
};