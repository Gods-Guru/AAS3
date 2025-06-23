import axios from 'axios';

const API_BASE = '/api';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Products
export const fetchProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`, getAuthConfig());
  return Array.isArray(res.data) ? res.data : res.data.products || [];
};

export const addProduct = async (formData) => {
  const res = await axios.post(`${API_BASE}/products`, formData, {
    ...getAuthConfig(),
    headers: { ...getAuthConfig().headers, 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await axios.put(`${API_BASE}/products/${id}`, formData, {
    ...getAuthConfig(),
    headers: { ...getAuthConfig().headers, 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_BASE}/products/${id}`, getAuthConfig());
  return res.data;
};

export const toggleProductStatus = async (id, status) => {
  const res = await axios.patch(`${API_BASE}/products/${id}/status`, { status }, getAuthConfig());
  return res.data;
};

// Categories
export const fetchCategories = async () => {
  const res = await axios.get(`${API_BASE}/categories`, getAuthConfig());
  return Array.isArray(res.data) ? res.data : res.data.categories || [];
};

export const addCategory = async (name) => {
  const res = await axios.post(`${API_BASE}/categories`, { name }, getAuthConfig());
  return res.data;
};

export const updateCategory = async (id, name) => {
  const res = await axios.put(`${API_BASE}/categories/${id}`, { name }, getAuthConfig());
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${API_BASE}/categories/${id}`, getAuthConfig());
  return res.data;
};
