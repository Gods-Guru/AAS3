import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get guest cart from localStorage
  const getGuestCart = () => {
    try {
      return JSON.parse(localStorage.getItem('guest_cart')) || [];
    } catch {
      return [];
    }
  };
  // Helper to set guest cart in localStorage
  const setGuestCart = (items) => {
    localStorage.setItem('guest_cart', JSON.stringify(items));
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Guest: load from localStorage
        setCartItems(getGuestCart());
        return;
      }
      
      const res = await axios.get('http://localhost:5002/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Standardize the response handling
      const items = res.data.items || [];
      setCartItems(items);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Guest: update localStorage cart
      let guestCart = getGuestCart();
      const idx = guestCart.findIndex(item => item.product?._id === product._id);
      if (idx > -1) {
        // Update quantity
        const newQty = guestCart[idx].quantity + quantity;
        if (product.inStock !== undefined && newQty > product.inStock) {
          alert(`Cannot add more than ${product.inStock} of this item to cart.`);
          return;
        }
        guestCart[idx].quantity = newQty;
      } else {
        guestCart.push({ product, quantity });
      }
      setGuestCart(guestCart);
      setCartItems(guestCart);
      return;
    }
    // Find current quantity in cart
    const existing = cartItems.find(item => item.product?._id === product._id);
    const currentQty = existing ? existing.quantity : 0;
    if (product.inStock !== undefined && currentQty + quantity > product.inStock) {
      alert(`Cannot add more than ${product.inStock} of this item to cart.`);
      return;
    }
    try {
      await axios.post('http://localhost:5002/api/cart',
        { productId: product._id, quantity },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      await fetchCart(); // Refresh the cart from server
    } catch (err) {
      console.error('Failed to add to cart:', err);
      throw err; // Let components handle the error
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Guest: update localStorage cart
      let guestCart = getGuestCart().filter(item => (item.product?._id || item._id) !== productId);
      setGuestCart(guestCart);
      setCartItems(guestCart);
      return;
    }
    try {
      await axios.delete(`http://localhost:5002/api/cart/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    // Optimistic UI update for guests and logged-in users
    const token = localStorage.getItem('token');
    if (!token) {
      // Guest: update localStorage cart instantly
      let guestCart = getGuestCart().map(item => {
        if ((item.product?._id || item._id) === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      setGuestCart(guestCart);
      setCartItems(guestCart);
      return;
    }
    // For logged-in users, update UI instantly, then sync with server
    setCartItems(prev => prev.map(item => {
      if ((item.product?._id || item._id) === productId) {
        return { ...item, quantity };
      }
      return item;
    }));
    try {
      await axios.put(`http://localhost:5002/api/cart/update/${productId}`,
        { quantity },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      // Optionally, re-fetch cart to ensure consistency
      fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      // Optionally, revert UI or show error
      fetchCart();
      throw err;
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setGuestCart([]);
      setCartItems([]);
      return;
    }
    try {
      await axios.delete('http://localhost:5002/api/cart/clear', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
      throw err;
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);