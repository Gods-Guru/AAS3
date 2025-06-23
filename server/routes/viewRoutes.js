const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST: Increment view count for a product
router.post('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.views = (product.views || 0) + 1;
    await product.save();
    res.json({ views: product.views });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Return top 10 most viewed products (global)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ views: { $gt: 0 } })
      .sort({ views: -1 })
      .limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;