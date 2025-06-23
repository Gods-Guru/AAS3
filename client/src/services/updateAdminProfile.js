import axios from 'axios';

const API_BASE = '/api';
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const updateAdminProfile = async (adminId, data) => {
  const res = await axios.put(`${API_BASE}/users/${adminId}`, data, getAuthConfig());
  return res.data;
};
