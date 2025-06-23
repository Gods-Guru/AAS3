import React, { useState } from 'react';
import '../styles/ReviewForm.scss';

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onReviewSubmit({ rating, comment });
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form__title">Write a Review</h3>
      
      <div className="star-rating">
        {[5,4,3,2,1].map((star) => (
          <React.Fragment key={star}>
            <input
              type="radio"
              id={`star${star}`}
              name="rating"
              value={star}
              checked={rating === star}
              onChange={() => setRating(star)}
            />
            <label htmlFor={`star${star}`} title={`${star} star${star > 1 ? 's' : ''}`}>
              ★
            </label>
          </React.Fragment>
        ))}
      </div>
      
      <label className="review-form__comment-label">
        Your Review:
        <textarea 
          className="review-form__textarea"
          value={comment} 
          onChange={e => setComment(e.target.value)} 
          required 
          rows={4}
        />
      </label>
      
      <button 
        type="submit" 
        className="review-form__submit"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
      
      {error && <div className="review-form__error">{error}</div>}
    </form>
  );
};

export default ReviewForm;