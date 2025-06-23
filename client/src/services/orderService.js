import axios from 'axios';

const API_URL = '/api/orders';

// Helper to get auth config
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

// Create new order
const createOrder = async (orderData) => {
  try {
    const response = await axios.post(API_URL, orderData, getAuthConfig());
    return response.data.order;
  } catch (error) {
    console.error('Order creation error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to create order'
    );
  }
};

// Get order by ID
const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}/${orderId}`, getAuthConfig());
  return response.data;
};

// Get logged in user orders
const getOrdersByUser = async () => {
  const response = await axios.get(`${API_URL}/myorders`, getAuthConfig());
  return response.data;
};

// Update order to paid
const updateOrderToPaid = async (orderId, paymentResult) => {
  const response = await axios.patch(`${API_URL}/${orderId}/pay`, { paymentResult }, getAuthConfig());
  return response.data;
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  const response = await axios.patch(`${API_URL}/${orderId}/status`, { status }, getAuthConfig());
  return response.data;
};

// Get order status
const getOrderStatus = async (orderId) => {
  const response = await axios.get(`${API_URL}/${orderId}/status`, getAuthConfig());
  return response.data;
};

const orderService = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderToPaid,
  updateOrderStatus,
  getOrderStatus
};

export default orderService;