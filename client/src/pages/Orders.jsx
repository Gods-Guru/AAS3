import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/MyOrders.scss';

const ITEMS_PER_PAGE = 8;

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get('/api/orders/myorders', config);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <>
          <div className="orders-list">
            {paginatedOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div>
                  <strong>Order ID:</strong> {order._id}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Total:</strong> ${order.totalPrice?.toFixed(2)}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div>
                  <strong>Paid:</strong>{' '}
                  {order.isPaid ? (
                    <span className="paid">✔</span>
                  ) : (
                    <span className="not-paid">❌</span>
                  )}
                </div>
                <div>
                  <strong>Delivered:</strong>{' '}
                  {order.isDelivered ? (
                    <span className="delivered">✔</span>
                  ) : (
                    <span className="not-delivered">❌</span>
                  )}
                </div>
                <Link to={`/orders/${order._id}`} className="details-btn">
                  View Details
                </Link>
              </div>
            ))}
          </div>
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

export default MyOrders;