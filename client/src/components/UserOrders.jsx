import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../styles/UserOrders.scss';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 6;
  const [hiddenOrders, setHiddenOrders] = useState(() => {
    // Persist hidden orders in localStorage
    const saved = localStorage.getItem('hiddenOrders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await orderService.getOrdersByUser();
        console.log('Fetched ordersData:', ordersData); // Debug log
        // If response is { orders: [...] }, use ordersData.orders; else use ordersData
        const ordersArray = Array.isArray(ordersData)
          ? ordersData
          : Array.isArray(ordersData.orders)
            ? ordersData.orders
            : [];
        setOrders(ordersArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shipped':
        return <FaShippingFast />;
      case 'Delivered':
        return <FaCheckCircle />;
      case 'Cancelled':
        return <FaTimesCircle />;
      default:
        return <FaBox />;
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

  // Hide delivered order
  const handleHideOrder = (orderId) => {
    const updated = [...hiddenOrders, orderId];
    setHiddenOrders(updated);
    localStorage.setItem('hiddenOrders', JSON.stringify(updated));
  };

  // Show all hidden orders
  const handleShowHidden = () => {
    setHiddenOrders([]);
    localStorage.removeItem('hiddenOrders');
  };

  // Pagination logic
  const visibleOrders = filteredOrders.filter(order => !hiddenOrders.includes(order._id));
  const totalPages = Math.ceil(visibleOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = visibleOrders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

  if (loading) return <div className="loading">Loading your orders...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="user-orders-container">
      <h2>My Orders</h2>
      
      <div className="order-filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'shipped' ? 'active' : ''}
          onClick={() => setFilter('shipped')}
        >
          Shipped
        </button>
        <button 
          className={filter === 'delivered' ? 'active' : ''}
          onClick={() => setFilter('delivered')}
        >
          Delivered
        </button>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
          <Link to="/catalogue" className="shop-link">Continue Shopping</Link>
        </div>
      ) : (
        <>
        <div className="orders-list">
          {paginatedOrders.map(order => (
            <div key={order._id} className="order-card">
              <Link to={`/orders/${order._id}`} className="order-link">
                <div className="order-header">
                  <div className="order-meta">
                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`order-status ${order.status.toLowerCase()}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                </div>
                <div className="order-items-preview">
                  {order.orderItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="preview-item">
                      {/* <img src={item.image || '/default-product.png'} alt={item.name} /> */}
                      {index === 2 && order.orderItems.length > 3 && (
                        <div className="more-items">+{order.orderItems.length - 3} more</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div className="item-count">
                    {order.orderItems.reduce((sum, item) => sum + item.qty, 0)} items
                  </div>
                  <div className="order-total">
                    ${order.total.toLocaleString()}
                  </div>
                </div>
              </Link>
              {order.status.toLowerCase() === 'delivered' && !hiddenOrders.includes(order._id) && (
                <button className="hide-btn" onClick={() => handleHideOrder(order._id)}>
                  Hide
                </button>
              )}
            </div>
          ))}
        </div>
        {hiddenOrders.length > 0 && (
          <div className="show-hidden-orders">
            <button onClick={handleShowHidden}>Show Hidden Delivered Orders</button>
          </div>
        )}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
        </>
      )}
    </div>
  );
};

export default UserOrders;