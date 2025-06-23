import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchOrders } from '../../api/endpoints';
import OrderCard from './OrderCard';
import '../../styles/adminstyle/OrdersPage.scss';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchAllOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOrders(true);
      setOrders(res.data || res);
      setSuccess('Orders loaded successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to fetch orders. Please try again.');
      setOrders([]); // Reset to empty array on error
      setTimeout(() => setError(null), 3000);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredOrders = Array.isArray(orders) ? orders.filter((order) => {
    const nameMatch = order.user?.name ? order.user.name.toLowerCase().includes(query.toLowerCase()) : false;
    const emailMatch = order.user?.email ? order.user.email.toLowerCase().includes(query.toLowerCase()) : false;
    const statusMatch = statusFilter ? order.status === statusFilter : true;
    return (query ? (nameMatch || emailMatch) : true) && statusMatch;
  }) : [];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAllOrders();
      setSuccess('Order status updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Order status update error:', error, error?.response?.data);
      setError('Failed to update order status');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Order Management</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="filters-container">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button 
          onClick={fetchAllOrders} 
          disabled={loading}
          className="refresh-btn"
        >
          {loading ? (
            <>
              <span className="spinner"></span> Loading...
            </>
          ) : (
            'Refresh Orders'
          )}
        </button>
      </div>

      <div className="orders-grid">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found matching your criteria</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusChange={handleStatusChange}
              isAdmin
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrderList;