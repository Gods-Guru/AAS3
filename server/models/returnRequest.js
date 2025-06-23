const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        qty: Number,
        price: Number,
      },
    ],
    reason: {
      type: String,
      required: true,
      enum: ['Defective', 'Wrong item', 'Changed mind', 'Other'],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Approved', 'Rejected', 'Received', 'Refunded'],
    },
    restocked: {
      type: Boolean,
      default: false,
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    refundAmount: {
      type: Number,
      required: true,
    },
    adminNote: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);