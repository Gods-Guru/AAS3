import axios from 'axios';

const API_BASE = '/api';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// User profile
export const getUserProfile = async () => {
  const res = await axios.get(`${API_BASE}/users/profile`, getAuthConfig());
  return res.data;
};
export const updateUserProfile = async (data) => {
  const res = await axios.put(`${API_BASE}/users/profile`, data, getAuthConfig());
  return res.data;
};
export const getUserOrders = async () => {
  const res = await axios.get(`${API_BASE}/orders/myorders`, getAuthConfig());
  return res.data;
};
export const getUserWishlist = async () => {
  const res = await axios.get(`${API_BASE}/wishlist`, getAuthConfig());
  return res.data;
};
export const deleteUserAccount = async (userId) => {
  const res = await axios.delete(`${API_BASE}/users/${userId}`, getAuthConfig());
  return res.data;
};

// Admin profile
export const getAdminProfile = async (adminId) => {
  const res = await axios.get(`${API_BASE}/users/${adminId}`, getAuthConfig());
  return res.data;
};
export const getAllUsers = async () => {
  const res = await axios.get(`${API_BASE}/users`, getAuthConfig());
  return res.data;
};
export const getAdminAnalytics = async () => {
  const res = await axios.get(`${API_BASE}/admin/analytics`, getAuthConfig());
  return res.data;
};
export const getAdminOrders = async () => {
  const res = await axios.get(`${API_BASE}/orders/admin`, getAuthConfig());
  return res.data;
};
export const updateAdminProfile = async (adminId, data) => {
  const res = await axios.put(`${API_BASE}/users/${adminId}`, data, getAuthConfig());
  return res.data;
};
export const toggleBlockUser = async (userId) => {
  const res = await axios.put(`${API_BASE}/users/${userId}/block`, {}, getAuthConfig());
  return res.data;
};
