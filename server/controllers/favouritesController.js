const Favourite = require('../models/ManualFavourites.js');

const addToFavourites = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const favourite = await Favourite.create({ user: userId, product: productId });
    res.status(201).json({ message: 'Product added to favourites', favourite });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Product already in favourites' });
    }
    res.status(500).json({ message: 'Failed to add to favourites', error: err.message });
  }
};

const removeFromFavourites = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    await Favourite.findOneAndDelete({ user: userId, product: productId });
    res.json({ message: 'Product removed from favourites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favourite', error: err.message });
  }
};

const getUserFavourites = async (req, res) => {
  const userId = req.user._id;

  try {
    const favourites = await Favourite.find({ user: userId }).populate('product');
    res.json(favourites);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favourites', error: err.message });
  }
};

module.exports = {
  addToFavourites,
  removeFromFavourites,
  getUserFavourites,
};