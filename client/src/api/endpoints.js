import api from './index';

// Orders
export const fetchOrders = (isAdmin = false) =>
  api.get(isAdmin ? '/orders/admin' : '/orders/myorders');

export const fetchOrderById = id => api.get(`/orders/${id}`);
export const markOrderPaid = (id, paymentResult) =>
  api.patch(`/orders/${id}/pay`, { paymentResult });
export const markOrderDelivered = id =>
  api.patch(`/orders/${id}/deliver`);
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status });

// Products
export const fetchProducts = () => api.get('/products');
export const fetchProductById = id => api.get(`/products/${id}`);

// Cart
export const fetchCart = () => api.get('/cart');
export const addToCart = (productId, qty) => api.post('/cart', { productId, qty });
export const updateCart = (productId, qty) => api.put('/cart', { productId, qty });
export const removeFromCart = productId => api.delete(`/cart/${productId}`);

// User
export const fetchUserProfile = () => api.get('/users/profile');
export const updateUserProfile = data => api.put('/users/profile', data);

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.post('/auth/reset-password', { token, password });
