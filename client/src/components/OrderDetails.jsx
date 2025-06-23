// src/pages/OrderDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/OrderDetails.scss'; 
import API_BASE_URL from '../api/config';
import orderService from '../services/orderService';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [complaint, setComplaint] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [returnStatus, setReturnStatus] = useState(null);
  const [adminReply, setAdminReply] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await orderService.getOrderById(id);
        setOrder(orderData);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // Fetch return/complaint status for this order
  useEffect(() => {
    const fetchReturn = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/returns/mine` , {
          headers: { Authorization: `Bearer ${token}` }
        });
        const req = res.data.find(r => r.order === order?._id);
        if (req) {
          setReturnStatus(req.status);
          setAdminReply(req.adminNote || '');
        }
      } catch {}
    };
    if (order?._id) fetchReturn();
  }, [order]);

  // Calculate 50% refund amount (total paid minus discount)
  const totalPaid = typeof order?.totalPrice === 'number' ? order.totalPrice : (order?.total || 0);
  const paidMinusDiscount = totalPaid - (order?.discountAmount || 0);
  const refundAmount = Math.max(0, paidMinusDiscount * 0.5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/returns`, {
        orderId: order._id,
        items: order.orderItems.map(i => ({ product: i.product, name: i.name, qty: i.qty, price: i.price })),
        reason: returnReason || 'Other',
        description: complaint || returnDescription,
        refundAmount: refundAmount,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Your complaint/return request has been submitted!');
    } catch (err) {
      setErrorMsg('Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!order) return <div className="error-state">Order not found or data is missing.</div>;

  return (
    <div className="order-details">
      <h1 className="order-details__title">Order #{order._id}</h1>

      <div className="order-details__section">
        <h2 className="order-details__section-title">Shipping Address</h2>
        <div className="order-details__shipping-address">
          <p>{order.shippingAddress?.address || 'N/A'}</p>
          <p>{order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.postalCode || 'N/A'}, {order.shippingAddress?.country || 'N/A'}</p>
        </div>
      </div>

      <div className="order-details__section">
        <h2 className="order-details__section-title">Status</h2>
        <div className="order-details__status-current"><strong>Current:</strong> {order.status || 'N/A'}</div>
        <ul className="order-details__status-history">
          {(order.statusHistory || []).map((entry, index) => (
            <li key={index}>
              {entry.status} - {entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : ''}
            </li>
          ))}
        </ul>
      </div>

      <div className="order-details__section">
        <h2 className="order-details__section-title">Items</h2>
        <div className="order-details__items">
          {(order.orderItems || []).map((item, index) => (
            <div key={index} className="item">
              <span>{item.name} x{item.qty}</span>
              <span>${((typeof item.price === 'number' ? item.price : 0) * (item.qty || 0)).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="order-details__section">
        <h2 className="order-details__section-title">Summary</h2>
        <div className="order-details__summary">
          <div>
            <span>Discount:</span>
            <span>- ${(order.discountAmount || 0).toLocaleString()}</span>
          </div>
          <div className="order-details__summary-total">
            <span>Total:</span>
            <span>${totalPaid.toLocaleString()}</span>
          </div>
          <div>
            <span>Refund (50%):</span>
            <span>${refundAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div>
            <span>Paid:</span>
            <span>{order.isPaid ? `Yes (at ${order.paidAt ? new Date(order.paidAt).toLocaleString() : ''})` : 'No'}</span>
          </div>
          <div>
            <span>Delivered:</span>
            <span>{order.isDelivered ? `Yes (at ${order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : ''})` : 'No'}</span>
          </div>
        </div>
      </div>

      <div className="order-details__complaint">
        <h2 className="order-details__section-title">Complaint / Return / Refund</h2>
        {returnStatus && <p className="order-details__complaint-status">Status: <b>{returnStatus}</b></p>}
        {adminReply && <p className="order-details__complaint-admin-reply"><b>Admin Reply:</b> {adminReply}</p>}
        {successMsg && <p className="order-details__complaint-message order-details__complaint-message--success">{successMsg}</p>}
        {errorMsg && <p className="order-details__complaint-message order-details__complaint-message--error">{errorMsg}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Complaint (optional):
            <textarea value={complaint} onChange={e => setComplaint(e.target.value)} rows={2} placeholder="Describe your complaint..." />
          </label>
          <label>
            Return Reason:
            <select value={returnReason} onChange={e => setReturnReason(e.target.value)} required>
              <option value="">-- Select Reason --</option>
              <option value="Defective">Defective</option>
              <option value="Wrong item">Wrong item</option>
              <option value="Changed mind">Changed mind</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Return/Refund Description (optional):
            <textarea value={returnDescription} onChange={e => setReturnDescription(e.target.value)} rows={2} placeholder="Describe your return/refund request..." />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Complaint/Return/Refund'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderDetails;