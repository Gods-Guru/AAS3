const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
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
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Ensure a user can only favorite the same product once
favouriteSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Favourite', favouriteSchema);