import React, { useEffect } from 'react';
import axios from 'axios';
import '../styles/CartPage.scss';
// import './Cart.scss';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';

const CartPage = () => {
  const { cartItems, loading, refreshCart, cartTotal } = useCart();
  const [cartAlert, setCartAlert] = React.useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  // Debugging effect
  useEffect(() => {
    console.log('Cart items:', cartItems);
    console.log('Loading state:', loading);
  }, [cartItems, loading]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      throw new Error('No authentication token found');
    }
    return { Authorization: `Bearer ${token}` };
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const response = await axios.put(
        `${API_BASE_URL}/cart/update/${itemId}`,
        { quantity: newQuantity },
        { headers: getAuthHeader() }
      );
      
      console.log('Update response:', response.data);
      await refreshCart();
      showAlert('Quantity updated!', 'success');
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      showAlert(err.response?.data?.message || 'Failed to update quantity', 'error');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/cart/${itemId}`,
        { headers: getAuthHeader() }
      );
      
      console.log('Remove response:', response.data);
      await refreshCart();
      showAlert('Item removed from cart', 'success');
    } catch (err) {
      console.error('Remove error:', err.response?.data || err.message);
      showAlert(err.response?.data?.message || 'Failed to remove item', 'error');
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product?._id || item._id,
        quantity: item.quantity
      }));
      const response = await axios.post(
        `${API_BASE_URL}/orders`,
        { items: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Checkout response:', response.data);
      await refreshCart();
      showAlert('Order placed successfully!', 'success');
      navigate('/checkout');
    } catch (err) {
      console.error('Checkout error:', err.response?.data || err.message);
      showAlert(err.response?.data?.message || 'Checkout failed', 'error');
      
      // Redirect to login if unauthorized
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const showAlert = (message, type) => {
    setCartAlert({ show: true, message, type });
    setTimeout(() => setCartAlert({ show: false, message: '', type: '' }), 3000);
  };

  // Calculate total price if not provided by context
  const calculatedTotal = Array.isArray(cartItems)
    ? cartItems.reduce(
        (sum, item) => sum + (item.product?.price || item.price || 0) * (item.quantity || 1),
        0
      )
    : 0;

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      
      {cartAlert.show && (
        <div className={`cart-alert alert-${cartAlert.type}`}> {/* alert-success or alert-error */}
          {cartAlert.message}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/catalogue')}>Browse Products</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id || item.product?._id}>
                <img 
                  src={item.product?.image || item.image} 
                  alt={item.product?.name || item.name} 
                  onError={(e) => {
                    e.target.src = '/placeholder-product-image.jpg';
                  }}
                />
                <div className="details">
                  <h4>{item.product?.name || item.name}</h4>
                  <p>${(item.product?.price || item.price || 0).toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.product?._id || item._id, (item.quantity || 1) - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product?._id || item._id, (item.quantity || 1) + 1)}>
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.product?._id || item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ${(cartTotal || calculatedTotal).toFixed(2)}</h3>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;