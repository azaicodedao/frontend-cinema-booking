import React from 'react';
import './StarRating.css';

/**
 * Component hiển thị danh sách Ngôi sao để đánh giá (1 đến 5 sao).
 * Hỗ trợ ở cả chế độ chọn (click) và chế độ chỉ xem (readonly).
 *
 * @param {Object} props - Tham số định cấu hình component.
 * @param {number} [props.value=0] - Điểm số sao đang có hiện tại (Ví dụ: 3 sao).
 * @param {Function} props.onChange - Hàm gọi lại (callback) khi người dùng bấm chọn một mức sao mới.
 * @param {number} [props.max=5] - Tổng số lượng sao hiển thị (thường là 5).
 * @param {boolean} [props.readOnly=false] - Cờ thiết lập chế độ chỉ xem (không cho click đổi điểm).
 * @param {string} [props.size='medium'] - Kích thước của danh sách sao (small, medium, large).
 * @returns {JSX.Element} Dải ngôi sao đánh giá.
 */
const StarRating = ({
  value = 0,
  onChange,
  max = 5,
  readOnly = false,
  size = 'medium',
}) => {
  /**
   * Xử lý hành vi khi nhấn vào một ngôi sao.
   * Chỉ kích hoạt đổi giá trị nếu không ở chế độ readOnly.
   * 
   * @param {number} rating - Mức sao mà người dùng vừa chọn.
   */
  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={`star-rating star-rating--${size} ${readOnly ? 'star-rating--readonly' : ''}`}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={starValue}
            className={`star-rating__star ${starValue <= value ? 'star-rating__star--filled' : ''}`}
            onClick={() => handleClick(starValue)}
            role={readOnly ? 'img' : 'button'}
            tabIndex={readOnly ? undefined : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick(starValue);
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
