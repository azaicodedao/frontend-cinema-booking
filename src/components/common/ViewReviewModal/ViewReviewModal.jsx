import React from 'react';
import './ViewReviewModal.css';

/**
 * Component Modal hộp thoại đặc biệt dùng riêng để "Xem trước" Đánh giá (Review)
 * Mở lên dưới dạng cửa sổ nổi khi người dùng ấn "Xem đánh giá".
 *
 * @param {Object} props - Thuộc tính truyền vào Modal.
 * @param {boolean} props.isOpen - Cờ bật/tắt hiển thị Modal.
 * @param {Function} props.onClose - Hàm gọi khi người dùng muốn đóng cửa sổ.
 * @param {Object} props.review - Đối tượng mang thông tin bài đánh giá.
 * @param {number} props.review.rating - Điểm số sao đánh giá (1-5).
 * @param {string} [props.review.comment] - Nội dung text người dùng đã viết.
 * @param {string} [props.review.createdAt] - Thời gian tạo bài đánh giá.
 * @returns {JSX.Element|null} Hộp thoại hiển thị thông tin bài review.
 */
const ViewReviewModal = ({ isOpen, onClose, review }) => {
    if (!isOpen || !review) return null;

    // Tạo một mảng gồm 5 phần tử (tương ứng 5 Ngôi sao) để dùng vòng lặp render
    const stars = Array(5).fill(0).map((_, index) => index + 1);

    return (
        <div className="vrm-overlay" onClick={onClose}>
            <div className="vrm-content" onClick={e => e.stopPropagation()}>
                <button className="vrm-close-btn" onClick={onClose}>&times;</button>
                <div className="vrm-title">Đánh giá của bạn</div>
                
                <div className="vrm-stars">
                    {stars.map((star) => (
                        <span key={star} className={`vrm-star ${star <= review.rating ? 'active' : ''}`}>
                            &#9733;
                        </span>
                    ))}
                </div>
                
                <div className="vrm-comment">
                    {review.comment ? (
                        <p>{review.comment}</p>
                    ) : (
                        <p className="vrm-no-comment">Không có nội dung đánh giá.</p>
                    )}
                </div>
                
                <div className="vrm-footer">
                    <span className="vrm-date">
                        {new Date(review.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ViewReviewModal;
