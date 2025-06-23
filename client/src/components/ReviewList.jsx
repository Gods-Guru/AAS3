import React from 'react';
import '../styles/ReviewList.scss';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return <p className="review-list__empty">No reviews yet.</p>;
  
  return (
    <div className="review-list">
      <h3 className="review-list__title">Reviews</h3>
      {reviews.map((review) => (
        <div key={review._id} className="review-list__item">
          <div>
            <span className="review-list__user">{review.user?.name || 'Anonymous'}</span>
            <span className="review-list__rating">
              {[...Array(review.rating)].map((_, i) => (
                <span key={i} role="img" aria-label="star">★</span>
              ))}
            </span>
          </div>
          <p className="review-list__comment">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;