const Discount = require('../models/Discounts');

// @desc    Create a new discount code
// @route   POST /api/admin/discounts
// @access  Private/Admin
exports.createDiscount = async (req, res) => {
  const { code, discountPercentage, expiryDate, usageLimit } = req.body;

  try {
    const existing = await Discount.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Discount code already exists' });
    }

    const discount = new Discount({
      code: code.toUpperCase(),
      discountPercentage,
      expiryDate,
      usageLimit: usageLimit || 0,
      usedCount: 0,
      active: true,
    });

    const createdDiscount = await discount.save();
    res.status(201).json(createdDiscount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all discount codes
// @route   GET /api/admin/discounts
// @access  Private/Admin
// Get all discount codes (admin only)
exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch discounts', error: error.message });
  }
};

// @desc    Update discount code
// @route   PUT /api/admin/discounts/:id
// @access  Private/Admin
exports.updateDiscount = async (req, res) => {
  const { code, discountPercentage, expiryDate, usageLimit, active } = req.body;

  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({ message: 'Discount code not found' });
    }

    discount.code = code ? code.toUpperCase() : discount.code;
    discount.discountPercentage = discountPercentage ?? discount.discountPercentage;
    discount.expiryDate = expiryDate ?? discount.expiryDate;
    discount.usageLimit = usageLimit ?? discount.usageLimit;
    discount.active = active ?? discount.active;

    const updatedDiscount = await discount.save();
    res.json(updatedDiscount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete discount code
// @route   DELETE /api/admin/discounts/:id
// @access  Private/Admin
exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({ message: 'Discount code not found' });
    }

    await discount.deleteOne();
    res.json({ message: 'Discount code removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle discount code (On and Off)
// @route   DELETE /api/admin/discounts/:id
// @access  Private/Admin
exports.toggleDiscountActivation = async (req, res) => {
  try {
    const { id } = req.params;

    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ message: 'Discount code not found' });
    }

    discount.active = !discount.active; // toggle active status
    await discount.save();

    res.status(200).json({ message: `Discount code is now ${discount.active ? 'active' : 'inactive'}`, discount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle discount activation', error: error.message });
  }
};