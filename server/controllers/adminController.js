const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Return = require('../models/returnRequest');
const Discount = require('../models/Discounts');

const getAdminAnalytics = async (req, res) => {
  const totalSalesData = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$total' } } },
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

    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);

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

const getAllAdminStats = async (req, res) => {
  try {
    // Total Sales
    const totalSalesData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalSales = totalSalesData[0]?.total || 0;

    // Orders
    const orders = await Order.find();
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const canceledOrders = orders.filter(o => o.status === 'Canceled').length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Discounts
    const discounts = await Discount.find();
    const totalCodes = discounts.length;
    const activeCodes = discounts.filter(d => d.active).length;
    const usedCodes = discounts.filter(d => d.usedCount > 0).length;
    const totalUses = discounts.reduce((acc, curr) => acc + curr.usedCount, 0);

    // Other stats
    const totalCustomers = await User.countDocuments({ isAdmin: false });
    const productsInStock = await Product.countDocuments({ inStock: { $gt: 0 } });
    const totalProducts = await Product.countDocuments();
    const returnRequests = await Return.countDocuments();

    res.status(200).json({
      sales: {
        totalSales,
        totalRevenue
      },
      orders: {
        totalOrders,
        deliveredOrders,
        pendingOrders,
        canceledOrders
      },
      discounts: {
        totalCodes,
        activeCodes,
        usedCodes,
        totalUses
      },
      other: {
        totalCustomers,
        productsInStock,
        totalProducts,
        returnRequests
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin stats', error: error.message });
  }
};

module.exports = {
  getAdminAnalytics,
  getDiscountAnalytics,
  getOrderAnalytics,
  getAllAdminStats
};