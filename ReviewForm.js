import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function ReviewForm({ onSubmit, onCancel }) {
  const [review, setReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    visit_date: new Date(),
    images: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('rating', review.rating);
    formData.append('title', review.title);
    formData.append('comment', review.comment);
    formData.append('visit_date', review.visit_date.toISOString().split('T')[0]);
    
    review.images.forEach(image => {
      formData.append('images', image);
    });

    onSubmit(formData);
  };

  const handleImageChange = (e) => {
    setReview({
      ...review,
      images: [...review.images, ...e.target.files]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label>Rating:</label>
        <div className="rating-input">
          {[5, 4, 3, 2, 1].map(num => (
            <label key={num}>
              <input
                type="radio"
                name="rating"
                value={num}
                checked={review.rating === num}
                onChange={(e) => setReview({...review, rating: parseInt(e.target.value)})}
              />
              {num}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          value={review.title}
          onChange={(e) => setReview({...review, title: e.target.value})}
          required
          maxLength="200"
          placeholder="Summarize your experience"
        />
      </div>

      <div className="form-group">
        <label>Comment:</label>
        <textarea
          value={review.comment}
          onChange={(e) => setReview({...review, comment: e.target.value})}
          required
          rows="4"
          placeholder="Share the details of your experience"
        />
      </div>

      <div className="form-group">
        <label>Visit Date:</label>
        <DatePicker
          selected={review.visit_date}
          onChange={(date) => setReview({...review, visit_date: date})}
          maxDate={new Date()}
          required
        />
      </div>

      <div className="form-group">
        <label>Photos:</label>
        <input
          type="file"
          onChange={handleImageChange}
          multiple
          accept="image/*"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Submit Review
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;