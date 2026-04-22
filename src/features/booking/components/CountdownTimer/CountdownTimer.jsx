import React from 'react';
import './CountdownTimer.css';

/**
 * Component hiển thị đồng hồ đếm ngược.
 * Dùng để giới hạn thời gian (ví dụ: thời gian giữ ghế trước khi thanh toán).
 *
 * @param {Object} props - Các tham số nhận vào để thay đổi hiển thị.
 * @param {string} props.formatted - Chuỗi thời gian đã được format sẵn (Ví dụ: "04:59").
 * @param {boolean} props.isExpired - Cờ cho biết thời gian đếm ngược đã kết thúc chưa.
 * @param {number} props.secondsLeft - Số giây còn lại (dùng để xác định lúc nào là "khẩn cấp" VD: < 60s).
 * @returns {JSX.Element} Hiển thị đồng hồ lên giao diện.
 */
const CountdownTimer = ({ formatted, isExpired, secondsLeft }) => {
  const isUrgent = secondsLeft < 60;

  return (
    <div className={`countdown ${isExpired ? 'countdown--expired' : ''} ${isUrgent ? 'countdown--urgent' : ''}`}>
      <div className="countdown__text">
        <span className="countdown__time">{isExpired ? '00:00' : formatted}</span>
        <span className="countdown__label">{isExpired ? 'Hết thời gian giữ chỗ' : 'Thời gian giữ chỗ'}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
