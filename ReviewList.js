import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';

function ReviewList({ destinationId }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [destinationId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/?destination=${destinationId}`);
      setReviews(response.data.results);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await axios.post('/api/reviews/', {
        ...reviewData,
        destination: destinationId
      });
      fetchReviews();
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="reviews-list">
      <div className="reviews-header">
        <h4>{reviews.length} Reviews</h4>
        <button onClick={() => setShowForm(true)} className="btn-secondary">
          Write a Review
        </button>
      </div>

      {showForm && (
        <ReviewForm
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {reviews.map(review => (
        <div key={review.id} className="review-card">
          <div className="review-header">
            <span className="reviewer-name">{review.user_name}</span>
            <span className="review-rating">{review.rating}/5</span>
            <span className="review-date">
              {new Date(review.visit_date).toLocaleDateString()}
            </span>
          </div>
          <h4 className="review-title">{review.title}</h4>
          <p className="review-comment">{review.comment}</p>
          {review.images.length > 0 && (
            <div className="review-images">
              {review.images.map(image => (
                <img key={image.id} src={image.image} alt="Review" />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReviewList;