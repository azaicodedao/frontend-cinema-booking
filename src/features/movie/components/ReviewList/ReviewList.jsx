import React from 'react';
import StarRating from '../../../../components/common/StarRating/StarRating';
import './ReviewList.css';

/**
 * Component hiển thị danh sách các bài Đánh giá (Review) gồm Sao và Nội dung bình luận.
 * Nằm ngang bên dưới trang Chi Tiết Phim.
 *
 * @param {Object} props - Tham số.
 * @param {Array} props.reviews - Mảng các bình luận đã vượt qua kiểm duyệt tải về từ API.
 * @returns {JSX.Element} Danh sách review.
 */
const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return <p className="review-list__empty">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="review-list">
      <h3 className="review-list__title">Reviews ({reviews.length})</h3>
      {reviews.map((review) => (
        <div key={review.id} className="review-list__item">
          <div className="review-list__header">
            <div className="review-list__avatar">
              {review.userName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="review-list__user-info">
              <span className="review-list__username">{review.userName || 'Anonymous'}</span>
              <StarRating value={review.rating} readOnly size="small" />
            </div>
            <span className="review-list__date">
              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
            </span>
          </div>
          {review.comment && (
            <p className="review-list__comment">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
