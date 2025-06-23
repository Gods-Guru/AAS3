import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import '../styles/ReturnRequestForm.scss';

const ReturnRequestForm = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const selectedOrder = orders.find((order) => order._id === selectedOrderId);
    setItems(selectedOrder?.orderItems || []);
    setSelectedItemId('');
  }, [selectedOrderId, orders]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderId || !selectedItemId || !reason) return;

    setSubmitting(true);
    try {
      await axios.post(
        `${API_BASE_URL}/returns`,
        {
          orderId: selectedOrderId,
          itemId: [{product: selectedItemId, qty: 3}],
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccess(true);
      setSelectedOrderId('');
      setSelectedItemId('');
      setReason('');
    } catch (err) {
      console.error('Failed to submit return:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="return-form">
      <h3>Submit a Return Request</h3>
      {success && <p className="success">Return request sent successfully!</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Choose Order:
          <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)} required>
            <option value="">-- Select Order --</option>
            {orders.map((order) => (
              <option key={order._id} value={order._id}>
                Order #{order._id.slice(-6)} – {new Date(order.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </label>

        {items.length > 0 && (
          <>
            <label>
              Choose Item:
              <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} required>
                <option value="">-- Select Item --</option>
                {items.map((item) => (
                  <option key={item.product} value={item.product}>
                    {item.name} (x{item.qty})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Reason for Return:
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
            </label>

            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ReturnRequestForm;