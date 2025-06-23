const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ReturnRequest = require('../models/returnRequest');

exports.getAllUsers = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    const limit = parseInt(req.query.limit) || 0;

    const users = await User.find({ isAdmin: false })
      .sort({ [sortBy]: order })
      .limit(limit)
      .select('-password');

    const enriched = await Promise.all(users.map(async (user) => {
      const orderCount = await Order.countDocuments({ user: user._id });
      const returnCount = await ReturnRequest.countDocuments({ user: user._id });

      return {
        ...user._doc,
        orderCount,
        returnCount
      };
    }));

    res.status(200).json(enriched);
  } catch (error) {
    console.error('Get all users failed:', error); // add this line for logging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Admin: Get single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User: Update own profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, bio, profilePicture } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio !== undefined ? bio : user.bio;
    user.profilePicture = profilePicture !== undefined ? profilePicture : user.profilePicture;

    const updatedUser = await user.save();
    res.status(200).json({
      message: 'Profile updated',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Admin: Block or Unblock user
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling user block', error: error.message });
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};