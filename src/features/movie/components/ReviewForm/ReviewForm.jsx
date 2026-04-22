import React, { useState } from 'react';
import StarRating from '../../../../components/common/StarRating/StarRating';
import Button from '../../../../components/common/Button/Button';
import './ReviewForm.css';

/**
 * Component biểu diễn form đánh giá phim.
 * Chức năng thay đổi giao diện theo chế độ đọc (khi đã có đánh giá) hoặc chỉnh sửa (khi viết đánh giá mới).
 * 
 * @param {Object} props - Các thuộc tính truyền vào component.
 * @param {Function} props.onSubmit - Hàm được gọi khi chuẩn bị nộp dữ liệu đánh giá.
 * @param {boolean} [props.loading=false] - Trạng thái nút submit đang tải.
 * @param {Object} [props.existingReview=null] - Dữ liệu đánh giá hiện tại dùng để hiển thị dạng read-only.
 * @returns {JSX.Element} Form đánh giá.
 */
const ReviewForm = ({ onSubmit, loading = false, existingReview = null }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [error, setError] = useState('');

  const isReadOnly = !!existingReview;

  /**
   * Xử lý validate và gửi biểu mẫu đánh giá.
   * 
   * @param {React.FormEvent} e - Sự kiện form submit.
   */
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
