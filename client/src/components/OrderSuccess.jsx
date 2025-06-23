import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome } from 'react-icons/fa';
import '../styles/OrderSuccess.scss';

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    navigate('/');
    return null;
  }

  return (
    <div className="order-success-container">
      <div className="success-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        <h2>Order Placed Successfully!</h2>
        <p className="order-id">Order ID: #{order._id}</p>
        <p className="confirmation">
          A confirmation has been sent to your email. Thank you for shopping with us!
        </p>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-item">
            <span>Status:</span>
            <span className="status-badge">{order.status}</span>
          </div>
          <div className="summary-item">
            <span>Items:</span>
            <span>{order.orderItems.reduce((sum, item) => sum + item.qty, 0)}</span>
          </div>
          <div className="summary-item">
            <span>Total:</span>
            <span>${order.total.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate(`/orders/${order._id}`)}
          >
            <FaShoppingBag /> View Order
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            <FaHome /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;