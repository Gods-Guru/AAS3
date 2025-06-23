// controllers/wishlistController.js
const User = require('../models/User');
const Product = require('../models/Product');

exports.toggleWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);

    const alreadyWished = user.wishlist.includes(productId);

    if (alreadyWished) {
      user.wishlist.pull(productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.status(200).json({
      message: alreadyWished ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating wishlist', error });
  }
};

exports.getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('wishlist');
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};