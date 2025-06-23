import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmDelete from './ConfirmDelete';

const AdminProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    axios.get(`/api/reviews/${productId}`)
      .then(res => setReviews(res.data))
      .catch(err => setError(err.response?.data?.message || 'Error fetching reviews'))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleDelete = (id) => {
    axios.delete(`/api/reviews/${id}`)
      .then(() => setReviews(reviews.filter(r => r._id !== id)))
      .catch(err => alert(err.response?.data?.message || 'Delete failed'));
    setDeleteId(null);
  };

  if (!productId) return <div>Select a product to view reviews.</div>;
  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h2>Product Reviews</h2>
      {reviews.length === 0 ? <p>No reviews for this product.</p> : (
        <ul style={{listStyle:'none',padding:0}}>
          {reviews.map(r => (
            <li key={r._id} style={{border:'1px solid #ccc',margin:'8px 0',padding:'8px',borderRadius:4}}>
              <div><b>User:</b> {r.user?.name || 'Unknown'}</div>
              <div><b>Rating:</b> {r.rating}</div>
              <div><b>Comment:</b> {r.comment}</div>
              <button style={{color:'red'}} onClick={() => setDeleteId(r._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      {deleteId && (
        <ConfirmDelete 
          onConfirm={() => handleDelete(deleteId)} 
          onCancel={() => setDeleteId(null)} 
          message="Are you sure you want to delete this review?" 
        />
      )}
    </div>
  );
};

export default AdminProductReviews;
