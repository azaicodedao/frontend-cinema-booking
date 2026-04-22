import React, { useEffect, useState } from 'react';
import './Toast.css';

/**
 * Component Hộp thoại thông báo nhanh (Toast).
 * Tự động tắt sau một khoảng thời gian nhất định.
 *
 * @param {Object} props - Thuộc tính truyền vào.
 * @param {string} props.message - Lời nhắn thông báo.
 * @param {string} [props.type='success'] - Phân loại màu sắc/icon (success, error, warning, info).
 * @param {number} [props.duration=3000] - Chờ sau bao nhiêu mili-giây thì tự động tắt.
 * @param {Function} props.onClose - Hàm thực thi để báo cho thẻ cha tháo xoá Toast khỏi danh sách.
 * @returns {JSX.Element} Khối Toast Alert.
 */
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }[type];

  return (
    <div className={`toast toast--${type} ${isVisible ? 'toast--enter' : 'toast--exit'}`}>
      <span className="toast__icon">{icon}</span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

/**
 * Component Khung chứa nhiều Toast (Toast Container).
 * Sắp xếp các dòng chữ Toast gọn gàng dọc mép màn hình.
 * 
 * @param {Object} props - Danh sách truyền vào.
 * @param {Array} props.toasts - Mảng chứa các thiết lập của những toast muốn hiển thị.
 * @param {Function} props.removeToast - Hàm để gọi xoá Toast.
 * @returns {JSX.Element} Vùng chứa Toasts.
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
