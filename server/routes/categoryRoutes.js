// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Create a new category
router.post('/', protect, admin, createCategory);

// Get all categories
router.get('/', getAllCategories);

// Get single category by ID
router.get('/:id', getCategoryById);

// Update a category
router.put('/:id', protect, admin, updateCategory);

// Delete a category
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;