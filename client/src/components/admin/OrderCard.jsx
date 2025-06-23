import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api/config';
import '../../styles/adminstyle/OrdersPage.scss';

const OrderCard = ({ order, onStatusChange, onPaidChange, onDeliveredChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [isPaid, setIsPaid] = useState(order.isPaid || false);
  const [isDelivered, setIsDelivered] = useState(order.isDelivered || false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingPaid, setLoadingPaid] = useState(false);
  const [loadingDelivered, setLoadingDelivered] = useState(false);
  const [error, setError] = useState(null);

  const toggleExpanded = () => setExpanded(!expanded);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoadingStatus(true);
    setError(null);
    try {
      await axios.patch(`http://localhost:5000/api/orders/${order._id}/status`, { status: newStatus },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        }
      );
      onStatusChange(order._id, newStatus);
    } catch (err) {
      setError('Failed to update status: ' + (err.response?.data?.message || 'Unknown error'));
      setStatus(order.status);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleMarkPaid = async () => {
    if (isPaid) return;
    setLoadingPaid(true);
    setError(null);
    try {
      await axios.patch(`${API_BASE_URL}/orders/${order._id}/pay`, {
        paymentResult: {
          id: 'manual',
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: order.user?.email || ''
        }
      }, 
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        }
      );
      setIsPaid(true);
      if (onPaidChange) onPaidChange(order._id);
    } catch (err) {
      setError('Failed to mark as paid: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setLoadingPaid(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (isDelivered || !isPaid) return;
    setLoadingDelivered(true);
    setError(null);
    try {
        await axios.patch(`http://localhost:5000/api/orders/${order._id}/deliver`, {}, 
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        }
        );
        setIsDelivered(true);
        setStatus('Delivered'); // auto-update the dropdown status
        if (onDeliveredChange) onDeliveredChange(order._id);
    } catch (err) {
        setError('Failed to mark as delivered: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
        setLoadingDelivered(false);
    }
    };

  return (
    <>
    <div className="order-card">
      {error && <div className="alert alert-error">{error}</div>}
      <div className="order-header">
        <div className="customer-info">
          <div className="name">{order.user?.name}</div>
          <div className="email">{order.user?.email}</div>
        </div>

        <div className="order-meta">
          <div className="date">
            {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
          </div>
          <div className="order-id">#{order._id.slice(-6).toUpperCase()}</div>
        </div>
      </div>

      <div className="order-details">
        <div className="detail">
          <span className="label">Total</span>
          <span className="value">${order.total?.toFixed(2) ?? '0.00'}</span>
        </div>

        <div className="detail">
          <span className="label">Payment</span>
          <span className="value">{isPaid ? 'Paid' : 'Unpaid'}</span>
        </div>

        <div className="detail">
          <span className="label">Delivery</span>
          <span className="value">{isDelivered ? 'Delivered' : 'Not Delivered'}</span>
        </div>

        <div className="detail">
          <span className="label">Status</span>
          <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
        </div>

        <div className="detail">
        <span className="label">Change Status</span>
        <select
            value={status}
            onChange={handleStatusChange}
            disabled={loadingStatus || status === 'Delivered'}
        >
            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
            .filter((s) => {
                if (status === 'Delivered') return s === 'Delivered';
                if (status === 'Shipped') return ['Shipped', 'Delivered', 'Cancelled'].includes(s);
                return true;
            })
            .map((s) => (
                <option key={s} value={s}>
                {s}
                </option>
            ))}
        </select>
        </div>
      </div>

      <div className="actions">
        <button
          onClick={handleMarkPaid}
          disabled={isPaid || loadingPaid}
          className="mark-paid"
        >
          {loadingPaid ? 'Marking...' : isPaid ? 'Paid' : 'Mark Paid'}
        </button>

        <button
          onClick={handleMarkDelivered}
          disabled={isDelivered || loadingDelivered}
          className="mark-delivered"
        >
          {loadingDelivered ? 'Updating...' : isDelivered ? 'Delivered' : 'Mark Delivered'}
        </button>

        <button onClick={toggleExpanded} className="update-status">
          {expanded ? 'Collapse' : 'Details'}
        </button>
      </div>

      {expanded && (
        <div className="expanded-section">
          <h4>Shipping Address</h4>
          <p>
            {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
            {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
          </p>

          <h4>Items Ordered</h4>
          <ul>
            {order.orderItems.map((item) => (
              <li key={item.product}>
                {item.name} — Qty: {item.qty} — ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>

          {order.discountCode && (
            <div>
              <strong>Discount:</strong> {order.discountCode} ({order.discountPercentage}%) — Saved ${order.discountAmount.toFixed(2)}
            </div>
          )}

          <h4>Status History</h4>
          <ul>
            {order.statusHistory.map((history, idx) => (
              <li key={idx}>
                {history.status} — {history.updatedAt ? new Date(history.updatedAt).toLocaleString() : ''}
              </li>
            ))}
          </ul>

          <div className="timestamps">
            <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  </>
  )
};

export default OrderCard;