const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  toggleBlockUser,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Logged-in user fetches their profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// Logged-in user updates their profile
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id/block', protect, admin, toggleBlockUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;