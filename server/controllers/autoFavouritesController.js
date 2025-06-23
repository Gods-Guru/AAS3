const AutoFavourite = require('../models/AutoFavourites.js');
const Product = require('../models/Product.js');

const ProductViewTracker = AutoFavourite; // If your model is named AutoFavourites

const trackProductView = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existing = await ProductViewTracker.findOne({ user: userId, product: productId });

    if (existing) {
      existing.viewCount += 1;
      existing.lastViewed = new Date();
      await existing.save();
    } else {
      await ProductViewTracker.create({ user: userId, product: productId });
    }

    res.status(200).json({ message: 'View tracked' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to track view', error: err.message });
  }
};

const getUserMostViewed = async (req, res) => {
  const userId = req.user._id;

  try {
    const views = await ProductViewTracker.find({ user: userId })
      .sort({ viewCount: -1 })
      .limit(5)
      .populate('product');

    res.json(views);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch most viewed', error: err.message });
  }
};

module.exports = {
  trackProductView,
  getUserMostViewed,
};