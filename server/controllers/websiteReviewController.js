const nodemailer = require('nodemailer');
const WebsiteReview = require('../models/WebsiteReview');

// POST /api/website-reviews
exports.createWebsiteReview = async (req, res) => {
  try {
    const { experience, quality, price, comment } = req.body;
    const review = await WebsiteReview.create({
      user: req.user?._id,
      experience,
      quality,
      price,
      comment,
      replied: false,
      featured: false
    });

    // Send email to admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'ekonduobe@gmail.com',
      subject: 'New Website Review',
      text: `Experience: ${experience}\nQuality: ${quality}\nPrice: ${price}\nComment: ${comment}`
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
};

// GET /api/website-reviews (admin)
exports.getAllWebsiteReviews = async (req, res) => {
  try {
    const reviews = await WebsiteReview.find().populate('user', 'name email');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// PATCH /api/website-reviews/:id/reply (admin)
exports.replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await WebsiteReview.findByIdAndUpdate(
      req.params.id,
      { reply, replied: true },
      { new: true }
    );
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to reply', error: err.message });
  }
};

// PATCH /api/website-reviews/:id/feature (admin)
exports.featureReview = async (req, res) => {
  try {
    const { featured } = req.body;
    const review = await WebsiteReview.findByIdAndUpdate(
      req.params.id,
      { featured },
      { new: true }
    );
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update featured status', error: err.message });
  }
};

// GET /api/website-reviews/featured (public)
exports.getFeaturedWebsiteReviews = async (req, res) => {
  try {
    const reviews = await WebsiteReview.find({ featured: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch featured reviews', error: err.message });
  }
};
