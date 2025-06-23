import axios from 'axios';

const API_URL = '/api/orders';

const handleResponse = (response) => {
  // Ensure we always return an array for orders
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data.orders && Array.isArray(response.data.orders)) {
    return response.data.orders;
  }
  return []; // Fallback to empty array
};

export const getAllOrders = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/admin`, {
      params: filters,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return []; // Return empty array on error
  }
};

export const getOrdersByUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/myorders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

// User endpoints
// export const getOrdersByUser = () => makeRequest('get', '/myorders');
export const getOrderById = (id) => makeRequest('get', `/${id}`);
export const createOrder = (orderData) => makeRequest('post', '/', orderData);

// Admin endpoints
// export const getAllOrders = (filters) => makeRequest('get', '/admin', null, filters);
export const updateOrderStatus = (id, status) => makeRequest('patch', `/${id}/status`, { status });
export const updateOrderToPaid = (id, paymentResult) => makeRequest('patch', `/${id}/pay`, { paymentResult });
export const updateOrderToDelivered = (id) => makeRequest('patch', `/${id}/deliver`);
export const getOrderStatus = (id) => makeRequest('get', `/${id}/status`);