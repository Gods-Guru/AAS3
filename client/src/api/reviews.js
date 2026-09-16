// src/api/reviews.js
// Use window.env or fallback to localhost for browser compatibility
const API_URL = (window?.env?.REACT_APP_BACKEND_URL) || 'http://localhost:5002/api';

export async function fetchReviews(productId) {
  const res = await fetch(`${API_URL}/reviews/${productId}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function addReview(productId, review, token) {
  const res = await fetch(`${API_URL}/reviews/${productId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error('Failed to add review');
  return res.json();
}

export async function deleteReview(reviewId, token) {
  const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete review');
  return res.json();
}
