const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Return = require('../models/returnRequest');
const Discount = require('../models/Discounts');

const getAdminAnalytics = async (req, res) => {
  const totalSalesData = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalSales = totalSalesData[0]?.total || 0;

  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: { $ne: 'Delivered' } });
  const totalCustomers = await User.countDocuments({ isAdmin: false });
  const productsInStock = await Product.countDocuments({ inStock: { $gt: 0 } });
  const returnRequests = await Return.countDocuments();

  res.status(200).json({
    totalSales,
    totalOrders,
    pendingOrders,
    totalCustomers,
    productsInStock,
    returnRequests,
  });
};

const getDiscountAnalytics = async (req, res) => {
  try {
    const discounts = await Discount.find();

    const totalCodes = discounts.length;
    const activeCodes = discounts.filter(d => d.active).length;
    const inactiveCodes = totalCodes - activeCodes;
    const usedCodes = discounts.filter(d => d.usedCount > 0).length;
    const totalUses = discounts.reduce((acc, curr) => acc + curr.usedCount, 0);

    res.status(200).json({
      totalCodes,
      activeCodes,
      inactiveCodes,
      usedCodes,
      totalUses
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch discount analytics', error: error.message });
  }
};

const getOrderAnalytics = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    const canceledOrders = orders.filter(order => order.status === 'Canceled').length;

    const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);

    res.status(200).json({
      totalOrders,
      deliveredOrders,
      pendingOrders,
      canceledOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order analytics', error: error.message });
  }
};

module.exports = {
  getAdminAnalytics,
  getDiscountAnalytics,
  getOrderAnalytics
};