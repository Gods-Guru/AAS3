import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { validateDiscountCode } from '../services/discountService';
import '../styles/CheckoutPage.scss';

const API_BASE_URL = 'http://localhost:5002/api'; // Ensure this is the correct base URL for your API

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();

  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [discountCode, setDiscountCode] = useState('');
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendCartItems, setBackendCartItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'cod'

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5002/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBackendCartItems(res.data.items || []);
      } catch (err) {
        setBackendCartItems([]);
        setError('Failed to fetch cart from server.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Calculate subtotal from backendCartItems
  const subtotal = backendCartItems.reduce((acc, item) => (item.price || item.product?.price || 0) * item.quantity + acc, 0);
  const shippingFee = 0.04 * subtotal; // 4% of subtotal
  const total = subtotal - discountAmount + shippingFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length <= 19) { // 16 digits + 3 spaces
        setPayment({...payment, [name]: formattedValue});
      }
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
      setPayment({...payment, [name]: formattedValue});
      return;
    }
    
    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      if (value.length <= 4 && !isNaN(value)) {
        setPayment({...payment, [name]: value});
      }
      return;
    }
    
    setPayment({...payment, [name]: value});
  };

  // Validate and apply discount code
  const handleApplyDiscount = async () => {
    setApplyingDiscount(true);
    setDiscountError('');
    setDiscountPercent(0);
    setDiscountAmount(0);
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code.');
      setApplyingDiscount(false);
      return;
    }
    const result = await validateDiscountCode(discountCode.trim());
    if (!result.valid) {
      setDiscountError(result.message || 'Invalid discount code.');
      setApplyingDiscount(false);
      return;
    }
    setDiscountPercent(result.discountPercentage);
    const amount = (result.discountPercentage / 100) * subtotal;
    setDiscountAmount(amount);
    setDiscountError('');
    setApplyingDiscount(false);
  };

  const handlePlaceOrder = async () => {
    // Validate shipping info
    if (!form.address || !form.city || !form.postalCode || !form.country) {
      return setError('Please fill in all shipping fields.');
    }

    // If paying with card, validate payment info
    if (paymentMethod === 'card') {
      if (!payment.cardNumber || !payment.expiryDate || !payment.cvv || !payment.cardName) {
        return setError('Please fill in all payment fields.');
      }
      const cleanCardNumber = payment.cardNumber.replace(/\s/g, '');
      if (cleanCardNumber.length !== 16 || isNaN(cleanCardNumber)) {
        return setError('Please enter a valid 16-digit card number.');
      }
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const payload = {
        items: backendCartItems.map((item) => ({
          productId: item.product?._id || item._id,
          quantity: item.quantity,
        })),
        shippingAddress: form,
        paymentMethod, // <-- send payment method
        paymentInfo: paymentMethod === 'card' ? {
          cardLast4: payment.cardNumber.replace(/\s/g, '').slice(-4),
          cardBrand: 'visa'
        } : undefined,
        discountCode: discountCode.trim() || null,
      };
      const res = await axios.post(`${API_BASE_URL}/orders`, payload, config);
      const orderId = res.data.order?._id || res.data._id;
      // Mark order as paid if card payment
      if (orderId && paymentMethod === 'card') {
        try {
          await axios.patch(`${API_BASE_URL}/orders/${orderId}/pay`, {
            paymentResult: {
              id: 'mock_card_txn_' + Date.now(),
              status: 'COMPLETED',
              update_time: new Date().toISOString(),
              email_address: user?.email || 'guest@example.com',
            }
          }, config);
        } catch (payErr) {
          setError('Order created but failed to mark as paid. Please contact support.');
          setLoading(false);
          return;
        }
      }
      clearCart();
      navigate(`/my-orders`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      <div className="checkout-grid">
        {/* Shipping Information */}
        <div className="checkout-section">
          <h3>Shipping Information</h3>
          <div className="form-group">
            <label>Full Address</label>
            <input
              type="text"
              name="address"
              placeholder="123 Main Street"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                placeholder="12345"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="checkout-section">
          <h3>Payment Method</h3>
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              Pay with Card
            </label>
            <label style={{ marginLeft: '1em' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              Pay on Delivery
            </label>
          </div>
        </div>

        {/* Payment Information */}
        {paymentMethod === 'card' && (
          <div className="checkout-section">
            <h3>Payment Details</h3>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardName"
                placeholder="Name on card"
                value={payment.cardName}
                onChange={handlePaymentChange}
                required={paymentMethod === 'card'}
              />
            </div>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={payment.cardNumber}
                onChange={handlePaymentChange}
                maxLength={19}
                required={paymentMethod === 'card'}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={payment.expiryDate}
                  onChange={handlePaymentChange}
                  maxLength={5}
                  required={paymentMethod === 'card'}
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={payment.cvv}
                  onChange={handlePaymentChange}
                  maxLength={4}
                  required={paymentMethod === 'card'}
                />
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="checkout-section order-summary">
          <h3>Order Summary</h3>
          
          <div className="order-items">
            {backendCartItems.map((item) => (
              <div key={item._id || (item.product && item.product._id)} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name || (item.product && item.product.name)}</span>
                  <span className="item-quantity">x {item.quantity}</span>
                </div>
                <span className="item-price">${((item.price || (item.product && item.product.price) || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>${shippingFee.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="discount-section">
            <input
              type="text"
              placeholder="Discount Code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={applyingDiscount}
            />
            <button onClick={handleApplyDiscount} disabled={applyingDiscount || !discountCode.trim()}>
              {applyingDiscount ? 'Checking...' : 'Apply'}
            </button>
            {discountPercent > 0 && !discountError && (
              <p className="success">Discount applied: {discountPercent}% off (-${discountAmount.toFixed(2)})</p>
            )}
            {discountError && <p className="error">{discountError}</p>}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            className="place-order-btn"
            onClick={handlePlaceOrder} 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;