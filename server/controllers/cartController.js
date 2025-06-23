const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart or update quantity
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // Ensure no duplicate products in cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        // Update quantity only
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Only add if not already present
        cart.items.push({ product: productId, quantity });
      }
      // Remove any accidental duplicates (safety net)
      const uniqueItems = [];
      const seen = new Set();
      for (const item of cart.items) {
        const idStr = item.product.toString();
        if (!seen.has(idStr)) {
          uniqueItems.push(item);
          seen.add(idStr);
        }
      }
      cart.items = uniqueItems;
      await cart.save();
      res.json(cart);
    } else {
      const newCart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });

      const savedCart = await newCart.save();
      res.status(201).json(savedCart);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

// Get logged-in user's cart
// exports.getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: 'Error retrieving cart', error: error.message });
//   }
// };

// In cartController.js

exports.getCart = async (req, res) => {
  try {
    console.log('User ID:', req.user._id); // Check if user is properly authenticated
    
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')
      .lean();
    
    console.log('Found cart:', cart); // See what the query returns
    
    if (!cart) {
      console.log('No cart found for user');
      return res.status(200).json({ items: [] });
    }

    // Verify populated products
    console.log('Cart items with products:', cart.items.map(item => ({
      product: item.product ? item.product._id : null,
      quantity: item.quantity
    })));

    res.json({ items: cart.items });
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({ 
      message: 'Error retrieving cart',
      error: error.message,
      stack: error.stack // Only in development
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    // Find the item to remove and its quantity
    const item = cart.items.find(item => item.product.toString() === productId);
    if (item) {
      // Restock the product
      const product = await Product.findById(productId);
      if (product) {
        product.inStock += item.quantity;
        if (product.inStock > 0 && product.status === 'out of stock') {
          product.status = 'in stock';
        }
        await product.save();
      }
    }
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item', error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};

// Update quantity of a cart item
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cart item updated', cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart item', error: error.message });
  }
};

// Cleanup carts by removing items with null products
exports.cleanupCart = async (req, res) => {
  try {
    const carts = await Cart.find({}).populate('items.product');

    let cleanedCount = 0;

    for (const cart of carts) {
      const validItems = cart.items.filter(item => item.product !== null);

      if (validItems.length !== cart.items.length) {
        cart.items = validItems;
        await cart.save();
        cleanedCount++;
        console.log(`Cleaned cart for user: ${cart.user}`);
      }
    }

    res.status(200).json({ message: `✅ Cleaned ${cleanedCount} cart(s) `});
  } catch (error) {
    console.error('Cart cleanup failed:', error.message);
    res.status(500).json({ message: '❌ Cart cleanup failed', error: error.message });
  }
};