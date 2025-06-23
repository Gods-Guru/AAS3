const mongoose = require('mongoose');

const productViewTrackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  viewCount: {
    type: Number,
    default: 1,
  },
  lastViewed: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Prevent duplicate tracking records for the same user/product pair
productViewTrackerSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('ProductViewTracker', productViewTrackerSchema);