import React from 'react';
import './Spinner.css';

/**
 * Component biểu thị vòng xoay đang tải dữ liệu (Loading Spinner).
 *
 * @param {Object} props - Tham số định dạng.
 * @param {string} [props.size='medium'] - Kích thước vòng xoay (small, medium, large).
 * @param {string} [props.className=''] - Tiền tố class CSS tùy chỉnh nếu cần.
 * @returns {JSX.Element} Hình vòng tròn xoay infinite (loading).
 */
const Spinner = ({ size = 'medium', className = '' }) => {
  return (
    <div className={`spinner spinner--${size} ${className}`}>
      <div className="spinner__circle" />
    </div>
  );
};

export default Spinner;
