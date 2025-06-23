import React, { useState } from 'react';
import api from '../api';

const UserReviewsPage = () => {
  const [form, setForm] = useState({
    experience: 0,
    quality: 0,
    price: 0,
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStar = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/website-reviews', form);
      setMessage('Thank you for your feedback!');
      setForm({ experience: 0, quality: 0, price: 0, comment: '' });
    } catch (err) {
      setMessage('Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (name, value) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: 'pointer', color: star <= value ? '#f5b301' : '#ccc', fontSize: 24 }}
          onClick={() => handleStar(name, star)}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="user-reviews-page" style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', padding: 24, borderRadius: 8 }}>
      <h2>Share Your Experience</h2>
      {message && <div style={{ color: message.includes('Thank') ? 'green' : 'red', marginBottom: 12 }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <label>Website Experience:</label>
        {renderStars('experience', form.experience)}
        <label>Product Quality:</label>
        {renderStars('quality', form.quality)}
        <label>Product Prices:</label>
        {renderStars('price', form.price)}
        <label>Comments:</label>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          rows={4}
          style={{ width: '100%', marginBottom: 16 }}
          required
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1.5rem', background: '#232946', color: '#fff', border: 'none', borderRadius: 4 }}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default UserReviewsPage;
