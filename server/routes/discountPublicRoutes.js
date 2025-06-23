const express = require('express');
const router = express.Router();
const Discount = require('../models/Discounts');

// Validate discount code (public route)
router.get('/validate/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const discount = await Discount.findOne({ code });
    if (!discount || !discount.active) {
      return res.status(400).json({ valid: false, message: 'Invalid or inactive discount code' });
    }
    if (discount.expiryDate && new Date(discount.expiryDate) < new Date()) {
      return res.status(400).json({ valid: false, message: 'Discount code expired' });
    }
    if (discount.usageLimit > 0 && discount.usedCount >= discount.usageLimit) {
      return res.status(400).json({ valid: false, message: 'Discount code usage limit reached' });
    }
    res.json({ valid: true, discountPercentage: discount.discountPercentage });
  } catch (err) {
    res.status(500).json({ valid: false, message: 'Server error' });
  }
});

module.exports = router;
