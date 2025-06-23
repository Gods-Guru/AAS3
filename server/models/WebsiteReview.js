const mongoose = require('mongoose');

const websiteReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  experience: { type: Number, required: true },
  quality: { type: Number, required: true },
  price: { type: Number, required: true },
  comment: { type: String, required: true },
  reply: { type: String },
  replied: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('WebsiteReview', websiteReviewSchema);
