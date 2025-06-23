const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getAdminAnalytics = async (req, res) => { 
  try {
    // Summary
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' } // FIXED: use 'total' not 'totalPrice'
        }
      }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Monthly Orders Chart
    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $project: {
          month: {
            $let: {
              vars: {
                monthsInString: [
                  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]
              },
              in: { $arrayElemAt: ['$$monthsInString', '$_id'] }
            }
          },
          count: 1
        }
      }
    ]);

    // Monthly Sales Chart (sum of order totals per month)
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$total' }
        }
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          month: {
            $let: {
              vars: {
                monthsInString: [
                  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]
              },
              in: { $arrayElemAt: ['$$monthsInString', '$_id'] }
            }
          },
          total: 1
        }
      }
    ]);

    // Category Distribution Chart
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $project: {
          name: '$categoryInfo.name',
          count: 1
        }
      }
    ]);

    // Top Selling Products
    const topSellingProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.qty' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          name: '$productInfo.name',
          totalSold: 1
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Final response
    res.status(200).json({
      summary: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      },
      monthlyOrders,
      monthlySales, // <-- add this line
      categoryDistribution,
      topSellingProducts
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
};

module.exports = {
  getAdminAnalytics
};