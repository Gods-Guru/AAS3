import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Manual favourites (correct path: '/favourites')
export const fetchFavourites = () => API.get('/favourites');
export const addToFavourites = (productId) => {
  const token = localStorage.getItem('token');
  return API.post(
    '/favourites',
    { productId },
    token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined
  );
};
export const removeFromFavourites = (productId) => {
  const token = localStorage.getItem('token');
  return API.delete(
    `/favourites/${productId}`,
    token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined
  );
};

// Auto-tracked views (correct path: '/views')
export const fetchMostViewed = () => {
  const token = localStorage.getItem('token');
  return API.get(
    '/views',
    token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined
  );
};

// Make sure your frontend is NOT calling /favourites/favourites or /favourites/views.
// Use /favourites and /views as shown above.