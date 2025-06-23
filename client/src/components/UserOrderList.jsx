import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../api/endpoints';
import OrderCard from './OrderCard';

const UserOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchOrders(false)
      .then(res => setOrders(res.data || res))
      .catch(() => setError('Failed to fetch your orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      {orders.length === 0 && !loading ? (
        <div>No orders found.</div>
      ) : (
        orders.map(order => (
          <OrderCard key={order._id} order={order} />
        ))
      )}
    </div>
  );
};

export default UserOrderList;
