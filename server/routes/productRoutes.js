const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post('/', upload.single('image'), protect, admin, createProduct);
router.put('/:id', upload.single('image'), protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);


module.exports = router;