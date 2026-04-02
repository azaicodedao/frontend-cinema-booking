import React, { useState } from 'react';
import StarRating from '../../../../components/common/StarRating/StarRating';
import Button from '../../../../components/common/Button/Button';
import './ReviewForm.css';

const ReviewForm = ({ onSubmit, loading = false, existingReview = null }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [error, setError] = useState('');

  const isReadOnly = !!existingReview;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating before submitting.');
      return;
    }
    setError('');
    onSubmit({ rating, comment });
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form__title">
        {isReadOnly ? 'Your Review' : 'Write a Review'}
      </h3>
      {error && <div className="review-form__error">{error}</div>}
      <div className="review-form__rating">
        <span className="review-form__label">Rating:</span>
        <StarRating
          value={rating}
          onChange={isReadOnly ? undefined : setRating}
          readOnly={isReadOnly}
          size="large"
        />
      </div>
      <textarea
        className="review-form__textarea"
        placeholder="Share your thoughts about this movie... (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        readOnly={isReadOnly}
        rows={4}
      />
      {!isReadOnly && (
        <div className="review-form__footer">
          <span className="review-form__char-count">{comment.length}/500</span>
          <Button type="submit" loading={loading}>
            Submit Review
          </Button>
        </div>
      )}
    </form>
  );
};

export default ReviewForm;
