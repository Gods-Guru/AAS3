const Product = require('../models/Product');
const Category = require('../models/Category');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

// Create product
exports.createProduct = async (req, res) => {
  try {
    let imageUrl = req.body.image;

    // Handle file upload if image is an actual file (req.file)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Delete temp file
    }

    const productData = {
      ...req.body,
      image: imageUrl,
    };

    const product = await Product.create(productData);
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const queryObj = {};

    // CATEGORY FILTER
    if (req.query.category) {
      const categoryName = req.query.category.trim();
      const categoryDoc = await Category.findOne({ name: categoryName });

      if (!categoryDoc) {
        return res.status(404).json({ message: `Category "${categoryName}" not found` });
      }

      queryObj.category = categoryDoc._id;
    }

    // PRICE FILTER
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }

    const products = await Product.find(queryObj).populate('category', 'name');

    if (products.length === 0) {
      return res.status(200).json({ message: 'No products found for this category', products: [] });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    let imageUrl = req.body.image;

    // If there's a new image file, upload it
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedData = {
      ...req.body,
      image: imageUrl,
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};